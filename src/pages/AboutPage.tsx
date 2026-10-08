import React from 'react';
import { PageHero } from '../components/PageHero';
import { SectionHeader } from '../components/SectionHeader';
import { PASTOR } from '../data/siteData';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="page-fade-in">
      <PageHero
        title="More than a church."
        intro="We are a community of people pursuing God, growing together, serving others, and sharing the transforming hope of Jesus Christ."
      />

      {/* Founder & GO Section */}
      <section className="about pad">
        <div className="wrap split">
          <div className="ph tall rv in">
            <img
              src={PASTOR.photoUrl}
              alt={PASTOR.name}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="prose">
            <h2 className="rv in">{PASTOR.name}</h2>
            <p className="muted rv in" style={{ margin: '.4rem 0 1.4rem', fontWeight: 500 }}>
              {PASTOR.title}
            </p>
            {PASTOR.bio.map((p, idx) => (
              <p key={idx} className="rv in">
                {p}
              </p>
            ))}

            <div className="mv rv in">
              <div>
                <h3>Our mission</h3>
                <p>To lead people into an authentic, growing relationship with Jesus Christ, liberate captives through biblical prayer and deliverance, and send them into the world with divine power.</p>
              </div>
              <div>
                <h3>Our vision</h3>
                <p>A triumphant church where every soul is healed, every spiritual gift is ignited, every home is blessed, and Jesus is glorified in all things.</p>
              </div>
            </div>

            <div className="values rv in">
              <span>Worship</span>
              <span>The Word</span>
              <span>Deliverance</span>
              <span>Prayer</span>
              <span>Community</span>
              <span>Generosity</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pastoral Couple Feature */}
      <section className="about pad" style={{ background: '#fff' }}>
        <div className="wrap split">
          <div className="prose">
            <h2 className="rv in">{PASTOR.coupleNames}</h2>
            <p className="muted rv in" style={{ margin: '.4rem 0 1.4rem', fontWeight: 500 }}>
              {PASTOR.coupleTitle}
            </p>
            {PASTOR.coupleBio.map((p, idx) => (
              <p key={idx} className="rv in">
                {p}
              </p>
            ))}
            <div style={{ marginTop: '2.5rem' }}>
              <a
                className="btn btn-dark"
                href="#/contact"
                onClick={(e) => { e.preventDefault(); onNavigate('/contact'); }}
              >
                Plan a visit
              </a>
            </div>
          </div>
          <div
            className="ph couple rv in"
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

      {/* What We Believe */}
      <section className="services pad">
        <div className="wrap">
          <SectionHeader title="What we believe." />
          <div className="beliefs">
            <div className="rv in">
              <h3>The Holy Bible</h3>
              <p>The Scriptures are the infallible, inspired, and authoritative Word of God, our supreme guide in faith and conduct.</p>
            </div>
            <div className="rv in">
              <h3>Jesus Christ</h3>
              <p>He is the only begotten Son of God, who died for our sins, bodily resurrected, ascended into heaven, and is returning in glory.</p>
            </div>
            <div className="rv in">
              <h3>Fervent Prayer & Fasting</h3>
              <p>Prayer moves heaven and transforms earthly circumstances. It is our weapon of victory, communion with God, and channel of divine power.</p>
            </div>
            <div className="rv in">
              <h3>Deliverance and Divine Healing</h3>
              <p>Christ has given His church power to break demonic chains, cast out evil spirits, heal sicknesses, and establish kingdom liberty today.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
