export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logActivity } from '@/lib/audit';

export async function POST(req: Request, { params }: { params: { token: string } }) {
  const { token } = params;
  try {
    const { email, accessCode, partyId } = await req.json();

    // Find agreement by secureShareToken or party viewToken
    let agreement = await prisma.agreement.findUnique({
      where: { secureShareToken: token },
      include: { parties: true },
    });

    if (!agreement) {
      const party = await prisma.agreementParty.findUnique({
        where: { viewToken: token },
        include: { agreement: { include: { parties: true } } },
      });
      if (party) {
        agreement = party.agreement;
      }
    }

    if (!agreement) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
    }

    // Match party by partyId or email
    const party = agreement.parties.find(
      (p) =>
        (partyId && p.id === partyId) ||
        (email && p.email.toLowerCase().trim() === email.toLowerCase().trim())
    );

    if (!party) {
      return NextResponse.json({ error: 'Party not associated with this agreement' }, { status: 404 });
    }

    // Verify code if provided
    if (accessCode && party.accessCode && accessCode.trim() !== party.accessCode.trim()) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Mark reviewed
    await prisma.agreementParty.update({
      where: { id: party.id },
      data: {
        openedAt: party.openedAt || new Date(),
        reviewedAt: new Date(),
        status: party.status === 'PENDING' ? 'REVIEWED' : party.status,
      },
    });

    await logActivity({
      action: 'PARTY_VERIFIED_ACCESS',
      entityType: 'AGREEMENT',
      entityId: agreement.id,
      details: { partyName: party.name, partyEmail: party.email, agreementTitle: agreement.title },
    });

    return NextResponse.json({
      success: true,
      verifiedParty: {
        id: party.id,
        name: party.name,
        email: party.email,
        role: party.role,
        organization: party.organization,
        status: party.status,
        viewToken: party.viewToken,
      },
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}

