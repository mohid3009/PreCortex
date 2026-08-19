import SectionReveal from '../components/SectionReveal';

const SDG_ITEMS = [
  {
    id: '4',
    code: 'SDG 4 · PRIMARY',
    title: 'Quality Education',
    targets: 'Targets 4.1 & 4.c',
    color: '#C5192D', // Official UN SDG 4 Red
    accentBg: 'rgba(197, 25, 45, 0.08)',
    borderColor: 'rgba(197, 25, 45, 0.3)',
    glowColor: 'rgba(197, 25, 45, 0.12)',
    description: 'Directly serves target 4.1 (effective learning outcomes) and 4.c (supporting teachers): every educator gets a neuroscience-informed content reviewer that today only exists in research labs.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="currentColor"/>
        <path d="M3.82 12.5v5.82C3.82 19.8 7.48 21 12 21s8.18-1.2 8.18-2.68v-5.82L12 17.5l-8.18-5z" fill="currentColor" opacity="0.7"/>
      </svg>
    )
  },
  {
    id: '10',
    code: 'SDG 10',
    title: 'Reduced Inequalities',
    targets: 'Target 10.2',
    color: '#DD1367', // Official UN SDG 10 Pink/Magenta
    accentBg: 'rgba(221, 19, 103, 0.08)',
    borderColor: 'rgba(221, 19, 103, 0.3)',
    glowColor: 'rgba(221, 19, 103, 0.12)',
    description: 'Weak moments are fixed in the content itself, so the improvement reaches every learner equally, including those in low-resource settings who depend on recorded lectures with no live teacher to ask.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 19h16v-2H4v2zm0-4h16v-2H4v2zm0-4h16V9H4v2zm0-6v2h16V5H4z" fill="currentColor"/>
      </svg>
    )
  },
  {
    id: '9',
    code: 'SDG 9',
    title: 'Industry & Innovation',
    targets: 'Target 9.5',
    color: '#D9480F', // Official UN SDG 9 Orange (Darker shade for crisp light contrast)
    accentBg: 'rgba(217, 72, 15, 0.08)',
    borderColor: 'rgba(217, 72, 15, 0.3)',
    glowColor: 'rgba(217, 72, 15, 0.12)',
    description: 'Repurposes frontier brain-encoding research (fMRI prediction models) into affordable applied infrastructure: a consumer GPU plus open models, not a million-dollar scanner.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.93V19h-2v-2.07A7.002 7.002 0 015.07 13H3v-2h2.07A7.002 7.002 0 0111 5.07V3h2v2.07A7.002 7.002 0 0118.93 11H21v2h-2.07A7.002 7.002 0 0113 16.93zM12 8a4 4 0 100 8 4 4 0 000-8z" fill="currentColor"/>
      </svg>
    )
  }
];

export default function Sdg() {
  return (
    <>
      <style>{`
        .sdg-section {
          background: #F7F7F7;
          padding: 160px 0;
          border-top: 1px solid rgba(0,0,0,0.06);
          position: relative;
          overflow: hidden;
        }
        .sdg-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 80px;
        }
        .sdg-eyebrow {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
        }
        .sdg-num {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          background: linear-gradient(135deg, #666, #0A0A0A, #444);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sdg-divider {
          width: 50px;
          height: 1px;
          background: rgba(0,0,0,0.18);
        }
        .sdg-tag-label {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #555555;
        }
        .sdg-header {
          margin-bottom: 56px;
        }
        .sdg-heading {
          font-family: 'Inter', sans-serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 700;
          letter-spacing: -0.035em;
          color: #0D0D0D;
          margin: 0 0 20px 0;
          line-height: 1.08;
        }
        .sdg-sub {
          font-family: 'Inter', sans-serif;
          font-size: 15.5px;
          color: #333333;
          line-height: 1.65;
          letter-spacing: -0.01em;
          max-width: 680px;
          margin: 0;
        }
        .sdg-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .sdg-card {
          background: #FFFFFF;
          border: 1px solid rgba(0,0,0,0.10);
          border-radius: 20px;
          padding: 36px 30px;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sdg-card:hover {
          transform: translateY(-4px);
          border-color: var(--card-border-color);
          box-shadow: 0 12px 40px var(--card-glow-color);
          background: #FAFAFA;
        }
        .sdg-badge-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .sdg-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .sdg-target-tag {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #555555;
          letter-spacing: 0.02em;
        }
        .sdg-card-title {
          font-family: 'Inter', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #0D0D0D;
          letter-spacing: -0.02em;
          margin: 0 0 14px 0;
          line-height: 1.25;
        }
        .sdg-card-desc {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #333333;
          line-height: 1.65;
          letter-spacing: -0.005em;
          margin: 0;
          flex: 1;
        }
        .sdg-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        @media (max-width: 960px) {
          .sdg-inner { padding: 0 40px; }
          .sdg-grid { grid-template-columns: 1fr; gap: 20px; }
        }
        @media (max-width: 640px) {
          .sdg-inner { padding: 0 24px; }
          .sdg-section { padding: 100px 0; }
          .sdg-card { padding: 28px 22px; }
        }
      `}</style>

      <section id="sdg" className="sdg-section">
        <div className="sdg-inner">
          <SectionReveal>
            <div className="sdg-eyebrow">
              <span className="sdg-num">CRITERION 04</span>
              <div className="sdg-divider" />
              <span className="sdg-tag-label">SDG Compliance</span>
            </div>
          </SectionReveal>

          <div className="sdg-header">
            <SectionReveal style={{ transitionDelay: '60ms' }}>
              <h2 className="sdg-heading">Built squarely on the education goal.</h2>
            </SectionReveal>
            <SectionReveal style={{ transitionDelay: '120ms' }}>
              <p className="sdg-sub">
                PreCortex advances United Nations Sustainable Development Goals by democratizing neuroscience-backed lecture reviewing for teachers worldwide.
              </p>
            </SectionReveal>
          </div>

          <SectionReveal style={{ transitionDelay: '180ms' }}>
            <div className="sdg-grid">
              {SDG_ITEMS.map((sdg) => (
                <div
                  key={sdg.id}
                  className="sdg-card"
                  style={{
                    '--card-border-color': sdg.borderColor,
                    '--card-glow-color': sdg.glowColor
                  }}
                >
                  <div className="sdg-badge-wrap">
                    <div
                      className="sdg-badge"
                      style={{
                        background: sdg.accentBg,
                        border: `1px solid ${sdg.borderColor}`,
                        color: sdg.color
                      }}
                    >
                      {sdg.code}
                    </div>
                    <span className="sdg-target-tag">{sdg.targets}</span>
                  </div>

                  <div
                    className="sdg-icon-box"
                    style={{
                      background: sdg.accentBg,
                      color: sdg.color,
                      border: `1px solid ${sdg.borderColor}`
                    }}
                  >
                    {sdg.icon}
                  </div>

                  <h3 className="sdg-card-title">{sdg.title}</h3>
                  <p className="sdg-card-desc">{sdg.description}</p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
