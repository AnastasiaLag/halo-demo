'use client';
import { useRef, useCallback, useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MapOverlay({ open, onClose }: Props) {
  const scale = useRef(1);
  const tx = useRef(20);
  const ty = useRef(20);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const origX = useRef(0);
  const origY = useRef(0);
  const lastTouchDist = useRef<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const applyTransform = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.style.transform = `translate(${tx.current}px,${ty.current}px) scale(${scale.current})`;
    }
  }, []);

  const zoom = useCallback((factor: number) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const cx = vp.offsetWidth / 2;
    const cy = vp.offsetHeight / 2;
    tx.current = cx - (cx - tx.current) * factor;
    ty.current = cy - (cy - ty.current) * factor;
    scale.current = Math.min(3, Math.max(0.4, scale.current * factor));
    applyTransform();
  }, [applyTransform]);

  useEffect(() => {
    if (open) {
      scale.current = 1; tx.current = 20; ty.current = 20; applyTransform();
    }
  }, [open, applyTransform]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onMouseDown = (e: MouseEvent) => {
      dragging.current = true;
      startX.current = e.clientX; startY.current = e.clientY;
      origX.current = tx.current; origY.current = ty.current;
      canvasRef.current?.classList.add('grabbing');
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      tx.current = origX.current + (e.clientX - startX.current);
      ty.current = origY.current + (e.clientY - startY.current);
      applyTransform();
    };
    const onMouseUp = () => { dragging.current = false; canvasRef.current?.classList.remove('grabbing'); };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        dragging.current = true;
        startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY;
        origX.current = tx.current; origY.current = ty.current;
      } else if (e.touches.length === 2) {
        dragging.current = false;
        lastTouchDist.current = Math.hypot(e.touches[1].clientX - e.touches[0].clientX, e.touches[1].clientY - e.touches[0].clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1 && dragging.current) {
        tx.current = origX.current + (e.touches[0].clientX - startX.current);
        ty.current = origY.current + (e.touches[0].clientY - startY.current);
        applyTransform();
      } else if (e.touches.length === 2 && lastTouchDist.current) {
        const d = Math.hypot(e.touches[1].clientX - e.touches[0].clientX, e.touches[1].clientY - e.touches[0].clientY);
        scale.current = Math.min(3, Math.max(0.4, scale.current * (d / lastTouchDist.current)));
        lastTouchDist.current = d;
        applyTransform();
      }
    };
    const onTouchEnd = () => { dragging.current = false; lastTouchDist.current = null; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const f = e.deltaY < 0 ? 1.1 : 0.9;
      const r = vp.getBoundingClientRect();
      const cx = e.clientX - r.left; const cy = e.clientY - r.top;
      tx.current = cx - (cx - tx.current) * f;
      ty.current = cy - (cy - ty.current) * f;
      scale.current = Math.min(3, Math.max(0.4, scale.current * f));
      applyTransform();
    };

    vp.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    vp.addEventListener('touchstart', onTouchStart, { passive: true });
    vp.addEventListener('touchmove', onTouchMove, { passive: false });
    vp.addEventListener('touchend', onTouchEnd);
    vp.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      vp.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      vp.removeEventListener('touchstart', onTouchStart);
      vp.removeEventListener('touchmove', onTouchMove);
      vp.removeEventListener('touchend', onTouchEnd);
      vp.removeEventListener('wheel', onWheel);
    };
  }, [applyTransform]);

  return (
    <div className={`map-overlay${open ? ' open' : ''}`}>
      <div className="map-overlay-bar">
        <div>
          <div className="map-overlay-title">Site Blueprint</div>
          <div className="map-overlay-sub"><div className="live-dot"></div>Live · 8 workers tracked</div>
        </div>
        <button className="map-close-btn" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="2" y1="2" x2="12" y2="12" stroke="#111110" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="2" x2="2" y2="12" stroke="#111110" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div className="map-viewport" ref={viewportRef}>
        <div className="map-canvas" ref={canvasRef} style={{ transform: `translate(20px,20px) scale(1)` }}>
          <div className="zone zone-fill" style={{ left: 40, top: 50, width: 200, height: 130 }}><span className="zone-label">Block A</span></div>
          <div className="zone zone-fill" style={{ left: 270, top: 50, width: 150, height: 110 }}><span className="zone-label">Block B</span></div>
          <div className="zone zone-fill" style={{ left: 40, top: 290, width: 300, height: 110 }}><span className="zone-label">Block C</span></div>
          <div className="zone zone-fill" style={{ left: 440, top: 190, width: 180, height: 140 }}><span className="zone-label">Warehouse</span></div>
          <div className="zone zone-fill" style={{ left: 270, top: 180, width: 140, height: 100 }}><span className="zone-label">Block D</span></div>
          <div className="zone zone-outline" style={{ left: 40, top: 410, width: 580, height: 50 }}><span className="zone-label">Access Road</span></div>
          <div className="zone zone-outline" style={{ left: 460, top: 50, width: 160, height: 120 }}><span className="zone-label">Staging Area</span></div>
          {[
            { cls: 'ok', left: 70, top: 80, tt: '#001 G. Pappas' },
            { cls: 'ok', left: 160, top: 110, tt: '#002 K. Nakos' },
            { cls: 'ok', left: 300, top: 70, tt: '#004 M. Lekkas' },
            { cls: 'ok', left: 480, top: 210, tt: '#005 S. Dimos' },
            { cls: 'ok', left: 90, top: 255, tt: '#006 P. Athinos' },
            { cls: 'ok', left: 550, top: 280, tt: '#008 V. Chronis' },
            { cls: 'warn', left: 230, top: 240, tt: '#009 A. Tsiotis — CO₂↑' },
            { cls: 'crit', left: 340, top: 270, tt: '#003 N. Katsis — FALL' },
          ].map((w, i) => (
            <div key={i} className={`wdot-wrap ${w.cls}`} style={{ left: w.left, top: w.top }}>
              <div className="wdot-ring"></div>
              <div className="wdot"></div>
              <div className="wdot-tt">{w.tt}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="map-zoom-controls">
        <button className="zoom-btn" onClick={() => zoom(1.25)}>+</button>
        <button className="zoom-btn" onClick={() => zoom(0.8)}>−</button>
      </div>
      <div className="map-legend-ov">
        <div className="leg"><div className="leg-d" style={{ background: 'var(--green)' }}></div>Normal</div>
        <div className="leg"><div className="leg-d" style={{ background: 'var(--amber)' }}></div>Warning</div>
        <div className="leg"><div className="leg-d" style={{ background: 'var(--red)' }}></div>Critical</div>
      </div>
    </div>
  );
}
