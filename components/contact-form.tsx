'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

type AccountUser = { id: string; name: string; email: string };

export function ContactForm() {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadAccount() {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        if (active) setUser(response.ok && data.success ? data.data : null);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setChecking(false);
      }
    }
    void loadAccount();
    window.addEventListener('jverse-auth-change', loadAccount);
    return () => { active = false; window.removeEventListener('jverse-auth-change', loadAccount); };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setSending(true);
    setMessage(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/contact-form', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) });
    const data = await response.json();
    setSending(false);
    setMessage(data.message ?? 'Unable to send your message.');
    if (response.ok) event.currentTarget.reset();
  }

  if (checking) return <p className="next-contact-member-message">Checking your member access…</p>;
  if (!user) return <div className="next-contact-member-message"><strong>JVerse member access required</strong><p>Create an account or sign in to send a secure message. You can still use the direct email shown beside this form.</p><Link className="next-button next-button-primary" href="/my-account?mode=register">Sign up or sign in</Link></div>;

  return <form className="next-form" onSubmit={submit}><p className="next-contact-member-note">Sending as <strong>{user.name}</strong> ({user.email})</p><label>Phone <span>Optional</span><input name="phone" maxLength={40} placeholder="+63 123 456 7890" /></label><label>Subject<input required name="subject" maxLength={180} placeholder="What would you like to build?" /></label><label>Message<textarea required minLength={10} maxLength={5000} name="message" rows={6} placeholder="Tell us more about your project or inquiry..." /></label><button className="next-button next-button-primary" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</button>{message && <p className="next-form-message">{message}</p>}</form>;
}
