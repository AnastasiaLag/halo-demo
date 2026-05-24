'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import WorkersPage from '@/components/pages/WorkersPage';
import ShiftsPage from '@/components/pages/ShiftsPage';
import SitePage from '@/components/pages/SitePage';
import ModulesPage from '@/components/pages/ModulesPage';
import AnalyticsPage from '@/components/pages/AnalyticsPage';
import NotifOverlay from '@/components/overlays/NotifOverlay';
import NotifScreen from '@/components/overlays/NotifScreen';
import MapOverlay from '@/components/overlays/MapOverlay';
import HeatmapOverlay from '@/components/overlays/HeatmapOverlay';
import CalBackdrop from '@/components/overlays/CalBackdrop';
import { AN_DATA, MOD_DATA, ModuleData } from '@/lib/data';

type Page = 'workers' | 'shifts' | 'site' | 'modules' | 'analytics';

export default function Home() {
  const [activePage, setActivePage]         = useState<Page>('site');
  const [menuOpen, setMenuOpen]             = useState(false);
  const [notifOpen, setNotifOpen]           = useState(false);
  const [notifScreenOpen, setNotifScreenOpen] = useState(false);
  const [mapOpen, setMapOpen]               = useState(false);
  const [heatmapOpen, setHeatmapOpen]       = useState(false);
  const [calOpen, setCalOpen]               = useState(false);
  const [demoOpen, setDemoOpen]             = useState(false);
  const [toast, setToast]                   = useState('');
  const [analyticsPeriod, setAnalyticsPeriod] = useState('This Month');
  const [modules, setModules]               = useState<ModuleData[]>([...MOD_DATA]);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2500);
  }, []);

  const fetchModules = useCallback(async () => {
    try {
      const res = await fetch('/api/modules', { cache: 'no-store' });
      if (!res.ok) return;
      const data: ModuleData[] = await res.json();
      setModules(data);
    } catch {
      // no database yet — keep mock data
    }
  }, []);

  useEffect(() => { fetchModules(); }, [fetchModules]);

  const simulateAlert = async (moduleId: string, type: 'fall' | 'gas') => {
    setDemoOpen(false);
    setNotifOpen(true);
    try {
      const res = await fetch('/api/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, type }),
      });
      if (!res.ok) throw new Error();
      await fetchModules();
      showToast(`Alert simulated on module #${moduleId}`);
    } catch {
      showToast('Database not connected — set up DATABASE_URL');
    }
  };

  const resetAll = async () => {
    setDemoOpen(false);
    try {
      const res = await fetch('/api/modules/reset', { method: 'POST' });
      if (!res.ok) throw new Error();
      await fetchModules();
      showToast('All modules reset to initial state');
    } catch {
      showToast('Database not connected — set up DATABASE_URL');
    }
  };

  const navTo = (page: Page) => { setActivePage(page); setMenuOpen(false); };

  return (
    <div className="shell">

      {/* Topbar */}
      <div className="topbar">
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setNotifOpen(true)}>H.A.L.O.</div>
        <div className="topbar-right">
          <button className="notif-btn" onClick={() => setNotifScreenOpen(true)} aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#111110" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#111110" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="notif-badge"></div>
          </button>
          <button className={`burger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
            <svg className="burger-icon" width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="3" y1="6" x2="19" y2="6" stroke="#111110" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="3" y1="11" x2="19" y2="11" stroke="#111110" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="3" y1="16" x2="19" y2="16" stroke="#111110" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <svg className="close-icon" width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="4" y1="4" x2="18" y2="18" stroke="#111110" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="18" y1="4" x2="4" y2="18" stroke="#111110" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Drawer backdrop */}
      <div className={`drawer-backdrop${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)}></div>

      {/* Drawer */}
      <div className={`drawer${menuOpen ? ' open' : ''}`}>
        <div className="drawer-item" onClick={() => setMenuOpen(false)}>
          <div className="di-icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>
          My Account
        </div>
        <div className="drawer-item" onClick={() => setMenuOpen(false)}>
          <div className="di-icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
          Settings
        </div>
        <div className="drawer-item" onClick={() => setMenuOpen(false)}>
          <div className="di-icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="8.5" strokeWidth="2.2"/><line x1="12" y1="11" x2="12" y2="16"/></svg></div>
          About H.A.L.O.
        </div>
        <div className="drawer-item danger" onClick={() => signOut({ callbackUrl: '/login' })}>
          <div className="di-icon danger-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div>
          Log Out
        </div>
      </div>

      {/* Pages */}
      <div className="inner" id="mainInner">
        <div className={activePage === 'workers' ? '' : 'page-hidden'}>
          <WorkersPage onToast={showToast} />
        </div>
        <div className={activePage === 'shifts' ? '' : 'page-hidden'}>
          <ShiftsPage onOpenCal={() => setCalOpen(true)} />
        </div>
        <div className={activePage === 'site' ? '' : 'page-hidden'}>
          <SitePage onOpenMap={() => setMapOpen(true)} modules={modules} />
        </div>
        <div className={activePage === 'modules' ? '' : 'page-hidden'}>
          <ModulesPage onToast={showToast} liveModules={modules} />
        </div>
        <div className={activePage === 'analytics' ? '' : 'page-hidden'}>
          <AnalyticsPage
            period={analyticsPeriod}
            onPeriodChange={setAnalyticsPeriod}
            onOpenHeatmap={() => setHeatmapOpen(true)}
            onToast={showToast}
          />
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <button className={`nav-item${activePage === 'workers' ? ' active' : ''}`} onClick={() => navTo('workers')}>
          <div className="nav-icon"><svg className="nav-svg" viewBox="0 0 24 24"><circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="17" cy="8" r="2.5"/><path d="M21 21v-1.5a3.5 3.5 0 0 0-2.5-3.35"/></svg></div>
          <span className="nav-label">Workers</span>
        </button>
        <button className={`nav-item${activePage === 'shifts' ? ' active' : ''}`} onClick={() => navTo('shifts')}>
          <div className="nav-icon"><svg className="nav-svg" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><rect x="7" y="14" width="3" height="3" rx=".5" style={{ fill: 'var(--muted)', stroke: 'none' }}/><rect x="14" y="14" width="3" height="3" rx=".5" style={{ fill: 'var(--muted)', stroke: 'none' }}/></svg></div>
          <span className="nav-label">Shifts</span>
        </button>
        <button className={`nav-item${activePage === 'site' ? ' active' : ''}`} onClick={() => navTo('site')}>
          <div className="nav-icon"><svg className="nav-svg" viewBox="0 0 24 24" fill="none"><path d="M2 6 L9 4 L9 19 L2 21 Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 4 L15 6 L15 19 L9 19 Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 6 L22 4 L22 19 L15 19 Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="3.5" y1="10" x2="7.5" y2="9.3" strokeWidth="1" opacity="0.6"/><line x1="3.5" y1="13" x2="7.5" y2="12.3" strokeWidth="1" opacity="0.6"/><line x1="16.5" y1="10" x2="20.5" y2="9.3" strokeWidth="1" opacity="0.6"/><line x1="16.5" y1="14" x2="20.5" y2="13.3" strokeWidth="1" opacity="0.6"/></svg></div>
          <span className="nav-label">Site</span>
        </button>
        <button className={`nav-item${activePage === 'modules' ? ' active' : ''}`} onClick={() => navTo('modules')}>
          <div className="nav-icon"><svg className="nav-svg" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/><line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/></svg></div>
          <span className="nav-label">Modules</span>
        </button>
        <button className={`nav-item${activePage === 'analytics' ? ' active' : ''}`} onClick={() => navTo('analytics')}>
          <div className="nav-icon"><svg className="nav-svg" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="3" y1="20" x2="21" y2="20"/></svg></div>
          <span className="nav-label">Analytics</span>
        </button>
      </nav>

      {/* Overlays */}
      <NotifOverlay open={notifOpen} onClose={() => setNotifOpen(false)} />
      <NotifScreen open={notifScreenOpen} onClose={() => setNotifScreenOpen(false)} onOpenAlert={() => { setNotifScreenOpen(false); setNotifOpen(true); }} />
      <MapOverlay open={mapOpen} onClose={() => setMapOpen(false)} />
      <HeatmapOverlay open={heatmapOpen} onClose={() => setHeatmapOpen(false)} period={analyticsPeriod} data={AN_DATA[analyticsPeriod]} />
      <CalBackdrop open={calOpen} onClose={() => setCalOpen(false)} onToast={showToast} />

      {/* Demo panel */}
      <button className="demo-fab" onClick={() => setDemoOpen(true)}>Simulate</button>
      {demoOpen && <div className="demo-backdrop" onClick={() => setDemoOpen(false)} />}
      <div className={`demo-sheet${demoOpen ? ' open' : ''}`}>
        <div className="demo-sheet-title">Simulate Arduino Input</div>
        <div className="demo-btns">
          <button className="demo-btn danger" onClick={() => simulateAlert('001', 'fall')}>
            🔴 Fall alert — G. Pappas (#001)
          </button>
          <button className="demo-btn danger" onClick={() => simulateAlert('004', 'gas')}>
            🟡 Gas alert — M. Lekkas (#004)
          </button>
          <button className="demo-btn reset" onClick={resetAll}>
            ↺ Reset all modules to normal
          </button>
        </div>
      </div>

      {/* Toast */}
      <div className={`an-toast${toast ? ' show' : ''}`}>{toast}</div>
    </div>
  );
}
