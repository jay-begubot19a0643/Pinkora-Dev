'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

type Feedback = {
  id: string;
  user_name: string;
  type: 'bug' | 'feature' | 'improvement' | 'other';
  message: string;
  rating: number;
  created_at?: string;
};

type FeedbackSectionProps = {
  allowSubmission?: boolean;
  eyebrow: string;
  title: string;
  description: string;
};

const feedbackLabels: Record<Feedback['type'], string> = {
  bug: 'Issue report',
  feature: 'Feature idea',
  improvement: 'Improvement',
  other: 'JVerse feedback',
};

export function FeedbackSection({ allowSubmission = false, eyebrow, title, description }: FeedbackSectionProps) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState(5);

  async function loadFeedback() {
    try {
      const response = await fetch('/api/feedback?scope=public');
      const data = await response.json();
      if (response.ok && data.success) setFeedback(data.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function loadAccount() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsSignedIn(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/check', { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      setIsSignedIn(Boolean(response.ok && data.success));
    } catch {
      setIsSignedIn(false);
    }
  }

  useEffect(() => {
    void loadFeedback();
    if (allowSubmission) {
      void loadAccount();
      window.addEventListener('jverse-auth-change', loadAccount);
      return () => window.removeEventListener('jverse-auth-change', loadAccount);
    }
  }, [allowSubmission]);

  async function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsSignedIn(false);
      return;
    }

    setPending(true);
    setStatus('');
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...values, rating }),
      });
      const data = await response.json();
      setStatus(data.message ?? 'Unable to submit feedback.');

      if (response.ok && data.success && data.data) {
        setFeedback((current) => [data.data, ...current]);
        form.reset();
      }
    } catch {
      setStatus('Unable to submit feedback. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="next-section next-container next-feedback-section">
      <div className="next-section-heading">
        <div>
          <span className="next-eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>

      {allowSubmission && (
        isSignedIn ? (
          <form className="next-feedback-form" onSubmit={submitFeedback}>
            <div className="next-feedback-rating-input">
              <span>How would you rate your experience?</span>
              <div role="radiogroup" aria-label="Your rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    className={star <= rating ? 'is-selected' : ''}
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={rating === star}
                    aria-label={`${star} star${star === 1 ? '' : 's'}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
                <strong>{rating}/5</strong>
              </div>
            </div>
            <label>
              Feedback type
              <select name="type" defaultValue="other">
                <option value="other">General feedback</option>
                <option value="improvement">Suggestion for improvement</option>
                <option value="feature">Feature idea</option>
                <option value="bug">Issue report</option>
              </select>
            </label>
            <label>
              Share your experience
              <textarea name="message" required minLength={10} maxLength={1000} rows={4} placeholder="Tell visitors what it was like working with JVerse…" />
            </label>
            <div className="next-feedback-form-footer">
              <span>Your name is shown with your feedback.</span>
              <button className="next-button next-button-primary" disabled={pending}>{pending ? 'Sharing…' : 'Share feedback'}</button>
            </div>
            {status && <p className="next-form-message" role="status">{status}</p>}
          </form>
        ) : (
          <div className="next-feedback-signin">
            <div><strong>Have you worked with JVerse?</strong><span>Create an account or sign in to share feedback with future visitors.</span></div>
            <Link className="next-button next-button-secondary" href="/my-account?mode=register">Sign up to share feedback</Link>
          </div>
        )
      )}

      {!loading && feedback.length > 0 && <p className="next-feedback-count">Showing all {feedback.length} community feedback entr{feedback.length === 1 ? 'y' : 'ies'}.</p>}
      <div className="next-feedback-grid" aria-live="polite" aria-label="All community feedback">
        {loading && <p className="next-feedback-empty">Loading community feedback…</p>}
        {!loading && feedback.length === 0 && <p className="next-feedback-empty">The first JVerse feedback will appear here.</p>}
        {feedback.map((item) => (
          <article className="next-feedback-card" key={item.id}>
            <span className="next-feedback-avatar" aria-hidden="true">{item.user_name.charAt(0).toUpperCase()}</span>
            <div className="next-feedback-card-head">
              <strong>{item.user_name}</strong>
              <span>{feedbackLabels[item.type] ?? 'JVerse feedback'}</span>
            </div>
            <div className="next-feedback-stars" aria-label={`${item.rating} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((star) => <span className={star <= item.rating ? 'is-filled' : ''} key={star}>★</span>)}
            </div>
            <p>“{item.message}”</p>
          </article>
        ))}
      </div>
    </section>
  );
}
