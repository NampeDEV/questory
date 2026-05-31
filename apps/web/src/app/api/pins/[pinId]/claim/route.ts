import { z } from 'zod';
import { apiSuccess, apiError, handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { getPins, getUserPins } from '@/lib/api/pins';

// Thai phone regex (0X-XXXX-XXXX or 0XXXXXXXXX)
const THAI_PHONE_RE = /^0[0-9]{8,9}$/;

const ClaimSchema = z.object({
  shippingName:    z.string().min(1, 'กรุณากรอกชื่อผู้รับ').max(100),
  shippingAddress: z.string().min(1, 'กรุณากรอกที่อยู่').max(500),
  shippingPhone:   z.string().regex(THAI_PHONE_RE, 'รูปแบบเบอร์โทรไม่ถูกต้อง (0X-XXXX-XXXX)'),
});

// API-016 (SPEC-07) — POST /api/pins/:pinId/claim
// Security: validates ownership — user must have an unlocked badge for this pin.

export async function POST(
  req: Request,
  { params }: { params: Promise<{ pinId: string }> },
) {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await getSessionOrThrow(supabase);

    const { pinId } = await params;

    // Verify pin exists
    const allPins = await getPins();
    const pin = allPins.find((p) => p.id === pinId);
    if (!pin) {
      return apiError('NOT_FOUND', `Pin '${pinId}' not found.`, 404);
    }

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return apiError('INVALID_INPUT', 'Invalid request body.', 400);
    }

    const parsed = ClaimSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError('INVALID_INPUT', 'Validation failed.', 422, parsed.error.flatten());
    }

    // Build claim object (may be enriched with real DB id below)
    let claim = {
      id:              `claim-${crypto.randomUUID()}`,
      userId:          user.id,
      pinId,
      status:          'pending' as const,
      shippingName:    parsed.data.shippingName,
      shippingAddress: parsed.data.shippingAddress,
      trackingNumber:  null,
      claimedAt:       new Date().toISOString(),
      shippedAt:       null,
      deliveredAt:     null,
    };

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const db = createClient(supabaseUrl, supabaseKey);

      // Ownership check against DB: user_pins.status must be 'claim_available'
      const { data: userPinRow } = await db
        .from('user_pins')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('pin_id', pinId)
        .single();

      type UserPinRow = { id: string; status: string };
      const row = userPinRow as UserPinRow | null;

      if (!row || row.status !== 'claim_available') {
        return apiError('FORBIDDEN', 'คุณไม่มีสิทธิ์ขอรับ Pin นี้', 403);
      }

      const claimId = crypto.randomUUID();
      const { error } = await db.from('pin_claims').insert({
        id:               claimId,
        user_id:          user.id,
        pin_id:           pinId,
        shipping_name:    parsed.data.shippingName,
        shipping_address: parsed.data.shippingAddress,
        shipping_phone:   parsed.data.shippingPhone,
        status:           'pending',
        claimed_at:       claim.claimedAt,
      });

      if (!error) {
        // Update user_pins status → claimed
        await db
          .from('user_pins')
          .update({ status: 'claimed', claimed_at: claim.claimedAt })
          .eq('id', row.id);

        claim = { ...claim, id: claimId };
      }
    } else {
      // Fallback: check ownership against mock data
      const userPins = await getUserPins();
      const userPin  = userPins.find((p) => p.id === pinId);
      if (!userPin || userPin.status !== 'claim_available') {
        return apiError('FORBIDDEN', 'คุณไม่มีสิทธิ์ขอรับ Pin นี้', 403);
      }
    }

    return apiSuccess(claim, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
