import { PageHero } from '@/components/page-hero';
import { ContactForm } from '@/components/contact-form';

export default function ContactPage() {
  return <main><PageHero eyebrow="Get in Touch" title="Let&apos;s make something useful." description="Tell us about the system, product, or workflow you want to improve." /><section className="next-section next-container next-contact-layout"><div className="next-form-card"><span className="next-eyebrow">Send a message</span><h2>Start with the challenge.</h2><ContactForm /></div><aside className="next-contact-aside"><div><span className="next-eyebrow">JVerse</span><h2>Built with clarity and care.</h2><p>We create digital systems that support people and strengthen the work behind the business.</p></div><div><h3>Email</h3><a href="mailto:gubotjaybe26@gmail.com">gubotjaybe26@gmail.com</a></div><div><h3>Social</h3><p>Facebook · YouTube · LinkedIn</p></div></aside></section></main>;
}
