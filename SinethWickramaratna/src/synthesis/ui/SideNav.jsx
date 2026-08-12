import { SECTIONS } from '../worldConfig';
import { travelTo, useActiveSection } from '../state/worldState';

/**
 * The navigation is a column of numbers.
 *
 * Labels are revealed on hover and focus rather than shown permanently,
 * so the chrome of the site stays out of the way of the world. The
 * numbers remain because they double as a progress indicator — you can
 * always see how far into the journey you are.
 */
export default function SideNav() {
  const active = useActiveSection();

  return (
    <nav className="side-nav" aria-label="Environments">
      <ol className="side-nav__list">
        {SECTIONS.map((section) => {
          const isActive = active === section.index;
          return (
            <li key={section.id}>
              <button
                type="button"
                className={`side-nav__item ${isActive ? 'is-active' : ''}`}
                onClick={() => travelTo(section.index)}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className="side-nav__num">{section.number}</span>
                <span className="side-nav__label">{section.label}</span>
                <span className="side-nav__rule" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
