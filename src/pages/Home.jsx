import { useState, useMemo, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { fetchEvents } from '../lib/api';
import { EventCard } from '../components/EventCard';
import { StateMessage } from '../components/StateMessage';
import { HomeSkeleton } from '../components/Skeletons';
import { useSaved } from '../hooks/useSaved';

export function Home() {
  const { data: events, loading, error, refetch } = useFetch(fetchEvents, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const { savedIds, savedCount } = useSaved();

  useEffect(() => {
    document.title = 'Render72 Events | Discover Campus Hackathons & Summits';
  }, []);

  // Compute categories dynamically
  const categories = useMemo(() => {
    if (!events || !Array.isArray(events)) return [];
    const set = new Set();
    events.forEach((ev) => {
      if (ev.category && typeof ev.category === 'string') {
        set.add(ev.category.trim());
      }
    });
    return Array.from(set).sort();
  }, [events]);

  // Featured events
  const featuredEvents = useMemo(() => {
    if (!events || !Array.isArray(events)) return [];
    return events.filter((ev) => Boolean(ev.is_featured));
  }, [events]);

  // Filtered all events
  const filteredEvents = useMemo(() => {
    if (!events || !Array.isArray(events)) return [];
    return events.filter((ev) => {
      // Category filter
      if (selectedCategory !== 'ALL' && ev.category !== selectedCategory) {
        return false;
      }
      // Saved filter
      if (showSavedOnly && !savedIds.has(ev.id)) {
        return false;
      }
      // Search query filter (name or blurb)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = ev.name?.toLowerCase().includes(query);
        const blurbMatch = ev.blurb?.toLowerCase().includes(query);
        const tagMatch = Array.isArray(ev.tags) && ev.tags.some(t => t.toLowerCase().includes(query));
        if (!nameMatch && !blurbMatch && !tagMatch) {
          return false;
        }
      }
      return true;
    });
  }, [events, selectedCategory, showSavedOnly, searchQuery, savedIds]);

  return (
    <main id="main-content" className="home-page">
      {/* Hero Section */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-glow-layer" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-pill-announcement">
            <span className="hero-spark">✦</span>
            <span>Render72 Campus Season • 30+ Exclusive Events</span>
          </div>

          <h1 id="hero-title" className="hero-title">
            Where ambitious student creators <span className="gradient-text">build & compete.</span>
          </h1>

          <p className="hero-lead">
            Explore 24-hour hackathons, algorithmic sprints, robotics arenas, and design teardowns.
            No barriers, real mentors, verified campus prizes.
          </p>

          <div className="hero-stats-row">
            <div className="hero-stat">
              <span className="stat-number">30+</span>
              <span className="stat-label">Campus Events</span>
            </div>
            <div className="stat-divider" aria-hidden="true" />
            <div className="hero-stat">
              <span className="stat-number">₹1.5L+</span>
              <span className="stat-label">Prize Pools</span>
            </div>
            <div className="stat-divider" aria-hidden="true" />
            <div className="hero-stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Mentored Tracks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Loading / Error / Data */}
      {loading ? (
        <section className="events-content-section" aria-label="Events loading">
          <HomeSkeleton />
        </section>
      ) : error ? (
        <section className="events-content-section" aria-label="Error loading events">
          <StateMessage
            type="error"
            title="Couldn't load events."
            message={error.message || 'We ran into an issue fetching the latest campus events. Please try again.'}
            onRetry={refetch}
            retryLabel="Try Again"
          />
        </section>
      ) : !events || events.length === 0 ? (
        <section className="events-content-section" aria-label="No events found">
          <StateMessage
            type="empty"
            title="No events available right now."
            message="Check back soon for new hackathons and workshops or refresh the feed."
            onRetry={refetch}
            retryLabel="Refresh"
          />
        </section>
      ) : (
        <>
          {/* Featured Bento Section (Only rendered if featured events exist) */}
          {featuredEvents.length > 0 && (
            <section id="featured" className="featured-section" aria-labelledby="featured-title">
              <div className="section-head">
                <div>
                  <div className="section-eyebrow">
                    <span className="dot-pulse" aria-hidden="true" />
                    CURATED SPOTLIGHT
                  </div>
                  <h2 id="featured-title" className="section-title">
                    Featured Discoveries
                  </h2>
                </div>
                <p className="section-description">
                  High-stakes hackathons and headline arenas hand-picked for this season.
                </p>
              </div>

              <div className="featured-bento-grid">
                {/* Primary Bento Hero Spotlight */}
                {featuredEvents[0] && (
                  <div className="bento-card bento-hero-wrapper">
                    <EventCard event={featuredEvents[0]} isFeaturedPriority={true} isHeroSpotlight={true} />
                  </div>
                )}

                {/* Other featured events in bento grid */}
                {featuredEvents.slice(1, 5).map((ev) => (
                  <div key={ev.id} className="bento-card">
                    <EventCard event={ev} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Discovery & All Events Section */}
          <section id="all-events" className="all-events-section" aria-labelledby="all-events-title">
            <div className="section-head-browse">
              <div>
                <h2 id="all-events-title" className="section-title">
                  All Campus Events
                </h2>
                <p className="section-description">
                  Filter by category, search by keywords, or browse all upcoming schedules.
                </p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="filter-controls-panel">
              <div className="search-box">
                <span className="search-icon" aria-hidden="true">🔍</span>
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search by event name, blurb, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search events"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search query"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Category Chips and Saved Filter */}
              <div className="chips-wrapper" role="toolbar" aria-label="Event filters">
                <button
                  type="button"
                  className={`filter-chip ${selectedCategory === 'ALL' && !showSavedOnly ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setShowSavedOnly(false);
                  }}
                >
                  All ({events.length})
                </button>

                {savedCount > 0 && (
                  <button
                    type="button"
                    id="saved-events"
                    className={`filter-chip filter-chip-saved ${showSavedOnly ? 'active' : ''}`}
                    onClick={() => setShowSavedOnly((prev) => !prev)}
                    aria-pressed={showSavedOnly}
                  >
                    <span aria-hidden="true">★</span> Saved ({savedCount})
                  </button>
                )}

                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`filter-chip ${selectedCategory === cat && !showSavedOnly ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowSavedOnly(false);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Results Info */}
            <div className="filter-results-meta" aria-live="polite">
              <span>Showing {filteredEvents.length} of {events.length} events</span>
              {(selectedCategory !== 'ALL' || searchQuery || showSavedOnly) && (
                <button
                  type="button"
                  className="btn-text-clear"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                    setShowSavedOnly(false);
                  }}
                >
                  Reset filters
                </button>
              )}
            </div>

            {/* Events Grid or No Matches State */}
            {filteredEvents.length === 0 ? (
              <div className="no-matches-box" role="status">
                <div className="no-matches-icon" aria-hidden="true">🔎</div>
                <h3>No matching events found</h3>
                <p>Try adjusting your search keywords or switching category filters.</p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                    setShowSavedOnly(false);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="events-grid">
                {filteredEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            )}
          </section>

          {/* CTA Section */}
          <section className="cta-banner-section" aria-labelledby="cta-heading">
            <div className="cta-banner-card">
              <div className="cta-content">
                <span className="cta-tag">CALL FOR BUILDERS</span>
                <h2 id="cta-heading" className="cta-title">
                  Ready to showcase your team's prototype?
                </h2>
                <p className="cta-description">
                  All Render72 events provide safe overnight lab spaces, mentor clinics, and verified judging rubric scores.
                </p>
                <div className="cta-actions">
                  <a href="#all-events" className="btn btn-primary">
                    Find Your Next Challenge
                  </a>
                  <a href="#featured" className="btn btn-secondary">
                    View Featured Arena
                  </a>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
