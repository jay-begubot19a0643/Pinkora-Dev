'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { KuyaJayAssistant } from '@/components/kuya-jay-assistant';

const links = [
  { href: '/', label: 'Overview Page' },
  { href: '/services', label: 'Solutions' },
  { href: '/clients', label: 'Collaborations' },
  { href: '/about', label: 'Who Am I' },
  { href: '/stack', label: 'Tools & Platforms' },
  { href: '/contact', label: 'Get in Touch' },
];

const portfolioLinks = [
  { href: '/portfolio', label: 'Portfolio overview' },
  { href: '/portfolio/voices-of-innovation', label: 'Voices of Innovation' },
  { href: '/portfolio/voices-of-innovation#leaderboard', label: 'Leaderboards' },
  { href: '/portfolio#smart-monitoring-system', label: "Smart M' System" },
  { href: '/portfolio#edukonekta', label: 'EduKonekta' },
];

type AccountUser = { id: string; name: string; email: string };

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [accountUser, setAccountUser] = useState<AccountUser | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTheme('dark');
    document.documentElement.dataset.theme = 'dark';
    localStorage.removeItem('theme');
  }, []);

  useEffect(() => {
    let active = true;

    async function syncAccount() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        if (active) setAccountUser(null);
        return;
      }

      try {
        const response = await fetch('/api/auth/check', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok || !data.success || !data.data) {
          localStorage.removeItem('authToken');
          if (active) setAccountUser(null);
          return;
        }
        if (active) setAccountUser(data.data);
      } catch {
        if (active) setAccountUser(null);
      }
    }

    void syncAccount();
    window.addEventListener('jverse-auth-change', syncAccount);
    return () => {
      active = false;
      window.removeEventListener('jverse-auth-change', syncAccount);
    };
  }, []);

  useEffect(() => {
    const root = contentRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sections = Array.from(root.querySelectorAll<HTMLElement>('main:not(.next-landing-experience) > section'));
    const items = Array.from(root.querySelectorAll<HTMLElement>(
      'main:not(.next-landing-experience) .next-card-grid > article, main:not(.next-landing-experience) .next-flow-grid > div, main:not(.next-landing-experience) .next-about-intro > div, main:not(.next-landing-experience) .next-about-intro > img, main:not(.next-landing-experience) .next-contact-layout > div, main:not(.next-landing-experience) .next-contact-layout > aside',
    ));

    sections.forEach((element) => element.classList.add('next-scroll-reveal'));
    items.forEach((element, index) => {
      element.classList.add('next-scroll-reveal', 'next-scroll-reveal-item');
      element.style.setProperty('--scroll-reveal-delay', `${(index % 6) * 65}ms`);
    });

    const targets = [...new Set([...sections, ...items])];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting)),
      { threshold: 0.12, rootMargin: '0px 0px -7% 0px' },
    );

    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  return (
    <div className="next-site-shell">
      <header className="next-header">
        <div className="next-container next-header-inner">
          <Link href="/" className="next-brand" aria-label="JVerse home">
            <img className="next-brand-logo next-brand-logo-dark" src="/darkmode-logo.png" alt="JVerse" />
            <img className="next-brand-logo next-brand-logo-light" src="/whitemode-logo.png" alt="" aria-hidden="true" />
          </Link>
          <button
            className="next-menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav className={`next-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
            <div className="next-nav-links">
              {links.slice(0, 2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={pathname === link.href ? 'is-active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className={`next-nav-dropdown ${pathname.startsWith('/portfolio') ? 'is-active' : ''}`}>
                <Link href="/portfolio" className="next-nav-portfolio-link" onClick={() => setMenuOpen(false)}>Portfolio</Link>
                <div>
                  {portfolioLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              {links.slice(2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={pathname === link.href ? 'is-active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {accountUser && <span className="next-account-greeting">Hi, {accountUser.name.split(' ')[0]}</span>}
              <Link href={accountUser ? '/account' : '/account?mode=register'} className="next-account-link" onClick={() => setMenuOpen(false)}>
                {accountUser ? 'My Account' : 'Sign up'}
              </Link>
            </div>
            <button className="next-theme-button" type="button" onClick={toggleTheme} aria-label="Toggle color theme">
              {theme === 'dark' ? '☾' : '☀'}
            </button>
          </nav>
        </div>
      </header>
      <div ref={contentRef} className="next-page-content">{children}</div>
      <footer className="next-footer">
        <div className="next-container">
          <span>© {new Date().getFullYear()} JVerse. Built with intention.</span>
          <Link href="/contact">Start a project</Link>
        </div>
      </footer>
      <KuyaJayAssistant />
    </div>
  );
}
