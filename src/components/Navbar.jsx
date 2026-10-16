import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSaved } from '../hooks/useSaved';
import { useTheme } from '../hooks/useTheme';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { savedCount } = useSaved();
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="site-logo" onClick={closeMenu}>
            <span className="logo-spark" aria-hidden="true">✦</span>
            <span className="logo-text">Render<strong>72</strong></span>
            <span className="logo-badge">CAMPUS</span>
          </Link>

          <nav
            id="primary-nav"
            className={`site-nav ${isOpen ? 'is-open' : ''}`}
            aria-label="Main navigation"
          >
            <ul className="nav-links">
              <li>
                <Link
                  to="/"
                  className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Discover
                </Link>
              </li>
              <li>
                <a
                  href="/#featured"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  Featured
                </a>
              </li>
              <li>
                <a
                  href="/#all-events"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  All Events
                </a>
              </li>
              <li>
                <a
                  href="/#saved-events"
                  className="nav-link nav-saved-link"
                  onClick={closeMenu}
                >
                  <span>Saved</span>
                  {savedCount > 0 && (
                    <span className="saved-counter-badge" aria-label={`${savedCount} saved events`}>
                      {savedCount}
                    </span>
                  )}
                </a>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg
                  className="theme-icon"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  className="theme-icon"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className="mobile-nav-toggle"
              aria-expanded={isOpen}
              aria-controls="primary-nav"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={toggleMenu}
            >
              <span className="hamburger-icon" aria-hidden="true">
                <span className={`line ${isOpen ? 'open' : ''}`}></span>
                <span className={`line ${isOpen ? 'open' : ''}`}></span>
                <span className={`line ${isOpen ? 'open' : ''}`}></span>
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
