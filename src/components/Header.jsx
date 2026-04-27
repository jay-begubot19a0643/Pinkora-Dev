import { useState } from 'react'
import './Header.css'

function Header({ theme, onThemeToggle, isAuthenticated }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container header-row">
        <a href="/" className="brand">
          <img src="/images/pinkora_dev.png" alt="Pinkora Dev" className="brand-logo" />
        </a>

        <button 
          className={`hamburger-menu ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/#projects">Projects</a></li>
            <li><a href="/#services">Services</a></li>
            <li><a href="/#clients">Clients</a></li>
            <li className="nav-dropdown">
              <a href="/#about">About me</a>
              <ul className="dropdown-menu">
                <li><a href="/#about">Developer</a></li>
                <li><a href="/#mission">My Mission</a></li>
                <li><a href="/#build">What I Build</a></li>
                <li><a href="/#approach">My Approach</a></li>
              </ul>
            </li>
            <li><a href="/#contact">Contact</a></li>
            {isAuthenticated && <li><a href="/account" className="nav-account-link">👤 My Account</a></li>}
          </ul>

          <button className="theme-toggle" onClick={onThemeToggle} aria-label="Toggle theme">
            <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
