import { useRef } from 'react';
import HeroIcon from './HeroIcon';
import { APP_STORE_URL } from '../utils';

export default function Hero() {
  const anchorRef = useRef(null);

  return (
    <section className="hero-container">
      <HeroIcon anchorRef={anchorRef} />

      <div className="hero-text-column">
        <h1 className="hero-headline">
          <span className="phrase-part-1">Your AVR.</span>
          <span className="phrase-part-2">
            <span className="word-block word-moves">It follows</span>{' '}
            <span className="word-block word-seamlessly">
              <span className="seamlessly-inner">you.</span>
            </span>
          </span>
        </h1>
        <p className="hero-sub">
          Control your Denon or Marantz receiver from your Mac, iPhone, and Apple Watch without reaching for the remote.
        </p>
        <div className="cta-group">
          <a href="#simulator" className="btn btn-primary">Try the simulator</a>
          <span className="device-app-cta">
            <a className="btn btn-secondary app-store-cta" href={APP_STORE_URL} target="_blank" rel="noreferrer">
              View on the App Store
            </a>
            <a
              className="mac-app-cta"
              href="itms-apps://itunes.apple.com/us/app/id6807123807"
              aria-label="Download AVR Link on the Mac App Store"
            >
              <img
                src="https://tools.applemediaservices.com/api/badges/download-on-the-mac-app-store/black/en-us?size=250x83"
                alt="Download on the Mac App Store"
              />
            </a>
          </span>
        </div>
        <div className="platforms-strip">
          <div><span className="platform-pip" /> macOS Menu Bar</div>
          <div><span className="platform-pip" /> iOS Companion</div>
          <div><span className="platform-pip" /> watchOS Remote</div>
        </div>
      </div>

      <div className="hero-icon-anchor" aria-hidden="true" ref={anchorRef} />
    </section>
  );
}
