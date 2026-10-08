import React, { useEffect } from 'react';
import { TestimonyItem } from '../types';
import { fmtDate } from '../utils/formatters';

interface TestimonyModalProps {
  testimony: TestimonyItem | null;
  onClose: () => void;
}

export const TestimonyModal: React.FC<TestimonyModalProps> = ({ testimony, onClose }) => {
  useEffect(() => {
    if (!testimony) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.classList.add('lock');
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('lock');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [testimony, onClose]);

  if (!testimony) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={testimony.title}
    >
      <div className="modal-dialog">
        <button
          className="dlg-x"
          type="button"
          aria-label="Close"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="player" style={{ borderRadius: 0 }}>
          {testimony.youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(testimony.youtubeId)}?rel=0&autoplay=1`}
              title={testimony.title}
              allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <div className="off">
              <div className="ring">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 4.5v15l13-7.5z" />
                </svg>
              </div>
              <h3>Praise Report</h3>
              <p>A miraculous testimony of God's faithfulness and power.</p>
            </div>
          )}
        </div>

        <div className="dlg-b">
          <h3>{testimony.title}</h3>
          <p className="muted" style={{ marginBottom: '.8rem' }}>
            {testimony.name} &nbsp;|&nbsp; {fmtDate(testimony.date)}
          </p>
          <p style={{ lineHeight: 1.65, fontSize: '1.05rem', color: '#333' }}>
            {testimony.summary}
          </p>
        </div>
      </div>
    </div>
  );
};
