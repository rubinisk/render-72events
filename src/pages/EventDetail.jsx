import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { fetchEventById } from '../lib/api';
import { StateMessage } from '../components/StateMessage';
import { EventDetailSkeleton } from '../components/Skeletons';
import { useSaved } from '../hooks/useSaved';

export function EventDetail() {
  const { id } = useParams();
  const [bannerError, setBannerError] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { isSaved, toggleSave } = useSaved();

  const fetcher = useCallback(
    ({ signal }) => fetchEventById(id, { signal }),
    [id]
  );

  const { data: event, loading, error, refetch } = useFetch(fetcher, [id]);

  useEffect(() => {
    if (event?.name) {
      document.title = `${event.name} | Render72`;
    } else if (error) {
      document.title = error.isNotFound ? 'Event not found. | Render72' : 'Error | Render72';
    } else {
      document.title = 'Loading event... | Render72';
    }
  }, [event, error]);

  // Loading state
  if (loading) {
    return (
      <main id="main-content" className="event-detail-page">
        <EventDetailSkeleton />
      </main>
    );
  }

  // Error state: specifically handle 404 vs retryable errors
  if (error) {
    const is404 = error.isNotFound || error.status === 404;
    return (
      <main id="main-content" className="event-detail-page">
        {is404 ? (
          <StateMessage
            type="not-found"
            title="Event not found."
            message="The event ID you requested does not exist or has been retired from the catalogue."
          />
        ) : (
          <StateMessage
            type="error"
            title="Couldn't load this event."
            message={error.message || 'An error occurred while connecting to the event server.'}
            onRetry={refetch}
            retryLabel="Retry"
          />
        )}
      </main>
    );
  }

  if (!event) {
    return (
      <main id="main-content" className="event-detail-page">
        <StateMessage
          type="not-found"
          title="Event not found."
          message="No event details could be found for this request."
        />
      </main>
    );
  }

  const {
    name,
    blurb,
    description,
    category,
    tags,
    event_mode,
    event_status,
    banner_image_url,
    banner_image_alt,
    cover_image_url,
    cover_image_alt,
    gallery_images,
    highlights,
    what_to_expect,
    eligibility,
    prerequisites,
    rules,
    prizes,
    faqs,
    schedules,
    price,
    is_per_head,
    min_teamsize,
    max_teamsize,
    total_seats,
    seats_filled,
    registration_deadline,
    registration_status,
    organizers,
    coordinators,
    schedule_summary,
  } = event;

  const saved = isSaved(id);

  // Formatted price
  const formattedPrice =
    price === 0 || price === null || price === undefined
      ? 'Free'
      : `₹${Number(price).toLocaleString('en-IN')}`;

  const priceSuffix = price > 0 ? (is_per_head ? 'per participant' : 'per team') : 'no entry fee';

  // Seats calculation
  const hasSeatsInfo = typeof total_seats === 'number';
  const remainingSeats = hasSeatsInfo ? Math.max(0, total_seats - (Number(seats_filled) || 0)) : null;

  // Deadline formatting
  let formattedDeadline = null;
  if (registration_deadline) {
    try {
      const d = new Date(registration_deadline);
      if (!isNaN(d.getTime())) {
        formattedDeadline = d.toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    } catch {
      formattedDeadline = registration_deadline;
    }
  }

  // Team size formatting
  let teamSizeText = null;
  if (min_teamsize !== undefined && max_teamsize !== undefined) {
    if (min_teamsize === max_teamsize) {
      teamSizeText = min_teamsize === 1 ? 'Solo (1 person)' : `${min_teamsize} members`;
    } else {
      teamSizeText = `${min_teamsize} – ${max_teamsize} members`;
    }
  }

  // Registration disabled condition
  const isRegistrationClosed =
    registration_status === 'CLOSED' ||
    registration_status === 'SOLD_OUT' ||
    (hasSeatsInfo && remainingSeats === 0);

  const regButtonLabel =
    registered
      ? 'Registration Confirmed ✓'
      : registration_status === 'SOLD_OUT' || remainingSeats === 0
      ? 'Sold Out'
      : registration_status === 'CLOSED'
      ? 'Registration Closed'
      : 'Register for Event';

  const handleRegister = () => {
    if (isRegistrationClosed) return;
    setRegistered(true);
  };

  const imageSrc = banner_image_url || cover_image_url;
  const imageAlt = banner_image_alt || cover_image_alt || name;

  return (
    <main id="main-content" className="event-detail-page">
      {/* Back button */}
      <nav className="detail-breadcrumb" aria-label="Breadcrumb navigation">
        <Link to="/" className="btn-back">
          <span aria-hidden="true">←</span> Back to Events
        </Link>
      </nav>

      {/* Hero Header */}
      <header className="detail-header">
        <div className="detail-header-badges">
          {category && <span className="badge badge-category">{category}</span>}
          {event_mode && <span className="badge badge-mode">{event_mode}</span>}
          {event_status && (
            <span className={`badge badge-status status-${event_status.toLowerCase()}`}>
              {event_status}
            </span>
          )}
        </div>

        <h1 className="detail-title">{name}</h1>

        {blurb && <p className="detail-blurb">{blurb}</p>}

        {/* Banner image: above fold, fetchPriority="high", NOT lazy-loaded */}
        <div className="detail-banner-container">
          {imageSrc && !bannerError ? (
            <img
              src={imageSrc}
              alt={imageAlt}
              fetchPriority="high"
              decoding="async"
              className="detail-banner-image"
              onError={() => setBannerError(true)}
            />
          ) : (
            <div className="detail-banner-fallback" aria-hidden="true">
              <span className="fallback-category-icon">✦</span>
              <span className="fallback-banner-title">{name}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {Array.isArray(tags) && tags.length > 0 && (
          <div className="detail-tags-row" aria-label="Event tags">
            {tags.map((tag, idx) => (
              <span key={idx} className="detail-tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Main Two-Column Layout */}
      <div className="detail-columns-layout">
        {/* Left Column: Rich Details */}
        <div className="detail-main-column">
          {/* About / Description */}
          {description && (
            <section className="detail-section" aria-labelledby="section-about">
              <h2 id="section-about" className="section-heading">About the Event</h2>
              <div className="description-content">
                {description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          {/* Highlights */}
          {Array.isArray(highlights) && highlights.length > 0 && (
            <section className="detail-section" aria-labelledby="section-highlights">
              <h2 id="section-highlights" className="section-heading">Key Highlights</h2>
              <ul className="highlight-cards-grid">
                {highlights.map((item, idx) => (
                  <li key={idx} className="highlight-card">
                    <span className="highlight-bullet-spark" aria-hidden="true">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* What to Expect */}
          {Array.isArray(what_to_expect) && what_to_expect.length > 0 && (
            <section className="detail-section" aria-labelledby="section-expect">
              <h2 id="section-expect" className="section-heading">What to Expect</h2>
              <div className="timeline-steps">
                {what_to_expect.map((step, idx) => (
                  <div key={idx} className="timeline-step">
                    <div className="step-number" aria-hidden="true">{idx + 1}</div>
                    <div className="step-body">
                      <p>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Schedules */}
          {((Array.isArray(schedules) && schedules.length > 0) || schedule_summary) && (
            <section className="detail-section" aria-labelledby="section-schedule">
              <h2 id="section-schedule" className="section-heading">Event Schedule & Venues</h2>

              {schedule_summary && (
                <div className="schedule-summary-card">
                  <div className="summary-title">Summary Timeline</div>
                  <div className="summary-dates">
                    <span>From: {schedule_summary.start_date} ({schedule_summary.start_time})</span>
                    <span>To: {schedule_summary.end_date} ({schedule_summary.end_time})</span>
                  </div>
                </div>
              )}

              {Array.isArray(schedules) && schedules.length > 0 && (
                <div className="schedules-grid">
                  {schedules.map((item, idx) => (
                    <div key={idx} className="schedule-card">
                      <div className="schedule-date-badge">
                        <span className="cal-icon" aria-hidden="true">📅</span>
                        <strong>{item.event_date}</strong>
                      </div>
                      <div className="schedule-times">
                        <span className="time-badge">🕒 {item.start_time} – {item.end_time}</span>
                      </div>
                      {item.venue && (
                        <div className="schedule-venue">
                          <span className="venue-icon" aria-hidden="true">📍</span>
                          <span>{item.venue}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Prizes */}
          {Array.isArray(prizes) && prizes.length > 0 && (
            <section className="detail-section" aria-labelledby="section-prizes">
              <h2 id="section-prizes" className="section-heading">Prizes & Recognition</h2>
              <div className="prizes-grid">
                {prizes.map((prize, idx) => (
                  <div key={idx} className={`prize-card rank-${prize.rank || 'other'}`}>
                    <div className="prize-rank-badge">
                      {prize.rank === 1 ? '🥇 1st Place' : prize.rank === 2 ? '🥈 2nd Place' : prize.rank === 3 ? '🥉 3rd Place' : `Rank ${prize.rank}`}
                    </div>
                    <div className="prize-title">{prize.title}</div>
                    {typeof prize.amount === 'number' && (
                      <div className="prize-amount">
                        ₹{prize.amount.toLocaleString('en-IN')}
                      </div>
                    )}
                    {prize.description && (
                      <p className="prize-desc">{prize.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Eligibility */}
          {eligibility && (Array.isArray(eligibility) ? eligibility.length > 0 : true) && (
            <section className="detail-section" aria-labelledby="section-eligibility">
              <h2 id="section-eligibility" className="section-heading">Eligibility Criteria</h2>
              {Array.isArray(eligibility) ? (
                <ul className="detail-list">
                  {eligibility.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{eligibility}</p>
              )}
            </section>
          )}

          {/* Prerequisites */}
          {prerequisites && (Array.isArray(prerequisites) ? prerequisites.length > 0 : true) && (
            <section className="detail-section" aria-labelledby="section-prerequisites">
              <h2 id="section-prerequisites" className="section-heading">Prerequisites & Equipment</h2>
              {Array.isArray(prerequisites) ? (
                <ul className="detail-list">
                  {prerequisites.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{prerequisites}</p>
              )}
            </section>
          )}

          {/* Rules */}
          {rules && (Array.isArray(rules) ? rules.length > 0 : true) && (
            <section className="detail-section" aria-labelledby="section-rules">
              <h2 id="section-rules" className="section-heading">Rules & Code of Conduct</h2>
              {Array.isArray(rules) ? (
                <ol className="rules-numbered-list">
                  {rules.map((rule, idx) => (
                    <li key={idx} className="rule-item">
                      <span className="rule-index">{idx + 1}.</span>
                      <span className="rule-text">{rule}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>{rules}</p>
              )}
            </section>
          )}

          {/* FAQ (using native <details> / <summary>, no library) */}
          {Array.isArray(faqs) && faqs.length > 0 && (
            <section className="detail-section" aria-labelledby="section-faqs">
              <h2 id="section-faqs" className="section-heading">Frequently Asked Questions</h2>
              <div className="faq-accordion-group">
                {faqs.map((faq, idx) => (
                  <details key={idx} className="faq-item">
                    <summary className="faq-question">
                      <span>{faq.question}</span>
                      <span className="faq-chevron" aria-hidden="true">▾</span>
                    </summary>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Organizers & Coordinators */}
          {((Array.isArray(organizers) && organizers.length > 0) || (Array.isArray(coordinators) && coordinators.length > 0)) && (
            <section className="detail-section" aria-labelledby="section-contacts">
              <h2 id="section-contacts" className="section-heading">Organizers & Contacts</h2>
              <div className="contacts-grid">
                {Array.isArray(organizers) &&
                  organizers.map((org, idx) => (
                    <div key={org.id || idx} className="contact-card org-card">
                      <span className="contact-role-tag">{org.org_type || 'ORGANIZER'}</span>
                      <h3 className="contact-name">{org.name}</h3>
                    </div>
                  ))}

                {Array.isArray(coordinators) &&
                  coordinators.map((coord, idx) => (
                    <div key={coord.id || idx} className="contact-card coord-card">
                      <span className="contact-role-tag">{coord.role || 'Coordinator'}</span>
                      <h3 className="contact-name">{coord.name}</h3>
                      {coord.contact && (
                        <a href={`mailto:${coord.contact}`} className="contact-link">
                          ✉ {coord.contact}
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Gallery Images */}
          {Array.isArray(gallery_images) && gallery_images.length > 0 && (
            <section className="detail-section" aria-labelledby="section-gallery">
              <h2 id="section-gallery" className="section-heading">Event Gallery</h2>
              <div className="gallery-grid">
                {gallery_images.map((imgUrl, idx) => (
                  <div key={idx} className="gallery-item">
                    <img
                      src={imgUrl}
                      alt={`${name} gallery photo ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="gallery-image"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Sticky Registration Card */}
        <aside className="detail-sidebar" aria-label="Registration and Ticket summary">
          <div className="sticky-registration-card">
            <div className="reg-price-block">
              <span className="reg-price-label">Registration</span>
              <div className="reg-price-value-row">
                <span className="reg-price-amount">{formattedPrice}</span>
                <span className="reg-price-suffix">{priceSuffix}</span>
              </div>
            </div>

            <div className="reg-status-divider" />

            <div className="reg-meta-list">
              {/* Registration Status */}
              <div className="reg-meta-row">
                <span className="meta-label">Status</span>
                <span
                  className={`badge-status ${
                    registration_status === 'OPEN'
                      ? 'status-open'
                      : registration_status === 'SOLD_OUT'
                      ? 'status-sold-out'
                      : 'status-closed'
                  }`}
                >
                  <span className="status-dot" aria-hidden="true" />
                  {registration_status || 'CLOSED'}
                </span>
              </div>

              {/* Seats Remaining */}
              {hasSeatsInfo && (
                <div className="reg-meta-row">
                  <span className="meta-label">Seats Remaining</span>
                  <span className="meta-value seats-value">
                    {remainingSeats === 0 ? (
                      <span className="sold-out-text">Full (0 seats)</span>
                    ) : (
                      `${remainingSeats} of ${total_seats}`
                    )}
                  </span>
                </div>
              )}

              {/* Deadline */}
              {formattedDeadline && (
                <div className="reg-meta-row">
                  <span className="meta-label">Registration Closes</span>
                  <span className="meta-value">{formattedDeadline}</span>
                </div>
              )}

              {/* Team Size */}
              {teamSizeText && (
                <div className="reg-meta-row">
                  <span className="meta-label">Team Formation</span>
                  <span className="meta-value">{teamSizeText}</span>
                </div>
              )}

              {/* Mode */}
              {event_mode && (
                <div className="reg-meta-row">
                  <span className="meta-label">Format</span>
                  <span className="meta-value">{event_mode}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="reg-actions-block">
              <button
                type="button"
                className={`btn btn-primary btn-block ${isRegistrationClosed ? 'btn-disabled' : ''}`}
                disabled={isRegistrationClosed || registered}
                onClick={handleRegister}
              >
                {regButtonLabel}
              </button>

              <button
                type="button"
                className={`btn btn-secondary btn-block ${saved ? 'is-saved' : ''}`}
                onClick={() => toggleSave(id)}
              >
                <svg
                  className="save-icon-inline"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill={saved ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span>{saved ? 'Saved to Your List' : 'Save Event'}</span>
              </button>
            </div>

            {registered && (
              <div className="reg-success-banner" role="status">
                🎉 You are registered! Confirmation and calendar invitation sent.
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
