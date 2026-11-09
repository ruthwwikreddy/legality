/**
 * Transactional Email Dispatcher for LEGALITY
 * Dispatches real transactional emails via Resend API if RESEND_API_KEY is configured in .env.local,
 * or gracefully logs to the console and relies on in-app notifications if no API key is provided.
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendTransactionalEmail({ to, subject, html, text }: SendEmailParams): Promise<{ success: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Email Dispatcher Fallback] To: ${to} | Subject: "${subject}" (RESEND_API_KEY not configured)`);
    }
    return { success: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'LEGALITY Legal Desk <notifications@legality.in>',
        to: [to],
        subject,
        html,
        text: text || subject,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Resend email error:', data);
      return { success: false };
    }

    return { success: true, id: data.id };
  } catch (error) {
    console.error('Failed to dispatch transactional email:', error);
    return { success: false };
  }
}
