import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { requireSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const scope = request.nextUrl.searchParams.get('scope');
    const db = requireSupabase();

    if (scope === 'public') {
      const publicLimit = checkRateLimit(request, 'feedback-public-read', { limit: 90, windowMs: 60_000 });
      if (!publicLimit.allowed) return NextResponse.json({ success: false, message: 'Please wait before loading more feedback.' }, { status: 429, headers: rateLimitHeaders(publicLimit) });
      const page = Math.max(1, Math.floor(Number(request.nextUrl.searchParams.get('page') ?? 1) || 1));
      const requestedLimit = Math.floor(Number(request.nextUrl.searchParams.get('limit') ?? 12) || 12);
      const limit = Math.min(24, Math.max(6, requestedLimit));
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      const { data, error, count } = await db
        .from('feedback')
        .select('id, user_name, type, message, rating, created_at', { count: 'exact' })
        .eq('status', 'reviewed')
        .order('created_at', { ascending: false })
        .range(from, to);
      if (error) throw error;
      const total = count ?? 0;
      return NextResponse.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: to + 1 < total } }, { headers: rateLimitHeaders(publicLimit) });
    }

    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    const { data, error } = await db.from('feedback').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10);
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
    const limit = checkRateLimit(request, 'feedback-submit', { limit: 10, windowMs: 60 * 60 * 1_000 }, userId);
    if (!limit.allowed) return NextResponse.json({ success: false, message: 'You have reached the feedback limit. Please try again later.' }, { status: 429, headers: rateLimitHeaders(limit) });
    const { type, message, rating } = await request.json();
    if (!type || !message || message.trim().length < 10) return NextResponse.json({ success: false, message: 'Please provide a feedback type and a message of at least 10 characters.' }, { status: 400 });
    if (!['bug', 'feature', 'improvement', 'other'].includes(type)) return NextResponse.json({ success: false, message: 'Please choose a valid feedback type.' }, { status: 400 });
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return NextResponse.json({ success: false, message: 'Please select a rating from 1 to 5 stars.' }, { status: 400 });
    if (message.trim().length > 1000) return NextResponse.json({ success: false, message: 'Feedback must be 1,000 characters or fewer.' }, { status: 400 });
    const db = requireSupabase();
    const { data: user, error: userError } = await db.from('users').select('name, email').eq('id', userId).maybeSingle();
    if (userError || !user) return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    const { data, error } = await db.from('feedback').insert([{ user_id: userId, user_email: user.email, user_name: user.name, type, message: message.trim(), rating, status: 'reviewed' }]).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Feedback submitted successfully.', data }, { status: 201, headers: rateLimitHeaders(limit) });
  } catch (error) {
    console.error('Feedback submit error:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit feedback.' }, { status: 500 });
  }
}
