'use client';
import { useState, useCallback, type ReactElement } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WD = ['Mo','Tu','We','Th','Fr','Sa','Su'];

export default function CalBackdrop({ open, onClose, onToast }: Props) {
  const now = new Date();
  const [calY, setCalY] = useState(now.getFullYear());
  const [calM, setCalM] = useState(now.getMonth());
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleDay = useCallback((key: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const prev = () => {
    if (calM === 0) { setCalM(11); setCalY(y => y - 1); } else setCalM(m => m - 1);
  };
  const next = () => {
    if (calM === 11) { setCalM(0); setCalY(y => y + 1); } else setCalM(m => m + 1);
  };

  const today = new Date(); today.setHours(0,0,0,0);
  const firstDow = new Date(calY, calM, 1).getDay();
  const offset = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(calY, calM + 1, 0).getDate();
  const cells: ReactElement[] = [];
  for (let i = 0; i < offset; i++) cells.push(<div key={`e${i}`} className="cal-day empty"></div>);
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(calY, calM, d); dt.setHours(0,0,0,0);
    const key = `${calY}-${calM}-${d}`;
    const isPast = dt < today;
    const isToday = dt.getTime() === today.getTime();
    const isSel = selected.has(key);
    let cls = 'cal-day';
    if (isToday) cls += ' today-base';
    else if (isPast) cls += ' past';
    if (isSel) cls += ' selected';
    cells.push(
      <div key={key} className={cls} onClick={() => { if (!isPast && !isToday) toggleDay(key); }}>{d}</div>
    );
  }

  const confirmCopy = () => {
    const count = selected.size;
    if (count === 0) { onToast('No days selected'); return; }
    setSelected(new Set());
    onClose();
    onToast(`Schedule copied to ${count} day${count > 1 ? 's' : ''}`);
  };

  return (
    <div
      className={`cal-backdrop${open ? ' open' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="cal-sheet">
        <div className="cal-drag"></div>
        <div className="cal-title">Copy Schedule</div>
        <div className="cal-sub">Select days to copy Today&apos;s Schedule to</div>
        <div className="cal-month-nav">
          <button className="cal-nav-btn" onClick={prev}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="15,18 9,12 15,6" stroke="var(--ink2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <span className="cal-month-label">{MONTHS[calM]} {calY}</span>
          <button className="cal-nav-btn" onClick={next}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="9,18 15,12 9,6" stroke="var(--ink2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div className="cal-weekdays">{WD.map(w => <div key={w} className="cal-wd">{w}</div>)}</div>
        <div className="cal-grid">{cells}</div>
        <div className="cal-actions">
          <button className="cal-btn cal-btn-primary" onClick={confirmCopy}>Copy Today&apos;s Schedule to selected days</button>
          <button className="cal-btn cal-btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
