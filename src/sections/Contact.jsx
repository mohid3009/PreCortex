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
          max-width: 600px;
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
          font-size: clamp(2.2rem, 4.5vw, 4rem);
          font-weight: 650;
          letter-spacing: -0.04em;
          color: #F5F5F5;
          margin: 0 0 24px 0;
          line-height: 1.03;
        }
        .contact-sub {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          color: #666;
          line-height: 1.65;
          letter-spacing: -0.01em;
          margin: 0 0 44px 0;
        }
        .contact-buttons {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .contact-team {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 60px 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .team-heading {
          font-family: 'Inter', sans-serif;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -0.025em;
          color: #E8E8E8;
          margin: 0 0 12px 0;
        }
        .team-body {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #555;
          line-height: 1.7;
          letter-spacing: -0.005em;
          max-width: 400px;
        }
        .team-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .team-badge {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          color: #555;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 8px;
          letter-spacing: -0.005em;
        }
        .footer {
          border-top: 1px solid rgba(255,255,255,0.05);
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
          font-weight: 600;
          color: #333;
          letter-spacing: -0.01em;
        }
        .footer-copy {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: #333;
          letter-spacing: -0.005em;
        }
        .footer-tagline {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: #2A2A2A;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 500;
        }

        @media (max-width: 900px) {
          .contact-inner { padding: 0 40px; }
          .footer-inner { padding: 0 40px; }
          .contact-team { grid-template-columns: 1fr; }
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
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', background: 'linear-gradient(135deg, #555, #E5E5E5, #777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>05</span>
                <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#444' }}>Contact</span>
              </div>

              <h2 className="contact-heading">
                Stop publishing blind.
              </h2>
              <p className="contact-sub">
                Join the researchers, educators, and content creators already using
                 PreCortex to publish with precision.
              </p>
              <div className="contact-buttons">
                <button
                  className="btn-primary"
                  style={{ background: '#F5F5F5', color: '#0A0A0A', border: 'none', padding: '14px 28px', borderRadius: '14px', fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.01em', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,255,255,0.18)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F5F5F5'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  Our Product
                </button>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: 'rgba(255,255,255,0.04)', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.10)', padding: '14px 28px', borderRadius: '14px', fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 500, cursor: 'pointer', letterSpacing: '-0.01em', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; e.currentTarget.style.color = '#E8E8E8'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = '#A0A0A0'; }}
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </SectionReveal>
        </div>

        <footer className="footer" role="contentinfo">
          <div className="footer-inner">
            <span className="footer-brand">PreCortex</span>
            <span className="footer-copy">© 2026 PreCortex Labs</span>
            <span className="footer-tagline">All prediction systems deployed</span>
          </div>
        </footer>
      </section>
    </>
  );
}
