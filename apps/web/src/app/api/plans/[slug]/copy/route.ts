import { apiSuccess, apiError, handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { getPlanBySlug } from '@/lib/api/plans';

// API-019 (SPEC-07) — POST /api/plans/:slug/copy
// Increments copy_count on a plan. Returns the updated plan.

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const supabase = await createSupabaseServerClient();
    await getSessionOrThrow(supabase);

    const { slug } = await params;
    const plan = await getPlanBySlug(slug);

    if (!plan) {
      return apiError('NOT_FOUND', `Plan '${slug}' not found.`, 404);
    }

    // POC: return plan with incremented copy count (M4: DB update)
    const updated = { ...plan, copiedByCount: (plan.copiedByCount ?? 0) + 1 };
    return apiSuccess(updated);
  } catch (err) {
    return handleRouteError(err);
  }
}
