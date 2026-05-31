import { publicMemories } from '@/data/memories';
import type { Memory, MemoryVisibility } from '@/types/memory';

// Data-access facade for memories (RULE-005, S-010e)
// When NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY are set,
// queries Supabase; falls back to mock data otherwise.

function rowToMemory(row: Record<string, unknown>): Memory {
  const photoUrl = row['photo_url'] != null ? String(row['photo_url']) : null;
  return {
    id: String(row['id']),
    userId: String(row['user_id']),
    missionSubmissionId: row['mission_id'] != null ? String(row['mission_id']) : '',
    title: '',
    body: String(row['note'] ?? ''),
    photoUrls: photoUrl ? [photoUrl] : [],
    visibility: (row['visibility'] as MemoryVisibility | undefined) ?? 'public',
    createdAt: String(row['created_at'] ?? new Date().toISOString()),
  };
}

async function querySupabasePublicMemories(): Promise<Memory[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('memories')
    .select('id, user_id, mission_id, photo_url, note, visibility, created_at')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  if (error || !data) return null;
  return (data as Record<string, unknown>[]).map(rowToMemory);
}

async function querySupabaseUserMemories(userId: string): Promise<Memory[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('memories')
    .select('id, user_id, mission_id, photo_url, note, visibility, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return null;
  return (data as Record<string, unknown>[]).map(rowToMemory);
}

export async function getPublicMemories(): Promise<Memory[]> {
  const live = await querySupabasePublicMemories();
  if (live) return live;
  return publicMemories.filter((m) => m.visibility === 'public');
}

export async function getUserMemories(userId: string): Promise<Memory[]> {
  const live = await querySupabaseUserMemories(userId);
  if (live) return live;
  return publicMemories.filter((m) => m.userId === userId);
}

