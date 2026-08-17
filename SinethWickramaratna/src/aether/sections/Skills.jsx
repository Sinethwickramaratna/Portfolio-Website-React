import { useRef } from 'react';
import Frame from '../ui/Frame';
import { useReveal } from '../ui/reveal';

/**
 * The neural map's document layer.
 *
 * Almost nothing: the two centre words that the 3D nucleus sits behind,
 * a prompt, and the read-out that fills in when a node is under the
 * cursor. The section is deliberately empty of copy — the map itself is
 * the content, and anything else here would be competing with it.
 */
export default function Skills({ hovered }) {
  const ref = useRef();
  useReveal(ref);

  return (
    <Frame id="skills" className="ae-skills">
      <div className="ae-skills-grid" ref={ref}>
        <div className="ae-sec-mark" data-fade>
          <span className="ae-mono ae-accent">—</span>
          <span className="ae-rule" />
          <span className="ae-mono">NEURAL MAP</span>
        </div>

        {/* DATA / INTELLIGENCE is painted by BackLayer, under the
            canvas, so the nucleus and its cage cut across the
            letterforms rather than sitting behind them. */}

        <p className="ae-skills-prompt" data-fade>
          {/* Neutral wording: the map answers a tap as readily as a
              hover, and telling a phone user to move their cursor is
              the fastest way to look like a desktop site in a costume. */}
          <span className="ae-mono ae-dim">HOVER OR TAP A NODE</span>
        </p>

        {/* One read-out, bottom left, rather than ten tooltips. */}
        <div className={`ae-readout${hovered ? ' is-on' : ''}`} aria-live="polite">
          <span className="ae-mono ae-accent">
            {hovered ? hovered.name : 'STANDBY'}
          </span>
          <p>{hovered ? hovered.note : 'Ten disciplines, one connected practice.'}</p>
        </div>

        <span className="ae-vert ae-vert--skills ae-mono ae-dim" data-fade>
          10 NODES / 14 EDGES
        </span>
      </div>
    </Frame>
  );
}
