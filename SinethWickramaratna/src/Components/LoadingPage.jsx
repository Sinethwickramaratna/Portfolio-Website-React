import './LoadingPage.css';
import { useEffect, useState } from 'react';

function LoadingPage() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const phases = [
    'Sketching the interface...',
    'Wiring up the experience...',
    'Polishing the visuals...',
    'Almost ready...',
  ];

  useEffect(() => {
    const duration = 2800;
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
    }, 40);

    const phaseTimer = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % phases.length);
    }, 700);

    const finishTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration + 150);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="loading-page">
      <div className="loading-backdrop">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
        <div className="bg-grid"></div>
        <div className="bg-stars"></div>
        <div className="bg-streaks"></div>
        <div className="bg-scanline"></div>
      </div>

      <div className="loader-card">
        <div className="brand">
          <span className="brand-mark">SW</span>
          <span className="brand-sub">Portfolio</span>
        </div>

        <div className="loader-orbit">
          <span className="orbit-ring"></span>
          <span className="orbit-dot dot-1"></span>
          <span className="orbit-dot dot-2"></span>
          <span className="orbit-dot dot-3"></span>
        </div>

        <div className="loader-phrase">{phases[phaseIndex]}</div>

        <div className="loader-bar">
          <span className="loader-bar-fill" style={{ width: `${progress}%` }}></span>
        </div>

        <div className="loader-percent">{Math.floor(progress)}%</div>
      </div>
    </div>
  );
}

export default LoadingPage;
