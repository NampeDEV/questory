import { getProducts } from '@/lib/api/products';
import { apiSuccess, apiError } from '@/lib/api/response';

// API-PRODUCTS-LIST (SPEC-07) — GET /api/products
export async function GET() {
  try {
    const products = await getProducts();
    // Only expose active / sold_out products (not archived)
    return apiSuccess(products.filter((p) => p.stock >= 0));
  } catch {
    return apiError('INTERNAL_ERROR', 'Failed to fetch products.', 500);
  }
}
