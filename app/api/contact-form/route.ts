import { NextRequest, NextResponse } from 'next/server';
import { getMailTransport } from '@/lib/mailer';
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { requireSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const limit = checkRateLimit(request, 'contact', { limit: 5, windowMs: 60 * 60 * 1_000 });
    if (!limit.allowed) return NextResponse.json({ success: false, message: 'Too many messages from this connection. Please try again later.' }, { status: 429, headers: rateLimitHeaders(limit) });

    const { name, email, phone, subject, message } = await request.json();
    if (!name || !email || !subject || !message) return NextResponse.json({ success: false, message: 'Please fill in all required fields.' }, { status: 400 });
    if (message.trim().length < 10) return NextResponse.json({ success: false, message: 'Message must be at least 10 characters.' }, { status: 400 });
    if (message.trim().length > 5_000 || name.trim().length > 120 || subject.trim().length > 180 || (phone && phone.trim().length > 40)) return NextResponse.json({ success: false, message: 'Please shorten the submitted details and try again.' }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ success: false, message: 'Please provide a valid email address.' }, { status: 400 });

    const transporter = getMailTransport();
    const recipient = process.env.CONTACT_RECIPIENT_EMAIL ?? 'jaybe.gubot01@gmail.com';
    if (!transporter || !recipient) {
      return NextResponse.json({ success: false, message: 'Contact email delivery is not configured yet. Please email us directly.' }, { status: 503 });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone?.trim() || null;
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();
    const { data, error } = await requireSupabase().from('contacts').insert([{ name: cleanName, email: cleanEmail, phone: cleanPhone, subject: cleanSubject, message: cleanMessage, status: 'new' }]).select().single();
    if (error) throw error;

    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER,
      to: recipient,
      replyTo: cleanEmail,
      subject: `[JVerse contact] ${cleanSubject.replace(/[\r\n]+/g, ' ')}`,
      text: [
        'New JVerse contact message',
        '',
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        `Phone: ${cleanPhone ?? 'Not provided'}`,
        `Subject: ${cleanSubject}`,
        '',
        cleanMessage,
      ].join('\n'),
    });

    return NextResponse.json({ success: true, message: 'Your message has been sent. Jay-Be will get back to you soon!', data: { id: data.id, createdAt: data.created_at } }, { status: 201, headers: rateLimitHeaders(limit) });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ success: false, message: 'We could not deliver your message. Please try again or email Jay-Be directly.' }, { status: 502 });
  }
}
