import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import { requireSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) return NextResponse.json({ success: false, message: 'Please provide name, email, and password.' }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ success: false, message: 'Password must be at least 6 characters.' }, { status: 400 });
    const db = requireSupabase();
    const normalizedEmail = email.toLowerCase();
    const { data: existingUser } = await db.from('users').select('id').eq('email', normalizedEmail).maybeSingle();
    if (existingUser) return NextResponse.json({ success: false, message: 'Email already registered.' }, { status: 409 });
    const passwordHash = await bcrypt.hash(password, 10);
    const { data: user, error } = await db.from('users').insert([{ name: name.trim(), email: normalizedEmail, password: passwordHash, account_status: 'active' }]).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'User registered successfully.', data: { id: user.id, name: user.name, email: user.email, token: createToken(user.id) } }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'Registration failed.' }, { status: 500 });
  }
}
