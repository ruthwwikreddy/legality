import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role === 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized: Staff access required' }, { status: 403 });
  }

  const { id } = params;
  try {
    const { status, notes } = await req.json();

    const record = await prisma.complianceRecord.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    await logActivity({
      userId: user.id,
      action: 'COMPLIANCE_STATUS_UPDATED',
      entityType: 'COMPLIANCE',
      entityId: id,
      details: { newStatus: status, notes },
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error('Compliance status update error:', error);
    return NextResponse.json({ error: 'Failed to update compliance record status' }, { status: 500 });
  }
}

