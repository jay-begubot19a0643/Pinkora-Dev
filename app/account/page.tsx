import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { AccountPanel } from '@/components/account-panel';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Sign up, sign in, and manage your JVerse account.',
};

export default function AccountPage() {
  return <main><PageHero eyebrow="My account" title="Your personal JVerse space." description="Create an account, manage your profile, and keep your JVerse experience personal." /><section className="next-section next-container next-account-wrap"><AccountPanel /></section></main>;
}
