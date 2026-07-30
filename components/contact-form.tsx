'use client';

import { FormEvent, useState } from 'react';

export function ContactForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setMessage(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/contact-form', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) });
    const data = await response.json();
    setSending(false);
    setMessage(data.message ?? 'Unable to send your message.');
    if (response.ok) event.currentTarget.reset();
  }

  return <form className="next-form" onSubmit={submit}><label>Name<input required name="name" placeholder="John Doe" /></label><label>Email<input required type="email" name="email" placeholder="you@example.com" /></label><label>Phone <span>Optional</span><input name="phone" placeholder="+63 123 456 7890" /></label><label>Subject<input required name="subject" placeholder="What would you like to build?" /></label><label>Message<textarea required minLength={10} name="message" rows={6} placeholder="Tell us more about your project or inquiry..." /></label><button className="next-button next-button-primary" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</button>{message && <p className="next-form-message">{message}</p>}</form>;
}
