import { Link } from 'react-router-dom';
import { GITHUB_URL } from '../utils';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>&copy; AVR Link. All rights reserved.</div>
      <div className="footer-links">
        <Link to="/support">Support</Link>
        <Link to="/privacy">Privacy Policy</Link>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </footer>
  );
}
