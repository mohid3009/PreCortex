import SectionReveal from '../components/SectionReveal';

export default function Technology() {
  return (
    <>
      <style>{`
        .tech-section {
          background: #F7F7F7;
          padding: 160px 0;
          border-top: 1px solid rgba(0,0,0,0.06);
        }
        .tech-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 80px;
        }
        .tech-layout {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 72px;
          align-items: center;
          margin-top: 80px;
        }
        .tech-heading {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 700;
          letter-spacing: -0.035em;
          color: #0D0D0D;
          margin: 0 0 24px 0;
          line-height: 1.1;
        }
        .tech-body {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          color: #666;
          line-height: 1.7;
          letter-spacing: -0.01em;
          margin-bottom: 24px;
        }
        .tech-body strong {
          color: #1A1A1A;
          font-weight: 600;
        }
        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 32px;
        }
        .tech-tag {
          background: rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.07);
          color: #777;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 550;
          letter-spacing: 0.02em;
          padding: 6px 12px;
          border-radius: 8px;
          text-transform: uppercase;
        }
        .tech-diagram-container {
          background: #FFFFFF;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 20px;
          overflow: hidden;
          padding: 24px;
          box-shadow: 
            0 2px 24px rgba(0,0,0,0.04);
        }
        .tech-diagram-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
          border-radius: 12px;
        }

        @media (max-width: 960px) {
          .tech-inner { padding: 0 40px; }
          .tech-layout { grid-template-columns: 1fr; gap: 48px; }
        }
        @media (max-width: 640px) {
          .tech-inner { padding: 0 24px; }
          .tech-section { padding: 100px 0; }
          .tech-diagram-container { padding: 16px; }
        }
      `}</style>

      <section id="technology" className="tech-section">
        <div className="tech-inner">
          <SectionReveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', background: 'linear-gradient(135deg, #888, #1A1A1A, #555)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>04</span>
              <div style={{ width: '60px', height: '1px', background: 'rgba(0,0,0,0.12)' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999' }}>Technology</span>
            </div>
          </SectionReveal>

          <div className="tech-layout">
            <div>
              <SectionReveal style={{ transitionDelay: '60ms' }}>
                <h2 className="tech-heading">Grounded in actual cognitive resonance</h2>
              </SectionReveal>
              <SectionReveal style={{ transitionDelay: '120ms' }}>
                <p className="tech-body">
                  PreCortex deploys a multimodal pipeline. Content is analyzed in parallel 
                  across video (using <strong>V-JEPA2</strong>), audio (using <strong>wav2vec 2.0</strong>), 
                  and text (using <strong>Llama 3.2</strong>) before being processed by our core <strong>Transformer</strong> model.
                </p>
                <p className="tech-body">
                  By matching raw signal metrics against true neuro-anatomical scans of real audiences, 
                  PreCortex constructs a simulated <strong>Subject Block</strong> representation. 
                  Our product uses a custom **RAG model** to interpret this alignment and suggest exactly where critical content updates should be made.
                </p>
                <div className="tech-tags" role="list">
                  {['RAG Pipeline', 'Multimodal Transformer', 'Tribe v2', 'Neuro-grounded'].map(t => (
                    <span key={t} className="tech-tag" role="listitem">{t}</span>
                  ))}
                </div>
              </SectionReveal>
            </div>

            <SectionReveal style={{ transitionDelay: '180ms' }}>
              <div className="tech-diagram-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '10px', color: '#888', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Pipeline Input</span>
                <img 
                  src="/architecture.png" 
                  alt="PreCortex Multimodal RAG & Cognitive Prediction Pipeline Architecture" 
                  className="tech-diagram-img" 
                />
              </div>
            </SectionReveal>
          </div>

          <SectionReveal style={{ transitionDelay: '240ms' }}>
            <div className="tech-diagram-container" style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: '#888', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Simulation Timeline Output</span>
                <h3 style={{ fontSize: '18px', fontWeight: '750', color: '#0D0D0D', letterSpacing: '-0.02em', margin: 0 }}>Predicted Brain Activation Response</h3>
              </div>
              <img 
                src="/output_timeline.png" 
                alt="Predicted Brain Activation Timeline Output" 
                className="tech-diagram-img" 
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
