import { z } from 'zod';
import { type NextRequest, NextResponse } from 'next/server';
import { moderateInput } from '@/lib/ai/moderation';
import { checkCredits, deductCredits } from '@/lib/ai/credits';
import { buildCacheKey, getCached, setCached } from '@/lib/ai/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { apiError } from '@/lib/api/response';
import { getBoards } from '@/lib/api/boards';

// AI-009 (SPEC-09) — POST /api/ai/recommend
// Recommends national park boards based on user preferences.
// Unlimited — no credit deduction.

const RecommendSchema = z.object({
  region:      z.enum(['north', 'central', 'northeast', 'east', 'south']).optional(),
  difficulty:  z.enum(['easy', 'medium', 'hard']).optional(),
  interests:   z.array(z.string().max(50)).max(5).optional().default([]),
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

    const parsed = RecommendSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError('INVALID_INPUT', 'Validation failed.', 422, parsed.error.flatten());
    }

    for (const interest of parsed.data.interests) {
      const mod = moderateInput(interest);
      if (mod.blocked) return apiError('INVALID_INPUT', mod.reason, 422);
    }

    await checkCredits(user.id, 'recommend');

    const cacheKey = buildCacheKey('recommend', parsed.data);
    const cached   = getCached<{ boards: unknown[] }>(cacheKey);
    if (cached) return NextResponse.json({ data: cached });

    // POC: filter boards (BoardTemplate has no region field — M4: join with Mission)
    const boards = await getBoards();

    const result = {
      boards: boards.slice(0, 3).map((b) => ({
        id:      b.id,
        slug:    b.slug,
        name:    b.name,
        region:  parsed.data.region ?? null,
        reason:  `เหมาะสำหรับนักท่องเที่ยวที่ชอบ${parsed.data.interests[0] ?? 'ธรรมชาติ'}`,
      })),
    };

    setCached(cacheKey, result);
    await deductCredits(user.id, 'recommend');

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.startsWith('RATE_LIMITED')) {
      return apiError('RATE_LIMITED', 'คุณใช้ฟีเจอร์นี้เกินโควต้าแล้ว', 429);
    }
    return apiError('INTERNAL_ERROR', 'AI service error.', 500);
  }
}
