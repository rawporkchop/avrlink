import { Link } from 'react-router-dom';
import { usePageSetup } from '../hooks/usePageSetup';
import '../styles/doc.css';

// Shared shell for the light-themed Support and Privacy pages.
// `children` is whatever the page puts between the opening and closing tags.
export default function DocLayout({ title, active, children }) {
  usePageSetup({ title, theme: 'light' });

  return (
    <div className="doc-page">
      <div className="wrap">
        <header className="top">
          <Link className="mark" to="/">AVR<span>·</span>Link</Link>
          <nav>
            <Link to="/">Overview</Link>
            <Link to="/support" className={active === 'support' ? 'active' : ''}>Support</Link>
            <Link to="/privacy" className={active === 'privacy' ? 'active' : ''}>Privacy</Link>
          </nav>
        </header>

        {children}

        <footer>AVR Link — menu-bar app for macOS, with iOS and watchOS companions</footer>
      </div>
    </div>
  );
}
