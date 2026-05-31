import { missions, mockUserMissionStatuses } from '@/data/missions';
import type { Mission } from '@/types/mission';
import type { UserMissionStatus } from '@/data/missions';

// Data-access facade for missions (RULE-005, S-010c)
// When NEXT_PUBLIC_SUPABASE_URL is set, queries Supabase; falls back to mock data.
//
// Supabase table: missions
//   id text PK, board_template_id text FK, title text, description text,
//   difficulty text, points int, status text, order_index int, created_at timestamptz

export async function getMissions(boardTemplateId?: string): Promise<Mission[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    let query = supabase.from('missions').select('*').eq('status', 'active').order('order_index');
    if (boardTemplateId) query = query.eq('board_template_id', boardTemplateId);
    const { data } = await query;
    if (data) return data as Mission[];
  }

  // Fallback: mock data
  const active = missions.filter((m) => m.status === 'active');
  if (boardTemplateId) return active.filter((m) => m.boardTemplateId === boardTemplateId);
  return active;
}

export async function getMissionById(id: string): Promise<Mission | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from('missions')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single();
    if (data) return data as Mission;
  }

  return missions.find((m) => m.id === id && m.status === 'active') ?? null;
}

export async function getUserMissionStatuses(): Promise<UserMissionStatus[]> {
  // TODO(#S-010c): query user_missions table with authenticated Supabase server client
  return mockUserMissionStatuses;
}
