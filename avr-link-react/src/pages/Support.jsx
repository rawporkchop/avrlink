import { Link } from 'react-router-dom';
import DocLayout from '../components/DocLayout';

export default function Support() {
  return (
    <DocLayout title="Support — AVR Link" active="support">
      <h1>Support</h1>
      <div className="subtitle">Help with AVR Link for macOS, iOS, and watchOS</div>

      <h2>Frequently asked</h2>
      <div className="faq-grid">
        <div className="faq-card">
          <p className="q">Does AVR Link collect any of my data?</p>
          <p className="a">No. AVR Link has no server and doesn't transmit any data to us. The app only talks to your own receiver over your local network, and to your own paired Apple devices. See the full <Link to="/privacy">privacy policy</Link> for details.</p>
        </div>

        <div className="faq-card">
          <p className="q">Which receivers does AVR Link support?</p>
          <p className="a">AV receivers that support the local-network control protocol (telnet on TCP 23) — the same protocol these brands use for their own network control features.</p>
        </div>

        <div className="faq-card">
          <p className="q">AVR Link can't discover my receiver — what should I check?</p>
          <p className="a">Confirm your device and receiver are on the same Wi-Fi/LAN, and that <strong>Network Standby</strong> is turned on in the receiver's own network settings — this is required for the receiver to respond while powered off. You can also try adding it manually by IP address from the Discovery screen. If it still won't connect, reach out below with your receiver's model number.</p>
        </div>

        <div className="faq-card">
          <p className="q">Why can't my Apple Watch control the receiver directly?</p>
          <p className="a">watchOS doesn't allow apps to do local-network discovery or open raw network connections. The Watch app relays every command through your paired iPhone instead, so the iPhone app needs to be installed and reachable (though it can be backgrounded) for the Watch app to work.</p>
        </div>

        <div className="faq-card">
          <p className="q">My widgets or Live Activity show stale/incorrect status.</p>
          <p className="a">Widgets, Control Center controls, and Live Activities all read a status snapshot shared between the app and its extensions via an App Group container. If this ever looks out of sync, try reopening the main app briefly to force a refresh, or removing and re-adding the widget.</p>
        </div>

        <div className="faq-card">
          <p className="q">How do I use the iPhone's volume buttons to control the receiver?</p>
          <p className="a">This is opt-in — enable "Volume-button remote" in Settings. It's off by default since it keeps a silent audio session active to capture button presses. There's also an experimental option to keep this working briefly after the app leaves the foreground.</p>
        </div>
      </div>

      <h2>Get in touch</h2>
      <div className="contact-box">
        <div className="contact-row">
          <span className="contact-label">Email</span>
          <a href="mailto:avr.linked@gmail.com">avr.linked@gmail.com</a>
        </div>
        <div className="contact-row">
          <span className="contact-label">GitHub Issues</span>
          <a href="https://github.com/rawporkchop/AVR-Link/issues" target="_blank" rel="noreferrer">github.com/rawporkchop/AVR-Link</a>
        </div>
      </div>
    </DocLayout>
  );
}
