import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

