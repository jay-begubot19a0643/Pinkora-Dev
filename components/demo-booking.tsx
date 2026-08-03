'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

const demoProjects = ['Smart Monitoring System', 'EduKonekta'] as const;

export function DemoBooking({ project }: { project: (typeof demoProjects)[number] }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadAccount() {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        if (active) setIsSignedIn(Boolean(response.ok && data.success));
      } catch {
        if (active) setIsSignedIn(false);
      }
    }
    void loadAccount();
    window.addEventListener('jverse-auth-change', loadAccount);
    return () => { active = false; window.removeEventListener('jverse-auth-change', loadAccount); };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const selectedProject = String(values.get('project') ?? project);
    const organization = String(values.get('organization') ?? '').trim();
    const preferredSchedule = String(values.get('preferredSchedule') ?? '').trim();
    const message = String(values.get('message') ?? '').trim();

    setSending(true);
    setStatus('');
    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.get('name'),
          email: values.get('email'),
          phone: values.get('phone'),
          subject: `Free demo booking — ${selectedProject}`,
          message: [
            `Project selected: ${selectedProject}`,
            `Organization: ${organization || 'Not provided'}`,
            `Preferred demo schedule: ${preferredSchedule || 'Not provided'}`,
            '',
            message,
          ].join('\n'),
        }),
      });
      const data = await response.json();
      setStatus(data.message ?? 'Unable to send your demo request.');
      if (response.ok && data.success) form.reset();
    } catch {
      setStatus('Unable to send your demo request. Please try again.');
    } finally {
      setSending(false);
    }
  }

  function openBooking() {
    if (!isSignedIn) {
      setStatus('Please sign in or create a JVerse account before booking a free demo.');
      return;
    }
    setStatus('');
    setOpen(true);
  }

  return <>
    <button className="next-button next-button-primary next-demo-book-button" type="button" onClick={openBooking}>Book a free demo</button>
    {!isSignedIn && status && <p className="next-form-message">{status} <Link href="/my-account?mode=register">Sign up or sign in</Link></p>}
    {open && <div className="next-demo-modal-backdrop" role="presentation">
      <section className="next-demo-modal" role="dialog" aria-modal="true" aria-labelledby={`demo-booking-${project.replace(/ /g, '-').toLowerCase()}`}>
        <button className="next-demo-modal-close" type="button" aria-label="Close demo booking form" onClick={() => setOpen(false)}>×</button>
        <span className="next-eyebrow">JVerse portfolio</span>
        <h2 id={`demo-booking-${project.replace(/ /g, '-').toLowerCase()}`}>Book a free demo</h2>
        <p>Tell Jay-Be what you would like to explore. Your request will be sent directly to <strong>jaybe.gubot01@gmail.com</strong>.</p>
        <form className="next-demo-booking-form" onSubmit={submit}>
          <label>Project<select name="project" defaultValue={project}>{demoProjects.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <div className="next-demo-form-grid">
            <label>Name<input required name="name" placeholder="Your name" /></label>
            <label>Email<input required type="email" name="email" placeholder="you@example.com" /></label>
          </div>
          <div className="next-demo-form-grid">
            <label>Phone <span>Optional</span><input name="phone" placeholder="+63 900 000 0000" /></label>
            <label>Organization <span>Optional</span><input name="organization" placeholder="Business or school" /></label>
          </div>
          <label>Preferred schedule <span>Optional</span><input name="preferredSchedule" placeholder="e.g. Weekdays after 3 PM" /></label>
          <label>What would you like to see?<textarea required name="message" minLength={10} rows={4} placeholder="Tell us about your goals, workflow, or questions for the demo…" /></label>
          {status && <p className="next-form-message" role="status">{status}</p>}
          <button className="next-button next-button-primary" disabled={sending}>{sending ? 'Sending request…' : 'Send demo request'}</button>
        </form>
      </section>
    </div>}
  </>;
}
