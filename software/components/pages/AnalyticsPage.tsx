'use client';
import { useState, useRef, useEffect } from 'react';
import { AN_DATA } from '@/lib/data';

const PERIODS = ['This Month', 'This Trimester', 'This Semester', 'This Year', 'All Time'];

const INCIDENT_COLORS: Record<string, string> = {
  'Falls': '#C23B2B',
  'Gas Exposure': '#C47A0A',
  'Temperature': '#1C7C45',
};

function heatColor(count: number): string {
  if (count === 0) return 'rgba(28,124,69,.22)';
  if (count <= 2) return 'rgba(196,122,10,.40)';
  if (count <= 5) return 'rgba(194,59,43,.38)';
  if (count <= 12) return 'rgba(194,59,43,.58)';
  return 'rgba(194,59,43,.78)';
}

const SMALL_ZONES = [
  { name: 'Block A',   s: { left: 14, top: 14, width: 118, height: 60 } },
  { name: 'Block B',   s: { left: 150, top: 14, width: 82, height: 50 } },
  { name: 'Block C',   s: { left: 14, top: 98, width: 160, height: 48 } },
  { name: 'Warehouse', s: { left: 240, top: 84, width: 100, height: 62 } },
];

interface Props {
  period: string;
  onPeriodChange: (p: string) => void;
  onOpenHeatmap: () => void;
  onToast: (msg: string) => void;
}

export default function AnalyticsPage({ period, onPeriodChange, onOpenHeatmap, onToast }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [trirTooltip, setTrirTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const d = AN_DATA[period];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      setTrirTooltip(false);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const compColor = d.compliance >= 90 ? 'var(--green)' : d.compliance >= 70 ? 'var(--amber)' : 'var(--red)';
  const trirColor = d.trir < 1.5 ? 'var(--green)' : d.trir < 3 ? 'var(--amber)' : 'var(--red)';

  const base = 18000;
  const saving = Math.round(base * d.savingsPct / 100);
  const result = base - saving;
  const tierBg = d.tier === 'Excellent' || d.tier === 'Good' ? 'var(--green-s)' : d.tier === 'Average' ? 'var(--amber-s)' : 'var(--red-s)';
  const tierColor = d.tier === 'Excellent' || d.tier === 'Good' ? 'var(--green)' : d.tier === 'Average' ? 'var(--amber)' : 'var(--red)';

  const total = Object.values(d.incidentTypes).reduce((a, b) => a + b, 0);
  const cx = 45, cy = 45, r = 32, strokeW = 14;
  const circ = 2 * Math.PI * r;
  let cumOffset = 0;
  const donutSegments: Array<{ name: string; count: number; dash: number; gap: number; offset: number }> = [];
  for (const [name, count] of Object.entries(d.incidentTypes)) {
    if (count === 0) { cumOffset += 0; continue; }
    const pct = count / total;
    donutSegments.push({ name, count, dash: pct * circ, gap: (1 - pct) * circ, offset: cumOffset * circ });
    cumOffset += pct;
  }

  const nmMax = Math.max(...d.nearMissByPeriod.map(b => b.v), 1);
  const phMax = Math.max(...d.peakHours.map(h => h.v), 1);
  const scoreTotal = d.scoreComponents.reduce((a, c) => a + c.score, 0);

  return (
    <div className="page active" id="pageAnalytics">
      <div className="content" id="analyticsContent">

        {/* 1. Period Selector */}
        <div className="an-period-wrap" ref={dropdownRef}>
          <button
            className={`an-period-btn${dropdownOpen ? ' open' : ''}`}
            onClick={e => { e.stopPropagation(); setDropdownOpen(v => !v); }}
          >
            <span>{period}</span>
            <svg className="an-period-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <polyline points="6,9 12,15 18,9" stroke="var(--ink2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className={`an-period-dropdown${dropdownOpen ? ' open' : ''}`}>
            {PERIODS.map(p => (
              <div
                key={p}
                className={`an-period-opt${period === p ? ' selected' : ''}`}
                onClick={() => { onPeriodChange(p); setDropdownOpen(false); }}
              >{p}</div>
            ))}
          </div>
        </div>

        {/* 2. KPI Grid */}
        <div className="an-kpi-grid">
          <div className="an-kpi-card">
            <div className="an-kpi-label">Days Without Incident</div>
            <div className="an-kpi-val" style={{ color: d.daysClean > 0 ? 'var(--green)' : 'var(--muted)' }}>{d.daysClean}</div>
            <div className="an-kpi-sub">{d.daysClean === 0 ? 'Incident this period' : 'consecutive days'}</div>
          </div>
          <div className="an-kpi-card">
            <div className="an-kpi-label">Total Incidents</div>
            <div className="an-kpi-val" style={{ color: d.incidents > 0 ? 'var(--red)' : 'var(--green)' }}>{d.incidents}</div>
            <div className="an-kpi-sub">recorded events</div>
          </div>
          <div className="an-kpi-card">
            <div className="an-kpi-label">Near-Miss Events</div>
            <div className="an-kpi-val" style={{ color: 'var(--amber)' }}>{d.nearMiss}</div>
            <div className="an-kpi-sub">hazards detected early</div>
          </div>
          <div className="an-kpi-card" style={{ position: 'relative' }}>
            <div className="an-kpi-label">
              TRIR
              <button
                className="an-info-btn"
                onClick={e => { e.stopPropagation(); setTrirTooltip(v => !v); }}
              >i</button>
            </div>
            <div className="an-kpi-val" style={{ color: trirColor }}>{d.trir.toFixed(1)}</div>
            <div className="an-kpi-sub">industry avg: 3.0</div>
            {trirTooltip && (
              <div className="an-tooltip show">
                <strong>Total Recordable Incident Rate</strong><br/>
                = (incidents × 200,000) ÷ hours worked<br/><br/>
                ✦ &lt;1.0 = Excellent<br/>
                ✦ &lt;3.0 = Good<br/>
                ✦ 3.0+ = Needs improvement
              </div>
            )}
          </div>
          <div className="an-kpi-card">
            <div className="an-kpi-label">Module Compliance</div>
            <div className="an-kpi-val" style={{ color: compColor }}>{d.compliance}%</div>
            <div className="an-kpi-sub">helmets with module active</div>
          </div>
          <div className="an-kpi-card">
            <div className="an-kpi-label">Avg Response Time</div>
            <div className="an-kpi-val">{d.responseTime}</div>
            <div className="an-kpi-sub">alert to acknowledge</div>
          </div>
        </div>

        {/* 3. Heatmap */}
        <div className="an-heatmap-card">
          <div className="an-card-header">
            <div className="an-card-title">Incident Heatmap</div>
            <div className="an-period-badge">{period}</div>
          </div>
          <div className="an-heatmap-bp" style={{ position: 'relative' }}>
            {SMALL_ZONES.map(z => (
              <div
                key={z.name}
                className="zone"
                style={{ position: 'absolute', ...z.s, background: heatColor(d.heatmap[z.name] || 0), border: 'none' }}
              >
                <span className="zone-label">{z.name}</span>
              </div>
            ))}
          </div>
          <button className="an-heat-expand" onClick={onOpenHeatmap} aria-label="Expand heatmap">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <polyline points="7.5,1 12,1 12,5.5" stroke="#44443F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="11.5" y1="1.5" x2="7" y2="6" stroke="#44443F" strokeWidth="1.6" strokeLinecap="round"/>
              <polyline points="5.5,12 1,12 1,7.5" stroke="#44443F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="1.5" y1="11.5" x2="6" y2="7" stroke="#44443F" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="heat-legend">
            <span className="heat-legend-label">Safe</span>
            <div className="heat-legend-bar"></div>
            <span className="heat-legend-label">High Risk</span>
          </div>
        </div>

        {/* 4. Incident Breakdown */}
        <div className="an-card">
          <div className="an-card-header">
            <div className="an-card-title">Incident Breakdown</div>
          </div>
          <div className="an-donut-wrap">
            <svg width="90" height="90" viewBox="0 0 90 90" style={{ flexShrink: 0 }}>
              {total === 0 ? (
                <>
                  <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--line)" strokeWidth={strokeW}/>
                  <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fill="var(--muted)" fontFamily="IBM Plex Mono,monospace">None</text>
                </>
              ) : (
                <>
                  {donutSegments.map(seg => (
                    <circle
                      key={seg.name}
                      cx={cx} cy={cy} r={r}
                      fill="none"
                      stroke={INCIDENT_COLORS[seg.name] || '#888'}
                      strokeWidth={strokeW}
                      strokeDasharray={`${seg.dash.toFixed(2)} ${seg.gap.toFixed(2)}`}
                      strokeDashoffset={`${(-seg.offset).toFixed(2)}`}
                      transform={`rotate(-90 ${cx} ${cy})`}
                    />
                  ))}
                  <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--ink)" fontFamily="IBM Plex Mono,monospace">{total}</text>
                  <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="var(--muted)" fontFamily="IBM Plex Mono,monospace">TOTAL</text>
                </>
              )}
            </svg>
            <div className="an-donut-legend">
              {total === 0 ? (
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>No incidents this period</div>
              ) : (
                Object.entries(d.incidentTypes).map(([name, count]) => {
                  const pct = total > 0 ? Math.round(count / total * 100) : 0;
                  return (
                    <div key={name} className="an-legend-row">
                      <div className="an-legend-dot" style={{ background: INCIDENT_COLORS[name] }}></div>
                      <span className="an-legend-label">{name}</span>
                      <span className="an-legend-val">{count}</span>
                      <span className="an-legend-pct">{pct}%</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 5. Near-Miss Events */}
        <div className="an-card">
          <div className="an-card-header">
            <div className="an-card-title">Near-Miss Events</div>
            <div className={`an-trend-badge${d.nearMissTrend.dir === 'up' ? ' an-trend-up' : ' an-trend-down'}`}>
              {d.nearMissTrend.dir === 'up' ? '▲' : '▼'} {d.nearMissTrend.dir === 'up' ? '+' : '−'}{d.nearMissTrend.n} vs last period
            </div>
          </div>
          <div className="an-bars-wrap">
            {d.nearMissByPeriod.map(b => (
              <div key={b.l} className="an-bar-row">
                <span className="an-bar-label">{b.l}</span>
                <div className="an-bar-track"><div className="an-bar-fill" style={{ width: `${Math.round(b.v / nmMax * 100)}%` }}></div></div>
                <span className="an-bar-count">{b.v}</span>
              </div>
            ))}
          </div>
          <div className="an-log-row" onClick={() => onToast('Full Log coming soon')}>
            <span className="an-log-label">View Full Log</span>
            <svg className="an-log-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="9,6 15,12 9,18" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* 6. Insurance Impact */}
        <div className="an-insur-card">
          <div className="an-insur-header">
            <div className="an-card-title">Insurance Impact</div>
            <div className="an-insur-tier" style={{ background: tierBg, color: tierColor }}>✦ {d.tier}</div>
          </div>
          <div className="an-insur-body">
            <div className="an-insur-row">
              <span className="an-insur-lbl">Current premium</span>
              <span className="an-insur-val">€18,000 / yr</span>
            </div>
            <div className="an-insur-row">
              <span className="an-insur-lbl">H.A.L.O. reduction</span>
              <span className="an-insur-val saving">− €{saving.toLocaleString()}</span>
            </div>
            <div className="an-insur-row">
              <span className="an-insur-lbl">Estimated premium</span>
              <span className="an-insur-val result">€{result.toLocaleString()}</span>
            </div>
            <div className="an-savings-bar-track">
              <div className="an-savings-bar-fill" style={{ width: `${d.savingsPct}%` }}></div>
            </div>
            <div className="an-savings-bar-labels">
              <span>€0</span><span>Savings</span><span>€18,000</span>
            </div>
            <div className="an-insur-disclaimer">Estimate based on H.A.L.O. safety data. Consult your insurer for accurate figures.</div>
          </div>
        </div>

        {/* 7. Safety Score Breakdown */}
        <div className="an-card">
          <div className="an-card-header">
            <div className="an-card-title">Safety Score Breakdown</div>
          </div>
          <div className="an-score-breakdown">
            {d.scoreComponents.map(c => (
              <div key={c.label} className="an-score-row">
                <span className="an-score-row-label">
                  {c.label} <span style={{ color: 'var(--muted)', fontSize: 10 }}>({c.weight}pts)</span>
                </span>
                <div className="an-score-bar-wrap">
                  <div className="an-score-bar-track">
                    <div className="an-score-bar-fill" style={{ width: `${Math.round(c.score / c.weight * 100)}%`, background: c.color }}></div>
                  </div>
                  <div className="an-score-row-pts">{c.score}/{c.weight}</div>
                </div>
              </div>
            ))}
            <div className="an-score-total">
              <span className="an-score-total-lbl">Safety Score</span>
              <span className="an-score-total-val">{scoreTotal}/100</span>
            </div>
          </div>
        </div>

        {/* 8. Peak Incident Hours */}
        <div className="an-card">
          <div className="an-card-header">
            <div className="an-card-title">Peak Incident Hours</div>
          </div>
          <div className="an-peak-wrap">
            {d.peakHours.map(h => (
              <div key={h.l} className="an-peak-row">
                <span className="an-peak-label">{h.l}</span>
                <div className="an-peak-track"><div className="an-peak-fill" style={{ width: `${Math.round(h.v / phMax * 100)}%` }}></div></div>
                <span className="an-peak-count">{h.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 9. Export */}
        <button className="an-export-btn" onClick={() => onToast('PDF export coming soon')}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="var(--ink2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="7,10 12,15 17,10" stroke="var(--ink2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="15" x2="12" y2="3" stroke="var(--ink2)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Export Report as PDF
        </button>

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}
