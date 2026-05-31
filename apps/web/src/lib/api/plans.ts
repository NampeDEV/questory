import { plans } from '@/data/plans';
import type { Plan } from '@/types/plan';

// Data-access facade for plans (RULE-005, S-010b)
// Supabase table: plans  (id, slug, title, description, price, board_template_id, ...)

export async function getPlans(): Promise<Plan[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const { data } = await createClient(url, key).from('plans').select('*').order('price');
    if (data) return data as Plan[];
  }

  return plans;
}

export async function getPlanBySlug(slug: string): Promise<Plan | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const { data } = await createClient(url, key).from('plans').select('*').eq('slug', slug).single();
    if (data) return data as Plan;
  }

  return plans.find((p) => p.slug === slug) ?? null;
}
