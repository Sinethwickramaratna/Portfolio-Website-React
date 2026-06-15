import { useState, useEffect } from 'react';
import './CoreTelemetry.css';
import projectsDataRaw from '../data/projectsData.json';
import AtmosphericBackground from './AtmosphericBackground';
import { useInView } from '../hooks/useInView';

function CoreTelemetry() {
  const [telemetryRef, isTelemetryInView] = useInView();
  const [typedMode, setTypedMode] = useState('');
  const modeText = 'BUILDING THE FUTURE...';
  
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setTypedMode(modeText.slice(0, i + 1));
      i++;
      if (i >= modeText.length) {
        setTimeout(() => {
          i = 0;
        }, 1500); // Loop typing
      }
    }, 120);
    return () => clearInterval(typing);
  }, []);

  const projectCount = projectsDataRaw.projects ? projectsDataRaw.projects.length : 0;

  return (
    <section className="core-telemetry-section" id="core-telemetry" ref={telemetryRef}>
      <AtmosphericBackground type="telemetry" />
      
      <div className="spatial-container">
        
        {/* Section Header telemetry HUD */}
        <div className="section-header-hud">
          <span className="section-number-bg">001</span>
          <h2 className="section-title-hud font-display" data-kanji="測">
            [001] <span className="text-gradient">CORE TELEMETRY</span>
          </h2>
          <span className="section-telemetry-hud monospace-val">SYS_STATUS_ACTIVE</span>
        </div>

        {/* Dashboard Terminals Grid */}
        <div className={`telemetry-dashboard-grid shoji-reveal ${isTelemetryInView ? 'loaded' : ''}`}>
          
          {/* Card 1: Geographic coordinates */}
          <div className="telemetry-card shogun-card">
            <div className="hud-corner top-left"></div>
            <div className="hud-corner top-right"></div>
            <div className="hud-corner bottom-left"></div>
            <div className="hud-corner bottom-right"></div>
            
            <div className="card-top-line">
              <span className="monospace-val">// GPS COORDINATES //</span>
              <span className="pulse-dot active"></span>
            </div>
            <div className="telemetry-metrics">
              <h3 className="telemetry-title">SRI LANKA</h3>
              <p className="telemetry-desc">LAT: 7.8731° N // LON: 80.7718° E</p>
              <div className="telemetry-extra monospace-val">LOC: ASIA/COLOMBO (GMT+5:30)</div>
            </div>
          </div>

          {/* Card 2: Core Stack & Tech focus */}
          <div className="telemetry-card shogun-card">
            <div className="hud-corner top-left"></div>
            <div className="hud-corner top-right"></div>
            <div className="hud-corner bottom-left"></div>
            <div className="hud-corner bottom-right"></div>
            
            <div className="card-top-line">
              <span className="monospace-val">// CRITICAL PATHWAYS //</span>
              <span className="status-label font-display text-gold">ACTIVE</span>
            </div>
            <div className="telemetry-metrics">
              <h3 className="telemetry-title font-display text-gradient">AI / ML FOCUS</h3>
              <p className="telemetry-desc">React • Python • TensorFlow</p>
              <div className="telemetry-extra monospace-val">MODELS: SCI-LEARN / PYTORCH / TF</div>
            </div>
          </div>

          {/* Card 3: System Uptime & Dynamic Counters */}
          <div className="telemetry-card shogun-card">
            <div className="hud-corner top-left"></div>
            <div className="hud-corner top-right"></div>
            <div className="hud-corner bottom-left"></div>
            <div className="hud-corner bottom-right"></div>
            
            <div className="card-top-line">
              <span className="monospace-val">// AGENT READOUTS //</span>
              <span className="pulse-dot active-gold"></span>
            </div>
            <div className="telemetry-metrics">
              <div className="double-metrics-row">
                <div className="d-metric">
                  <span className="d-metric-val monospace-val">{projectCount}+</span>
                  <span className="d-metric-label font-display">MISSIONS</span>
                </div>
                <div className="d-metric">
                  <span className="d-metric-val monospace-val text-gold">99.9%</span>
                  <span className="d-metric-label font-display">UPTIME</span>
                </div>
              </div>
              <div className="telemetry-extra monospace-val">MODE: {typedMode}</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default CoreTelemetry;
