import { z } from 'zod';
import { type NextRequest, NextResponse } from 'next/server';
import { moderateInput } from '@/lib/ai/moderation';
import { checkCredits, deductCredits } from '@/lib/ai/credits';
import { buildCacheKey, getCached, setCached } from '@/lib/ai/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { apiError } from '@/lib/api/response';

// AI-006 (SPEC-09) — POST /api/ai/memory-writer
// Generates a short memory write-up from mission details.
// Unlimited — no credit deduction.

const MemoryWriterSchema = z.object({
  parkName:    z.string().min(1).max(100),
  missionName: z.string().min(1).max(100),
  note:        z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await getSessionOrThrow(supabase);

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return apiError('INVALID_INPUT', 'Invalid request body.', 400);
    }

    const parsed = MemoryWriterSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError('INVALID_INPUT', 'Validation failed.', 422, parsed.error.flatten());
    }

    // Content moderation
    const checks = [parsed.data.parkName, parsed.data.missionName, parsed.data.note ?? ''];
    for (const text of checks) {
      const mod = moderateInput(text);
      if (mod.blocked) {
        return apiError('INVALID_INPUT', mod.reason, 422);
      }
    }

    await checkCredits(user.id, 'memory-writer');

    const cacheKey = buildCacheKey('memory-writer', parsed.data);
    const cached   = getCached<{ body: string }>(cacheKey);
    if (cached) return NextResponse.json({ data: cached });

    // POC: mock response
    const body = `วันนี้ได้มีโอกาสเดินทางไปยัง${parsed.data.parkName} ` +
      `เพื่อทำภารกิจ "${parsed.data.missionName}" ` +
      (parsed.data.note ? `${parsed.data.note} ` : '') +
      'เป็นประสบการณ์ที่น่าจดจำและสร้างแรงบันดาลใจในการท่องเที่ยวธรรมชาติของไทย';

    const result = { body };
    setCached(cacheKey, result);
    await deductCredits(user.id, 'memory-writer');

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.startsWith('RATE_LIMITED')) {
      return apiError('RATE_LIMITED', 'คุณใช้ฟีเจอร์นี้เกินโควต้าแล้ว', 429);
    }
    return apiError('INTERNAL_ERROR', 'AI service error.', 500);
  }
}
