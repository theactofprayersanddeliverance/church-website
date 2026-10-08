import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { ServiceCard } from '../components/ServiceCard';
import { VideoCard } from '../components/VideoCard';
import { SERVICES, VIDEOS, PASTOR } from '../data/siteData';
import { MinistryFaq } from '../components/MinistryFaq';
import africanWorshipBg from '../assets/images/african_worship_bg_1791416800902.jpg';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectVideo: (id: number) => void;
  onOpenTestimony?: (t: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectVideo
}) => {
  const recentVideos = VIDEOS.slice(0, 3);

  return (
    <div className="page-fade-in">
      {/* Hero Section with blurred church worship crowd background */}
      <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          className="hero-bg"
          id="heroBg"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: -2,
            overflow: 'hidden'
          }}
        >
          <img
            src={africanWorshipBg}
            alt="African church congregation raising hands in praise and worship"
            referrerPolicy="no-referrer"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(5px) brightness(0.36)',
              transform: 'scale(1.06)'
            }}
          />
        </div>
        <div className="beam b1"></div>
        <div className="beam b2"></div>
        <div className="beam b3"></div>

        <div className="hero-c">
          <h1 className="hero-in" style={{ marginTop: '1rem' }}>
            Faith that <em>transforms</em> lives.
          </h1>
          <p className="hero-in">
            Welcome to a community where faith grows, lives change, and people discover their purpose in Christ.
          </p>
          <div className="ctas hero-in">
            <a
              className="btn btn-solid"
              href="#/programs"
              onClick={(e) => { e.preventDefault(); onNavigate('/programs'); }}
            >
              Join us
            </a>
            <a
              className="btn btn-ghost"
              href="#/videos"
              onClick={(e) => { e.preventDefault(); onNavigate('/videos'); }}
            >
              Watch sermons
            </a>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <i></i>Scroll to explore
        </div>
      </section>

      {/* About Overview */}
      <section className="about pad">
        <div className="wrap split">
          <div>
            <h2 className="rv in">More than a church.</h2>
            <p className="lede rv in" style={{ '--d': '.1s' } as React.CSSProperties}>
              We are a community of believers pursuing God, growing together, serving others, and sharing the victorious deliverance of Jesus Christ.
            </p>
            <div className="values rv in" style={{ '--d': '.15s' } as React.CSSProperties}>
              <span>Prayer</span>
              <span>The Word</span>
              <span>Deliverance</span>
              <span>Community</span>
              <span>Service</span>
            </div>

            <div className="pastor rv in" style={{ '--d': '.2s' } as React.CSSProperties}>
              <div className="avatar" aria-hidden="true">
                <img src={PASTOR.photoUrl} alt={PASTOR.name} />
              </div>
              <div>
                <b>{PASTOR.name}</b>
                <small>{PASTOR.title}</small>
              </div>
            </div>

            <div className="rv in" style={{ marginTop: '2rem', '--d': '.25s' } as React.CSSProperties}>
              <a
                className="btn btn-dark"
                href="#/about"
                style={{
                  padding: '0.85rem 2.8rem',
                  minWidth: '220px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onClick={(e) => { e.preventDefault(); onNavigate('/about'); }}
              >
                Read Our Full Story
              </a>
            </div>
          </div>

          <div
            className="ph tall rv in"
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 12px 35px -10px rgba(0,0,0,0.18)'
            }}
          >
            <img
              src={PASTOR.couplePhotoUrl}
              alt={PASTOR.coupleNames}
              style={{ objectFit: 'cover', borderRadius: '24px' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                insetInline: 0,
                padding: '1.2rem 1.4rem 1rem',
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(12,12,13,0.88) 100%)',
                color: '#ffffff',
                borderBottomLeftRadius: '24px',
                borderBottomRightRadius: '24px'
              }}
            >
              <div
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  color: '#FDE047',
                  textTransform: 'uppercase',
                  marginBottom: '0.2rem'
                }}
              >
                Pastoral Leadership
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                Pastor and Pastor Mrs. Revelation, Israel
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services pad">
        <div className="wrap">
          <SectionHeader
            title="There is a seat for you."
            lede="Come as you are. Every service includes fervent worship, life-transforming messages from the Bible, and an atmosphere of freedom."
            cta={
              <a
                className="btn btn-dark"
                href="#/programs"
                onClick={(e) => { e.preventDefault(); onNavigate('/programs'); }}
              >
                Full programme
              </a>
            }
          />
          <div className="cards">
            {SERVICES.map((s, idx) => (
              <ServiceCard key={s.id} service={s} index={idx} />
            ))}
          </div>

          {/* Monthly Vigils Highlight Box */}
          <div
            className="rv in"
            style={{
              marginTop: '2.5rem',
              padding: '2rem 2.2rem',
              borderRadius: '12px',
              background: 'var(--charcoal)',
              color: '#fff',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem',
              boxShadow: '0 15px 35px -10px rgba(0,0,0,0.4)',
              border: '1px solid rgba(184, 147, 90, 0.4)'
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-block',
                  color: 'var(--accent)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '0.4rem'
                }}
              >
                Special Monthly Vigils
              </span>
              <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.4rem' }}>
                THE LAST NIGHT IN EGYPT &amp; Workers' Vigil
              </h3>
              <p style={{ color: '#d4d4d0', fontSize: '0.96rem', maxWidth: '64ch' }}>
                Join us for <b>Workers' Night Vigil</b> every 2nd Thursday, and our general prophetic deliverance vigil <b>THE LAST NIGHT IN EGYPT</b> every last day of the month.
              </p>
            </div>
            <a
              className="btn btn-accent"
              href="#/programs"
              onClick={(e) => { e.preventDefault(); onNavigate('/programs'); }}
            >
              View Vigils Schedule
            </a>
          </div>
        </div>
      </section>

      {/* Sermons / Videos Section */}
      <section className="sermons pad">
        <div className="wrap">
          <SectionHeader
            title="Hear the Word."
            lede="Catch up on recent life-changing messages and teachings from Pastor Israel Revelation, or browse our complete archive."
            cta={
              <a
                className="btn btn-line"
                href="#/videos"
                onClick={(e) => { e.preventDefault(); onNavigate('/videos'); }}
              >
                All videos
              </a>
            }
          />
          <div className="sgrid">
            {recentVideos.map((v, idx) => (
              <VideoCard
                key={v.id}
                video={v}
                index={idx}
                onSelect={onSelectVideo}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Ministry Frequently Asked Questions (Accordion) */}
      <MinistryFaq />

      {/* Giving Section with actions to Offering & Donation activities */}
      <section className="give dark pad" style={{ overflow: 'hidden' }}>
        <div className="ph" style={{ position: 'absolute', inset: 0, borderRadius: 0 }}>
          <div className="ph-in" style={{ opacity: 0.25 }}></div>
        </div>
        <div className="wrap" style={{ position: 'relative' }}>
          <h2 className="rv in">Give with joy.</h2>
          <p className="lede rv in" style={{ '--d': '.1s' } as React.CSSProperties}>
            Your generosity feeds families, supports kingdom outreach, and keeps our doors open to everyone who needs a spiritual home.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              className="btn btn-accent rv in"
              href="#/offering"
              style={{ '--d': '.2s' } as React.CSSProperties}
              onClick={(e) => { e.preventDefault(); onNavigate('/offering'); }}
            >
              Give Offering
            </a>
            <a
              className="btn btn-ghost rv in"
              href="#/donation"
              style={{ '--d': '.25s' } as React.CSSProperties}
              onClick={(e) => { e.preventDefault(); onNavigate('/donation'); }}
            >
              Make a Donation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
