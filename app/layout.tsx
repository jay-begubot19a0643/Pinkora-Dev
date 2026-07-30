import type { Metadata } from 'next';
import './globals.css';
import { SiteShell } from '@/components/site-shell';

export const metadata: Metadata = {
  title: { default: 'JVerse', template: '%s | JVerse' },
  description: 'Thoughtful digital systems, websites, and tools for growing teams.',
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
