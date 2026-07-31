import Image from 'next/image';
import { PageHero } from '@/components/page-hero';

const principles = [
  ['01', 'Make complexity useful', 'The best technology removes friction and gives people a clearer path through their work.'],
  ['02', 'Build for real life', 'Every product should reflect the environment, constraints, and people it is made for.'],
  ['03', 'Keep improving', 'Strong systems are designed to grow, adapt, and remain useful as needs evolve.'],
];

const techStack = [
  { name: 'Flutter', role: 'Cross-platform application UI', icon: 'https://cdn.simpleicons.org/flutter/54C5F8' },
  { name: 'Dart', role: 'Application language', icon: 'https://cdn.simpleicons.org/dart/0175C2' },
  { name: 'React.js', role: 'Component-based web interfaces', icon: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'React 19', role: 'Modern interactive UI foundation', icon: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'Next.js', role: 'Stateless PWA presentation shell', icon: 'https://cdn.simpleicons.org/nextdotjs/8B9BB4' },
  { name: 'CSS', role: 'Responsive visual design system', icon: 'https://cdn.simpleicons.org/css/1572B6' },
  { name: 'Tailwind CSS', role: 'Utility-first interface styling', icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
  { name: 'Node.js', role: 'Backend services and APIs', icon: 'https://cdn.simpleicons.org/nodedotjs/5FA04E' },
  { name: 'Express', role: 'REST API framework', icon: 'https://cdn.simpleicons.org/express/8B9BB4' },
  { name: 'NestJS', role: 'Modular-monolith API architecture', icon: 'https://cdn.simpleicons.org/nestjs/E0234E' },
  { name: 'MySQL', role: 'Centralized business data', icon: 'https://cdn.simpleicons.org/mysql/4479A1' },
  { name: 'PostgreSQL', role: 'Durable multi-tenant platform data', icon: 'https://cdn.simpleicons.org/postgresql/4169E1' },
  { name: 'SQLite', role: 'Offline-first local storage', icon: 'https://cdn.simpleicons.org/sqlite/3B82C4' },
  { name: 'Supabase', role: 'Auth, licensing, and cloud workflows', icon: 'https://cdn.simpleicons.org/supabase/3ECF8E' },
  { name: 'Firebase', role: 'Connected service integrations', icon: 'https://cdn.simpleicons.org/firebase/FFCA28' },
  { name: 'Google', role: 'OAuth and Drive backups', icon: 'https://cdn.simpleicons.org/google/4285F4' },
  { name: 'DigitalOcean', role: 'Production backend deployment', icon: 'https://cdn.simpleicons.org/digitalocean/0080FF' },
  { name: 'Vercel', role: 'Web deployment and delivery', icon: 'https://cdn.simpleicons.org/vercel/8B9BB4' },
  { name: 'GitHub', role: 'Source control and collaboration', icon: 'https://cdn.simpleicons.org/github/8B9BB4' },
  { name: 'Docker', role: 'Consistent containerized services', icon: 'https://cdn.simpleicons.org/docker/2496ED' },
  { name: 'Kubernetes', role: 'Container orchestration readiness', icon: 'https://cdn.simpleicons.org/kubernetes/326CE5' },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero eyebrow="Who Am I" title="Technology with a practical point of view." description="I build cross-platform systems that help people, businesses, and communities work with more confidence." />

      <section className="next-section next-container next-about-intro">
        <div>
          <span className="next-label">Full-stack developer · mobile &amp; web</span>
          <h2>Hi, I&apos;m Jay-Be Gubot.</h2>
          <p>I&apos;m driven by the belief that technology should make life simpler, smarter, and more connected. My work focuses on systems that bridge the gap between everyday operations and the possibilities of modern software.</p>
          <p>From point-of-sale terminals to business dashboards and video monitoring tools, I create products that are practical, accessible, and ready to grow.</p>
        </div>
        <Image src="/images/jay-be-gubot.png" alt="Jay-Be Gubot" width={720} height={720} priority />
      </section>

      <section className="next-section next-container">
        <span className="next-eyebrow">Stack specialist</span>
        <h2 className="next-section-title">A practical stack for dependable systems.</h2>
        <p className="next-stack-specialist-intro">These are the technologies I use most throughout my development journey. They help me build practical mobile, web, backend, cloud, and deployment solutions. I keep expanding this stack as every project teaches me a better way to build reliable, useful software.</p>
        <div className="next-stack-specialist-grid">
          {techStack.map((technology) => <article className="next-stack-specialist-card" key={technology.name}><img src={technology.icon} alt={`${technology.name} logo`} loading="lazy" /><div><h3>{technology.name}</h3><p>{technology.role}</p></div></article>)}
        </div>
      </section>

      <section className="next-callout"><div className="next-container"><span className="next-eyebrow">My mission</span><h2>Empower people through clear, capable technology.</h2><p>Great software should do more than function. It should reduce complexity, build confidence, and open new opportunities.</p></div></section>

      <section className="next-section next-container"><span className="next-eyebrow">How I work</span><h2 className="next-section-title">A product mindset from first idea to final handoff.</h2><div className="next-card-grid next-principle-grid">{principles.map(([number, title, text]) => <article className="next-principle-card" key={number}><strong>{number}</strong><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    </main>
  );
}
