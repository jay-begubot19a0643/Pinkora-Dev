'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { innovationFields, innovationLevels, innovationQuestions, type InnovationField, type InnovationLevel } from '@/lib/innovation';

type InnovationLeaderboardEntry = {
  userId: string;
  username: string;
  level: InnovationLevel;
  answer: string;
  votes: number;
  points: number;
  answerCount: number;
  answerId: string;
  aiFeedback: string | null;
  rank: number;
};

const badges = ['Visionary Thinker', 'Community Builder', 'Innovator Rising'];

export function InnovationHub() {
  const [field, setField] = useState<InnovationField>('Business');
  const [level, setLevel] = useState<InnovationLevel>('Easy');
  const [answers, setAnswers] = useState<InnovationLeaderboardEntry[]>([]);
  const [viewer, setViewer] = useState<{ rank: number; points: number; answerCount: number } | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState('');

  async function loadLeaderboard(nextField = field) {
    setLoading(true);
    try {
      const response = await fetch(`/api/innovation?field=${encodeURIComponent(nextField)}&limit=100`);
      const data = await response.json();
      if (response.ok && data.success) {
        setAnswers(data.data ?? []);
        setViewer(data.viewer ?? null);
      }
      else setStatus(data.message ?? 'Unable to load the leaderboard.');
    } catch {
      setStatus('Unable to load the leaderboard.');
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
    void loadLeaderboard(field);
  }, [field]);

  useEffect(() => {
    void loadAccount();
    window.addEventListener('jverse-auth-change', loadAccount);
    return () => window.removeEventListener('jverse-auth-change', loadAccount);
  }, []);

  async function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsSignedIn(false);
      return;
    }

    setPending(true);
    setStatus('');
    const answer = String(new FormData(form).get('answer') ?? '');
    try {
      const response = await fetch('/api/innovation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'answer', field, level, answer }),
      });
      const data = await response.json();
      setStatus(data.message ?? 'Unable to submit your answer.');
      if (response.ok && data.success) {
        form.reset();
        if (field === data.data.field) void loadLeaderboard(field);
      }
    } catch {
      setStatus('Unable to submit your answer. Please try again.');
    } finally {
      setPending(false);
    }
  }

  async function vote(answerId: string) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsSignedIn(false);
      return;
    }

    setPending(true);
    setStatus('');
    try {
      const response = await fetch('/api/innovation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'vote', answerId }),
      });
      const data = await response.json();
      setStatus(data.message ?? 'Unable to count your vote.');
      if (response.ok && data.success) void loadLeaderboard(field);
    } catch {
      setStatus('Unable to count your vote. Please try again.');
    } finally {
      setPending(false);
    }
  }

  async function scoreExistingAnswers() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    setPending(true);
    setStatus('');
    try {
      const response = await fetch('/api/innovation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'rescore', field }),
      });
      const data = await response.json();
      setStatus(data.message ?? 'Unable to score existing answers.');
      if (response.ok && data.success) void loadLeaderboard(field);
    } catch {
      setStatus('Unable to score existing answers. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="next-innovation-hub">
      <div className="next-innovation-tabs" role="tablist" aria-label="Innovation fields">
        {innovationFields.map((item) => (
          <button key={item} type="button" role="tab" aria-selected={field === item} className={field === item ? 'is-active' : ''} onClick={() => setField(item)}>{item}</button>
        ))}
      </div>

      <section className="next-innovation-composer">
        <div className="next-innovation-composer-title">
          <span className="next-eyebrow">Your perspective</span>
          <h2>Answer a real-world challenge.</h2>
          <p>Choose a level, consider the scenario, and share a practical idea with the community.</p>
        </div>
        {isSignedIn ? (
          <form className="next-innovation-form" onSubmit={submitAnswer}>
            <div className="next-innovation-levels" aria-label="Challenge level">
              {innovationLevels.map((item) => <button type="button" className={level === item ? 'is-active' : ''} key={item} onClick={() => setLevel(item)}>{item}</button>)}
            </div>
            <blockquote>{innovationQuestions[field][level]}</blockquote>
            <label>
              Your answer
              <textarea required name="answer" minLength={30} maxLength={1500} rows={6} placeholder="Share a clear, practical answer grounded in the real world…" />
            </label>
            <div className="next-innovation-form-footer"><span>Your name will appear on the public leaderboard.</span><button className="next-button next-button-primary" disabled={pending}>{pending ? 'Submitting…' : 'Submit answer'}</button></div>
          </form>
        ) : (
          <div className="next-innovation-signin"><div><strong>Bring your idea to the board.</strong><span>Sign in to submit answers and vote for the ideas you find most valuable.</span></div><Link href="/account?mode=register" className="next-button next-button-primary">Sign up to participate</Link></div>
        )}
      </section>

      <section className="next-innovation-leaderboard" id="leaderboard">
        <div className="next-section-heading"><div><span className="next-eyebrow">{field} leaderboard</span><h2>Ideas leading the conversation.</h2></div><p>Ranks are based on accumulated rubric points for relevance, practical action, clarity, detail, and constructive tone. Everyone can browse; signed-in members can vote once for each featured answer.</p></div>
        {viewer && <div className="next-innovation-viewer-rank"><span>Your {field} standing</span><strong>Top {viewer.rank}</strong><b>{viewer.points} points</b><small>{viewer.answerCount} answer{viewer.answerCount === 1 ? '' : 's'} scored</small>{isSignedIn && viewer.points === 0 && <button type="button" disabled={pending} onClick={scoreExistingAnswers}>Score my answers</button>}</div>}
        {status && <p className="next-form-message" role="status">{status}</p>}
        <div className="next-innovation-ranks" aria-live="polite">
          {loading && <p className="next-feedback-empty">Loading {field} ideas…</p>}
          {!loading && answers.length === 0 && <p className="next-feedback-empty">No answers yet. Be the first to add a practical idea for {field}.</p>}
          {answers.slice(0, 3).map((answer, index) => (
            <article className="next-innovation-answer" key={answer.userId}>
              <div className="next-innovation-place"><strong>Top {answer.rank}</strong><span>{badges[index]}</span></div>
              <div className="next-innovation-answer-body"><div><span className="next-innovation-user">{answer.username}</span><span className="next-innovation-level">{answer.level}</span><span className="next-innovation-points">{answer.points} points</span></div><p>{answer.answer}</p>{answer.aiFeedback && <small>Rubric note: {answer.aiFeedback}</small>}</div>
              <div className="next-innovation-vote"><strong>{answer.votes}</strong><span>votes</span>{isSignedIn ? <button type="button" disabled={pending} onClick={() => vote(answer.answerId)}>Vote</button> : <Link href="/account?mode=register">Sign in to vote</Link>}</div>
            </article>
          ))}
        </div>
        {!loading && answers.length > 3 && <div className="next-innovation-community-ranks next-innovation-full-ranks"><div><span className="next-eyebrow">Community ranks</span><strong>Every contributor in {field}</strong></div><ol>{answers.slice(3).map((answer) => <li key={answer.userId}><b>#{answer.rank}</b><span>{answer.username}</span><small>{answer.answerCount} answer{answer.answerCount === 1 ? '' : 's'}</small><strong>{answer.points} pts</strong></li>)}</ol></div>}
      </section>
    </div>
  );
}
