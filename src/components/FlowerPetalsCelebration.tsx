import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface FlowerPetalsCelebrationProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  bibleVerse?: string;
  onClose: () => void;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  vx: number;
  vy: number;
  opacity: number;
  sway: number;
  swaySpeed: number;
}

export const FlowerPetalsCelebration: React.FC<FlowerPetalsCelebrationProps> = ({
  isOpen,
  title = "God will bless you!",
  message = "Thanks for your offering. May God open the windows of heaven and bless you abundantly!",
  bibleVerse = "“The Lord shall open unto thee his good treasure, the heaven to give the rain unto thy land in his season, and to bless all the work of thine hand.” — Deuteronomy 28:12",
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Lock scroll on body when open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Continuous celebratory flower petals animation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Color palette of celebratory flower petals
    const petalColors = [
      '#FF5E7E', // Rose pink
      '#E8C25A', // Gold
      '#FF85A1', // Light blossom
      '#FCD34D', // Warm amber
      '#F43F5E', // Vivid rose
      '#FDA4AF', // Soft petal
      '#D97706', // Deep gold
      '#FFFFFF'  // White blossom
    ];

    const petals: Petal[] = [];
    const petalCount = 85;

    const resetPetal = (p: Petal) => {
      const angle = (Math.PI / 2) + (Math.random() - 0.5) * 1.5;
      const speed = 10 + Math.random() * 20;

      p.x = width / 2 + (Math.random() - 0.5) * (width * 0.5);
      p.y = height + 10;
      p.size = 9 + Math.random() * 14;
      p.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      p.rotation = Math.random() * 360;
      p.rotationSpeed = (Math.random() - 0.5) * 5;
      p.vx = Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1) * 0.7;
      p.vy = -Math.abs(Math.sin(angle) * speed);
      p.opacity = 1;
      p.sway = Math.random() * Math.PI * 2;
      p.swaySpeed = 0.03 + Math.random() * 0.04;
    };

    // Initialize petals
    for (let i = 0; i < petalCount; i++) {
      const p: Petal = {
        x: 0,
        y: 0,
        size: 0,
        color: '',
        rotation: 0,
        rotationSpeed: 0,
        vx: 0,
        vy: 0,
        opacity: 0,
        sway: 0,
        swaySpeed: 0
      };
      resetPetal(p);
      // Stagger initial progress
      p.y = Math.random() * height;
      petals.push(p);
    }

    const gravity = 0.24;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.vy += gravity;
        p.sway += p.swaySpeed;
        p.x += p.vx + Math.sin(p.sway) * 1.6;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Continuous loop: Recycle petals when they exit screen or fade
        if (p.y > height + 20 || p.y < -50 || p.x < -30 || p.x > width + 30) {
          resetPetal(p);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0.2, p.opacity);

        // Organic petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.65, p.size, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();

        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Use Portal directly into document.body to ensure perfect viewport centering anywhere on the page
  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        background: 'rgba(12, 12, 13, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'grid',
        placeItems: 'center',
        padding: '1.2rem',
        animation: 'flashBackdrop 0.25s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Full-screen flower burst canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Responsive centered blessing dialog */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '460px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '16px',
          padding: 'clamp(1.5rem, 4vw, 2.2rem)',
          textAlign: 'center',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.5), 0 0 45px rgba(232, 194, 90, 0.35)',
          border: '1.5px solid var(--accent)',
          animation: 'flashScale 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) both'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'var(--paper)',
            border: '1px solid var(--stone)',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            color: 'var(--charcoal)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 16 }}>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* Celebratory Flower Petal Badge */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FDE047, #D97706)',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 1.2rem',
            boxShadow: '0 8px 25px rgba(217, 119, 6, 0.35)',
            fontSize: '1.8rem'
          }}
        >
          🌸
        </div>

        <h3
          style={{
            fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)',
            color: 'var(--charcoal)',
            fontFamily: 'var(--serif)',
            marginBottom: '0.6rem',
            lineHeight: 1.2
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: '#444',
            fontSize: '0.96rem',
            lineHeight: 1.6,
            marginBottom: '1.2rem'
          }}
        >
          {message}
        </p>

        {bibleVerse && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              background: 'var(--paper)',
              border: '1px solid var(--stone)',
              color: 'var(--accent-ink)',
              fontSize: '0.88rem',
              lineHeight: 1.5,
              fontStyle: 'italic',
              marginBottom: '1.5rem'
            }}
          >
            {bibleVerse}
          </div>
        )}

        <button
          type="button"
          className="btn btn-dark"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.85rem 1.4rem',
            fontSize: '0.98rem',
            fontWeight: 600,
            borderRadius: '10px'
          }}
        >
          Amen &amp; Continue
        </button>
      </div>
    </div>,
    document.body
  );
};
