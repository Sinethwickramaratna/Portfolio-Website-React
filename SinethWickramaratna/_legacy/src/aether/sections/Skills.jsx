import { useRef } from 'react';
import Frame from '../ui/Frame';
import { useReveal } from '../ui/reveal';
import { SKILL_NODES } from '../config';

/**
 * The neural map's document layer.
 *
 * On a wide screen this is almost nothing: the two centre words that the
 * 3D nucleus sits behind, a prompt, and the read-out that fills in when
 * a node is under the cursor. The map itself is the content, and copy
 * here would only compete with it.
 *
 * On a phone the map cannot be the content. The constellation is twelve
 * world-units wide against a frame a third as wide as it is tall — big
 * enough to read and it leaves the screen, small enough to fit and the
 * nodes are specks with labels piled on each other. So the same ten
 * disciplines are set as a list instead, and the 3D is demoted to what
 * it can still do well at that size: be the room they are printed in.
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

        {/* The phone's version of the map. Hidden on wide screens, where
            the 3D diagram is doing this job properly. */}
        <ul className="ae-skill-list" data-fade>
          {SKILL_NODES.map((s, i) => (
            <li key={s.name}>
              <span className="ae-mono ae-dim ae-skill-n">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="ae-skill-name">{s.name}</span>
              <span className="ae-skill-note">{s.note}</span>
            </li>
          ))}
        </ul>

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
