import { useState, useEffect } from 'react';
import SectionReveal from '../components/SectionReveal';

export default function Work() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [reactionData, setReactionData] = useState({ engaged: 0, confused: 0, dropoff: 0 });

  useEffect(() => {
    let interval;
    if (isScanning) {
      setScanProgress(0);
      setReactionData({ engaged: 0, confused: 0, dropoff: 0 });
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            setReactionData({ engaged: 61, confused: 22, dropoff: 17 });
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const handleReset = () => {
    setReactionData({ engaged: 0, confused: 0, dropoff: 0 });
    setScanProgress(0);
  };

  return (
    <>
      <style>{`
        .work-section {
          background: #080808;
          padding: 160px 0;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .work-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 80px;
        }
        .work-eyebrow {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 48px;
        }
        .work-num {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          background: linear-gradient(135deg, #555, #E5E5E5, #777);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .work-divider {
          width: 50px;
          height: 1px;
          background: rgba(255,255,255,0.12);
        }
        .work-tag-label {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #666;
        }
        .work-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: end;
          margin-bottom: 60px;
        }
        .work-heading {
          font-family: 'Inter', sans-serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 700;
          letter-spacing: -0.035em;
          color: #F5F5F5;
          margin: 0;
          line-height: 1.08;
        }
        .work-sub {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          color: #888;
          line-height: 1.65;
          letter-spacing: -0.01em;
          margin: 0;
          padding-bottom: 4px;
        }
        .scan-panel {
          background: #0D0D0D;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        }
        .scan-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: #141414;
        }
        .scan-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          transition: background 0.3s, box-shadow 0.3s;
        }
        .scan-status-dot.idle { background: #555; }
        .scan-status-dot.active {
          background: #6EE7B7;
          box-shadow: 0 0 10px rgba(110,231,183,0.5);
          animation: work-pulse 1.5s ease-in-out infinite;
        }
        .scan-status-dot.done { background: #6EE7B7; }
        @keyframes work-pulse {
          0%, 100% { box-shadow: 0 0 4px rgba(110,231,183,0.2); }
          50% { box-shadow: 0 0 14px rgba(110,231,183,0.6); }
        }
        .scan-id {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #777;
          text-transform: uppercase;
        }
        .scan-status-text {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: #6EE7B7;
          text-transform: uppercase;
        }
        .scan-body {
          padding: 28px;
        }
        .scan-content-lines {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          overflow: hidden;
          padding-bottom: 4px;
        }
        .work-content-line {
          height: 7px;
          border-radius: 4px;
          background: rgba(255,255,255,0.08);
          position: relative;
          overflow: hidden;
        }
        .work-content-line::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transform: translateX(-100%);
          animation: work-shimmer 2s ease-in-out infinite;
        }
        @keyframes work-shimmer {
          to { transform: translateX(100%); }
        }
        .work-scan-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #6EE7B7, transparent);
          box-shadow: 0 0 8px rgba(110,231,183,0.6), 0 0 20px rgba(110,231,183,0.3);
          pointer-events: none;
          z-index: 10;
        }
        .work-progress-bar {
          margin: 20px 0 0;
          height: 2px;
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
          overflow: hidden;
        }
        .work-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6EE7B7, #3B82F6);
          border-radius: 2px;
          transition: width 0.1s linear;
        }
        .scan-results {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          margin-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 20px;
        }
        .result-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px 0;
        }
        .result-label {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: #777;
        }
        .result-value {
          font-family: 'Inter', sans-serif;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.04em;
          color: #F5F5F5;
          line-height: 1;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .result-value.faded { color: #555; }
        .result-placeholder {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: #666;
          text-align: center;
          padding: 16px 0;
          letter-spacing: -0.01em;
          grid-column: 1 / -1;
        }
        .scan-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          padding: 0 0 4px;
        }
        .btn-scan-light {
          background: #F5F5F5;
          color: #0A0A0A;
          border: none;
          padding: 11px 22px;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          letter-spacing: -0.01em;
        }
        .btn-scan-light:hover:not(:disabled) {
          background: #FFFFFF;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255,255,255,0.15);
        }
        .btn-scan-light:disabled {
          background: rgba(255,255,255,0.08);
          color: #555;
          cursor: not-allowed;
        }
        .btn-reset-light {
          background: transparent;
          color: #888;
          border: 1px solid rgba(255,255,255,0.12);
          padding: 11px 16px;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: -0.01em;
        }
        .btn-reset-light:hover { color: #F5F5F5; border-color: rgba(255,255,255,0.25); }

        @keyframes work-scanDown {
          0% { top: 0; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .work-scanline-animation { animation: work-scanDown 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }

        @media (max-width: 900px) {
          .work-inner { padding: 0 40px; }
          .work-header { grid-template-columns: 1fr; gap: 24px; }
        }
        @media (max-width: 640px) {
          .work-inner { padding: 0 24px; }
          .work-section { padding: 100px 0; }
          .scan-body { padding: 20px; }
          .scan-header { padding: 16px 20px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .work-content-line::after { animation: none; }
          .scan-status-dot.active { animation: none; }
          .work-scanline-animation { animation: none; top: 50%; opacity: 0.5; }
        }
      `}</style>

      <section id="work" className="work-section">
        <div className="work-inner">
          <SectionReveal>
            <div className="work-eyebrow">
              <span className="work-num">DEMO</span>
              <div className="work-divider" />
              <span className="work-tag-label">Live Simulation</span>
            </div>
          </SectionReveal>

          <div className="work-header">
            <SectionReveal style={{ transitionDelay: '60ms' }}>
              <h2 className="work-heading">See the simulation in action</h2>
            </SectionReveal>
            <SectionReveal style={{ transitionDelay: '120ms' }}>
              <p className="work-sub">
                Run a pre-publication cortex scan on a lecture audio segment and watch PreCortex detect DorsalAttention decay across 20,484 cortical vertices.
              </p>
            </SectionReveal>
          </div>

          <SectionReveal style={{ transitionDelay: '180ms' }}>
            <div className="scan-panel" role="region" aria-label="Content simulation demo">
              <div className="scan-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className={`scan-status-dot ${isScanning ? 'active' : reactionData.engaged > 0 ? 'done' : 'idle'}`} aria-hidden="true" />
                  <span className="scan-id">TRIBE_V2_CORTICAL_SIMULATOR</span>
                </div>
                <span className="scan-status-text" aria-live="polite">
                  {isScanning ? `SIMULATING 20,484 VERTICES ${scanProgress}%` : reactionData.engaged > 0 ? '6:22 WEAK MOMENT DETECTED' : 'READY'}
                </span>
              </div>

              <div className="scan-body">
                <div className="scan-content-lines">
                  <div className="work-content-line" style={{ width: '85%' }} />
                  <div className="work-content-line" style={{ width: '60%' }} />
                  <div className="work-content-line" style={{ width: '78%' }} />
                  <div className="work-content-line" style={{ width: '42%' }} />
                  <div className="work-content-line" style={{ width: '91%' }} />
                  {isScanning && (
                    <div className="work-scan-line work-scanline-animation" aria-hidden="true" />
                  )}
                </div>

                {isScanning && (
                  <div className="work-progress-bar" role="progressbar" aria-valuenow={scanProgress} aria-valuemin={0} aria-valuemax={100}>
                    <div className="work-progress-fill" style={{ width: `${scanProgress}%` }} />
                  </div>
                )}

                <div className="scan-results">
                  {reactionData.engaged > 0 ? (
                    <>
                      <div className="result-item">
                        <span className="result-label">Engaged</span>
                        <span className="result-value" style={{ color: '#6EE7B7' }}>{reactionData.engaged}%</span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Confused</span>
                        <span className="result-value" style={{ color: '#FBBF24' }}>{reactionData.confused}%</span>
                      </div>
                      <div className="result-item">
                        <span className="result-label">Drop-off</span>
                        <span className="result-value faded" style={{ color: '#F87171' }}>{reactionData.dropoff}%</span>
                      </div>
                    </>
                  ) : (
                    <p className="result-placeholder">
                      {isScanning
                        ? 'Reading future audience resonance parameters across 20,484 vertices…'
                        : 'Trigger cortical projection to see attention results'}
                    </p>
                  )}
                </div>

                <div className="scan-actions">
                  <button
                    className="btn-scan-light"
                    onClick={() => setIsScanning(true)}
                    disabled={isScanning}
                    aria-busy={isScanning}
                  >
                    {isScanning ? 'Scanning…' : 'Run the Scan'}
                  </button>
                  {reactionData.engaged > 0 && !isScanning && (
                    <button className="btn-reset-light" onClick={handleReset}>Reset</button>
                  )}
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
