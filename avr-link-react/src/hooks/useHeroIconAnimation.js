import { useEffect } from 'react';

// ---------------------------------------------------------------------------
// Drives the floating 3D app icon in the hero:
//   - turns toward the cursor
//   - sways/bobs with scroll velocity + a gentle idle motion
//   - starts as a "companion" beside the headline, settles into the background
//   - quietly "approaches" again around the middle of the page
// This is the original script, moved into a hook. It receives refs to the DOM
// nodes it animates and cleans up its listeners when the component unmounts.
// ---------------------------------------------------------------------------
const TUNING = {
  desktop: { maxSwayX: 1000, maxScrollY: 1000, idleBob: 2.5, idleSway: 0.8,
    companionOffsetX: 260, companionDipY: 34, companionScale: 1.18, companionOpacity: 0.55, restOpacity: 0.16,
    midApproachScale: 1.55, midApproachOpacity: 0.42 },
  tablet: { maxSwayX: 16, maxScrollY: 114, idleBob: 2.0, idleSway: 0.6,
    companionOffsetX: 130, companionDipY: 24, companionScale: 1.12, companionOpacity: 0.45, restOpacity: 0.16,
    midApproachScale: 1.32, midApproachOpacity: 0.36 },
  phone: { maxSwayX: 10, maxScrollY: 72, idleBob: 1.5, idleSway: 0.4,
    companionOffsetX: 60, companionDipY: 16, companionScale: 1.08, companionOpacity: 0.35, restOpacity: 0.16,
    midApproachScale: 1.18, midApproachOpacity: 0.30 },
};

const MID_APPROACH_IN_START = 0.38;
const MID_APPROACH_IN_END = 0.50;
const MID_APPROACH_HOLD_END = 0.80;
const MID_APPROACH_OUT_END = 0.94;
const COMPANION_SCROLL_RANGE_VH = 1.5;
const COMPANION_BACK_INTENSITY = 1.05;
const EASE_X_LAG = 0.010, EASE_X_RETURN = 0.045;
const EASE_Y_LAG = 0.063, EASE_Y_RETURN = 0.3225;
const IDLE_BOB_SPEED = 1.15, IDLE_SWAY_SPEED = 0.75;

const smoothStep = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
const easeToward = (pos, target, lag, ret) =>
  pos + (target - pos) * (Math.abs(target) > Math.abs(pos) ? lag : ret);

function companionRemaining(t) {
  const c1 = COMPANION_BACK_INTENSITY;
  const c2 = c1 * 1.525;
  const e = t < 0.5
    ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
    : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  return 1 - e; // 1 = companion pose, 0 = settled background
}

export function useHeroIconAnimation({ wrapRef, iconRef, frameRef, anchorRef }) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const icon = iconRef.current;
    const frame = frameRef.current;
    if (!wrap || !icon || !frame) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const currentTuning = () => {
      const w = window.innerWidth;
      return w <= 640 ? TUNING.phone : w <= 1024 ? TUNING.tablet : TUNING.desktop;
    };
    let tuning = currentTuning();
    let rect = wrap.getBoundingClientRect();

    // Total scroll range, captured at load (and on resize) so expanding the
    // model catalog later doesn't make the icon jump.
    const getMaxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    let midApproachMaxScroll = getMaxScroll();

    // Where the icon rests beside the headline, measured from the invisible anchor.
    let anchorOffsetX = 0;
    let usingAnchorOffset = false;
    const computeAnchorOffset = () => {
      const el = anchorRef.current;
      if (el && window.getComputedStyle(el).display !== 'none') {
        const r = el.getBoundingClientRect();
        anchorOffsetX = r.left + r.width / 2 - window.innerWidth / 2;
        usingAnchorOffset = true;
      } else {
        usingAnchorOffset = false;
      }
    };
    computeAnchorOffset();

    const onResize = () => {
      tuning = currentTuning();
      rect = wrap.getBoundingClientRect();
      midApproachMaxScroll = getMaxScroll();
      computeAnchorOffset();
    };
    window.addEventListener('resize', onResize);

    const midApproachAmount = () => {
      const p = Math.max(0, Math.min(1, window.scrollY / midApproachMaxScroll));
      if (p < MID_APPROACH_IN_START) return 0;
      if (p < MID_APPROACH_IN_END) return smoothStep((p - MID_APPROACH_IN_START) / (MID_APPROACH_IN_END - MID_APPROACH_IN_START));
      if (p <= MID_APPROACH_HOLD_END) return 1;
      if (p < MID_APPROACH_OUT_END) return 1 - smoothStep((p - MID_APPROACH_HOLD_END) / (MID_APPROACH_OUT_END - MID_APPROACH_HOLD_END));
      return 0;
    };

    // Cursor -> rotation target
    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    const onMouseMove = (e) => {
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
      targetY = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));
    };
    const onMouseLeave = () => { targetX = 0; targetY = 0; };
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    // Scroll velocity
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    const onScroll = () => {
      scrollVelocity = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let posX = 0, posY = 0, time = 0, lastFrameTime = null, raf = 0;

    function render(now) {
      if (lastFrameTime === null) lastFrameTime = now;
      const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
      lastFrameTime = now;
      time += dt;

      scrollVelocity *= 0.95;

      // Cursor side decides sway direction; scroll amount decides strength.
      const cursorDirection = targetX >= 0 ? -1 : 1;
      const cursorInfluence = Math.abs(targetX);
      const swayInfluence = 3;
      const targetSwayX = Math.max(-tuning.maxSwayX, Math.min(tuning.maxSwayX,
        Math.abs(scrollVelocity) * swayInfluence * cursorDirection * cursorInfluence));
      const targetScrollY = Math.max(-tuning.maxScrollY, Math.min(tuning.maxScrollY, scrollVelocity * -1.4));

      posX = easeToward(posX, targetSwayX, EASE_X_LAG, EASE_X_RETURN);
      posY = easeToward(posY, targetScrollY, EASE_Y_LAG, EASE_Y_RETURN);

      const idleBob = Math.sin(time * IDLE_BOB_SPEED) * tuning.idleBob;
      const idleSway = Math.sin(time * IDLE_SWAY_SPEED + 1.4) * tuning.idleSway;

      // Companion -> background transition
      const progress = Math.max(0, Math.min(1, window.scrollY / (window.innerHeight * COMPANION_SCROLL_RANGE_VH)));
      const r = companionRemaining(progress);
      const opacityRemaining = Math.pow(1 - progress, 3);

      const restX = usingAnchorOffset ? anchorOffsetX : tuning.companionOffsetX;
      const companionX = restX * r;
      const companionDip = tuning.companionDipY * r;
      let scaleAmt = 1 + (tuning.companionScale - 1) * r;
      let frameOpacity = tuning.restOpacity + (tuning.companionOpacity - tuning.restOpacity) * opacityRemaining;

      // Mid-page approach
      const mid = midApproachAmount();
      scaleAmt *= 1 + (tuning.midApproachScale - 1) * mid;
      frameOpacity += (tuning.midApproachOpacity - tuning.restOpacity) * mid;

      const finalX = posX + idleSway + companionX;
      const finalY = posY + idleBob + companionDip;

      wrap.style.transform = `translate3d(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px, 0) scale(${scaleAmt.toFixed(3)})`;
      frame.style.opacity = frameOpacity.toFixed(3);

      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      icon.style.transform =
        `perspective(2400px) rotateX(${(curY * -12).toFixed(2)}deg) rotateY(${(curX * 12).toFixed(2)}deg)`;

      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, [wrapRef, iconRef, frameRef, anchorRef]);
}
