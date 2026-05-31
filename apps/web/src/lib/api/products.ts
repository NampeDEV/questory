import { products } from '@/data/products';
import type { Product } from '@/types/product';

// Data-access facade for products (RULE-005, S-010f)
// Supabase table: products  (id, slug, name, description, price, image_url, ...)

export async function getProducts(): Promise<Product[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const { data } = await createClient(url, key).from('products').select('*').order('price');
    if (data) return data as Product[];
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const { data } = await createClient(url, key).from('products').select('*').eq('slug', slug).single();
    if (data) return data as Product;
  }

  return products.find((p) => p.slug === slug) ?? null;
}
