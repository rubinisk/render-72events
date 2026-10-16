export function EventCardSkeleton() {
  return (
    <div className="event-card skeleton-card" aria-hidden="true">
      <div className="skeleton-box skeleton-image" />
      <div className="event-card-content">
        <div className="card-top-row">
          <div className="skeleton-box skeleton-pill" style={{ width: '70px' }} />
          <div className="skeleton-box skeleton-pill" style={{ width: '60px' }} />
        </div>
        <div className="skeleton-box skeleton-title" />
        <div className="skeleton-box skeleton-text" style={{ width: '90%' }} />
        <div className="skeleton-box skeleton-text" style={{ width: '75%' }} />
        <div className="card-footer-row">
          <div className="skeleton-box skeleton-pill" style={{ width: '65px' }} />
          <div className="skeleton-box skeleton-pill" style={{ width: '80px' }} />
        </div>
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="skeleton-home" aria-busy="true" aria-label="Loading events">
      {/* Featured Section Skeleton */}
      <div className="section-header-skeleton">
        <div className="skeleton-box skeleton-title" style={{ width: '220px', height: '32px' }} />
        <div className="skeleton-box skeleton-text" style={{ width: '300px' }} />
      </div>
      <div className="featured-bento-grid">
        <div className="bento-card bento-hero-wrapper skeleton-card">
          <div className="skeleton-box" style={{ height: '340px', width: '100%' }} />
        </div>
        <div className="bento-card skeleton-card">
          <div className="skeleton-box" style={{ height: '340px', width: '100%' }} />
        </div>
        <div className="bento-card skeleton-card">
          <div className="skeleton-box" style={{ height: '340px', width: '100%' }} />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="filter-bar-skeleton">
        <div className="skeleton-box" style={{ height: '48px', width: '100%', borderRadius: '12px' }} />
        <div className="skeleton-chips">
          {[80, 100, 90, 70, 110, 85].map((w, idx) => (
            <div key={idx} className="skeleton-box skeleton-pill" style={{ width: `${w}px`, height: '36px' }} />
          ))}
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="events-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function EventDetailSkeleton() {
  return (
    <div className="skeleton-detail" aria-busy="true" aria-label="Loading event details">
      <div className="skeleton-box skeleton-pill" style={{ width: '120px', height: '38px', marginBottom: '24px' }} />

      <div className="detail-hero-skeleton">
        <div className="card-top-row" style={{ marginBottom: '16px' }}>
          <div className="skeleton-box skeleton-pill" style={{ width: '100px' }} />
          <div className="skeleton-box skeleton-pill" style={{ width: '80px' }} />
          <div className="skeleton-box skeleton-pill" style={{ width: '90px' }} />
        </div>
        <div className="skeleton-box skeleton-title" style={{ width: '75%', height: '48px', marginBottom: '16px' }} />
        <div className="skeleton-box skeleton-text" style={{ width: '90%', height: '20px', marginBottom: '8px' }} />
        <div className="skeleton-box skeleton-text" style={{ width: '60%', height: '20px', marginBottom: '28px' }} />
        <div className="skeleton-box skeleton-banner" style={{ width: '100%', height: '420px', borderRadius: '16px' }} />
      </div>

      <div className="detail-layout">
        <div className="detail-main-content">
          <div className="skeleton-box skeleton-title" style={{ width: '180px', height: '28px', margin: '32px 0 16px' }} />
          <div className="skeleton-box skeleton-text" style={{ width: '100%', height: '16px', marginBottom: '10px' }} />
          <div className="skeleton-box skeleton-text" style={{ width: '98%', height: '16px', marginBottom: '10px' }} />
          <div className="skeleton-box skeleton-text" style={{ width: '95%', height: '16px', marginBottom: '10px' }} />
          <div className="skeleton-box skeleton-text" style={{ width: '70%', height: '16px', marginBottom: '32px' }} />

          <div className="skeleton-box skeleton-title" style={{ width: '150px', height: '28px', marginBottom: '16px' }} />
          <div className="skeleton-box skeleton-card" style={{ height: '120px', marginBottom: '24px' }} />
        </div>

        <div className="detail-sidebar">
          <div className="skeleton-card" style={{ height: '420px', borderRadius: '20px' }}>
            <div className="skeleton-box" style={{ height: '100%', width: '100%', borderRadius: '20px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
