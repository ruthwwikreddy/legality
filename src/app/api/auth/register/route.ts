export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import { createNotification } from '@/lib/notifications';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      fullName,
      email,
      password,
      phone,
      organizationName,
      businessType,
      address,
      taxId,
      industry,
    } = data;

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Full name, email, and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: normalizedEmail,
        passwordHash,
        phone: phone || null,
        role: 'CLIENT',
        clientProfile: {
          create: {
            organizationName: organizationName || null,
            businessType: businessType || null,
            address: address || null,
            taxId: taxId || null,
            industry: industry || null,
          },
        },
      },
      include: {
        clientProfile: true,
      },
    });

    await logActivity({
      userId: user.id,
      action: 'USER_REGISTERED',
      entityType: 'USER',
      entityId: user.id,
      details: { email: user.email, organization: organizationName },
    });

    await createNotification({
      userId: user.id,
      title: 'Welcome to LEGALITY',
      message: 'Your client account has been created. You can now request legal services, upload documents, and review agreements.',
      type: 'SYSTEM',
      link: '/portal',
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        clientProfile: user.clientProfile,
      },
      redirectTo: '/portal',
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
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 });
  }
}

