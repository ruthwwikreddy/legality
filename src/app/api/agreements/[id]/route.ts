export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  const agreement = await prisma.agreement.findUnique({
    where: { id },
    include: {
      template: true,
      parties: {
        include: {
          signature: true,
        },
        orderBy: { partyOrder: 'asc' },
      },
    },
  });

  if (!agreement) {
    return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
  }

  // Client access control
  if (user.role === 'CLIENT') {
    const isParty = agreement.parties.some((p) => p.email === user.email);
    if (!isParty && agreement.createdById !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  return NextResponse.json({ agreement });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role === 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized: Staff access required' }, { status: 403 });
  }

  const { id } = params;
  try {
    const body = await req.json();
    const { title, content, status } = body;

    const updated = await prisma.agreement.update({
      where: { id },
      data: {
        ...(title ? { title: title.trim() } : {}),
        ...(content ? { content } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        parties: {
          include: { signature: true },
        },
      },
    });

    return NextResponse.json({ success: true, agreement: updated });
  } catch (error) {
    console.error('Agreement update error:', error);
    return NextResponse.json({ error: 'Failed to update agreement' }, { status: 500 });
  }
}

