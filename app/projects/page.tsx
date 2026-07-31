import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/page-hero';

const monitoringFeatures = [
  ['01', 'Retail operations in one place', 'Point-of-sale checkout, product and barcode management, inventory movement, sales reporting, customer loyalty, suppliers, purchase orders, and delivery workflows work together in one system.'],
  ['02', 'Role-specific workspaces', 'Owners, administrators, managers, cashiers, inventory clerks, sales promoters, delivery receivers, and developers have responsibilities and dashboards designed around their real work.'],
  ['03', 'Monitoring and practical support', 'CCTV configuration and live feeds sit alongside camera timestamps, AI help, user manuals, English and Filipino support, responsive layouts, and accessibility-minded theme controls.'],
  ['04', 'Offline-first, licensed, and recoverable', 'Local storage supports dependable daily work offline, while a Node.js/MySQL backend and cloud services support synchronization, authentication, licensing, backups, restoration, and remote access.'],
];

const eduKonektaLayers = [
  ['01', 'PWA presentation shell', 'A stateless Next.js web application provides the education-focused interface and progressive web app shell.'],
  ['02', 'Modular API', 'A NestJS modular monolith keeps each future domain module self-contained with its controller, services, persistence adapter, events, and tests.'],
  ['03', 'Shared contracts', 'A shared package holds transport contracts and primitives that the web and API layers can use without becoming tightly coupled.'],
  ['04', 'School-scoped data', 'Every tenant-scoped record carries a school identifier. The API resolves tenant context at its boundary and passes it explicitly to services and repositories.'],
];

export default function ProjectsPage() {
  return (
    <main>
      <PageHero eyebrow="Portfolio" title="Practical technology, thoughtfully connected." description="Solutions that enhance visibility, strengthen operations, and help teams move with confidence." />

      <section className="next-section next-container">
        <span className="next-label">Featured project</span>
        <h2 id="smart-monitoring-system" className="next-project-title">Smart Monitoring System</h2>
        <p className="next-project-summary">A cross-platform retail and business operations system that brings sales, inventory, workforce, monitoring, licensing, and cloud-connected workflows into one dependable application.</p>
        <div className="next-demo-frame"><iframe src="https://www.youtube.com/embed/jnUGORZ1tUo?start=77" title="Smart Store Monitoring System demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
      </section>

      <section className="next-section next-container next-detail-section">
        <div><span className="next-eyebrow">Overview</span><h2>One system for the everyday business.</h2></div>
        <p>Built with Flutter for Windows, Android, iOS, macOS, Linux, and the web, Smart Monitoring System reduces the need for disconnected tools. Local storage keeps core work practical when connectivity is limited, while a Node.js/MySQL backend and selected cloud services support synchronization, authentication, email, licensing, and remote access.</p>
      </section>

      <section className="next-section next-container">
        <span className="next-eyebrow">Key features</span>
        <h2 className="next-section-title">A practical foundation for the whole operation.</h2>
        <div className="next-card-grid next-feature-grid">{monitoringFeatures.map(([number, title, text]) => <article className="next-feature-card" key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="next-callout">
        <div className="next-container">
          <span className="next-eyebrow">Development journey</span>
          <h2>Six months of building around real responsibilities.</h2>
          <p>The project grew from a Flutter POS prototype into a multi-role business platform through continuous implementation, testing, debugging, and refinement. The work strengthened subscription and activation-code security, business data isolation, synchronization safeguards, responsive behavior, backup and restore, platform-specific fallbacks, and clearer recovery flows for expired subscriptions.</p>
        </div>
      </section>

      <section className="next-section next-container next-edu-project-intro">
        <div className="next-project-logo-panel"><Image src="/images/edukonekta.png" alt="EduKonekta logo" fill sizes="(max-width: 800px) 100vw, 38vw" /></div>
        <div>
          <span className="next-label">Education technology</span>
          <h2 id="edukonekta" className="next-project-title">EduKonekta</h2>
          <p className="next-project-summary">A multi-tenant education platform designed to connect schools through a resilient PWA experience, clear domain boundaries, and secure school-scoped data.</p>
          <p className="next-lead">Its foundation keeps the web interface stateless, the API modular, and shared contracts independent—so the platform can grow without losing clarity.</p>
        </div>
      </section>

      <section className="next-section next-container">
        <span className="next-eyebrow">Foundation architecture</span>
        <h2 className="next-section-title">Built for clear boundaries and growing schools.</h2>
        <div className="next-card-grid next-feature-grid">{eduKonektaLayers.map(([number, title, text]) => <article className="next-feature-card" key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="next-callout">
        <div className="next-container">
          <span className="next-eyebrow">Reliable operations</span>
          <h2>Ready for the work behind the platform.</h2>
          <p>EduKonekta uses versioned API routes, a health endpoint that checks API and PostgreSQL reachability, request IDs in normalized errors, and structured JSON logs. Its event and job contracts are prepared for an outbox-backed publisher and independently deployable workers when the platform needs them.</p>
        </div>
      </section>

      <section className="next-section next-container">
        <div className="next-cta-card"><span className="next-eyebrow">Your next system</span><h2>Need a solution shaped around your workflow?</h2><p>Let&apos;s design the tools that make your team more capable every day.</p><Link href="/contact" className="next-button next-button-primary">Discuss a project</Link></div>
      </section>
    </main>
  );
}
