import './LoadingPage.css';
import { useEffect, useState } from 'react';

function LoadingPage() {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeLines, setActiveLines] = useState([]);

  const bootLines = [
    '⚔ PROJECT SHOGUN',
    'INITIALIZING PERSONAL OS...',
    'LOADING NEURAL NETWORKS...',
    'LOADING COMBAT MODULES...',
    'LOADING PROJECT DATABASE...',
    'LOADING KNOWLEDGE ARCHIVE...',
    'SYSTEM ONLINE'
  ];

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    // Progress percentage loop
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
    }, 30);

    // Line printing loop staggered over 2 seconds
    const linesInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const linesToShow = Math.floor((elapsed / duration) * bootLines.length);
      setActiveLines(bootLines.slice(0, Math.max(1, linesToShow)));
    }, 250);

    // Fade out trigger
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration);

    // Remove from DOM trigger
    const finishTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration + 400);

    return () => {
      clearInterval(progressInterval);
      clearInterval(linesInterval);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 400);
  };

  if (!isVisible) return null;

  // Custom text progress bar builder
  const blocks = Math.floor(progress / 8.33); // 12 blocks total
  const barString = '[' + '█'.repeat(blocks) + '░'.repeat(12 - blocks) + ']';

  return (
    <div className={`loading-page ${fadeOut ? 'fade-out' : ''}`}>
      {/* Background Cinematic Atmosphere */}
      <div className="boot-background">
        <div className="boot-grid"></div>
        <div className="boot-scanlines"></div>
        {/* Rotating Red Ring */}
        <div className="boot-ring-container">
          <div className="boot-rotating-ring"></div>
        </div>
        {/* Subtle Samurai Silhouette */}
        <div className="boot-samurai-silhouette"></div>
      </div>

      <div className="boot-console">
        <div className="boot-header-hud">
          <span className="shogun-mark">⚔ SHOGUN_OS_v3.5</span>
          <span className="telemetry-readout">SYSTEM_BOOT_INIT</span>
        </div>

        {/* ⚔ Katana Collision Animation HUD ⚔ */}
        <div className="katana-collision-wrapper">
          <svg viewBox="0 0 400 160" className="katana-collision-svg">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Left Katana */}
            <g className="clash-katana left-katana">
              <path d="M 80,40 L 120,60" stroke="#991b1b" strokeWidth="6" strokeLinecap="round" />
              <path d="M 80,40 L 120,60" stroke="#111" strokeWidth="6" strokeLinecap="round" strokeDasharray="3 3" />
              <ellipse cx="120" cy="60" rx="4" ry="10" fill="#dbc40e" transform="rotate(26.5 120 60)" />
              <line x1="120" y1="60" x2="220" y2="110" stroke="#e2e8f0" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="120" y1="60" x2="220" y2="110" stroke="#ff3b3b" strokeWidth="1.2" strokeLinecap="round" filter="url(#glow)" />
            </g>

            {/* Right Katana */}
            <g className="clash-katana right-katana">
              <path d="M 320,40 L 280,60" stroke="#991b1b" strokeWidth="6" strokeLinecap="round" />
              <path d="M 320,40 L 280,60" stroke="#111" strokeWidth="6" strokeLinecap="round" strokeDasharray="3 3" />
              <ellipse cx="280" cy="60" rx="4" ry="10" fill="#dbc40e" transform="rotate(-26.5 280 60)" />
              <line x1="280" y1="60" x2="180" y2="110" stroke="#e2e8f0" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="280" y1="60" x2="180" y2="110" stroke="#ff3b3b" strokeWidth="1.2" strokeLinecap="round" filter="url(#glow)" />
            </g>

            {/* Spark Lines */}
            <g className="clash-sparks">
              <line x1="200" y1="100" x2="155" y2="70" className="spark-line spark-1" />
              <line x1="200" y1="100" x2="245" y2="70" className="spark-line spark-2" />
              <line x1="200" y1="100" x2="160" y2="120" className="spark-line spark-3" />
              <line x1="200" y1="100" x2="240" y2="120" className="spark-line spark-4" />
              <line x1="200" y1="100" x2="200" y2="50" className="spark-line spark-5" />
              <line x1="200" y1="100" x2="200" y2="150" className="spark-line spark-6" />
            </g>

            {/* Glow / Flash Circle */}
            <circle cx="200" cy="100" r="0" className="clash-flash" />
          </svg>
        </div>

        {/* Text lines print list */}
        <div className="boot-log">
          {activeLines.map((line, idx) => (
            <div 
              key={idx} 
              className={`boot-log-line ${idx === bootLines.length - 1 ? 'line-online' : ''}`}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Progress HUD Bar */}
        <div className="boot-progress-container">
          <div className="boot-progress-bar font-display">{barString}</div>
          <div className="boot-percent font-display">{Math.floor(progress)}%</div>
        </div>

        {/* Skippable trigger */}
        <button className="btn-premium btn-outline boot-skip-btn" onClick={handleSkip}>
          SKIP BOOT
        </button>
      </div>
    </div>
  );
}

export default LoadingPage;
