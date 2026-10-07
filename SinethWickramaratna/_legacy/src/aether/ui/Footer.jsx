import { LINKS } from '../config';

/**
 * The sign-off.
 *
 * One line. After the portal there is nothing left to say, and a full
 * sitemap here would undo the ending. The status light is the only
 * moving thing.
 */
export default function Footer() {
  return (
    <footer className="ae-footer">
      <div className="ae-footer-in">
        <span className="ae-footer-name">SINETH WICKRAMARATNA</span>
        <span className="ae-mono ae-dim">DATA SCIENCE ENGINEER</span>

        <nav className="ae-footer-links">
          {LINKS.map((l) => (
            <a key={l.key} href={l.href} target="_blank" rel="noreferrer" className="ae-mono">
              {l.key}
            </a>
          ))}
        </nav>

        <span className="ae-footer-status">
          <span className="ae-mono ae-dim">SYSTEM STATUS</span>
          <span className="ae-mono ae-accent">
            <i className="ae-pulse" />
            ONLINE
          </span>
        </span>

        <span className="ae-mono ae-dim">2026</span>
      </div>
    </footer>
  );
}
