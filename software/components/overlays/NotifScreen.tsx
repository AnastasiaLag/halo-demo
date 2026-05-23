'use client';

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenAlert: () => void;
}

export default function NotifScreen({ open, onClose, onOpenAlert }: Props) {
  return (
    <div className={`notif-screen${open ? ' open' : ''}`}>
      <div className="ns-bar">
        <button className="ns-back" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="15,18 9,12 15,6" stroke="var(--ink2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="ns-title">Notifications</span>
      </div>
      <div className="ns-list">
        {/* TODAY */}
        <div className="ns-section-header">
          <div className="ns-section-label">Today</div>
          <div className="ns-section-line"></div>
        </div>
        <div className="ns-notif-item" onClick={onOpenAlert}>
          <div className="ns-notif-icon crit">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="17" cy="4" r="2" stroke="var(--red)" strokeWidth="1.7"/><path d="M5 18 L10 13 L13 16 L16 11" stroke="var(--red)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 9 L16 11 L13 8" stroke="var(--red)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><line x1="3" y1="21" x2="21" y2="21" stroke="var(--red)" strokeWidth="1.7" strokeLinecap="round"/></svg>
          </div>
          <div className="ns-notif-main">
            <div className="ns-notif-top">
              <span className="ns-notif-time">08:44</span>
              <span className="ns-notif-loc">Block C, Zone B</span>
            </div>
            <div className="ns-notif-worker">N. Katsis</div>
            <div className="ns-notif-desc">Fall detected · Man-down confirmed · 30s inactivity</div>
            <div className="ns-status-chip ns-chip-alert">Alert</div>
          </div>
        </div>
        <div className="ns-notif-item">
          <div className="ns-notif-icon warn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M8 19a4 4 0 0 1-.5-7.95A5 5 0 1 1 17 13h1a3 3 0 0 1 0 6H8z" stroke="var(--amber)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="19" x2="12" y2="22" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.5 2"/><line x1="9" y1="20" x2="9" y2="23" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.5 2"/><line x1="15" y1="20" x2="15" y2="23" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1.5 2"/></svg>
          </div>
          <div className="ns-notif-main">
            <div className="ns-notif-top">
              <span className="ns-notif-time">07:21</span>
              <span className="ns-notif-loc">Zone A</span>
            </div>
            <div className="ns-notif-worker">A. Tsiotis</div>
            <div className="ns-notif-desc">CO₂ 1240 ppm — threshold exceeded</div>
            <div className="ns-status-chip ns-chip-warn">Warning</div>
          </div>
        </div>

        {/* YESTERDAY */}
        <div className="ns-section-header">
          <div className="ns-section-label">Yesterday</div>
          <div className="ns-section-line past"></div>
        </div>
        <div className="ns-notif-item is-past">
          <div className="ns-notif-icon muted">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="3.5" r="1.8" stroke="var(--muted)" strokeWidth="1.6"/>
              <path d="M12 5.3 C10.5 8 10.5 11 12 13.5 C13.5 16 13.5 18.5 12 21" stroke="var(--muted)" strokeWidth="1.7" strokeLinecap="round"/>
              <line x1="10.8" y1="8.5" x2="7.5" y2="10.5" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="12.8" y1="8.6" x2="16.5" y2="10.5" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="13.2" y1="17" x2="16" y2="20" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="ns-notif-main">
            <div className="ns-notif-top">
              <span className="ns-notif-time">14:08</span>
              <span className="ns-notif-loc">Warehouse</span>
            </div>
            <div className="ns-notif-worker">G. Pappas</div>
            <div className="ns-notif-desc">Posture warning · Ergonomic risk detected</div>
            <div className="ns-status-chip ns-chip-ack">Acknowledged</div>
          </div>
        </div>
        <div className="ns-notif-item is-past">
          <div className="ns-notif-icon muted">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="17" cy="4" r="2" stroke="var(--muted)" strokeWidth="1.7"/><path d="M5 18 L10 13 L13 16 L16 11" stroke="var(--muted)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 9 L16 11 L13 8" stroke="var(--muted)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><line x1="3" y1="21" x2="21" y2="21" stroke="var(--muted)" strokeWidth="1.7" strokeLinecap="round"/></svg>
          </div>
          <div className="ns-notif-main">
            <div className="ns-notif-top">
              <span className="ns-notif-time">09:55</span>
              <span className="ns-notif-loc">Zone C</span>
            </div>
            <div className="ns-notif-worker">M. Lekkas</div>
            <div className="ns-notif-desc">Impact detected · No follow-up motion loss</div>
            <div className="ns-status-chip ns-chip-false">False Alarm</div>
          </div>
        </div>

        {/* MAR 12 */}
        <div className="ns-section-header">
          <div className="ns-section-label">Mar 12</div>
          <div className="ns-section-line past"></div>
        </div>
        <div className="ns-notif-item is-past">
          <div className="ns-notif-icon crit">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="17" cy="4" r="2" stroke="var(--red)" strokeWidth="1.7"/><path d="M5 18 L10 13 L13 16 L16 11" stroke="var(--red)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 9 L16 11 L13 8" stroke="var(--red)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><line x1="3" y1="21" x2="21" y2="21" stroke="var(--red)" strokeWidth="1.7" strokeLinecap="round"/></svg>
          </div>
          <div className="ns-notif-main">
            <div className="ns-notif-top">
              <span className="ns-notif-time">11:33</span>
              <span className="ns-notif-loc">Block B</span>
            </div>
            <div className="ns-notif-worker">K. Nakos</div>
            <div className="ns-notif-desc">Fall detected · Man-down alert triggered</div>
            <div className="ns-status-chip ns-chip-called">Called 166</div>
          </div>
        </div>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
