import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signing In',
  description: 'Completing your secure JVerse sign-in.',
};

export default function AuthCallbackLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
