import { useEffect, useMemo } from 'react';

export function AmbientBackground() {
  // Precompute random particle offsets so they stay consistent
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.2 + (i % 3) * 7) % 98}%`,
      top: `${20 + ((i * 13) % 75)}%`,
      duration: `${8 + (i % 5) * 2.5}s`,
      delay: `-${(i * 1.7) % 12}s`,
      scale: 0.6 + ((i % 4) * 0.35),
    }));
  }, []);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasHover = window.matchMedia('(hover: hover)').matches;

    // Scroll progress bar
    const handleScroll = () => {
      const bar = document.getElementById('scroll-progress');
      if (bar) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        bar.style.width = `${progress}%`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (isReduced) return;

    // Pointer spotlight on desktop
    let handlePointerMove;
    if (hasHover) {
      handlePointerMove = (e) => {
        document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
      };
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    // Intersection observer for section pop-ins
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px' }
    );

    const observeSections = () => {
      const targets = document.querySelectorAll(
        '.featured-section, .all-events-section, .cta-banner-section, .detail-section, .sticky-registration-card'
      );
      targets.forEach((el) => {
        if (!el.classList.contains('motion-section-pop')) {
          el.classList.add('motion-section-pop');
          observer.observe(el);
        }
      });
    };

    observeSections();

    // Event-delegated 3D Card tilt on desktop devices with hover
    let onCardMove;
    let onCardOut;
    if (hasHover) {
      onCardMove = (e) => {
        const card = e.target.closest('.event-card, .cta-banner-card, .prize-card');
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        card.style.setProperty('--card-x', `${x * 100}%`);
        card.style.setProperty('--card-y', `${y * 100}%`);
        const rotY = (x - 0.5) * 8;
        const rotX = -(y - 0.5) * 6;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
      };

      onCardOut = (e) => {
        const card = e.target.closest('.event-card, .cta-banner-card, .prize-card');
        if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
          card.style.transform = '';
        }
      };

      document.addEventListener('pointermove', onCardMove, { passive: true });
      document.addEventListener('pointerout', onCardOut, { passive: true });
    }

    // Button ripple effect
    const handleButtonClick = (e) => {
      const btn = e.target.closest('button, .btn');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const dot = document.createElement('span');
      dot.className = 'ripple-dot';
      dot.style.left = `${e.clientX - rect.left}px`;
      dot.style.top = `${e.clientY - rect.top}px`;
      btn.appendChild(dot);
      setTimeout(() => dot.remove(), 650);
    };
    document.addEventListener('click', handleButtonClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (handlePointerMove) {
        window.removeEventListener('pointermove', handlePointerMove);
      }
      if (onCardMove) {
        document.removeEventListener('pointermove', onCardMove);
      }
      if (onCardOut) {
        document.removeEventListener('pointerout', onCardOut);
      }
      document.removeEventListener('click', handleButtonClick);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="ambient-background-layer" aria-hidden="true">
      {/* Scroll Progress Bar at the top */}
      <div id="scroll-progress" className="scroll-progress-bar" />

      {/* Floating Animated Mesh Grid */}
      <div className="motion-grid" />

      {/* Ambient glowing floating orbs */}
      <div className="ambient-orb orb-a" />
      <div className="ambient-orb orb-b" />

      {/* Floating starlight particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="ambient-particle"
          style={{
            left: p.left,
            top: p.top,
            animationDuration: p.duration,
            animationDelay: p.delay,
            transform: `scale(${p.scale})`,
          }}
        />
      ))}
    </div>
  );
}
