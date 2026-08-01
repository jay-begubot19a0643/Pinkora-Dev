'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { getInnovationQuickChallenge, innovationFields, innovationLevels, innovationQuestions, type InnovationField, type InnovationLevel } from '@/lib/innovation';

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
  const [submission, setSubmission] = useState<{ points: number; message: string } | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('');
  const [feedbackPending, setFeedbackPending] = useState(false);
  const [quickChallengeRound, setQuickChallengeRound] = useState(1);
  const [selectedQuickOption, setSelectedQuickOption] = useState('');
  const quickChallenge = getInnovationQuickChallenge(field, level, quickChallengeRound);

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
        setFeedbackRating(5);
        setFeedbackMessage('');
        setFeedbackStatus('');
        setSubmission({ points: Number(data.data?.ai_score ?? 0), message: data.message ?? 'Your answer is now on the innovation board.' });
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

  async function submitQuickChallenge() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsSignedIn(false);
      return;
    }
    if (!selectedQuickOption) {
      setStatus('Choose the answer you believe is best before submitting the quick challenge.');
      return;
    }

    setPending(true);
    setStatus('');
    try {
      const response = await fetch('/api/innovation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'quick-answer', field, level, round: quickChallengeRound, selectedOptionId: selectedQuickOption }),
      });
      const data = await response.json();
      setStatus(data.message ?? 'Unable to submit your quick challenge answer.');
      if (response.ok && data.success) {
        setFeedbackRating(5);
        setFeedbackMessage('');
        setFeedbackStatus('');
        setSubmission({ points: Number(data.data?.ai_score ?? 0), message: data.message ?? 'Your quick challenge answer is now recorded.' });
        setSelectedQuickOption('');
        void loadLeaderboard(field);
      }
    } catch {
      setStatus('Unable to submit your quick challenge answer. Please try again.');
    } finally {
      setPending(false);
    }
  }

  async function submitContributionFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) return;

    setFeedbackPending(true);
    setFeedbackStatus('');
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: 'other', rating: feedbackRating, message: feedbackMessage }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setFeedbackStatus(data.message ?? 'Unable to share feedback.');
        return;
      }
      setFeedbackStatus('Thank you—your feedback has been shared with the JVerse community.');
      setFeedbackMessage('');
    } catch {
      setFeedbackStatus('Unable to share feedback. Please try again.');
    } finally {
      setFeedbackPending(false);
    }
  }

  return (
    <div className="next-innovation-hub">
      <div className="next-innovation-tabs" role="tablist" aria-label="Innovation fields">
        {innovationFields.map((item) => (
          <button key={item} type="button" role="tab" aria-selected={field === item} className={field === item ? 'is-active' : ''} onClick={() => { setField(item); setQuickChallengeRound(1); setSelectedQuickOption(''); }}>{item}</button>
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
              {innovationLevels.map((item) => <button type="button" className={level === item ? 'is-active' : ''} key={item} onClick={() => { setLevel(item); setQuickChallengeRound(1); setSelectedQuickOption(''); }}>{item}</button>)}
            </div>
            <blockquote>{innovationQuestions[field][level]}</blockquote>
            <label>
              Your answer
              <textarea required name="answer" minLength={30} maxLength={1500} rows={6} placeholder="Share a clear, practical answer grounded in the real world…" />
            </label>
            <div className="next-innovation-form-footer"><span>Your name will appear on the public leaderboard.</span><button className="next-button next-button-primary" disabled={pending}>{pending ? 'Submitting…' : 'Submit answer'}</button></div>
            <section className="next-quick-challenge" aria-labelledby="quick-challenge-title">
              <div className="next-quick-challenge-heading"><div><span className="next-eyebrow">Unlimited quick challenges</span><h3 id="quick-challenge-title">Choose the best answer</h3></div><span>{level} · {quickChallenge.points} points</span></div>
              <p>{quickChallenge.question}</p>
              <div className="next-quick-challenge-options" role="radiogroup" aria-label="Quick challenge answers">
                {quickChallenge.options.map((option) => <button key={option.id} type="button" role="radio" aria-checked={selectedQuickOption === option.id} className={selectedQuickOption === option.id ? 'is-selected' : ''} onClick={() => setSelectedQuickOption(option.id)}><b>{option.id.toUpperCase()}</b><span>{option.text}</span></button>)}
              </div>
              <div className="next-quick-challenge-actions"><button type="button" className="next-button next-button-secondary" onClick={() => { setQuickChallengeRound((current) => current + 1); setSelectedQuickOption(''); }} disabled={pending}>New challenge</button><button type="button" className="next-button next-button-primary" onClick={submitQuickChallenge} disabled={pending || !selectedQuickOption}>{pending ? 'Checking…' : `Submit for ${quickChallenge.points} points`}</button></div>
            </section>
          </form>
        ) : (
          <div className="next-innovation-signin"><div><strong>Bring your idea to the board.</strong><span>Sign in to submit answers and vote for the ideas you find most valuable.</span></div><Link href="/my-account?mode=register" className="next-button next-button-primary">Sign up to participate</Link></div>
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
              <div className="next-innovation-vote"><strong>{answer.votes}</strong><span>votes</span>{isSignedIn ? <button type="button" disabled={pending} onClick={() => vote(answer.answerId)}>Vote</button> : <Link href="/my-account?mode=register">Sign in to vote</Link>}</div>
            </article>
          ))}
        </div>
        {!loading && answers.length > 3 && <div className="next-innovation-community-ranks next-innovation-full-ranks"><div><span className="next-eyebrow">Community ranks</span><strong>Every contributor in {field}</strong></div><ol>{answers.slice(3).map((answer) => <li key={answer.userId}><b>#{answer.rank}</b><span>{answer.username}</span><small>{answer.answerCount} answer{answer.answerCount === 1 ? '' : 's'}</small><strong>{answer.points} pts</strong></li>)}</ol></div>}
      </section>

      {submission && <div className="next-submission-modal-backdrop" role="presentation">
        <section className="next-submission-modal" role="dialog" aria-modal="true" aria-labelledby="submission-success-title">
          <div className="next-submission-success-mark" aria-hidden="true">✓</div>
          <span className="next-eyebrow">Voices of Innovation</span>
          <h2 id="submission-success-title">Submitted successfully</h2>
          <p>{submission.message}</p>
          {submission.points > 0 && <strong className="next-submission-points">+{submission.points} points added to your rank</strong>}
          <form className="next-submission-feedback" onSubmit={submitContributionFeedback}>
            <div>
              <span className="next-eyebrow">Quick feedback</span>
              <h3>How was this challenge?</h3>
            </div>
            <div className="next-feedback-rating-input">
              <span>Your rating</span>
              <div>{[1, 2, 3, 4, 5].map((rating) => <button key={rating} type="button" className={rating <= feedbackRating ? 'is-selected' : ''} onClick={() => setFeedbackRating(rating)} aria-label={`Rate ${rating} out of 5 stars`}>★</button>)}<strong>{feedbackRating}/5</strong></div>
            </div>
            <label>Your feedback<textarea required value={feedbackMessage} onChange={(event) => setFeedbackMessage(event.target.value)} minLength={10} maxLength={1000} rows={3} placeholder="Tell us how the challenge or answer experience can improve…" /></label>
            {feedbackStatus && <p className="next-form-message" role="status">{feedbackStatus}</p>}
            <div className="next-submission-modal-actions"><button type="button" className="next-button next-button-secondary" onClick={() => setSubmission(null)} disabled={feedbackPending}>Skip for now</button><button className="next-button next-button-primary" disabled={feedbackPending}>{feedbackPending ? 'Sharing…' : 'Share feedback'}</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}
