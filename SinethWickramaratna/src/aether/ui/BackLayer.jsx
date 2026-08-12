import Orbits from './Orbits';
import { STATION_INDEX } from '../config';

/**
 * The eclipsed layer.
 *
 * Everything here is painted *underneath* the canvas, so the 3D objects
 * pass in front of it. It is the single most important structural
 * decision on the site: without it every composition would be type with
 * a graphic behind it, and with it the world and the words occupy the
 * same space.
 *
 * It has to be a fixed layer rather than markup inside each section,
 * because a sticky element establishes its own stacking context and
 * would trap its children above the canvas. The sections it serves are
 * pinned to the viewport for their whole duration anyway, so a fixed
 * layer lands in exactly the same place — it just does so from outside
 * the document's stacking order.
 *
 * Each group is keyed to a station and cross-fades as the flight
 * arrives, which is also what gives the display type its entrance.
 */
export default function BackLayer({ active }) {
  const on = (id) => (active === STATION_INDEX[id] ? ' is-on' : '');

  return (
    <div className="ae-back" aria-hidden="true">
      <div className={`ae-back-group ae-back-hero${on('hero')}`}>
        <Orbits set="hero" className="ae-orbits--hero" />
        <span className="ae-hero-first">SINETH</span>
      </div>

      <div className={`ae-back-group ae-back-profile${on('profile')}`}>
        <Orbits set="profile" className="ae-orbits--profile" />
        <span className="ae-ghost">PROFILE</span>
      </div>

      <div className={`ae-back-group ae-back-skills${on('skills')}`}>
        <span className="ae-skills-core">
          <b>DATA</b>
          <b>INTELLIGENCE</b>
        </span>
      </div>

      <div className={`ae-back-group ae-back-contact${on('contact')}`}>
        <span className="ae-contact-head">
          <b>LET&rsquo;S</b>
          <b>BUILD</b>
          <b>WHAT&rsquo;S</b>
          <b>NEXT.</b>
        </span>
      </div>
    </div>
  );
}
