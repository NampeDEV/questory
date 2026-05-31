import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { apiSuccess, apiError, handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/api/auth';
import { getUserMissionStatuses } from '@/lib/api/missions';
import { getMissions } from '@/lib/api/missions';

// Allowed status transitions by admin
const AllowedStatuses = ['approved', 'rejected', 'need_more_info'] as const;

const PatchSchema = z.object({
  id:          z.string().min(1),
  status:      z.enum(AllowedStatuses),
  reviewNote:  z.string().max(500).optional(),
});

type SubmissionRow = {
  id: string;
  user_id: string;
  mission_id: string;
  photo_url: string | null;
  note: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  safety_acknowledged: boolean;
  submitted_at: string;
  reviewed_at: string | null;
  reviewer_id: string | null;
  review_note: string | null;
  // Supabase returns joined rows as arrays; we take the first element
  missions: { id: string; title: string; difficulty: string; points: number }[] | null;
};

// API-ADM-002 (SPEC-07) — GET /api/admin/submissions
// Returns paginated list of mission submissions.

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    await requireAdmin(supabase);

    const { searchParams } = req.nextUrl;
    const statusFilter = searchParams.get('status');
    const page         = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const PAGE_SIZE    = 20;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      let query = supabase
        .from('mission_submissions')
        .select(
          `id, user_id, mission_id, photo_url, note, latitude, longitude,
           status, safety_acknowledged, submitted_at, reviewed_at, reviewer_id, review_note,
           missions ( id, title, difficulty, points )`,
          { count: 'exact' },
        )
        .order('submitted_at', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, count } = await query;

      const items = ((data ?? []) as unknown as SubmissionRow[]).map((row) => ({
        id:                 row.id,
        userId:             row.user_id,
        missionId:          row.mission_id,
        photoUrl:           row.photo_url,
        note:               row.note,
        latitude:           row.latitude,
        longitude:          row.longitude,
        status:             row.status,
        safetyAcknowledged: row.safety_acknowledged,
        submittedAt:        row.submitted_at,
        reviewedAt:         row.reviewed_at,
        reviewerId:         row.reviewer_id,
        reviewNote:         row.review_note,
        mission:            row.missions?.[0] ?? null,
      }));

      return NextResponse.json({ data: items, meta: { total: count ?? 0, page, pageSize: PAGE_SIZE } });
    }

    // Fallback: mock data
    const [missions, statuses] = await Promise.all([getMissions(), getUserMissionStatuses()]);
    const missionMap           = new Map(missions.map((m) => [m.id, m]));

    let filtered = statuses;
    if (statusFilter) {
      filtered = statuses.filter((s) => s.status === statusFilter);
    }

    const total   = filtered.length;
    const slice   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const items   = slice.map((s) => ({
      ...s,
      mission: missionMap.get(s.missionId) ?? null,
    }));

    return NextResponse.json({ data: items, meta: { total, page, pageSize: PAGE_SIZE } });
  } catch (err) {
    return handleRouteError(err);
  }
}

// API-ADM-002 (SPEC-07) — PATCH /api/admin/submissions
// Update a submission status (approve/reject/need_more_info).

export async function PATCH(req: NextRequest) {
  try {
    const supabase   = await createSupabaseServerClient();
    const adminUser  = await requireAdmin(supabase);

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const { error } = await supabase
        .from('mission_submissions')
        .update({
          status:      parsed.data.status,
          review_note: parsed.data.reviewNote ?? null,
          reviewed_at: new Date().toISOString(),
          reviewer_id: adminUser.id,
        })
        .eq('id', parsed.data.id);

      if (error) {
        return apiError('NOT_FOUND', `Submission '${parsed.data.id}' not found or update failed.`, 404);
      }

      return apiSuccess({ id: parsed.data.id, status: parsed.data.status });
    }

    // Fallback: mock
    const statuses = await getUserMissionStatuses();
    const existing = statuses.find((s) => s.missionId === parsed.data.id);
    if (!existing) {
      return apiError('NOT_FOUND', `Submission '${parsed.data.id}' not found.`, 404);
    }

    const updated = {
      ...existing,
      status:     parsed.data.status,
      reviewNote: parsed.data.reviewNote ?? null,
      reviewedAt: new Date().toISOString(),
    };

    return apiSuccess(updated);
  } catch (err) {
    return handleRouteError(err);
  }
}
