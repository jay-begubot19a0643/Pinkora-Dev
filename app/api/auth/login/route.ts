import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import { requireSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = requireSupabase();

    if (body.provider === 'google') {
      const accessToken = typeof body.accessToken === 'string' ? body.accessToken : '';
      if (!accessToken) {
        return NextResponse.json({ success: false, message: 'Google authentication token is missing.' }, { status: 400 });
      }

      const { data: authData, error: authError } = await db.auth.getUser(accessToken);
      const googleUser = authData.user;
      if (authError || !googleUser?.email) {
        return NextResponse.json({ success: false, message: 'Unable to verify your Google account.' }, { status: 401 });
      }

      const normalizedEmail = googleUser.email.toLowerCase();
      const { data: existingUser, error: findError } = await db
        .from('users')
        .select('*')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (findError) throw findError;

      let user = existingUser;
      if (!user) {
        const displayName = String(
          googleUser.user_metadata.full_name
          ?? googleUser.user_metadata.name
          ?? normalizedEmail.split('@')[0],
        ).trim();
        const passwordHash = await bcrypt.hash(randomUUID(), 10);
        const { data: createdUser, error: createError } = await db
          .from('users')
          .insert([{
            name: displayName,
            email: normalizedEmail,
            password: passwordHash,
            account_status: 'active',
          }])
          .select()
          .single();

        if (createError) throw createError;
        user = createdUser;
      }

      await db.from('users').update({ last_login: new Date().toISOString() }).eq('id', user.id);

      return NextResponse.json({
        success: true,
        message: 'Google sign-in successful.',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          token: createToken(user.id),
          provider: 'google',
        },
      });
    }

    const { email, password } = body;
    if (!email || !password) return NextResponse.json({ success: false, message: 'Please provide email and password.' }, { status: 400 });
    const { data: user, error } = await db.from('users').select('*').eq('email', email.toLowerCase()).maybeSingle();
    if (error || !user || !(await bcrypt.compare(password, user.password))) return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });
    await db.from('users').update({ last_login: new Date().toISOString() }).eq('id', user.id);
    return NextResponse.json({ success: true, message: 'Login successful.', data: { id: user.id, name: user.name, email: user.email, token: createToken(user.id) } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Login failed.' }, { status: 500 });
  }
}
