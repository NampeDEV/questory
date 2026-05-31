import { type NextRequest, NextResponse } from 'next/server';
import { getPlans } from '@/lib/api/plans';
import { apiError } from '@/lib/api/response';

// API-PLANS-LIST (SPEC-07) — GET /api/plans?duration=&difficulty=&park_code=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const duration   = searchParams.get('duration');
    const difficulty = searchParams.get('difficulty');
    const limitParam = searchParams.get('limit');
    const cursor     = searchParams.get('cursor');
    const PAGE_SIZE  = Math.min(Math.max(parseInt(limitParam ?? '20', 10), 1), 50);

    let plans = await getPlans();

    if (duration) {
      const d = parseInt(duration, 10);
      if (isNaN(d)) return apiError('INVALID_INPUT', 'duration must be an integer.', 422);
      plans = plans.filter((p) => p.durationDays === d);
    }
    if (difficulty) {
      const valid = ['easy', 'moderate', 'challenging'];
      if (!valid.includes(difficulty)) {
        return apiError('INVALID_INPUT', `difficulty must be one of: ${valid.join(', ')}`, 422);
      }
      plans = plans.filter((p) => p.difficulty === difficulty);
    }

    const startIdx   = cursor ? parseInt(cursor, 10) : 0;
    const page       = plans.slice(startIdx, startIdx + PAGE_SIZE);
    const nextIdx    = startIdx + page.length;
    const nextCursor = nextIdx < plans.length ? String(nextIdx) : null;

    return NextResponse.json({
      data: page,
      meta: { total: plans.length, nextCursor },
    });
  } catch {
    return apiError('INTERNAL_ERROR', 'Failed to fetch plans.', 500);
  }
}
