import { type NextRequest } from 'next/server';
import { getBoards } from '@/lib/api/boards';
import { apiSuccess, apiError } from '@/lib/api/response';
import type { BoardCategory } from '@/types/board';

const VALID_CATEGORIES: BoardCategory[] = ['starter', 'regional', 'ultimate', 'custom'];

// API-BOARDS-LIST (SPEC-07) — GET /api/boards?category=<...>
export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get('category') as BoardCategory | null;

    if (category !== null && !VALID_CATEGORIES.includes(category)) {
      return apiError('INVALID_INPUT', `category must be one of: ${VALID_CATEGORIES.join(', ')}`, 422);
    }

    let boards = await getBoards();
    if (category) {
      boards = boards.filter((b) => b.category === category);
    }

    return apiSuccess(boards);
  } catch {
    return apiError('INTERNAL_ERROR', 'Failed to fetch boards.', 500);
  }
}
