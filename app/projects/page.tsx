import Link from 'next/link';
import { PageHero } from '@/components/page-hero';

const features = [
  ['◉', 'Multi-Camera CCTV Integration', 'Bring multiple camera streams into a synchronized, easy-to-review workspace.'],
  ['▦', 'POS Transaction Correlation', 'Connect transaction events with the right video context for fast investigation.'],
  ['↗', 'Real-time Analytics', 'Turn activity into useful operational signals and clearer decisions.'],
  ['⌁', 'Cross-platform Access', 'Use the same dependable system across desktop, mobile, and cloud environments.'],
];

export default function ProjectsPage() {
  return (
    <main>
      <PageHero eyebrow="Selected work" title="Practical technology, thoughtfully connected." description="Solutions that enhance visibility, strengthen operations, and help teams move with confidence." />
      <section className="next-section next-container">
        <span className="next-label">Featured project</span>
        <h2 className="next-project-title">Smart Store Monitoring System</h2>
        <p className="next-project-summary">Real-time CCTV integration, POS correlation, and intelligent analytics for modern retail operations.</p>
        <div className="next-demo-frame"><iframe src="https://www.youtube.com/embed/jnUGORZ1tUo?start=77" title="Smart Store Monitoring System demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
      </section>
      <section className="next-section next-container next-detail-section"><div><span className="next-eyebrow">Overview</span><h2>From raw activity to meaningful insight.</h2></div><p>The Smart Store Monitoring System combines CCTV surveillance, point-of-sale data, and analytics in one operational view. It helps store owners identify what happened, respond faster, and make decisions with confidence.</p></section>
      <section className="next-section next-container"><span className="next-eyebrow">Key features</span><h2 className="next-section-title">A single source of operational visibility.</h2><div className="next-card-grid next-feature-grid">{features.map(([icon, title, text]) => <article className="next-feature-card" key={title}><span>{icon}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="next-section next-container"><div className="next-cta-card"><span className="next-eyebrow">Your next system</span><h2>Need a solution shaped around your workflow?</h2><p>Let&apos;s design the tools that make your team more capable every day.</p><Link href="/contact" className="next-button next-button-primary">Discuss a project</Link></div></section>
    </main>
  );
}
