import { useRef } from 'react';
import Frame from '../ui/Frame';
import { Lines, useReveal, useMagnetic } from '../ui/reveal';
import { PROFILE_META, CV_URL } from '../config';
import portrait from '../../assets/Images/profile.webp';
import portraitFallback from '../../assets/Images/profile.png';

/**
 * 01 / PROFILE.
 *
 * The portrait is treated as a plate in a magazine: cropped hard, run
 * to the bottom edge of the section and past the right margin, graded
 * to near-monochrome with a cyan cast so it belongs to the palette
 * rather than sitting on top of it. No frame, no container, no card —
 * the figure is silhouetted against the void with the 3D halo behind it
 * and the orbital curves crossing in front.
 *
 * The text wraps around the figure rather than sitting beside it: the
 * heading crosses over the shoulder, the metadata runs under the chin.
 */
export default function Profile() {
  const ref = useRef();
  const cv = useRef();
  useReveal(ref);
  useMagnetic(cv, 0.24);

  return (
    <Frame id="profile" className="ae-profile">
      <div className="ae-profile-grid" ref={ref}>
        <div className="ae-sec-mark" data-fade>
          <span className="ae-mono ae-accent">01</span>
          <span className="ae-rule" />
          <span className="ae-mono">PROFILE</span>
        </div>

        {/* The orbital curves and the ghost word are painted by
            BackLayer, under the canvas, so the halo crosses them. */}

        <figure className="ae-portrait">
          <picture>
            <source srcSet={portrait} type="image/webp" />
            <img
              src={portraitFallback}
              alt="Sineth Wickramaratna"
              loading="lazy"
              decoding="async"
            />
          </picture>
          <span className="ae-portrait-cast" aria-hidden="true" />
        </figure>

        <div className="ae-profile-copy">
          <Lines
            tag="h2"
            className="ae-display ae-profile-head"
            text={['BUILDING', 'INTELLIGENT', 'SYSTEMS.']}
          />

          <p className="ae-profile-body" data-fade>
            I am a Computer Science &amp; Engineering undergraduate specialising
            in Data Science Engineering — interested in building intelligent
            systems, exploring machine learning, and turning technical ideas
            into experiences that mean something to the person on the other
            side of the screen.
          </p>

          <dl className="ae-meta" data-fade>
            {PROFILE_META.map(([k, v]) => (
              <div className="ae-meta-row" key={k}>
                <dt className="ae-mono ae-dim">{k}</dt>
                <dd className="ae-mono">{v}</dd>
              </div>
            ))}
          </dl>

          {/* Rendered only when there is somewhere for it to go — a
              download that leads nowhere is worse than none. */}
          {CV_URL && (
            <a
              ref={cv}
              className="ae-cta ae-cta--ghost ae-profile-cv"
              href={CV_URL}
              target="_blank"
              rel="noreferrer"
              data-fade
            >
              <span className="ae-mono">DOWNLOAD CV</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 3v13M6.5 11l5.5 5.5L17.5 11M4 20.5h16"
                  fill="none"
                  stroke="currentColor"
                />
              </svg>
            </a>
          )}
        </div>

        <span className="ae-vert ae-vert--profile ae-mono ae-dim" data-fade>
          UNIVERSITY OF MORATUWA
        </span>
      </div>
    </Frame>
  );
}
