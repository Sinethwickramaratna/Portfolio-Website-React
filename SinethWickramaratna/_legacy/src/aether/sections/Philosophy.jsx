import { useEffect, useRef } from 'react';
import Frame from '../ui/Frame';
import Orbits from '../ui/Orbits';
import { DOCTRINE } from '../config';
import { gsap } from '../ui/reveal';

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

    /* Each word arrives on its own, as the reader reaches it, rather
       than all four the moment the section appears.
       ----------------------------------------------------------------
       Observed rather than scroll-triggered, for the same reason as the
       reveals in `reveal.jsx`: these rows sit inside a `position:
       sticky` frame, and a scroll trigger measured against a sticky
       element can compute a start the reader never crosses — leaving
       the words parked behind their masks permanently. An observer
       reports actual overlap, so there is nothing to get wrong. */
    const words = Array.from(root.querySelectorAll('[data-word]'));
    const tweens = [];

    words.forEach((word, i) => {
      gsap.set(word, { yPercent: 112, rotate: i % 2 ? 1.4 : -1.4 });
      const row = word.closest('[data-word-row]');
      const note = row?.querySelector('[data-note]');
      if (note) gsap.set(note, { opacity: 0, x: -14 });
    });

    const observers = words.map((word) => {
      const row = word.closest('[data-word-row]') || word;
      const note = row.querySelector?.('[data-note]');
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io.disconnect();
          tweens.push(
            gsap.to(word, {
              yPercent: 0,
              rotate: 0,
              duration: 1.3,
              ease: 'expo.out',
            })
          );
          if (note) {
            tweens.push(
              gsap.to(note, {
                opacity: 1,
                x: 0,
                duration: 1,
                delay: 0.25,
                ease: 'power3.out',
              })
            );
          }
        },
        { rootMargin: '-18% 0px -18% 0px' }
      );
      io.observe(row);
      return io;
    });

    return () => {
      observers.forEach((io) => io.disconnect());
      tweens.forEach((t) => t.kill());
    };
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
