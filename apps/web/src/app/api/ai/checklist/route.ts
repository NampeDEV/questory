import { z } from 'zod';
import { type NextRequest, NextResponse } from 'next/server';
import { moderateInput } from '@/lib/ai/moderation';
import { checkCredits, deductCredits } from '@/lib/ai/credits';
import { buildCacheKey, getCached, setCached } from '@/lib/ai/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { apiError } from '@/lib/api/response';

// AI-008 (SPEC-09) — POST /api/ai/checklist
// Generates a packing/preparation checklist for a national park visit.
// Unlimited — no credit deduction.

const ChecklistSchema = z.object({
  parkName:    z.string().min(1).max(100),
  durationDays: z.number().int().min(1).max(14).optional().default(2),
  activities:  z.array(z.string().max(50)).max(5).optional().default([]),
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

    const parsed = ChecklistSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError('INVALID_INPUT', 'Validation failed.', 422, parsed.error.flatten());
    }

    const mod = moderateInput(parsed.data.parkName);
    if (mod.blocked) return apiError('INVALID_INPUT', mod.reason, 422);

    await checkCredits(user.id, 'checklist');

    const cacheKey = buildCacheKey('checklist', parsed.data);
    const cached   = getCached<{ items: string[] }>(cacheKey);
    if (cached) return NextResponse.json({ data: cached });

    // POC: mock checklist
    const result = {
      items: [
        'บัตรประชาชนหรือพาสปอร์ต',
        'น้ำดื่มอย่างน้อย 2 ลิตร/วัน',
        'ครีมกันแดด SPF 50+',
        'รองเท้าเดินป่า',
        'ไฟฉายหรือโคมไฟหัว',
        'ยาสามัญประจำบ้าน',
        'เสื้อกันฝนหรือปอนโช่',
        `ค่าธรรมเนียมเข้า ${parsed.data.parkName} (เตรียมเงินสด)`,
        ...(parsed.data.durationDays > 1 ? ['เต็นท์หรือจองที่พักล่วงหน้า'] : []),
        ...(parsed.data.activities.length > 0
          ? [`อุปกรณ์สำหรับ: ${parsed.data.activities.join(', ')}`]
          : []),
      ],
    };

    setCached(cacheKey, result);
    await deductCredits(user.id, 'checklist');

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.startsWith('RATE_LIMITED')) {
      return apiError('RATE_LIMITED', 'คุณใช้ฟีเจอร์นี้เกินโควต้าแล้ว', 429);
    }
    return apiError('INTERNAL_ERROR', 'AI service error.', 500);
  }
}
