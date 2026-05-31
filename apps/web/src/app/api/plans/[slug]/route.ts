import { getPlanBySlug } from '@/lib/api/plans';
import { apiSuccess, apiError } from '@/lib/api/response';

// API-PLANS-GET (SPEC-07) — GET /api/plans/:slug
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const plan = await getPlanBySlug(slug);

    if (!plan) {
      return apiError('NOT_FOUND', `Plan '${slug}' not found.`, 404);
    }

    // POC: Plan type carries `days` array (PlanDay[]) which acts as plan_items.
    // In M3 this will be joined from plan_items table.
    return apiSuccess(plan);
  } catch {
    return apiError('INTERNAL_ERROR', 'Failed to fetch plan.', 500);
  }
}
