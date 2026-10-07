import { useRef } from 'react';
import Frame from '../ui/Frame';
import { Lines, useReveal } from '../ui/reveal';
import { RESEARCH_PILLARS, RESEARCH_FIELDS } from '../config';

/**
 * 04 / RESEARCH LAB.
 *
 * The instruments float in the 3D layer at four corners; the document
 * layer holds their read-outs in the same four corners, so each block
 * of text sits beside the object it describes. Nothing is boxed — each
 * read-out is a hairline rule, a number set large, and three lines of
 * plain description.
 *
 * The numbers are from real work: a support vector machine over
 * windowed accelerometer features from collar-mounted IoT sensors.
 */
export default function Research() {
  const ref = useRef();
  useReveal(ref);

  return (
    <Frame id="research" className="ae-research">
      <div className="ae-research-grid" ref={ref}>
        <div className="ae-sec-mark" data-fade>
          <span className="ae-mono ae-accent">04</span>
          <span className="ae-rule" />
          <span className="ae-mono">RESEARCH LAB</span>
        </div>

        <div className="ae-research-head">
          <Lines
            tag="h2"
            className="ae-display ae-research-title"
            text={['THE ROOM', 'WHERE IT', 'FAILS FIRST.']}
          />
        </div>

        <div className="ae-research-pillars">
          {RESEARCH_PILLARS.map((p, i) => (
            <article
              className={`ae-pillar ae-pillar--${i}`}
              key={p.key}
              data-fade
            >
              <span className="ae-pillar-rule" aria-hidden="true" />
              <h3 className="ae-mono ae-accent">{p.head}</h3>
              <p className="ae-pillar-body">{p.body}</p>
              <p className="ae-pillar-stat">
                <b>{p.stat}</b>
                <em className="ae-mono ae-dim">{p.statNote}</em>
              </p>
            </article>
          ))}
        </div>

        <ul className="ae-fields" data-fade>
          {RESEARCH_FIELDS.map((f) => (
            <li key={f} className="ae-mono">
              <i className="ae-node-dot" />
              {f}
            </li>
          ))}
        </ul>

        <span className="ae-vert ae-vert--research ae-mono ae-dim" data-fade>
          SENSOR SERIES / BEHAVIOUR CLASSIFICATION
        </span>
      </div>
    </Frame>
  );
}
