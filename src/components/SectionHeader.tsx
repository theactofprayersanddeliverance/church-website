import React from 'react';

interface SectionHeaderProps {
  title: string;
  lede?: string;
  cta?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, lede, cta }) => {
  return (
    <div className="sec-head">
      <div>
        <h2 className="rv in">{title}</h2>
        {lede && (
          <p className="lede rv in" style={{ '--d': '.1s' } as React.CSSProperties}>
            {lede}
          </p>
        )}
      </div>
      {cta && (
        <div className="rv in" style={{ '--d': '.15s' } as React.CSSProperties}>
          {cta}
        </div>
      )}
    </div>
  );
};
