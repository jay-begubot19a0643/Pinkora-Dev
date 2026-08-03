import bcrypt from 'bcryptjs';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createToken, setSessionCookie } from '@/lib/auth';
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

function successWithSession(user: { id: string; name: string; email: string }, message: string, headers?: Record<string, string>) {
  const response = NextResponse.json({ success: true, message, data: { id: user.id, name: user.name, email: user.email } }, { headers });
  setSessionCookie(response, createToken(user.id));
  return response;
}

async function sendVerificationEmail(request: NextRequest, email: string) {
  if (!getMailTransport()) throw new Error('Account email delivery is not configured.');
  const db = requireSupabase();
  const { data: user, error } = await db.from('users').select('id, name, email, email_verified_at').eq('email', email).maybeSingle();
  if (error) throw error;
  if (!user || user.email_verified_at) return;

  const token = randomBytes(32).toString('hex');
  const { error: updateError } = await db.from('users').update({ email_verification_token_hash: tokenHash(token) }).eq('id', user.id);
  if (updateError) throw updateError;
  const verifyUrl = `${applicationUrl(request)}/my-account?verify=${encodeURIComponent(token)}`;
  await sendAccountEmail({
    to: user.email,
    subject: 'Verify your JVerse email address',
    text: `Hello ${user.name},\n\nVerify your JVerse email address by opening this link:\n${verifyUrl}\n\nIf you did not request this, you can ignore this email.`,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = typeof body.action === 'string' ? body.action : '';

    if (action === 'verify-email') {
      const limit = checkRateLimit(request, 'verify-email', { limit: 12, windowMs: 60 * 60 * 1_000 });
      if (!limit.allowed) return NextResponse.json({ success: false, message: 'Too many verification attempts. Please try again later.' }, { status: 429, headers: rateLimitHeaders(limit) });
      const token = typeof body.token === 'string' ? body.token : '';
      if (!/^[a-f0-9]{64}$/i.test(token)) return NextResponse.json({ success: false, message: 'This verification link is invalid or expired.' }, { status: 400 });
      const db = requireSupabase();
      const { data: user, error } = await db.from('users')
        .update({ email_verified_at: new Date().toISOString(), email_verification_token_hash: null, last_login: new Date().toISOString() })
        .eq('email_verification_token_hash', tokenHash(token))
        .select('id, name, email')
        .maybeSingle();
      if (error) throw error;
      if (!user) return NextResponse.json({ success: false, message: 'This verification link is invalid, expired, or has already been used.' }, { status: 400 });
      return successWithSession(user, 'Your email has been verified. Welcome to JVerse.', rateLimitHeaders(limit));
    }

    if (action === 'request-password-reset') {
      const email = typeof body.email === 'string' ? body.email.toLowerCase().trim() : '';
      const limit = checkRateLimit(request, 'password-reset-request', { limit: 5, windowMs: 60 * 60 * 1_000 }, email || null);
      if (!limit.allowed) return NextResponse.json({ success: false, message: 'Too many reset requests. Please try again later.' }, { status: 429, headers: rateLimitHeaders(limit) });
      if (email && /^\S+@\S+\.\S+$/.test(email) && getMailTransport()) {
        const db = requireSupabase();
        const { data: user, error } = await db.from('users').select('id, name, email, email_verified_at').eq('email', email).maybeSingle();
        if (error) throw error;
        if (user?.email_verified_at) {
          const token = randomBytes(32).toString('hex');
          const expiresAt = new Date(Date.now() + 60 * 60 * 1_000).toISOString();
          const { error: updateError } = await db.from('users').update({ password_reset_token_hash: tokenHash(token), password_reset_expires_at: expiresAt }).eq('id', user.id);
          if (updateError) throw updateError;
          const resetUrl = `${applicationUrl(request)}/my-account?reset=${encodeURIComponent(token)}`;
          await sendAccountEmail({
            to: user.email,
            subject: 'Reset your JVerse password',
            text: `Hello ${user.name},\n\nReset your JVerse password by opening this link:\n${resetUrl}\n\nThis link expires in one hour. If you did not request a reset, you can ignore this email.`,
          });
        }
      }
      return NextResponse.json({ success: true, message: 'If an account exists for that address, a password-reset link has been sent.' }, { headers: rateLimitHeaders(limit) });
    }

    if (action === 'reset-password') {
      const limit = checkRateLimit(request, 'password-reset-complete', { limit: 10, windowMs: 60 * 60 * 1_000 });
      if (!limit.allowed) return NextResponse.json({ success: false, message: 'Too many reset attempts. Please try again later.' }, { status: 429, headers: rateLimitHeaders(limit) });
      const token = typeof body.token === 'string' ? body.token : '';
      const passwordError = validatePassword(body.password);
      if (!/^[a-f0-9]{64}$/i.test(token) || passwordError) return NextResponse.json({ success: false, message: passwordError ?? 'This password-reset link is invalid or expired.' }, { status: 400 });
      const db = requireSupabase();
      const { data: user, error } = await db.from('users')
        .update({ password: await bcrypt.hash(body.password, 12), password_reset_token_hash: null, password_reset_expires_at: null, last_login: new Date().toISOString() })
        .eq('password_reset_token_hash', tokenHash(token))
        .gt('password_reset_expires_at', new Date().toISOString())
        .select('id, name, email')
        .maybeSingle();
      if (error) throw error;
      if (!user) return NextResponse.json({ success: false, message: 'This password-reset link is invalid, expired, or has already been used.' }, { status: 400 });
      return successWithSession(user, 'Your password has been reset and you are now signed in.', rateLimitHeaders(limit));
    }

    if (action === 'resend-verification') {
      const email = typeof body.email === 'string' ? body.email.toLowerCase().trim() : '';
      const limit = checkRateLimit(request, 'resend-verification', { limit: 5, windowMs: 60 * 60 * 1_000 }, email || null);
      if (!limit.allowed) return NextResponse.json({ success: false, message: 'Too many resend requests. Please try again later.' }, { status: 429, headers: rateLimitHeaders(limit) });
      if (email && /^\S+@\S+\.\S+$/.test(email) && getMailTransport()) await sendVerificationEmail(request, email);
      return NextResponse.json({ success: true, message: 'If the account needs verification, a new verification link has been sent.' }, { headers: rateLimitHeaders(limit) });
    }

    const loginLimit = checkRateLimit(request, 'login', { limit: 10, windowMs: 15 * 60 * 1_000 });
    if (!loginLimit.allowed) return NextResponse.json({ success: false, message: 'Too many sign-in attempts. Please try again later.' }, { status: 429, headers: rateLimitHeaders(loginLimit) });
    const db = requireSupabase();

    if (body.privacyAccepted !== true) return NextResponse.json({ success: false, message: 'Data Privacy Notice consent is required to sign in.' }, { status: 400 });

    if (body.provider === 'google') {
      const accessToken = typeof body.accessToken === 'string' ? body.accessToken : '';
      if (!accessToken) return NextResponse.json({ success: false, message: 'Google authentication token is missing.' }, { status: 400 });
      const { data: authData, error: authError } = await db.auth.getUser(accessToken);
      const googleUser = authData.user;
      if (authError || !googleUser?.email) return NextResponse.json({ success: false, message: 'Unable to verify your Google account.' }, { status: 401 });

      const normalizedEmail = googleUser.email.toLowerCase();
      const { data: existingUser, error: findError } = await db.from('users').select('*').eq('email', normalizedEmail).maybeSingle();
      if (findError) throw findError;
      let user = existingUser;
      if (!user) {
        const displayName = String(googleUser.user_metadata.full_name ?? googleUser.user_metadata.name ?? normalizedEmail.split('@')[0]).trim();
        const { data: createdUser, error: createError } = await db.from('users').insert([{
          name: displayName,
          email: normalizedEmail,
          password: await bcrypt.hash(randomUUID(), 12),
          account_status: 'active',
          email_verified_at: new Date().toISOString(),
        }]).select().single();
        if (createError) throw createError;
        user = createdUser;
      }
      if (user.account_status !== 'active') return NextResponse.json({ success: false, message: 'This account is not active.' }, { status: 403 });
      await db.from('users').update({ last_login: new Date().toISOString(), email_verified_at: user.email_verified_at ?? new Date().toISOString() }).eq('id', user.id);
      return successWithSession(user, 'Google sign-in successful.', rateLimitHeaders(loginLimit));
    }

    const email = typeof body.email === 'string' ? body.email.toLowerCase().trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password) return NextResponse.json({ success: false, message: 'Please provide email and password.' }, { status: 400 });
    const { data: user, error } = await db.from('users').select('*').eq('email', email).maybeSingle();
    if (error || !user || !(await bcrypt.compare(password, user.password))) return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });
    if (!user.email_verified_at) return NextResponse.json({ success: false, message: 'Please verify your email before signing in.', verificationRequired: true }, { status: 403 });
    if (user.account_status !== 'active') return NextResponse.json({ success: false, message: 'This account is not active.' }, { status: 403 });
    await db.from('users').update({ last_login: new Date().toISOString() }).eq('id', user.id);
    return successWithSession(user, 'Login successful.', rateLimitHeaders(loginLimit));
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Login failed. Please try again later.' }, { status: 500 });
  }
}
