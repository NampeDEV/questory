import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiSuccess, apiError, handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';

// API-012 (SPEC-07) — POST /api/activate-board
// Validates activation code, returns boardId on success.
// Errors: INVALID_INPUT | UNAUTHORIZED | INVALID_CODE | ALREADY_ACTIVATED
//
// When NEXT_PUBLIC_SUPABASE_URL is set, queries `activation_codes` table.
// Otherwise falls back to hardcoded mock codes.
//
// @security Input is validated with Zod before lookup. Codes are normalised
// to UPPERCASE to prevent case-spoofing.
const VALID_CODES: Record<string, string> = {
  'BEGINNER10-DEMO': 'board-001',
  'NORTHERN-DEMO':   'board-002',
  'ULTIMATE-DEMO':   'board-003',
};

// Mock: in-memory set simulating "already activated" state (resets on server restart)
const activatedCodes = new Set<string>();

const ActivateSchema = z.object({
  code: z
    .string()
    .min(1, 'กรุณากรอก Activation Code')
    .max(64, 'Code ยาวเกินไป')
    .transform((v) => v.trim().toUpperCase()),
});

export async function POST(request: NextRequest) {
  try {
    const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

    // When Supabase is not configured (local dev / E2E), skip client creation and auth.
    if (!hasSupabase) {
      let body: unknown;
      try { body = await request.json(); }
      catch { return apiError('INVALID_INPUT', 'Invalid request body.', 400); }
      const parsed = ActivateSchema.safeParse(body);
      if (!parsed.success) return apiError('INVALID_INPUT', 'Validation failed.', 422, parsed.error.flatten());
      const code = parsed.data.code;
      const boardId = VALID_CODES[code];
      if (!boardId) return apiError('INVALID_CODE', 'Activation Code ไม่ถูกต้อง', 422);
      // In mock mode, skip ALREADY_ACTIVATED tracking — in-memory Set persists between E2E runs.
      return apiSuccess({ boardId }, 200);
    }

    const supabase = await createSupabaseServerClient();
    const user = await getSessionOrThrow(supabase).catch(() => null);
    if (!user) {
      return apiError('UNAUTHORIZED', 'กรุณาเข้าสู่ระบบก่อน', 401);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError('INVALID_INPUT', 'Invalid request body.', 400);
    }

    const parsed = ActivateSchema.safeParse(body);
    if (!parsed.success) {
      return apiError('INVALID_INPUT', 'Validation failed.', 422, parsed.error.flatten());
    }

    const code = parsed.data.code;

    // Supabase path (hasSupabase is true here — early return handles the false case above)
    {
      const { data: codeRow, error: codeError } = await supabase
        .from('activation_codes')
        .select('*')
        .eq('code', code)
        .is('used_at', null)
        .single();

      if (codeError || !codeRow) {
        // Check whether the code exists at all (to distinguish already-used vs invalid)
        const { data: anyCode } = await supabase
          .from('activation_codes')
          .select('id')
          .eq('code', code)
          .single();
        if (anyCode) {
          return apiError('ALREADY_ACTIVATED', 'Code นี้ถูกใช้งานแล้ว', 409);
        }
        return apiError('INVALID_CODE', 'Activation Code ไม่ถูกต้อง', 422);
      }

      const rec = codeRow as Record<string, unknown>;

      // Mark code as used
      await supabase
        .from('activation_codes')
        .update({ used_at: new Date().toISOString(), used_by_user_id: user.id })
        .eq('id', rec['id']);

      // Create the user board record
      await supabase.from('user_boards').insert({
        user_id: user.id,
        board_template_id: rec['board_template_id'],
        activated_at: new Date().toISOString(),
        activation_code_id: rec['id'],
      });

      return apiSuccess(
        { boardId: String(rec['board_template_id'] ?? 'mock-board-1'), activated: true },
        200,
      );
    }

  } catch (err) {
    return handleRouteError(err);
  }
}

