import SectionReveal from '../components/SectionReveal';

const FEATURES = [
  {
    title: 'Paragraph-level heat maps',
    body: 'Pinpoint exactly which sentences cause confusion, disengagement, or drop-off in your specific audience segment.',
    tag: 'Precision',
  },
  {
    title: 'Cognitive load scoring',
    body: 'Each section receives a readability and cognitive effort score calibrated to your target readers\' expertise level.',
    tag: 'Analysis',
  },
  {
    title: 'Retention prediction',
    body: 'Predict where readers will stop and why — before the content ever reaches them.',
    tag: 'Prediction',
  },
  {
    title: 'Multi-segment simulation',
    body: 'Run the same draft against beginner, intermediate, and expert personas simultaneously to find universal clarity.',
    tag: 'Simulation',
  },
  {
    title: 'Rewrite suggestions',
    body: 'Receive targeted micro-edits — not just flags — grounded in the simulated audience\'s specific pain points.',
    tag: 'Actionable',
  },
  {
    title: 'Historical benchmarking',
    body: 'Compare predicted scores against your past published content to track improvement over time.',
    tag: 'Benchmark',
  },
];

export default function Features() {
  return (
    <>
      <style>{`
        .features-section {
          background: #080808;
          padding: 160px 0;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .features-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 80px;
        }
        .features-eyebrow {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 48px;
        }
        .features-num {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          background: linear-gradient(135deg, #555, #E5E5E5, #777);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .features-divider {
          width: 60px;
          height: 1px;
          background: rgba(255,255,255,0.12);
        }
        .features-tag-label {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #555;
        }
        .features-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin-bottom: 80px;
          align-items: end;
        }
        .features-heading {
          font-family: 'Inter', sans-serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 700;
          letter-spacing: -0.035em;
          color: #F5F5F5;
          margin: 0;
          line-height: 1.08;
        }
        .features-sub {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          color: #888;
          line-height: 1.65;
          letter-spacing: -0.01em;
          margin: 0;
          padding-bottom: 4px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .feature-card {
          background: #0B0B0B;
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: background 0.3s ease;
          cursor: default;
        }
        .feature-card:hover { background: #101010; }
        .feature-tag {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: #555;
          display: inline-block;
        }
        .feature-title {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 650;
          color: #E8E8E8;
          letter-spacing: -0.02em;
          line-height: 1.3;
          margin: 0;
        }
        .feature-body {
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          color: #888;
          line-height: 1.7;
          letter-spacing: -0.005em;
          margin: 0;
          flex: 1;
        }
        .feature-line {
          width: 24px;
          height: 1px;
          background: linear-gradient(to right, rgba(255,255,255,0.15), transparent);
          margin-top: auto;
          padding-top: 8px;
        }

        @media (max-width: 1024px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .features-header { grid-template-columns: 1fr; gap: 24px; }
        }
        @media (max-width: 900px) {
          .features-inner { padding: 0 40px; }
        }
        @media (max-width: 640px) {
          .features-inner { padding: 0 24px; }
          .features-section { padding: 100px 0; }
          .features-grid { grid-template-columns: 1fr; }
          .feature-card { padding: 28px 24px; }
        }
      `}</style>

      <section id="features" className="features-section">
        <div className="features-inner">
          <SectionReveal>
            <div className="features-eyebrow">
              <span className="features-num">03</span>
              <div className="features-divider" />
              <span className="features-tag-label">Features</span>
            </div>
          </SectionReveal>

          <div className="features-header">
            <SectionReveal style={{ transitionDelay: '60ms' }}>
              <h2 className="features-heading">Everything you need to publish with confidence</h2>
            </SectionReveal>
            <SectionReveal style={{ transitionDelay: '120ms' }}>
              <p className="features-sub">
                PreCortex's intelligence layer surfaces what human editors and focus
                groups can't — systematic, simulated pre-publication analysis at scale.
              </p>
            </SectionReveal>
          </div>

          <SectionReveal style={{ transitionDelay: '180ms' }}>
            <div className="features-grid" role="list">
              {FEATURES.map((f) => (
                <article key={f.title} className="feature-card" role="listitem">
                  <span className="feature-tag">{f.tag}</span>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-body">{f.body}</p>
                  <div className="feature-line" aria-hidden="true" />
                </article>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
