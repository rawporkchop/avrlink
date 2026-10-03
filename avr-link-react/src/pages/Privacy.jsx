import { Link } from 'react-router-dom';
import DocLayout from '../components/DocLayout';

export default function Privacy() {
  return (
    <DocLayout title="Privacy Policy — AVR Link" active="privacy">
      <h1>Privacy Policy</h1>
      <div className="updated">Last updated: July 7, 2026</div>

      <p className="lede">AVR Link does not collect, transmit, or share any personal data. The app talks only to your own AV receiver on your local network, and to your own paired devices — nothing goes further than that.</p>

      <div className="card-block">
        <h3>What we collect</h3>
        <p>Nothing. AVR Link has no server, no account system, and no analytics. We — the developer — never receive any information about you, your receiver, or how you use the app.</p>
      </div>

      <div className="card-block">
        <h3>What the app connects to</h3>
        <p>AVR Link's whole purpose is talking to hardware you own, over a network you control. Specifically:</p>
        <ul>
          <li><strong>Your AV receiver</strong> — the macOS, iOS, and watchOS apps discover and control your receiver directly over your local network. This traffic stays on your LAN and never reaches us.</li>
          <li><strong>Your other Apple devices</strong> — the Apple Watch app relays commands through your paired iPhone using Apple's WatchConnectivity framework, and the iPhone ecosystem shares status through a private App Group container. Both are completely local mechanisms.</li>
        </ul>
      </div>

      <div className="card-block">
        <h3>Local storage</h3>
        <p>The app caches certain data — such as known receivers, per-zone volume limits, and display preferences — directly on your device(s). This data never leaves your network and is completely cleared if you remove the application.</p>
      </div>

      <div className="card-block">
        <h3>Contact</h3>
        <p>Questions about this policy or how the app works? Reach out at
          <a href="mailto:avr.linked@gmail.com">avr.linked@gmail.com</a>
          or open an issue on
          <a href="https://github.com/rawporkchop/AVR-Link/issues" target="_blank" rel="noreferrer">GitHub</a>.
        </p>
      </div>
    </DocLayout>
  );
}
