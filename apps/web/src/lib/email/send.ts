/**
 * Email sending helper — S-032 (SPEC-07 / PROJECT_OVERVIEW § 7).
 * Provider: Resend (env: RESEND_API_KEY).
 * Guard: if RESEND_API_KEY is not set, logs and no-ops (order still succeeds).
 * @security Never log email content, PII, or payment data.
 */

import type { OrderConfirmationData } from './templates';
import { orderConfirmationHtml } from './templates';

export type SendResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string };

const FROM_ADDRESS =
  process.env.EMAIL_FROM ?? 'Questory <noreply@questory.app>';

/**
 * Send an order confirmation email to the customer.
 * Silently skips if RESEND_API_KEY is not configured.
 */
export async function sendOrderConfirmation(
  to: string,
  data: OrderConfirmationData,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Not configured — log server-side only, no-op (don't fail the order)
    console.info('[email] RESEND_API_KEY not set — skipping order confirmation email', {
      orderId: data.orderId,
    });
    return { ok: false, error: 'Email provider not configured' };
  }

  try {
    // Dynamically import to avoid loading the SDK when not needed
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const html = orderConfirmationHtml(data);

    const { data: result, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `ยืนยันคำสั่งซื้อ ${data.orderId} — Questory`,
      html,
    });

    if (error ?? !result) {
      console.error('[email] Failed to send order confirmation', {
        orderId: data.orderId,
        // Log error type only — never log PII or email content
        errorName: (error as { name?: string } | null)?.name ?? 'unknown',
      });
      return { ok: false, error: error?.message ?? 'Unknown send error' };
    }

    return { ok: true, messageId: result.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[email] Unexpected error sending email', { orderId: data.orderId });
    return { ok: false, error: message };
  }
}
