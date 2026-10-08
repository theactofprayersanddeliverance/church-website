import React from 'react';
import { PageHero } from '../components/PageHero';
import { VideoPlayer } from '../components/VideoPlayer';
import { VideoCard } from '../components/VideoCard';
import { VIDEOS, SITE } from '../data/siteData';
import { fmtDate } from '../utils/formatters';

interface VideoDetailPageProps {
  videoId: number;
  onNavigate: (path: string) => void;
  onSelectVideo: (id: number) => void;
}

export const VideoDetailPage: React.FC<VideoDetailPageProps> = ({
  videoId,
  onNavigate,
  onSelectVideo
}) => {
  const video = VIDEOS.find((v) => v.id === videoId);

  if (!video) {
    return (
      <div className="page-fade-in">
        <PageHero
          title="Video not found."
          intro="The requested sermon may have been moved or updated."
          backHref="#/videos"
          onNavigate={onNavigate}
        />
      </div>
    );
  }

  const related = VIDEOS.filter(
    (v) => v.id !== video.id && v.subject === video.subject
  ).slice(0, 3);

  return (
    <div className="page-fade-in">
      {/* Player Section */}
      <section
        className="live dark"
        style={{ padding: 'calc(88px + 1.2rem) 0 clamp(2rem, 5vw, 3.5rem)' }}
      >
        <div className="wrap" style={{ maxWidth: 1040 }}>
          <a
            className="crumb"
            href="#/videos"
            onClick={(e) => { e.preventDefault(); onNavigate('/videos'); }}
            style={{ marginBottom: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#e8dcc6' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
            All videos
          </a>

          {/* Clean Custom Video Player */}
          <VideoPlayer youtubeId={video.youtubeId} title={video.title} />
        </div>
      </section>

      {/* Sermon Description & Details - Clean Unboxed Layout Outside Cards */}
      <section className="sermons pad" style={{ paddingTop: 'clamp(2rem, 4vw, 3.5rem)' }}>
        <div className="wrap" style={{ maxWidth: 1040 }}>
          {/* Directly on page: Bold title, subtitle & details with zero card enclosure */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div
              style={{
                fontSize: '0.88rem',
                fontWeight: 700,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.4rem'
              }}
            >
              {video.subject} &bull; {video.category}
            </div>

            <h1
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                fontWeight: 800,
                color: '#0C0C0D',
                margin: '0 0 1rem 0',
                lineHeight: 1.15,
                fontFamily: 'var(--serif)'
              }}
            >
              {video.title}
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.2rem',
                flexWrap: 'wrap',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#4B5563',
                marginBottom: '1.8rem',
                paddingBottom: '1.2rem',
                borderBottom: '1.5px solid var(--stone)'
              }}
            >
              <span>🎤 {video.speaker}</span>
              <span aria-hidden="true">&bull;</span>
              <span>📅 {fmtDate(video.date)}</span>
              {video.duration && (
                <>
                  <span aria-hidden="true">&bull;</span>
                  <span>⏱️ {video.duration}</span>
                </>
              )}
            </div>

            <div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#111827',
                  marginBottom: '0.75rem'
                }}
              >
                About this sermon
              </h3>
              <p
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.75,
                  color: '#374151',
                  maxWidth: '75ch'
                }}
              >
                {video.description}
              </p>
            </div>
          </div>

          {/* Related Videos */}
          {related.length > 0 && (
            <div style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--stone)' }}>
              <h2 style={{ fontSize: 'var(--h-2)', marginBottom: '1.6rem' }}>
                More Sermons from {video.subject}
              </h2>
              <div className="sgrid">
                {related.map((r, idx) => (
                  <VideoCard
                    key={r.id}
                    video={r}
                    index={idx}
                    onSelect={onSelectVideo}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
