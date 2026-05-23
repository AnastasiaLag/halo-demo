'use client';
import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { WORKERS, MODULES, ZONES, ZoneWorker } from '@/lib/data';

interface ShiftState {
  id: string;
  fill: number;
  time: string;
  zones: Record<string, ZoneWorker[]>;
}

const INIT_SHIFTS: ShiftState[] = [
  {
    id: 'shift1', fill: 1.0, time: '00:00 – 08:00',
    zones: {
      'Zone A':    [{ name: 'N. Katsis', mod: 'H.A.L.O. #003' }, { name: 'G. Pappas', mod: 'H.A.L.O. #001' }],
      'Zone B':    [{ name: 'M. Lekkas', mod: 'H.A.L.O. #004' }, { name: 'K. Nakos', mod: 'H.A.L.O. #002' }],
      'Zone C':    [],
      'Warehouse': [],
    },
  },
  {
    id: 'shift2', fill: 0.5, time: '08:00 – 16:00',
    zones: {
      'Zone A':    [{ name: 'A. Tsiotis', mod: 'H.A.L.O. #009' }, { name: 'S. Dimos', mod: 'H.A.L.O. #005' }],
      'Zone B':    [],
      'Zone C':    [{ name: 'P. Athinos', mod: 'H.A.L.O. #006' }],
      'Warehouse': [],
    },
  },
  {
    id: 'shift3', fill: 0.25, time: '16:00 – 00:00',
    zones: {
      'Zone A':    [],
      'Zone B':    [],
      'Zone C':    [],
      'Warehouse': [{ name: 'V. Chronis', mod: 'H.A.L.O. #008' }],
    },
  },
];

const DN = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function FillSVG({ fill }: { fill: number }) {
  const uid = useId().replace(/:/g, '');
  if (fill >= 1) {
    return (
      <svg className="fill-icon" viewBox="0 0 30 30" fill="none">
        <circle cx="15" cy="15" r="12" stroke="var(--ink)" strokeWidth="2"/>
        <circle cx="15" cy="15" r="11" fill="var(--ink)"/>
      </svg>
    );
  }
  const r = 11, cy = 15;
  const fillH = fill * (r * 2);
  const top = cy + r - fillH;
  return (
    <svg className="fill-icon" viewBox="0 0 30 30" fill="none">
      <circle cx="15" cy="15" r="12" stroke="var(--ink)" strokeWidth="2"/>
      <clipPath id={uid}><circle cx="15" cy="15" r="11"/></clipPath>
      <rect x="4" y={top.toFixed(1)} width="22" height={(fillH + 2).toFixed(1)} fill="var(--ink)" clipPath={`url(#${uid})`}/>
    </svg>
  );
}

const AvatarSvg = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

interface ZoneFormState {
  workerVal: string;
  workerLabel: string;
  moduleVal: string;
  moduleLabel: string;
  workerOpen: boolean;
  moduleOpen: boolean;
}

interface ZoneGroupProps {
  shiftId: string;
  zoneName: string;
  workers: ZoneWorker[];
  onAddWorker: (shiftId: string, zoneName: string, worker: ZoneWorker) => void;
}

function ZoneGroup({ shiftId, zoneName, workers, onAddWorker }: ZoneGroupProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ZoneFormState>({
    workerVal: '', workerLabel: 'Select worker…',
    moduleVal: '', moduleLabel: 'Module…',
    workerOpen: false, moduleOpen: false,
  });
  const workerBtnRef = useRef<HTMLButtonElement>(null);
  const moduleBtnRef = useRef<HTMLButtonElement>(null);
  const workerListRef = useRef<HTMLDivElement>(null);
  const moduleListRef = useRef<HTMLDivElement>(null);

  const positionList = useCallback((btnRef: React.RefObject<HTMLButtonElement | null>, listRef: React.RefObject<HTMLDivElement | null>) => {
    const btn = btnRef.current; const list = listRef.current;
    if (!btn || !list) return;
    const rect = btn.getBoundingClientRect();
    list.style.width = rect.width + 'px';
    list.style.left = rect.left + 'px';
    list.style.top = (rect.bottom + 4) + 'px';
    list.style.bottom = 'auto';
  }, []);

  const toggleWorker = () => {
    const next = !form.workerOpen;
    setForm(f => ({ ...f, workerOpen: next, moduleOpen: false }));
    if (next) setTimeout(() => positionList(workerBtnRef, workerListRef), 0);
  };
  const toggleModule = () => {
    const next = !form.moduleOpen;
    setForm(f => ({ ...f, moduleOpen: next, workerOpen: false }));
    if (next) setTimeout(() => positionList(moduleBtnRef, moduleListRef), 0);
  };

  const showConfirm = form.workerVal !== '' || form.moduleVal !== '';

  const confirm = () => {
    if (form.workerVal) {
      onAddWorker(shiftId, zoneName, { name: form.workerVal, mod: form.moduleVal || '—' });
    }
    setShowForm(false);
    setForm({ workerVal: '', workerLabel: 'Select worker…', moduleVal: '', moduleLabel: 'Module…', workerOpen: false, moduleOpen: false });
  };

  return (
    <div className="zone-group">
      <div className="zone-header">
        <span className="zone-name">{zoneName}</span>
        <div className="zone-actions">
          {showForm && showConfirm && (
            <button className="zone-confirm-btn" onClick={confirm}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="20,6 9,17 4,12" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
          <button className="zone-add-btn" onClick={() => setShowForm(v => !v)}>+</button>
        </div>
      </div>
      <div className="zone-sep-bold"></div>
      <div>
        {workers.length === 0 && !showForm && <div className="zone-empty-note">No workers assigned</div>}
        {workers.map((w, i) => (
          <div key={i}>
            {i > 0 && <div className="zone-sep-light"></div>}
            <div className="shift-worker-row">
              <div className="shift-worker-avatar"><AvatarSvg /></div>
              <span className="shift-worker-name">{w.name}</span>
              <span className="shift-worker-module">{w.mod}</span>
            </div>
          </div>
        ))}
        {showForm && (
          <div className="add-worker-row">
            <div className="shift-worker-avatar"><AvatarSvg /></div>
            {/* Worker dropdown */}
            <div className="aw-dd-wrap">
              <button ref={workerBtnRef} type="button" className={`aw-dd-btn${form.workerOpen ? ' open' : ''}`} onClick={toggleWorker}>
                <span className={`aw-dd-label${!form.workerVal ? ' placeholder' : ''}`}>{form.workerLabel}</span>
                <svg className="aw-dd-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div ref={workerListRef} className={`aw-dd-list${form.workerOpen ? ' open' : ''}`} style={{ position: 'fixed' }}>
                <div className="aw-dd-opt" onClick={() => setForm(f => ({ ...f, workerVal: '', workerLabel: 'Select worker…', workerOpen: false }))}>Select worker…</div>
                {WORKERS.map(w => (
                  <div key={w.id} className={`aw-dd-opt${form.workerVal === w.name ? ' selected' : ''}`} onClick={() => setForm(f => ({ ...f, workerVal: w.name, workerLabel: w.name, workerOpen: false }))}>
                    {w.name}
                  </div>
                ))}
              </div>
            </div>
            {/* Module dropdown */}
            <div className="aw-dd-wrap module-dd">
              <button ref={moduleBtnRef} type="button" className={`aw-dd-btn${form.moduleOpen ? ' open' : ''}`} onClick={toggleModule}>
                <span className={`aw-dd-label${!form.moduleVal ? ' placeholder' : ''}`}>{form.moduleLabel}</span>
                <svg className="aw-dd-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div ref={moduleListRef} className={`aw-dd-list${form.moduleOpen ? ' open' : ''}`} style={{ position: 'fixed' }}>
                <div className="aw-dd-opt" onClick={() => setForm(f => ({ ...f, moduleVal: '', moduleLabel: 'Module…', moduleOpen: false }))}>Module…</div>
                {MODULES.map(m => (
                  <div key={m} className={`aw-dd-opt${form.moduleVal === m ? ' selected' : ''}`} onClick={() => setForm(f => ({ ...f, moduleVal: m, moduleLabel: m, moduleOpen: false }))}>
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  onOpenCal: () => void;
}

export default function ShiftsPage({ onOpenCal }: Props) {
  const [shifts, setShifts] = useState<ShiftState[]>(INIT_SHIFTS);
  const [openShift, setOpenShift] = useState<string | null>(null);
  const [editingTime, setEditingTime] = useState<Record<string, boolean>>({});
  const [timeInputs, setTimeInputs] = useState<Record<string, string>>({});
  const [selectedDay, setSelectedDay] = useState(0);
  const [days, setDays] = useState<Array<{ month: string; num: number; name: string; offset: number }>>([]);

  useEffect(() => {
    const today = new Date();
    const arr = [];
    for (let i = -2; i <= 4; i++) {
      const d = new Date(today); d.setDate(today.getDate() + i);
      const dow = d.getDay();
      arr.push({ month: MN[d.getMonth()], num: d.getDate(), name: DN[dow === 0 ? 6 : dow - 1], offset: i });
    }
    setDays(arr);
  }, []);

  const toggleShift = (id: string) => setOpenShift(prev => prev === id ? null : id);

  const startTimeEdit = (id: string, currentTime: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTime(prev => ({ ...prev, [id]: true }));
    setTimeInputs(prev => ({ ...prev, [id]: currentTime }));
  };

  const confirmTimeEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTime = timeInputs[id] || '';
    setShifts(prev => prev.map(s => s.id === id ? { ...s, time: newTime } : s));
    setEditingTime(prev => ({ ...prev, [id]: false }));
  };

  const addWorker = (shiftId: string, zoneName: string, worker: ZoneWorker) => {
    setShifts(prev => prev.map(s => {
      if (s.id !== shiftId) return s;
      const zones = { ...s.zones, [zoneName]: [...(s.zones[zoneName] || []), worker] };
      return { ...s, zones };
    }));
  };

  return (
    <div className="page active" id="pageShifts">
      <div className="day-strip">
        {days.map((d, i) => (
          <div
            key={i}
            className={`day-tile${selectedDay === i ? ' selected' : ''}`}
            onClick={() => setSelectedDay(i)}
          >
            <span className="day-tile-month">{d.month}</span>
            <span className="day-tile-num">{d.num}</span>
            <span className="day-tile-name">{d.name}</span>
          </div>
        ))}
      </div>
      <div className="schedule-header">
        <div className="schedule-title">Today&apos;s Schedule</div>
        <button className="copy-btn" onClick={onOpenCal}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="#44443F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="#44443F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <div className="shifts-list">
        {shifts.map(s => (
          <div key={s.id} className={`shift-block${openShift === s.id ? ' open' : ''}`}>
            <div className="shift-header" onClick={() => toggleShift(s.id)}>
              <FillSVG fill={s.fill} />
              <div className="shift-info">
                <div className="shift-name">{s.id.replace('shift', 'Shift ')}</div>
                <div className="shift-time-row">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="var(--muted)" strokeWidth="1.8"/><polyline points="12,7 12,12 15,15" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {editingTime[s.id] ? (
                    <input
                      className="shift-time-input"
                      value={timeInputs[s.id] ?? s.time}
                      onChange={e => setTimeInputs(prev => ({ ...prev, [s.id]: e.target.value }))}
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <span className="shift-time">{s.time}</span>
                  )}
                </div>
              </div>
              {!editingTime[s.id] ? (
                <button className="shift-edit-btn" onClick={e => startTimeEdit(s.id, s.time, e)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="var(--ink2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="var(--ink2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              ) : (
                <button className="shift-check-btn" onClick={e => confirmTimeEdit(s.id, e)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="20,6 9,17 4,12" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              )}
              <div className="shift-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="6,9 12,15 18,9" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
            <div className="shift-dropdown">
              {ZONES.map(zoneName => (
                <ZoneGroup
                  key={zoneName}
                  shiftId={s.id}
                  zoneName={zoneName}
                  workers={s.zones[zoneName] || []}
                  onAddWorker={addWorker}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
