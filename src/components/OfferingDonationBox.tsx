import React from 'react';

interface OfferingDonationBoxProps {
  className?: string;
  onNavigate?: (path: string) => void;
}

export const OfferingDonationBox: React.FC<OfferingDonationBoxProps> = ({
  className = '',
  onNavigate
}) => {
  const handleOpenOffering = () => {
    if (onNavigate) {
      onNavigate('/offering');
    } else {
      window.location.hash = '#/offering';
    }
  };

  const handleOpenDonation = () => {
    if (onNavigate) {
      onNavigate('/donation');
    } else {
      window.location.hash = '#/donation';
    }
  };

  return (
    <div className={`offering-donation-section ${className}`} style={{ marginBlock: '2.5rem 1.5rem' }}>
      {/* Two clean cards with smooth corner radius */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Card 1: Offering / Tithe */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--stone)',
            borderRadius: '14px',
            padding: '2rem 1.8rem',
            boxShadow: '0 8px 30px -12px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform 0.3s var(--ease), border-color 0.3s'
          }}
        >
          <div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                background: 'rgba(184, 147, 90, 0.15)',
                color: 'var(--accent-ink)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '1rem'
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 6v12M15 9.5a2.5 2.5 0 0 0-5 0c0 3 5 2 5 5a2.5 2.5 0 0 1-5 0" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.45rem', marginBottom: '0.4rem', color: 'var(--charcoal)' }}>
              Offering / Tithe
            </h3>
            <p style={{ color: '#555', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '1.6rem' }}>
              Give your tithes, Sunday offerings, thanksgiving seeds, and church project offerings. Pay directly into the church account.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-dark"
            onClick={handleOpenOffering}
            style={{
              width: '100%',
              padding: '0.82rem 1.3rem',
              fontSize: '0.94rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              borderRadius: '10px'
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}>
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Give Offering / Tithe
          </button>
        </div>

        {/* Card 2: Donation */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--stone)',
            borderRadius: '14px',
            padding: '2rem 1.8rem',
            boxShadow: '0 8px 30px -12px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform 0.3s var(--ease), border-color 0.3s'
          }}
        >
          <div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                background: 'rgba(184, 147, 90, 0.15)',
                color: 'var(--accent-ink)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: '1rem'
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.45rem', marginBottom: '0.4rem', color: 'var(--charcoal)' }}>
              Partnership &amp; Donation
            </h3>
            <p style={{ color: '#555', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '1.6rem' }}>
              Partner with the ministry for kingdom projects, church building, crusades, and welfare support. Upload payment details easily.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-accent"
            onClick={handleOpenDonation}
            style={{
              width: '100%',
              padding: '0.82rem 1.3rem',
              fontSize: '0.94rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              borderRadius: '10px'
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Make a Donation
          </button>
        </div>
      </div>
    </div>
  );
};
