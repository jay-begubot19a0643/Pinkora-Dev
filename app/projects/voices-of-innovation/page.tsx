import { InnovationHub } from '@/components/innovation-hub';
import { PageHero } from '@/components/page-hero';

export default function VoicesOfInnovationPage() {
  return (
    <main>
      <PageHero eyebrow="Voices of Innovation" title="Practical ideas for real-world challenges." description="Explore field-specific scenarios, contribute thoughtful solutions, and help the strongest ideas rise through the community leaderboard." />
      <section className="next-section next-container next-innovation-intro">
        <span className="next-label">Community challenge board</span>
        <p className="next-lead">Every question is grounded in the kind of decisions people, teams, schools, and communities face every day. Your experience can help someone see a better next step.</p>
      </section>
      <section className="next-section next-container"><InnovationHub /></section>
    </main>
  );
}
