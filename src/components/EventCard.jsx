import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSaved } from '../hooks/useSaved';

export function EventCard({ event, isFeaturedPriority = false, isHeroSpotlight = false }) {
  const [imgError, setImgError] = useState(false);
  const { isSaved, toggleSave } = useSaved();

  if (!event || !event.id) return null;

  const {
    id,
    name,
    blurb,
    category,
    event_mode,
    cover_image_url,
    cover_image_alt,
    price,
    is_per_head,
    total_seats,
    seats_filled,
    registration_status,
  } = event;

  const saved = isSaved(id);

  // Compute price label
  const formattedPrice =
    price === 0 || price === null || price === undefined
      ? 'Free'
      : `₹${Number(price).toLocaleString('en-IN')}${is_per_head ? ' / head' : ' / team'}`;

  // Compute seats remaining
  let seatsRemainingText = null;
  if (typeof total_seats === 'number') {
    const remaining = Math.max(0, total_seats - (Number(seats_filled) || 0));
    if (remaining === 0) {
      seatsRemainingText = 'No seats left';
    } else {
      seatsRemainingText = `${remaining} seat${remaining === 1 ? '' : 's'} left`;
    }
  }

  // Registration badge
  const statusLabel =
    registration_status === 'OPEN'
      ? 'Open'
      : registration_status === 'SOLD_OUT'
      ? 'Sold Out'
      : 'Closed';

  const statusClass =
    registration_status === 'OPEN'
      ? 'status-open'
      : registration_status === 'SOLD_OUT'
      ? 'status-sold-out'
      : 'status-closed';

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(id);
  };

  return (
    <article className={`event-card ${isHeroSpotlight ? 'event-card-hero-spotlight' : ''}`}>
      <Link to={`/event/${id}`} className="event-card-link-overlay" aria-label={`View details for ${name}`}>
        <div className="event-card-media">
          {cover_image_url && !imgError ? (
            <img
              src={cover_image_url}
              alt={cover_image_alt || name}
              loading={isFeaturedPriority ? 'eager' : 'lazy'}
              decoding="async"
              className="event-card-image"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="event-card-fallback-media" aria-hidden="true">
              <span className="fallback-category-icon">✦</span>
              <span className="fallback-category-text">{category || 'Event'}</span>
            </div>
          )}

          <div className="media-overlay-badges">
            {isHeroSpotlight && <span className="badge badge-spotlight">✦ SPOTLIGHT</span>}
            {category && <span className="badge badge-category">{category}</span>}
            {event_mode && <span className="badge badge-mode">{event_mode}</span>}
          </div>

          <button
            type="button"
            className={`card-save-btn ${saved ? 'is-saved' : ''}`}
            onClick={handleSaveClick}
            aria-label={saved ? `Remove ${name} from saved` : `Save ${name}`}
            title={saved ? 'Remove from saved' : 'Save event'}
          >
            <svg
              className="save-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill={saved ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        <div className="event-card-content">
          <div className="card-status-row">
            <span className={`badge-status ${statusClass}`}>
              <span className="status-dot" aria-hidden="true" />
              {statusLabel}
            </span>
            {seatsRemainingText && (
              <span className="card-seats-label">{seatsRemainingText}</span>
            )}
          </div>

          <h3 className="event-card-title">{name}</h3>
          {blurb && <p className="event-card-blurb">{blurb}</p>}

          <div className="event-card-footer">
            <span className="event-card-price">{formattedPrice}</span>
            <span className="card-cta-arrow" aria-hidden="true">
              View Event →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
