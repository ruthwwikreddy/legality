import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role === 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized: Staff access required' }, { status: 403 });
  }

  const [
    totalClients,
    totalRequests,
    newRequests,
    activeRequests,
    pendingApprovals,
    completedRequests,
    pendingSignatures,
    totalAgreements,
    recentRequests,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'CLIENT', isActive: true } }),
    prisma.serviceRequest.count(),
    prisma.serviceRequest.count({ where: { status: 'SUBMITTED' } }),
    prisma.serviceRequest.count({
      where: { status: { in: ['IN_PROGRESS', 'UNDER_REVIEW', 'AWAITING_CLIENT_INFO'] } },
    }),
    prisma.serviceRequest.count({ where: { status: 'AWAITING_APPROVAL' } }),
    prisma.serviceRequest.count({ where: { status: 'COMPLETED' } }),
    prisma.agreement.count({
      where: { status: { in: ['AWAITING_SIGNATURES', 'PARTIALLY_SIGNED'] } },
    }),
    prisma.agreement.count(),
    prisma.serviceRequest.findMany({
      take: 6,
      orderBy: { updatedAt: 'desc' },
      include: {
        client: {
          select: {
            fullName: true,
            email: true,
            clientProfile: { select: { organizationName: true } },
          },
        },
        assignments: {
          include: {
            employee: { select: { fullName: true } },
          },
        },
      },
    }),
  ]);

  return NextResponse.json({
    metrics: {
      totalClients,
      totalRequests,
      newRequests,
      activeRequests,
      pendingApprovals,
      pendingSignatures,
      completedRequests,
      totalAgreements,
    },
    recentRequests,
  });
}

