import { apiSuccess, handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { getBoards } from '@/lib/api/boards';
import { getMissions, getUserMissionStatuses } from '@/lib/api/missions';

// API-011 (SPEC-07) — GET /api/me/boards
// Returns the boards activated by the authenticated user + per-board progress %.
// POC: returns all active board templates as if the user has activated them,
//      with progress % computed from mock mission statuses.

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    await getSessionOrThrow(supabase);

    const [boards, allMissions, statuses] = await Promise.all([
      getBoards(),
      getMissions(),
      getUserMissionStatuses(),
    ]);

    const statusMap = new Map(statuses.map((s) => [s.missionId, s.status]));

    const result = boards.map((board) => {
      const boardMissions = allMissions.filter((m) => m.boardTemplateId === board.id);
      const total      = boardMissions.length;
      const completed  = boardMissions.filter(
        (m) => statusMap.get(m.id) === 'completed',
      ).length;
      const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { ...board, progressPct, completedMissions: completed, totalMissions: total };
    });

    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
