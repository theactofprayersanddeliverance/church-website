import React, { useState, useEffect, useRef } from 'react';
import { PRELOADED_BIBLE_KJV } from '../data/bibleKjv';

interface HolyBibleReaderProps {
  onClose: () => void;
}

interface BibleVerse {
  chapter: number;
  verse: number;
  text: string;
}

const OLD_TESTAMENT_BOOKS = [
  { name: 'Genesis', chapters: 50 },
  { name: 'Exodus', chapters: 40 },
  { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 },
  { name: 'Deuteronomy', chapters: 34 },
  { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 },
  { name: 'Ruth', chapters: 4 },
  { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 },
  { name: '1 Kings', chapters: 22 },
  { name: '2 Kings', chapters: 25 },
  { name: '1 Chronicles', chapters: 29 },
  { name: '2 Chronicles', chapters: 36 },
  { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 13 },
  { name: 'Esther', chapters: 10 },
  { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 },
  { name: 'Proverbs', chapters: 31 },
  { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song of Solomon', chapters: 8 },
  { name: 'Isaiah', chapters: 66 },
  { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 },
  { name: 'Ezekiel', chapters: 48 },
  { name: 'Daniel', chapters: 12 },
  { name: 'Hosea', chapters: 14 },
  { name: 'Joel', chapters: 3 },
  { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 },
  { name: 'Jonah', chapters: 4 },
  { name: 'Micah', chapters: 7 },
  { name: 'Nahum', chapters: 3 },
  { name: 'Habakkuk', chapters: 3 },
  { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 },
  { name: 'Zechariah', chapters: 14 },
  { name: 'Malachi', chapters: 4 }
];

const NEW_TESTAMENT_BOOKS = [
  { name: 'Matthew', chapters: 28 },
  { name: 'Mark', chapters: 16 },
  { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 },
  { name: 'Acts', chapters: 28 },
  { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 },
  { name: '2 Corinthians', chapters: 13 },
  { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 },
  { name: 'Philippians', chapters: 4 },
  { name: 'Colossians', chapters: 4 },
  { name: '1 Thessalonians', chapters: 5 },
  { name: '2 Thessalonians', chapters: 3 },
  { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 },
  { name: 'Titus', chapters: 3 },
  { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 },
  { name: 'James', chapters: 5 },
  { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 },
  { name: '1 John', chapters: 5 },
  { name: '2 John', chapters: 1 },
  { name: '3 John', chapters: 1 },
  { name: 'Jude', chapters: 1 },
  { name: 'Revelation', chapters: 22 }
];

export const HolyBibleReader: React.FC<HolyBibleReaderProps> = ({ onClose }) => {
  const [showCover, setShowCover] = useState(true);

  // Initialize and load saved reading state from LocalStorage
  const [currentBook, setCurrentBook] = useState<string>(() => {
    return localStorage.getItem('kjv_last_book') || 'John';
  });
  const [currentChapter, setCurrentChapter] = useState<number>(() => {
    const saved = localStorage.getItem('kjv_last_chapter');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100); // percentage value
  const [selectedTestament, setSelectedTestament] = useState<'old' | 'new'>('new');
  const [activeBookForChapters, setActiveBookForChapters] = useState<string | null>(null);

  // Dynamic show/hide state for the top bar while scrolling
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Exit Confirmation Popup
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);

  // Save book and chapter position to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('kjv_last_book', currentBook);
    localStorage.setItem('kjv_last_chapter', currentChapter.toString());
  }, [currentBook, currentChapter]);

  // Intercept phone back-press when reading the Bible
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // Re-push status to lock immediate navigation, and show popup
      window.history.pushState(null, '', window.location.href);
      setExitConfirmOpen(true);
    };

    if (!showCover) {
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showCover]);

  // Scroll detection handler to show/hide the top bar
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const currentScrollY = scrollContainerRef.current.scrollTop;
    
    // If scrolling down, hide top header. If scrolling up, show it.
    if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
    lastScrollY.current = currentScrollY;
  };

  // Load Chapter Scriptures instantly from PRELOADED_BIBLE_KJV dataset first
  useEffect(() => {
    if (showCover) return;

    let active = true;
    const loadScripture = async () => {
      // Reset scroll position to top when shifting chapters
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      setShowHeader(true);

      // 1. Check in-memory pre-loaded bible dataset
      const preloadedBook = PRELOADED_BIBLE_KJV[currentBook];
      if (preloadedBook && preloadedBook.chapters[currentChapter]) {
        const preloadedVerses = preloadedBook.chapters[currentChapter].map((txt, idx) => ({
          chapter: currentChapter,
          verse: idx + 1,
          text: txt
        }));
        setVerses(preloadedVerses);
        setLoading(false);
        return;
      }

      // 2. Fetch via Web API for books outside preloaded core
      setLoading(true);
      try {
        const res = await fetch(`https://bible-api.com/${encodeURIComponent(currentBook)}+${currentChapter}?translation=kjv`);
        if (!res.ok) throw new Error('API fetch failed');
        const data = await res.json();
        
        if (active) {
          if (data.verses && data.verses.length > 0) {
            setVerses(
              data.verses.map((v: any) => ({
                chapter: v.chapter,
                verse: v.verse,
                text: v.text
              }))
            );
          } else {
            throw new Error('No verses returned');
          }
        }
      } catch (err) {
        console.warn('API error, loading default fallback chapter:', err);
        if (active) {
          // Fallback to preloaded John 1 if absolutely everything fails
          const fallbackBook = PRELOADED_BIBLE_KJV['John'];
          const fallbackVerses = fallbackBook.chapters[1].map((txt, idx) => ({
            chapter: 1,
            verse: idx + 1,
            text: txt
          }));
          setVerses(fallbackVerses);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadScripture();
    return () => {
      active = false;
    };
  }, [currentBook, currentChapter, showCover]);

  const getBibleBookList = () => {
    return [...OLD_TESTAMENT_BOOKS, ...NEW_TESTAMENT_BOOKS];
  };

  const navigateChapter = (direction: 'next' | 'prev') => {
    const books = getBibleBookList();
    const bookIndex = books.findIndex((b) => b.name.toLowerCase() === currentBook.toLowerCase());
    if (bookIndex === -1) return;

    const book = books[bookIndex];

    if (direction === 'next') {
      if (currentChapter < book.chapters) {
        setCurrentChapter((prev) => prev + 1);
      } else if (bookIndex < books.length - 1) {
        setCurrentBook(books[bookIndex + 1].name);
        setCurrentChapter(1);
      }
    } else {
      if (currentChapter > 1) {
        setCurrentChapter((prev) => prev - 1);
      } else if (bookIndex > 0) {
        const prevBook = books[bookIndex - 1];
        setCurrentBook(prevBook.name);
        setCurrentChapter(prevBook.chapters);
      }
    }
  };

  const handleBookSelect = (bookName: string) => {
    setActiveBookForChapters(bookName);
  };

  const handleChapterSelect = (bookName: string, chapNum: number) => {
    setCurrentBook(bookName);
    setCurrentChapter(chapNum);
    setMenuOpen(false);
    setActiveBookForChapters(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#FAF8F5', // Crisp full screen white/cream background
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'Newsreader, Georgia, serif'
      }}
    >
      {/* Top Header Bar - Slides dynamically or goes transparent when scrolling */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          background: '#ffffff', // Pure white minimalist background
          color: '#1C1917',
          borderBottom: '1px solid #E7E5E4',
          zIndex: 100,
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          transition: 'transform 0.25s ease-out, opacity 0.25s',
          transform: showHeader ? 'translateY(0)' : 'translateY(-100%)',
          opacity: showHeader ? 1 : 0,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60px'
        }}
      >
        {/* Left: Back Button - Only shows 'Bible' */}
        <button
          onClick={() => setExitConfirmOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#8C6D3A', // Elegant thick brown
            fontSize: '1.05rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" style={{ width: 18, height: 18 }}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Bible</span>
        </button>

        {/* Center: Current book and chapter title only (e.g. Acts 8, John 1) */}
        {!showCover && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C1917', margin: 0, fontFamily: 'Newsreader, Georgia, serif' }}>
              {currentBook} {currentChapter}
            </h2>
          </div>
        )}

        {/* Right Action Icons: Zoom Controls + Menu Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
          {!showCover && (
            <>
              {/* Font Zoom Controller Button */}
              <button
                onClick={() => setZoomOpen(!zoomOpen)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: zoomOpen ? '#8C6D3A' : '#FAF8F5',
                  border: '1px solid #E7E5E4',
                  color: zoomOpen ? '#ffffff' : '#8C6D3A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '0.95rem'
                }}
                title="Adjust Text Size"
              >
                AA
              </button>

              {/* Font Zoom Popover (Pure Light UI Dropdown) */}
              {zoomOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: '44px',
                    background: '#ffffff',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    border: '1px solid #E7E5E4',
                    padding: '0.75rem 1rem',
                    zIndex: 200,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    minWidth: '160px',
                    animation: 'fadeIn 0.15s ease-out'
                  }}
                >
                  <button
                    onClick={() => setZoomLevel((prev) => Math.max(prev - 15, 75))}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '6px',
                      background: '#F5F5F4',
                      border: '1px solid #D6D3D1',
                      color: '#1C1917',
                      fontSize: '1rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#44403C', flex: 1, textAlign: 'center' }}>
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((prev) => Math.min(prev + 15, 180))}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '6px',
                      background: '#F5F5F4',
                      border: '1px solid #D6D3D1',
                      color: '#1C1917',
                      fontSize: '1rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>
              )}
            </>
          )}

          {/* Book Navigation Selection Drawer Trigger */}
          <button
            onClick={() => { setMenuOpen(!menuOpen); setZoomOpen(false); }}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: '#FAF8F5',
              border: '1px solid #E7E5E4',
              color: '#8C6D3A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            title="Browse Books & Chapters"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 18, height: 18 }}>
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Reading Screen Viewport */}
      <main
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          background: '#FAF8F5', // Seamless clean white background, NO shadow, NO central container
          overflow: 'hidden',
          paddingTop: showCover ? '0px' : '60px' // offset only for top bar
        }}
      >
        {showCover ? (
          /* BIBLE COVER: Thick brown matching the top bar perfectly (#1C1917) */
          <div
            onClick={() => setShowCover(false)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#1C1917', // Exact same color as top bar
              cursor: 'pointer',
              padding: '2rem'
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '400px',
                height: '80%',
                maxHeight: '520px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2.5rem',
                color: '#E8C25A',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: '3.4rem',
                    fontWeight: 900,
                    margin: '0 0 0.5rem 0',
                    letterSpacing: '0.04em',
                    fontFamily: 'Newsreader, Georgia, serif',
                    color: '#ffffff' // Crisp white text
                  }}
                >
                  HOLY BIBLE
                </h1>
                <div style={{ width: '60px', height: '2.5px', background: '#E8C25A', margin: '1.2rem auto' }} />
                <span style={{ fontSize: '1.15rem', fontStyle: 'italic', color: '#E8C25A', display: 'block', fontWeight: 600 }}>
                  King James Version
                </span>
              </div>

              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  background: 'rgba(232, 194, 90, 0.1)',
                  padding: '0.75rem 1.8rem',
                  borderRadius: '10px', // Nice 4 corner radius
                  border: '1.5px solid rgba(232, 194, 90, 0.4)',
                  color: '#E8C25A',
                  textTransform: 'uppercase'
                }}
              >
                Tap to Open Bible
              </span>
            </div>
          </div>
        ) : (
          /* FULL-SCREEN IMMERSIVE BIBLE PAGE: FLAT, EDGE-TO-EDGE, NO CENTERING CARD */
          <div
            style={{
              flex: 1,
              width: '100%',
              background: '#FAF8F5', // Flat off-white screen background, NO card margins
              color: '#1C1917',
              padding: '1.5rem clamp(1rem, 5vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Scrollable scriptures body */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              style={{
                flex: 1,
                overflowY: 'auto',
                paddingRight: '0.2rem',
                scrollBehavior: 'smooth'
              }}
            >
              {loading ? (
                <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#8C6D3A' }}>
                  <div className="flex flex-col items-center gap-3">
                    <span style={{ fontSize: '2.2rem', animation: 'spin 2s linear infinite' }}>📜</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                      Loading Scriptures...
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ maxWidth: '720px', width: '100%', margin: '0 auto', paddingBottom: '5rem', paddingTop: '1rem' }}>
                  {/* Bible verses listed vertically (aligned in series) */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {verses.map((v) => (
                      <div
                        key={v.verse}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.85rem',
                          marginBottom: '2rem', // Generous gap at the bottom of each verse
                          textAlign: 'left'
                        }}
                      >
                        {/* Bold green/brown thick verse number */}
                        <span
                          style={{
                            fontSize: `${1.3 * (zoomLevel / 100)}rem`,
                            fontWeight: '800',
                            color: '#8C6D3A', // Rich amber brown number
                            flexShrink: 0,
                            minWidth: '28px',
                            textAlign: 'right',
                            lineHeight: '1.6'
                          }}
                        >
                          {v.verse}
                        </span>
                        
                        {/* Verse text matching the premium style in your reference image */}
                        <span
                          style={{
                            fontSize: `${1.25 * (zoomLevel / 100)}rem`,
                            lineHeight: '1.85',
                            color: '#1C1917',
                            fontWeight: '500',
                            fontFamily: 'Newsreader, Georgia, serif'
                          }}
                        >
                          {v.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* FLOATING NAVIGATION ARROWS ONLY (FLOATING IN AIR) - Bottom is 100% clean and transparent */}
            {/* Previous Chapter Arrow Button Floating */}
            <button
              onClick={() => navigateChapter('prev')}
              style={{
                position: 'fixed',
                left: '20px',
                bottom: '36px',
                zIndex: 500,
                width: '46px',
                height: '46px',
                borderRadius: '12px', // Nice 4 corner radius
                background: '#4A3B2C',
                border: '1.5px solid rgba(232, 194, 90, 0.4)',
                color: '#E8C25A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                transition: 'transform 0.2s'
              }}
              title="Previous Chapter"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: 18, height: 18 }}>
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Chapter Arrow Button Floating */}
            <button
              onClick={() => navigateChapter('next')}
              style={{
                position: 'fixed',
                right: '20px',
                bottom: '36px',
                zIndex: 500,
                width: '46px',
                height: '46px',
                borderRadius: '12px', // Nice 4 corner radius
                background: '#4A3B2C',
                border: '1.5px solid rgba(232, 194, 90, 0.4)',
                color: '#E8C25A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                transition: 'transform 0.2s'
              }}
              title="Next Chapter"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: 18, height: 18 }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </main>

      {/* Exit Confirmation Pop-up Dialog */}
      {exitConfirmOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: 'rgba(28, 25, 23, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '400px',
              width: '100%',
              padding: '2.2rem 1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              textAlign: 'center',
              border: '1px solid #E7E5E4'
            }}
          >
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>📖</span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1C1917', marginBottom: '0.6rem', fontFamily: 'var(--serif)' }}>
              Close Holy Bible?
            </h3>
            <p style={{ fontSize: '0.94rem', color: '#57534E', lineHeight: '1.5', marginBottom: '1.8rem', fontFamily: 'Instrument Sans, system-ui, sans-serif' }}>
              Do you want to exit the Bible reader and return to the main website? Your current reading position will be saved.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setExitConfirmOpen(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #D6D3D1',
                  background: '#F5F5F4',
                  color: '#44403C',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Instrument Sans, system-ui, sans-serif'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setExitConfirmOpen(false);
                  onClose();
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#DC2626',
                  color: '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Instrument Sans, system-ui, sans-serif'
                }}
              >
                Exit Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Book/Chapter Selection Drawer (Crisp Premium Light UI Theme) */}
      {menuOpen && (
        <div
          onClick={() => { setMenuOpen(false); setActiveBookForChapters(null); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(28,25,23,0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s'
          }}
        >
          {/* Main Selection Light UI Drawer */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '88%',
              maxWidth: '380px',
              height: '100%',
              background: '#ffffff', // Crisp Light Background
              boxShadow: '-10px 0 35px rgba(28,25,23,0.12)',
              display: 'flex',
              flexDirection: 'column',
              color: '#1C1917', // Dark Stone text
              animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #E7E5E4',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4A3B2C', margin: 0 }}>
                Select Scripture
              </h3>
              <button
                onClick={() => { setMenuOpen(false); setActiveBookForChapters(null); }}
                style={{ background: 'none', border: 'none', color: '#78716C', fontSize: '1.3rem', cursor: 'pointer', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            {/* Testament Tab Selectors (Light UI Style) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                padding: '0.85rem 1.25rem',
                background: '#F5F5F4'
              }}
            >
              <button
                onClick={() => { setSelectedTestament('old'); setActiveBookForChapters(null); }}
                style={{
                  padding: '0.6rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  borderRadius: '6px',
                  border: '1px solid #E7E5E4',
                  cursor: 'pointer',
                  background: selectedTestament === 'old' ? '#4A3B2C' : '#ffffff',
                  color: selectedTestament === 'old' ? '#ffffff' : '#44403C',
                  transition: 'all 0.15s',
                  boxShadow: selectedTestament === 'old' ? '0 2px 6px rgba(74,59,44,0.15)' : 'none'
                }}
              >
                Old Testament
              </button>
              <button
                onClick={() => { setSelectedTestament('new'); setActiveBookForChapters(null); }}
                style={{
                  padding: '0.6rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  borderRadius: '6px',
                  border: '1px solid #E7E5E4',
                  cursor: 'pointer',
                  background: selectedTestament === 'new' ? '#4A3B2C' : '#ffffff',
                  color: selectedTestament === 'new' ? '#ffffff' : '#44403C',
                  transition: 'all 0.15s',
                  boxShadow: selectedTestament === 'new' ? '0 2px 6px rgba(74,59,44,0.15)' : 'none'
                }}
              >
                New Testament
              </button>
            </div>

            {/* Selection Scrollable Drawer List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
              {activeBookForChapters ? (
                /* Chapters selection grid */
                <div>
                  <button
                    onClick={() => setActiveBookForChapters(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8C6D3A',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      marginBottom: '1.25rem'
                    }}
                  >
                    ◀ Back to Books
                  </button>

                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1C1917', marginBottom: '0.85rem' }}>
                    {activeBookForChapters} Chapters
                  </h4>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))',
                      gap: '0.5rem'
                    }}
                  >
                    {Array.from(
                      { length: getBibleBookList().find((b) => b.name === activeBookForChapters)?.chapters || 1 },
                      (_, i) => i + 1
                    ).map((cNum) => (
                      <button
                        key={cNum}
                        onClick={() => handleChapterSelect(activeBookForChapters, cNum)}
                        style={{
                          padding: '0.8rem 0.2rem',
                          borderRadius: '6px',
                          background: currentBook === activeBookForChapters && currentChapter === cNum ? '#4A3B2C' : '#F5F5F4',
                          color: currentBook === activeBookForChapters && currentChapter === cNum ? '#ffffff' : '#1C1917',
                          border: '1px solid #E7E5E4',
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {cNum}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Books selection view */
                <div style={{ display: 'grid', gap: '0.4rem' }}>
                  {(selectedTestament === 'old' ? OLD_TESTAMENT_BOOKS : NEW_TESTAMENT_BOOKS).map((b) => (
                    <button
                      key={b.name}
                      onClick={() => handleBookSelect(b.name)}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: '8px',
                        background: currentBook === b.name ? 'rgba(74, 59, 44, 0.06)' : '#ffffff',
                        border: currentBook === b.name ? '1px solid #4A3B2C' : '1px solid #E7E5E4',
                        color: currentBook === b.name ? '#4A3B2C' : '#1C1917',
                        textAlign: 'left',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span>{b.name}</span>
                      <span style={{ fontSize: '0.74rem', color: '#78716C', fontWeight: 600 }}>
                        {b.chapters} chaps
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
