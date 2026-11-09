export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { logActivity } from '@/lib/audit';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fullName, phone, organizationName, businessType, taxId, industry, address, designation, department } = body;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(fullName ? { fullName: fullName.trim() } : {}),
        phone: phone !== undefined ? phone : user.phone,
        ...(user.role === 'CLIENT'
          ? {
              clientProfile: {
                upsert: {
                  create: {
                    organizationName: organizationName || null,
                    businessType: businessType || null,
                    taxId: taxId || null,
                    industry: industry || null,
                    address: address || null,
                  },
                  update: {
                    organizationName: organizationName !== undefined ? organizationName : undefined,
                    businessType: businessType !== undefined ? businessType : undefined,
                    taxId: taxId !== undefined ? taxId : undefined,
                    industry: industry !== undefined ? industry : undefined,
                    address: address !== undefined ? address : undefined,
                  },
                },
              },
            }
          : {}),
        ...(user.role === 'EMPLOYEE' || user.role === 'ADMIN'
          ? {
              employeeProfile: {
                upsert: {
                  create: {
                    designation: designation || 'Legal Staff',
                    department: department || 'General Practice',
                    phone: phone || null,
                  },
                  update: {
                    designation: designation !== undefined ? designation : undefined,
                    department: department !== undefined ? department : undefined,
                    phone: phone !== undefined ? phone : undefined,
                  },
                },
              },
            }
          : {}),
      },
      include: {
        clientProfile: true,
        employeeProfile: true,
      },
    });

    await logActivity({
      userId: user.id,
      action: 'PROFILE_UPDATED',
      entityType: 'USER',
      entityId: user.id,
      details: { updatedFields: Object.keys(body) },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
