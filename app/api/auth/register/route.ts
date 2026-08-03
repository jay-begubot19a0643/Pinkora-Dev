import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getMailTransport, sendAccountEmail } from '@/lib/mailer';
import { validatePassword } from '@/lib/password';
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { requireSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

function tokenHash(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function applicationUrl(request: NextRequest) {
  return (process.env.APP_URL ?? request.nextUrl.origin).replace(/\/$/, '');
}

export async function POST(request: NextRequest) {
  try {
    const limit = checkRateLimit(request, 'register', { limit: 5, windowMs: 60 * 60 * 1_000 });
    if (!limit.allowed) return NextResponse.json({ success: false, message: 'Too many registration attempts. Please try again later.' }, { status: 429, headers: rateLimitHeaders(limit) });

    const { name, email, password, privacyAccepted } = await request.json();
    if (!name || !email || !password) return NextResponse.json({ success: false, message: 'Please provide name, email, and password.' }, { status: 400 });
    if (privacyAccepted !== true) return NextResponse.json({ success: false, message: 'Data Privacy Notice consent is required to create an account.' }, { status: 400 });
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) return NextResponse.json({ success: false, message: 'Name must be between 2 and 80 characters.' }, { status: 400 });
    if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254) return NextResponse.json({ success: false, message: 'Please provide a valid email address.' }, { status: 400 });
    const passwordError = validatePassword(password);
    if (passwordError) return NextResponse.json({ success: false, message: passwordError }, { status: 400 });
    if (!getMailTransport()) return NextResponse.json({ success: false, message: 'Account verification email is not configured yet. Please try again later.' }, { status: 503 });

    const db = requireSupabase();
    const normalizedEmail = email.toLowerCase().trim();
    const { data: existingUser } = await db.from('users').select('id').eq('email', normalizedEmail).maybeSingle();
    if (existingUser) return NextResponse.json({ success: false, message: 'An account with that email already exists. Sign in or reset your password.' }, { status: 409 });

    const verificationToken = randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(password, 12);
    const { data: user, error } = await db.from('users').insert([{
      name: name.trim(),
      email: normalizedEmail,
      password: passwordHash,
      account_status: 'active',
      email_verified_at: null,
      email_verification_token_hash: tokenHash(verificationToken),
    }]).select('id, name, email').single();
    if (error) throw error;

    try {
      const verifyUrl = `${applicationUrl(request)}/my-account?verify=${encodeURIComponent(verificationToken)}`;
      await sendAccountEmail({
        to: normalizedEmail,
        subject: 'Verify your JVerse email address',
        text: `Welcome to JVerse, ${user.name}.\n\nVerify your email address by opening this link:\n${verifyUrl}\n\nThis link can be used once. If you did not create this account, you can ignore this email.`,
      });
    } catch (mailError) {
      await db.from('users').delete().eq('id', user.id);
      throw mailError;
    }

    return NextResponse.json({ success: true, message: 'Account created. Check your email to verify your address before signing in.' }, { status: 201, headers: rateLimitHeaders(limit) });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'Registration failed. Please try again later.' }, { status: 500 });
  }
}
