import React, { useState, useMemo } from 'react';
import { PageHero } from '../components/PageHero';
import { VideoCard } from '../components/VideoCard';
import { VIDEOS } from '../data/siteData';

interface VideosPageProps {
  onSelectVideo: (id: number) => void;
}

export const VideosPage: React.FC<VideosPageProps> = ({ onSelectVideo }) => {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(12);

  const categories = useMemo(() => {
    return Array.from(new Set(VIDEOS.map((v) => v.category))).filter(Boolean);
  }, []);

  const years = useMemo(() => {
    return Array.from(new Set(VIDEOS.map((v) => v.date.slice(0, 4)))).sort().reverse();
  }, []);

  const filteredVideos = useMemo(() => {
    let result = [...VIDEOS];

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter((v) =>
        [v.title, v.subject, v.speaker, v.category, v.date, v.description]
          .join(' ')
          .toLowerCase()
          .includes(q)
      );
    }

    if (category) {
      result = result.filter((v) => v.category === category);
    }

    if (year) {
      result = result.filter((v) => v.date.startsWith(year));
    }

    result.sort((a, b) => {
      if (sort === 'newest') return b.date.localeCompare(a.date);
      if (sort === 'oldest') return a.date.localeCompare(b.date);
      if (sort === 'az') return a.title.localeCompare(b.title);
      if (sort === 'za') return b.title.localeCompare(a.title);
      return 0;
    });

    return result;
  }, [query, sort, category, year]);

  const displayedVideos = filteredVideos.slice(0, visibleCount);
  const oldestYear = years[years.length - 1] || '2020';

  return (
    <div className="page-fade-in">
      <PageHero
        title="Video archive."
        intro={`Every message, weekly service, and deliverance teaching since our ministry began in ${oldestYear}.`}
      />

      <section className="sermons pad" style={{ paddingTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
        <div className="wrap">
          {/* Toolbar */}
          <div className="toolbar">
            <label className="search" style={{ fontWeight: 400 }}>
              <span style={{ position: 'absolute', left: '-9999px' }}>Search videos</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                className="fld"
                type="search"
                placeholder="Search by title, subject, series or date"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisibleCount(12);
                }}
              />
            </label>

            <select
              className="fld"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              aria-label="Sort"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">Title A to Z</option>
              <option value="za">Title Z to A</option>
            </select>

            <select
              className="fld"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setVisibleCount(12);
              }}
              aria-label="Category"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              className="fld"
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setVisibleCount(12);
              }}
              aria-label="Year"
            >
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <div className="seg" role="group" aria-label="View mode">
              <button
                type="button"
                className={view === 'grid' ? 'active' : ''}
                onClick={() => setView('grid')}
                aria-label="Grid view"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
                  <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
                  <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
                  <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
                </svg>
              </button>
              <button
                type="button"
                className={view === 'list' ? 'active' : ''}
                onClick={() => setView('list')}
                aria-label="List view"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="count">
            {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'} found
          </div>

          {displayedVideos.length === 0 ? (
            <div className="empty">
              No videos match your search. Try a different keyword, category, or year.
            </div>
          ) : (
            <div className={view === 'grid' ? 'sgrid' : 'vlist'}>
              {displayedVideos.map((v, idx) => (
                <VideoCard
                  key={v.id}
                  video={v}
                  index={idx}
                  onSelect={onSelectVideo}
                />
              ))}
            </div>
          )}

          {displayedVideos.length < filteredVideos.length && (
            <div className="more">
              <button
                className="btn btn-line"
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 12)}
              >
                Load more videos
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
