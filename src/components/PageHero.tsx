import React from 'react';

interface PageHeroProps {
  title: string;
  intro?: string;
  backHref?: string;
  backLabel?: string;
  onNavigate?: (path: string) => void;
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  intro,
  backHref,
  backLabel = "Back",
  onNavigate
}) => {
  const handleBack = (e: React.MouseEvent) => {
    if (backHref && onNavigate) {
      e.preventDefault();
      const path = backHref.startsWith('#') ? backHref.slice(1) : backHref;
      onNavigate(path);
    }
  };

  return (
    <section className="page-hero">
      <div className="wrap">
        {backHref && (
          <a
            className="crumb"
            href={backHref}
            onClick={handleBack}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
            {backLabel}
          </a>
        )}
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
    </section>
  );
};
