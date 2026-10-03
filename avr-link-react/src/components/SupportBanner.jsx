import { Link } from 'react-router-dom';
import { APP_STORE_URL } from '../utils';

export default function SupportBanner() {
  return (
    <section className="support-section" id="support">
      <div className="support-text">
        <h2>Built by one person. Runs on all your Apple devices.</h2>
        <p>
          Need help or have questions? Visit our <Link to="/support">support page</Link> or check our{' '}
          <Link to="/privacy">privacy policy</Link>.
        </p>
      </div>
      <div className="cta-group" style={{ marginBottom: 0 }}>
        <Link to="/support" className="btn btn-primary">Get support</Link>
        <a href={APP_STORE_URL} className="btn btn-secondary" target="_blank" rel="noreferrer">View on the App Store</a>
      </div>
    </section>
  );
}
