import { FADE_WINDOW, sectionT } from '../worldConfig';

/**
 * A DOM panel bound to one environment.
 *
 * Visibility is computed in pure CSS from `--t` (the flight position,
 * published once per frame on <html>) and `--st` (this panel's own stop).
 * No JavaScript runs per panel per frame — see synthesis.css.
 *
 * `active` is the one discrete piece of state React does own: only the
 * nearest panel is focusable and hit-testable, so the invisible ones
 * never swallow clicks meant for the world behind them.
 */
export default function Overlay({
  index,
  active,
  window: fadeWindow = FADE_WINDOW,
  align = 'center',
  className = '',
  children,
}) {
  return (
    <section
      className={`overlay overlay--${align} ${active ? 'is-active' : ''} ${className}`}
      style={{ '--st': sectionT(index), '--w': fadeWindow }}
      aria-hidden={active ? undefined : 'true'}
      inert={active ? undefined : true}
    >
      <div className="overlay__inner">{children}</div>
    </section>
  );
}
