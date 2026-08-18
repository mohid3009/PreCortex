import SectionReveal from '../components/SectionReveal';
import BrainViz from '../components/BrainViz';

export default function Intro() {
  return (
    <>
      <style>{`
        .intro-section {
          background: #080808;
          padding: 140px 0;
          border-top: 1px solid rgba(255,255,255,0.05);
          overflow: hidden;
        }
        .intro-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 80px;
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          gap: 72px;
          align-items: center;
        }

        /* ── Left: text ──────────────────────────────────── */
        .intro-eyebrow {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 36px;
        }
        .intro-num {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          background: linear-gradient(135deg, #555, #E5E5E5, #777);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .intro-divider-line {
          width: 40px;
          height: 1px;
          background: rgba(255,255,255,0.15);
        }
        .intro-tag {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #555;
        }
        .intro-heading {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.9rem, 3vw, 2.8rem);
          font-weight: 700;
          line-height: 1.06;
          letter-spacing: -0.036em;
          color: #F5F5F5;
          margin: 0 0 26px 0;
        }
        .intro-body {
          font-family: 'Inter', sans-serif;
          font-size: 15.5px;
          color: #888;
          line-height: 1.75;
          letter-spacing: -0.008em;
          font-weight: 400;
          max-width: 400px;
          margin: 0 0 44px 0;
        }
        .intro-callouts {
          display: flex;
          flex-direction: column;
          gap: 13px;
          border-left: 1px solid rgba(255,255,255,0.08);
          padding-left: 20px;
        }
        .intro-callout {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .callout-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #555;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .callout-text {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: #888;
          letter-spacing: -0.008em;
          font-weight: 440;
          line-height: 1.5;
        }

        /* ── Right: brain panel ──────────────────────────── */
        .intro-brain-panel {
          background: #060606;
          border-radius: 24px;
          height: 540px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03),
            0 30px 80px rgba(0,0,0,0.22),
            0 4px 16px rgba(0,0,0,0.12);
        }
        /* Vignette — frames the brain naturally */
        .brain-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 70% 70% at 50% 50%,
            transparent 35%,
            rgba(6,6,6,0.72) 100%
          );
          pointer-events: none;
          z-index: 1;
        }
        .brain-label {
          position: absolute;
          bottom: 22px;
          left: 26px;
          font-family: 'Inter', sans-serif;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.20);
          font-weight: 500;
          z-index: 2;
          pointer-events: none;
        }
        .brain-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 6px 12px;
          font-family: 'Inter', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.30);
          z-index: 2;
          pointer-events: none;
        }

        /* ── Responsive ──────────────────────────────────── */
        @media (max-width: 960px) {
          .intro-inner {
            grid-template-columns: 1fr;
            gap: 48px;
            padding: 0 40px;
          }
          .intro-brain-panel { height: 380px; }
          .intro-body { max-width: none; }
        }
        @media (max-width: 640px) {
          .intro-inner { padding: 0 24px; }
          .intro-section { padding: 100px 0; }
          .intro-brain-panel { height: 300px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .intro-brain-panel canvas { animation: none !important; }
        }
      `}</style>

      <section id="intro" className="intro-section">
        <div className="intro-inner">

          {/* ── Left column: text ── */}
          <SectionReveal>
            <div>
              <div className="intro-eyebrow">
                <span className="intro-num">01</span>
                <div className="intro-divider-line" />
                <span className="intro-tag">Intro</span>
              </div>

              <h2 className="intro-heading">
                An artificial audience.<br />Before you publish.
              </h2>

              <p className="intro-body">
                Tribe v2 deploys hundreds of cognitive agent personas — each
                seeded with real behavioral data — to read your content before
                it reaches anyone. They surface confusion, predict drop-off, and
                expose gaps your editors can't see.
              </p>

              <div className="intro-callouts" role="list">
                {[
                  '260+ independent cognitive agents per simulation',
                  'Grounded in real audience behavioral history',
                  'Paragraph-level engagement and confusion scoring',
                ].map(text => (
                  <div className="intro-callout" key={text} role="listitem">
                    <div className="callout-dot" aria-hidden="true" />
                    <span className="callout-text">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>

          {/* ── Right column: brain ── */}
          <div
            className="intro-brain-panel"
            aria-label="Tribe v2 neural simulation visualisation"
          >
            <BrainViz />
            <div className="brain-vignette" aria-hidden="true" />
          </div>

        </div>
      </section>
    </>
  );
}
