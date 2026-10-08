import React from 'react';
import { TestimonyItem } from '../types';
import { fmtShort, TONES } from '../utils/formatters';

interface TestimonyCardProps {
  testimony: TestimonyItem;
  index?: number;
  onOpen: (testimony: TestimonyItem) => void;
}

export const TestimonyCard: React.FC<TestimonyCardProps> = ({ testimony, index = 0, onOpen }) => {
  const tone = TONES[testimony.id % TONES.length];

  const renderMedia = () => {
    if (testimony.youtubeId) {
      return (
        <img
          src={`https://img.youtube.com/vi/${encodeURIComponent(testimony.youtubeId)}/hqdefault.jpg`}
          alt={testimony.title}
          loading="lazy"
        />
      );
    }
    return (
      <div
        className="ph-in"
        style={{
          '--c1': tone[0],
          '--c2': tone[1]
        } as React.CSSProperties}
      />
    );
  };

  return (
    <button
      className="sermon rv in"
      type="button"
      style={{ '--d': `${index * 0.06}s` } as React.CSSProperties}
      onClick={() => onOpen(testimony)}
    >
      <div className="ph">
        {renderMedia()}
      </div>
      <div>
        <h3>{testimony.title}</h3>
        <small>{testimony.name} &nbsp;|&nbsp; {fmtShort(testimony.date)}</small>
      </div>
    </button>
  );
};
