import { useRef, useState } from 'react';
import { APP_STORE_URL, asset } from '../utils';

const SIM_URL = asset('web_preview.html');

export default function Simulator() {
  const [hidden, setHidden] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const last = useRef({ x: 0, y: 0 });

  const openFullscreen = () => window.open(SIM_URL, '_blank', 'noopener');

  // Drag the window by its title bar. A transform moves it visually while its
  // original layout box stays put, so the page never collapses around it.
  const onPointerDown = (e) => {
    if (e.target.closest('.simulator-window-control')) return;
    setDragging(true);
    last.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
  };
  const stopDragging = (e) => {
    if (!dragging) return;
    setDragging(false);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already released */ }
  };

  const classes = ['simulator-frame-container'];
  if (hidden) classes.push('is-hidden');
  if (dragging) classes.push('is-dragging');

  return (
    <section className="simulator-wrapper" id="simulator">
      <div className="simulator-section-inner">
        <div
          className={classes.join(' ')}
          style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
        >
          <div
            className="simulator-header-bar"
            style={dragging ? { cursor: 'grabbing' } : undefined}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
          >
            <div className="simulator-window-controls" role="group" aria-label="Simulator window controls">
              <button className="simulator-window-control close" type="button" aria-label="Close simulator" onClick={() => setHidden(true)} />
              <button className="simulator-window-control minimize" type="button" aria-label="Minimize simulator" onClick={() => setHidden(true)} />
              <button className="simulator-window-control maximize" type="button" aria-label="Open simulator fullscreen" onClick={openFullscreen} />
            </div>
            <span>AVR Link Simulator</span>
          </div>
          <iframe className="simulator-iframe" src={SIM_URL} title="AVR Link Web Simulator" loading="eager" />
          <div className="simulator-footer-bar">
            <span>Direct preview mode</span>
            <a href={SIM_URL} target="_blank" rel="noreferrer">Open fullscreen ↗</a>
          </div>
        </div>

        <aside className="simulator-guide">
          <span className="simulator-eyebrow">TRY IT YOURSELF</span>
          <h2 className="simulator-guide-title">Control your receiver.</h2>
          <p className="simulator-guide-intro">
            This is the same interface you’ll use in AVR Link. Take a moment to explore it.
          </p>

          <ol className="simulator-steps">
            <li>
              <span className="simulator-step-number">01</span>
              <div><strong>Choose an input</strong><p>Switch between your receiver’s available sources.</p></div>
            </li>
            <li>
              <span className="simulator-step-number">02</span>
              <div><strong>Adjust the volume</strong><p>Try the volume controls and see how the interface responds.</p></div>
            </li>
            <li>
              <span className="simulator-step-number">03</span>
              <div><strong>Explore the controls</strong><p>Look around the interface and discover what’s available.</p></div>
            </li>
          </ol>

          <div className="simulator-guide-cta">
            <p>Like what you see?</p>
            <a href={APP_STORE_URL} className="btn btn-primary" target="_blank" rel="noreferrer">
              Download AVR Link <span aria-hidden="true">↗</span>
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
