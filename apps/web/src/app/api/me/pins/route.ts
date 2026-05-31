import { apiSuccess, handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { getUserPins, getBadges } from '@/lib/api/pins';

// API-015 (SPEC-07) — GET /api/me/pins
// Returns the authenticated user's pin collection with badge details and PinStatus.

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    await getSessionOrThrow(supabase);

    const [userPins, allBadges] = await Promise.all([
      getUserPins(),
      getBadges(),
    ]);

    const badgeMap = new Map(allBadges.map((b) => [b.id, b]));

    const result = userPins.map((p) => ({
      ...p,
      badge: p.badgeId ? (badgeMap.get(p.badgeId) ?? null) : null,
    }));

    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
