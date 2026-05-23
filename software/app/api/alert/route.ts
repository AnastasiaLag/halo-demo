import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { moduleId, type } = await req.json();

    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const status = type === 'fall' ? 'crit' : 'warn';
    const note =
      type === 'fall' ? `Fall detected — man-down ${time}` :
      type === 'gas'  ? 'CO₂ 1240 ppm — limit exceeded' :
                        'Temperature limit exceeded';

    await prisma.alert.create({ data: { moduleId, type } });

    const updated = await prisma.module.update({
      where: { id: moduleId },
      data: { status, note },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
