export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const requestId = searchParams.get('requestId');
  const search = searchParams.get('search');

  const whereClause: any = {};

  if (user.role === 'CLIENT') {
    whereClause.AND = [
      { isClientVisible: true },
      {
        OR: [
          { clientId: user.id },
          { uploadedById: user.id },
          { request: { clientId: user.id } },
        ],
      },
    ];
  }

  if (category) {
    whereClause.category = category;
  }

  if (requestId) {
    whereClause.requestId = requestId;
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search } },
      { fileName: { contains: search } },
    ];
  }

  const documents = await prisma.document.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      uploadedBy: {
        select: {
          id: true,
          fullName: true,
          role: true,
        },
      },
      request: {
        select: {
          id: true,
          trackingNumber: true,
          title: true,
          category: true,
        },
      },
      versions: {
        orderBy: { versionNumber: 'desc' },
      },
    },
  });

  return NextResponse.json({ documents });
}

