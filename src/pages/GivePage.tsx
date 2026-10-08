import React from 'react';
import { PageHero } from '../components/PageHero';
import { OfferingDonationBox } from '../components/OfferingDonationBox';

interface GivePageProps {
  onNavigate: (path: string) => void;
}

export const GivePage: React.FC<GivePageProps> = ({ onNavigate }) => {
  return (
    <div className="page-fade-in">
      <PageHero
        title="Give with joy."
        intro="Every seed sown empowers the kingdom of God, expands gospel outreach, supports church projects, and blesses lives in need."
      />

      <section className="sermons pad">
        <div className="wrap" style={{ maxWidth: 1040 }}>
          {/* Complete Offering & Donation System */}
          <OfferingDonationBox onNavigate={onNavigate} />

          {/* Scriptural encouragement */}
          <div
            style={{
              marginTop: '4rem',
              padding: '2.5rem',
              borderRadius: '14px',
              background: '#fff',
              border: '1px solid var(--stone)',
              textAlign: 'center',
              maxWidth: '760px',
              marginInline: 'auto',
              boxShadow: '0 8px 30px -15px rgba(0, 0, 0, 0.05)'
            }}
            className="rv in"
          >
            <h3 style={{ marginBottom: '.8rem', fontSize: '1.45rem' }}>
              “Give, and it will be given to you...”
            </h3>
            <p style={{ marginInline: 'auto', color: '#555', fontSize: '1.05rem', lineHeight: 1.65 }}>
              “A good measure, pressed down, shaken together and running over, will be poured into your lap. For with the measure you use, it will be measured to you.” — Luke 6:38
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
