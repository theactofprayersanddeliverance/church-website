import React, { useRef, useState, useEffect } from 'react';

// Declare YT for TypeScript
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface VideoPlayerProps {
  youtubeId?: string;
  title: string;
  isLive?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  youtubeId,
  title,
  isLive = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  const playerId = useRef(`yt-player-${Math.random().toString(36).substring(2, 9)}`);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!youtubeId) return;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
      }

      playerRef.current = new window.YT.Player(playerId.current, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,          // HIDE YouTube default controls
          disablekb: 1,         // Disable keyboard to prevent YouTube shortcuts
          fs: 0,                // HIDE YouTube fullscreen button
          iv_load_policy: 3,    // HIDE video annotations
          modestbranding: 1,    // HIDE YouTube logo
          rel: 0,               // Do not show related videos
          showinfo: 0,          // HIDE video title / uploader info
          playsinline: 1
        },
        events: {
          onReady: (event: any) => {
            setPlayerReady(true);
            const dur = event.target.getDuration();
            setDuration(dur || 0);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              const dur = event.target.getDuration();
              if (dur) setDuration(dur);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              // Handle Repeat/Loop
              if (isRepeat) {
                event.target.seekTo(0, true);
                event.target.playVideo();
              }
            }
          }
        }
      });
    };

    if (!window.YT || !window.YT.Player) {
      if (!document.getElementById('yt-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
      }
    };
  }, [youtubeId, isRepeat]);

  // Track progress when playing
  useEffect(() => {
    if (isPlaying && playerRef.current && playerRef.current.getCurrentTime) {
      progressTimerRef.current = setInterval(() => {
        try {
          const curr = playerRef.current.getCurrentTime();
          setCurrentTime(curr || 0);
          const dur = playerRef.current.getDuration();
          if (dur && dur !== duration) setDuration(dur);
        } catch {}
      }, 300);
    } else {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, duration]);

  // Handle Fullscreen change
  useEffect(() => {
    const handleFs = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  // Auto-hide controls when playing and inactive
  const resetHideTimer = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } catch {}
    resetHideTimer();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(newTime, true);
    }
    resetHideTimer();
  };

  const skipSeconds = (seconds: number) => {
    if (!playerRef.current || !playerRef.current.getCurrentTime) return;
    try {
      const current = playerRef.current.getCurrentTime();
      const target = Math.max(0, Math.min(duration, current + seconds));
      playerRef.current.seekTo(target, true);
      setCurrentTime(target);
    } catch {}
    resetHideTimer();
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
    resetHideTimer();
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch {}
    resetHideTimer();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatSeconds = (sec: number) => {
    const s = Math.floor(sec || 0);
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  if (!youtubeId) {
    return (
      <div className="player">
        <div className="off">
          <div className="ring">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: 22, color: 'var(--accent)' }}>
              <path d="M7 4.5v15l13-7.5z" />
            </svg>
          </div>
          <h3>{isLive ? "Live broadcast will begin shortly." : "Anointed sermon"}</h3>
          <p>{isLive ? "Stay tuned for the live stream." : title}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`player custom-clean-player ${isFullscreen ? 'pseudo-fs' : ''}`}
      onMouseMove={resetHideTimer}
      onClick={resetHideTimer}
      style={{
        position: 'relative',
        aspectRatio: isFullscreen ? 'auto' : '16/9',
        backgroundColor: '#000',
        borderRadius: isFullscreen ? 0 : 12,
        overflow: 'hidden',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
        userSelect: 'none'
      }}
    >
      {/* Top Banner Shield: Completely blocks YouTube hover title, channel logo & share buttons */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          zIndex: 15,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.2rem',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.35s'
        }}
      >
        <span
          style={{
            color: '#fff',
            fontSize: '0.92rem',
            fontWeight: 500,
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            maxWidth: '80%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {title}
        </span>
      </div>

      {/* YouTube IFrame Mount Target */}
      <div
        style={{
          position: 'absolute',
          top: -2,
          left: -2,
          width: 'calc(100% + 4px)',
          height: 'calc(100% + 4px)',
          pointerEvents: 'none' // Clicks intercepted by custom player layer
        }}
      >
        <div id={playerId.current} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Center Large Play / Pause Trigger on Click */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer'
        }}
        onClick={togglePlay}
      >
        {(!isPlaying || showControls) && (
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(12, 12, 13, 0.75)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              opacity: isPlaying ? 0.75 : 1,
              transform: 'scale(1)',
              transition: 'transform 0.2s, opacity 0.2s'
            }}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 28, height: 28 }}>
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 32, height: 32, marginLeft: 4, color: 'var(--accent)' }}>
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Live Badge */}
      {isLive && (
        <span
          className="tag ptag"
          style={{
            position: 'absolute',
            left: '1rem',
            top: '1rem',
            zIndex: 20
          }}
        >
          <span className="dot"></span>LIVE
        </span>
      )}

      {/* CUSTOM BOTTOM CONTROLS BAR: Play, Pause, Seek Bar, Repeat, Volume, Fullscreen */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 25,
          padding: '1.4rem 1.2rem 0.8rem',
          background: 'linear-gradient(0deg, rgba(12, 12, 13, 0.95) 0%, rgba(12, 12, 13, 0.6) 70%, transparent 100%)',
          backdropFilter: 'blur(6px)',
          opacity: showControls || !isPlaying ? 1 : 0,
          transform: showControls || !isPlaying ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
          display: 'grid',
          gap: '0.65rem'
        }}
      >
        {/* Interactive Progress Bar (Scrubber) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.5}
            value={currentTime}
            onChange={handleSeek}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              appearance: 'none',
              background: `linear-gradient(to right, var(--accent) ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.25) ${(currentTime / (duration || 1)) * 100}%)`,
              outline: 'none',
              cursor: 'pointer'
            }}
            aria-label="Video Progress Scrubber"
          />
        </div>

        {/* Buttons Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
          {/* Left: Play/Pause, Rewind 10s, Forward 10s, Repeat Toggle, Timestamps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* Play / Pause button */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause video" : "Play video"}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.12)',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                transition: 'background 0.2s'
              }}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20, marginLeft: 2, color: 'var(--accent)' }}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            {/* Skip back 10s */}
            <button
              type="button"
              onClick={() => skipSeconds(-10)}
              title="Rewind 10 seconds"
              aria-label="Rewind 10 seconds"
              style={{
                padding: '0.35rem 0.6rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: 6,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#d4d4d0'
              }}
            >
              -10s
            </button>

            {/* Skip forward 10s */}
            <button
              type="button"
              onClick={() => skipSeconds(10)}
              title="Forward 10 seconds"
              aria-label="Forward 10 seconds"
              style={{
                padding: '0.35rem 0.6rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: 6,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#d4d4d0'
              }}
            >
              +10s
            </button>

            {/* Repeat / Loop toggle */}
            <button
              type="button"
              onClick={toggleRepeat}
              title={isRepeat ? "Repeat is ON" : "Turn Repeat ON"}
              aria-label={isRepeat ? "Disable Repeat" : "Enable Repeat"}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                borderRadius: 6,
                background: isRepeat ? 'var(--accent)' : 'rgba(255, 255, 255, 0.08)',
                color: isRepeat ? '#0C0C0D' : '#d4d4d0',
                fontWeight: 600,
                fontSize: '0.8rem',
                transition: 'all 0.2s'
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
              <span>{isRepeat ? "Repeat ON" : "Repeat"}</span>
            </button>

            {/* Time display: Current / Duration */}
            <span style={{ fontSize: '0.85rem', color: '#bdbdb9', marginLeft: '0.4rem', fontVariantNumeric: 'tabular-nums' }}>
              {formatSeconds(currentTime)} / {formatSeconds(duration)}
            </span>
          </div>

          {/* Right: Mute toggle & Fullscreen */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* Mute button */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                display: 'grid',
                placeItems: 'center',
                color: '#fff'
              }}
            >
              {isMuted ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 17, height: 17 }}>
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 17, height: 17 }}>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>

            {/* Fullscreen button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                display: 'grid',
                placeItems: 'center',
                color: '#fff'
              }}
            >
              {isFullscreen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 16, height: 16 }}>
                  <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 16, height: 16 }}>
                  <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
