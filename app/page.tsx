import Link from 'next/link';
import { HeroVideo } from '@/components/hero-video';
import { LandingExperience } from '@/components/landing-experience';

const projects = [
  ['Smart Store Monitoring', 'Connected CCTV, POS activity, and analytics in one retail command center.', '/projects'],
  ['Business Dashboards', 'Clear, decision-ready views of sales, inventory, and operational performance.', '/services'],
  ['Custom Web Systems', 'Fast, focused applications designed around real workflows and growth.', '/contact'],
];

export default function HomePage() {
  return (
    <LandingExperience>
      <HeroVideo />
      <section className="next-home-intro next-container next-reveal">
        <span className="next-eyebrow">Hi, I&apos;m Jay-Be Gubot</span>
        <h1>Welcome to my JVerse.</h1>
        <p>I design business systems that transform complexity into clear, scalable experiences for teams and customers.</p>
        <div className="next-actions">
          <Link href="/projects" className="next-button next-button-primary">View projects</Link>
          <Link href="/services" className="next-button next-button-secondary">Explore services</Link>
        </div>
        <div className="next-proof-grid">
          <div><strong>01</strong><span>Strategy-led builds</span></div>
          <div><strong>02</strong><span>Human-first experiences</span></div>
          <div><strong>03</strong><span>Built to scale</span></div>
        </div>
      </section>
      <section className="next-section next-container next-reveal">
        <div className="next-section-heading">
          <div><span className="next-eyebrow">Selected work</span><h2>Projects with a purpose.</h2></div>
          <p>Systems and experiences that make everyday work clearer, faster, and more useful.</p>
        </div>
        <div className="next-card-grid next-project-grid">
          {projects.map(([title, description, href], index) => (
            <Link className="next-project-card next-reveal" href={href} key={title} style={{ transitionDelay: `${index * 90}ms` }}>
              <div className={`next-project-art art-${index + 1}`}><span>0{index + 1}</span></div>
              <div><h3>{title}</h3><p>{description}</p><span className="next-text-link">Explore project →</span></div>
            </Link>
          ))}
        </div>
      </section>
      <section className="next-callout next-reveal">
        <div className="next-container"><span className="next-eyebrow">Built for better work</span><h2>Technology should feel like an advantage.</h2><p>Every project starts with the people using it, then turns that insight into a reliable digital system.</p><Link href="/contact" className="next-text-link">Start a conversation ↗</Link></div>
      </section>
    </LandingExperience>
  );
}
