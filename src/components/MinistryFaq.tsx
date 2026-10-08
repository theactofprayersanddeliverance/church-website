import React, { useState } from 'react';
import { SectionHeader } from './SectionHeader';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const MINISTRY_FAQS: FaqItem[] = [
  {
    id: 1,
    category: "Ministry Focus",
    question: "What is the spiritual mandate and mission of The Act of Prayers & Deliverance Ministries?",
    answer: "Our ministry is founded upon apostolic prayer, prophetic deliverance, and the uncompromised Word of God. Under the leadership of General Overseer Pastor Israel Revelation, our mission is to liberate souls from spiritual bondages, heal the brokenhearted, ignite personal revival, and equip believers to walk in victory and righteousness through Jesus Christ."
  },
  {
    id: 2,
    category: "Weekly Services",
    question: "When and where do our regular weekly services and fellowship meetings take place?",
    answer: "We gather weekly at our International Headquarters Sanctuary: Sunday Worship & Deliverance Service (Sundays at 9:00 AM), Youth Fellowship and Men's Fellowship (Mondays at 4:00 PM), Prayer Group Meeting (Mondays at 4:30 PM), Bible Study (Tuesdays at 4:00 PM), and Choir Practice & Rehearsals (Wednesdays and Saturdays at 4:00 PM)."
  },
  {
    id: 3,
    category: "Monthly Vigils",
    question: "What are the two monthly night vigils and when are they held?",
    answer: "We hold two powerful monthly all-night vigils from 10:00 PM till Dawn: 1) The Workers' Night Vigil takes place every second (2nd) Thursday of every month, dedicated to ministers and church workers consecration. 2) Our flagship general deliverance vigil, titled 'THE LAST NIGHT IN EGYPT', takes place every last day of every month for everyone seeking total freedom and supernatural breakthroughs."
  },
  {
    id: 4,
    category: "Giving & Support",
    question: "How can I pay my offering, tithe, or support church projects?",
    answer: "To pay your offering, tithe, or project seed, simply go to the Give section on our website menu. Choose whether you want to make an Offering or a Ministry Donation, select your preferred payment method, and follow the step-by-step directions on the screen. All payment channels and account details are kept updated directly from our official server."
  },
  {
    id: 5,
    category: "Prayer & Counseling",
    question: "How can I request deliverance prayer or meet with Pastor Israel Revelation?",
    answer: "You are warmly welcome to visit our Sanctuary during our Tuesday Bible Studies or Monday Prayer Group meetings. You can also submit prayer requests and pastoral appointment requests directly through our Contact page, and our ministry pastoral team will connect with you."
  }
];

export const MinistryFaq: React.FC = () => {
  // Only ONE FAQ open at a time: when another is clicked, the previous closes and the new one opens!
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="pad" style={{ background: 'var(--paper)', borderTop: '1px solid var(--stone)' }}>
      <div className="wrap" style={{ maxWidth: 880 }}>
        <SectionHeader
          title="Frequently asked questions."
          lede="Common questions and clear answers about The Act of Prayers & Deliverance Ministries International."
        />

        <div style={{ display: 'grid', gap: '0.85rem', marginTop: '2rem' }}>
          {MINISTRY_FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                style={{
                  background: '#ffffff',
                  border: isOpen ? '1.5px solid var(--accent)' : '1px solid var(--stone)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  transition: 'all 0.28s var(--ease)',
                  boxShadow: isOpen
                    ? '0 12px 30px -10px rgba(184, 147, 90, 0.2), 0 4px 15px rgba(0,0,0,0.04)'
                    : '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    padding: 'clamp(1rem, 2.5vw, 1.35rem) clamp(1.2rem, 3vw, 1.6rem)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: isOpen ? 'var(--accent)' : 'var(--mist)',
                        marginBottom: '0.3rem',
                        transition: 'color 0.2s'
                      }}
                    >
                      {faq.category}
                    </span>
                    <h3
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: 'clamp(0.98rem, 2vw, 1.12rem)',
                        fontWeight: 600,
                        color: isOpen ? 'var(--charcoal)' : '#2A2B2D',
                        lineHeight: 1.4,
                        margin: 0
                      }}
                    >
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: isOpen ? 'var(--accent)' : 'var(--paper)',
                      border: '1px solid var(--stone)',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      transition: 'all 0.25s var(--ease)',
                      color: isOpen ? '#0C0C0D' : 'var(--charcoal)'
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        width: 14,
                        height: 14,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s var(--ease)'
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 clamp(1.2rem, 3vw, 1.6rem) clamp(1.1rem, 2.5vw, 1.4rem)',
                      borderTop: '1px solid rgba(0,0,0,0.06)',
                      animation: 'textFadeIn 0.25s ease-out both'
                    }}
                  >
                    <p
                      style={{
                        color: '#4B4C4E',
                        fontSize: 'clamp(0.9rem, 1.6vw, 0.98rem)',
                        lineHeight: 1.65,
                        margin: 0,
                        paddingTop: '0.9rem',
                        maxWidth: '100%'
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
