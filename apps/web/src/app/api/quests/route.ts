import { getBoards } from '@/lib/api/boards';
import { getMissions } from '@/lib/api/missions';
import { apiSuccess, apiError } from '@/lib/api/response';

// API-QUESTS-LIST (SPEC-07) — GET /api/quests
// Returns mission catalog grouped by board template.
export async function GET() {
  try {
    const boards = await getBoards();

    const quests = await Promise.all(
      boards.map(async (board) => {
        const missions = await getMissions(board.id);
        return { board, missions };
      }),
    );

    return apiSuccess(quests);
  } catch {
    return apiError('INTERNAL_ERROR', 'Failed to fetch quests.', 500);
  }
}
