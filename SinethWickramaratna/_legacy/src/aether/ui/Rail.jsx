import { RAIL, STATION_INDEX, STATIONS } from '../config';
import { scrollToStation } from '../state/flight';

/**
 * The navigation rail.
 *
 * A column of hairlines down the right margin — no labels until you
 * reach for it, no background, no panel. It reports position more than
 * it offers navigation, which is the correct emphasis for a site that
 * is meant to be travelled in order.
 *
 * The four project stations collapse into one mark: they are one body
 * of work, and four ticks in a row would break the rhythm of the rail.
 */
export default function Rail({ active }) {
  const activeGroup = STATIONS[active]?.group;

  return (
    <nav className="ae-rail" aria-label="Sections">
      {RAIL.map((item) => {
        const isOn = STATIONS[STATION_INDEX[item.id]].group === activeGroup;
        return (
          <button
            type="button"
            key={item.id}
            className={`ae-rail-item${isOn ? ' is-on' : ''}`}
            onClick={() => scrollToStation(item.id)}
          >
            <span className="ae-rail-label ae-mono">{item.label}</span>
            <span className="ae-rail-mark ae-mono">{item.mark}</span>
            <span className="ae-rail-tick" />
          </button>
        );
      })}
    </nav>
  );
}
