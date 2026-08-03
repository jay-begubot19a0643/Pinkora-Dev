import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, getUserId } from '@/lib/auth';

export function POST(request: NextRequest) {
  if (!getUserId(request)) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  clearSessionCookie(response);
  return response;
}
