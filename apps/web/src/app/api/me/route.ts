import { apiSuccess, handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { getMissions, getUserMissionStatuses } from '@/lib/api/missions';
import { getUserPins } from '@/lib/api/pins';
import { getPublicMemories } from '@/lib/api/memories';
import type { User } from '@/types/user';

// API-010 (SPEC-07) — GET /api/me
// Returns authenticated user + aggregate stats.
// POC: user shape derived from Supabase auth object + mock stat counts.

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const authUser = await getSessionOrThrow(supabase);

    // POC: fetch mock aggregate stats in parallel
    const [statuses, pins, memories] = await Promise.all([
      getUserMissionStatuses(),
      getUserPins(),
      getPublicMemories(),
    ]);

    const user: User & { stats: Record<string, number> } = {
      id: authUser.id,
      displayName: authUser.user_metadata?.['full_name'] as string ?? 'Explorer',
      email: authUser.email ?? '',
      avatarUrl: (authUser.user_metadata?.['avatar_url'] as string) ?? null,
      createdAt: authUser.created_at,
      stats: {
        missionsCompleted: statuses.filter((s) => s.status === 'completed').length,
        pinsCollected:     pins.filter((p) => p.status === 'claimed' || p.status === 'delivered').length,
        memoriesCount:     memories.length,
      },
    };

    return apiSuccess(user);
  } catch (err) {
    return handleRouteError(err);
  }
}
