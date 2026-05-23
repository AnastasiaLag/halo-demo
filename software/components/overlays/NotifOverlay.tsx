'use client';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NotifOverlay({ open, onClose }: Props) {
  return (
    <div
      className={`notif-overlay${open ? ' open' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="notif-modal">
        <div className="nm-header">
          <div className="nm-danger-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="9" x2="12" y2="13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="17" r="1" fill="#fff"/>
            </svg>
          </div>
          <div className="nm-title">Alert</div>
          <div className="nm-subtitle">Fall detected — immediate response required</div>
        </div>
        <div className="nm-body">
          <div className="nm-row">
            <div className="nm-row-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="var(--ink2)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="var(--ink2)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div><div className="nm-row-label">Worker</div><div className="nm-row-val">Nikos Katsis</div></div>
          </div>
          <div className="nm-row">
            <div className="nm-row-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="var(--red)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke="var(--red)" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="17" r="1" fill="var(--red)"/></svg>
            </div>
            <div><div className="nm-row-label">Incident</div><div className="nm-row-val av">Fall detected · Man-down confirmed</div></div>
          </div>
          <div className="nm-row">
            <div className="nm-row-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="var(--ink2)" strokeWidth="1.7"/><polyline points="12,7 12,12 15,15" stroke="var(--ink2)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div><div className="nm-row-label">Time · Location</div><div className="nm-row-val">08:44:32 · Block C, Zone B</div></div>
          </div>
          <div className="nm-row">
            <div className="nm-row-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="var(--ink2)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="var(--ink2)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="12" x2="12" y2="16" stroke="var(--ink2)" strokeWidth="1.7" strokeLinecap="round"/><line x1="10" y1="14" x2="14" y2="14" stroke="var(--ink2)" strokeWidth="1.7" strokeLinecap="round"/></svg>
            </div>
            <div><div className="nm-row-label">Module</div><div className="nm-row-val">H.A.L.O. #003 · MPU-6050 · 30s inactivity</div></div>
          </div>
        </div>
        <div className="nm-actions">
          <button className="nm-btn nm-btn-call" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.41 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.08 6.08l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Call 166
          </button>
          <button className="nm-btn nm-btn-ack" onClick={onClose}>Acknowledge</button>
          <button className="nm-btn nm-btn-false" onClick={onClose}>False Alarm</button>
        </div>
      </div>
    </div>
  );
}
