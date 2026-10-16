import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSaved } from '../hooks/useSaved';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { savedCount } = useSaved();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="site-logo" onClick={closeMenu} aria-label="Render72 Events Home">
            <span className="logo-spark" aria-hidden="true">✦</span>
            <span className="logo-text">Render<strong>72</strong></span>
            <span className="logo-badge">CAMPUS</span>
          </Link>

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
        </div>
      </header>
    </>
  );
}
