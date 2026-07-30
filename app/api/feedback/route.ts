import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { requireSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    const { data, error } = await requireSupabase().from('feedback').select('*').eq('user_id', userId).order('timestamp', { ascending: false }).limit(10);
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Feedback fetch error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch feedback.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    const { type, message } = await request.json();
    if (!type || !message || message.trim().length < 10) return NextResponse.json({ success: false, message: 'Please provide a feedback type and a message of at least 10 characters.' }, { status: 400 });
    const db = requireSupabase();
    const { data: user, error: userError } = await db.from('users').select('name, email').eq('id', userId).maybeSingle();
    if (userError || !user) return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    const { data, error } = await db.from('feedback').insert([{ user_id: userId, user_email: user.email, user_name: user.name, type, message: message.trim(), status: 'pending' }]).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Feedback submitted successfully.', data }, { status: 201 });
  } catch (error) {
    console.error('Feedback submit error:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit feedback.' }, { status: 500 });
  }
}
