import React, { useState, useEffect } from 'react';
import { ChurchLogo } from './ChurchLogo';
import { SITE } from '../data/siteData';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'about', label: 'About', path: '/about' },
  { id: 'programs', label: 'Programs', path: '/programs' },
  { id: 'videos', label: 'Videos', path: '/videos' },
  { id: 'books', label: 'Books', path: '/books' },
  { id: 'give', label: 'Give', path: '/give' },
  { id: 'contact', label: 'Contact', path: '/contact' },
  { id: 'live', label: 'Watch Live', path: '/live' },
  { id: 'bible', label: 'Holy Bible', path: '/bible' }
];

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMenuOpen(false);
    onNavigate(path);
  };

  const isCurrent = (path: string) => {
    if (path === '/' && (currentPath === '/' || currentPath === '')) return true;
    return currentPath === path;
  };

  return (
    <>
      <header className={`hdr ${scrolled ? 'scrolled' : ''}`} id="hdr">
        <div className="hdr-in">
          <a
            href="#/"
            className="logo"
            aria-label="Home"
            onClick={(e) => handleLinkClick(e, '/')}
          >
            <ChurchLogo />
            <b>{SITE.short}</b>
          </a>

          <nav className="nav" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.path}`}
                className={`l ${isCurrent(item.path) ? 'active' : ''}`}
                aria-current={isCurrent(item.path) ? 'page' : undefined}
                onClick={(e) => handleLinkClick(e, item.path)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              className="burger"
              id="burger"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="sheet"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay Sheet */}
      <div
        className={`sheet ${menuOpen ? 'open' : ''}`}
        id="sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        aria-hidden={!menuOpen}
      >
        <div className="sheet-in" id="sheetIn">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.path}`}
              className={`m ${isCurrent(item.path) ? 'active' : ''}`}
              aria-current={isCurrent(item.path) ? 'page' : undefined}
              onClick={(e) => handleLinkClick(e, item.path)}
            >
              {item.label}
            </a>
          ))}

          <div className="sheet-foot">
            <a
              className="btn btn-accent"
              href="#/give"
              onClick={(e) => handleLinkClick(e, '/give')}
            >
              Give Offering
            </a>
            <a
              className="btn btn-ghost"
              href="#/contact"
              onClick={(e) => handleLinkClick(e, '/contact')}
            >
              Plan a Visit
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
