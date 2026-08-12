import { useRef } from 'react';
import Frame from '../ui/Frame';
import { useReveal, useMagnetic } from '../ui/reveal';
import { AVAILABLE_FOR, LINKS } from '../config';

/**
 * The connection.
 *
 * The last station and the only symmetrical one — after twelve
 * compositions built off-centre on purpose, a centred portal reads as
 * arrival. The environment darkens to almost nothing here, so the ring
 * is the only light in the frame.
 *
 * The call to action does not navigate. It opens the portal: the
 * aperture widens, the intake accelerates, and the contact channels
 * unfold underneath it in place.
 */
export default function Contact({ open, onOpen }) {
  const ref = useRef();
  const cta = useRef();
  useReveal(ref);
  useMagnetic(cta, 0.4);

  return (
    <Frame id="contact" className={`ae-contact${open ? ' is-open' : ''}`}>
      <div className="ae-contact-grid" ref={ref}>
        <div className="ae-sec-mark ae-sec-mark--centre" data-fade>
          <span className="ae-mono ae-accent">06</span>
          <span className="ae-rule" />
          <span className="ae-mono">CONNECTION</span>
        </div>

        {/* LET'S BUILD WHAT'S NEXT. is painted by BackLayer, under the
            canvas, so the portal ring eclipses the middle two words. */}
        <h2 className="ae-sr">Let&rsquo;s build what&rsquo;s next.</h2>

        <div className="ae-contact-avail" data-fade>
          <span className="ae-mono ae-dim">AVAILABLE FOR</span>
          <ul>
            {AVAILABLE_FOR.map((a) => (
              <li key={a} className="ae-mono">
                {a}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          ref={cta}
          className="ae-cta ae-cta--portal"
          onClick={() => onOpen(!open)}
          data-fade
        >
          <span className="ae-mono">
            {open ? 'CONNECTION ESTABLISHED' : 'ESTABLISH CONNECTION'}
          </span>
          <svg viewBox="0 0 24 12" aria-hidden="true">
            <path d="M0 6h21M16 1l5 5-5 5" fill="none" stroke="currentColor" />
          </svg>
        </button>

        <ul className={`ae-channels${open ? ' is-open' : ''}`}>
          {LINKS.map((l, i) => (
            <li key={l.key} style={{ '--ci': i }}>
              <a href={l.href} target="_blank" rel="noreferrer">
                <span className="ae-mono ae-dim">{l.key}</span>
                <span className="ae-channel-value">{l.value}</span>
                <i className="ae-channel-rule" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}
