import { getBoardBySlug } from '@/lib/api/boards';
import { getMissions } from '@/lib/api/missions';
import { getBadges } from '@/lib/api/pins';
import { getProducts } from '@/lib/api/products';
import { apiSuccess, apiError } from '@/lib/api/response';

// API-BOARDS-GET (SPEC-07) — GET /api/boards/:slug
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const board = await getBoardBySlug(slug);

    if (!board) {
      return apiError('NOT_FOUND', `Board '${slug}' not found.`, 404);
    }

    const [missions, allBadges, allProducts] = await Promise.all([
      getMissions(board.id),
      getBadges(),
      getProducts(),
    ]);

    // Rewards = badges whose missionId belongs to this board's missions
    const missionIds = new Set(missions.map((m) => m.id));
    const rewards = allBadges.filter(
      (b) => (b.missionId && missionIds.has(b.missionId)) || b.boardTemplateId === board.id,
    );

    // Products linked to this board (by boardTemplateId on product, POC: use matching products)
    const boardProducts = allProducts.filter((p) => p.boardTemplateId === board.id);

    return apiSuccess({ ...board, missions, rewards, products: boardProducts });
  } catch {
    return apiError('INTERNAL_ERROR', 'Failed to fetch board.', 500);
  }
}
