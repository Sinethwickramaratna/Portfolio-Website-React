import { useEffect, useRef } from 'react';
import Frame from '../ui/Frame';
import { Lines, useReveal } from '../ui/reveal';
import { CREATIVE_DISCIPLINES, EXHIBITION } from '../config';

/**
 * 06 / CREATIVE ENGINE.
 *
 * The work is hung in the 3D layer as a room — back wall, two side
 * walls — and the camera walks it as the cursor moves. The document
 * layer stays out of the way: everything written sits in the top-left
 * column, because the rest of the frame is where the plates hang.
 *
 * Selecting a plate opens it. This component then swaps from "walk the
 * room" to a viewer: the title and its context at a readable size, a
 * counter, and step controls. The image itself stays in the 3D layer —
 * it is the same object that was on the wall, flown forward — so
 * opening a work never feels like a modal appearing over a scene.
 */
export default function Creative({ focus = -1, onFocus }) {
  const ref = useRef();
  useReveal(ref);

  const open = focus >= 0;
  const piece = open ? EXHIBITION[focus] : null;

  /* Escape closes, arrows step. Bound only while a work is open so the
     rest of the site keeps its own key handling. */
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onFocus?.(-1);
      if (e.key === 'ArrowRight') onFocus?.((focus + 1) % EXHIBITION.length);
      if (e.key === 'ArrowLeft') {
        onFocus?.((focus - 1 + EXHIBITION.length) % EXHIBITION.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, focus, onFocus]);

  return (
    <Frame id="creative" className={`ae-creative${open ? ' is-open' : ''}`}>
      <div className="ae-creative-grid" ref={ref}>
        <div className="ae-sec-mark" data-fade>
          <span className="ae-mono ae-accent">06</span>
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

          {/* Neutral about the input, because the room answers a drag
              as readily as a pointer. */}
          <p className="ae-creative-hint ae-mono ae-dim" data-fade>
            {EXHIBITION.length} WORKS &middot; MOVE TO WALK &middot; SELECT TO ENTER
          </p>
          <p className="ae-creative-hint-touch ae-mono ae-dim" data-fade>
            {EXHIBITION.length} WORKS &middot; TAP ONE TO OPEN IT
          </p>
        </div>

        {/* The viewer. Present in the DOM at all times and revealed by a
            class, so opening a work is a transition rather than a mount. */}
        <div className="ae-viewer" aria-hidden={!open}>
          <button
            type="button"
            className="ae-viewer-close ae-mono"
            onClick={() => onFocus?.(-1)}
            tabIndex={open ? 0 : -1}
          >
            CLOSE
            <i />
          </button>

          <div className="ae-viewer-read">
            <span className="ae-mono ae-accent ae-viewer-kind">
              {piece ? piece.kind : ''}
            </span>
            <h3 className="ae-viewer-title">{piece ? piece.title : ''}</h3>
            <p className="ae-mono ae-dim ae-viewer-org">{piece ? piece.org : ''}</p>
          </div>

          <div className="ae-viewer-nav">
            <button
              type="button"
              className="ae-mono"
              onClick={() =>
                onFocus?.((focus - 1 + EXHIBITION.length) % EXHIBITION.length)
              }
              tabIndex={open ? 0 : -1}
              aria-label="Previous work"
            >
              ←
            </button>
            <span className="ae-mono ae-viewer-count">
              <b>{String(focus + 1).padStart(2, '0')}</b>
              <i />
              {String(EXHIBITION.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              className="ae-mono"
              onClick={() => onFocus?.((focus + 1) % EXHIBITION.length)}
              tabIndex={open ? 0 : -1}
              aria-label="Next work"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </Frame>
  );
}
