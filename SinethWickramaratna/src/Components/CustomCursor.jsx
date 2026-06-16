import { useState, useEffect, useRef } from 'react';
import './CustomCursor.css';

function CustomCursor() {
  const [cursorState, setCursorState] = useState('default'); // default, explore, execute, open
  const [isVisible, setIsVisible] = useState(false);

  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const requestRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Disable custom cursor on mobile/tablets
    const isMobile = window.matchMedia('(hover: none)').matches;
    if (isMobile) return;

    setIsVisible(true);

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth lerp for outer gold ring follow delay
    const updateRingPosition = () => {
      if (ringRef.current) {
        const prevX = parseFloat(ringRef.current.style.left) || mouseRef.current.x;
        const prevY = parseFloat(ringRef.current.style.top) || mouseRef.current.y;
        
        const dx = mouseRef.current.x - prevX;
        const dy = mouseRef.current.y - prevY;
        
        const nextX = prevX + dx * 0.15;
        const nextY = prevY + dy * 0.15;
        
        ringRef.current.style.left = `${nextX}px`;
        ringRef.current.style.top = `${nextY}px`;
      }
      requestRef.current = requestAnimationFrame(updateRingPosition);
    };
    requestRef.current = requestAnimationFrame(updateRingPosition);

    // Event delegation to capture active hovers for OS cursor labels
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      // Find closest link, button, or card with cursor trigger
      const interactiveEl = target.closest('a, button, [data-cursor], .shogun-card, .skill-card-hex, .mission-dossier-card');
      if (!interactiveEl) {
        setCursorState('default');
        return;
      }

      // Check explicit data-cursor first
      const cursorAttr = interactiveEl.getAttribute('data-cursor');
      if (cursorAttr) {
        setCursorState(cursorAttr);
        return;
      }

      // Auto-assign based on HTML tag
      const tagName = interactiveEl.tagName.toLowerCase();
      if (tagName === 'a' || interactiveEl.classList.contains('load-more-btn')) {
        setCursorState('open');
      } else if (tagName === 'button' || interactiveEl.classList.contains('btn-premium')) {
        setCursorState('execute');
      } else if (interactiveEl.classList.contains('mission-dossier-card') || interactiveEl.classList.contains('project-card')) {
        setCursorState('explore');
      } else {
        setCursorState('default');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (!isVisible) return null;

  const getCursorLabel = () => {
    switch (cursorState) {
      case 'explore': return 'EXPLORE';
      case 'execute': return 'EXECUTE';
      case 'open': return 'OPEN';
      default: return '';
    }
  };

  return (
    <div className={`custom-cursor-wrapper state-${cursorState}`}>
      {/* Outer Ring: Gold */}
      <div 
        className="cursor-ring-outer" 
        style={{ left: '-100px', top: '-100px' }}
        ref={ringRef}
      >
        <span className="ring-radar"></span>
      </div>

      {/* Inner Dot: Red */}
      <div 
        className="cursor-dot-inner" 
        style={{ left: '-100px', top: '-100px' }}
        ref={dotRef}
      >
        {/* Dynamic HUD Label floating next to cursor */}
        {cursorState !== 'default' && (
          <div className="cursor-hud-label font-display">
            {getCursorLabel()}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomCursor;
