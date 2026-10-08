import React, { useState } from 'react';
import { PageHero } from '../components/PageHero';
import { BOOKS, SITE } from '../data/siteData';

interface BooksPageProps {
  onNavigate: (path: string) => void;
}

export const BooksPage: React.FC<BooksPageProps> = ({ onNavigate }) => {
  const [selectedBookTitle, setSelectedBookTitle] = useState<string | null>(null);

  return (
    <div className="page-fade-in">
      <PageHero
        title="Books and resources."
        intro="Anointed study guides, deliverance devotionals, and biblical books authored to strengthen your spiritual walk and prayer life."
      />

      <section className="sermons pad">
        <div className="wrap">
          <div className="bgrid">
            {BOOKS.map((b, idx) => (
              <a
                key={b.id}
                className="book rv in"
                href="#/books"
                style={{ '--d': `${idx * 0.07}s`, cursor: 'pointer' } as React.CSSProperties}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedBookTitle(b.title);
                }}
              >
                <div className="cover" style={{ background: b.color }}>
                  <span>{SITE.short}</span>
                  <b>{b.title}</b>
                </div>
                <h3>{b.title}</h3>
                <p>{b.sub}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Nice Catchy Dialog Prompt when clicking any book */}
      {selectedBookTitle && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100dvh',
            zIndex: 99999,
            background: 'rgba(12, 12, 13, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setSelectedBookTitle(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '480px',
              width: '100%',
              padding: '2.2rem 2rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
              textAlign: 'center',
              border: '1.5px solid var(--accent)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(184, 147, 90, 0.12)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.2rem',
                fontSize: '2rem'
              }}
            >
              📚
            </div>

            <h3
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#0C0C0D',
                marginBottom: '0.6rem',
                fontFamily: 'var(--serif)'
              }}
            >
              Books Coming Soon!
            </h3>

            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.6,
                color: '#4B5563',
                marginBottom: '1.8rem'
              }}
            >
              Please, books and publications are not available for direct download at the moment. Our anointed devotionals and spiritual guides for <b>"{selectedBookTitle}"</b> are being prepared for official release. Stay tuned!
            </p>

            <button
              type="button"
              className="btn btn-accent"
              style={{
                width: '100%',
                padding: '0.85rem 1.5rem',
                fontWeight: 700,
                borderRadius: '999px'
              }}
              onClick={() => setSelectedBookTitle(null)}
            >
              Got it, thank you!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
