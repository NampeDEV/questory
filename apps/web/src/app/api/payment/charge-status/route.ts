import { z } from 'zod';
import { type NextRequest, NextResponse } from 'next/server';
import { apiError, handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { getPaymentProvider } from '@/lib/payment/provider';

/**
 * GET /api/payment/charge-status?chargeId=ch_xxx&orderId=ord_xxx — S-030
 * Poll the status of a payment charge (for PromptPay QR polling).
 * Returns { status, paidAt? } — client polls every 3s until status === 'successful'.
 */

const QuerySchema = z.object({
  chargeId: z.string().min(1).max(200),
  orderId: z.string().min(1).max(100),
});

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await getSessionOrThrow(supabase);

    const { searchParams } = new URL(req.url);
    const parsed = QuerySchema.safeParse({
      chargeId: searchParams.get('chargeId') ?? '',
      orderId: searchParams.get('orderId') ?? '',
    });

    if (!parsed.success) {
      return apiError('INVALID_INPUT', 'chargeId and orderId are required.', 400);
    }

    // IDOR check — ensure the order belongs to the requesting user
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const db = createClient(supabaseUrl, supabaseKey);

      const { data: orderRow } = await db
        .from('orders')
        .select('user_id')
        .eq('id', parsed.data.orderId)
        .single<{ user_id: string }>();

      if (!orderRow || orderRow.user_id !== user.id) {
        return apiError('FORBIDDEN', 'Access denied.', 403);
      }
    }

    const provider = getPaymentProvider();
    const charge = await provider.getCharge(parsed.data.chargeId);

    return NextResponse.json({ data: charge });
  } catch (err) {
    return handleRouteError(err);
  }
}
