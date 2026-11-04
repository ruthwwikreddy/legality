export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateAgreementPdf } from '@/lib/pdf';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const agreement = await prisma.agreement.findUnique({
    where: { id },
    include: {
      parties: {
        include: { signature: true },
        orderBy: { partyOrder: 'asc' },
      },
    },
  });

  if (!agreement) {
    return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
  }

  // If already compiled to disk, serve file directly
  if (agreement.pdfPath) {
    try {
      const fullPath = path.join(process.cwd(), 'public', agreement.pdfPath);
      const fileData = await fs.readFile(fullPath);
      return new NextResponse(fileData, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${agreement.trackingNumber}.pdf"`,
        },
      });
    } catch {
      // Fallback to on-demand generation below
    }
  }

  // Generate on-demand
  try {
    const { buffer } = await generateAgreementPdf({
      title: agreement.title,
      trackingNumber: agreement.trackingNumber,
      category: agreement.category,
      content: agreement.content,
      createdAt: agreement.createdAt,
      effectiveDate: agreement.effectiveDate,
      parties: agreement.parties.map((p) => ({
        name: p.name,
        email: p.email,
        role: p.role,
        organization: p.organization,
        designation: p.designation,
        status: p.status,
        signature: p.signature
          ? {
              signatureType: p.signature.signatureType,
              signerName: p.signature.signerName,
              signerEmail: p.signature.signerEmail,
              signedAt: p.signature.signedAt,
              ipAddress: p.signature.ipAddress,
              checksum: p.signature.checksum,
              legalConsentStatement: p.signature.legalConsentStatement,
            }
          : null,
      })),
    });

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${agreement.trackingNumber}.pdf"`,
      },
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}

