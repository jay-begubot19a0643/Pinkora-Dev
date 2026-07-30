import Link from 'next/link';
import { PageHero } from '@/components/page-hero';

const services = [
  { icon: '⌘', title: 'Web Development', text: 'High-performing websites and web applications that feel focused, fast, and easy to use.', features: ['Business websites', 'E-commerce platforms', 'Real-time dashboards'] },
  { icon: '◫', title: 'Business Systems', text: 'Custom systems that turn complex operational work into repeatable, reliable workflows.', features: ['POS systems', 'Inventory management', 'Analytics and reporting'] },
  { icon: '◉', title: 'Mobile Applications', text: 'Cross-platform mobile products that keep your team and customers connected wherever they work.', features: ['Flutter development', 'Offline-first tools', 'Cloud integration'] },
  { icon: '⌁', title: 'System Integration', text: 'Practical integrations that let the tools you already rely on work better together.', features: ['CCTV and POS', 'Data synchronization', 'Custom APIs'] },
];

export default function ServicesPage() {
  return (
    <main>
      <PageHero eyebrow="What we do" title="Systems built around your business." description="Professional software development services shaped around real needs, clear outcomes, and long-term growth." />
      <section className="next-section next-container">
        <p className="next-lead">Pinkora builds practical digital products that make operations smoother and information easier to act on. Every engagement starts by understanding the work behind the screen.</p>
        <div className="next-card-grid next-service-grid">
          {services.map((service) => <article className="next-service-card" key={service.title}><span className="next-service-icon">{service.icon}</span><h2>{service.title}</h2><p>{service.text}</p><ul>{service.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></article>)}
        </div>
      </section>
      <section className="next-section next-container"><div className="next-cta-card"><span className="next-eyebrow">Have a project in mind?</span><h2>Let&apos;s turn the next good idea into a useful product.</h2><p>Tell us what needs to work better. We&apos;ll help map the right path forward.</p><Link href="/contact" className="next-button next-button-primary">Start a project</Link></div></section>
    </main>
  );
}
