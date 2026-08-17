import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { getMailTransport } from '@/lib/mailer';
import { checkRateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { requireSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ success: false, message: 'Please sign in before sending a message.' }, { status: 401 });
    const limit = checkRateLimit(request, 'contact', { limit: 5, windowMs: 60 * 60 * 1_000 }, userId);
    if (!limit.allowed) return NextResponse.json({ success: false, message: 'Too many messages from this connection. Please try again later.' }, { status: 429, headers: rateLimitHeaders(limit) });

    const { phone, subject, message, preferredDate, preferredTime } = await request.json();
    if (!subject || !message) return NextResponse.json({ success: false, message: 'Please fill in all required fields.' }, { status: 400 });
    if (message.trim().length < 10) return NextResponse.json({ success: false, message: 'Message must be at least 10 characters.' }, { status: 400 });
    if (message.trim().length > 5_000 || subject.trim().length > 180 || (phone && phone.trim().length > 40) || (preferredDate && String(preferredDate).length > 10) || (preferredTime && String(preferredTime).length > 5)) return NextResponse.json({ success: false, message: 'Please shorten the submitted details and try again.' }, { status: 400 });

    const transporter = getMailTransport();
    const recipient = process.env.CONTACT_RECIPIENT_EMAIL ?? 'jaybe.gubot01@gmail.com';
    if (!transporter || !recipient) {
      return NextResponse.json({ success: false, message: 'Contact email delivery is not configured yet. Please email us directly.' }, { status: 503 });
    }

    const { data: user, error: userError } = await requireSupabase().from('users').select('name, email').eq('id', userId).maybeSingle();
    if (userError || !user) return NextResponse.json({ success: false, message: 'Your account could not be verified.' }, { status: 401 });
    const cleanName = user.name.trim();
    const cleanEmail = user.email.trim().toLowerCase();
    const cleanPhone = phone?.trim() || null;
    const cleanSubject = subject.trim();
    const cleanPreferredDate = typeof preferredDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(preferredDate) ? preferredDate : null;
    const cleanPreferredTime = typeof preferredTime === 'string' && /^\d{2}:\d{2}$/.test(preferredTime) ? preferredTime : null;
    const cleanMessage = [
      cleanPreferredDate || cleanPreferredTime ? `Preferred schedule (Philippine Time): ${cleanPreferredDate ?? 'Date not provided'}${cleanPreferredTime ? ` at ${cleanPreferredTime}` : ''}` : '',
      message.trim(),
    ].filter(Boolean).join('\n\n');
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
        `Preferred date: ${cleanPreferredDate ?? 'Not provided'} (Philippine Time)`,
        `Preferred time: ${cleanPreferredTime ?? 'Not provided'} (Philippine Time)`,
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
