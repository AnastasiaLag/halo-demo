'use client';
import { useRef, useCallback, useEffect } from 'react';
import { AnalyticsPeriod } from '@/lib/data';

interface Props {
  open: boolean;
  onClose: () => void;
  period: string;
  data: AnalyticsPeriod;
}

function heatColor(count: number): string {
  if (count === 0) return 'rgba(28,124,69,.22)';
  if (count <= 2)  return 'rgba(196,122,10,.40)';
  if (count <= 5)  return 'rgba(194,59,43,.38)';
  if (count <= 12) return 'rgba(194,59,43,.58)';
  return 'rgba(194,59,43,.78)';
}

const FULL_ZONES = [
  { name: 'Block A',    s: { left: 40, top: 50, width: 200, height: 130 } },
  { name: 'Block B',    s: { left: 270, top: 50, width: 150, height: 110 } },
  { name: 'Block C',    s: { left: 40, top: 220, width: 300, height: 110 } },
  { name: 'Warehouse',  s: { left: 440, top: 190, width: 180, height: 140 } },
  { name: 'Access Road',s: { left: 40, top: 360, width: 580, height: 50 } },
];

export default function HeatmapOverlay({ open, onClose, period, data }: Props) {
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
    if (open) { scale.current = 1; tx.current = 20; ty.current = 20; applyTransform(); }
  }, [open, applyTransform]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onMD = (e: MouseEvent) => { dragging.current = true; startX.current = e.clientX; startY.current = e.clientY; origX.current = tx.current; origY.current = ty.current; canvasRef.current?.classList.add('grabbing'); };
    const onMM = (e: MouseEvent) => { if (!dragging.current) return; tx.current = origX.current + (e.clientX - startX.current); ty.current = origY.current + (e.clientY - startY.current); applyTransform(); };
    const onMU = () => { dragging.current = false; canvasRef.current?.classList.remove('grabbing'); };
    const onTS = (e: TouchEvent) => { if (e.touches.length === 1) { dragging.current = true; startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY; origX.current = tx.current; origY.current = ty.current; } else if (e.touches.length === 2) { dragging.current = false; lastTouchDist.current = Math.hypot(e.touches[1].clientX - e.touches[0].clientX, e.touches[1].clientY - e.touches[0].clientY); } };
    const onTM = (e: TouchEvent) => { e.preventDefault(); if (e.touches.length === 1 && dragging.current) { tx.current = origX.current + (e.touches[0].clientX - startX.current); ty.current = origY.current + (e.touches[0].clientY - startY.current); applyTransform(); } else if (e.touches.length === 2 && lastTouchDist.current) { const d = Math.hypot(e.touches[1].clientX - e.touches[0].clientX, e.touches[1].clientY - e.touches[0].clientY); scale.current = Math.min(3, Math.max(0.4, scale.current * (d / lastTouchDist.current))); lastTouchDist.current = d; applyTransform(); } };
    const onTE = () => { dragging.current = false; lastTouchDist.current = null; };
    const onW = (e: WheelEvent) => { e.preventDefault(); const f = e.deltaY < 0 ? 1.1 : 0.9; const r = vp.getBoundingClientRect(); const cx = e.clientX - r.left; const cy = e.clientY - r.top; tx.current = cx - (cx - tx.current) * f; ty.current = cy - (cy - ty.current) * f; scale.current = Math.min(3, Math.max(0.4, scale.current * f)); applyTransform(); };
    vp.addEventListener('mousedown', onMD); window.addEventListener('mousemove', onMM); window.addEventListener('mouseup', onMU);
    vp.addEventListener('touchstart', onTS, { passive: true }); vp.addEventListener('touchmove', onTM, { passive: false }); vp.addEventListener('touchend', onTE);
    vp.addEventListener('wheel', onW, { passive: false });
    return () => { vp.removeEventListener('mousedown', onMD); window.removeEventListener('mousemove', onMM); window.removeEventListener('mouseup', onMU); vp.removeEventListener('touchstart', onTS); vp.removeEventListener('touchmove', onTM); vp.removeEventListener('touchend', onTE); vp.removeEventListener('wheel', onW); };
  }, [applyTransform]);

  return (
    <div className={`an-heat-overlay${open ? ' open' : ''}`}>
      <div className="an-heat-overlay-bar">
        <div>
          <div className="map-overlay-title">Incident Heatmap</div>
          <div className="map-overlay-sub">{period}</div>
        </div>
        <button className="map-close-btn" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="2" y1="2" x2="12" y2="12" stroke="#111110" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="2" x2="2" y2="12" stroke="#111110" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div className="map-viewport" ref={viewportRef} style={{ flex: 1 }}>
        <div className="an-heat-canvas" ref={canvasRef} style={{ transform: 'translate(20px,20px) scale(1)' }}>
          {FULL_ZONES.map(z => (
            <div key={z.name} style={{ position: 'absolute', borderRadius: 4, ...z.s, background: heatColor(data.heatmap[z.name] || 0) }}>
              <span style={{ position: 'absolute', bottom: 6, left: 7, fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, fontWeight: 500, letterSpacing: '.5px', textTransform: 'uppercase', color: 'rgba(60,56,46,.85)' }}>{z.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="map-zoom-controls">
        <button className="zoom-btn" onClick={() => zoom(1.25)}>+</button>
        <button className="zoom-btn" onClick={() => zoom(0.8)}>−</button>
      </div>
      <div className="map-legend-ov" style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
        <span className="heat-legend-label">Safe</span>
        <div className="heat-legend-bar" style={{ width: 120, flex: 'unset' }}></div>
        <span className="heat-legend-label">High Risk</span>
      </div>
    </div>
  );
}
