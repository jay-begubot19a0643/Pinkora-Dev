'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function AuthCallbackPage() {
  const router = useRouter();
  const callbackStarted = useRef(false);
  const [message, setMessage] = useState('Finishing your secure Google sign-in…');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (callbackStarted.current) return;
    callbackStarted.current = true;

    async function completeGoogleSignIn() {
      try {
        if (!supabaseBrowser) {
          throw new Error('Supabase browser authentication is not configured.');
        }

        const params = new URLSearchParams(window.location.search);
        const providerError = params.get('error_description') ?? params.get('error');
        if (providerError) throw new Error(providerError);

        const code = params.get('code');
        const sessionResult = code
          ? await supabaseBrowser.auth.exchangeCodeForSession(code)
          : await supabaseBrowser.auth.getSession();

        if (sessionResult.error) throw sessionResult.error;

        const session = sessionResult.data.session;
        if (!session) throw new Error('No Google session was returned. Please try again.');

        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: 'google',
            accessToken: session.access_token,
          }),
        });
        const result = await response.json();

        if (!response.ok || !result.success || !result.data?.token) {
          throw new Error(result.message ?? 'JVerse could not complete your Google sign-in.');
        }

        localStorage.setItem('authToken', result.data.token);
        router.replace('/account?google=success');
      } catch (error) {
        setFailed(true);
        setMessage(error instanceof Error ? error.message : 'Google sign-in failed. Please try again.');
      }
    }

    completeGoogleSignIn();
  }, [router]);

  return (
    <main>
      <section className="next-section next-container next-auth-callback">
        <div className="next-account-card" aria-live="polite">
          <span className="next-eyebrow">JVerse account</span>
          <h2>{failed ? 'Sign-in needs attention.' : 'Signing you in.'}</h2>
          <p className="next-auth-callback-message">{message}</p>
          {failed && <Link className="next-button next-button-secondary" href="/account">Back to account</Link>}
        </div>
      </section>
    </main>
  );
}
