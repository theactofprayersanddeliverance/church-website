import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RevelationAiModal } from './components/RevelationAiModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { LivePage } from './pages/LivePage';
import { VideosPage } from './pages/VideosPage';
import { VideoDetailPage } from './pages/VideoDetailPage';
import { BooksPage } from './pages/BooksPage';
import { GivePage } from './pages/GivePage';
import { OfferingActivityPage } from './pages/OfferingActivityPage';
import { DonationActivityPage } from './pages/DonationActivityPage';
import { ContactPage } from './pages/ContactPage';
import { SITE } from './data/siteData';
import { HolyBibleReader } from './components/HolyBibleReader';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    try {
      const h = window.location.hash;
      return h.startsWith('#/') ? h.slice(1) : '/';
    } catch {
      return '/';
    }
  });

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      try {
        const h = window.location.hash;
        const newPath = h.startsWith('#/') ? h.slice(1) : '/';
        setCurrentPath(newPath);
      } catch {
        setCurrentPath('/');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update page title & scroll to top on path change
  useEffect(() => {
    window.scrollTo(0, 0);

    const baseTitle = SITE.name;
    let pageTitle = '';

    if (currentPath === '/' || currentPath === '') {
      pageTitle = '';
    } else if (currentPath === '/about' || currentPath === '/ministers') {
      pageTitle = 'About | ';
    } else if (currentPath === '/programs') {
      pageTitle = 'Programs | ';
    } else if (currentPath === '/live') {
      pageTitle = 'Live Service | ';
    } else if (currentPath === '/videos') {
      pageTitle = 'Videos | ';
    } else if (currentPath.startsWith('/video/')) {
      pageTitle = 'Sermon Detail | ';
    } else if (currentPath === '/books') {
      pageTitle = 'Books & Resources | ';
    } else if (currentPath === '/give') {
      pageTitle = 'Give | ';
    } else if (currentPath === '/offering') {
      pageTitle = 'Church Offering | ';
    } else if (currentPath === '/donation') {
      pageTitle = 'Ministry Donation | ';
    } else if (currentPath === '/contact') {
      pageTitle = 'Contact & Visit | ';
    }

    document.title = `${pageTitle}${baseTitle}`;
  }, [currentPath]);

  const navigateTo = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    try {
      window.location.hash = `#${cleanPath}`;
    } catch {}
    setCurrentPath(cleanPath);
  };

  const handleSelectVideo = (id: number) => {
    navigateTo(`/video/${id}`);
  };

  // Render view based on route
  const renderCurrentView = () => {
    if (currentPath === '/' || currentPath === '') {
      return (
        <HomePage
          onNavigate={navigateTo}
          onSelectVideo={handleSelectVideo}
        />
      );
    }

    if (currentPath === '/about' || currentPath === '/ministers' || currentPath === '/faq') {
      return <AboutPage onNavigate={navigateTo} />;
    }

    if (currentPath === '/programs') {
      return <ProgramsPage onNavigate={navigateTo} />;
    }

    if (currentPath === '/live') {
      return <LivePage onNavigate={navigateTo} onSelectVideo={handleSelectVideo} />;
    }

    if (currentPath === '/videos') {
      return <VideosPage onSelectVideo={handleSelectVideo} />;
    }

    if (currentPath.startsWith('/video/')) {
      const parts = currentPath.split('/');
      const videoId = parseInt(parts[2], 10);
      return (
        <VideoDetailPage
          videoId={videoId}
          onNavigate={navigateTo}
          onSelectVideo={handleSelectVideo}
        />
      );
    }

    if (currentPath === '/books') {
      return <BooksPage onNavigate={navigateTo} />;
    }

    if (currentPath === '/give') {
      return <GivePage onNavigate={navigateTo} />;
    }

    if (currentPath === '/offering') {
      return <OfferingActivityPage onNavigate={navigateTo} />;
    }

    if (currentPath === '/donation') {
      return <DonationActivityPage onNavigate={navigateTo} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    // Fallback 404
    return (
      <div className="page-fade-in" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <div className="wrap">
          <h2>Page Not Found</h2>
          <p className="muted" style={{ margin: '1rem auto 2rem' }}>
            The requested page does not exist or may have been moved.
          </p>
          <button
            className="btn btn-dark"
            type="button"
            onClick={() => navigateTo('/')}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  };

  if (currentPath === '/bible') {
    return <HolyBibleReader onClose={() => navigateTo('/')} />;
  }

  return (
    <div id="appRoot">
      <Header currentPath={currentPath} onNavigate={navigateTo} />
      <main id="app" tabIndex={-1}>
        {renderCurrentView()}
      </main>
      <Footer onNavigate={navigateTo} />
      <RevelationAiModal onSelectVideo={handleSelectVideo} onNavigate={navigateTo} />
    </div>
  );
};
export default App;
