import Image from 'next/image';
import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Who Am I',
  description: 'Learn about Jay-Be Gubot, the developer and founder behind JVerse.',
};

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

const certifications = [
  {
    title: 'Introduction to Software Engineering',
    provider: 'IBM',
    issued: 'IBM · Coursera · Jul 2026',
    description: 'Established a foundation in software engineering concepts, development roles, lifecycle thinking, and practical problem-solving.',
    links: [{ href: 'https://coursera.org/verify/PGJ0R77GC2Y7', label: 'Verify on Coursera' }],
  },
  {
    title: 'Software Engineering Essentials',
    provider: 'IBM',
    issued: 'Coursera credential · Jul 2026',
    description: 'Strengthened essential software engineering knowledge for planning, building, testing, and improving useful software products.',
    links: [{ href: 'https://www.credly.com/badges/6f5c381e-d98c-4f96-a414-401d79a08c96', label: 'View credential' }],
  },
  {
    title: 'Getting Started with Git and GitHub',
    provider: 'IBM',
    issued: 'IBM · Coursera · Aug 2026',
    description: 'Built practical version-control and collaboration skills for working with repositories, commits, branches, and GitHub workflows.',
    links: [{ href: 'https://coursera.org/verify/8TBMCKXQHQTH', label: 'Verify on Coursera' }, { href: 'https://www.credly.com/badges/073bd3c5-d112-45d9-8bb6-22ae891b80aa', label: 'View badge' }],
  },
  {
    title: 'Getting Started with an IDE',
    provider: 'IDE',
    issued: 'Course certificate · 2026',
    description: 'Developed familiarity with an integrated development environment and the core workflow for writing, organizing, and debugging code.',
    links: [],
  },
  {
    title: 'Introduction to Cloud Computing',
    provider: 'IBM',
    issued: 'IBM · Coursera · Aug 2026',
    description: 'Learned cloud-computing concepts and how cloud platforms support scalable, accessible, and dependable digital services.',
    links: [{ href: 'https://coursera.org/verify/9APLWP24OG9E', label: 'Verify on Coursera' }, { href: 'https://www.credly.com/badges/59900335-5bf4-44b7-a9fa-dd2d3d405d4c', label: 'View badge' }],
  },
  {
    title: 'Introduction to HTML, CSS, & JavaScript',
    provider: 'IBM',
    issued: 'IBM · Coursera · Aug 2026',
    description: 'Developed core web-development skills for structuring content, styling responsive interfaces, and adding browser-based interaction.',
    links: [{ href: 'https://coursera.org/verify/TJ75WDL3HJC0', label: 'Verify on Coursera' }, { href: 'https://www.credly.com/badges/2fdf9096-138c-4911-962c-f2d676dbb6bc', label: 'View badge' }],
  },
  {
    title: 'HTML Essentials',
    provider: 'Cisco',
    issued: 'DICT-ITU DTC Initiative · Cisco Networking Academy · May 2026',
    description: 'Built foundational skills for structuring accessible web content with HTML and understanding the building blocks of a web page.',
    links: [],
  },
  {
    title: 'English for IT: People and Quantities',
    provider: 'Cisco',
    issued: 'DICT-ITU DTC Initiative · Cisco Networking Academy · May 2026',
    description: 'Developed practical English communication skills for describing people, quantities, and common contexts in information technology.',
    links: [],
  },
  {
    title: 'CSS Essentials',
    provider: 'Cisco',
    issued: 'DICT-ITU DTC Initiative · Cisco Networking Academy · May 2026',
    description: 'Strengthened core styling skills for building clear, responsive, and visually consistent web interfaces with CSS.',
    links: [],
  },
  {
    title: 'Cyber Threat Management',
    provider: 'Cisco',
    issued: 'DICT-ITU DTC Initiative · Cisco Networking Academy · May 2026',
    description: 'Learned the fundamentals of recognizing cyber threats and supporting safer, more resilient digital environments.',
    links: [],
  },
  {
    title: 'Introduction to Modern AI',
    provider: 'Cisco',
    issued: 'Cisco Networking Academy · May 2026',
    description: 'Explored modern artificial intelligence concepts and the responsible use of AI in practical technology work.',
    links: [],
  },
  {
    title: 'Responsive Web Design',
    provider: 'FCC',
    issued: 'freeCodeCamp · May 2026 · Approximately 300 hours',
    description: 'Completed a comprehensive responsive web design curriculum covering semantic HTML, CSS, accessibility, and adaptable layouts.',
    links: [{ href: 'https://freecodecamp.org/certification/jblearn2code/responsive-web-design-v9', label: 'Verify on freeCodeCamp' }],
  },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero eyebrow="Who Am I" title="Technology with a practical point of view." description="I build cross-platform systems that help people, businesses, and communities work with more confidence." />

      <section className="next-section next-container next-about-intro">
        <div>
          <span className="next-label">Full-Stack Developer &amp; Innovator</span>
          <h2>Hi, I&apos;m Jay-Be Gubot.</h2>
          <p>I&apos;m driven by the belief that technology should make life simpler, smarter, and more connected. My work focuses on systems that bridge the gap between everyday operations and the possibilities of modern software.</p>
          <p>From point-of-sale terminals to business dashboards and video monitoring tools, I create products that are practical, accessible, and ready to grow.</p>
        </div>
        <Image src="/images/jay-be-gubot.png" alt="Jay-Be Gubot" width={720} height={720} priority />
      </section>

      <section className="next-section next-container">
        <div className="next-certification-training">
          <div><span className="next-eyebrow">Professional development</span><h2>IBM Full-Stack Software Developer pathway — in progress.</h2><p>I am training toward the IBM Full-Stack Software Developer Professional Certificate with the support of Mapúa College and Arizona State University, continuing to build the skills needed for modern end-to-end software delivery.</p></div>
          <span className="next-certification-status">In progress</span>
        </div>
        <div className="next-section-heading next-certification-heading"><div><span className="next-eyebrow">Professional credentials</span><h2>Certificates earned along the journey.</h2></div><p>Twelve completed courses across IBM, Coursera, Cisco Networking Academy, DICT-ITU DTC Initiative, and freeCodeCamp.</p></div>
        <div className="next-certification-grid">
          {certifications.map((certification) => <article className="next-certification-card" key={certification.title}><span className="next-certification-mark" aria-hidden="true">{certification.provider}</span><p className="next-certification-issued">{certification.issued}</p><h3>{certification.title}</h3><p>{certification.description}</p>{certification.links.length > 0 ? <div className="next-certification-links">{certification.links.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label} <span aria-hidden="true">↗</span></a>)}</div> : <span className="next-certification-evidence">Certificate on file</span>}</article>)}
        </div>
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
