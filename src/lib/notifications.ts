import prisma from './prisma';
import { sendTransactionalEmail } from './email';

export async function createNotification({
  userId,
  title,
  message,
  type,
  link,
}: {
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link,
      },
      include: {
        user: { select: { email: true, fullName: true } },
      },
    });

    // If user has email, trigger transactional email dispatch
    if (notification.user?.email) {
      const fullUrl = link?.startsWith('http')
        ? link
        : `${process.env.NEXTAUTH_URL || 'https://legality.in'}${link || '/portal'}`;

      sendTransactionalEmail({
        to: notification.user.email,
        subject: `[LEGALITY] ${title}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #171717;">
            <div style="margin-bottom: 24px;">
              <span style="font-weight: bold; font-size: 16px; letter-spacing: -0.5px;">LEGALITY</span>
              <span style="color: #737373; font-size: 12px; margin-left: 8px;">Legal Operations Platform</span>
            </div>
            <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #0a0a0a;">${title}</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #404040; margin-bottom: 24px;">${message}</p>
            <div style="margin-bottom: 32px;">
              <a href="${fullUrl}" style="background-color: #0a0a0a; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 600; display: inline-block;">
                Open Matter in Portal &rarr;
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin-bottom: 16px;" />
            <p style="font-size: 11px; color: #737373; line-height: 1.5;">
              This notification was generated automatically by the LEGALITY legal services platform. As per Bar Council of India guidelines, this communication is strictly for matter administration and record keeping.
            </p>
          </div>
        `,
        text: `${title}\n\n${message}\n\nAccess portal: ${fullUrl}`,
      }).catch((e) => console.error('Background email dispatch failed:', e));
    }

    return notification;
  } catch (err) {
    console.error('Failed to create notification:', err);
    return null;
  }
}
