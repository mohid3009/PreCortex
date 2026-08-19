import { useState, useEffect } from 'react';
import FaultyTerminal from '../components/FaultyTerminal';
import { scrollToSection } from '../utils/scroll';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #050505;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            to bottom,
            rgba(5,5,5,0.30) 0%,
            rgba(5,5,5,0.50) 50%,
            rgba(5,5,5,0.82) 100%
          );
          pointer-events: none;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 24px;
          max-width: 860px;
          width: 100%;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 100px;
          padding: 6px 14px 6px 8px;
          margin-bottom: 40px;
          opacity: 0;
          animation: fadeInDown 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards;
        }
        .hero-badge-tag {
          background: #E5E5E5;
          color: #0A0A0A;
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 3px 8px;
          border-radius: 100px;
          text-transform: uppercase;
        }
        .hero-badge-text {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: #A0A0A0;
          font-weight: 450;
          letter-spacing: -0.01em;
        }
        .hero-heading {
          font-family: 'Inter', sans-serif;
          font-size: clamp(2.8rem, 6.5vw, 6rem);
          font-weight: 650;
          line-height: 1.00;
          letter-spacing: -0.04em;
          color: #F5F5F5;
          margin: 0 0 28px 0;
          opacity: 0;
          animation: fadeInUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.35s forwards;
        }
        .hero-heading em {
          font-style: normal;
          background: linear-gradient(135deg, #C8C8C8, #F5F5F5 40%, #A8A8A8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtext {
          font-family: 'Inter', sans-serif;
          font-size: clamp(15px, 1.8vw, 19px);
          color: #808080;
          font-weight: 400;
          max-width: 560px;
          line-height: 1.6;
          margin: 0 0 48px 0;
          letter-spacing: -0.01em;
          opacity: 0;
          animation: fadeInUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards;
        }
        .hero-buttons {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          opacity: 0;
          animation: fadeInUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.65s forwards;
        }
        .btn-primary {
          background: #F5F5F5;
          color: #0A0A0A;
          border: none;
          padding: 14px 28px;
          border-radius: 14px;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          letter-spacing: -0.01em;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary:hover {
          background: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(255,255,255,0.18);
        }
        .btn-primary:focus-visible {
          outline: 2px solid #F5F5F5;
          outline-offset: 3px;
        }
        .btn-secondary {
          background: rgba(255,255,255,0.04);
          color: #A0A0A0;
          border: 1px solid rgba(255,255,255,0.10);
          padding: 14px 28px;
          border-radius: 14px;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          letter-spacing: -0.01em;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.20);
          color: #E8E8E8;
          transform: translateY(-1px);
        }
        .btn-secondary:focus-visible {
          outline: 2px solid rgba(255,255,255,0.4);
          outline-offset: 3px;
        }
        .hero-scroll-hint {
          position: absolute;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: fadeInUp 1s cubic-bezier(0.22, 1, 0.36, 1) 1.2s forwards;
        }
        .scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        .scroll-text {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          font-weight: 500;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.1); }
        }

        @media (max-width: 640px) {
          .hero-buttons { flex-direction: column; width: 100%; max-width: 280px; }
          .btn-primary, .btn-secondary { justify-content: center; }
          .hero-heading { font-size: clamp(2.2rem, 10vw, 3.5rem); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-badge, .hero-heading, .hero-subtext, .hero-buttons, .hero-scroll-hint {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .scroll-line { animation: none; }
          .btn-primary:hover, .btn-secondary:hover { transform: none; }
        }
      `}</style>

      <section id="hero" className="hero">
        <div className="hero-bg">
          {!reducedMotion && (
            <FaultyTerminal
              scale={1.9}
              gridMul={[2, 1]}
              digitSize={0.8}
              timeScale={0.8}
              pause={false}
              scanlineIntensity={0}
              glitchAmount={1}
              flickerAmount={1}
              noiseAmp={0.5}
              chromaticAberration={0}
              dither={0}
              curvature={0}
              tint="#9889a5"
              mouseReact={false}
              mouseStrength={0.1}
              pageLoadAnimation={true}
              brightness={1}
            />
          )}
        </div>
        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-content">

          <h1 className="hero-heading">
            Know your content's future.<br />
            <em>Before you publish.</em>
          </h1>

          <p className="hero-subtext">
            Tribe-simulated. Retrieval-grounded. PreCortex predicts how real audiences
            will respond to your content — before it ever goes live.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => window.location.href = 'http://172.16.59.127:5173/'}
            >
              Explore
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="btn-secondary"
              onClick={() => scrollToSection('about')}
            >
              Learn How It Works
            </button>
          </div>
        </div>

        <div className="hero-scroll-hint" aria-hidden="true">
          <span className="scroll-text">Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>
    </>
  );
}
