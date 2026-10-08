import React, { useState } from 'react';
import { PageHero } from '../components/PageHero';
import { SITE } from '../data/siteData';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setStatus('Please enter your name and a valid email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setStatus('Please provide a valid email format.');
      return;
    }

    setSubmitting(true);
    setStatus('Submitting message...');

    // Simulate sending message
    setTimeout(() => {
      setSubmitting(false);
      setStatus('Thank you! Your message has been received. Our ministry team will connect with you shortly.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 600);
  };

  return (
    <div className="page-fade-in">
      <PageHero
        title="Plan your visit."
        intro="Tell us you are coming or send us a prayer request, and someone will be honored to welcome and pray with you."
      />

      <section className="contact pad">
        <div className="wrap split" style={{ alignItems: 'flex-start' }}>
          <div>
            <h2 className="rv in">We would love to hear from you.</h2>
            <p className="lede rv in" style={{ marginTop: '1rem', color: '#555' }}>
              Whether you are seeking prayers for healing, looking for spiritual guidance, or planning your first Sunday visit, our doors and hearts are open.
            </p>

            <div className="cinfo rv in" style={{ '--d': '.1s' } as React.CSSProperties}>
              <div>
                <b>Church Address</b>
                <span>{SITE.address}</span>
              </div>
              <div>
                <b>Phone Lines</b>
                <span>{SITE.phone}</span>
              </div>
              <div>
                <b>Email Address</b>
                <span>{SITE.email}</span>
              </div>
            </div>
          </div>

          <form className="rv in" style={{ '--d': '.1s' } as React.CSSProperties} onSubmit={handleSubmit} noValidate>
            <label>
              Your full name *
              <input
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. John Doe"
              />
            </label>

            <label>
              Email address *
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="e.g. john@example.com"
              />
            </label>

            <label>
              Phone number (optional)
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. (555) 000-0000"
              />
            </label>

            <label>
              How can we pray for or help you?
              <textarea
                name="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message or prayer request here..."
              />
            </label>

            <button
              className="btn btn-dark"
              type="submit"
              disabled={submitting}
              style={{ justifySelf: 'start', marginTop: '.5rem' }}
            >
              {submitting ? 'Sending...' : 'Send message'}
            </button>

            {status && (
              <div className="ok" role="status" style={{ marginTop: '.8rem' }}>
                {status}
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};
