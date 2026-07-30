import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { requireSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    const { data: user, error } = await requireSupabase().from('users').select('id, name, email').eq('id', userId).maybeSingle();
    if (error || !user) return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ success: false, message: 'Auth check failed.' }, { status: 500 });
  }
}
