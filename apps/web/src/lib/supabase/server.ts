import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

// ARC-006 — Supabase server client for Route Handlers and Server Components.
//
// Uses the anon key + RLS so every request is row-level-scoped to the calling
// user.  The Authorization header (Bearer <jwt>) is forwarded automatically so
// Supabase Auth can validate the token server-side.
//
// Required env vars (set in .env.local):
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Returns a Supabase client scoped to the current request's JWT (if present).
 * Must only be called from Route Handlers or Server Components — never from
 * the browser bundle.
 */
export async function createSupabaseServerClient() {
  const headersList = await headers();
  const authorization = headersList.get('authorization') ?? '';

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      global: { headers: { authorization } },
      auth: { persistSession: false },
    },
  );
}
