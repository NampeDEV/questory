import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { apiSuccess, apiError, handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { getUserMemories } from '@/lib/api/memories';

// API-017 (SPEC-07) — GET /api/me/memories
// Returns authenticated user's own memories, optionally filtered by visibility.
// POST /api/me/memories — Creates a new memory for the authenticated user.

const PostMemorySchema = z.object({
  note: z.string().max(2000, 'note ต้องไม่เกิน 2,000 ตัวอักษร'),
  photo_url: z.string().url().optional(),
  mission_id: z.string().optional(),
  visibility: z.enum(['public', 'private']).default('private'),
});

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await getSessionOrThrow(supabase);

    const visibility = req.nextUrl.searchParams.get('visibility');
    if (visibility && visibility !== 'public' && visibility !== 'private') {
      return apiError('INVALID_INPUT', 'visibility must be public or private', 422);
    }

    const memories = await getUserMemories(user.id);
    const filtered = visibility ? memories.filter((m) => m.visibility === visibility) : memories;

    return apiSuccess(filtered);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await getSessionOrThrow(supabase);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return apiError('INVALID_INPUT', 'Invalid request body.', 400);
    }

    const parsed = PostMemorySchema.safeParse(body);
    if (!parsed.success) {
      return apiError('INVALID_INPUT', 'Validation failed.', 422, parsed.error.flatten());
    }

    const { note, photo_url, mission_id, visibility } = parsed.data;

    const { data, error } = await supabase
      .from('memories')
      .insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        mission_id: mission_id ?? null,
        photo_url: photo_url ?? null,
        note,
        visibility,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return apiError('INVALID_INPUT', error.message, 422);
    }

    return apiSuccess(data, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}

