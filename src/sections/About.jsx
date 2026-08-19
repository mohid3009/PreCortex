import SectionReveal from '../components/SectionReveal';

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
          margin-bottom: 48px;
        }
        .about-heading {
          font-family: 'Inter', sans-serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 700;
          letter-spacing: -0.035em;
          color: #0D0D0D;
          margin: 0 0 20px 0;
          line-height: 1.08;
        }
        .about-sub {
          font-family: 'Inter', sans-serif;
          font-size: 15.5px;
          color: #333333;
          line-height: 1.7;
          letter-spacing: -0.01em;
        }
        @media (max-width: 900px) {
          .about-inner { padding: 0 40px; }
        }
        @media (max-width: 640px) {
          .about-inner { padding: 0 24px; }
          .about-section { padding: 100px 0; }
        }
      `}</style>

      <section id="about" className="about-section">
        <div className="about-inner">
          <SectionReveal>
            <div className="section-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
              <span className="section-num" style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', background: 'linear-gradient(135deg, #666, #0A0A0A, #444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CRITERION 02</span>
              <div style={{ width: '50px', height: '1px', background: 'rgba(0,0,0,0.18)' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555555' }}>Uniqueness & innovation</span>
            </div>
          </SectionReveal>

          <div className="about-header">
            <SectionReveal style={{ transitionDelay: '60ms' }}>
              <h2 className="about-heading" style={{ maxWidth: '640px' }}>
                We don't survey learners. We simulate their cortex.
              </h2>
            </SectionReveal>
            <SectionReveal style={{ transitionDelay: '120ms' }}>
              <p className="about-sub" style={{ maxWidth: '740px' }}>
                Every existing tool measures engagement after the fact: watch time, clicks, camera-based emotion guesses. PreCortex is built on <strong style={{ color: '#000000' }}>TRIBE v2</strong>, a neural network trained to predict group-average fMRI brain activity directly from stimulus content. We run the lecture through a simulated cortex, project the predicted activity onto <strong style={{ color: '#000000' }}>150 anatomical brain regions (Destrieux atlas)</strong>, regroup them into five literature-grounded attention and comprehension networks, and statistically flag sustained deviations.
              </p>
            </SectionReveal>
          </div>

          {/* Comparison Matrix Table */}
          <SectionReveal style={{ transitionDelay: '160ms' }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.12)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
              overflow: 'hidden',
              marginBottom: '56px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1.2fr',
                background: '#EAEAEA',
                borderBottom: '1px solid rgba(0,0,0,0.12)',
                padding: '16px 24px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#111111'
              }}>
                <div>Dimension</div>
                <div style={{ color: '#666666' }}>The usual approach</div>
                <div style={{ color: '#000000' }}>PreCortex</div>
              </div>

              {[
                {
                  label: 'Diagnostic Signal',
                  usual: '"Viewers dropped off around minute 6."',
                  precortex: '"At 6:22, DorsalAttention decayed while DefaultMode rose: a mind-wandering signature."'
                },
                {
                  label: 'Viewer Requirement',
                  usual: 'Needs thousands of real viewers first',
                  precortex: 'Needs zero viewers. Runs pre-publication.'
                },
                {
                  label: 'Actionable Fix',
                  usual: '"Add a quiz here?"',
                  precortex: 'A falsifiable hypothesis + a rewrite, an analogy, and a quiz tied to the diagnosed cause'
                }
              ].map((row, idx) => (
                <div key={row.label} style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1.2fr',
                  padding: '20px 24px',
                  borderBottom: idx === 2 ? 'none' : '1px solid rgba(0,0,0,0.08)',
                  background: idx % 2 === 1 ? '#FAFAFA' : '#FFFFFF',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  lineHeight: 1.55
                }}>
                  <div style={{ fontWeight: 700, color: '#0D0D0D' }}>{row.label}</div>
                  <div style={{ color: '#555555' }}>{row.usual}</div>
                  <div style={{ color: '#000000', fontWeight: 650 }}>{row.precortex}</div>
                </div>
              ))}
            </div>
          </SectionReveal>

          {/* 3 Core Technical Principles */}
          <SectionReveal style={{ transitionDelay: '200ms' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px'
            }}>
              <div style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.10)',
                borderRadius: '16px',
                padding: '28px 24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.10em', color: '#555555', textTransform: 'uppercase', marginBottom: '10px' }}>01 · Architecture</div>
                <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#0D0D0D', marginBottom: '10px' }}>Deterministic before generative</h3>
                <p style={{ fontSize: '13.5px', color: '#333333', lineHeight: 1.65, margin: 0 }}>
                  Statistics decide that a weak moment exists and describe its shape (cliff drop, gradual decay, oscillation). The LLM only reasons about why. It never sees raw data it could hallucinate trends from.
                </p>
              </div>

              <div style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.10)',
                borderRadius: '16px',
                padding: '28px 24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.10em', color: '#555555', textTransform: 'uppercase', marginBottom: '10px' }}>02 · Verification</div>
                <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#0D0D0D', marginBottom: '10px' }}>Explainable end to end</h3>
                <p style={{ fontSize: '13.5px', color: '#333333', lineHeight: 1.65, margin: 0 }}>
                  Every diagnosis carries its evidence: affected network, depth z-score, shape, duration, co-occurring networks, and an explicit confidence level. Judges can audit any single claim.
                </p>
              </div>

              <div style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.10)',
                borderRadius: '16px',
                padding: '28px 24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.10em', color: '#555555', textTransform: 'uppercase', marginBottom: '10px' }}>03 · Ethics</div>
                <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: '#0D0D0D', marginBottom: '10px' }}>Honest by design</h3>
                <p style={{ fontSize: '13.5px', color: '#333333', lineHeight: 1.65, margin: 0 }}>
                  We claim "activity patterns consistent with known attention correlates", not mind reading. Our spec documents every limitation, which is exactly what makes the signal defensible.
                </p>
              </div>
            </div>
          </SectionReveal>

        </div>
      </section>
    </>
  );
}
