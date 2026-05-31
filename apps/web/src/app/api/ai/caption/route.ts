import { z } from 'zod';
import { type NextRequest, NextResponse } from 'next/server';
import { moderateInput } from '@/lib/ai/moderation';
import { checkCredits, deductCredits } from '@/lib/ai/credits';
import { buildCacheKey, getCached, setCached } from '@/lib/ai/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { apiError } from '@/lib/api/response';

// AI-007 (SPEC-09) — POST /api/ai/caption
// Generates a social-media caption for a mission photo.
// Free: 3/month.

const CaptionSchema = z.object({
  parkName:    z.string().min(1).max(100),
  missionName: z.string().min(1).max(100),
  tone:        z.enum(['inspiring', 'fun', 'informative']).optional().default('inspiring'),
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

    const parsed = CaptionSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError('INVALID_INPUT', 'Validation failed.', 422, parsed.error.flatten());
    }

    const checks = [parsed.data.parkName, parsed.data.missionName];
    for (const text of checks) {
      const mod = moderateInput(text);
      if (mod.blocked) return apiError('INVALID_INPUT', mod.reason, 422);
    }

    await checkCredits(user.id, 'caption');

    const cacheKey = buildCacheKey('caption', parsed.data);
    const cached   = getCached<{ caption: string; hashtags: string[] }>(cacheKey);
    if (cached) return NextResponse.json({ data: cached });

    // POC: mock response
    const toneMap: Record<string, string> = {
      inspiring:   `ธรรมชาติไทยงดงามจริงๆ 🌿 วันนี้พิชิต ${parsed.data.missionName} ที่ ${parsed.data.parkName} สำเร็จแล้ว!`,
      fun:         `ยิ้มแก้มแตก! ✨ ทำ ${parsed.data.missionName} ที่ ${parsed.data.parkName} ครั้งแรก — epic มากก`,
      informative: `${parsed.data.parkName} คือหนึ่งในอุทยานที่ต้องมาเยือน ภารกิจ: ${parsed.data.missionName}`,
    };
    const result = {
      caption:  toneMap[parsed.data.tone]!,
      hashtags: ['#Questory', `#${parsed.data.parkName.replace(/\s/g, '')}`],
    };

    setCached(cacheKey, result);
    await deductCredits(user.id, 'caption');

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.startsWith('RATE_LIMITED')) {
      return apiError('RATE_LIMITED', 'คุณใช้ฟีเจอร์ caption ครบ 3 ครั้ง/เดือนแล้ว', 429);
    }
    return apiError('INTERNAL_ERROR', 'AI service error.', 500);
  }
}
