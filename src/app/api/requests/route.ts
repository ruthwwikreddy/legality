export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import { createNotification } from '@/lib/notifications';

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const whereClause: any = {};

  // Role based filtering: Client only sees their own requests
  if (user.role === 'CLIENT') {
    whereClause.clientId = user.id;
  }

  if (category) {
    whereClause.category = category;
  }

  if (status) {
    whereClause.status = status;
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search } },
      { trackingNumber: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const requests = await prisma.serviceRequest.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      client: {
        select: {
          id: true,
          fullName: true,
          email: true,
          clientProfile: {
            select: {
              organizationName: true,
              industry: true,
            },
          },
        },
      },
      assignments: {
        include: {
          employee: {
            select: {
              id: true,
              fullName: true,
              email: true,
              employeeProfile: {
                select: {
                  designation: true,
                  department: true,
                },
              },
            },
          },
        },
      },
      updates: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: {
          documents: true,
          updates: true,
          internalNotes: true,
        },
      },
    },
  });

  return NextResponse.json({ requests });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { category, title, description, priority, dynamicData } = body;

    if (!category || !title || !description) {
      return NextResponse.json(
        { error: 'Category, title, and description are required' },
        { status: 400 }
      );
    }

    // Generate readable tracking number
    const count = await prisma.serviceRequest.count();
    const trackingNumber = `LEG-2026-${String(1000 + count + 1).padStart(4, '0')}`;

    const newRequest = await prisma.serviceRequest.create({
      data: {
        trackingNumber,
        clientId: user.id,
        category,
        title: title.trim(),
        description: description.trim(),
        priority: priority || 'MEDIUM',
        status: 'SUBMITTED',
        dynamicData: dynamicData ? JSON.stringify(dynamicData) : null,
      },
      include: {
        client: true,
      },
    });

    // Add initial status update
    await prisma.requestUpdate.create({
      data: {
        requestId: newRequest.id,
        authorId: user.id,
        status: 'SUBMITTED',
        message: 'Service request created and submitted for legal intake review.',
        isPublicToClient: true,
      },
    });

    await logActivity({
      userId: user.id,
      action: 'REQUEST_SUBMITTED',
      entityType: 'REQUEST',
      entityId: newRequest.id,
      details: { trackingNumber, category, title },
    });

    // Notify admins
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true },
    });

    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        title: `New Request: ${trackingNumber}`,
        message: `${user.fullName} submitted a request: "${title}"`,
        type: 'REQUEST_STATUS',
        link: `/admin/requests/${newRequest.id}`,
      });
    }

    return NextResponse.json({ success: true, request: newRequest });
  } catch (error) {
    console.error('Create request error:', error);
    return NextResponse.json({ error: 'Failed to create service request' }, { status: 500 });
  }
}

