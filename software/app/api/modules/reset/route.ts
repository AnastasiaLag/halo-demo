import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SEED = [
  { id: '003', worker: 'N. Katsis',  status: 'crit', batt: 61,   note: 'Fall detected — man-down 08:44' },
  { id: '009', worker: 'A. Tsiotis', status: 'warn', batt: 44,   note: 'CO₂ 1240 ppm — limit exceeded' },
  { id: '001', worker: 'G. Pappas',  status: 'ok',   batt: 82,   note: 'Zone A · All sensors normal' },
  { id: '002', worker: 'K. Nakos',   status: 'ok',   batt: 78,   note: 'Zone B · All sensors normal' },
  { id: '004', worker: 'M. Lekkas',  status: 'ok',   batt: 76,   note: 'Zone B · All sensors normal' },
  { id: '005', worker: 'S. Dimos',   status: 'ok',   batt: 95,   note: 'Zone C · All sensors normal' },
  { id: '006', worker: 'P. Athinos', status: 'ok',   batt: 72,   note: 'Zone C · All sensors normal' },
  { id: '008', worker: 'V. Chronis', status: 'ok',   batt: 58,   note: 'Warehouse · All sensors normal' },
  { id: '007', worker: 'Unassigned', status: 'off',  batt: null, note: 'No worker paired this shift' },
];

export async function POST() {
  try {
    for (const m of SEED) {
      await prisma.module.update({ where: { id: m.id }, data: m });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
