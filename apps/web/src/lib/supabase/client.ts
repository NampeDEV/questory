import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// S-011 — Supabase browser client for Client Components.
// Must only be imported in 'use client' files.
//
// Lazy singleton: client is created on first access, not at module load.
// This prevents SSG crashes when NEXT_PUBLIC_SUPABASE_URL is empty at build time.
//
// Required env vars:
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY

let _client: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // During SSG/build without env vars — return a no-op stub
    // Actual calls will fail gracefully; components must handle the error state
    _client = createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    return _client;
  }

  _client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return _client;
}

/**
 * Supabase browser client.
 * Uses a Proxy so callers can write `supabase.auth.*` and `supabase.from(...)` as before,
 * but the actual client is only instantiated on first property access.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabase()[prop as keyof SupabaseClient];
  },
});

