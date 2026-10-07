import { useRef } from 'react';
import Frame from '../ui/Frame';
import { Lines, useReveal } from '../ui/reveal';
import { CERTIFICATES } from '../config';
import { certImage } from '../certImages';

/**
 * 05 / CREDENTIALS.
 *
 * A ledger, not a wall of badges. Each row is a hairline rule, an
 * issuer, a date and what the thing was for — the same register as the
 * profile metadata — and the certificate itself only appears when a row
 * is pointed at, as a plate to the side.
 *
 * The 3D layer holds a fanned stack of glass panes, one per row, which
 * riffles as the reader moves down the list. The hover state is shared
 * both ways: pointing at a row lights its pane, and pointing at a pane
 * lights its row.
 */
export default function Credentials({ active = -1, onActive }) {
  const ref = useRef();
  useReveal(ref);

  const current = active >= 0 ? CERTIFICATES[active] : null;
  const preview = current ? certImage(current.image) : null;

  return (
    <Frame id="credentials" className="ae-credentials">
      <div className="ae-cred-grid" ref={ref}>
        <div className="ae-sec-mark" data-fade>
          <span className="ae-mono ae-accent">05</span>
          <span className="ae-rule" />
          <span className="ae-mono">CREDENTIALS</span>
        </div>

        <div className="ae-cred-head">
          <Lines
            tag="h2"
            className="ae-display ae-cred-title"
            text={['PAPER', 'TRAIL.']}
          />
          <p className="ae-cred-sub" data-fade>
            Courses, competitions and service — the parts of the record that
            someone else signed.
          </p>
        </div>

        <ol className="ae-cred-list" data-fade>
          {CERTIFICATES.map((c, i) => (
            <li
              key={c.title}
              className={`ae-cred-row${i === active ? ' is-on' : ''}`}
              onPointerEnter={() => onActive?.(i)}
              onPointerLeave={() => onActive?.(-1)}
            >
              <span className="ae-mono ae-cred-n">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="ae-cred-main">
                <b className="ae-cred-name">{c.title}</b>
                <span className="ae-cred-issuer">{c.issuer}</span>
              </span>
              <span className="ae-mono ae-dim ae-cred-kind">{c.kind}</span>
              <span className="ae-mono ae-cred-date">{c.date}</span>
            </li>
          ))}
        </ol>

        {/* The plate. Present in the DOM at all times so switching rows
            swaps an image rather than mounting one. */}
        <figure className={`ae-cred-plate${current ? ' is-on' : ''}`} aria-hidden={!current}>
          {preview && <img src={preview} alt="" loading="lazy" decoding="async" />}
          <figcaption className="ae-mono ae-dim">
            {current ? current.note : ''}
          </figcaption>
        </figure>

        <span className="ae-vert ae-vert--cred ae-mono ae-dim" data-fade>
          SIGNED / DATED / FILED
        </span>
      </div>
    </Frame>
  );
}
