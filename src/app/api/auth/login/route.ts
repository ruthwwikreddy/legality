import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { logActivity } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        clientProfile: true,
        employeeProfile: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Invalid credentials or inactive account' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    await logActivity({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'USER',
      entityId: user.id,
      details: { email: user.email, role: user.role },
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
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during sign in' }, { status: 500 });
  }
}

