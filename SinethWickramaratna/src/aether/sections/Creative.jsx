import { useRef } from 'react';
import Frame from '../ui/Frame';
import { Lines, useReveal } from '../ui/reveal';
import { CREATIVE_DISCIPLINES } from '../config';

/**
 * 05 / CREATIVE ENGINE.
 *
 * The work is hung in the 3D layer at five different depths, and the
 * camera walks between the plates as the cursor moves. The document
 * layer stays out of the way: everything written sits in the top-left
 * column, and a single line tells the visitor that the room responds to
 * them.
 *
 * The disciplines used to run down the right margin. There is no room
 * there — that is where the plates hang, and the list was printed
 * straight across the MoraForesight poster. It belongs under the copy,
 * where it reads as a caption to the paragraph it qualifies.
 */
export default function Creative() {
  const ref = useRef();
  useReveal(ref);

  return (
    <Frame id="creative" className="ae-creative">
      <div className="ae-creative-grid" ref={ref}>
        <div className="ae-sec-mark" data-fade>
          <span className="ae-mono ae-accent">05</span>
          <span className="ae-rule" />
          <span className="ae-mono">CREATIVE ENGINE</span>
        </div>

        <div className="ae-creative-head">
          <Lines
            tag="h2"
            className="ae-display ae-creative-title"
            text={['NOT ONLY', 'AN ENGINEER.']}
          />
          <p className="ae-creative-sub" data-fade>
            Identity, campaign and event design for university societies —
            posters that had to work at a distance, on a phone, and on a wall.
          </p>

          <ul className="ae-disciplines" data-fade>
            {CREATIVE_DISCIPLINES.map((d) => (
              <li key={d} className="ae-mono">
                {d}
              </li>
            ))}
          </ul>

          {/* Also in the column. Centred at the bottom of the frame it
              landed on whichever plate caption happened to hang there. */}
          <p className="ae-creative-hint ae-mono ae-dim" data-fade>
            MOVE TO WALK THE ROOM
          </p>
        </div>
      </div>
    </Frame>
  );
}
