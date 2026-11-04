import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  const serviceRequest = await prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      client: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          clientProfile: true,
        },
      },
      assignments: {
        include: {
          employee: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              employeeProfile: true,
            },
          },
        },
      },
      updates: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
        },
      },
      documents: {
        where: user.role === 'CLIENT' ? { isClientVisible: true } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
          versions: {
            orderBy: { versionNumber: 'desc' },
          },
        },
      },
      internalNotes: user.role !== 'CLIENT'
        ? {
            orderBy: { createdAt: 'desc' },
            include: {
              author: {
                select: {
                  id: true,
                  fullName: true,
                  role: true,
                },
              },
            },
          }
        : false,
      complianceRecords: {
        include: {
          tasks: true,
        },
      },
    },
  });

  if (!serviceRequest) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  // Client access security check
  if (user.role === 'CLIENT' && serviceRequest.clientId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ request: serviceRequest });
}

