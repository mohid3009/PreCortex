import SectionReveal from '../components/SectionReveal';

const HOW_ITEMS = [
  {
    step: '01',
    title: 'RAG-Grounded Context',
    body: 'PreCortex retrieves existing audience metrics, prior course feedback, and community sentiment datasets to build a precise local knowledge profile for your content.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="#777" strokeWidth="1.2"/>
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="#777" strokeWidth="1.2"/>
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="#777" strokeWidth="1.2"/>
        <path d="M14.5 11v6M11.5 14h6" stroke="#A8A8A8" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Tribe v2 Simulation',
    body: 'We run your drafts through multi-agent student personas designed to mimic real cognitive load, attention span, and frustration points across diverse audience segments.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="3" stroke="#777" strokeWidth="1.2"/>
        <circle cx="13" cy="7" r="3" stroke="#777" strokeWidth="1.2"/>
        <path d="M2 17c0-2.76 2.24-5 5-5h6c2.76 0 5 2.24 5 5" stroke="#A8A8A8" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Pre-cognition Reporting',
    body: 'Receive feedback down to specific paragraphs, with visual heat maps showing where reader retention drops — before you ever hit publish.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 14l4-4 3 3 4-5 3 3" stroke="#A8A8A8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="2" y="2" width="16" height="16" rx="2" stroke="#777" strokeWidth="1.2"/>
      </svg>
    ),
  },
];

export default function About() {
  return (
    <>
      <style>{`
        .about-section {
          background: #F7F7F7;
          padding: 160px 0;
          border-top: 1px solid rgba(0,0,0,0.06);
        }
        .about-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 80px;
        }
        .about-header {
          margin-bottom: 80px;
        }
        .about-heading {
          font-family: 'Inter', sans-serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 700;
          letter-spacing: -0.035em;
          color: #0D0D0D;
          margin: 0 0 20px 0;
          line-height: 1.08;
          max-width: 520px;
        }
        .about-sub {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          color: #666;
          max-width: 480px;
          line-height: 1.65;
          letter-spacing: -0.01em;
        }
        .about-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(0,0,0,0.06);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.07);
        }
        .step-card {
          background: #FFFFFF;
          padding: 44px 36px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
          transition: background 0.3s ease;
          cursor: default;
        }
        .step-card:hover { background: #FAFAFA; }
        .step-card::before {
          content: attr(data-step);
          position: absolute;
          top: 36px;
          right: 36px;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          background: linear-gradient(135deg, #888, #1A1A1A, #555);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .step-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 10px;
        }
        .step-title {
          font-family: 'Inter', sans-serif;
          font-size: 17px;
          font-weight: 650;
          color: #0D0D0D;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 0;
        }
        .step-body {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #666;
          line-height: 1.7;
          letter-spacing: -0.005em;
          margin: 0;
        }

        @media (max-width: 900px) {
          .about-inner { padding: 0 40px; }
          .about-steps { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .about-inner { padding: 0 24px; }
          .about-section { padding: 100px 0; }
          .step-card { padding: 32px 24px; }
        }
      `}</style>

      <section id="about" className="about-section">
        <div className="about-inner">
          <SectionReveal>
            <div className="section-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
              <span className="section-num" style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', background: 'linear-gradient(135deg, #888, #1A1A1A, #555)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>02</span>
              <div style={{ width: '60px', height: '1px', background: 'rgba(0,0,0,0.12)' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999' }}>About</span>
            </div>
          </SectionReveal>

          <div className="about-header">
            <SectionReveal style={{ transitionDelay: '60ms' }}>
              <h2 className="about-heading">Three-phase intelligence engine</h2>
            </SectionReveal>
            <SectionReveal style={{ transitionDelay: '120ms' }}>
              <p className="about-sub">
                From retrieval to simulation to reporting — a closed-loop system
                that closes the publish gap entirely.
              </p>
            </SectionReveal>
          </div>

          <SectionReveal style={{ transitionDelay: '180ms' }}>
            <div className="about-steps" role="list">
              {HOW_ITEMS.map((item) => (
                <div key={item.step} className="step-card" data-step={item.step} role="listitem">
                  <div className="step-icon">{item.icon}</div>
                  <h3 className="step-title">{item.title}</h3>
                  <p className="step-body">{item.body}</p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
