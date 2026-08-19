import SectionReveal from '../components/SectionReveal';

export default function Technology() {
  return (
    <>
      <style>{`
        .tech-section {
          background: #080808;
          padding: 160px 0;
          border-top: 1px solid rgba(255,255,255,0.05);
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
          color: #FFFFFF;
          margin: 0 0 24px 0;
          line-height: 1.1;
        }
        .tech-body {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          color: #B0B0B0;
          line-height: 1.7;
          letter-spacing: -0.01em;
          margin-bottom: 24px;
        }
        .tech-body strong {
          color: #FFFFFF;
          font-weight: 600;
        }
        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 32px;
        }
        .tech-tag {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: #CCCCCC;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.02em;
          padding: 6px 12px;
          border-radius: 8px;
          text-transform: uppercase;
        }
        .tech-diagram-container {
          background: #0D0D0D;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 20px;
          overflow: hidden;
          padding: 24px;
          box-shadow: 0 4px 30px rgba(0,0,0,0.4);
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', backgroundImage: 'linear-gradient(135deg, #777, #FFFFFF, #AAA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CRITERION 03</span>
              <div style={{ width: '50px', height: '1px', background: 'rgba(255,255,255,0.18)' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A3A3A3' }}>Multi-agent system</span>
            </div>
          </SectionReveal>

          <div style={{ marginBottom: '48px' }}>
            <SectionReveal style={{ transitionDelay: '60ms' }}>
              <h2 className="tech-heading" style={{ maxWidth: '700px' }}>
                Five specialized agents, three machines, one contract each.
              </h2>
            </SectionReveal>
            <SectionReveal style={{ transitionDelay: '120ms' }}>
              <p className="tech-body" style={{ maxWidth: '780px', fontSize: '15.5px', color: '#B0B0B0', lineHeight: 1.7 }}>
                PreCortex is a true multi-agent pipeline: each agent is an independent service with a single competence, a typed I/O contract, and its own failure domain. An orchestrator sequences them, checkpoints state after every stage, and lets any agent fail or be swapped without touching the others.
              </p>
            </SectionReveal>
          </div>

          {/* 5 Agents Cards Grid */}
          <SectionReveal style={{ transitionDelay: '160ms' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '12px',
              marginBottom: '56px'
            }}>
              {[
                {
                  id: 'A1',
                  name: 'Transcription Agent',
                  tech: 'Linux backend · Whisper',
                  desc: 'Converts any lecture format to speech, emits time-aligned text segments: the shared clock every other agent aligns to.'
                },
                {
                  id: 'A2',
                  name: 'Neural Simulation Agent',
                  tech: 'GPU machine · TRIBE v2 · CUDA',
                  desc: 'Receives audio over network, returns predicted cortical activity: a time × 20,484 vertex tensor. Runs on separate hardware, queued one job at a time.'
                },
                {
                  id: 'A3',
                  name: 'Neuro-Analysis Agent',
                  tech: 'Linux backend · nilearn',
                  desc: 'Maps vertices to brain regions, builds five engagement-network signals, and detects sustained statistical deviations. Pure deterministic computation.'
                },
                {
                  id: 'A4',
                  name: 'Diagnosis Agent',
                  tech: 'AWS Bedrock · DeepSeek-R1',
                  desc: 'Receives verified pattern descriptor plus transcript. Constrained to produce a falsifiable hypothesis and fix tied to it. One bad response never fails job.'
                },
                {
                  id: 'OR',
                  name: 'Orchestrator',
                  tech: 'FastAPI · SQLite state machine',
                  desc: 'Sequences A1→A4, persists status per stage, supports live cancellation, health-checks GPU agent, and serves report to browser.'
                }
              ].map(agent => (
                <div key={agent.id} style={{
                  background: '#0D0D0D',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: '14px',
                  padding: '20px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      background: '#F5F5F5',
                      color: '#0A0A0A',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontFamily: 'Inter, sans-serif'
                    }}>{agent.id}</span>
                    <span style={{ fontSize: '9.5px', color: '#888', fontWeight: 600, letterSpacing: '0.04em' }}>SERVICE</span>
                  </div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', margin: 0, lineHeight: 1.25 }}>{agent.name}</h3>
                  <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#D4D4D4', background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: '6px' }}>
                    {agent.tech}
                  </div>
                  <p style={{ fontSize: '12px', color: '#CCCCCC', lineHeight: 1.5, margin: 0 }}>
                    {agent.desc}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>

          {/* Architecture diagrams */}
          <div className="tech-layout" style={{ marginTop: '32px' }}>
            <div>
              <SectionReveal style={{ transitionDelay: '180ms' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginBottom: '14px' }}>
                  Grounded in actual cognitive resonance
                </h3>
                <p className="tech-body" style={{ fontSize: '14px', color: '#B0B0B0' }}>
                  PreCortex deploys a multimodal pipeline. Content is analyzed in parallel across audio, text, and neural simulation backends before being processed by our core Nilearn & DeepSeek-R1 agents.
                </p>
                <p className="tech-body" style={{ fontSize: '14px', color: '#B0B0B0' }}>
                  By matching raw signal metrics against true neuro-anatomical scans of real audiences, PreCortex constructs a simulated cortical representation.
                </p>
                <div className="tech-tags" role="list">
                  {['Whisper A1', 'TRIBE v2 CUDA A2', 'Nilearn A3', 'DeepSeek-R1 A4', 'FastAPI Orchestrator'].map(t => (
                    <span key={t} className="tech-tag" role="listitem">{t}</span>
                  ))}
                </div>
              </SectionReveal>
            </div>

            <SectionReveal style={{ transitionDelay: '220ms' }}>
              <div className="tech-diagram-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '10px', color: '#A0A0A0', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Multi-Agent System Architecture</span>
                <img 
                  src="/architecture.png" 
                  alt="PreCortex Multi-Agent System Architecture" 
                  className="tech-diagram-img" 
                />
              </div>
            </SectionReveal>
          </div>

          <SectionReveal style={{ transitionDelay: '260ms' }}>
            <div className="tech-diagram-container" style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: '#A0A0A0', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Simulation Timeline Output</span>
                <h3 style={{ fontSize: '18px', fontWeight: '750', color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>Predicted Brain Activation Response (fsaverage5 20,484 Vertices)</h3>
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
