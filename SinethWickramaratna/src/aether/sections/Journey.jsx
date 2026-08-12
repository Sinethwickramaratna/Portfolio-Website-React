import { useRef } from 'react';
import Frame from '../ui/Frame';
import { Lines, useReveal } from '../ui/reveal';

/**
 * 03 / JOURNEY.
 *
 * The milestones themselves are rendered in the 3D layer, riding the
 * trajectory — putting them in the document would have meant building
 * exactly the vertical timeline this section exists to avoid. What is
 * left here is the title, a single line of framing, and the two years
 * that bracket the path.
 */
export default function Journey() {
  const ref = useRef();
  useReveal(ref);

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
        </div>

        <div className="ae-journey-bounds" aria-hidden="true">
          <span className="ae-mono ae-dim">2023</span>
          <span className="ae-journey-track" />
          <span className="ae-mono ae-accent">2026</span>
        </div>
      </div>
    </Frame>
  );
}
