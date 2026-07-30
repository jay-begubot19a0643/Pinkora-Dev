import { NextRequest, NextResponse } from 'next/server';
import { requireSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();
    if (!name || !email || !subject || !message) return NextResponse.json({ success: false, message: 'Please fill in all required fields.' }, { status: 400 });
    if (message.trim().length < 10) return NextResponse.json({ success: false, message: 'Message must be at least 10 characters.' }, { status: 400 });
    const { data, error } = await requireSupabase().from('contacts').insert([{ name: name.trim(), email: email.toLowerCase(), phone: phone?.trim() || null, subject: subject.trim(), message: message.trim(), status: 'new' }]).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Your message has been received. We will get back to you soon!', data: { id: data.id, timestamp: data.timestamp } }, { status: 201 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit contact form.' }, { status: 500 });
  }
}
