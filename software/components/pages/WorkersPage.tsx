'use client';

interface WorkerEntry {
  name: string;
  role: string;
  onShift: boolean;
}

const WORKERS_LIST: WorkerEntry[] = [
  { name: 'Nikos Katsis',    role: 'Structural Worker · Block C',      onShift: true },
  { name: 'Antonis Tsiotis', role: 'Electrician · Zone A',             onShift: true },
  { name: 'Giorgos Pappas',  role: 'Site Foreman · Zone A',            onShift: true },
  { name: 'Makis Lekkas',    role: 'Scaffolding Specialist · Zone B',  onShift: true },
  { name: 'Stavros Dimos',   role: 'Concrete Specialist · Zone C',     onShift: true },
  { name: 'Petros Athinos',  role: 'Structural Worker · Zone C',       onShift: true },
  { name: 'Vassilis Chronis',role: 'Warehouse Operator',               onShift: false },
  { name: 'Kostas Nakos',    role: 'Heavy Equipment Operator',         onShift: false },
];

const AvatarSvg = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

interface Props {
  onToast: (msg: string) => void;
}

export default function WorkersPage({ onToast }: Props) {
  return (
    <div className="page active" id="pageWorkers">
      <div className="content">
        <div className="workers-card">
          <div className="workers-header">
            <div className="workers-title">Workers</div>
            <div className="workers-count">8 workers · 6 on shift</div>
          </div>
          {WORKERS_LIST.map((w) => (
            <div key={w.name} className="worker-row">
              <div className="worker-avatar-wrap">
                <div className="worker-avatar"><AvatarSvg /></div>
                {w.onShift && <div className="worker-on-shift"></div>}
              </div>
              <div className="worker-info">
                <div className="worker-name">{w.name}</div>
                <div className="worker-role">{w.role}</div>
              </div>
              {w.onShift
                ? <div className="worker-shift-badge">On shift</div>
                : <div className="worker-off-badge">Off shift</div>
              }
            </div>
          ))}
        </div>
        <button className="mod-add-btn" onClick={() => onToast('Add worker coming soon')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
          Add new worker
        </button>
        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}
