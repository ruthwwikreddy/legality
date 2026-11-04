import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role === 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized: Staff access required' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const action = searchParams.get('action');

  const whereClause: any = {};
  if (action) {
    whereClause.action = action;
  }

  const logs = await prisma.activityLog.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return NextResponse.json({ logs });
}

