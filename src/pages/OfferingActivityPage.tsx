import React, { useState, useRef } from 'react';
import { PageHero } from '../components/PageHero';
import { FlowerPetalsCelebration } from '../components/FlowerPetalsCelebration';
import { BANK_ACCOUNTS } from '../data/siteData';

interface OfferingActivityPageProps {
  onNavigate: (path: string) => void;
}

export const OfferingActivityPage: React.FC<OfferingActivityPageProps> = ({ onNavigate }) => {
  const [region, setRegion] = useState<'nigeria' | 'foreign'>('nigeria');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [giverName, setGiverName] = useState('');
  const [offeringType, setOfferingType] = useState('Tithe');
  const [foreignGmail, setForeignGmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const copyAccount = () => {
    navigator.clipboard?.writeText(BANK_ACCOUNTS.offering.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCelebrationOpen(true);
  };

  const handleForeignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCelebrationOpen(true);
  };

  const handleCloseCelebration = () => {
    setCelebrationOpen(false);
    // Stay cleanly in offering / tithe section with fresh fields
    setReceiptImage(null);
    setGiverName('');
    setForeignGmail('');
  };

  return (
    <div className="page-fade-in">
      <PageHero
        title="Offering / Tithe."
        intro="Give your tithes, offerings, thanksgiving, and covenant seeds into the house of God."
        backHref="#/give"
        backLabel="Back to Giving"
        onNavigate={onNavigate}
      />

      <section className="sermons pad" style={{ paddingTop: 'clamp(2rem, 4vw, 3.5rem)' }}>
        <div className="wrap" style={{ maxWidth: '640px' }}>
          {/* Main Card with nice smooth corner radius */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: 'clamp(1.5rem, 4vw, 2.4rem)',
              border: '1px solid var(--stone)',
              boxShadow: '0 10px 35px -12px rgba(0, 0, 0, 0.08)'
            }}
          >
            {/* Notice at top */}
            <div
              style={{
                padding: '1rem 1.2rem',
                borderRadius: '10px',
                background: 'rgba(184, 147, 90, 0.1)',
                border: '1px solid rgba(184, 147, 90, 0.25)',
                color: '#3a352c',
                fontSize: '0.94rem',
                lineHeight: 1.6,
                marginBottom: '1.6rem'
              }}
            >
              Once you make your offering, just pay in your offering into the account and then click on the button that <b>I have paid</b>, and God will bless you.
            </div>

            {/* Switchable bar: Compact, responsive, no oversized buttons */}
            <div
              style={{
                display: 'flex',
                background: 'var(--paper)',
                padding: '4px',
                borderRadius: '10px',
                border: '1px solid var(--stone)',
                gap: '4px',
                marginBottom: '1.8rem'
              }}
            >
              <button
                type="button"
                onClick={() => setRegion('nigeria')}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  background: region === 'nigeria' ? 'var(--charcoal)' : 'transparent',
                  color: region === 'nigeria' ? '#ffffff' : 'var(--charcoal)',
                  transition: 'all 0.25s'
                }}
              >
                Nigerian Payment
              </button>
              <button
                type="button"
                onClick={() => setRegion('foreign')}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  background: region === 'foreign' ? 'var(--charcoal)' : 'transparent',
                  color: region === 'foreign' ? '#ffffff' : 'var(--charcoal)',
                  transition: 'all 0.25s'
                }}
              >
                Foreign Payment
              </button>
            </div>

            {region === 'nigeria' ? (
              <form onSubmit={handlePaidSubmit} style={{ display: 'grid', gap: '1.4rem' }}>
                {/* Neatly aligned account container (light, subtle border, no sticker) */}
                <div
                  style={{
                    background: 'var(--paper)',
                    borderRadius: '12px',
                    border: '1px solid var(--stone)',
                    padding: '1.2rem 1.4rem',
                    display: 'grid',
                    gap: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.86rem', color: 'var(--mist)', fontWeight: 500 }}>Bank Name</span>
                    <b style={{ fontSize: '1rem', color: 'var(--charcoal)' }}>{BANK_ACCOUNTS.offering.bankName}</b>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid var(--stone)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.86rem', color: 'var(--mist)', fontWeight: 500 }}>Account Name</span>
                    <b style={{ fontSize: '0.94rem', color: 'var(--charcoal)' }}>{BANK_ACCOUNTS.offering.accountName}</b>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid var(--stone)', paddingTop: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--mist)', display: 'block' }}>Account Number</span>
                      <span style={{ fontSize: '1.45rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-ink)', letterSpacing: '0.04em' }}>
                        {BANK_ACCOUNTS.offering.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={copyAccount}
                      style={{
                        padding: '0.45rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        background: '#ffffff',
                        border: '1px solid var(--stone)',
                        color: 'var(--charcoal)',
                        cursor: 'pointer'
                      }}
                    >
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Broken-dot, four-corner radius upload box under account number */}
                <div>
                  <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: 500, color: '#333', marginBottom: '0.4rem' }}>
                    Upload Payment Receipt or Screenshot (Optional)
                  </span>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--accent)',
                      borderRadius: '12px',
                      padding: receiptImage ? '1rem' : '1.8rem 1rem',
                      textAlign: 'center',
                      background: 'rgba(184, 147, 90, 0.04)',
                      cursor: 'pointer',
                      transition: 'background 0.2s, border-color 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {receiptImage ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'center' }}>
                        <img
                          src={receiptImage}
                          alt="Receipt Preview"
                          style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--stone)' }}
                        />
                        <div style={{ textAlign: 'left' }}>
                          <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#16a34a' }}>
                            ✓ Receipt uploaded
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>
                            Click to change or replace image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--charcoal)' }}>
                          Click to upload receipt or screenshot
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--mist)' }}>
                          Supports JPG, PNG images
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Giver Name and Offering Type */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <label>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#444' }}>Your Name (Optional)</span>
                    <input
                      className="fld"
                      placeholder="e.g. Bro. David"
                      value={giverName}
                      onChange={(e) => setGiverName(e.target.value)}
                    />
                  </label>

                  <label>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#444' }}>Offering Category</span>
                    <select
                      className="fld"
                      value={offeringType}
                      onChange={(e) => setOfferingType(e.target.value)}
                    >
                      <option value="Tithe">Tithe</option>
                      <option value="Sunday Offering">Sunday Offering</option>
                      <option value="Mid-week Offering">Mid-week Offering</option>
                      <option value="Deliverance Seed">Deliverance Seed</option>
                      <option value="Thanksgiving">Thanksgiving</option>
                      <option value="Church Project & Others">Church Project &amp; Others</option>
                    </select>
                  </label>
                </div>

                {/* Final "I Have Paid" Action Button */}
                <button
                  type="submit"
                  className="btn btn-dark"
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.4rem',
                    fontSize: '1.02rem',
                    fontWeight: 600,
                    borderRadius: '10px'
                  }}
                >
                  I Have Paid My Offering
                </button>
              </form>
            ) : (
              /* Foreign Payment: Minimalist, no red stuff */
              <div
                style={{
                  background: 'var(--paper)',
                  borderRadius: '12px',
                  border: '1px solid var(--stone)',
                  padding: '1.8rem 1.4rem',
                  textAlign: 'left'
                }}
              >
                <h4 style={{ fontSize: '1.05rem', color: 'var(--charcoal)', marginBottom: '0.5rem' }}>
                  Foreign payment is unavailable at the moment. Coming soon.
                </h4>
                <p style={{ color: '#666', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.4rem' }}>
                  Please enter your Gmail address below, and our international office will send you verified overseas giving options.
                </p>

                <form onSubmit={handleForeignSubmit} style={{ display: 'grid', gap: '1rem' }}>
                  <label>
                    <span style={{ fontSize: '0.86rem', fontWeight: 500, color: '#444' }}>Your Gmail Address</span>
                    <input
                      className="fld"
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={foreignGmail}
                      onChange={(e) => setForeignGmail(e.target.value)}
                    />
                  </label>
                  <button type="submit" className="btn btn-line" style={{ justifySelf: 'start', padding: '0.75rem 1.4rem' }}>
                    Send Inquiry
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Flower Petals Explosion Celebration + Blessing Dialog */}
      <FlowerPetalsCelebration
        isOpen={celebrationOpen}
        title="God will bless you!"
        message={`Thanks for giving your offering. May God open the windows of heaven and bless the works of your hands abundantly!`}
        onClose={handleCloseCelebration}
      />
    </div>
  );
};
