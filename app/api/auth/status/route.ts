import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';

export function GET(request: NextRequest) {
  const userId = getUserId(request);
  return NextResponse.json({ success: true, isAuthenticated: Boolean(userId), data: userId ? { userId } : null });
}
