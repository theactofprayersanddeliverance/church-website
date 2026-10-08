import React from 'react';
import { ChurchLogo } from './ChurchLogo';
import { SITE } from '../data/siteData';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const links = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Programs', path: '/programs' },
    { label: 'Videos', path: '/videos' },
    { label: 'Books', path: '/books' },
    { label: 'Give', path: '/give' },
    { label: 'Contact', path: '/contact' },
    { label: 'Watch Live', path: '/live' }
  ];

  const handleClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <a
            href="#/"
            className="logo"
            onClick={(e) => handleClick(e, '/')}
          >
            <ChurchLogo />
            <b>{SITE.name}</b>
          </a>
          <div className="flinks">
            {links.map((link) => (
              <a
                key={link.path}
                href={`#${link.path}`}
                onClick={(e) => handleClick(e, link.path)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="copy">
          <span>&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <span>Faith. Hope. Love.</span>
        </div>
      </div>
    </footer>
  );
};
