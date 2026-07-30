'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/clients', label: 'Clients' },
  { href: '/about', label: 'About' },
  { href: '/stack', label: 'Stack' },
  { href: '/contact', label: 'Contact' },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const nextTheme = savedTheme ?? 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
  }

  return (
    <div className="next-site-shell">
      <header className="next-header">
        <div className="next-container next-header-inner">
          <Link href="/" className="next-brand" aria-label="Pinkora Dev home">
            <img src="/images/pinkora_dev.png" alt="Pinkora Dev" />
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
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={pathname === link.href ? 'is-active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/account" className="next-account-link" onClick={() => setMenuOpen(false)}>
                My Account
              </Link>
            </div>
            <button className="next-theme-button" type="button" onClick={toggleTheme} aria-label="Toggle color theme">
              {theme === 'dark' ? '☾' : '☀'}
            </button>
          </nav>
        </div>
      </header>
      {children}
      <footer className="next-footer">
        <div className="next-container">
          <span>© {new Date().getFullYear()} Pinkora Dev. Built with intention.</span>
          <Link href="/contact">Start a project</Link>
        </div>
      </footer>
    </div>
  );
}
