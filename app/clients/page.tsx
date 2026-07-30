import Link from 'next/link';
import { PageHero } from '@/components/page-hero';

const clients = [
  { name: 'Ready-to-Wear Flor Store', location: 'Santo Tomas, Biñan, Laguna', status: 'Active project', text: 'A bilingual POS and advanced inventory platform that brings daily store operations into one clear system.', tags: ['POS', 'Inventory', 'Analytics'] },
  { name: 'Growing Local Businesses', location: 'Philippines', status: 'Ongoing partnerships', text: 'Digital tools and web experiences that simplify service delivery, operations, and customer engagement.', tags: ['Web systems', 'Dashboards', 'Integration'] },
];

export default function ClientsPage() {
  return <main><PageHero eyebrow="Partnerships" title="Built alongside ambitious teams." description="We work with businesses and organizations that value thoughtful systems, reliable delivery, and practical innovation." /><section className="next-section next-container"><p className="next-lead">Every client engagement is grounded in the real work people need to do. The result is technology that is easier to trust, operate, and grow with.</p><div className="next-card-grid next-client-grid">{clients.map((client, index) => <article className="next-client-card" key={client.name}><span className="next-client-mark">0{index + 1}</span><span className="next-status">{client.status}</span><h2>{client.name}</h2><p className="next-location">{client.location}</p><p>{client.text}</p><div>{client.tags.map((tag) => <span className="next-tag" key={tag}>{tag}</span>)}</div></article>)}</div></section><section className="next-section next-container"><div className="next-cta-card"><span className="next-eyebrow">Work with Pinkora</span><h2>Looking for a long-term digital partner?</h2><p>We&apos;d love to learn about the work your team is ready to improve.</p><Link href="/contact" className="next-button next-button-primary">Get in touch</Link></div></section></main>;
}
