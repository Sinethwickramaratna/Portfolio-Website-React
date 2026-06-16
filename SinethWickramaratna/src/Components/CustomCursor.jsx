import { useState, useEffect, useRef } from 'react';
import './CustomCursor.css';

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState('default'); // default, explore, execute, open
  const [isVisible, setIsVisible] = useState(false);

  const ringRef = useRef(null);
  const requestRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    // Disable custom cursor on mobile/tablets
    const isMobile = window.matchMedia('(hover: none)').matches;
    if (isMobile) return;

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        setRingPosition({ x: e.clientX, y: e.clientY });
        setIsVisible(true);
        document.body.classList.add('has-custom-cursor');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      document.body.classList.remove('has-custom-cursor');
    };

    const handleMouseEnter = () => {
      if (hasMovedRef.current) {
        setIsVisible(true);
        document.body.classList.add('has-custom-cursor');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth lerp for outer gold ring follow delay
    const updateRingPosition = () => {
      setRingPosition((prev) => {
        const dx = mouseRef.current.x - prev.x;
        const dy = mouseRef.current.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15
        };
      });
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
      document.body.classList.remove('has-custom-cursor');
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
        style={{ left: `${ringPosition.x}px`, top: `${ringPosition.y}px` }}
        ref={ringRef}
      >
        <span className="ring-radar"></span>
      </div>

      {/* Inner Dot: Red */}
      <div 
        className="cursor-dot-inner" 
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
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
