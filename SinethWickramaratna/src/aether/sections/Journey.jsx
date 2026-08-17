import { useRef } from 'react';
import Frame from '../ui/Frame';
import { Lines, useReveal } from '../ui/reveal';
import { JOURNEY } from '../config';

/**
 * 03 / JOURNEY.
 *
 * The path itself is in the 3D layer; what lives here is the reading of
 * it. One milestone is shown at a time, in a fixed panel, and scrolling
 * the section walks the trajectory — so the prose has a stable place on
 * the page instead of seven blocks of text chasing 3D nodes around and
 * colliding with each other.
 *
 * The step rail on the right is the only navigation: it says how far
 * along the path you are without drawing a timeline.
 */
export default function Journey({ active = 0 }) {
  const ref = useRef();
  useReveal(ref);

  const current = JOURNEY[active] ?? JOURNEY[0];

  return (
    <Frame id="journey" className="ae-journey">
      <div className="ae-journey-grid" ref={ref}>
        <div className="ae-sec-mark" data-fade>
          <span className="ae-mono ae-accent">03</span>
          <span className="ae-rule" />
          <span className="ae-mono">JOURNEY</span>
        </div>

        <div className="ae-journey-head">
          <Lines
            tag="h2"
            className="ae-display ae-journey-title"
            text={['A TRAJECTORY,', 'NOT A LIST.']}
          />
          <p className="ae-journey-sub" data-fade>
            Seven points on one continuous path — university, design, service,
            leadership, research, and the systems that came out of all of it.
          </p>

          {/* The read-out. Fixed position, changing content — the panel
              is the constant so the eye never has to hunt for the words.
              It lives in this column because the column is the one
              region the trajectory reliably avoids: the curve begins low
              on the left and only climbs once it is past the text. Both
              bottom corners were tried first and both are crossed by the
              wave at some viewport height. */}
          <article className="ae-milestone" aria-live="polite">
            <span className="ae-milestone-step ae-mono">
              <b>{String(active + 1).padStart(2, '0')}</b>
              <i />
              {String(JOURNEY.length).padStart(2, '0')}
            </span>
            <span className="ae-mono ae-accent ae-milestone-key">
              {current.key}
            </span>
            <h3 className="ae-milestone-title">{current.title}</h3>
            <p className="ae-milestone-detail">{current.detail}</p>
            <span className="ae-mono ae-dim ae-milestone-year">
              {current.year}
            </span>
          </article>
        </div>

        {/* Position along the path is reported twice already — by the
            "04 — 07" counter in the read-out and by the bar below — so
            the tick rail that used to sit in the right margin has gone.
            It said nothing new and collided with both the node keys and
            the navigation rail. */}
        <div className="ae-journey-bounds" aria-hidden="true">
          <span className="ae-mono ae-dim">2023</span>
          <span className="ae-journey-track">
            <i style={{ transform: `scaleX(${(active + 1) / JOURNEY.length})` }} />
          </span>
          <span className="ae-mono ae-accent">2026</span>
        </div>
      </div>
    </Frame>
  );
}
