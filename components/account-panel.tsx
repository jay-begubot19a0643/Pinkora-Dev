'use client';

import { FormEvent, useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

type Mode = 'login' | 'register';

export function AccountPanel() {
  const [mode, setMode] = useState<Mode>('login');
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('google') === 'success') {
      setStatus('You are signed in securely with Google.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus('');

    const values = Object.fromEntries(new FormData(event.currentTarget));
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
    }
  }

  async function continueWithGoogle() {
    setStatus('');

    if (!supabaseBrowser) {
      setStatus('Google sign-in is not configured yet. Add the public Supabase environment variables.');
      return;
    }

    setPending(true);
    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setPending(false);
      setStatus(error.message);
    }
  }

  return (
    <section className="next-account-card">
      <div>
        <span className="next-eyebrow">JVerse account</span>
        <h2>{mode === 'login' ? 'Welcome back.' : 'Create your account.'}</h2>
        <p>
          {mode === 'login'
            ? 'Sign in to manage your projects, feedback, and subscriptions.'
            : 'Create an account to keep track of your work with JVerse.'}
        </p>
      </div>

      <button
        className="next-google-button"
        type="button"
        disabled={pending}
        onClick={continueWithGoogle}
      >
        <span className="next-google-mark" aria-hidden="true">G</span>
        {mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
      </button>

      <div className="next-auth-divider" aria-hidden="true">
        <span>or use email</span>
      </div>

      <form className="next-form" onSubmit={submit}>
        {mode === 'register' && (
          <label>
            Name
            <input required name="name" placeholder="Your name" />
          </label>
        )}
        <label>
          Email
          <input required name="email" type="email" placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input required name="password" type="password" minLength={6} placeholder="At least 6 characters" />
        </label>
        <button className="next-button next-button-primary" disabled={pending}>
          {pending ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      {status && <p className="next-form-message" role="status">{status}</p>}

      <button
        className="next-switch-button"
        type="button"
        onClick={() => {
          setMode(mode === 'login' ? 'register' : 'login');
          setStatus('');
        }}
      >
        {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
      </button>
    </section>
  );
}
