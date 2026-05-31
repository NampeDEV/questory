import { type NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/payment/webhook — Omise webhook (S-030)
 * Receives payment event notifications from Omise.
 * On charge.complete: update order status to 'paid' in Supabase.
 * @security Verifies Omise-Signature header with HMAC-SHA256 before processing.
 */

type OmiseWebhookEvent = {
  key: string;
  data: {
    id: string;
    status: string;
    metadata?: { order_id?: string };
  };
};

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.OMISE_WEBHOOK_SECRET;

  // Verify Omise signature if secret is configured
  if (webhookSecret) {
    const signature = req.headers.get('omise-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const rawBody = await req.text();
    const isValid = await verifyOmiseSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Re-parse after signature verification
    let event: OmiseWebhookEvent;
    try {
      event = JSON.parse(rawBody) as OmiseWebhookEvent;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    await handleEvent(event);
  } else {
    // No secret configured — process without verification (dev/mock only)
    let event: OmiseWebhookEvent;
    try {
      event = (await req.json()) as OmiseWebhookEvent;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (process.env.NODE_ENV === 'production') {
      console.error('[payment/webhook] OMISE_WEBHOOK_SECRET not set in production — rejecting');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }

    await handleEvent(event);
  }

  return NextResponse.json({ received: true });
}

async function handleEvent(event: OmiseWebhookEvent): Promise<void> {
  if (event.key !== 'charge.complete') return;

  const charge = event.data;
  const orderId = charge.metadata?.order_id;

  if (!orderId) {
    console.warn('[payment/webhook] charge.complete missing order_id in metadata', {
      chargeId: charge.id,
    });
    return;
  }

  if (charge.status !== 'successful') {
    // Log failed payment but don't update order status to paid
    console.info('[payment/webhook] charge not successful', {
      chargeId: charge.id,
      status: charge.status,
      orderId,
    });
    return;
  }

  // Update order status in Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.warn('[payment/webhook] Supabase not configured — cannot update order', { orderId });
    return;
  }

  const { createClient } = await import('@supabase/supabase-js');
  // Use service role key for webhook — no user session available
  const db = createClient(supabaseUrl, serviceKey);

  const { error } = await db
    .from('orders')
    .update({ status: 'paid', updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .eq('status', 'draft'); // Only update if still draft (idempotency guard)

  if (error) {
    console.error('[payment/webhook] Failed to update order status', { orderId });
  } else {
    console.info('[payment/webhook] Order marked as paid', { orderId, chargeId: charge.id });
  }
}

/**
 * Verify Omise webhook signature using HMAC-SHA256.
 * Omise sends: Omise-Signature: t=<timestamp>,v1=<hmac>
 * Signed payload: <timestamp>.<rawBody>
 */
async function verifyOmiseSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string,
): Promise<boolean> {
  try {
    const parts = Object.fromEntries(
      signatureHeader.split(',').map((p) => p.split('=')),
    ) as Record<string, string | undefined>;

    const timestamp = parts['t'];
    const expectedHmac = parts['v1'];
    if (!timestamp || !expectedHmac) return false;

    const payload = `${timestamp}.${rawBody}`;
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const actualHmac = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // Constant-time comparison to prevent timing attacks
    return timingSafeEqual(actualHmac, expectedHmac);
  } catch {
    return false;
  }
}

/** Constant-time string comparison to prevent timing attacks on HMAC verification. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
