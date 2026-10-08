import React, { useState, useEffect, useRef } from 'react';
import { PageHero } from '../components/PageHero';
import { SectionHeader } from '../components/SectionHeader';
import { VideoCard } from '../components/VideoCard';
import { FlowerPetalsCelebration } from '../components/FlowerPetalsCelebration';
import { LIVE_DEFAULT, SERVICES, VIDEOS, SEED_COMMENTS, BANK_ACCOUNTS } from '../data/siteData';
import { ChatMessage } from '../types';
import { getNextService, DAYS, fmtTime } from '../utils/formatters';
import { chatService } from '../utils/chatService';

interface LivePageProps {
  onNavigate: (path: string) => void;
  onSelectVideo: (id: number) => void;
}

export const LivePage: React.FC<LivePageProps> = ({ onNavigate, onSelectVideo }) => {
  const [isLive, setIsLive] = useState(false);
  const [streamInfo, setStreamInfo] = useState({
    title: LIVE_DEFAULT.title,
    subject: LIVE_DEFAULT.subject,
    speaker: LIVE_DEFAULT.speaker,
    active_camera_id: 'cam-1',
    notice_text: ''
  });
  const [frameTimestamp, setFrameTimestamp] = useState(Date.now());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  const [comments, setComments] = useState<ChatMessage[]>(() => {
    return SEED_COMMENTS.map((c, i) => ({
      id: `seed-${i}`,
      author: c.author,
      message: c.message,
      createdAt: new Date(Date.now() - (10 - i * 3) * 60000).toISOString()
    }));
  });
  const [authorName, setAuthorName] = useState(() => {
    try { return localStorage.getItem('chatName') || ''; } catch { return ''; }
  });
  const [inputMsg, setInputMsg] = useState('');
  const msgsEndRef = useRef<HTMLDivElement>(null);

  // Top Drop-down Offering state
  const [offeringDropDownOpen, setOfferingDropDownOpen] = useState(false);
  const [liveGiverName, setLiveGiverName] = useState('');
  const [liveOfferingType, setLiveOfferingType] = useState('Sunday Offering');
  const [liveReceiptImage, setLiveReceiptImage] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Flower Petals Celebration state
  const [celebrationOpen, setCelebrationOpen] = useState(false);

  const nextServ = getNextService(SERVICES);
  const nextServText = `${DAYS[nextServ.date.getDay()]} at ${fmtTime(nextServ.time)}`;

  useEffect(() => {
    if (!isLive) return;

    chatService.subscribe((newMsg) => {
      setComments((prev) => [...prev.slice(-100), newMsg]);
    });

    return () => chatService.disconnect();
  }, [isLive]);

  const msgsBoxRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll the live chat box to the bottom whenever comments update so newest messages stay visible
  useEffect(() => {
    if (msgsBoxRef.current) {
      requestAnimationFrame(() => {
        if (msgsBoxRef.current) {
          msgsBoxRef.current.scrollTop = msgsBoxRef.current.scrollHeight;
        }
      });
    }
  }, [comments]);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const author = authorName.trim() || 'Guest';
    try {
      localStorage.setItem('chatName', author);
    } catch {}

    chatService.send(author, inputMsg.trim());
    setInputMsg('');
  };

  const getAvatarHue = (str: string) => {
    let h = 0;
    for (const c of str) {
      h = (h * 31 + c.charCodeAt(0)) % 360;
    }
    return `hsl(${h} 38% 38%)`;
  };

  const copyOfferingAccount = () => {
    navigator.clipboard?.writeText(BANK_ACCOUNTS.offering.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleLiveFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLiveReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaidOfferingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOfferingDropDownOpen(false);
    setCelebrationOpen(true);
  };

  const handleCloseCelebration = () => {
    setCelebrationOpen(false);
    setLiveReceiptImage(null);
    setLiveGiverName('');
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isLive) {
    return (
      <div className="page-fade-in">
        <PageHero
          title="Live broadcast."
          intro="Watch our church services and special deliverance meetings live as they happen."
        />

        <section className="sermons pad">
          <div className="wrap">
            <div className="off-box rv in">
              <div>
                <span className="tag light">Offline</span>
                <h2>There is no live broadcast at the moment.</h2>
                <p className="lede">
                  Our next scheduled service is <b>{nextServ.name}</b> on {nextServText}. In the meantime, explore our sermon archive or tune in when service begins.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.2rem' }}>
                  <button
                    type="button"
                    className="demo-link"
                    onClick={() => setIsLive(true)}
                  >
                    Preview live player layout
                  </button>
                </div>
              </div>
              <a
                className="btn btn-dark"
                href="#/videos"
                onClick={(e) => { e.preventDefault(); onNavigate('/videos'); }}
              >
                Browse all videos
              </a>
            </div>

            <div style={{ marginTop: '4rem' }}>
              <SectionHeader title="Recent messages." />
              <div className="sgrid">
                {VIDEOS.slice(0, 3).map((v, idx) => (
                  <VideoCard
                    key={v.id}
                    video={v}
                    index={idx}
                    onSelect={onSelectVideo}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-fade-in">
      <section
        className="live dark"
        style={{ padding: 'calc(88px + 1.2rem) 0 clamp(2.5rem, 6vw, 5rem)' }}
      >
        <div className="wrap">
          {/* Top Action Bar: Give Offering button at TOP with high visibility */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span className="tag ptag" style={{ position: 'static' }}>
                <span className="dot"></span>LIVE BROADCAST
              </span>
              <span style={{ color: '#a9a9a5', fontSize: '0.9rem' }}>
                {142 + comments.length} watching now &bull; Camera Feed
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              {/* Return to offline button */}
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsLive(false)}
                style={{ padding: '0.55rem 0.9rem', fontSize: '0.82rem', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
              >
                ✕ Exit Demo
              </button>

              {/* GIVE OFFERING BUTTON AT THE TOP (High contrast gradient + SVG icon) */}
              <button
                type="button"
                onClick={() => setOfferingDropDownOpen(!offeringDropDownOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.65rem 1.4rem',
                  borderRadius: '999px',
                  background: offeringDropDownOpen
                    ? '#ffffff'
                    : 'linear-gradient(135deg, #F59E0B, #E8C25A)',
                  color: '#0C0C0D',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(245, 158, 11, 0.45)',
                  transition: 'all 0.25s'
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 6v12M15 9.5a2.5 2.5 0 0 0-5 0c0 3 5 2 5 5a2.5 2.5 0 0 1-5 0" />
                </svg>
                <span>{offeringDropDownOpen ? 'Close Offering' : 'Give Offering'}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  style={{
                    width: 14,
                    height: 14,
                    transform: offeringDropDownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s'
                  }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* TOP DROP-DOWN OFFERING PANEL (Drops down from the top as requested) */}
          {offeringDropDownOpen && (
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: 'clamp(1.2rem, 3.5vw, 1.8rem)',
                marginBottom: '1.5rem',
                color: 'var(--charcoal)',
                boxShadow: '0 15px 40px -10px rgba(0, 0, 0, 0.5), 0 0 30px rgba(184, 147, 90, 0.25)',
                border: '1.5px solid var(--accent)',
                animation: 'dropDownTop 0.35s cubic-bezier(0.16, 1, 0.3, 1) both'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      background: 'var(--accent)',
                      color: '#0C0C0D',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      letterSpacing: '0.06em',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      textTransform: 'uppercase'
                    }}
                  >
                    Offering
                  </span>
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--charcoal)', margin: 0 }}>
                    Live Service Offering
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setOfferingDropDownOpen(false)}
                  aria-label="Close"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'var(--paper)',
                    border: '1px solid var(--stone)',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    color: 'var(--charcoal)'
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 15 }}>
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                Kindly transfer your offering into the account below, attach your screenshot, and click <b>I have paid</b>. God bless you!
              </p>

              {/* Account Details Box */}
              <div
                style={{
                  background: 'var(--paper)',
                  borderRadius: 12,
                  border: '1px solid var(--stone)',
                  padding: '1rem 1.2rem',
                  marginBottom: '1.2rem',
                  display: 'grid',
                  gap: '0.65rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--mist)', fontWeight: 500 }}>Bank Name</span>
                  <b style={{ fontSize: '0.95rem', color: 'var(--charcoal)' }}>{BANK_ACCOUNTS.offering.bankName}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', borderTop: '1px solid var(--stone)', paddingTop: '0.6rem' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--mist)', fontWeight: 500 }}>Account Name</span>
                  <b style={{ fontSize: '0.9rem', color: 'var(--charcoal)' }}>{BANK_ACCOUNTS.offering.accountName}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', borderTop: '1px solid var(--stone)', paddingTop: '0.6rem' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--mist)', display: 'block' }}>Account Number</span>
                    <span style={{ fontSize: '1.35rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-ink)' }}>
                      {BANK_ACCOUNTS.offering.accountNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={copyOfferingAccount}
                    style={{
                      padding: '0.4rem 0.9rem',
                      borderRadius: 6,
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      background: '#ffffff',
                      border: '1px solid var(--stone)',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedAccount ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Form: Screenshot upload + Name + Offering Category */}
              <form onSubmit={handlePaidOfferingSubmit} style={{ display: 'grid', gap: '1rem' }}>
                {/* Compact broken-dot upload box */}
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleLiveFileChange}
                    style={{ display: 'none' }}
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--accent)',
                      borderRadius: '10px',
                      padding: liveReceiptImage ? '0.75rem' : '1.1rem 0.8rem',
                      textAlign: 'center',
                      background: 'rgba(184, 147, 90, 0.04)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.7rem'
                    }}
                  >
                    {liveReceiptImage ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <img
                          src={liveReceiptImage}
                          alt="Screenshot"
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--stone)' }}
                        />
                        <div style={{ textAlign: 'left' }}>
                          <span style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#16a34a' }}>
                            ✓ Screenshot attached
                          </span>
                          <span style={{ fontSize: '0.76rem', color: 'var(--mist)' }}>
                            Click to change image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span style={{ fontSize: '0.86rem', fontWeight: 500, color: 'var(--charcoal)' }}>
                          Click to upload payment screenshot / receipt
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
                  <label>
                    <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#444' }}>Your Name</span>
                    <input
                      className="fld"
                      placeholder="e.g. Bro. David"
                      value={liveGiverName}
                      onChange={(e) => setLiveGiverName(e.target.value)}
                    />
                  </label>

                  <label>
                    <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#444' }}>Select Particular Offering</span>
                    <select
                      className="fld"
                      value={liveOfferingType}
                      onChange={(e) => setLiveOfferingType(e.target.value)}
                    >
                      <option value="Sunday Offering">Sunday Offering</option>
                      <option value="Tithe">Tithe</option>
                      <option value="Deliverance Seed">Deliverance Seed</option>
                      <option value="Thanksgiving">Thanksgiving</option>
                      <option value="Offering & Others">Offering &amp; Others</option>
                    </select>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-dark"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.4rem',
                    fontSize: '0.96rem',
                    fontWeight: 600,
                    borderRadius: '10px'
                  }}
                >
                  I Have Paid My Offering
                </button>
              </form>
            </div>
          )}

          {/* Main Live Page Grid (Custom Live Camera Player + Live Chat) */}
          <div className="live-page">
            <div>
              {/* Custom Multi-Camera Live Player (No YouTube template) */}
              <div
                ref={playerContainerRef}
                className="player custom-clean-player"
                style={{
                  position: 'relative',
                  aspectRatio: '16/9',
                  backgroundColor: '#000',
                  borderRadius: isFullscreen ? 0 : 14,
                  overflow: 'hidden',
                  boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                {/* Live Demo Camera Feed Image */}
                <img
                  src="images/i1.jpg"
                  alt="Pastor Israel Revelation Live"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Live On-Air Badge */}
                <span
                  className="tag ptag"
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '1rem',
                    zIndex: 20
                  }}
                >
                  <span className="dot"></span>LIVE BROADCAST
                </span>

                {/* Bottom Overlay Bar with Fullscreen & Controls */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '1rem 1.2rem',
                    background: 'linear-gradient(0deg, rgba(12,12,13,0.95) 0%, transparent 100%)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 25,
                    color: '#fff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '0.86rem', color: '#e8dcc6', fontWeight: 600 }}>
                      📹 Live Camera Angle: {streamInfo.active_camera_id.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: 6,
                        background: 'rgba(255,255,255,0.12)',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      {isFullscreen ? 'Exit Fullscreen' : '⛶ Fullscreen'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="linfo" style={{ marginTop: '1.2rem' }}>
                <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#fff', marginBottom: '0.4rem' }}>
                  {streamInfo.title}
                </h1>
                <div className="meta" style={{ color: 'var(--accent)', fontSize: '0.92rem' }}>
                  <span>Subject: {streamInfo.subject}</span> &bull; 
                  <span>Speaker: {streamInfo.speaker}</span>
                </div>
                <p className="desc" style={{ color: '#d4d4d0', lineHeight: 1.6, marginTop: '0.8rem' }}>
                  {streamInfo.notice_text || LIVE_DEFAULT.description}
                </p>
              </div>
            </div>

            {/* Live Chat Box with Floating Docked Bottom Input */}
            <aside className="chat" aria-label="Live chat">
              <div className="chat-h">
                <span>Live chat</span>
                <small>{comments.length} comments</small>
              </div>

              <div className="msgs" ref={msgsBoxRef} role="log" aria-live="polite">
                {comments.map((m) => {
                  const timeStr = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={m.id} className="msg">
                      <span
                        className="av"
                        style={{ background: getAvatarHue(m.author) }}
                      >
                        {m.author.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <b>{m.author}</b>
                        <time>{timeStr}</time>
                        <p>{m.message}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={msgsEndRef} />
              </div>

              {/* Chat Input Floating & Docked Permanently at Bottom */}
              <form className="chat-f" onSubmit={handleSendComment} noValidate>
                <input
                  placeholder="Your name"
                  maxLength={30}
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  aria-label="Your name"
                />
                <div className="row">
                  <input
                    placeholder="Write a comment..."
                    maxLength={240}
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    aria-label="Comment"
                  />
                  <button className="send" type="submit" aria-label="Send comment">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18 }}>
                      <path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" />
                    </svg>
                  </button>
                </div>
                <span className="chat-note">Comments are live. Please keep them kind and respectful.</span>
              </form>
            </aside>
          </div>
        </div>
      </section>

      {/* FLOWER PETALS EXPLOSION CELEBRATION */}
      <FlowerPetalsCelebration
        isOpen={celebrationOpen}
        title="God will bless you!"
        message="Thanks for giving your offering. May God open the windows of heaven and bless you abundantly!"
        onClose={handleCloseCelebration}
      />
    </div>
  );
};
