import jwt from 'jsonwebtoken';
import type { NextRequest, NextResponse } from 'next/server';

type TokenPayload = { userId: string };
export const AUTH_COOKIE = 'jverse_session';
const sessionLifetimeSeconds = 60 * 60 * 24 * 7;

export function getUserId(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) return null;

  try {
    const payload = jwt.verify(token, secret) as TokenPayload;
    return payload.userId;
  } catch {
    return null;
  }
}

export function createToken(userId: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured.');
  return jwt.sign({ userId }, secret, { expiresIn: sessionLifetimeSeconds });
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: sessionLifetimeSeconds,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
