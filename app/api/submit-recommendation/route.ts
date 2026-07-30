import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { requireSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    const { rating, comment, serviceName } = await request.json();
    if (!rating || !comment || !serviceName) return NextResponse.json({ success: false, message: 'Please provide rating, comment, and service name.' }, { status: 400 });
    if (Number(rating) < 1 || Number(rating) > 5 || comment.trim().length < 10) return NextResponse.json({ success: false, message: 'Please provide a 1–5 rating and a comment of at least 10 characters.' }, { status: 400 });
    const db = requireSupabase();
    const { data: user, error: userError } = await db.from('users').select('name, email').eq('id', userId).maybeSingle();
    if (userError || !user) return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    const { data, error } = await db.from('recommendations').insert([{ user_id: userId, user_name: user.name, user_email: user.email, rating: Number(rating), comment: comment.trim(), service_name: serviceName, is_approved: true }]).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Recommendation submitted successfully.', data }, { status: 201 });
  } catch (error) {
    console.error('Recommendation submit error:', error);
    return NextResponse.json({ success: false, message: 'Error submitting recommendation.' }, { status: 500 });
  }
}
