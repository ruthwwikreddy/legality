export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role === 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized: Staff only' }, { status: 403 });
  }

  const { id } = params;
  try {
    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Note content cannot be empty' }, { status: 400 });
    }

    const note = await prisma.internalNote.create({
      data: {
        requestId: id,
        authorId: user.id,
        content: content.trim(),
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error('Note creation error:', error);
    return NextResponse.json({ error: 'Failed to create internal note' }, { status: 500 });
  }
}

