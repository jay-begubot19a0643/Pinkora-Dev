import type { Metadata } from 'next';
import './globals.css';
import { SiteShell } from '@/components/site-shell';

export const metadata: Metadata = {
  title: { default: 'JVerse', template: '%s | JVerse' },
  metadataBase: new URL('https://www.jverse.site'),
  description: 'JVerse is the portfolio of Jay-Be Gubot, a Philippines-based full-stack developer building scalable web applications and business systems for startups and SMEs.',
  keywords: ['Full-Stack Developer Philippines', 'App Developer Philippines', 'Web Developer Philippines', 'Next.js Freelancer', 'React Developer', 'Software Developer', 'Business Systems', 'JVerse', 'Jay-Be Gubot'],
  authors: [{ name: 'Jay-Be Gubot' }],
  creator: 'Jay-Be Gubot',
  openGraph: {
    title: 'JVerse | Full-Stack Developer & Innovator',
    description: 'Scalable web applications and business systems for startups and SMEs.',
    url: '/',
    siteName: 'JVerse',
    locale: 'en_PH',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
