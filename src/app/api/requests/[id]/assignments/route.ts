import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import { createNotification } from '@/lib/notifications';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role === 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized: Admin or Counsel access required' }, { status: 403 });
  }

  const { id } = params;
  try {
    const { employeeId, role = 'PRIMARY_COUNSEL' } = await req.json();

    const request = await prisma.serviceRequest.findUnique({
      where: { id },
    });
    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
      include: { employeeProfile: true },
    });
    if (!employee || employee.role === 'CLIENT') {
      return NextResponse.json({ error: 'Selected user is not an employee' }, { status: 400 });
    }

    // Upsert assignment
    const assignment = await prisma.requestAssignment.upsert({
      where: {
        requestId_employeeId: {
          requestId: id,
          employeeId,
        },
      },
      update: { role },
      create: {
        requestId: id,
        employeeId,
        role,
      },
    });

    // Automatically transition from SUBMITTED to UNDER_REVIEW if not already progressed
    if (request.status === 'SUBMITTED') {
      await prisma.serviceRequest.update({
        where: { id },
        data: { status: 'UNDER_REVIEW' },
      });

      await prisma.requestUpdate.create({
        data: {
          requestId: id,
          authorId: user.id,
          status: 'UNDER_REVIEW',
          message: `Request assigned to ${employee.fullName} (${employee.employeeProfile?.designation || 'Counsel'}). Intake review in progress.`,
          isPublicToClient: true,
        },
      });
    }

    await logActivity({
      userId: user.id,
      action: 'REQUEST_ASSIGNED',
      entityType: 'REQUEST',
      entityId: id,
      details: {
        assignedEmployee: employee.fullName,
        employeeId,
        role,
      },
    });

    // Notify assigned employee
    await createNotification({
      userId: employeeId,
      title: `Assignment: ${request.trackingNumber}`,
      message: `You have been assigned as ${role} for "${request.title}".`,
      type: 'REQUEST_STATUS',
      link: `/admin/requests/${id}`,
    });

    return NextResponse.json({ success: true, assignment });
  } catch (error) {
    console.error('Assignment error:', error);
    return NextResponse.json({ error: 'Failed to assign employee' }, { status: 500 });
  }
}

