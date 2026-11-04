export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
  }

  const { id } = params;
  try {
    const body = await req.json();
    const { isActive, role, designation, department, barCouncilNumber, phone } = body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(isActive !== undefined ? { isActive } : {}),
        ...(role ? { role } : {}),
        ...(phone !== undefined ? { phone } : {}),
        employeeProfile: {
          update: {
            ...(designation ? { designation } : {}),
            ...(department ? { department } : {}),
            ...(barCouncilNumber !== undefined ? { barCouncilNumber } : {}),
          },
        },
      },
      include: {
        employeeProfile: true,
      },
    });

    await logActivity({
      userId: user.id,
      action: 'TEAM_MEMBER_UPDATED',
      entityType: 'USER',
      entityId: id,
      details: { isActive, role, designation },
    });

    return NextResponse.json({ success: true, employee: updatedUser });
  } catch (error) {
    console.error('Update employee error:', error);
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

