'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { MOD_DATA, ModuleData, PIN_DEFS } from '@/lib/data';

function statusColor(s: string) {
  return s === 'crit' ? 'var(--red)' : s === 'warn' ? 'var(--amber)' : s === 'ok' ? 'var(--green)' : 'var(--muted)';
}

function StatusChip({ s }: { s: string }) {
  if (s === 'crit') return <div className="chip chip-crit">Alert</div>;
  if (s === 'warn') return <div className="chip chip-warn">Warn</div>;
  if (s === 'ok') return <div className="chip chip-ok">Online</div>;
  return <div className="chip chip-off">Offline</div>;
}

function BattBar({ batt }: { batt: number | null }) {
  if (batt === null) return <span className="batt-pct">—</span>;
  const col = batt > 60 ? 'var(--green)' : batt > 30 ? 'var(--amber)' : 'var(--red)';
  return (
    <div className="batt-row">
      <div className="batt-bar"><div className="batt-fill" style={{ width: `${batt}%`, background: col }}></div></div>
      <span className="batt-pct">{batt}%</span>
    </div>
  );
}

interface SliderState {
  CO2: number;
  Fall: number;
  Temp: number;
  Ergo: number;
  Timer: number;
}
interface ToggleState {
  Buzzer: boolean;
  Push: boolean;
  NearMiss: boolean;
  Privacy: boolean;
  Report: boolean;
}

interface Props {
  onToast: (msg: string) => void;
  liveModules?: ModuleData[];
}

export default function ModulesPage({ onToast, liveModules }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [modules, setModules] = useState<ModuleData[]>(liveModules ? [...liveModules] : [...MOD_DATA]);

  useEffect(() => {
    if (liveModules) setModules([...liveModules]);
  }, [liveModules]);
  const [removing, setRemoving] = useState<string | null>(null);
  const [sliders, setSliders] = useState<SliderState>({ CO2: 1000, Fall: 45, Temp: 38, Ergo: 30, Timer: 30 });
  const [toggles, setToggles] = useState<ToggleState>({ Buzzer: true, Push: true, NearMiss: true, Privacy: true, Report: false });

  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [pins, setPins] = useState<Array<{ n: string; left: number; top: number }>>([]);

  const placePins = useCallback(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    const iw = img.offsetWidth;
    const ih = img.offsetHeight;
    const iLeft = (wrap.offsetWidth - iw) / 2;
    setPins(PIN_DEFS.map(p => ({
      n: p.n,
      left: iLeft + p.pct[0] / 100 * iw - 11,
      top: p.pct[1] / 100 * ih - 11,
    })));
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      const raf = requestAnimationFrame(() => requestAnimationFrame(placePins));
      window.addEventListener('resize', placePins);
      return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', placePins); };
    }
  }, [activeTab, placePins]);

  const deleteModule = (id: string) => {
    setRemoving(id);
    setTimeout(() => {
      setModules(prev => prev.filter(m => m.id !== id));
      setRemoving(null);
      onToast(`Module #${id} removed`);
    }, 250);
  };

  const active = modules.filter(m => m.status !== 'off').length;
  const offline = modules.filter(m => m.status === 'off').length;

  const sliderBg = (val: number, min: number, max: number) => {
    const pct = (val - min) / (max - min) * 100;
    return `linear-gradient(to right, var(--ink) 0%, var(--ink) ${pct}%, var(--line) ${pct}%, var(--line) 100%)`;
  };

  return (
    <div className="page active" id="pageModules">
      <div className="mod-tabs">
        {['Modules', 'Hardware', 'Settings'].map((label, i) => (
          <button key={i} className={`mod-tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>{label}</button>
        ))}
      </div>

      {/* Panel 0: Module List */}
      <div className={`mod-panel${activeTab === 0 ? ' active' : ''}`}>
        <div className="mod-scroll">
          <div className="mod-inner">
            <div className="modlist-card">
              <div className="modlist-header">
                <div className="modlist-title">Your Modules</div>
                <div className="modlist-count">{active} active · {offline} offline</div>
              </div>
              <div className="mod-list-scroll">
                {modules.map(m => (
                  <div
                    key={m.id}
                    className="mod-row"
                    style={removing === m.id ? { opacity: 0, transform: 'translateX(20px)' } : {}}
                  >
                    <div className="mod-status-dot" style={{ background: statusColor(m.status), ...(m.status === 'crit' ? { animation: 'pulse-r 1s ease infinite' } : {}) }}></div>
                    <div className="mod-main">
                      <div className="mod-id">H.A.L.O. #{m.id}</div>
                      <div className="mod-worker" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: 'var(--ink2)' }}>Module {m.id}</div>
                    </div>
                    <div className="mod-right">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <StatusChip s={m.status} />
                        <button className="mod-delete-btn" onClick={() => deleteModule(m.id)} aria-label="Remove module">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <polyline points="3,6 5,6 21,6" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 11v6M14 11v6" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round"/>
                            <path d="M9 6V4h6v2" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                      <BattBar batt={m.batt} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="mod-add-btn" onClick={() => onToast('Add module coming soon')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
              Add new module
            </button>
            <div style={{ height: 4 }} />
          </div>
        </div>
      </div>

      {/* Panel 1: Hardware Diagram */}
      <div className={`mod-panel${activeTab === 1 ? ' active' : ''}`}>
        <div className="mod-scroll">
          <div className="mod-inner">
            <div className="mod-diagram-wrap">
              <div className="mod-diagram-img-wrap" ref={wrapRef}>
                <Image
                  ref={imgRef}
                  className="mod-diagram-img"
                  src="/hardware-nobg.png"
                  alt="H.A.L.O. circuit diagram"
                  width={400}
                  height={300}
                  style={{ width: '75%', height: 'auto' }}
                  onLoad={placePins}
                  priority
                />
                {pins.map(p => (
                  <div key={p.n} className="mod-pin" style={{ left: p.left, top: p.top }}>{p.n}</div>
                ))}
              </div>
              <div className="mod-legend">
                {[
                  { n: '1', name: 'Arduino UNO — Main Controller', desc: 'The "brain" of H.A.L.O. Processes all sensor data locally and triggers alerts. Runs the fall-detection algorithm and coordinates WiFi transmission.' },
                  { n: '2', name: 'MPU-6050 — Tri-Axis Accelerometer & Gyroscope', desc: 'Detects sudden falls, body posture deviations, and ergonomic risk. Triggers the man-down protocol after configurable inactivity (default 30s).' },
                  { n: '3', name: 'MQ-135 / MQ-2 — Gas Sensors', desc: 'Detects CO₂, ammonia, benzene, and smoke. Triggers an immediate buzzer alert if concentration exceeds the configurable threshold (default 1000 ppm).' },
                  { n: '4', name: 'LED Light - Local Alert', desc: 'Bypasses the cloud for instant on-helmet audio notification. Alerts the worker directly at the moment of danger — before the signal even reaches the supervisor.' },
                ].map(item => (
                  <div key={item.n} className="mod-legend-row">
                    <div className="mod-legend-num">{item.n}</div>
                    <div>
                      <div className="mod-legend-name">{item.name}</div>
                      <div className="mod-legend-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ height: 4 }} />
          </div>
        </div>
      </div>

      {/* Panel 2: Settings */}
      <div className={`mod-panel${activeTab === 2 ? ' active' : ''}`}>
        <div className="mod-scroll">
          <div className="mod-inner">
            {/* Alarm thresholds */}
            <div className="mod-settings-card">
              <div className="mod-settings-section">
                <div className="mod-settings-label">Alarm Thresholds</div>
                {([
                  { key: 'CO2',   label: 'CO₂ Limit',               min: 400,  max: 2000, step: 50,  unit: ' ppm', hint: 'Increase in dusty environments' },
                  { key: 'Fall',  label: 'Fall Detection Angle',     min: 20,   max: 90,   step: 5,   unit: '°',    hint: 'Reduce for workers on scaffolding' },
                  { key: 'Temp',  label: 'Temperature Limit',        min: 30,   max: 55,   step: 1,   unit: ' °C',  hint: 'Adjust for outdoor summer conditions' },
                  { key: 'Ergo',  label: 'Ergonomics (Back Angle)',  min: 10,   max: 60,   step: 5,   unit: '°',    hint: 'Adjust for workers who bend frequently' },
                  { key: 'Timer', label: 'Man-down Timer',           min: 10,   max: 120,  step: 5,   unit: ' s',   hint: 'Inactivity before fall alert is confirmed' },
                ] as const).map(s => (
                  <div key={s.key} className="mod-slider-row">
                    <div className="mod-slider-top">
                      <span className="mod-slider-name">{s.label}</span>
                      <span className="mod-slider-val">{sliders[s.key as keyof SliderState]}{s.unit}</span>
                    </div>
                    <input
                      className="mod-range"
                      type="range"
                      min={s.min} max={s.max} step={s.step}
                      value={sliders[s.key as keyof SliderState]}
                      style={{ background: sliderBg(sliders[s.key as keyof SliderState], s.min, s.max) }}
                      onChange={e => setSliders(prev => ({ ...prev, [s.key]: Number(e.target.value) }))}
                    />
                    <div className="mod-slider-hint">{s.hint}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature toggles */}
            <div className="mod-settings-card">
              <div className="mod-settings-section">
                <div className="mod-settings-label">Features</div>
                {([
                  { key: 'Buzzer',   name: 'Buzzer Alert',             sub: 'Immediate on-helmet notification' },
                  { key: 'Push',     name: 'Push Notifications',        sub: "Alerts to supervisor's phone" },
                  { key: 'NearMiss', name: 'Near-miss Logging',         sub: 'Automatic recording for analytics' },
                  { key: 'Privacy',  name: 'Privacy Mode',              sub: 'Local processing — no cloud tracking' },
                  { key: 'Report',   name: 'Monthly Insurance Report',  sub: 'Auto-send PDF each month' },
                ] as const).map(t => (
                  <div key={t.key} className="mod-toggle-row">
                    <div>
                      <div className="mod-toggle-name">{t.name}</div>
                      <div className="mod-toggle-sub">{t.sub}</div>
                    </div>
                    <button
                      className={`mod-toggle${toggles[t.key as keyof ToggleState] ? ' on' : ''}`}
                      onClick={() => setToggles(prev => ({ ...prev, [t.key]: !prev[t.key as keyof ToggleState] }))}
                    ></button>
                  </div>
                ))}
              </div>
            </div>

            {/* System info */}
            <div className="mod-settings-card">
              <div className="mod-settings-section" style={{ paddingBottom: 0 }}>
                <div className="mod-settings-label">System Info</div>
              </div>
              <div className="mod-sysinfo">
                {[
                  { label: 'Firmware',     val: 'v1.2.4' },
                  { label: 'Hardware',     val: 'Arduino UNO + WiFi' },
                  { label: 'Sensors',      val: 'MPU-6050 · MQ-135 · DHT11' },
                  { label: 'Certification',val: 'ISO 45001 Ready' },
                ].map(item => (
                  <div key={item.label} className="mod-sysinfo-item">
                    <div className="mod-sysinfo-label">{item.label}</div>
                    <div className="mod-sysinfo-val">{item.val}</div>
                  </div>
                ))}
              </div>
            </div>

            <button className="mod-save-btn" onClick={() => onToast('Settings saved')}>Save Changes</button>
            <div style={{ height: 4 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
