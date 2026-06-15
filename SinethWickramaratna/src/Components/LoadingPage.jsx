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
