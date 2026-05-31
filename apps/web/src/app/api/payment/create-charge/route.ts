import { z } from 'zod';
import { type NextRequest, NextResponse } from 'next/server';
import { apiError, handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { getPaymentProvider } from '@/lib/payment/provider';

/**
 * POST /api/payment/create-charge — S-030 (SPEC-10)
 * Creates a payment charge via the configured provider.
 * For PromptPay: returns a QR code URL for the client to display.
 * @security amountSatang is computed server-side from orderId — never trust client amount.
 */

const CreateChargeSchema = z.object({
  /** Omise source token generated client-side via omise.js */
  sourceToken: z.string().min(1).max(200),
  method: z.enum(['promptpay', 'credit_card', 'bank_transfer']),
  /** The order this charge is for — used to look up the real amount */
  orderId: z.string().min(1).max(100),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await getSessionOrThrow(supabase);

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return apiError('INVALID_INPUT', 'Invalid request body.', 400);
    }

    const parsed = CreateChargeSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError('INVALID_INPUT', 'Validation failed.', 422, parsed.error.flatten());
    }

    // Resolve amount server-side from order — never trust client-supplied amount
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    let amountSatang: number;

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const db = createClient(supabaseUrl, supabaseKey);

      type OrderRow = { total_thb: number; user_id: string; status: string };
      const { data: orderRow, error } = await db
        .from('orders')
        .select('total_thb, user_id, status')
        .eq('id', parsed.data.orderId)
        .single<OrderRow>();

      if (error ?? !orderRow) {
        return apiError('NOT_FOUND', 'Order not found.', 404);
      }

      // IDOR check — ensure the order belongs to the requesting user
      if (orderRow.user_id !== user.id) {
        return apiError('FORBIDDEN', 'Access denied.', 403);
      }

      if (orderRow.status !== 'draft') {
        return apiError('CONFLICT', 'Order has already been paid.', 409);
      }

      // Convert THB to satang (1 THB = 100 satang)
      amountSatang = Math.round(orderRow.total_thb * 100);
    } else {
      // Mock fallback — fixed amount for POC testing
      amountSatang = 99000; // ฿990 in satang
    }

    const provider = getPaymentProvider();
    const charge = await provider.createCharge({
      amountSatang,
      currency: 'THB',
      method: parsed.data.method,
      sourceToken: parsed.data.sourceToken,
      metadata: { orderId: parsed.data.orderId, userId: user.id },
    });

    return NextResponse.json({ data: charge }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
