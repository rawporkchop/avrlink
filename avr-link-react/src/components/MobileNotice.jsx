import { useEffect, useRef, useState } from 'react';

// Small floating notice (phones only, via CSS) that drifts slightly with the pointer.
export default function MobileNotice() {
  const [dismissed, setDismissed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let targetX = 0, targetY = 0, curX = 0, curY = 0, raf = 0;

    const animate = () => {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      el.style.setProperty('--notice-x', `${curX.toFixed(2)}px`);
      el.style.setProperty('--notice-y', `${curY.toFixed(2)}px`);
      raf = requestAnimationFrame(animate);
    };
    const move = (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 10;
      targetY = (e.clientY / window.innerHeight - 0.5) * 7;
    };

    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
    };
  }, []);

  return (
    <div
      className={`mobile-desktop-notice${dismissed ? ' is-dismissed' : ''}`}
      id="mobileDesktopNotice"
      role="status"
      ref={ref}
    >
      <button className="mobile-desktop-notice-close" type="button" aria-label="Dismiss" onClick={() => setDismissed(true)}>×</button>
      <strong>More on desktop</strong>
      <p>Full simulator and more features are available on desktop.</p>
    </div>
  );
}
