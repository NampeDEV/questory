// AI-002 (SPEC-09) — Credit ledger helpers.
// Production: stores usage in public.ai_plugin_usage via Supabase service role.
// Fallback:   in-memory Map keyed by userId (resets on server restart — used
//             when SUPABASE_SERVICE_ROLE_KEY is not configured).
//
// Credit rules (SPEC-09):
//   trip-planner : 1 free/month; after that 49–99 THB credit consumed
//   memory-writer: unlimited (0 credit)
//   caption      : 3 free/month; after that 1 credit each
//   checklist    : unlimited (0 credit)
//   recommend    : unlimited (0 credit)

export type AIPlugin = 'trip-planner' | 'memory-writer' | 'caption' | 'checklist' | 'recommend';

// Free-tier allowances per calendar month (SPEC-09)
const FREE_PER_MONTH: Partial<Record<AIPlugin, number>> = {
  'trip-planner': 1,
  'caption':      3,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7); // 'YYYY-MM'
}

// ─── Supabase-backed persistence ─────────────────────────────────────────────
// Uses the ai_plugin_usage table (defined in docs/schema.sql).
// All writes go through the `increment_ai_plugin_usage` stored function
// for atomic upsert-and-increment.

async function getSupabaseUsageCount(
  userId: string,
  plugin: AIPlugin,
): Promise<number | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from('ai_plugin_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('plugin', plugin)
    .eq('month', currentMonth())
    .maybeSingle();

  if (error) return null;
  if (!data) return 0; // no row = 0 uses this month
  return (data as { count: number }).count;
}

async function incrementSupabaseUsage(
  userId: string,
  plugin: AIPlugin,
): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);

  // increment_ai_plugin_usage is defined in docs/schema.sql — atomic upsert+increment
  const { error } = await supabase.rpc('increment_ai_plugin_usage', {
    p_user_id: userId,
    p_plugin:  plugin,
    p_month:   currentMonth(),
  });

  return !error;
}

// ─── In-memory fallback ───────────────────────────────────────────────────────

const memLedger = new Map<string, Map<AIPlugin, number>>();

function memLedgerFor(userId: string): Map<AIPlugin, number> {
  let ul = memLedger.get(userId);
  if (!ul) {
    ul = new Map();
    memLedger.set(userId, ul);
  }
  return ul;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns remaining free uses for `plugin` this month.
 * Returns `Infinity` for unlimited plugins.
 */
export async function getCreditsRemaining(userId: string, plugin: AIPlugin): Promise<number> {
  const limit = FREE_PER_MONTH[plugin];
  if (limit === undefined) return Infinity;

  const supabaseCount = await getSupabaseUsageCount(userId, plugin);
  const used = supabaseCount ?? (memLedgerFor(userId).get(plugin) ?? 0);
  return Math.max(0, limit - used);
}

/**
 * Throws if the user has no remaining credits for `plugin`.
 */
export async function checkCredits(userId: string, plugin: AIPlugin): Promise<void> {
  const remaining = await getCreditsRemaining(userId, plugin);
  if (remaining === 0) {
    throw new Error(`RATE_LIMITED:${plugin}`);
  }
}

/**
 * Deduct one credit for `plugin` from `userId`.
 * Call after a successful AI response (not before, to avoid charging on failure).
 */
export async function deductCredits(userId: string, plugin: AIPlugin): Promise<void> {
  const limit = FREE_PER_MONTH[plugin];
  if (limit === undefined) return; // unlimited — nothing to deduct

  const persisted = await incrementSupabaseUsage(userId, plugin);
  if (!persisted) {
    // Supabase not configured — fall back to in-memory ledger
    const ul = memLedgerFor(userId);
    ul.set(plugin, (ul.get(plugin) ?? 0) + 1);
  }
}
