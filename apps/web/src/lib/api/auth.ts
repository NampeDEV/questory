import type { SupabaseClient } from '@supabase/supabase-js';
import { ApiError } from '@/lib/api/response';

// ARC-007 — Auth guard helpers for Route Handlers.
//
// Usage:
//   const supabase = await createSupabaseServerClient();
//   const user     = await getSessionOrThrow(supabase);   // app routes
//   const admin    = await requireAdmin(supabase);         // admin routes

/**
 * Returns the authenticated user or throws `ApiError(UNAUTHORIZED, 401)`.
 *
 * Validates the Bearer JWT with Supabase Auth (remote call).  Never trust
 * the JWT payload alone — always call `getUser()` to confirm it hasn't been
 * revoked.
 */
export async function getSessionOrThrow(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error ?? !user) {
    throw new ApiError('UNAUTHORIZED', 401, 'กรุณาเข้าสู่ระบบก่อน');
  }

  return user;
}

/**
 * Returns the authenticated admin user or throws `ApiError(FORBIDDEN, 403)`.
 *
 * Admin flag lives in `user.app_metadata.role === 'admin'`.  This field can
 * only be written server-side (Supabase service role), so it cannot be
 * spoofed by a client JWT.
 */
export async function requireAdmin(supabase: SupabaseClient) {
  const user = await getSessionOrThrow(supabase);

  const role = (user.app_metadata as { role?: string })?.role;
  if (role !== 'admin') {
    throw new ApiError('FORBIDDEN', 403, 'Admin access required.');
  }

  return user;
}
