import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

type TokenPayload = { userId: string };

export function getUserId(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
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
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
}
