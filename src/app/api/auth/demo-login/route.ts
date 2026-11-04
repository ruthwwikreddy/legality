export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const { roleKey } = await req.json();

    let email = 'admin@legality.in';
    if (roleKey === 'counsel') email = 'counsel@legality.in';
    else if (roleKey === 'associate') email = 'associate@legality.in';
    else if (roleKey === 'client1') email = 'client@techcorp.in';
    else if (roleKey === 'client2') email = 'client@innovate.in';

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        clientProfile: true,
        employeeProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Demo user not found. Please run seed.' }, { status: 404 });
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    await logActivity({
      userId: user.id,
      action: 'DEMO_LOGIN_SWITCH',
      entityType: 'USER',
      entityId: user.id,
      details: { email: user.email, role: user.role, roleKey },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        clientProfile: user.clientProfile,
        employeeProfile: user.employeeProfile,
      },
      redirectTo: user.role === 'CLIENT' ? '/portal' : '/admin',
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Demo login error:', error);
    return NextResponse.json({ error: 'Failed to switch demo account' }, { status: 500 });
  }
}

