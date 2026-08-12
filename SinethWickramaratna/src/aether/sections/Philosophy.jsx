import { useEffect, useRef } from 'react';
import Frame from '../ui/Frame';
import Orbits from '../ui/Orbits';
import { DOCTRINE } from '../config';
import { gsap, ScrollTrigger } from '../ui/reveal';

/**
 * The doctrine.
 *
 * The breathing point between the two heaviest halves of the site. Four
 * words, each on its own line, each staggered independently and each
 * indented differently so the block leans. The orbital ellipses are
 * drawn over the type — a ring passing *through* a word rather than
 * around it is the single detail that makes typography read as part of
 * a composition instead of a headline sat on a background.
 */
export default function Philosophy() {
  const ref = useRef();

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      /* Each word gets its own trigger rather than one staggered
         timeline: they should arrive as the reader reaches them, at the
         reader's pace, not all four the moment the section appears. */
      gsap.utils.toArray('[data-word]').forEach((word, i) => {
        const row = word.closest('[data-word-row]');
        const trigger = { trigger: row, start: 'top 88%', once: true };

        gsap.fromTo(
          word,
          { yPercent: 112, rotate: i % 2 ? 1.4 : -1.4 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.3,
            ease: 'expo.out',
            scrollTrigger: trigger,
          }
        );

        /* The note is a sibling of the word's mask, not a child of it. */
        const note = row?.querySelector('[data-note]');
        if (note) {
          gsap.fromTo(
            note,
            { opacity: 0, x: -14 },
            {
              opacity: 1,
              x: 0,
              duration: 1,
              delay: 0.25,
              ease: 'power3.out',
              scrollTrigger: trigger,
            }
          );
        }
      });
      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <Frame id="philosophy" className="ae-doctrine">
      <div className="ae-doctrine-grid" ref={ref}>
        <Orbits set="doctrine" className="ae-orbits--doctrine" />

        <ol className="ae-doctrine-list">
          {DOCTRINE.map((d, i) => (
            <li
              className={`ae-doctrine-row ae-doctrine-row--${i}`}
              key={d.word}
              data-word-row
            >
              <span className="ae-doctrine-mask">
                <span className="ae-display ae-doctrine-word" data-word>
                  {d.word}
                </span>
              </span>
              <span className="ae-doctrine-note ae-mono ae-dim" data-note>
                <i className="ae-node-dot" />
                {d.note}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Frame>
  );
}
