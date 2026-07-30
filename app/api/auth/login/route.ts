import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import { requireSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ success: false, message: 'Please provide email and password.' }, { status: 400 });
    const db = requireSupabase();
    const { data: user, error } = await db.from('users').select('*').eq('email', email.toLowerCase()).maybeSingle();
    if (error || !user || !(await bcrypt.compare(password, user.password))) return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });
    await db.from('users').update({ last_login: new Date().toISOString() }).eq('id', user.id);
    return NextResponse.json({ success: true, message: 'Login successful.', data: { id: user.id, name: user.name, email: user.email, token: createToken(user.id) } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Login failed.' }, { status: 500 });
  }
}
