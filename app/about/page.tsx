import Image from 'next/image';
import { PageHero } from '@/components/page-hero';

const principles = [
  ['01', 'Make complexity useful', 'The best technology removes friction and gives people a clearer path through their work.'],
  ['02', 'Build for real life', 'Every product should reflect the environment, constraints, and people it is made for.'],
  ['03', 'Keep improving', 'Strong systems are designed to grow, adapt, and remain useful as needs evolve.'],
];

export default function AboutPage() {
  return <main><PageHero eyebrow="About Pinkora" title="Technology with a practical point of view." description="I build cross-platform systems that help people, businesses, and communities work with more confidence." /><section className="next-section next-container next-about-intro"><div><span className="next-label">Full-stack developer · mobile & web</span><h2>Hi, I&apos;m Jay-Be Gubot.</h2><p>I&apos;m driven by the belief that technology should make life simpler, smarter, and more connected. My work focuses on systems that bridge the gap between everyday operations and the possibilities of modern software.</p><p>From point-of-sale terminals to business dashboards and video monitoring tools, I create products that are practical, accessible, and ready to grow.</p></div><Image src="/images/ako.jpg" alt="Jay-Be Gubot" width={720} height={720} priority /></section><section className="next-callout"><div className="next-container"><span className="next-eyebrow">My mission</span><h2>Empower people through clear, capable technology.</h2><p>Great software should do more than function. It should reduce complexity, build confidence, and open new opportunities.</p></div></section><section className="next-section next-container"><span className="next-eyebrow">How I work</span><h2 className="next-section-title">A product mindset from first idea to final handoff.</h2><div className="next-card-grid next-principle-grid">{principles.map(([number, title, text]) => <article className="next-principle-card" key={number}><strong>{number}</strong><h3>{title}</h3><p>{text}</p></article>)}</div></section></main>;
}
