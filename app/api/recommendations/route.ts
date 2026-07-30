import { NextResponse } from 'next/server';
import { requireSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { data, error } = await requireSupabase().from('recommendations').select('*, users:user_id (name, email)').eq('is_approved', true).order('created_at', { ascending: false }).limit(50);
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Recommendations fetch error:', error);
    return NextResponse.json({ success: false, message: 'Error fetching recommendations.' }, { status: 500 });
  }
}
