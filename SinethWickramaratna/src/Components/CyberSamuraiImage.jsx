import { useEffect } from 'react';
import { preload } from 'react-dom';
import './CyberSamuraiImage.css';
import samuraiCutout from '../assets/Images/samurai_cutout.webp';
import samuraiBg from '../assets/Images/samurai_with_bg.webp';
import faceProfile from '../assets/Images/profile.webp';

// Preload critical images as early as possible
preload(samuraiCutout, { as: 'image', fetchPriority: 'high' });
preload(samuraiBg, { as: 'image', fetchPriority: 'high' });

function CyberSamuraiImage({ revealState, setRevealState, onUnsheathe }) {
  
  // Auto-transition revealState stages when scanning is triggered
  useEffect(() => {
    if (revealState === 'scanning') {
      const timer = setTimeout(() => {
        setRevealState('pulse');
      }, 2000); // Scan sweep for 2 seconds
      return () => clearTimeout(timer);
    } else if (revealState === 'pulse') {
      const timer = setTimeout(() => {
        setRevealState('separating');
      }, 500); // Sudden energy flash
      return () => clearTimeout(timer);
    } else if (revealState === 'separating') {
      const timer = setTimeout(() => {
        setRevealState('glitching');
      }, 800); // Shifting overlay panels
      return () => clearTimeout(timer);
    } else if (revealState === 'glitching') {
      const timer = setTimeout(() => {
        setRevealState('revealed');
      }, 1000); // Glitch hologram face fades in
      return () => clearTimeout(timer);
    }
  }, [revealState, setRevealState]);

  return (
    <div className={`samurai-centerpiece-container reveal-mode-${revealState}`} data-cursor="explore">
      
      {/* Layer 1: Background Full Scene (fades in on hover or when verified) */}
      <div className="samurai-background-layer">
        <img 
          src={samuraiBg} 
          alt="Cyber Samurai Temple Background" 
          className="samurai-bg-img" 
          width="800"
          height="550"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
        />
      </div>

      {/* Layer 2: Transparent Samurai Cutout (always visible, floats/breathes) */}
      <div className="samurai-cutout-layer">
        <img 
          src={samuraiCutout} 
          alt="Cyber Samurai Warrior Cutout" 
          className="samurai-cutout-img" 
          width="800"
          height="550"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
        />
      </div>

      {/* Layer 3: Red Scan Line Sweep overlay */}
      {revealState === 'scanning' && (
        <div className="samurai-scan-overlay">
          <div className="scan-laser-line"></div>
          <div className="scan-telemetry-overlay monospace-val">
            SYS_SCAN_INITIALIZED // SCANNING_SUBJECT...
          </div>
        </div>
      )}

      {/* Layer 4: Holographic Profile ID Card glitches in */}
      {(revealState === 'glitching' || revealState === 'revealed') && (
        <div className="samurai-hologram-face">
          <div className="hologram-grid-glitch"></div>
          <img 
            src={faceProfile} 
            alt="Sineth Profile Hologram" 
            className="hologram-face-img" 
            loading="lazy"
            decoding="async"
          />
          <div className="hologram-glow-bar"></div>
          <span className="hologram-tag monospace-val">IDENTITY_VERIFIED</span>
        </div>
      )}

      {/* Layer 5: Interactive HUD nodes (visible on hover) */}
      <div className="samurai-hud-system">
        <svg viewBox="0 0 100 100" className="samurai-hud-svg" preserveAspectRatio="none">
          {/* Core Synapse: Head (28, 18) to Top-Left Card (12, 18) */}
          <line x1="28" y1="18" x2="12" y2="18" className="hud-connecting-line" />
          
          {/* Katana Strike: Hand/Sword Hilt (25, 60) to Bottom-Left Card (10, 68) */}
          <line x1="25" y1="60" x2="10" y2="68" className="hud-connecting-line" />
          
          {/* Ember Reactor: Chest/Heart (30, 42) to Top-Right Card (55, 23) */}
          <line x1="30" y1="42" x2="55" y2="23" className="hud-connecting-line" />
          
          {/* Security Core: Hip/Belt (35, 72) to Bottom-Right Card (60, 73) */}
          <line x1="35" y1="72" x2="60" y2="73" className="hud-connecting-line" />
          
          {/* Body Anchor Nodes (Pulsing Centers) */}
          <circle cx="28" cy="18" r="1.5" className="hud-center-node" />
          <circle cx="25" cy="60" r="1.5" className="hud-center-node" />
          <circle cx="30" cy="42" r="1.5" className="hud-center-node" />
          <circle cx="35" cy="72" r="1.5" className="hud-center-node" />
          
          {/* Card End Nodes */}
          <circle cx="12" cy="18" r="0.8" className="hud-end-node" />
          <circle cx="10" cy="68" r="0.8" className="hud-end-node" />
          <circle cx="55" cy="23" r="0.8" className="hud-end-node" />
          <circle cx="60" cy="73" r="0.8" className="hud-end-node" />
        </svg>

        {/* Card 1: Top-Left */}
        <div className="samurai-hud-card hud-top-left shogun-card">
          <div className="hud-corner top-left"></div>
          <div className="hud-corner top-right"></div>
          <div className="hud-corner bottom-left"></div>
          <div className="hud-corner bottom-right"></div>
          <div className="hud-card-title monospace-val">// CORE_SYNAPSE //</div>
          <div className="hud-card-stat monospace-val">STABILITY: 98.4%</div>
          <div className="hud-card-status text-gradient">STATUS: NOMINAL</div>
        </div>

        {/* Card 2: Bottom-Left */}
        <div 
          className="samurai-hud-card hud-bottom-left shogun-card interactive-hud-card"
          onClick={onUnsheathe}
          style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          title="Click to unsheathe 3D Katana"
        >
          <div className="hud-corner top-left"></div>
          <div className="hud-corner top-right"></div>
          <div className="hud-corner bottom-left"></div>
          <div className="hud-corner bottom-right"></div>
          <div className="hud-card-title monospace-val">// KATANA_STRIKE //</div>
          <div className="hud-card-stat monospace-val">CHARGE: 100%</div>
          <div className="hud-card-status text-gold">STRIKE: [ ACTIVE ]</div>
        </div>

        {/* Card 3: Top-Right */}
        <div className="samurai-hud-card hud-top-right shogun-card">
          <div className="hud-corner top-left"></div>
          <div className="hud-corner top-right"></div>
          <div className="hud-corner bottom-left"></div>
          <div className="hud-corner bottom-right"></div>
          <div className="hud-card-title monospace-val">// EMBER_REACTOR //</div>
          <div className="hud-card-stat monospace-val">OUTPUT: 99.8%</div>
          <div className="hud-card-status text-gradient">PULSE: ACTIVE</div>
        </div>

        {/* Card 4: Bottom-Right */}
        <div className="samurai-hud-card hud-bottom-right shogun-card">
          <div className="hud-corner top-left"></div>
          <div className="hud-corner top-right"></div>
          <div className="hud-corner bottom-left"></div>
          <div className="hud-corner bottom-right"></div>
          <div className="hud-card-title monospace-val">// SECURITY_CORE //</div>
          <div className="hud-card-stat monospace-val">OS: BUSHIDO_v4.5</div>
          <div className="hud-card-status text-gold">SECURITY: PASS</div>
        </div>
      </div>

    </div>
  );
}

export default CyberSamuraiImage;
