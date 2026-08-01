'use client';

import { FormEvent, useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

type Mode = 'login' | 'register';
type AccountUser = { id: string; name: string; email: string };

function announceAuthChange() {
  window.dispatchEvent(new Event('jverse-auth-change'));
}

export function AccountPanel() {
  const [mode, setMode] = useState<Mode>('login');
  const [user, setUser] = useState<AccountUser | null>(null);
  const [checkingAccount, setCheckingAccount] = useState(true);
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  async function loadUser() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setUser(null);
      setCheckingAccount(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/check', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok || !data.success || !data.data) {
        localStorage.removeItem('authToken');
        setUser(null);
        announceAuthChange();
        return;
      }

      setUser(data.data);
    } catch {
      setUser(null);
    } finally {
      setCheckingAccount(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'register') setMode('register');
    if (params.get('google') === 'success') {
      setStatus('You are signed in securely with Google.');
      window.history.replaceState({}, '', window.location.pathname);
    }
    loadUser();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!privacyAccepted) {
      setStatus('Please review and accept the Data Privacy Notice before continuing.');
      return;
    }

    setPending(true);
    setStatus('');

    const values = { ...Object.fromEntries(new FormData(event.currentTarget)), privacyAccepted: true };
    const response = await fetch(`/api/auth/${mode === 'login' ? 'login' : 'register'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const data = await response.json();

    setPending(false);
    setStatus(data.message ?? 'Unable to complete your request.');
    if (data.success && data.data?.token) {
      localStorage.setItem('authToken', data.data.token);
      setUser({ id: data.data.id, name: data.data.name, email: data.data.email });
      announceAuthChange();
    }
  }

  async function continueWithGoogle() {
    setStatus('');

    if (!privacyAccepted) {
      setStatus('Please review and accept the Data Privacy Notice before continuing with Google.');
      return;
    }

    if (!supabaseBrowser) {
      setStatus('Google sign-in is not configured yet. Add the public Supabase environment variables.');
      return;
    }

    setPending(true);
    sessionStorage.setItem('jverse-google-privacy-consent', 'accepted');
    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setPending(false);
      sessionStorage.removeItem('jverse-google-privacy-consent');
      setStatus(error.message);
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) return;

    setPending(true);
    setStatus('');
    const name = String(new FormData(event.currentTarget).get('name') ?? '');
    const response = await fetch('/api/auth/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();

    setPending(false);
    setStatus(data.message ?? 'Unable to update your profile.');
    if (data.success && data.data) {
      setUser(data.data);
      announceAuthChange();
    }
  }

  async function signOut() {
    const token = localStorage.getItem('authToken');
    setPending(true);
    if (token) {
      await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    }
    await supabaseBrowser?.auth.signOut();
    localStorage.removeItem('authToken');
    setUser(null);
    setPending(false);
    setStatus('You have been signed out.');
    announceAuthChange();
  }

  if (checkingAccount) {
    return <section className="next-account-card next-account-loading" aria-live="polite">Loading your account…</section>;
  }

  if (user) {
    const firstName = user.name.split(' ')[0] || user.name;
    return (
      <section className="next-account-card next-account-dashboard">
        <div className="next-account-profile-head">
          <span className="next-account-avatar" aria-hidden="true">{firstName.charAt(0).toUpperCase()}</span>
          <div>
            <span className="next-eyebrow">My account</span>
            <h2>Welcome back, {firstName}.</h2>
            <p>Your JVerse profile is ready.</p>
          </div>
        </div>

        <div className="next-account-details">
          <div><span>Account email</span><strong>{user.email}</strong></div>
          <div><span>Membership</span><strong>JVerse member</strong></div>
        </div>

        <form className="next-form next-account-settings" onSubmit={saveProfile}>
          <div>
            <span className="next-eyebrow">Profile settings</span>
            <h3>How should JVerse address you?</h3>
          </div>
          <label>
            Display name
            <input required name="name" minLength={2} maxLength={80} defaultValue={user.name} />
          </label>
          <button className="next-button next-button-primary" disabled={pending}>
            {pending ? 'Saving…' : 'Save changes'}
          </button>
        </form>

        {status && <p className="next-form-message" role="status">{status}</p>}

        <button className="next-signout-button" type="button" disabled={pending} onClick={signOut}>
          Sign out
        </button>
      </section>
    );
  }

  return (
    <section className="next-account-card">
      <div>
        <span className="next-eyebrow">JVerse account</span>
        <h2>{mode === 'login' ? 'Welcome back.' : 'Create your account.'}</h2>
        <p>
          {mode === 'login'
            ? 'Sign in to personalise your JVerse experience.'
            : 'Create an account to keep track of your work with JVerse.'}
        </p>
      </div>

      <section className="next-privacy-consent" aria-labelledby="privacy-consent-title">
        <div>
          <span className="next-eyebrow">Data Privacy Act of 2012</span>
          <h3 id="privacy-consent-title">Privacy notice and consent</h3>
        </div>
        <p>JVerse uses your name and email to create and secure your account, personalise your experience, and attribute feedback or Voices of Innovation contributions. Your information is handled only for these legitimate, stated purposes.</p>
        <details>
          <summary>Read your privacy rights</summary>
          <ul>
            <li>Be informed about how your personal data is collected and used.</li>
            <li>Request access, correction, erasure or blocking of your personal data.</li>
            <li>Object to processing for marketing or profiling, and request data portability where applicable.</li>
            <li>Contact <a href="mailto:jaybe.gubot01@gmail.com">jaybe.gubot01@gmail.com</a> for privacy questions or requests.</li>
          </ul>
        </details>
        <label className="next-privacy-check">
          <input type="checkbox" checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} />
          <span>I have read this notice and freely give my explicit consent to JVerse processing my account information in accordance with the Data Privacy Act of 2012 (RA 10173).</span>
        </label>
      </section>

      <button className="next-google-button" type="button" disabled={pending} onClick={continueWithGoogle}>
        <span className="next-google-mark" aria-hidden="true">G</span>
        {mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
      </button>

      <div className="next-auth-divider" aria-hidden="true"><span>or use email</span></div>

      <form className="next-form" onSubmit={submit}>
        {mode === 'register' && <label>Name<input required name="name" placeholder="Your name" /></label>}
        <label>Email<input required name="email" type="email" placeholder="you@example.com" /></label>
        <label>Password<input required name="password" type="password" minLength={6} placeholder="At least 6 characters" /></label>
        <button className="next-button next-button-primary" disabled={pending}>
          {pending ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      {status && <p className="next-form-message" role="status">{status}</p>}

      <button className="next-switch-button" type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setPrivacyAccepted(false); setStatus(''); }}>
        {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
      </button>
    </section>
  );
}
