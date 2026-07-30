import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';

export function POST(request: NextRequest) {
  if (!getUserId(request)) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
  return NextResponse.json({ success: true, message: 'Logged out successfully.' });
}
