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
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const whereClause: any = {};

  if (user.role === 'CLIENT') {
    whereClause.clientId = user.id;
  }

  if (status) {
    whereClause.status = status;
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search } },
      { trackingNumber: { contains: search } },
      { authority: { contains: search } },
    ];
  }

  const records = await prisma.complianceRecord.findMany({
    where: whereClause,
    orderBy: { deadline: 'asc' },
    include: {
      client: {
        select: {
          id: true,
          fullName: true,
          email: true,
          clientProfile: {
            select: {
              organizationName: true,
            },
          },
        },
      },
      request: {
        select: {
          id: true,
          trackingNumber: true,
          title: true,
        },
      },
      tasks: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  return NextResponse.json({ records });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role === 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized: Staff access required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { clientId, requestId, title, category, authority, deadline, notes, tasks } = body;

    if (!clientId || !title || !category || !authority || !deadline) {
      return NextResponse.json(
        { error: 'Client, title, category, authority, and deadline are required' },
        { status: 400 }
      );
    }

    const count = await prisma.complianceRecord.count();
    const trackingNumber = `CMP-2026-${String(count + 1).padStart(4, '0')}`;

    const record = await prisma.complianceRecord.create({
      data: {
        trackingNumber,
        clientId,
        requestId: requestId || null,
        title: title.trim(),
        category,
        authority: authority.trim(),
        deadline: new Date(deadline),
        notes: notes || null,
        status: 'PENDING',
        assignedToId: user.id,
        tasks: {
          create: Array.isArray(tasks)
            ? tasks.map((t: any) => ({
                title: t.title.trim(),
                description: t.description || null,
                dueDate: t.dueDate ? new Date(t.dueDate) : null,
                isCompleted: false,
              }))
            : [],
        },
      },
      include: {
        tasks: true,
        client: true,
      },
    });

    await logActivity({
      userId: user.id,
      action: 'COMPLIANCE_RECORD_CREATED',
      entityType: 'COMPLIANCE',
      entityId: record.id,
      details: { trackingNumber, title, authority, deadline },
    });

    await createNotification({
      userId: clientId,
      title: `Compliance Requirement Added: ${trackingNumber}`,
      message: `New compliance obligation logged: "${title}" (Due: ${new Date(deadline).toLocaleDateString()}).`,
      type: 'COMPLIANCE_DEADLINE',
      link: `/portal/compliance`,
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Compliance create error:', error);
    return NextResponse.json({ error: 'Failed to create compliance record' }, { status: 500 });
  }
}

