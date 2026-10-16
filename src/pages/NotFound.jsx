import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  useEffect(() => {
    document.title = 'Event not found. | Render72';
  }, []);

  return (
    <main id="main-content" className="not-found-page" role="status" aria-live="polite">
      <div className="not-found-card">
        <div className="not-found-icon" aria-hidden="true">🌌</div>
        <h1 className="not-found-title">Event not found.</h1>
        <p className="not-found-description">
          The page or event link you navigated to does not exist, or the event has concluded and moved archives.
        </p>
        <Link to="/" className="btn btn-primary">
          Back Home
        </Link>
      </div>
    </main>
  );
}
