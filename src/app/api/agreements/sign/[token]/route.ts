export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logActivity } from '@/lib/audit';
import { createNotification } from '@/lib/notifications';

export async function GET(req: Request, { params }: { params: { token: string } }) {
  const { token } = params;

  // Check if token matches agreement secureShareToken
  let agreement = await prisma.agreement.findUnique({
    where: { secureShareToken: token },
    include: {
      parties: {
        include: {
          signature: true,
        },
        orderBy: { partyOrder: 'asc' },
      },
    },
  });

  let activeParty = null;

  // If not matched, check if token matches an individual party's viewToken
  if (!agreement) {
    const party = await prisma.agreementParty.findUnique({
      where: { viewToken: token },
      include: {
        agreement: {
          include: {
            parties: {
              include: { signature: true },
              orderBy: { partyOrder: 'asc' },
            },
          },
        },
        signature: true,
      },
    });

    if (party) {
      agreement = party.agreement;
      activeParty = {
        id: party.id,
        name: party.name,
        email: party.email,
        phone: party.phone,
        organization: party.organization,
        designation: party.designation,
        role: party.role,
        status: party.status,
        accessCode: party.accessCode,
        isSigned: !!party.signature,
      };

      // Mark party as viewed if pending
      if (party.status === 'PENDING') {
        await prisma.agreementParty.update({
          where: { id: party.id },
          data: {
            status: 'VIEWED',
            openedAt: party.openedAt || new Date(),
          },
        });
      }
    }
  }

  if (!agreement) {
    return NextResponse.json({ error: 'Invalid or expired signing link' }, { status: 404 });
  }

  return NextResponse.json({
    agreement: {
      id: agreement.id,
      trackingNumber: agreement.trackingNumber,
      title: agreement.title,
      category: agreement.category,
      status: agreement.status,
      content: agreement.content,
      effectiveDate: agreement.effectiveDate,
      expiryDate: agreement.expiryDate,
      secureShareToken: agreement.secureShareToken,
      pdfPath: agreement.pdfPath,
      createdAt: agreement.createdAt,
      parties: agreement.parties.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        organization: p.organization,
        designation: p.designation,
        role: p.role,
        partyOrder: p.partyOrder,
        status: p.status,
        openedAt: p.openedAt,
        reviewedAt: p.reviewedAt,
        accessCode: p.accessCode,
        isSigned: !!p.signature,
        signature: p.signature
          ? {
              signatureType: p.signature.signatureType,
              signerName: p.signature.signerName,
              signedAt: p.signature.signedAt,
              ipAddress: p.signature.ipAddress,
              checksum: p.signature.checksum,
            }
          : null,
      })),
    },
    activeParty,
  });
}

// POST: Request revisions on agreement
export async function POST(req: Request, { params }: { params: { token: string } }) {
  const { token } = params;

  try {
    const body = await req.json();
    const { partyId, notes } = body;

    if (!partyId || !notes) {
      return NextResponse.json({ error: 'Party ID and revision notes are required' }, { status: 400 });
    }

    // Locate agreement by secureShareToken or party viewToken
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

    const party = agreement.parties.find((p) => p.id === partyId);
    if (!party) {
      return NextResponse.json({ error: 'Signatory party not identified' }, { status: 403 });
    }

    // Update party status to DECLINED/REVISION_REQUESTED
    await prisma.agreementParty.update({
      where: { id: partyId },
      data: {
        status: 'DECLINED',
        reviewedAt: new Date(),
      },
    });

    // Update agreement status to SENT_FOR_REVIEW or DRAFT
    await prisma.agreement.update({
      where: { id: agreement.id },
      data: {
        status: 'SENT_FOR_REVIEW',
      },
    });

    // Log activity
    await logActivity({
      action: 'AGREEMENT_REVISION_REQUESTED',
      entityType: 'AGREEMENT',
      entityId: agreement.id,
      details: {
        trackingNumber: agreement.trackingNumber,
        partyName: party.name,
        partyEmail: party.email,
        revisionNotes: notes,
      },
    });

    // Notify creator
    await createNotification({
      userId: agreement.createdById,
      title: `Revisions Requested: ${agreement.trackingNumber}`,
      message: `${party.name} (${party.organization || party.role}) requested revisions on "${agreement.title}": "${notes.slice(0, 100)}"`,
      type: 'REVISION_REQUEST',
      link: `/admin/agreements/${agreement.id}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Revision request successfully transmitted to legal counsel.',
    });
  } catch (error) {
    console.error('Revision request error:', error);
    return NextResponse.json({ error: 'Failed to submit revision request' }, { status: 500 });
  }
}
