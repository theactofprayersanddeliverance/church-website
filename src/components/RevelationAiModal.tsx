import React, { useState, useRef, useEffect } from 'react';
import { askRevelationAi } from '../utils/aiService';
import { VIDEOS } from '../data/siteData';
import { fmtDate } from '../utils/formatters';
import { scheduleAlarmTimer, downloadCalendarInvite } from '../utils/reminderService';

interface RevelationAiModalProps {
  onSelectVideo?: (id: number) => void;
  onNavigate?: (path: string) => void;
}

interface ChatMsg {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  displayedText?: string; // For progressive streaming typing effect
  image?: string | null;
  time: string;
  videoIds?: number[];
  isStreaming?: boolean;
}

export const RevelationAiModal: React.FC<RevelationAiModalProps> = ({
  onSelectVideo,
  onNavigate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alarmNotice, setAlarmNotice] = useState<string | null>(null);

  // Dynamic visual viewport height to adjust for soft keyboards on mobile Chrome / Safari
  const [viewportHeight, setViewportHeight] = useState<number>(
    typeof window !== 'undefined' && window.visualViewport
      ? window.visualViewport.height
      : typeof window !== 'undefined'
      ? window.innerHeight
      : 800
  );

  // Voice recording & transcription state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    const updateHeight = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      } else {
        setViewportHeight(window.innerHeight);
      }
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight);
      window.visualViewport.addEventListener('scroll', updateHeight);
    } else {
      window.addEventListener('resize', updateHeight);
    }

    updateHeight();

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight);
        window.visualViewport.removeEventListener('scroll', updateHeight);
      } else {
        window.removeEventListener('resize', updateHeight);
      }
    };
  }, [isOpen]);

  const startVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported on this browser. Please type your message.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordingStatus("🎙️ Listening... Speak now");
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
        setRecordingStatus(null);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setRecordingStatus(null);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsRecording(false);
      setRecordingStatus(null);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsRecording(false);
    setRecordingStatus(null);
  };

  const handleSetAlarm = (title: string, minutes: number = 60) => {
    scheduleAlarmTimer(title, minutes * 60 * 1000);
    setAlarmNotice(`⏰ Alarm successfully set for "${title}"! Your browser will chime and alert you.`);
    setTimeout(() => setAlarmNotice(null), 6000);
  };

  const handleAddCalendar = (title: string) => {
    downloadCalendarInvite(
      title,
      new Date().toISOString(),
      `Reminder for ${title} at The Act of Prayers and Deliverance Ministries International.`
    );
    setAlarmNotice(`📅 Calendar invite downloaded for "${title}"!`);
    setTimeout(() => setAlarmNotice(null), 6000);
  };
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMsg[]>([]);

  // Scroll inner chat body to bottom when new messages arrive or text streams
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Extract video IDs from response or perform client query search as fallback (max 2 deduplicated)
  const extractVideoIds = (text: string, userQuery: string): number[] => {
    const foundIds: Set<number> = new Set();

    // 1. Check for explicit [VIDEO:id] tags in AI response
    const tagRegex = /\[VIDEO:(\d+)\]/gi;
    let match;
    while ((match = tagRegex.exec(text)) !== null) {
      const vid = parseInt(match[1], 10);
      if (VIDEOS.some((v) => v.id === vid)) {
        foundIds.add(vid);
      }
    }

    // 2. Fallback search if user asked for videos/sermons and no tag was generated
    const lowerQuery = userQuery.toLowerCase();
    if (foundIds.size === 0 && (lowerQuery.includes('video') || lowerQuery.includes('sermon') || lowerQuery.includes('current') || lowerQuery.includes('latest') || lowerQuery.includes('teaching') || lowerQuery.includes('message') || lowerQuery.includes('deliverance') || lowerQuery.includes('watch') || lowerQuery.includes('show'))) {
      let matches = [...VIDEOS];
      if (lowerQuery.includes('deliverance')) {
        matches = matches.filter(v => v.subject.toLowerCase().includes('deliverance') || v.category.toLowerCase().includes('deliverance'));
      } else if (lowerQuery.includes('prayer') || lowerQuery.includes('pray')) {
        matches = matches.filter(v => v.title.toLowerCase().includes('prayer') || v.description.toLowerCase().includes('prayer'));
      }
      matches.slice(0, 2).forEach(v => foundIds.add(v.id));
    }

    // Strictly limit to maximum 2 unique videos
    return Array.from(foundIds).slice(0, 2);
  };

  const cleanResponseText = (text: string): string => {
    return text.replace(/\[VIDEO:\d+\]/gi, '').trim();
  };

  // Progressive streaming text effect for AI response
  const streamAiResponse = (fullText: string, aiMsgId: string) => {
    let currentIndex = 0;
    const chunkSize = 3; // Write in small 3-character chunks for fast, smooth typing effect

    const timer = setInterval(() => {
      currentIndex += chunkSize;
      if (currentIndex >= fullText.length) {
        clearInterval(timer);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? { ...msg, displayedText: fullText, isStreaming: false }
              : msg
          )
        );
      } else {
        const nextText = fullText.slice(0, currentIndex);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? { ...msg, displayedText: nextText }
              : msg
          )
        );
      }
    }, 16);
  };

  const handleSend = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || input;
    if (!textToSend.trim() && !imagePreview) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      displayedText: textToSend,
      image: imagePreview,
      time: userTime
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const currentImage = imagePreview;
    setImagePreview(null);
    setLoading(true);

    // Build chat history for context
    const history = messages
      .filter((m) => m.id !== 'msg-welcome')
      .map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text
      }));

    const responseText = await askRevelationAi(
      textToSend || "I have attached an image for analysis.",
      currentImage,
      history
    );

    const detectedVideoIds = extractVideoIds(responseText, textToSend);
    const cleanedText = cleanResponseText(responseText);

    const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const aiMsgId = `ai-${Date.now()}`;
    const aiMsg: ChatMsg = {
      id: aiMsgId,
      sender: 'ai',
      text: cleanedText,
      displayedText: '', // Starts empty, progressively typed
      videoIds: detectedVideoIds,
      time: aiTime,
      isStreaming: true
    };

    setLoading(false);
    setMessages((prev) => [...prev, aiMsg]);

    // Trigger word-by-word streaming animation
    streamAiResponse(cleanedText, aiMsgId);
  };

  // Close AI full-screen interface immediately and navigate to exact video watch section
  const handleWatchVideo = (videoId: number) => {
    setIsOpen(false); // Close AI Chat
    if (onSelectVideo) {
      onSelectVideo(videoId);
    } else if (onNavigate) {
      onNavigate(`/video/${videoId}`);
    } else {
      window.location.hash = `#/video/${videoId}`;
    }
  };

  return (
    <>
      {/* Floating FAB Button: Nice 4 Corner Radius Brown Button with Centered White Contact Icon */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 990,
            width: '52px',
            height: '52px',
            borderRadius: '12px', // Nice 4 corner radius (NOT rounded pill or circle)
            background: '#4A3B2C', // Warm brown color
            border: '1.5px solid rgba(232, 194, 90, 0.5)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease, background 0.2s ease'
          }}
          aria-label="Open AI Chat"
        >
          {/* Centered White Contact SVG Icon only */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: 24, height: 24 }}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* FULL SCREEN AI CHAT INTERFACE */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: viewportHeight ? `${viewportHeight}px` : '100dvh',
            width: '100%',
            maxWidth: '100vw',
            maxHeight: '100%',
            zIndex: 9999,
            background: '#FAF8F5',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* Full Screen Header Bar */}
          <header
            style={{
              padding: '1rem 1.5rem',
              background: '#1C1917',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              zIndex: 10,
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: 'none',
                  color: '#ffffff',
                  width: 40,
                  height: 40,
                  borderRadius: '10px', // Nice 4 corner radius
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
                aria-label="Back to website"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: 20, height: 20 }}
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>

              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
                  Revelation AI
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#E8C25A', fontWeight: 500 }}>
                  Spiritual Assistant &amp; Ministry Guide
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#A8A29E', fontWeight: 500, display: 'none' }} className="sm:block">
              The Act of Prayers &amp; Deliverance
            </div>
          </header>

          {/* Chat Messages Full View Container */}
          <div
            ref={chatScrollRef}
            style={{
              flex: '1 1 0%',
              minHeight: 0,
              padding: '1.5rem 1rem',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              maxWidth: '860px',
              width: '100%',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem'
            }}
          >
            {/* Center Landing / Empty Screen Header */}
            {messages.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  margin: 'auto auto',
                  maxWidth: '520px',
                  width: '100%',
                  padding: '2.5rem 2rem',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #E7E5E4',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
                }}
              >
                <h1
                  style={{
                    fontSize: '2.4rem',
                    fontWeight: 900,
                    color: '#4A3B2C',
                    marginBottom: '0.8rem',
                    fontFamily: 'var(--serif)',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Revelation AI
                </h1>

                {/* Thick Subtitle */}
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#1C1917',
                    lineHeight: 1.4,
                    marginBottom: '0.5rem',
                    paddingInline: '1rem'
                  }}
                >
                  God bless you, welcome to the Act of Deliverance Ministry
                </h2>

                {/* Smallest Normal Subtitle */}
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: '#6B6661',
                    lineHeight: 1.5,
                    marginBottom: '2rem',
                    paddingInline: '1.5rem'
                  }}
                >
                  I'm your AI assistant, you can ask me anything or help you search anything.
                </p>

                {/* Quick Action Suggestion Buttons matching the UI (Nice, straight, equal width, no stickers) */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '320px',
                    margin: '0 auto'
                  }}
                >
                  <button
                    type="button"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.2rem',
                      borderRadius: '8px', // 4 corner radius
                      background: '#FAF8F5',
                      border: '1px solid #E7E5E4',
                      cursor: 'pointer',
                      color: '#4A3B2C',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      transition: 'all 0.15s ease'
                    }}
                    onClick={() => handleSend("Show me current video sermons and teachings")}
                  >
                    Search Current Videos
                  </button>
                  <button
                    type="button"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.2rem',
                      borderRadius: '8px',
                      background: '#FAF8F5',
                      border: '1px solid #E7E5E4',
                      cursor: 'pointer',
                      color: '#4A3B2C',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      transition: 'all 0.15s ease'
                    }}
                    onClick={() => handleSend("What are our church service times and night vigils?")}
                  >
                    Services &amp; Vigils
                  </button>
                  <button
                    type="button"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.2rem',
                      borderRadius: '8px',
                      background: '#FAF8F5',
                      border: '1px solid #E7E5E4',
                      cursor: 'pointer',
                      color: '#4A3B2C',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      transition: 'all 0.15s ease'
                    }}
                    onClick={() => handleSend("Where is our church located in Imo State?")}
                  >
                    Church Address
                  </button>
                </div>
              </div>
            )}

            {/* Render Chat Messages */}
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              const textToShow = m.displayedText !== undefined ? m.displayedText : m.text;

              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAi ? 'flex-start' : 'flex-end',
                    maxWidth: '92%',
                    alignSelf: isAi ? 'flex-start' : 'flex-end'
                  }}
                >
                  <div
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '12px', // Nice 4 corner radius
                      background: isAi ? '#ffffff' : '#4A3B2C',
                      color: isAi ? '#1C1917' : '#ffffff',
                      boxShadow: isAi ? '0 2px 10px rgba(0,0,0,0.05)' : '0 2px 10px rgba(0,0,0,0.12)',
                      border: isAi ? '1px solid #E7E5E4' : 'none',
                      fontSize: '0.98rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      width: '100%'
                    }}
                  >
                    {/* User Attached Image direct preview */}
                    {m.image && (
                      <img
                        src={m.image}
                        alt="Attached media"
                        style={{
                          width: '100%',
                          maxHeight: 220,
                          objectFit: 'cover',
                          borderRadius: '8px',
                          marginBottom: '0.75rem'
                        }}
                      />
                    )}

                    {textToShow}

                    {/* Rich Video Card Result in Chat (at most 2 current videos) */}
                    {m.videoIds && m.videoIds.length > 0 && (
                      <div
                        style={{
                          marginTop: '1.2rem',
                          display: 'grid',
                          gap: '1.2rem'
                        }}
                      >
                        {m.videoIds.map((vId) => {
                          const v = VIDEOS.find((item) => item.id === vId);
                          if (!v) return null;
                          const thumb = v.thumbUrl || `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`;

                          return (
                            <div
                              key={v.id}
                              style={{
                                background: '#ffffff',
                                borderRadius: '14px', // Nice 4 corner radius
                                border: '1px solid #E7E5E4',
                                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.08)',
                                overflow: 'hidden'
                              }}
                            >
                              {/* Image system on top outside the main details card */}
                              <div
                                style={{
                                  position: 'relative',
                                  width: '100%',
                                  aspectRatio: '16/9',
                                  backgroundColor: '#000000'
                                }}
                              >
                                <img
                                  src={thumb}
                                  alt={v.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                                {v.duration && (
                                  <span
                                    style={{
                                      position: 'absolute',
                                      bottom: '10px',
                                      right: '10px',
                                      background: 'rgba(0,0,0,0.85)',
                                      color: '#ffffff',
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      padding: '0.25rem 0.55rem',
                                      borderRadius: '4px'
                                    }}
                                  >
                                    {v.duration}
                                  </span>
                                )}
                              </div>

                              {/* Brown Card Holding Details */}
                              <div
                                style={{
                                  background: '#4A3B2C', // Brown color card
                                  color: '#ffffff',
                                  padding: '1.1rem'
                                }}
                              >
                                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#E8C25A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                                  {v.subject} &bull; {v.category}
                                </div>

                                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.4rem 0', lineHeight: 1.35, fontFamily: 'var(--serif)' }}>
                                  {v.title}
                                </h3>

                                <div style={{ fontSize: '0.82rem', color: '#D6D3D1', marginBottom: '0.6rem' }}>
                                  🎤 {v.speaker} &bull; 📅 {fmtDate(v.date)}
                                </div>

                                <p style={{ fontSize: '0.85rem', color: '#E7E5E4', lineHeight: 1.5, margin: '0 0 1rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                  {v.description}
                                </p>

                                {/* WATCH VIDEO BUTTON - Closes AI Chat immediately and opens video watch section */}
                                <button
                                  type="button"
                                  onClick={() => handleWatchVideo(v.id)}
                                  style={{
                                    width: '100%',
                                    padding: '0.75rem 1.2rem',
                                    borderRadius: '8px', // Nice 4 corner radius
                                    background: 'linear-gradient(135deg, #E8C25A, #D4AF37)', // Brown/gold accent
                                    color: '#1C1917',
                                    fontWeight: 800,
                                    fontSize: '0.92rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 15px rgba(232, 194, 90, 0.3)',
                                    transition: 'transform 0.15s'
                                  }}
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                  <span>Watch Video</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: '#A8A29E',
                      marginTop: '0.3rem',
                      paddingInline: '0.2rem'
                    }}
                  >
                    {m.time}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div className="thinking-container" style={{ alignSelf: 'flex-start' }}>
                <span className="thinking-orb"></span>
                <span className="thinking-label">Thinking</span>
                <div className="thinking-dots">
                  <span className="thinking-dot"></span>
                  <span className="thinking-dot"></span>
                  <span className="thinking-dot"></span>
                </div>
              </div>
            )}
          </div>

          {/* Alarm Confirmation Toast Banner */}
          {alarmNotice && (
            <div
              style={{
                maxWidth: '860px',
                width: '100%',
                margin: '0 auto',
                padding: '0.75rem 1.5rem',
                background: '#FEF3C7',
                borderTop: '1px solid #F59E0B',
                color: '#92400E',
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.8rem',
                animation: 'fadeIn 0.3s ease'
              }}
            >
              <span>{alarmNotice}</span>
              <button
                type="button"
                onClick={() => setAlarmNotice(null)}
                style={{ background: 'none', border: 'none', color: '#92400E', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Image Attachment Preview Banner */}
          {imagePreview && (
            <div
              style={{
                maxWidth: '860px',
                width: '100%',
                margin: '0 auto',
                padding: '0.6rem 1.5rem',
                background: '#ffffff',
                borderTop: '1px solid #E7E5E4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.8rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <img
                  src={imagePreview}
                  alt="Attachment preview"
                  style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: '6px' }}
                />
                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#1C1917' }}>
                  Image selected
                </span>
              </div>
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 700 }}
              >
                ✕ Remove
              </button>
            </div>
          )}

          {/* Listening / Recording Voice Banner */}
          {recordingStatus && (
            <div
              style={{
                maxWidth: '860px',
                width: '100%',
                margin: '0 auto',
                padding: '0.5rem 1.5rem',
                background: '#FEF2F2',
                borderTop: '1px solid #FCA5A5',
                color: '#DC2626',
                fontWeight: 700,
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626', animation: 'pulse 1s infinite' }}></span>
                <span>{recordingStatus}</span>
              </div>
              <button
                type="button"
                onClick={stopVoiceRecording}
                style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontWeight: 800, fontSize: '0.8rem' }}
              >
                Stop ✕
              </button>
            </div>
          )}

          {/* Full Screen Bottom Input Control Bar */}
          <div
            style={{
              background: '#ffffff',
              borderTop: '1px solid #E7E5E4',
              padding: '0.85rem 1.25rem',
              paddingBottom: 'max(0.85rem, env(safe-area-inset-bottom))',
              zIndex: 10,
              flexShrink: 0,
              boxShadow: '0 -4px 20px rgba(0,0,0,0.06)'
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim() || imagePreview) {
                  handleSend();
                } else if (isRecording) {
                  stopVoiceRecording();
                } else {
                  startVoiceRecording();
                }
              }}
              style={{
                maxWidth: '860px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              {/* Plus (+) icon upload button with 4 corner radius */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageAttach}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Select image or file to attach"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px', // Nice 4 corner radius
                  background: '#F5F5F4',
                  border: '1px solid #E7E5E4',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#44403C',
                  flexShrink: 0
                }}
              >
                {/* Plus (+) Icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: 22, height: 22 }}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>

              {/* Text Area with dynamic expanding height capped at 3 lines, starting at 1 line */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => {
                  if (chatScrollRef.current) {
                    setTimeout(() => {
                      if (chatScrollRef.current) {
                        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
                      }
                    }, 150);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() || imagePreview) {
                      handleSend();
                    } else if (isRecording) {
                      stopVoiceRecording();
                    } else {
                      startVoiceRecording();
                    }
                  }
                }}
                rows={Math.min(Math.max(input.split('\n').length + Math.floor(input.length / (typeof window !== 'undefined' && window.innerWidth < 640 ? 32 : 64)), 1), 3)}
                placeholder="Ask Revelation AI or tap mic to speak..."
                style={{
                  flex: 1,
                  padding: '0.65rem 1.1rem',
                  height: 'auto',
                  borderRadius: '10px', // Nice 4 corner radius
                  border: '1px solid #D6D3D1',
                  outline: 'none',
                  fontSize: '0.96rem',
                  background: '#FAFAF9',
                  color: '#1C1917',
                  resize: 'none',
                  fontFamily: 'inherit',
                  lineHeight: '1.4'
                }}
              />

              {/* Dual Action Button: Voice Microphone Icon when text is empty, Send Icon when text is present */}
              {!input.trim() && !imagePreview ? (
                isRecording ? (
                  /* Red Stop Recording Button */
                  <button
                    type="button"
                    onClick={stopVoiceRecording}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '10px',
                      background: '#DC2626',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.35)'
                    }}
                    title="Stop voice recording"
                    aria-label="Stop recording"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  </button>
                ) : (
                  /* Voice Microphone Button */
                  <button
                    type="button"
                    onClick={startVoiceRecording}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '10px', // 4 corner radius
                      background: '#4A3B2C', // Warm brown color
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 12px rgba(74, 59, 44, 0.25)'
                    }}
                    title="Speak to Revelation AI (Voice to Text)"
                    aria-label="Voice input"
                  >
                    {/* Microphone Icon */}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: 22, height: 22 }}
                    >
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </button>
                )
              ) : (
                /* Send Icon Button */
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px', // 4 corner radius
                    background: '#4A3B2C', // Warm brown color
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: loading ? 0.4 : 1,
                    flexShrink: 0,
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(74, 59, 44, 0.25)'
                  }}
                  aria-label="Send message"
                  title="Send message"
                >
                  {/* Send Arrow Icon */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: 20, height: 20 }}
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};
