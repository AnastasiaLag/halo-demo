export type WorkerStatus = 'ok' | 'warn' | 'crit';
export type ModStatus = 'ok' | 'warn' | 'crit' | 'off';

export interface Worker {
  id: string;
  name: string;
}

export interface ZoneWorker {
  name: string;
  mod: string;
}

export interface ShiftData {
  id: string;
  fill: number;
  time: string;
  zones: Record<string, ZoneWorker[]>;
}

export interface IncidentTypes {
  Falls: number;
  'Gas Exposure': number;
  Temperature: number;
}

export interface NearMissBar {
  l: string;
  v: number;
}

export interface PeakHour {
  l: string;
  v: number;
}

export interface ScoreComponent {
  label: string;
  weight: number;
  score: number;
  color: string;
}

export interface AnalyticsPeriod {
  daysClean: number;
  incidents: number;
  nearMiss: number;
  trir: number;
  compliance: number;
  responseTime: string;
  incidentTypes: IncidentTypes;
  heatmap: Record<string, number>;
  nearMissByPeriod: NearMissBar[];
  nearMissTrend: { dir: 'up' | 'down'; n: number };
  peakHours: PeakHour[];
  savingsPct: number;
  tier: string;
  scoreComponents: ScoreComponent[];
}

export interface ModuleData {
  id: string;
  worker: string;
  status: ModStatus;
  note: string;
  batt: number | null;
}

export const WORKERS: Worker[] = [
  { id: '001', name: 'G. Pappas' },
  { id: '002', name: 'K. Nakos' },
  { id: '003', name: 'N. Katsis' },
  { id: '004', name: 'M. Lekkas' },
  { id: '005', name: 'S. Dimos' },
  { id: '006', name: 'P. Athinos' },
  { id: '008', name: 'V. Chronis' },
  { id: '009', name: 'A. Tsiotis' },
];

export const MODULES: string[] = [
  'H.A.L.O. #001', 'H.A.L.O. #002', 'H.A.L.O. #003', 'H.A.L.O. #004',
  'H.A.L.O. #005', 'H.A.L.O. #006', 'H.A.L.O. #008', 'H.A.L.O. #009',
];

export const ZONES: string[] = ['Zone A', 'Zone B', 'Zone C', 'Warehouse'];

export const SHIFTS_DATA: ShiftData[] = [
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

export const AN_DATA: Record<string, AnalyticsPeriod> = {
  'This Month': {
    daysClean: 12, incidents: 3, nearMiss: 7, trir: 1.8, compliance: 91, responseTime: '14s',
    incidentTypes: { Falls: 2, 'Gas Exposure': 1, Temperature: 0 },
    heatmap: { 'Block A': 1, 'Block B': 0, 'Block C': 3, 'Warehouse': 2, 'Access Road': 1 },
    nearMissByPeriod: [{ l: 'W1', v: 2 }, { l: 'W2', v: 1 }, { l: 'W3', v: 3 }, { l: 'W4', v: 1 }],
    nearMissTrend: { dir: 'up', n: 3 },
    peakHours: [{ l: '06–09', v: 1 }, { l: '09–12', v: 3 }, { l: '12–15', v: 2 }, { l: '15–18', v: 1 }, { l: '18–21', v: 0 }],
    savingsPct: 20, tier: 'Excellent',
    scoreComponents: [
      { label: 'Module Compliance', weight: 35, score: 33, color: 'var(--green)' },
      { label: 'Incident Rate', weight: 30, score: 24, color: 'var(--amber)' },
      { label: 'Near-Miss Response', weight: 20, score: 19, color: 'var(--green)' },
      { label: 'Days Without Incident', weight: 15, score: 13, color: 'var(--green)' },
    ],
  },
  'This Trimester': {
    daysClean: 4, incidents: 11, nearMiss: 22, trir: 2.4, compliance: 88, responseTime: '19s',
    incidentTypes: { Falls: 5, 'Gas Exposure': 4, Temperature: 2 },
    heatmap: { 'Block A': 3, 'Block B': 2, 'Block C': 7, 'Warehouse': 4, 'Access Road': 2 },
    nearMissByPeriod: [{ l: 'M1', v: 8 }, { l: 'M2', v: 7 }, { l: 'M3', v: 7 }],
    nearMissTrend: { dir: 'down', n: 5 },
    peakHours: [{ l: '06–09', v: 2 }, { l: '09–12', v: 7 }, { l: '12–15', v: 5 }, { l: '15–18', v: 3 }, { l: '18–21', v: 1 }],
    savingsPct: 12, tier: 'Good',
    scoreComponents: [
      { label: 'Module Compliance', weight: 35, score: 30, color: 'var(--amber)' },
      { label: 'Incident Rate', weight: 30, score: 19, color: 'var(--amber)' },
      { label: 'Near-Miss Response', weight: 20, score: 16, color: 'var(--amber)' },
      { label: 'Days Without Incident', weight: 15, score: 8, color: 'var(--red)' },
    ],
  },
  'This Semester': {
    daysClean: 2, incidents: 24, nearMiss: 51, trir: 3.1, compliance: 84, responseTime: '23s',
    incidentTypes: { Falls: 11, 'Gas Exposure': 9, Temperature: 4 },
    heatmap: { 'Block A': 6, 'Block B': 5, 'Block C': 14, 'Warehouse': 9, 'Access Road': 4 },
    nearMissByPeriod: [{ l: 'M1', v: 9 }, { l: 'M2', v: 8 }, { l: 'M3', v: 11 }, { l: 'M4', v: 8 }, { l: 'M5', v: 7 }, { l: 'M6', v: 8 }],
    nearMissTrend: { dir: 'up', n: 11 },
    peakHours: [{ l: '06–09', v: 4 }, { l: '09–12', v: 13 }, { l: '12–15', v: 9 }, { l: '15–18', v: 6 }, { l: '18–21', v: 2 }],
    savingsPct: 8, tier: 'Average',
    scoreComponents: [
      { label: 'Module Compliance', weight: 35, score: 28, color: 'var(--amber)' },
      { label: 'Incident Rate', weight: 30, score: 14, color: 'var(--red)' },
      { label: 'Near-Miss Response', weight: 20, score: 14, color: 'var(--amber)' },
      { label: 'Days Without Incident', weight: 15, score: 5, color: 'var(--red)' },
    ],
  },
  'This Year': {
    daysClean: 0, incidents: 47, nearMiss: 98, trir: 4.2, compliance: 81, responseTime: '27s',
    incidentTypes: { Falls: 21, 'Gas Exposure': 18, Temperature: 8 },
    heatmap: { 'Block A': 12, 'Block B': 9, 'Block C': 28, 'Warehouse': 18, 'Access Road': 7 },
    nearMissByPeriod: [
      { l: 'Jan', v: 9 }, { l: 'Feb', v: 8 }, { l: 'Mar', v: 7 }, { l: 'Apr', v: 11 },
      { l: 'May', v: 8 }, { l: 'Jun', v: 9 }, { l: 'Jul', v: 7 }, { l: 'Aug', v: 8 },
      { l: 'Sep', v: 10 }, { l: 'Oct', v: 7 }, { l: 'Nov', v: 8 }, { l: 'Dec', v: 6 },
    ],
    nearMissTrend: { dir: 'down', n: 14 },
    peakHours: [{ l: '06–09', v: 7 }, { l: '09–12', v: 24 }, { l: '12–15', v: 18 }, { l: '15–18', v: 11 }, { l: '18–21', v: 4 }],
    savingsPct: 5, tier: 'Needs Improvement',
    scoreComponents: [
      { label: 'Module Compliance', weight: 35, score: 25, color: 'var(--amber)' },
      { label: 'Incident Rate', weight: 30, score: 10, color: 'var(--red)' },
      { label: 'Near-Miss Response', weight: 20, score: 12, color: 'var(--amber)' },
      { label: 'Days Without Incident', weight: 15, score: 3, color: 'var(--red)' },
    ],
  },
  'All Time': {
    daysClean: 0, incidents: 89, nearMiss: 187, trir: 3.8, compliance: 83, responseTime: '25s',
    incidentTypes: { Falls: 38, 'Gas Exposure': 36, Temperature: 15 },
    heatmap: { 'Block A': 22, 'Block B': 17, 'Block C': 51, 'Warehouse': 33, 'Access Road': 13 },
    nearMissByPeriod: [{ l: "Q1'24", v: 38 }, { l: "Q2'24", v: 42 }, { l: "Q3'24", v: 51 }, { l: "Q4'24", v: 56 }],
    nearMissTrend: { dir: 'up', n: 28 },
    peakHours: [{ l: '06–09', v: 12 }, { l: '09–12', v: 46 }, { l: '12–15', v: 34 }, { l: '15–18', v: 21 }, { l: '18–21', v: 8 }],
    savingsPct: 6, tier: 'Average',
    scoreComponents: [
      { label: 'Module Compliance', weight: 35, score: 26, color: 'var(--amber)' },
      { label: 'Incident Rate', weight: 30, score: 12, color: 'var(--red)' },
      { label: 'Near-Miss Response', weight: 20, score: 13, color: 'var(--amber)' },
      { label: 'Days Without Incident', weight: 15, score: 4, color: 'var(--red)' },
    ],
  },
};

export const MOD_DATA: ModuleData[] = [
  { id: '003', worker: 'N. Katsis',  status: 'crit', note: 'Fall detected — man-down 08:44', batt: 61 },
  { id: '009', worker: 'A. Tsiotis', status: 'warn', note: 'CO₂ 1240 ppm — limit exceeded',  batt: 44 },
  { id: '001', worker: 'G. Pappas',  status: 'ok',   note: 'Zone A · All sensors normal',    batt: 82 },
  { id: '002', worker: 'K. Nakos',   status: 'ok',   note: 'Zone B · All sensors normal',    batt: 78 },
  { id: '004', worker: 'M. Lekkas',  status: 'ok',   note: 'Zone B · All sensors normal',    batt: 76 },
  { id: '005', worker: 'S. Dimos',   status: 'ok',   note: 'Zone C · All sensors normal',    batt: 95 },
  { id: '006', worker: 'P. Athinos', status: 'ok',   note: 'Zone C · All sensors normal',    batt: 72 },
  { id: '008', worker: 'V. Chronis', status: 'ok',   note: 'Warehouse · All sensors normal', batt: 58 },
  { id: '007', worker: 'Unassigned', status: 'off',  note: 'No worker paired this shift',    batt: null },
];

export const PIN_DEFS = [
  { n: '1', pct: [18, 70] },
  { n: '2', pct: [70, 64] },
  { n: '3', pct: [55, 30] },
  { n: '4', pct: [25, 20] },
];

export const ANALYTICS_PERIODS = ['This Month', 'This Trimester', 'This Semester', 'This Year', 'All Time'] as const;
export type AnalyticsPeriodKey = typeof ANALYTICS_PERIODS[number];
