import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logActivity } from '@/lib/audit';
import { createNotification } from '@/lib/notifications';
import { generateAgreementPdf } from '@/lib/pdf';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request, { params }: { params: { token: string } }) {
  const { token } = params;
  try {
    const body = await req.json();
    const {
      partyId,
      signatureType = 'TYPED_LEGAL',
      signatureData,
      signerName,
      signerEmail,
      legalConsentStatement,
    } = body;

    if (!partyId || !signatureData || !signerName) {
      return NextResponse.json({ error: 'Missing required signature data' }, { status: 400 });
    }

    // Find agreement
    let agreement = await prisma.agreement.findUnique({
      where: { secureShareToken: token },
      include: {
        parties: {
          include: { signature: true },
          orderBy: { partyOrder: 'asc' },
        },
      },
    });

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
        },
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
      return NextResponse.json({ error: 'Signatory party record not found' }, { status: 404 });
    }

    if (party.signature) {
      return NextResponse.json({ error: 'This party has already signed the agreement' }, { status: 400 });
    }

    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1 (Local Session)';
    const userAgent = req.headers.get('user-agent') || 'Browser Client';

    const timestamp = new Date();
    const statutoryConsent =
      legalConsentStatement ||
      'I hereby declare under Section 10A of the Information Technology Act, 2000 that I have read and agree to all terms and conditions of this agreement, and intend this digital execution to constitute a legally binding electronic signature.';

    const checksumPayload = `${agreement.id}|${agreement.content}|${party.id}|${party.email}|${timestamp.toISOString()}`;
    const checksum = crypto.createHash('sha256').update(checksumPayload).digest('hex');

    // Create signature record
    const signature = await prisma.agreementSignature.create({
      data: {
        agreementId: agreement.id,
        partyId: party.id,
        signatureType,
        signatureData,
        signerName: signerName.trim(),
        signerEmail: (signerEmail || party.email).toLowerCase().trim(),
        ipAddress,
        userAgent,
        legalConsentStatement: statutoryConsent,
        checksum,
        signedAt: timestamp,
      },
    });

    // Update party status
    await prisma.agreementParty.update({
      where: { id: party.id },
      data: {
        status: 'SIGNED',
        reviewedAt: party.reviewedAt || timestamp,
      },
    });

    await logActivity({
      action: 'AGREEMENT_PARTY_SIGNED',
      entityType: 'AGREEMENT',
      entityId: agreement.id,
      details: {
        signerName,
        signerEmail: party.email,
        signatureType,
        checksum,
      },
      ipAddress,
    });

    // Re-query parties to check completion
    const updatedParties = await prisma.agreementParty.findMany({
      where: { agreementId: agreement.id },
      include: { signature: true },
      orderBy: { partyOrder: 'asc' },
    });

    const allSigned = updatedParties.every((p) => p.status === 'SIGNED' && p.signature);
    const newAgreementStatus = allSigned ? 'FULLY_SIGNED' : 'PARTIALLY_SIGNED';

    let pdfRelativePath = agreement.pdfPath;
    let pdfHash = agreement.pdfHash;

    if (allSigned) {
      // Generate executed PDF with complete audit trail certificate
      try {
        const { buffer, hash } = await generateAgreementPdf({
          title: agreement.title,
          trackingNumber: agreement.trackingNumber,
          category: agreement.category,
          content: agreement.content,
          createdAt: agreement.createdAt,
          effectiveDate: agreement.effectiveDate,
          parties: updatedParties.map((p) => ({
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

        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'agreements');
        await fs.mkdir(uploadsDir, { recursive: true });
        const fileName = `${agreement.trackingNumber}_Executed.pdf`;
        const filePath = path.join(uploadsDir, fileName);
        await fs.writeFile(filePath, buffer);

        pdfRelativePath = `/uploads/agreements/${fileName}`;
        pdfHash = hash;

        // Create document record in central documents
        const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        await prisma.document.create({
          data: {
            title: `Executed: ${agreement.title}`,
            fileName,
            fileType: 'application/pdf',
            fileSize: buffer.byteLength,
            filePath: pdfRelativePath,
            category: 'FINAL_EXECUTED',
            isClientVisible: true,
            uploadedById: adminUser?.id || party.id,
            versions: {
              create: {
                versionNumber: 1,
                fileName,
                filePath: pdfRelativePath,
                fileSize: buffer.byteLength,
                changeLog: 'Fully executed by all parties with tamper-evident digital audit certificate.',
              },
            },
          },
        });
      } catch (pdfErr) {
        console.error('PDF compilation failed:', pdfErr);
      }
    }

    await prisma.agreement.update({
      where: { id: agreement.id },
      data: {
        status: newAgreementStatus,
        pdfPath: pdfRelativePath,
        pdfHash: pdfHash,
      },
    });

    // Send notifications to all parties
    for (const p of updatedParties) {
      const userRecord = await prisma.user.findUnique({ where: { email: p.email } });
      if (userRecord) {
        await createNotification({
          userId: userRecord.id,
          title: allSigned
            ? `Agreement Fully Executed: ${agreement.trackingNumber}`
            : `Signature Update: ${agreement.trackingNumber}`,
          message: allSigned
            ? `All parties have signed "${agreement.title}". The completed legal PDF is now available for download.`
            : `${signerName} has signed "${agreement.title}".`,
          type: 'SIGNATURE_REQUEST',
          link: `/agreements/sign/${agreement.secureShareToken}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      allSigned,
      status: newAgreementStatus,
      pdfPath: pdfRelativePath,
      pdfHash,
      signature: {
        id: signature.id,
        signerName: signature.signerName,
        signedAt: signature.signedAt,
        checksum: signature.checksum,
      },
    });
  } catch (error) {
    console.error('Execution error:', error);
    return NextResponse.json({ error: 'Signature execution failed' }, { status: 500 });
  }
}

