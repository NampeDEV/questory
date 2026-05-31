import { getProductBySlug } from '@/lib/api/products';
import { apiSuccess, apiError } from '@/lib/api/response';

// API-PRODUCTS-GET (SPEC-07) — GET /api/products/:slug
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return apiError('NOT_FOUND', `Product '${slug}' not found.`, 404);
    }

    return apiSuccess(product);
  } catch {
    return apiError('INTERNAL_ERROR', 'Failed to fetch product.', 500);
  }
}
