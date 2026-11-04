import prisma from './prisma';

export async function logActivity({
  userId,
  action,
  entityType,
  entityId,
  details,
  ipAddress,
}: {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, any> | string;
  ipAddress?: string | null;
}) {
  try {
    const detailsStr = typeof details === 'object' ? JSON.stringify(details) : details;
    await prisma.activityLog.create({
      data: {
        userId: userId || null,
        action,
        entityType,
        entityId: entityId || null,
        details: detailsStr || null,
        ipAddress: ipAddress || null,
      },
    });
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}

