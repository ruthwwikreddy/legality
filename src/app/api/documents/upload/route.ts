export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logActivity } from '@/lib/audit';
import { createNotification } from '@/lib/notifications';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';
    const category = (formData.get('category') as string) || (user.role === 'CLIENT' ? 'CLIENT_UPLOAD' : 'LEGAL_DRAFT');
    const requestId = (formData.get('requestId') as string) || null;
    const clientId = (formData.get('clientId') as string) || (user.role === 'CLIENT' ? user.id : null);
    const isClientVisibleStr = formData.get('isClientVisible') as string;
    const isClientVisible = isClientVisibleStr === 'false' ? false : true;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 25MB limit' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = path.join(uploadsDir, safeFileName);
    await fs.writeFile(filePath, buffer);

    const relativePath = `/uploads/${safeFileName}`;

    const document = await prisma.document.create({
      data: {
        title: title.trim() || file.name,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        fileSize: file.size,
        filePath: relativePath,
        category,
        isClientVisible,
        clientId,
        requestId,
        uploadedById: user.id,
        versions: {
          create: {
            versionNumber: 1,
            fileName: file.name,
            filePath: relativePath,
            fileSize: file.size,
            changeLog: 'Initial upload',
          },
        },
      },
      include: {
        uploadedBy: {
          select: { id: true, fullName: true, role: true },
        },
      },
    });

    await logActivity({
      userId: user.id,
      action: 'DOCUMENT_UPLOADED',
      entityType: 'DOCUMENT',
      entityId: document.id,
      details: {
        title: document.title,
        fileName: file.name,
        sizeBytes: file.size,
        category,
      },
    });

    // Notify counterpart
    if (requestId) {
      const request = await prisma.serviceRequest.findUnique({
        where: { id: requestId },
        include: { assignments: true },
      });

      if (request) {
        if (user.role === 'CLIENT') {
          for (const a of request.assignments) {
            await createNotification({
              userId: a.employeeId,
              title: `New Document Upload: ${request.trackingNumber}`,
              message: `${user.fullName} uploaded "${document.title}"`,
              type: 'DOCUMENT_UPLOAD',
              link: `/admin/requests/${requestId}`,
            });
          }
        } else if (isClientVisible) {
          await createNotification({
            userId: request.clientId,
            title: `New Legal Document: ${request.trackingNumber}`,
            message: `Legal team shared "${document.title}" with you.`,
            type: 'DOCUMENT_UPLOAD',
            link: `/portal/requests/${requestId}`,
          });
        }
      }
    }

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}

