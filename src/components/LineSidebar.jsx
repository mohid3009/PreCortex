import { useState, useEffect } from 'react';
import { sectionTop, scrollToSection } from '../utils/scroll';

const SECTIONS = [
  { id: 'intro',      label: 'PROBLEM',     num: '01', light: false },
  { id: 'about',      label: 'INNOVATION',  num: '02', light: true  },
  { id: 'technology', label: 'MULTI-AGENT', num: '03', light: false },
  { id: 'sdg',        label: 'SDG GOALS',   num: '04', light: true  },
  { id: 'contact',    label: 'PITCH',       num: '05', light: false },
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
      const scrollPos = window.scrollY + window.innerHeight / 2;
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const top = sectionTop(s.id);
        if (top !== null && scrollPos >= top) current = s.id;
      }
      setActive(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => scrollToSection(id);

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
          background: rgba(255,255,255,0.40);
        }
        .sidebar-segment {
          width: 2px;
          height: 32px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          background: rgba(255,255,255,0.18);
        }
        .sidebar-segment::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 0%;
          transition: height 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          background: linear-gradient(to bottom, #FFFFFF, #C8C8C8);
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
          color: rgba(255,255,255,0.60);
        }

        /* ── Dark active states ───────────────────────────── */
        .sidebar-item.active .sidebar-segment::after { height: 100%; }
        .sidebar-item.active .sidebar-dot {
          width: 4px;
          height: 4px;
          background: #FFFFFF;
          box-shadow: 0 0 8px rgba(255,255,255,0.8);
        }
        .sidebar-item:hover .sidebar-label,
        .sidebar-item.active .sidebar-label {
          opacity: 1;
          transform: translateX(0);
          color: rgba(255,255,255,0.85);
        }
        .sidebar-item.active .sidebar-label {
          color: #FFFFFF;
          font-weight: 700;
        }

        /* ── LIGHT theme overrides ────────────────────────── */
        .line-sidebar.light .sidebar-dot {
          background: rgba(0,0,0,0.30);
        }
        .line-sidebar.light .sidebar-segment {
          background: rgba(0,0,0,0.18);
        }
        .line-sidebar.light .sidebar-segment::after {
          background: linear-gradient(to bottom, #0A0A0A, #444);
        }
        .line-sidebar.light .sidebar-label {
          color: rgba(0,0,0,0.55);
        }
        .line-sidebar.light .sidebar-item.active .sidebar-dot {
          width: 4px;
          height: 4px;
          background: #0A0A0A;
          box-shadow: 0 0 8px rgba(0,0,0,0.35);
        }
        .line-sidebar.light .sidebar-item:hover .sidebar-label,
        .line-sidebar.light .sidebar-item.active .sidebar-label {
          color: rgba(0,0,0,0.85);
        }
        .line-sidebar.light .sidebar-item.active .sidebar-label {
          color: #0A0A0A;
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
