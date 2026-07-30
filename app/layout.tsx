import type { Metadata } from 'next';
import './globals.css';
import { SiteShell } from '@/components/site-shell';

export const metadata: Metadata = {
  title: { default: 'Pinkora Dev', template: '%s | Pinkora Dev' },
  description: 'Thoughtful digital systems, websites, and tools for growing teams.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
