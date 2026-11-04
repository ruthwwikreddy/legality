export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import { createNotification } from '@/lib/notifications';
import crypto from 'crypto';

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const whereClause: any = {};

  if (user.role === 'CLIENT') {
    whereClause.OR = [
      { createdById: user.id },
      { parties: { some: { email: user.email } } },
    ];
  }

  if (status) {
    whereClause.status = status;
  }

  if (search) {
    whereClause.AND = [
      {
        OR: [
          { title: { contains: search } },
          { trackingNumber: { contains: search } },
        ],
      },
    ];
  }

  const agreements = await prisma.agreement.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      template: {
        select: { id: true, title: true, category: true },
      },
      parties: {
        include: {
          signature: true,
        },
      },
    },
  });

  return NextResponse.json({ agreements });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role === 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized: Staff access required to create agreements' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, category, templateId, content, effectiveDate, expiryDate, parties } = body;

    if (!title || !content || !parties || !Array.isArray(parties) || parties.length === 0) {
      return NextResponse.json(
        { error: 'Title, agreement content, and at least one party are required' },
        { status: 400 }
      );
    }

    const count = await prisma.agreement.count();
    const trackingNumber = `AGR-2026-${String(count + 1).padStart(4, '0')}`;
    const secureShareToken = crypto.randomBytes(24).toString('hex');

    // Prepare parties with unique view tokens and 6-digit access codes
    const partyData = parties.map((p: any, idx: number) => ({
      name: p.name.trim(),
      email: p.email.toLowerCase().trim(),
      phone: p.phone || null,
      organization: p.organization || null,
      designation: p.designation || null,
      role: p.role || `Party ${idx + 1}`,
      partyOrder: idx + 1,
      viewToken: crypto.randomBytes(24).toString('hex'),
      accessCode: Math.floor(100000 + Math.random() * 900000).toString(),
      status: 'PENDING',
    }));

    const agreement = await prisma.agreement.create({
      data: {
        trackingNumber,
        templateId: templateId || null,
        title: title.trim(),
        category: category || 'MOU_AGREEMENTS',
        status: 'AWAITING_SIGNATURES',
        content,
        effectiveDate: effectiveDate ? new Date(effectiveDate) : new Date(),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        secureShareToken,
        createdById: user.id,
        parties: {
          create: partyData,
        },
      },
      include: {
        parties: true,
      },
    });

    await logActivity({
      userId: user.id,
      action: 'AGREEMENT_CREATED',
      entityType: 'AGREEMENT',
      entityId: agreement.id,
      details: {
        trackingNumber,
        title,
        partiesCount: parties.length,
      },
    });

    // Notify registered parties if they have user accounts
    for (const party of agreement.parties) {
      const partyUser = await prisma.user.findUnique({
        where: { email: party.email },
      });
      if (partyUser) {
        await createNotification({
          userId: partyUser.id,
          title: `Agreement Ready for Signature: ${agreement.trackingNumber}`,
          message: `You have been requested to review and sign "${agreement.title}".`,
          type: 'SIGNATURE_REQUEST',
          link: `/agreements/sign/${agreement.secureShareToken}`,
        });
      }
    }

    return NextResponse.json({ success: true, agreement });
  } catch (error) {
    console.error('Agreement creation error:', error);
    return NextResponse.json({ error: 'Failed to create agreement' }, { status: 500 });
  }
}

