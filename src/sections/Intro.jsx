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
          background: linear-gradient(135deg, #777, #FFFFFF, #AAA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .intro-divider-line {
          width: 40px;
          height: 1px;
          background: rgba(255,255,255,0.20);
        }
        .intro-tag {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #A3A3A3;
        }
        .intro-heading {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.9rem, 3vw, 2.8rem);
          font-weight: 700;
          line-height: 1.06;
          letter-spacing: -0.036em;
          color: #FFFFFF;
          margin: 0 0 26px 0;
        }
        .intro-body {
          font-family: 'Inter', sans-serif;
          font-size: 15.5px;
          color: #B0B0B0;
          line-height: 1.75;
          letter-spacing: -0.008em;
          font-weight: 400;
          max-width: 480px;
          margin: 0 0 44px 0;
        }

        /* ── Right: brain panel ──────────────────────────── */
        .intro-brain-panel {
          background: #060606;
          border-radius: 24px;
          height: 540px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.05),
            0 30px 80px rgba(0,0,0,0.4),
            0 4px 16px rgba(0,0,0,0.2);
        }
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
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.60);
          font-weight: 600;
          z-index: 2;
          pointer-events: none;
        }
        .brain-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          padding: 6px 12px;
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          z-index: 2;
          pointer-events: none;
        }

        /* ── Stats grid ──────────────────────────────────── */
        .intro-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin: 20px 0 24px;
        }
        .intro-stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          padding: 16px 14px;
        }

        /* ── Responsive ──────────────────────────────────── */
        @media (max-width: 640px) {
          .intro-stats { grid-template-columns: 1fr; }
        }
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
      `}</style>

      <section id="intro" className="intro-section">
        <div className="intro-inner">

          {/* ── Left column: text ── */}
          <SectionReveal>
            <div>
              <div className="intro-eyebrow">
                <span className="intro-num">CRITERION 01</span>
                <div className="intro-divider-line" />
                <span className="intro-tag">Problem understanding</span>
              </div>

              <h2 className="intro-heading">
                Educators get feedback only after the damage is done.
              </h2>

              <p className="intro-body">
                Today, a teacher discovers a confusing explanation the same way everyone else does: too late. Drop-off analytics arrive after thousands of learners have already left. Quiz failures arrive after the exam. And none of those signals say which sentence lost the room, or why. The feedback loop in education is measured in semesters. The attention loss it fails to catch is measured in seconds.
              </p>

              {/* Stats Grid */}
              <div className="intro-stats">
                <div className="intro-stat-card">
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.03em' }}>~90%</div>
                  <div style={{ fontSize: '11.5px', color: '#D4D4D4', lineHeight: 1.4, marginTop: '4px' }}>of MOOC learners never finish the course they start</div>
                  <div style={{ fontSize: '9.5px', color: '#999999', marginTop: '6px', fontStyle: 'italic' }}>MIT / Reich & Ruipérez-Valiente, Science 2019</div>
                </div>

                <div className="intro-stat-card">
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.03em' }}>6 min</div>
                  <div style={{ fontSize: '11.5px', color: '#D4D4D4', lineHeight: 1.4, marginTop: '4px' }}>median engagement span for lecture videos before disengaging</div>
                  <div style={{ fontSize: '9.5px', color: '#999999', marginTop: '6px', fontStyle: 'italic' }}>Guo et al., Learning@Scale 2014</div>
                </div>

                <div className="intro-stat-card">
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.03em' }}>~30%</div>
                  <div style={{ fontSize: '11.5px', color: '#D4D4D4', lineHeight: 1.4, marginTop: '4px' }}>of lecture time lost to un-noticed mind-wandering</div>
                  <div style={{ fontSize: '9.5px', color: '#999999', marginTop: '6px', fontStyle: 'italic' }}>Smallwood & Schooler, attention research</div>
                </div>
              </div>

              {/* Summary Gap Callout */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                borderLeft: '3px solid #F5F5F5',
                padding: '14px 18px',
                borderRadius: '0 10px 10px 0',
                fontSize: '13.5px',
                color: '#E5E5E5',
                lineHeight: 1.6,
                fontFamily: 'Inter, sans-serif'
              }}>
                The problem is not a lack of content. It is that no tool tells a creator where attention breaks before the content ships. <strong style={{ color: '#FFFFFF' }}>That is the exact gap PreCortex closes.</strong>
              </div>
            </div>
          </SectionReveal>

          {/* ── Right column: brain ── */}
          <div
            className="intro-brain-panel"
            aria-label="TRIBE v2 cortical simulation visualizer"
          >
            <div className="brain-badge">fsaverage5 · 20,484 Vertices</div>
            <BrainViz />
            <div className="brain-vignette" aria-hidden="true" />
            <div className="brain-label">TRIBE v2 Neural Cortex Simulation</div>
          </div>

        </div>
      </section>
    </>
  );
}
