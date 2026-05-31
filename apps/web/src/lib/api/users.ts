// Data-access facade for public.users (S-023)
// Requires SUPABASE_SERVICE_ROLE_KEY — server-side only.
// Returns null when Supabase is not configured (mock / local mode).

export type UserRow = {
  id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
};

async function querySupabaseUser(userId: string): Promise<UserRow | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from('users')
    .select('id, display_name, email, avatar_url, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as UserRow;
}

/**
 * Fetch a user row by their auth UUID.
 * Returns null when the user does not exist or Supabase is not configured.
 */
export async function getUserById(userId: string): Promise<UserRow | null> {
  return querySupabaseUser(userId);
}
