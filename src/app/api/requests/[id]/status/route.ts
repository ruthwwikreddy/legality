export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import { createNotification } from '@/lib/notifications';
import { REQUEST_STATUS_LABELS, RequestStatus } from '@/lib/types';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role === 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized: Staff access required' }, { status: 403 });
  }

  const { id } = params;
  try {
    const { status, message } = await req.json();

    const existing = await prisma.serviceRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const updated = await prisma.serviceRequest.update({
      where: { id },
      data: { status },
    });

    const statusLabel = REQUEST_STATUS_LABELS[status as RequestStatus]?.label || status;
    const defaultMsg = `Status changed to ${statusLabel}.`;

    await prisma.requestUpdate.create({
      data: {
        requestId: id,
        authorId: user.id,
        status,
        message: message ? `${message}` : defaultMsg,
        isPublicToClient: true,
      },
    });

    await logActivity({
      userId: user.id,
      action: 'REQUEST_STATUS_UPDATED',
      entityType: 'REQUEST',
      entityId: id,
      details: {
        oldStatus: existing.status,
        newStatus: status,
        message,
      },
    });

    // Notify client
    await createNotification({
      userId: existing.clientId,
      title: `Status Updated: ${existing.trackingNumber}`,
      message: `Your request "${existing.title}" is now "${statusLabel}". ${message || ''}`,
      type: 'REQUEST_STATUS',
      link: `/portal/requests/${id}`,
    });

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error('Update status error:', error);
    return NextResponse.json({ error: 'Failed to update request status' }, { status: 500 });
  }
}

