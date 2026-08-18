import { useState, useEffect } from 'react';

const SECTIONS = [
  { id: 'intro',      label: 'INTRO',      num: '01', light: false },
  { id: 'about',      label: 'ABOUT',      num: '02', light: true  },
  { id: 'features',   label: 'FEATURES',   num: '03', light: false },
  { id: 'technology', label: 'TECHNOLOGY', num: '04', light: true  },

  { id: 'contact',    label: 'CONTACT',    num: '05', light: false },
];

export default function LineSidebar() {
  const [active, setActive] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Find the currently visible section based on scroll position
      const scrollPos = window.scrollY + window.innerHeight / 3;
      let currentSection = '';

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset;
          // Since all sections are sticky, they sit at their top position.
          // We check if the scroll has passed their top entry.
          if (scrollPos >= top) {
            currentSection = section.id;
          }
        }
      }
      setActive(currentSection || 'intro');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load to set initial active state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const sectionIndex = SECTIONS.findIndex(s => s.id === id);
    if (sectionIndex !== -1) {
      // Offset by 1 to skip the Hero section
      const topOffset = (sectionIndex + 1) * window.innerHeight;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  const isLight = SECTIONS.find(s => s.id === active)?.light ?? false;

  return (
    <>
      <style>{`
        /* ── Base sidebar ─────────────────────────────────── */
        .line-sidebar {
          position: fixed;
          left: 32px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 0;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .line-sidebar.visible {
          opacity: 1;
          pointer-events: all;
        }

        /* ── Item ─────────────────────────────────────────── */
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 9px 0;
          background: none;
          border: none;
          position: relative;
        }

        /* ── Line track ───────────────────────────────────── */
        .sidebar-line-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 3px;
          flex-shrink: 0;
        }
        .sidebar-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          flex-shrink: 0;
          /* dark default */
          background: rgba(255,255,255,0.18);
        }
        .sidebar-segment {
          width: 2px;
          height: 32px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          /* dark default */
          background: rgba(255,255,255,0.10);
        }
        .sidebar-segment::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 0%;
          transition: height 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          /* dark default fill */
          background: linear-gradient(to bottom, #E5E5E5, #A8A8A8);
        }

        /* ── Label ────────────────────────────────────────── */
        .sidebar-label {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          letter-spacing: 0.14em;
          font-weight: 600;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.3s ease, transform 0.3s ease, color 0.3s ease;
          /* dark default */
          color: rgba(255,255,255,0.20);
        }

        /* ── Dark active states ───────────────────────────── */
        .sidebar-item.active .sidebar-segment::after { height: 100%; }
        .sidebar-item.active .sidebar-dot {
          width: 4px;
          height: 4px;
          background: #E5E5E5;
          box-shadow: 0 0 8px rgba(229,229,229,0.6);
        }
        .sidebar-item:hover .sidebar-label,
        .sidebar-item.active .sidebar-label {
          opacity: 1;
          transform: translateX(0);
          color: rgba(255,255,255,0.60);
        }
        .sidebar-item.active .sidebar-label {
          color: #D8D8D8;
        }

        /* ── LIGHT theme overrides ────────────────────────── */
        .line-sidebar.light .sidebar-dot {
          background: rgba(0,0,0,0.18);
        }
        .line-sidebar.light .sidebar-segment {
          background: rgba(0,0,0,0.10);
        }
        .line-sidebar.light .sidebar-segment::after {
          background: linear-gradient(to bottom, #1A1A1A, #555);
        }
        .line-sidebar.light .sidebar-label {
          color: rgba(0,0,0,0.25);
        }
        .line-sidebar.light .sidebar-item.active .sidebar-dot {
          width: 4px;
          height: 4px;
          background: #1A1A1A;
          box-shadow: 0 0 8px rgba(0,0,0,0.25);
        }
        .line-sidebar.light .sidebar-item:hover .sidebar-label,
        .line-sidebar.light .sidebar-item.active .sidebar-label {
          color: rgba(0,0,0,0.60);
        }
        .line-sidebar.light .sidebar-item.active .sidebar-label {
          color: #1A1A1A;
          font-weight: 700;
        }

        /* ── Responsive ───────────────────────────────────── */
        @media (max-width: 1024px) { .line-sidebar { display: none; } }
        @media (prefers-reduced-motion: reduce) {
          .line-sidebar, .sidebar-item, .sidebar-segment::after,
          .sidebar-dot, .sidebar-label { transition: none; }
        }
      `}</style>

      <aside
        className={`line-sidebar${visible ? ' visible' : ''}${isLight ? ' light' : ''}`}
        aria-label="Section navigation"
      >
        {SECTIONS.map(({ id, label, num }) => (
          <button
            key={id}
            className={`sidebar-item${active === id ? ' active' : ''}`}
            onClick={() => scrollTo(id)}
            aria-label={`Navigate to ${label} section`}
            tabIndex={visible ? 0 : -1}
          >
            <div className="sidebar-line-wrap">
              <div className="sidebar-dot" />
              <div className="sidebar-segment" />
            </div>
            <span className="sidebar-label">{num} {label}</span>
          </button>
        ))}
      </aside>
    </>
  );
}
