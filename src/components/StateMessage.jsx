import { Link } from 'react-router-dom';

/**
 * StateMessage component for displaying:
 * - List fetch errors ("Couldn't load events." + Try Again)
 * - Detail fetch errors ("Couldn't load this event." + Retry)
 * - 404 Not Found ("Event not found." + Back Home link, NO retry button)
 * - Empty state ("No events available right now.")
 */
export function StateMessage({
  type = 'error', // 'error' | 'not-found' | 'empty'
  title,
  message,
  onRetry,
  retryLabel = 'Try Again',
}) {
  const isNotFound = type === 'not-found';
  const isEmpty = type === 'empty';

  return (
    <div
      className={`state-message-container state-${type}`}
      role={isNotFound || isEmpty ? 'status' : 'alert'}
      aria-live="polite"
    >
      <div className="state-message-card">
        <div className="state-icon" aria-hidden="true">
          {isNotFound ? '🔍' : isEmpty ? '📅' : '⚡'}
        </div>
        <h2 className="state-title">{title}</h2>
        {message && <p className="state-description">{message}</p>}

        <div className="state-actions">
          {isNotFound ? (
            <Link to="/" className="btn btn-primary">
              Back Home
            </Link>
          ) : isEmpty ? (
            <Link to="/" className="btn btn-secondary">
              Explore All Events
            </Link>
          ) : (
            onRetry && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onRetry}
              >
                {retryLabel}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
