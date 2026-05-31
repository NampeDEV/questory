import { boardTemplates } from '@/data/boards';
import type { BoardTemplate } from '@/types/board';

// Data-access facade (RULE-005, STACK-006, S-010a)
// When NEXT_PUBLIC_SUPABASE_URL is set, queries Supabase; falls back to mock data.
//
// Supabase table: board_templates
//   id text PK, slug text, title text, description text, cover_image_url text,
//   park_name text, difficulty text, status text, mission_count int, created_at timestamptz

async function querySupabaseBoards(): Promise<BoardTemplate[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('board_templates')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) return null;
  return data as BoardTemplate[];
}

export async function getBoards(): Promise<BoardTemplate[]> {
  const live = await querySupabaseBoards();
  if (live) return live;
  // Fallback: mock data
  return boardTemplates.filter((b) => b.status === 'active');
}

export async function getBoardBySlug(slug: string): Promise<BoardTemplate | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from('board_templates')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();
    if (data) return data as BoardTemplate;
  }

  // Fallback: mock data
  return boardTemplates.find((b) => b.slug === slug && b.status === 'active') ?? null;
}
