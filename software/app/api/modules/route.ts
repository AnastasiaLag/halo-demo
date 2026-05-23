import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const STATUS_ORDER: Record<string, number> = { crit: 0, warn: 1, ok: 2, off: 3 };

export async function GET() {
  try {
    const modules = await prisma.module.findMany();
    modules.sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));
    return NextResponse.json(modules, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
