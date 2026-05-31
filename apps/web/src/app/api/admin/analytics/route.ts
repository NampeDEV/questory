import { type NextRequest, NextResponse } from 'next/server';
import { handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/api/auth';

// API-ADM-005 (SPEC-07) — GET /api/admin/analytics
// Revenue + quest stats time series (last 7 days).
// M4: query real orders from DB when Supabase env is set; mock fallback otherwise.

// Mock weekly data (fallback)
const WEEKLY_ANALYTICS = [
  { date: '2026-05-24', orders: 290, activations: 180, revenueThb: 288_100 },
  { date: '2026-05-25', orders: 320, activations: 210, revenueThb: 317_600 },
  { date: '2026-05-26', orders: 380, activations: 260, revenueThb: 378_620 },
  { date: '2026-05-27', orders: 410, activations: 300, revenueThb: 408_590 },
  { date: '2026-05-28', orders: 395, activations: 340, revenueThb: 393_005 },
  { date: '2026-05-29', orders: 440, activations: 390, revenueThb: 438_560 },
  { date: '2026-05-30', orders: 356, activations: 420, revenueThb: 354_440 },
] as const;

type AnalyticsPoint = { date: string; orders: number; activations: number; revenueThb: number };

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    await requireAdmin(supabase);

    const { searchParams } = req.nextUrl;
    const metric = searchParams.get('metric') ?? 'all';

    let points: AnalyticsPoint[];

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const fromDate = sevenDaysAgo.toISOString().split('T')[0]!; // YYYY-MM-DD

      const { data: ordersData } = await supabase
        .from('orders')
        .select('created_at, total_thb')
        .gte('created_at', fromDate);

      // Group by date — noUncheckedIndexedAccess-safe pattern
      const byDate: Record<string, { orders: number; revenueThb: number }> = {};
      for (const o of (ordersData ?? [])) {
        const d = (o.created_at as string).split('T')[0]!;
        const existing = byDate[d];
        if (!existing) {
          byDate[d] = { orders: 1, revenueThb: (o.total_thb as number | null) ?? 0 };
        } else {
          existing.orders     += 1;
          existing.revenueThb += (o.total_thb as number | null) ?? 0;
        }
      }

      points = Object.entries(byDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, vals]) => ({
          date,
          orders:      vals.orders,
          activations: 0, // activation_codes not queried in this endpoint
          revenueThb:  vals.revenueThb,
        }));
    } else {
      points = [...WEEKLY_ANALYTICS];
    }

    // Optionally project a single metric
    const data =
      metric === 'revenue'
        ? points.map(({ date, revenueThb }) => ({ date, revenueThb }))
        : metric === 'orders'
          ? points.map(({ date, orders }) => ({ date, orders }))
          : metric === 'activations'
            ? points.map(({ date, activations }) => ({ date, activations }))
            : points;

    const totals = {
      totalOrders:      points.reduce((s, p) => s + p.orders, 0),
      totalActivations: points.reduce((s, p) => s + p.activations, 0),
      totalRevenueThb:  points.reduce((s, p) => s + p.revenueThb, 0),
    };

    return NextResponse.json({ data, meta: totals });
  } catch (err) {
    return handleRouteError(err);
  }
}
