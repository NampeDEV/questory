import { apiSuccess, handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { getMissions, getUserMissionStatuses } from '@/lib/api/missions';

// API-013 (SPEC-07) — GET /api/me/missions
// Returns all active missions with per-user submission status.

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    await getSessionOrThrow(supabase);

    const [missions, statuses] = await Promise.all([
      getMissions(),
      getUserMissionStatuses(),
    ]);

    const statusMap = new Map(statuses.map((s) => [s.missionId, s.status]));

    const result = missions.map((m) => ({
      ...m,
      submissionStatus: statusMap.get(m.id) ?? 'locked',
    }));

    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
