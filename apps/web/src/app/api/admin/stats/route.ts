import { apiSuccess, handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/api/auth';
import { getBoards } from '@/lib/api/boards';
import { getMissions, getUserMissionStatuses } from '@/lib/api/missions';
import { getProducts } from '@/lib/api/products';

// API-ADM-001 (SPEC-07) — GET /api/admin/stats
// Returns KPI aggregates for the admin dashboard.
// M4: real DB aggregates when Supabase env is configured; mock fallback otherwise.

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    await requireAdmin(supabase);

    const [boards, missions, statuses, products] = await Promise.all([
      getBoards(),
      getMissions(),
      getUserMissionStatuses(),
      getProducts(),
    ]);

    const totalRevenuePocThb = products.reduce(
      (sum, p) => sum + p.priceThb * Math.max(0, 150 - p.stock),
      0,
    );

    let stats = {
      totalBoards:          boards.length,
      totalMissions:        missions.length,
      completedMissions:    statuses.filter((s) => s.status === 'completed').length,
      pendingReview:        statuses.filter((s) => s.status === 'submitted').length,
      totalProductsOnSale:  products.filter((p) => p.stock > 0).length,
      lowStockProducts:     products.filter((p) => p.stock > 0 && p.stock < 10).length,
      totalRevenuePocThb,
    };

    // Override with real DB aggregates when Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const db = createClient(supabaseUrl, supabaseKey);

      const [
        totalSubResult,
        pendingSubResult,
        revenueResult,
      ] = await Promise.all([
        db.from('mission_submissions').select('*', { count: 'exact', head: true }),
        db.from('mission_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending_review'),
        db.from('orders').select('total_thb').in('status', ['paid', 'shipped', 'delivered']),
      ]);

      const totalRevenue = (revenueResult.data ?? []).reduce(
        (s, o: { total_thb: number | null }) => s + (o.total_thb ?? 0),
        0,
      );

      stats = {
        ...stats,
        completedMissions:   totalSubResult.count  ?? stats.completedMissions,
        pendingReview:       pendingSubResult.count ?? stats.pendingReview,
        totalRevenuePocThb:  totalRevenue || stats.totalRevenuePocThb,
      };
    }

    return apiSuccess(stats);
  } catch (err) {
    return handleRouteError(err);
  }
}
