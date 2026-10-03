import { Link } from 'react-router-dom';
import { GITHUB_URL } from '../utils';

export default function Nav() {
  return (
    <nav className="site-nav">
      <Link to="/" className="nav-brand"><span>AVR Link</span></Link>
      <ul className="nav-links">
        <li><Link to="/support">Support</Link></li>
        <li><Link to="/privacy">Privacy</Link></li>
        <li><a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a></li>
      </ul>
    </nav>
  );
}
