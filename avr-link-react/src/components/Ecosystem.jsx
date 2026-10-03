import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import macImg from '../assets/images/mac.jpg';
import iphoneImg from '../assets/images/iphone.jpg';
import ipadImg from '../assets/images/ipad.jpg';

// One device card. Its height follows the image's own aspect ratio
// (set once the image loads), exactly like the original script did.
function DeviceCard({ className, tag, title, text, src, alt, cardRef }) {
  const [ratio, setRatio] = useState(null);

  return (
    <article
      className={`ecosystem-card ${className}`}
      ref={cardRef}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <div className="ecosystem-card-copy">
        <span className="card-platform-tag">{tag}</span>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <img
        className="ecosystem-device-image"
        src={src}
        alt={alt}
        onLoad={(e) => setRatio(`${e.target.naturalWidth} / ${e.target.naturalHeight}`)}
      />
    </article>
  );
}

export default function Ecosystem() {
  const iphoneRef = useRef(null);
  const ipadRef = useRef(null);
  // Extra height (px) under each secondary card so both columns end level.
  const [fillers, setFillers] = useState([0, 0]);

  useLayoutEffect(() => {
    const cards = [iphoneRef.current, ipadRef.current];
    if (cards.some((c) => !c)) return;

    const sync = () => {
      const heights = cards.map((c) => c.getBoundingClientRect().height);
      const max = Math.max(...heights);
      setFillers(heights.map((h) => (max - h >= 1 ? max - h : 0)));
    };

    sync();
    // Re-measure whenever either card changes size (image load, window resize).
    const ro = new ResizeObserver(sync);
    cards.forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, []);

  return (
    <section className="ecosystem-section" id="ecosystem">
      <div className="section-header">
        <h2 className="section-title">One receiver.<br />Every screen.</h2>
        <p className="ecosystem-intro">Your theater follows you across the Apple devices you already use.</p>
      </div>

      <div className="ecosystem-showcase">
        <DeviceCard
          className="mac"
          tag="macOS"
          title="Full control from your desktop."
          text="Keep your receiver within reach from the menu bar, with fast volume control and a native desktop experience."
          src={macImg}
          alt="AVR Link on Mac"
        />

        <div className="ecosystem-secondary">
          <div className="ecosystem-card-column">
            <DeviceCard
              className="secondary iphone"
              tag="iPhone"
              title="Your remote, wherever you are."
              text="Bring complete receiver control with you, from the room to the couch."
              src={iphoneImg}
              alt="AVR Link on iPhone"
              cardRef={iphoneRef}
            />
            {fillers[0] > 0 && <div className="ecosystem-filler" style={{ height: fillers[0] }} />}
          </div>
          <div className="ecosystem-card-column">
            <DeviceCard
              className="secondary ipad"
              tag="iPad"
              title="More room. More control."
              text="A larger canvas for your theater, with the same familiar AVR Link controls."
              src={ipadImg}
              alt="AVR Link on iPad"
              cardRef={ipadRef}
            />
            {fillers[1] > 0 && <div className="ecosystem-filler" style={{ height: fillers[1] }} />}
          </div>
        </div>
      </div>
    </section>
  );
}
