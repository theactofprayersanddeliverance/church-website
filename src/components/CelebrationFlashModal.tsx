import React, { useEffect } from 'react';

interface CelebrationFlashModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  subMessage?: string;
  onClose: () => void;
}

export const CelebrationFlashModal: React.FC<CelebrationFlashModalProps> = ({
  isOpen,
  title = "Thanks for Giving Successfully!",
  message = "Your submission has been received. May God bless your offering and reward your sacrifice abundantly!",
  subMessage = "“The Lord shall open unto thee his good treasure, the heaven to give the rain unto thy land in his season.” — Deuteronomy 28:12",
  onClose
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        zIndex: 250,
        backgroundColor: 'rgba(12, 12, 13, 0.88)',
        animation: 'flashBackdrop 0.4s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-dialog"
        style={{
          maxWidth: 520,
          background: 'linear-gradient(145deg, #1A1A1D, #0E0E10)',
          border: '2px solid var(--accent)',
          borderRadius: 18,
          boxShadow: '0 0 50px rgba(184, 147, 90, 0.4), 0 25px 60px rgba(0, 0, 0, 0.8)',
          color: '#fff',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          animation: 'flashScale 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) both'
        }}
      >
        {/* Ambient golden glow behind icon */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 220,
            height: 180,
            background: 'radial-gradient(circle, rgba(184, 147, 90, 0.45) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <button
          className="dlg-x"
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.2)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Animated checkmark container */}
          <div
            style={{
              width: 82,
              height: 82,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #E8C25A, #B07C14)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 0 30px rgba(232, 194, 90, 0.6)',
              animation: 'pulseGlow 2s infinite alternate'
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0C0C0D"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: 44, height: 44 }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2
            style={{
              fontSize: '1.9rem',
              color: '#FFFFFF',
              fontFamily: 'var(--serif)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              marginBottom: '0.8rem'
            }}
          >
            {title}
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#d4d4d0',
              lineHeight: 1.6,
              marginBottom: '1.4rem'
            }}
          >
            {message}
          </p>

          {subMessage && (
            <div
              style={{
                padding: '1rem 1.2rem',
                borderRadius: 10,
                background: 'rgba(184, 147, 90, 0.12)',
                border: '1px solid rgba(184, 147, 90, 0.3)',
                color: '#e8dcc6',
                fontSize: '0.92rem',
                fontStyle: 'italic',
                marginBottom: '1.8rem',
                lineHeight: 1.5
              }}
            >
              {subMessage}
            </div>
          )}

          <button
            type="button"
            className="btn btn-accent"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '0.95rem 1.5rem',
              fontSize: '1.05rem',
              fontWeight: 600
            }}
          >
            Amen &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
};
