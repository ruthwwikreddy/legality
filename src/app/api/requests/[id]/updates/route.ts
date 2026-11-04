export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import { createNotification } from '@/lib/notifications';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  try {
    const { message, status } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const request = await prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        assignments: true,
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (user.role === 'CLIENT' && request.clientId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update status if provided (and user is staff, or if client is responding to awaiting info)
    let newStatus = request.status;
    if (user.role === 'CLIENT' && request.status === 'AWAITING_CLIENT_INFO') {
      newStatus = 'IN_PROGRESS';
      await prisma.serviceRequest.update({
        where: { id },
        data: { status: 'IN_PROGRESS' },
      });
    } else if (user.role !== 'CLIENT' && status) {
      newStatus = status;
      await prisma.serviceRequest.update({
        where: { id },
        data: { status },
      });
    }

    const update = await prisma.requestUpdate.create({
      data: {
        requestId: id,
        authorId: user.id,
        status: newStatus,
        message: message.trim(),
        isPublicToClient: true,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    await logActivity({
      userId: user.id,
      action: 'REQUEST_UPDATE_POSTED',
      entityType: 'REQUEST',
      entityId: id,
      details: { author: user.fullName, message: message.substring(0, 100) },
    });

    // Notify counterpart
    if (user.role === 'CLIENT') {
      // Notify assigned staff
      for (const assign of request.assignments) {
        await createNotification({
          userId: assign.employeeId,
          title: `Client Reply: ${request.trackingNumber}`,
          message: `${user.fullName} posted an update on "${request.title}"`,
          type: 'REQUEST_STATUS',
          link: `/admin/requests/${id}`,
        });
      }
    } else {
      // Notify client
      await createNotification({
        userId: request.clientId,
        title: `Legal Update: ${request.trackingNumber}`,
        message: `${user.fullName} updated your request "${request.title}"`,
        type: 'REQUEST_STATUS',
        link: `/portal/requests/${id}`,
      });
    }

    return NextResponse.json({ success: true, update });
  } catch (error) {
    console.error('Update posting error:', error);
    return NextResponse.json({ error: 'Failed to post update' }, { status: 500 });
  }
}

