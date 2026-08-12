import { useRef } from 'react';
import Frame from '../ui/Frame';
import { Lines, useReveal } from '../ui/reveal';
import { HERO_LABELS } from '../config';
import { scrollToStation } from '../state/flight';

/**
 * The cover.
 *
 * Built as a magazine spread, not a header: the name is set at a size
 * that cannot fit comfortably, and then the composition is arranged
 * around that discomfort. SINETH sits *behind* the canvas so the
 * intelligence core eclipses it; WICKRAMARATNA sits in front and rides
 * over the core's lower edge. That single inversion is what gives the
 * page depth before anything has moved.
 *
 * Everything else is margin furniture — system labels, vertical
 * descriptors, the statement — pushed to the edges to leave the middle
 * to the object.
 */
export default function Hero() {
  const ref = useRef();
  useReveal(ref, { start: 'top 90%' });

  return (
    <Frame id="hero" className="ae-hero">
      <div className="ae-hero-grid" ref={ref}>
        {/* ---- margin furniture, top ---- */}
        <div className="ae-hero-sys" data-fade>
          <span className="ae-mono ae-accent">SYSTEM / 01</span>
          <span className="ae-rule" />
          <span className="ae-mono ae-dim">DIGITAL PORTFOLIO</span>
          <span className="ae-mono ae-dim">2026</span>
        </div>

        <div className="ae-hero-edition" data-fade>
          <span className="ae-mono">INDEX</span>
          <span className="ae-mono ae-accent">2026</span>
        </div>

        {/* ---- vertical descriptors, both margins ---- */}
        <div className="ae-vert ae-vert--left" data-fade>
          <span className="ae-mono">DATA SCIENCE ENGINEER</span>
        </div>
        <div className="ae-vert ae-vert--right" data-fade>
          <span className="ae-mono">AI / MACHINE LEARNING</span>
          <span className="ae-mono ae-dim">CREATIVE TECHNOLOGY</span>
        </div>

        {/* SINETH and the orbital paths are painted by BackLayer, one
            layer under the canvas, so the core eclipses them. */}

        {/* ---- floating labels, threaded onto the orbits ---- */}
        <div className="ae-hero-labels" aria-hidden="true">
          {HERO_LABELS.map((l, i) => (
            <span
              key={l.text}
              className={`ae-float ae-float--${i}`}
              style={{ '--fi': i }}
            >
              <i className="ae-float-dot" />
              {l.text}
            </span>
          ))}
        </div>

        {/* ---- IN FRONT of the canvas ---- */}
        <div className="ae-hero-front">
          <h1 className="ae-sr">Sineth Wickramaratna — Data Science Engineer</h1>
          <span className="ae-hero-second" aria-hidden="true">
            WICKRA
            <em>MARATNA</em>
          </span>
        </div>

        {/* ---- statement ---- */}
        <div className="ae-hero-statement">
          <Lines
            tag="p"
            className="ae-statement"
            text={['BUILDING INTELLIGENCE.', 'DESIGNING POSSIBILITY.']}
          />
        </div>

        {/* ---- descriptor stack + scroll cue ---- */}
        <div className="ae-hero-desc" data-fade>
          <span className="ae-mono ae-dim">DATA SCIENCE ENGINEER</span>
          <span className="ae-mono ae-dim">AI / MACHINE LEARNING</span>
          <span className="ae-mono ae-dim">CREATIVE TECHNOLOGY</span>
        </div>

        <button
          type="button"
          className="ae-scrollcue"
          onClick={() => scrollToStation('intro')}
        >
          <span className="ae-mono">BEGIN</span>
          <span className="ae-scrollcue-line" />
        </button>
      </div>
    </Frame>
  );
}
