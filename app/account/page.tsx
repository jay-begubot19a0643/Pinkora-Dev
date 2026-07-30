import { PageHero } from '@/components/page-hero';
import { AccountPanel } from '@/components/account-panel';

export default function AccountPage() {
  return <main><PageHero eyebrow="My account" title="Everything JVerse, in one place." description="Sign in to access your projects, purchases, feedback, and subscriptions." /><section className="next-section next-container next-account-wrap"><AccountPanel /></section></main>;
}
