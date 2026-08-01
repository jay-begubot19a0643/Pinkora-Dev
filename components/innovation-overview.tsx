'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { innovationFields, type InnovationField } from '@/lib/innovation';

type LeaderboardEntry = {
  userId: string;
  username: string;
  answer: string;
  points: number;
  answerCount: number;
  rank: number;
};

const badges = ['Visionary Thinker', 'Community Builder', 'Innovator Rising'];

export function InnovationOverview() {
  const [field, setField] = useState<InnovationField>('Business');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/innovation?field=${encodeURIComponent(field)}&limit=100`)
      .then((response) => response.json())
      .then((data) => {
        if (active && data.success) setEntries(data.data ?? []);
      })
      .catch(() => {
        if (active) setEntries([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [field]);

  return (
    <section className="next-section next-container next-innovation-overview next-reveal">
      <div className="next-section-heading">
        <div>
          <span className="next-eyebrow">Voices of Innovation</span>
          <h2>Ideas that help a community move forward.</h2>
        </div>
        <p>Real-world challenges become shared learning: people contribute practical answers, earn transparent rubric points, and discover ideas worth building on.</p>
      </div>

      <div className="next-innovation-benefits">
        <div><strong>Real-world thinking</strong><span>Questions grounded in business, education, technology, community work, and real-world careers.</span></div>
        <div><strong>Visible growth</strong><span>Clear rubric points reward relevance, action, reasoning, detail, and constructive tone.</span></div>
        <div><strong>Shared impact</strong><span>Public leaderboards help strong practical ideas reach more people.</span></div>
      </div>

      <div className="next-innovation-overview-board">
        <div className="next-innovation-overview-heading">
          <div><span className="next-eyebrow">Live leaderboard</span><h3>{field} leaders</h3></div>
          <div className="next-innovation-tabs" role="tablist" aria-label="Leaderboard category">
            {innovationFields.map((item) => <button type="button" role="tab" aria-selected={field === item} className={field === item ? 'is-active' : ''} key={item} onClick={() => setField(item)}>{item}</button>)}
          </div>
        </div>

        <div className="next-innovation-preview-grid" aria-live="polite">
          {loading && <p className="next-feedback-empty">Loading the {field} leaderboard…</p>}
          {!loading && entries.length === 0 && <p className="next-feedback-empty">The first {field} innovator will appear here.</p>}
          {entries.slice(0, 3).map((entry, index) => (
            <article className="next-innovation-preview-card" key={entry.userId}>
              <span>Top {entry.rank}</span>
              <strong>{badges[index]}</strong>
              <h3>{entry.username}</h3>
              <b>{entry.points} points</b>
              <p>{entry.answer}</p>
            </article>
          ))}
        </div>
        {!loading && entries.length > 3 && <div className="next-innovation-community-ranks"><div><span className="next-eyebrow">All contributors</span><strong>{entries.length} community voices ranked</strong></div><ol>{entries.slice(3).map((entry) => <li key={entry.userId}><b>#{entry.rank}</b><span>{entry.username}</span><small>{entry.answerCount} answer{entry.answerCount === 1 ? '' : 's'}</small><strong>{entry.points} pts</strong></li>)}</ol></div>}
        <div className="next-innovation-overview-footer">
          <p>Every useful answer can give someone a clearer next step. Join the conversation and help shape practical solutions.</p>
          <Link className="next-button next-button-primary" href="/portfolio/voices-of-innovation">Explore Voices of Innovation</Link>
        </div>
      </div>
    </section>
  );
}
