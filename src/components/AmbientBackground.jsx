import { useEffect, useMemo } from 'react';

export function AmbientBackground() {
  // Precompute random particle offsets so they stay consistent
  const particles = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      left: `${(i * 9.8 + (i % 3) * 7) % 96}%`,
      top: `${18 + ((i * 15) % 72)}%`,
      duration: `${9 + (i % 4) * 2.5}s`,
      delay: `-${(i * 1.9) % 10}s`,
      scale: 0.65 + ((i % 3) * 0.3),
    }));
  }, []);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasHover = window.matchMedia('(hover: hover)').matches;

    // Scroll progress bar throttled with rAF
    let scrollTicking = false;
    const handleScroll = () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          const bar = document.getElementById('scroll-progress');
          if (bar) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
            bar.style.width = `${progress}%`;
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (isReduced) return;

    // Pointer spotlight on desktop throttled with rAF
    let handlePointerMove;
    if (hasHover) {
      let pointerTicking = false;
      handlePointerMove = (e) => {
        if (!pointerTicking) {
          requestAnimationFrame(() => {
            document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
            pointerTicking = false;
          });
          pointerTicking = true;
        }
      };
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    // Event-delegated 3D Card tilt on desktop devices with hover throttled with rAF
    let onCardMove;
    let onCardOut;
    if (hasHover) {
      let cardTicking = false;
      onCardMove = (e) => {
        const card = e.target.closest('.event-card, .cta-banner-card, .prize-card');
        if (!card) return;
        if (!cardTicking) {
          requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            card.style.setProperty('--card-x', `${x * 100}%`);
            card.style.setProperty('--card-y', `${y * 100}%`);
            const rotY = (x - 0.5) * 8;
            const rotX = -(y - 0.5) * 6;
            card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
            cardTicking = false;
          });
          cardTicking = true;
        }
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
