import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { requireSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    const { data, error } = await requireSupabase().from('recommendations').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('My recommendations fetch error:', error);
    return NextResponse.json({ success: false, message: 'Error fetching your recommendations.' }, { status: 500 });
  }
}
