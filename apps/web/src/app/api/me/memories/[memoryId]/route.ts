import { z } from 'zod';
import { apiSuccess, apiError, handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { getPublicMemories } from '@/lib/api/memories';
import type { MemoryVisibility } from '@/types/memory';

// API-017 (SPEC-07) — PATCH /api/me/memories/:memoryId
// Update memory visibility or body.

const PatchSchema = z.object({
  visibility: z.enum(['public', 'private'] as const).optional(),
  body: z.string().max(2000).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ memoryId: string }> },
) {
  try {
    const supabase = await createSupabaseServerClient();
    await getSessionOrThrow(supabase);

    const { memoryId } = await params;

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return apiError('INVALID_INPUT', 'Invalid request body.', 400);
    }

    const parsed = PatchSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError('INVALID_INPUT', 'Validation failed.', 422, parsed.error.flatten());
    }

    // POC: find memory in mock data and return updated shape
    const memories = await getPublicMemories();
    const memory   = memories.find((m) => m.id === memoryId);
    if (!memory) {
      return apiError('NOT_FOUND', `Memory '${memoryId}' not found.`, 404);
    }

    const updated = {
      ...memory,
      ...(parsed.data.visibility ? { visibility: parsed.data.visibility as MemoryVisibility } : {}),
      ...(parsed.data.body ? { body: parsed.data.body } : {}),
    };

    return apiSuccess(updated);
  } catch (err) {
    return handleRouteError(err);
  }
}
