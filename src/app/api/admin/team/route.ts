export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role === 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized: Staff access required' }, { status: 403 });
  }

  const team = await prisma.user.findMany({
    where: {
      role: { in: ['ADMIN', 'EMPLOYEE'] },
    },
    orderBy: { createdAt: 'asc' },
    include: {
      employeeProfile: true,
      _count: {
        select: {
          assignedRequests: true,
          updatesCreated: true,
        },
      },
      assignedRequests: {
        include: {
          request: {
            select: {
              id: true,
              trackingNumber: true,
              title: true,
              status: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ team });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { fullName, email, password, phone, role = 'EMPLOYEE', designation, department, barCouncilNumber } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Full name, email, and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const employee = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: normalizedEmail,
        passwordHash,
        phone: phone || null,
        role: role === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE',
        employeeProfile: {
          create: {
            designation: designation || 'Legal Associate',
            department: department || 'General Legal Practice',
            barCouncilNumber: barCouncilNumber || null,
            phone: phone || null,
          },
        },
      },
      include: {
        employeeProfile: true,
      },
    });

    await logActivity({
      userId: user.id,
      action: 'TEAM_MEMBER_ADDED',
      entityType: 'USER',
      entityId: employee.id,
      details: { email: employee.email, designation, role },
    });

    return NextResponse.json({ success: true, employee });
  } catch (error) {
    console.error('Create employee error:', error);
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}

