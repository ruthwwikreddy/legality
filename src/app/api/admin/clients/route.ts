export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role === 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized: Staff access required' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');

  const whereClause: any = { role: 'CLIENT' };

  if (search) {
    whereClause.OR = [
      { fullName: { contains: search } },
      { email: { contains: search } },
      { clientProfile: { organizationName: { contains: search } } },
    ];
  }

  const clients = await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      clientProfile: true,
      _count: {
        select: {
          clientRequests: true,
          documentsUploaded: true,
          complianceRecords: true,
        },
      },
      clientRequests: {
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          trackingNumber: true,
          title: true,
          status: true,
          category: true,
          createdAt: true,
        },
      },
    },
  });

  return NextResponse.json({ clients });
}

