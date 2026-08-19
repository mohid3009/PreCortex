import { useState, useEffect, useRef } from 'react';

export default function Navbar({ sections }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollTo = (id) => {
    const sectionIndex = navLinks.findIndex(link => link.id === id);
    if (sectionIndex !== -1) {
      const topOffset = (sectionIndex + 1) * window.innerHeight;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Problem', id: 'intro' },
    { label: 'Innovation', id: 'about' },
    { label: 'Multi-Agent', id: 'technology' },
    { label: 'SDG Goals', id: 'sdg' },
    { label: 'Live Demo', id: 'work' },
    { label: 'Pitch', id: 'contact' },
  ];

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: 78%;
          max-width: 1100px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px 0 24px;
          background: rgba(10, 10, 10, 0.78);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 1px 0 0 rgba(255,255,255,0.06) inset,
                      0 8px 32px rgba(0,0,0,0.5);
        }
        .navbar.scrolled {
          height: 54px;
          background: rgba(6, 6, 6, 0.90);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          box-shadow: 0 1px 0 0 rgba(255,255,255,0.07) inset,
                      0 12px 40px rgba(0,0,0,0.7);
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .navbar-logo {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: linear-gradient(135deg, #555, #E5E5E5, #777);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .navbar-logo svg {
          width: 14px;
          height: 14px;
        }
        .navbar-wordmark {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #F5F5F5;
          letter-spacing: -0.02em;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .navbar-link {
          background: none;
          border: none;
          color: #A0A0A0;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 450;
          padding: 7px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: color 0.2s ease, background 0.2s ease;
          letter-spacing: -0.01em;
        }
        .navbar-link:hover {
          color: #F5F5F5;
          background: rgba(255,255,255,0.06);
        }
        .navbar-cta {
          background: #F5F5F5;
          color: #0A0A0A;
          border: none;
          padding: 9px 20px;
          border-radius: 12px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
          letter-spacing: -0.01em;
          flex-shrink: 0;
        }
        .navbar-cta:hover {
          background: #FFFFFF;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(255,255,255,0.15);
        }
        .navbar-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .navbar-hamburger:hover { background: rgba(255,255,255,0.06); }
        .navbar-hamburger span {
          display: block;
          width: 20px;
          height: 1.5px;
          background: #A0A0A0;
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          transform-origin: center;
        }
        .navbar-hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(4.7px, 4.7px); }
        .navbar-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .navbar-hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(4.7px, -4.7px); }

        .mobile-menu {
          position: fixed;
          top: 94px;
          left: 50%;
          transform: translateX(-50%);
          width: 78%;
          max-width: 1100px;
          background: rgba(8, 8, 8, 0.95);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 16px;
          padding: 12px;
          z-index: 999;
          display: flex;
          flex-direction: column;
          gap: 4px;
          opacity: 0;
          pointer-events: none;
          transform: translateX(-50%) translateY(-8px);
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .mobile-menu.open {
          opacity: 1;
          pointer-events: all;
          transform: translateX(-50%) translateY(0);
        }
        .mobile-menu-link {
          background: none;
          border: none;
          color: #A0A0A0;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 450;
          padding: 12px 16px;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          transition: color 0.2s, background 0.2s;
        }
        .mobile-menu-link:hover { color: #F5F5F5; background: rgba(255,255,255,0.06); }
        .mobile-menu-cta {
          background: #F5F5F5;
          color: #0A0A0A;
          border: none;
          padding: 12px 16px;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          margin-top: 4px;
          transition: background 0.2s;
        }
        .mobile-menu-cta:hover { background: #FFFFFF; }

        @media (max-width: 768px) {
          .navbar { width: 92%; padding: 0 16px; }
          .navbar-links { display: none; }
          .navbar-cta { display: none; }
          .navbar-hamburger { display: flex; }
          .mobile-menu { width: 92%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .navbar, .navbar-cta, .navbar-link, .mobile-menu { transition: none; }
        }
      `}</style>

      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <a className="navbar-brand" href="#hero" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="navbar-logo" aria-hidden="true" style={{ background: 'none' }}>
            <img src="/logo.png" alt="PreCortex Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span className="navbar-wordmark">PreCortex</span>
        </a>

        <div className="navbar-links" role="list">
          {navLinks.map(link => (
            <button
              key={link.id}
              className="navbar-link"
              onClick={() => scrollTo(link.id)}
              role="listitem"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="navbar-cta" onClick={() => scrollTo('contact')}>
            Our Product
          </button>
          <button
            className={`navbar-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        {navLinks.map(link => (
          <button key={link.id} className="mobile-menu-link" onClick={() => scrollTo(link.id)}>
            {link.label}
          </button>
        ))}
        <button className="mobile-menu-cta" onClick={() => scrollTo('contact')}>
          Our Product
        </button>
      </div>
    </>
  );
}
