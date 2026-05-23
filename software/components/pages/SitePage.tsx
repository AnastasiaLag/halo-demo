'use client';
import { useEffect, useRef } from 'react';

interface Props {
  onOpenMap: () => void;
}

const WDOTS = [
  { cls: 'ok',   left: 28,  top: 26,  tt: '#001 G. Pappas' },
  { cls: 'ok',   left: 78,  top: 38,  tt: '#002 K. Nakos' },
  { cls: 'ok',   left: 162, top: 22,  tt: '#004 M. Lekkas' },
  { cls: 'ok',   left: 254, top: 96,  tt: '#005 S. Dimos' },
  { cls: 'ok',   left: 42,  top: 112, tt: '#006 P. Athinos' },
  { cls: 'ok',   left: 294, top: 124, tt: '#008 V. Chronis' },
  { cls: 'warn', left: 116, top: 104, tt: '#009 A. Tsiotis — CO₂↑' },
  { cls: 'crit', left: 192, top: 124, tt: '#003 N. Katsis — FALL' },
];

const EQ_ROWS = [
  { id: '003', name: 'N. Katsis',   note: 'Fall detected — man-down 08:44', noteColor: 'var(--red)', dotColor: 'var(--red)', dotAnim: true, chipClass: 'chip-crit', chipLabel: 'Alert', batt: 61, battColor: 'var(--amber)' },
  { id: '009', name: 'A. Tsiotis',  note: 'CO₂ 1240 ppm — limit exceeded',  noteColor: 'var(--amber)', dotColor: 'var(--amber)', dotAnim: false, chipClass: 'chip-warn', chipLabel: 'Warn', batt: 44, battColor: 'var(--amber)' },
  { id: '001', name: 'G. Pappas',   note: 'Zone A · All sensors normal',    noteColor: 'var(--muted)', dotColor: 'var(--green)', dotAnim: false, chipClass: 'chip-ok', chipLabel: 'Online', batt: 82, battColor: 'var(--green)' },
  { id: '004', name: 'M. Lekkas',   note: 'Zone B · All sensors normal',    noteColor: 'var(--muted)', dotColor: 'var(--green)', dotAnim: false, chipClass: 'chip-ok', chipLabel: 'Online', batt: 76, battColor: 'var(--green)' },
  { id: '005', name: 'S. Dimos',    note: 'Zone C · All sensors normal',    noteColor: 'var(--muted)', dotColor: 'var(--green)', dotAnim: false, chipClass: 'chip-ok', chipLabel: 'Online', batt: 95, battColor: 'var(--green)' },
  { id: '006', name: 'P. Athinos',  note: 'Zone C · All sensors normal',    noteColor: 'var(--muted)', dotColor: 'var(--green)', dotAnim: false, chipClass: 'chip-ok', chipLabel: 'Online', batt: 72, battColor: 'var(--green)' },
  { id: '008', name: 'V. Chronis',  note: 'Warehouse · All sensors normal', noteColor: 'var(--muted)', dotColor: 'var(--green)', dotAnim: false, chipClass: 'chip-ok', chipLabel: 'Online', batt: 58, battColor: 'var(--amber)' },
  { id: '007', name: 'Unassigned',  note: 'No worker paired this shift',    noteColor: 'var(--muted)', dotColor: 'var(--muted)', dotAnim: false, chipClass: 'chip-off', chipLabel: 'Offline', batt: null, battColor: '' },
];

export default function SitePage({ onOpenMap }: Props) {
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const el = ringRef.current;
    if (!el) return;
    const c = 2 * Math.PI * 31.5;
    el.style.strokeDasharray = String(c);
    el.style.strokeDashoffset = String(c);
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1) .3s';
      el.style.strokeDashoffset = String(c * 0.06);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="page active" id="pageSite">
      <div className="content">
        {/* Tiles */}
        <div className="tiles-row">
          <div className="tile">
            <div className="tile-num">12</div>
            <div className="tile-label">Active Workers</div>
          </div>
          <div className="tile">
            <div className="tile-num" style={{ color: 'var(--red)' }}>1</div>
            <div className="tile-label">Active Alert</div>
          </div>
          <div className="tile">
            <div className="tile-num">11<span style={{ fontSize: 13, color: 'var(--muted)' }}>/12</span></div>
            <div className="tile-label">Modules Online</div>
          </div>
        </div>

        {/* Score card */}
        <div className="score-card">
          <div className="score-ring-wrap">
            <svg viewBox="0 0 72 72">
              <circle className="ring-track" cx="36" cy="36" r="31.5"/>
              <circle className="ring-fill" ref={ringRef} cx="36" cy="36" r="31.5"/>
            </svg>
            <div className="score-inner">
              <div className="score-num">94</div>
              <div className="score-denom">/100</div>
            </div>
          </div>
          <div className="score-info">
            <div className="score-title">Weekly Safety Score</div>
            <div className="score-sub">Based on fall events, gas exposure &amp; ergonomic posture</div>
            <div className="score-week">▲ +2 vs last week</div>
          </div>
        </div>

        {/* Map card */}
        <div className="map-card">
          <div className="map-header">
            <div className="map-title">Site Blueprint</div>
            <div className="live-badge"><div className="live-dot"></div>Live</div>
          </div>
          <div className="blueprint">
            <div className="zone zone-fill" style={{ left: 14, top: 14, width: 118, height: 60 }}><span className="zone-label">Block A</span></div>
            <div className="zone zone-fill" style={{ left: 150, top: 14, width: 82, height: 50 }}><span className="zone-label">Block B</span></div>
            <div className="zone zone-fill" style={{ left: 14, top: 98, width: 160, height: 48 }}><span className="zone-label">Block C</span></div>
            <div className="zone zone-fill" style={{ left: 240, top: 84, width: 100, height: 62 }}><span className="zone-label">Warehouse</span></div>
            {WDOTS.map((w, i) => (
              <div key={i} className={`wdot-wrap ${w.cls}`} style={{ left: w.left, top: w.top }}>
                <div className="wdot-ring"></div>
                <div className="wdot"></div>
                <div className="wdot-tt">{w.tt}</div>
              </div>
            ))}
          </div>
          <button className="map-expand" onClick={onOpenMap}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><polyline points="7.5,1 12,1 12,5.5" stroke="#44443F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><line x1="11.5" y1="1.5" x2="7" y2="6" stroke="#44443F" strokeWidth="1.6" strokeLinecap="round"/><polyline points="5.5,12 1,12 1,7.5" stroke="#44443F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><line x1="1.5" y1="11.5" x2="6" y2="7" stroke="#44443F" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
          <div className="map-legend">
            <div className="leg"><div className="leg-d" style={{ background: 'var(--green)' }}></div>Normal</div>
            <div className="leg"><div className="leg-d" style={{ background: 'var(--amber)' }}></div>Warning</div>
            <div className="leg"><div className="leg-d" style={{ background: 'var(--red)' }}></div>Critical</div>
          </div>
        </div>

        {/* Equipment Status */}
        <div className="eq-card">
          <div className="eq-header">
            <div className="eq-title">Equipment Status</div>
            <div className="eq-count">7 shown · 12 total</div>
          </div>
          {EQ_ROWS.map((r) => (
            <div key={r.id} className="eq-row">
              <div className="eq-status-dot" style={{ background: r.dotColor, ...(r.dotAnim ? { animation: 'pulse-r 1s ease infinite' } : {}) }}></div>
              <div className="eq-main">
                <div className="eq-id">#{r.id}</div>
                <div className="eq-name" style={r.id === '007' ? { color: 'var(--muted)' } : {}}>{r.name}</div>
                <div className="eq-note" style={{ color: r.noteColor }}>{r.note}</div>
              </div>
              <div className="eq-right">
                <div className={`chip ${r.chipClass}`}>{r.chipLabel}</div>
                {r.batt !== null ? (
                  <div className="batt-row">
                    <div className="batt-bar"><div className="batt-fill" style={{ width: `${r.batt}%`, background: r.battColor }}></div></div>
                    <span className="batt-pct">{r.batt}%</span>
                  </div>
                ) : <span className="batt-pct">—</span>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}
