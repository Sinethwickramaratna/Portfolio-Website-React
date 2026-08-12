import { useRef } from 'react';
import Frame from '../ui/Frame';
import { Lines, useReveal } from '../ui/reveal';
import { THESIS_NODES } from '../config';

/**
 * The statement.
 *
 * One sentence, set as large as the viewport will bear, with the
 * constellation assembling through and around it. The four faces of the
 * practice are not listed underneath — they are pinned to the structure
 * at the positions their 3D anchors occupy, so reading them means
 * reading the diagram.
 */
export default function Thesis() {
  const ref = useRef();
  useReveal(ref);

  return (
    <Frame id="intro" className="ae-thesis">
      <div className="ae-thesis-grid" ref={ref}>
        <span className="ae-mono ae-dim ae-thesis-mark" data-fade>
          — / THESIS
        </span>

        <Lines
          tag="h2"
          className="ae-display ae-thesis-head"
          text={['I TURN DATA', 'INTO INTELLIGENCE.']}
        />

        <p className="ae-thesis-sub" data-fade>
          A model is only the middle of the work. The beginning is a question
          worth asking, and the end is something a person can actually use.
        </p>

        {/* Anchored to the structure, not stacked under the headline. */}
        <div className="ae-thesis-nodes" aria-hidden="true">
          {THESIS_NODES.map((n, i) => (
            <span
              key={n.text}
              className={`ae-thesis-node ae-thesis-node--${i}`}
              data-fade
            >
              <i className="ae-node-dot" />
              <b>{n.text}</b>
              <em>{n.note}</em>
            </span>
          ))}
        </div>
      </div>
    </Frame>
  );
}
