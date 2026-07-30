import { PageHero } from '@/components/page-hero';

const layers = [
  { icon: '◫', title: 'Frontend', tools: 'Next.js 16 · React 19 · TypeScript', text: 'App Router pages provide fast, responsive, component-based user experiences across the portfolio, contact, and account flows.' },
  { icon: '⌁', title: 'Backend', tools: 'Next.js Route Handlers · Node.js', text: 'Server-side API routes handle authentication, contact messages, feedback, recommendations, and health checks in the same application.' },
  { icon: '▦', title: 'Data layer', tools: 'Supabase · PostgreSQL', text: 'Supabase stores users, contacts, feedback, and recommendations while keeping the data model available to the secure server routes.' },
  { icon: '◉', title: 'Security', tools: 'JWT · bcryptjs · Environment variables', text: 'Passwords are hashed before storage, authenticated API calls use bearer tokens, and service credentials remain server-side.' },
  { icon: '✦', title: 'Experience', tools: 'CSS · Responsive design · Theme persistence', text: 'A custom design system supports both light and dark mode, responsive navigation, accessible forms, and reduced-motion preferences.' },
  { icon: '↗', title: 'Delivery', tools: 'Vercel · npm · Next.js build pipeline', text: 'The project is optimized through the Next.js build process and configured for straightforward Vercel deployment.' },
];

export default function StackPage() {
  return (
    <main>
      <PageHero eyebrow="Application architecture" title="The software stack behind JVerse." description="A full-stack Next.js application that brings the frontend, API layer, data, and deployment workflow into one maintainable codebase." />
      <section className="next-section next-container">
        <div className="next-section-heading"><div><span className="next-eyebrow">Core technologies</span><h2>One focused stack, built to grow.</h2></div><p>Each layer has a clear responsibility, making the application easier to maintain, extend, and deploy.</p></div>
        <div className="next-card-grid next-stack-grid">
          {layers.map((layer) => <article className="next-feature-card next-stack-card" key={layer.title}><span>{layer.icon}</span><h3>{layer.title}</h3><strong>{layer.tools}</strong><p>{layer.text}</p></article>)}
        </div>
      </section>
      <section className="next-callout next-stack-flow">
        <div className="next-container"><span className="next-eyebrow">How it works</span><h2>From visitor action to reliable response.</h2><div className="next-flow-grid"><div><strong>01</strong><span>React interface</span><p>A visitor interacts with a Next.js page or form.</p></div><div><strong>02</strong><span>Server route</span><p>A Next.js API handler validates and processes the request.</p></div><div><strong>03</strong><span>Supabase data</span><p>Validated data is stored or returned from the database.</p></div><div><strong>04</strong><span>Clear feedback</span><p>The interface receives a useful, timely response.</p></div></div></div>
      </section>
      <section className="next-section next-container"><div className="next-cta-card"><span className="next-eyebrow">About this application</span><h2>Built as a modern, full-stack portfolio platform.</h2><p>JVerse combines a professional portfolio experience with secure account, contact, feedback, and recommendation capabilities—all in one Next.js application.</p></div></section>
    </main>
  );
}
