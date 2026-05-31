import { createHash } from 'crypto';

// AI-004 (SPEC-09) — AI response cache.
// Keyed by sha256(plugin + serialised input) to avoid duplicate AI calls.
// POC: in-memory Map (resets on server restart).
// M4: replace with Supabase `ai_cache` table with TTL index.

const cache = new Map<string, unknown>();

/**
 * Compute a deterministic cache key for an AI request.
 * Uses SHA-256 of `plugin + JSON.stringify(input)`.
 */
export function buildCacheKey(plugin: string, input: unknown): string {
  const payload = plugin + JSON.stringify(input);
  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Retrieve a cached AI response. Returns `null` on miss.
 */
export function getCached<T>(key: string): T | null {
  const hit = cache.get(key);
  return hit !== undefined ? (hit as T) : null;
}

/**
 * Store an AI response in the cache.
 */
export function setCached(key: string, value: unknown): void {
  cache.set(key, value);
}
