import React from 'react';
import { PageHero } from '../components/PageHero';
import { SectionHeader } from '../components/SectionHeader';
import { ServiceCard } from '../components/ServiceCard';
import { SERVICES, VIGILS, EVENTS, SITE } from '../data/siteData';

interface ProgramsPageProps {
  onNavigate: (path: string) => void;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({ onNavigate }) => {
  return (
    <div className="page-fade-in">
      <PageHero
        title="Our Church Activities."
        intro="Join us for our weekly gatherings, fellowships, and powerful monthly deliverance night vigils."
      />

      {/* Weekly Programme */}
      <section className="services pad">
        <div className="wrap">
          <SectionHeader
            title="Weekly Activities."
            lede="Every gathering is a divine appointment with God, filled with fervent prayer, the undiluted Word, and heavenly worship."
          />
          <div className="cards">
            {SERVICES.map((s, idx) => (
              <ServiceCard key={s.id} service={s} index={idx} />
            ))}
          </div>
          <p className="muted rv in" style={{ marginTop: '1.8rem' }}>
            Sanctuary Location: {SITE.address}
          </p>
        </div>
      </section>

      {/* Monthly Vigils */}
      <section className="events pad" style={{ background: '#0C0C0D', color: '#fff' }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <h2 className="rv in" style={{ color: '#fff' }}>Monthly Night Vigils.</h2>
              <p className="lede rv in" style={{ color: '#bdbdb9', '--d': '.1s' } as React.CSSProperties}>
                Power-packed all-night prayer battles and supernatural crossover meetings.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.8rem' }}>
            {VIGILS.map((v, idx) => (
              <div
                key={v.id}
                className="card rv in"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: v.id === 2 ? 'var(--accent)' : 'rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  borderWidth: v.id === 2 ? '2px' : '1px',
                  '--d': `${idx * 0.1}s`
                } as React.CSSProperties}
              >
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: 'var(--accent)',
                      marginBottom: '0.6rem'
                    }}
                  >
                    {v.schedule}
                  </span>
                  <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.3rem' }}>
                    {v.title}
                  </h3>
                  {v.subtitle && (
                    <p style={{ color: '#e8dcc6', fontSize: '0.95rem', marginBottom: '0.8rem' }}>
                      {v.subtitle}
                    </p>
                  )}
                  <div style={{ color: '#a9a9a5', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
                    ⏰ {v.time} &nbsp;|&nbsp; 📍 {v.venue}
                  </div>
                  <p style={{ color: '#d4d4d0', fontSize: '0.98rem', lineHeight: 1.6 }}>
                    {v.info}
                  </p>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                  <a
                    className={`btn ${v.id === 2 ? 'btn-accent' : 'btn-ghost'}`}
                    href="#/contact"
                    onClick={(e) => { e.preventDefault(); onNavigate('/contact'); }}
                  >
                    Plan to attend
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Dates */}
      <section className="events pad" style={{ background: 'var(--paper)' }}>
        <div className="wrap">
          <SectionHeader
            title="Upcoming Vigil Dates."
            lede="Mark your calendars and prepare your heart to encounter God's power."
          />
          <div>
            {EVENTS.map((e, idx) => {
              const eventDate = new Date(e.date + "T12:00:00");
              const dayNum = eventDate.getDate();
              const monthStr = eventDate.toLocaleDateString("en-US", { month: "short" });

              return (
                <div key={e.id} className="erow rv in" style={{ '--d': `${idx * 0.06}s` } as React.CSSProperties}>
                  <div className="d">
                    {dayNum}
                    <small>{monthStr}</small>
                  </div>
                  <div>
                    <h3>{e.title}</h3>
                    <p>{e.time} &nbsp;|&nbsp; {e.venue}. {e.info}</p>
                  </div>
                  <a
                    className="btn btn-line"
                    href="#/contact"
                    onClick={(e) => { e.preventDefault(); onNavigate('/contact'); }}
                  >
                    Plan to come
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
