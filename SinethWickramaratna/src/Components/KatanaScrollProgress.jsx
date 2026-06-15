import { useState, useEffect } from 'react';
import './KatanaScrollProgress.css';

function KatanaScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTooltip, setActiveTooltip] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollProgress(pct);

      // Map percentages to active milestone tooltips
      if (pct > 90) {
        setActiveTooltip('TERMINAL');
      } else if (pct > 80) {
        setActiveTooltip('CREATIVE');
      } else if (pct > 70) {
        setActiveTooltip('SCROLLS');
      } else if (pct > 60) {
        setActiveTooltip('HONORS');
      } else if (pct > 50) {
        setActiveTooltip('DOSSIER');
      } else if (pct > 40) {
        setActiveTooltip('MISSIONS');
      } else if (pct > 30) {
        setActiveTooltip('SKILLS');
      } else if (pct > 20) {
        setActiveTooltip('IDENTITY');
      } else if (pct > 10) {
        setActiveTooltip('STATUS');
      } else {
        setActiveTooltip('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProgressClick = (percentage) => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: (percentage / 100) * docHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="katana-scroll-container" data-cursor="open">
      {/* Dynamic Active Section Tooltip Label */}
      {activeTooltip && (
        <div className="katana-tooltip font-display">
          {activeTooltip}
        </div>
      )}

      {/* Katana Blade scroll track */}
      <div className="katana-hilt font-display" onClick={() => handleProgressClick(0)}>
        柄
      </div>
      
      <div className="katana-blade-track" onClick={() => handleProgressClick(50)}>
        {/* Dark Metal Base Blade */}
        <div className="katana-blade-base"></div>
        {/* Glowing Illuminated Energy Blade */}
        <div 
          className="katana-blade-energy" 
          style={{ height: `${scrollProgress}%` }}
        ></div>

        {/* Milestone Marker Nodes */}
        <div className="milestone-node m-25" style={{ top: '25%' }} onClick={(e) => { e.stopPropagation(); handleProgressClick(25); }}></div>
        <div className="milestone-node m-50" style={{ top: '50%' }} onClick={(e) => { e.stopPropagation(); handleProgressClick(50); }}></div>
        <div className="milestone-node m-75" style={{ top: '75%' }} onClick={(e) => { e.stopPropagation(); handleProgressClick(75); }}></div>
        <div className="milestone-node m-100" style={{ top: '99%' }} onClick={(e) => { e.stopPropagation(); handleProgressClick(100); }}></div>
      </div>

      <div className="katana-tip font-display" onClick={() => handleProgressClick(100)}>
        鋒
      </div>
    </div>
  );
}

export default KatanaScrollProgress;
