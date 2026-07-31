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

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });

    const { name } = await request.json();
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      return NextResponse.json({ success: false, message: 'Name must be between 2 and 80 characters.' }, { status: 400 });
    }

    const { data: user, error } = await requireSupabase()
      .from('users')
      .update({ name: trimmedName })
      .eq('id', userId)
      .select('id, name, email')
      .single();

    if (error || !user) throw error ?? new Error('User not found.');
    return NextResponse.json({ success: true, message: 'Your profile has been updated.', data: user });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ success: false, message: 'Unable to update your profile.' }, { status: 500 });
  }
}
