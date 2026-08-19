import SectionReveal from '../components/SectionReveal';

export default function Contact() {
  return (
    <>
      <style>{`
        .contact-section {
          background: #080808;
          padding: 160px 0 0;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .contact-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 80px;
        }
        .contact-cta-block {
          text-align: center;
          max-width: 780px;
          margin: 0 auto;
          padding-bottom: 120px;
        }
        .contact-eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 40px;
        }
        .contact-heading {
          font-family: 'Inter', sans-serif;
          font-size: clamp(2.2rem, 4.5vw, 3.8rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          color: #FFFFFF;
          margin: 0 0 24px 0;
          line-height: 1.05;
        }
        .contact-sub {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          color: #B0B0B0;
          line-height: 1.65;
          letter-spacing: -0.01em;
          margin: 0 0 44px 0;
          max-width: 580px;
          margin-left: auto;
          margin-right: auto;
        }
        .contact-buttons {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 28px 0;
        }
        .footer-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-brand {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }
        .footer-copy {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: #888888;
          letter-spacing: -0.005em;
        }
        .footer-tagline {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          color: #888888;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .contact-inner { padding: 0 40px; }
          .footer-inner { padding: 0 40px; }
        }
        @media (max-width: 640px) {
          .contact-inner { padding: 0 24px; }
          .footer-inner { padding: 0 24px; flex-direction: column; gap: 12px; text-align: center; }
          .contact-section { padding-top: 100px; }
          .contact-cta-block { padding-bottom: 80px; }
          .contact-buttons { flex-direction: column; max-width: 280px; margin: 0 auto; }
        }
      `}</style>

      <section id="contact" className="contact-section">
        <div className="contact-inner">
          <SectionReveal>
            <div className="contact-cta-block">
              <div className="contact-eyebrow">
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', backgroundImage: 'linear-gradient(135deg, #777, #FFFFFF, #AAA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>PITCH</span>
                <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.18)' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A3A3A3' }}>Closing Pitch</span>
              </div>

              <h2 className="contact-heading">
                Every other tool tells you where learners left.<br />
                <em style={{ fontStyle: 'normal', color: '#6EE7B7' }}>PreCortex tells you where they will leave, while there is still time to fix it.</em>
              </h2>
              <p className="contact-sub">
                Join the educators, researchers, and creators using PreCortex's multi-agent neural cortex simulation to eliminate attention drop-off before publishing.
              </p>
              <div className="contact-buttons">
                <button
                  className="btn-primary"
                  style={{ background: '#F5F5F5', color: '#0A0A0A', border: 'none', padding: '14px 28px', borderRadius: '14px', fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.01em', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Run Neural Simulation
                </button>
                <button
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#D4D4D4', border: '1px solid rgba(255,255,255,0.14)', padding: '14px 28px', borderRadius: '14px', fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, cursor: 'pointer', letterSpacing: '-0.01em', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Review Judging Specs
                </button>
              </div>
            </div>
          </SectionReveal>
        </div>

        <footer className="footer" role="contentinfo">
          <div className="footer-inner">
            <span className="footer-brand">PreCortex</span>
            <span className="footer-copy">© 2026 PreCortex Labs · TRIBE v2 Neural Cortex Engine</span>
            <span className="footer-tagline">fsaverage5 · 20,484 Cortical Vertices</span>
          </div>
        </footer>
      </section>
    </>
  );
}
