import React from 'react';
import { VideoItem } from '../types';
import { fmtDate, TONES } from '../utils/formatters';

interface VideoCardProps {
  video: VideoItem;
  index?: number;
  onSelect?: (id: number) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, index = 0, onSelect }) => {
  const tone = TONES[video.id % TONES.length];

  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(video.id);
    }
  };

  const renderMedia = () => {
    if (video.thumbUrl) {
      return <img src={video.thumbUrl} alt={video.title} loading="lazy" />;
    }
    if (video.youtubeId) {
      return (
        <img
          src={`https://img.youtube.com/vi/${encodeURIComponent(video.youtubeId)}/hqdefault.jpg`}
          alt={video.title}
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
    <a
      className="sermon rv in"
      href={`#/video/${video.id}`}
      style={{ '--d': `${Math.min(index, 8) * 0.06}s` } as React.CSSProperties}
      onClick={handleClick}
    >
      <div className="ph">
        {renderMedia()}
        {video.duration && <span className="dur">{video.duration}</span>}
      </div>
      <div>
        <h3>{video.title}</h3>
        <span className="subj">{video.subject}</span>
        <small>{fmtDate(video.date)} &nbsp;|&nbsp; {video.speaker}</small>
      </div>
    </a>
  );
};
