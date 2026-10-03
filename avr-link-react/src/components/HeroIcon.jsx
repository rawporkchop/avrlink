import { createPortal } from 'react-dom';
import { useRef } from 'react';
import { useHeroIconAnimation } from '../hooks/useHeroIconAnimation';
import glyphUrl from '../assets/custom_hifireceiver_fill_badge_wifi.svg';

const STEP_PX = 10; // max spacing between slices so the stack never shows gaps

// Builds a stack of thin slices that together look like a solid slab.
// Each slice sits a bit further back (--z) and a bit darker (--b).
function sliceStack(thicknessPx) {
  const count = Math.max(2, Math.round(thicknessPx / STEP_PX) + 1);
  const slices = [];
  for (let i = count - 1; i >= 0; i--) {
    slices.push({
      isFront: i === 0,
      z: -(thicknessPx * i / (count - 1)),
      b: 1 - 0.92 * (i / (count - 1)),
    });
  }
  return slices;
}

const SLAB = sliceStack(80);
const GLYPH = sliceStack(40);

export default function HeroIcon({ anchorRef }) {
  const wrapRef = useRef(null);
  const frameRef = useRef(null);
  const iconRef = useRef(null);

  useHeroIconAnimation({ wrapRef, iconRef, frameRef, anchorRef });

  // Rendered through a portal straight into <body> so it can sit *behind*
  // every section (same trick the original script did with insertBefore).
  return createPortal(
    <div className="hero-icon-wrap" aria-hidden="true" ref={wrapRef}>
      <div className="hero-icon-frame" ref={frameRef}>
        <div className="hero-icon-parallax" ref={iconRef}>
          <div className="icon-layer icon-layer-bg">
            <div id="iconSlabMount">
              {SLAB.map((s, i) => (
                <div
                  key={i}
                  className={`icon-slab-slice${s.isFront ? ' icon-slab-front' : ''}`}
                  style={{ '--z': `${s.z.toFixed(2)}px`, '--b': s.b.toFixed(3) }}
                />
              ))}
            </div>
          </div>
          <div className="icon-layer icon-layer-glyph">
            {GLYPH.map((s, i) => (
              <img
                key={i}
                src={glyphUrl}
                alt=""
                className={`glyph-slice${s.isFront ? ' glyph-front' : ''}`}
                style={{ '--z': `${s.z.toFixed(2)}px`, '--b': s.b.toFixed(3) }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
