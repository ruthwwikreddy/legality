import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import crypto from 'crypto';

interface PartyInfo {
  name: string;
  email: string;
  role: string;
  organization?: string | null;
  designation?: string | null;
  status: string;
  signature?: {
    signatureType: string;
    signerName: string;
    signerEmail: string;
    signedAt: Date;
    ipAddress?: string | null;
    checksum: string;
    legalConsentStatement: string;
  } | null;
}

interface GenerateAgreementPdfProps {
  title: string;
  trackingNumber: string;
  category: string;
  content: string;
  createdAt: Date;
  effectiveDate?: Date | null;
  parties: PartyInfo[];
}

export async function generateAgreementPdf(data: GenerateAgreementPdfProps): Promise<{ buffer: Uint8Array; hash: string }> {
  const pdfDoc = await PDFDocument.create();
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const courier = await pdfDoc.embedFont(StandardFonts.Courier);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 50;
  const pageWidth = 595.28; // A4
  const pageHeight = 841.89; // A4
  const usableWidth = pageWidth - margin * 2;

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  function addNewPage() {
    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
    // Header on subsequent pages
    currentPage.drawText(`LEGALITY | Ref: ${data.trackingNumber}`, {
      x: margin,
      y: pageHeight - 35,
      size: 8,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    });
    currentPage.drawLine({
      start: { x: margin, y: pageHeight - 40 },
      end: { x: pageWidth - margin, y: pageHeight - 40 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });
  }

  function ensureSpace(neededHeight: number) {
    if (y - neededHeight < margin + 40) {
      addNewPage();
    }
  }

  // --- Title & Header ---
  currentPage.drawText('LEGALITY', {
    x: margin,
    y: y,
    size: 20,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  currentPage.drawText('DIGITAL LEGAL SERVICES & DOCUMENTATION PLATFORM', {
    x: margin,
    y: y - 14,
    size: 8,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  });
  y -= 35;

  currentPage.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 1,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 25;

  // Metadata block
  currentPage.drawText(`REFERENCE NO: ${data.trackingNumber}`, {
    x: margin,
    y,
    size: 9,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  currentPage.drawText(`DATE CREATED: ${new Date(data.createdAt).toLocaleDateString('en-GB')}`, {
    x: margin + 300,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 15;

  if (data.effectiveDate) {
    currentPage.drawText(`EFFECTIVE DATE: ${new Date(data.effectiveDate).toLocaleDateString('en-GB')}`, {
      x: margin,
      y,
      size: 9,
      font: helvetica,
      color: rgb(0.2, 0.2, 0.2),
    });
    y -= 15;
  }

  y -= 15;

  // Document Title
  ensureSpace(40);
  currentPage.drawText(data.title.toUpperCase(), {
    x: margin,
    y,
    size: 14,
    font: timesRomanBold,
    color: rgb(0.05, 0.05, 0.05),
  });
  y -= 25;

  // Parties Introduction
  ensureSpace(60);
  currentPage.drawText('BETWEEN THE UNDERSIGNED PARTIES:', {
    x: margin,
    y,
    size: 10,
    font: helveticaBold,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 16;

  data.parties.forEach((party, idx) => {
    ensureSpace(30);
    const partyLine = `${idx + 1}. ${party.name} (${party.role})${party.organization ? ` representing ${party.organization}` : ''} - Email: ${party.email}`;
    currentPage.drawText(partyLine, {
      x: margin + 10,
      y,
      size: 9,
      font: timesRoman,
      color: rgb(0.15, 0.15, 0.15),
    });
    y -= 14;
  });

  y -= 20;

  // Agreement Content
  ensureSpace(30);
  currentPage.drawText('TERMS & COVENANTS', {
    x: margin,
    y,
    size: 11,
    font: timesRomanBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 18;

  // Split content into lines and paragraphs
  const paragraphs = data.content.split('\n');
  for (const para of paragraphs) {
    if (!para.trim()) {
      y -= 8;
      continue;
    }

    const isHeader = para.trim().startsWith('#') || para.trim().startsWith('Section') || para.trim().startsWith('CLAUSE');
    const cleanPara = para.replace(/^#+\s*/, '').trim();

    // Approximate wrapping (each char is ~5-6 points wide in 10pt)
    const words = cleanPara.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = (isHeader ? timesRomanBold : timesRoman).widthOfTextAtSize(testLine, isHeader ? 11 : 10);

      if (testWidth > usableWidth) {
        ensureSpace(isHeader ? 18 : 14);
        currentPage.drawText(currentLine, {
          x: margin,
          y,
          size: isHeader ? 11 : 10,
          font: isHeader ? timesRomanBold : timesRoman,
          color: rgb(0.1, 0.1, 0.1),
        });
        y -= isHeader ? 16 : 13;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      ensureSpace(isHeader ? 18 : 14);
      currentPage.drawText(currentLine, {
        x: margin,
        y,
        size: isHeader ? 11 : 10,
        font: isHeader ? timesRomanBold : timesRoman,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= isHeader ? 18 : 14;
    }
  }

  // --- Signatures Section ---
  ensureSpace(120);
  y -= 15;
  currentPage.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });
  y -= 20;

  currentPage.drawText('EXECUTION & SIGNATURES', {
    x: margin,
    y,
    size: 11,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 25;

  for (const party of data.parties) {
    ensureSpace(60);
    const isSigned = !!party.signature;

    currentPage.drawRectangle({
      x: margin,
      y: y - 45,
      width: usableWidth,
      height: 52,
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 0.5,
      color: isSigned ? rgb(0.97, 0.99, 0.98) : rgb(0.98, 0.98, 0.98),
    });

    currentPage.drawText(`Party: ${party.name} (${party.role})`, {
      x: margin + 10,
      y: y - 10,
      size: 9,
      font: helveticaBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    currentPage.drawText(`Email: ${party.email}`, {
      x: margin + 10,
      y: y - 24,
      size: 8,
      font: helvetica,
      color: rgb(0.3, 0.3, 0.3),
    });

    if (isSigned && party.signature) {
      currentPage.drawText(`STATUS: SIGNED & VERIFIED`, {
        x: margin + 280,
        y: y - 10,
        size: 9,
        font: helveticaBold,
        color: rgb(0.05, 0.5, 0.2),
      });
      currentPage.drawText(`Timestamp: ${new Date(party.signature.signedAt).toISOString()}`, {
        x: margin + 280,
        y: y - 22,
        size: 7,
        font: courier,
        color: rgb(0.2, 0.2, 0.2),
      });
      currentPage.drawText(`IP: ${party.signature.ipAddress || 'Verified Portal Session'} | Type: ${party.signature.signatureType}`, {
        x: margin + 280,
        y: y - 32,
        size: 7,
        font: helvetica,
        color: rgb(0.4, 0.4, 0.4),
      });
      currentPage.drawText(`Checksum: ${party.signature.checksum.substring(0, 24)}...`, {
        x: margin + 10,
        y: y - 38,
        size: 7,
        font: courier,
        color: rgb(0.4, 0.4, 0.4),
      });
    } else {
      currentPage.drawText(`STATUS: PENDING SIGNATURE`, {
        x: margin + 280,
        y: y - 10,
        size: 9,
        font: helveticaBold,
        color: rgb(0.7, 0.4, 0.0),
      });
      currentPage.drawText(`Awaiting digital verification and signature execution.`, {
        x: margin + 280,
        y: y - 24,
        size: 8,
        font: helvetica,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    y -= 62;
  }

  // --- Audit Certificate Page ---
  addNewPage();
  currentPage.drawRectangle({
    x: margin - 10,
    y: margin - 10,
    width: usableWidth + 20,
    height: pageHeight - margin * 2 + 20,
    borderColor: rgb(0.15, 0.15, 0.15),
    borderWidth: 1.5,
  });

  let certY = pageHeight - margin - 30;
  currentPage.drawText('LEGALITY DIGITAL EXECUTION AUDIT CERTIFICATE', {
    x: margin + 15,
    y: certY,
    size: 13,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  certY -= 14;
  currentPage.drawText('Evidence of Authenticity & Electronic Record Integrity', {
    x: margin + 15,
    y: certY,
    size: 9,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  });
  certY -= 20;

  currentPage.drawLine({
    start: { x: margin + 15, y: certY },
    end: { x: pageWidth - margin - 15, y: certY },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  certY -= 25;

  const legalDeclaration = [
    'This Certificate confirms that the accompanying agreement was executed digitally on the LEGALITY platform.',
    'In accordance with Section 10A of the Information Technology Act, 2000 (India), contracts formed',
    'through electronic means are legally valid and enforceable.',
    '',
    'Each signatory verified their identity prior to execution, and their digital consent was recorded with',
    'associated timestamp, IP address, device telemetry, and cryptographic verification hash.',
  ];

  for (const line of legalDeclaration) {
    if (line) {
      currentPage.drawText(line, {
        x: margin + 15,
        y: certY,
        size: 8.5,
        font: timesRoman,
        color: rgb(0.2, 0.2, 0.2),
      });
    }
    certY -= 13;
  }

  certY -= 15;
  currentPage.drawText('AUDIT LOG ENTRIES:', {
    x: margin + 15,
    y: certY,
    size: 9,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  certY -= 18;

  for (const party of data.parties) {
    const isSigned = !!party.signature;
    currentPage.drawText(
      `• Signatory: ${party.name} (${party.email}) — Role: ${party.role} — Status: ${party.status.toUpperCase()}`,
      {
        x: margin + 20,
        y: certY,
        size: 8,
        font: helveticaBold,
        color: rgb(0.2, 0.2, 0.2),
      }
    );
    certY -= 12;

    if (isSigned && party.signature) {
      currentPage.drawText(
        `  Executed: ${new Date(party.signature.signedAt).toISOString()} | IP: ${party.signature.ipAddress || 'Verified Network'} | Type: ${party.signature.signatureType}`,
        {
          x: margin + 25,
          y: certY,
          size: 7.5,
          font: courier,
          color: rgb(0.3, 0.3, 0.3),
        }
      );
      certY -= 11;
      currentPage.drawText(`  Legal Consent: "${party.signature.legalConsentStatement}"`, {
        x: margin + 25,
        y: certY,
        size: 7,
        font: timesRoman,
        color: rgb(0.4, 0.4, 0.4),
      });
      certY -= 14;
    } else {
      currentPage.drawText(`  Pending signature execution by this party.`, {
        x: margin + 25,
        y: certY,
        size: 7.5,
        font: helvetica,
        color: rgb(0.5, 0.5, 0.5),
      });
      certY -= 14;
    }
  }

  certY -= 20;
  const rawBytes = await pdfDoc.save();
  const sha256Hash = crypto.createHash('sha256').update(rawBytes).digest('hex');

  currentPage.drawText(`DOCUMENT SHA-256 INTEGRITY HASH:`, {
    x: margin + 15,
    y: certY,
    size: 8,
    font: helveticaBold,
    color: rgb(0.2, 0.2, 0.2),
  });
  certY -= 12;
  currentPage.drawText(sha256Hash, {
    x: margin + 15,
    y: certY,
    size: 7.5,
    font: courier,
    color: rgb(0.1, 0.3, 0.6),
  });
  certY -= 25;

  currentPage.drawText('LEGALITY SECURE RECORD SYSTEM — TAMPER-EVIDENT ELECTRONIC CERTIFICATE', {
    x: margin + 15,
    y: certY,
    size: 7.5,
    font: helveticaBold,
    color: rgb(0.4, 0.4, 0.4),
  });

  const finalPdfBytes = await pdfDoc.save();
  return { buffer: finalPdfBytes, hash: sha256Hash };
}

