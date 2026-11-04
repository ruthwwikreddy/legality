export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const templates = await prisma.agreementTemplate.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json({ templates });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role === 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized: Staff access required' }, { status: 403 });
  }

  try {
    const { title, category, description, defaultContent } = await req.json();

    if (!title || !description || !defaultContent) {
      return NextResponse.json({ error: 'Title, description, and content are required' }, { status: 400 });
    }

    const template = await prisma.agreementTemplate.create({
      data: {
        title: title.trim(),
        category: category || 'MOU_AGREEMENTS',
        description: description.trim(),
        defaultContent,
      },
    });

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error('Template creation error:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}

