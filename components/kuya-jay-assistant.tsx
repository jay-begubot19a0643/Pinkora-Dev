'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { jverseJourney } from '@/lib/jverse-journey';

type AssistantLink = { href: string; label: string };
type AssistantMessage = { from: 'assistant' | 'visitor'; text: string; links?: AssistantLink[] };

const quickQuestions = ['What is the JVerse journey?', 'What solutions do you offer?', 'Show me the portfolio', 'What advice do you have for developers?'];

function AssistantAvatar() {
  return <span className="next-assistant-avatar" aria-hidden="true"><img className="next-assistant-logo-dark" src="/darkmode-logo.png" alt="" /><img className="next-assistant-logo-light" src="/whitemode-logo.png" alt="" /></span>;
}

function answerQuestion(question: string): Omit<AssistantMessage, 'from'> {
  const input = question.toLowerCase();

  if (/\b(hello|hi|hey)\b|good (morning|afternoon|evening)/.test(input)) return { text: 'Hi! I’m Kuya Jay Assistant. I can help you explore JVerse, its services, projects, technology stack, and contact options.', links: [{ href: '/about', label: 'About JVerse' }, { href: '/contact', label: 'Contact Jay-Be' }] };
  if (/advice|aspiring|student|learn|beginner|next generation|it professional/.test(input)) return { text: jverseJourney.developerAdvice, links: [{ href: '/about', label: 'Who Am I' }, { href: '/stack', label: 'Tools & Platforms' }] };
  if (/non.?tech|not.*developer|outside.*tech|other field|coding race/.test(input)) return { text: jverseJourney.nonTechAdvice, links: [{ href: '/about', label: 'Who Am I' }] };
  if (/current position|today|founder|freelance|incoming software/.test(input)) return { text: jverseJourney.today, links: [{ href: '/about', label: 'Who Am I' }, { href: '/projects', label: 'Portfolio' }] };
  if (/drain|drive|exhaust|burnout|resilien|struggle|challenge/.test(input)) return { text: jverseJourney.resilience, links: [{ href: '/about', label: 'Who Am I' }] };
  if (/identity|creator|strategist|coder|impact/.test(input)) return { text: jverseJourney.identity, links: [{ href: '/about', label: 'Who Am I' }] };
  if (/technical battle|debug|scalab|integration|framework/.test(input)) return { text: jverseJourney.technical, links: [{ href: '/projects', label: 'Portfolio' }, { href: '/stack', label: 'Tools & Platforms' }] };
  if (/role|grind|marketer|trainer|problem solver/.test(input)) return { text: jverseJourney.roles, links: [{ href: '/about', label: 'Who Am I' }] };
  if (/journey|story|beginning|origin|vision|why.*jverse/.test(input)) return { text: jverseJourney.beginning, links: [{ href: '/about', label: 'Who Am I' }, { href: '/projects', label: 'Portfolio' }] };
  if (/service|solution|offer|build|develop|website|mobile|system/.test(input)) return { text: 'JVerse builds websites, business systems, mobile applications, system integrations, dashboards, and practical digital tools shaped around real workflows.', links: [{ href: '/services', label: 'Explore solutions' }] };
  if (/project|portfolio|smart monitoring|edukonekta|monitoring/.test(input)) return { text: 'The portfolio includes Smart Monitoring System for retail and business operations, plus EduKonekta, a multi-tenant education platform. You can explore their architecture and capabilities on the Portfolio page.', links: [{ href: '/projects', label: 'View portfolio' }] };
  if (/stack|technology|tech|flutter|next|react|node|docker|kubernetes/.test(input)) return { text: 'The stack covers cross-platform, web, backend, data, cloud, and deployment tools—including Flutter, React, Next.js, Node.js, NestJS, MySQL, PostgreSQL, Docker, Kubernetes, Vercel, and more.', links: [{ href: '/about', label: 'View stack specialist' }, { href: '/stack', label: 'Tools & Platforms' }] };
  if (/about|jay-be|jay be|developer|experience|who/.test(input)) return { text: 'Jay-Be Gubot is a full-stack developer focused on practical systems that make work clearer, smarter, and easier to manage.', links: [{ href: '/about', label: 'Who Am I' }] };
  if (/contact|email|hire|start|message|work together|get in touch/.test(input)) return { text: 'You can send a project inquiry through the contact form. Share the workflow or problem you want to improve, and JVerse can help map the right solution.', links: [{ href: '/contact', label: 'Get in Touch' }] };
  if (/client|testimonial|collaboration|partner|business/.test(input)) return { text: 'JVerse works with businesses and organizations that value thoughtful systems, reliable delivery, and practical innovation.', links: [{ href: '/clients', label: 'Collaborations' }] };
  if (/account|login|sign in|register/.test(input)) return { text: 'The account area provides access to projects, feedback, subscriptions, and account features.', links: [{ href: '/account', label: 'Go to my account' }] };
  if (/dark|light|theme/.test(input)) return { text: 'JVerse supports both dark and light modes. Use the theme button in the navigation to switch between them; your preference is saved on this device.' };

  return { text: 'I can help you find information about JVerse, its solutions, portfolio, technology stack, collaborations, and contact options. Try asking about one of those topics.', links: [{ href: '/services', label: 'Solutions' }, { href: '/projects', label: 'Portfolio' }, { href: '/contact', label: 'Get in Touch' }] };
}

export function KuyaJayAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([{ from: 'assistant', text: 'Hi, I’m Kuya Jay Assistant. Ask me anything about JVerse and I’ll guide you to the right place.' }]);

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;
    setMessages((current) => [...current, { from: 'visitor', text: trimmedQuestion }, { from: 'assistant', ...answerQuestion(trimmedQuestion) }]);
    setQuestion('');
  }

  function askQuickQuestion(quickQuestion: string) {
    setMessages((current) => [...current, { from: 'visitor', text: quickQuestion }, { from: 'assistant', ...answerQuestion(quickQuestion) }]);
  }

  return (
    <aside className={`next-assistant ${open ? 'is-open' : ''}`} aria-label="Kuya Jay Assistant">
      {open && <section className="next-assistant-panel" aria-live="polite">
        <header className="next-assistant-header"><div><AssistantAvatar /><div><strong>Kuya Jay Assistant</strong><span>JVerse guide</span></div></div><button type="button" onClick={() => setOpen(false)} aria-label="Close Kuya Jay Assistant">×</button></header>
        <div className="next-assistant-messages">{messages.map((message, index) => <div className={`next-assistant-message is-${message.from}`} key={`${message.from}-${index}`}><p>{message.text}</p>{message.links && <div className="next-assistant-links">{message.links.map((link) => <Link href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</div>}</div>)}</div>
        <div className="next-assistant-suggestions">{quickQuestions.map((quickQuestion) => <button type="button" key={quickQuestion} onClick={() => askQuickQuestion(quickQuestion)}>{quickQuestion}</button>)}</div>
        <form className="next-assistant-form" onSubmit={submitQuestion}><label className="sr-only" htmlFor="kuya-jay-question">Ask Kuya Jay Assistant</label><input id="kuya-jay-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about JVerse..." /><button type="submit" aria-label="Send question">Send</button></form>
      </section>}
      {!open && <span className="next-assistant-greeting">Hi, I&apos;m here!</span>}
      <button className="next-assistant-launcher" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-controls="kuya-jay-question"><AssistantAvatar /><span>{open ? 'Close assistant' : 'Ask Kuya Jay'}</span></button>
    </aside>
  );
}
