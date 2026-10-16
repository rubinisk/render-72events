import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand-col">
          <Link to="/" className="site-logo">
            <span className="logo-spark" aria-hidden="true">✦</span>
            <span className="logo-text">Render<strong>72</strong></span>
            <span className="logo-badge">CAMPUS</span>
          </Link>
          <p className="footer-tagline">
            Discover hackathons, creative summits, esports cups, and hands-on workshops across premier campuses.
          </p>
          <div className="footer-status-pill">
            <span className="status-dot-pulse" aria-hidden="true" />
            <span>Render72 Live Hackathon Build</span>
          </div>
        </div>

        <div className="footer-links-col">
          <h2 className="footer-heading">Navigation</h2>
          <ul className="footer-link-list">
            <li><Link to="/">Home & Discovery</Link></li>
            <li><a href="/#featured">Featured Spotlights</a></li>
            <li><a href="/#all-events">Browse All Events</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h2 className="footer-heading">Event Modes</h2>
          <ul className="footer-link-list">
            <li><span className="footer-mode-pill">In-Person Sprints</span></li>
            <li><span className="footer-mode-pill">Online Hackathons</span></li>
            <li><span className="footer-mode-pill">Hybrid Summits</span></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h2 className="footer-heading">Platform</h2>
          <p className="footer-microcopy">
            Built with pure React & modern CSS. Zero third-party UI bloat. High-performance, accessible, responsive.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">
          © {currentYear} Render72 Events. Built for the Render72 Hackathon.
        </p>
        <p className="footer-note">
          Designed with system typography and accessible markup.
        </p>
      </div>
    </footer>
  );
}
