import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { HeroVideo } from '@/components/hero-video';
import { LandingExperience } from '@/components/landing-experience';
import { FeedbackSection } from '@/components/feedback-section';
import { InnovationOverview } from '@/components/innovation-overview';

export const metadata: Metadata = {
  title: 'Overview Page',
  description: 'JVerse is Jay-Be Gubot’s portfolio for practical digital systems, software solutions, and community innovation.',
};

const projects = [
  { title: 'Smart Monitoring System', description: 'Connected CCTV, POS activity, and analytics in one retail command center.', href: '/portfolio', image: '/images/smart-monitoring-system.png', imageAlt: 'Smart Monitoring System logo' },
  { title: 'EduKonekta', description: 'A multi-tenant education platform with a PWA shell, modular API, and secure school-scoped data.', href: '/portfolio', image: '/images/edukonekta.png', imageAlt: 'EduKonekta logo' },
  { title: 'Custom Web Systems', description: 'Fast, focused applications designed around real workflows and growth.', href: '/get-in-touch' },
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
          <Link href="/portfolio" className="next-button next-button-primary">View portfolio</Link>
          <Link href="/solutions" className="next-button next-button-secondary">Explore solutions</Link>
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
          {projects.map((project, index) => {
            const { title, description, href } = project;
            return (
            <Link className="next-project-card next-reveal" href={href} key={title} style={{ transitionDelay: `${index * 90}ms` }}>
              <div className={`next-project-art art-${index + 1} ${project.image ? 'has-logo' : ''}`}>{project.image ? <Image className="next-project-logo" src={project.image} alt={project.imageAlt ?? ''} fill sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 33vw" /> : <span>0{index + 1}</span>}</div>
              <div><h3>{title}</h3><p>{description}</p><span className="next-text-link">Explore project →</span></div>
            </Link>
            );
          })}
        </div>
      </section>
      <InnovationOverview />
      <section className="next-callout next-reveal">
        <div className="next-container"><span className="next-eyebrow">Built for better work</span><h2>Technology should feel like an advantage.</h2><p>Every project starts with the people using it, then turns that insight into a reliable digital system.</p><Link href="/get-in-touch" className="next-text-link">Start a conversation ↗</Link></div>
      </section>
      <FeedbackSection eyebrow="JVerse voices" title="Feedback from the community." description="A few perspectives from people who have shared their JVerse experience." />
    </LandingExperience>
  );
}
