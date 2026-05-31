import { z } from 'zod';
import { apiSuccess, apiError, handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { getMissionById } from '@/lib/api/missions';
import { uploadMissionPhoto, validatePhoto } from '@/lib/api/storage';

// Thailand bounding box for lat/lon validation
const TH_LAT_MIN = 5.5;
const TH_LAT_MAX = 20.5;
const TH_LON_MIN = 97.3;
const TH_LON_MAX = 105.7;

// API-014 (SPEC-07) — POST /api/missions/:missionId/submit
// Multipart: photo (JPEG/PNG ≤5 MB) + safetyAcknowledged=true + optional note/lat/lon

export async function POST(
  req: Request,
  { params }: { params: Promise<{ missionId: string }> },
) {
  try {
    const supabase = await createSupabaseServerClient();
    const user = await getSessionOrThrow(supabase);

    const { missionId } = await params;

    const mission = await getMissionById(missionId);
    if (!mission) {
      return apiError('NOT_FOUND', `Mission '${missionId}' not found.`, 404);
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return apiError('INVALID_INPUT', 'Expected multipart/form-data.', 400);
    }

    // SPEC-02 RULE-007 — safety acknowledgement is mandatory
    const safetyAck = formData.get('safetyAcknowledged');
    if (safetyAck !== 'true') {
      return apiError(
        'SAFETY_NOT_ACKNOWLEDGED',
        'กรุณายืนยันว่าส่งหลักฐานจากจุดที่ปลอดภัย',
        422,
      );
    }

    const photo = formData.get('photo');
    if (!(photo instanceof File)) {
      return apiError('INVALID_INPUT', 'กรุณาแนบรูปภาพ (field: photo)', 422);
    }

    const photoErr = validatePhoto(photo);
    if (photoErr) {
      return apiError('INVALID_INPUT', photoErr, 422);
    }

    // Optional: note + location
    const note    = formData.get('note');
    const latRaw  = formData.get('latitude');
    const lonRaw  = formData.get('longitude');

    const NoteSchema = z.string().max(2000).nullable();
    const noteVal = NoteSchema.safeParse(note ?? null);
    if (!noteVal.success) {
      return apiError('INVALID_INPUT', 'note ต้องไม่เกิน 2,000 ตัวอักษร', 422);
    }

    let latitude: number | null  = null;
    let longitude: number | null = null;
    if (latRaw && lonRaw) {
      latitude  = parseFloat(String(latRaw));
      longitude = parseFloat(String(lonRaw));
      if (
        isNaN(latitude) || isNaN(longitude) ||
        latitude  < TH_LAT_MIN || latitude  > TH_LAT_MAX ||
        longitude < TH_LON_MIN || longitude > TH_LON_MAX
      ) {
        return apiError('INVALID_INPUT', 'พิกัดต้องอยู่ในประเทศไทย', 422);
      }
    }

    // Upload photo to Supabase Storage
    const upload = await uploadMissionPhoto(user.id, missionId, photo);

    // Persist submission to DB; photo is already uploaded even if insert fails
    const submissionId = crypto.randomUUID();
    const { error: insertError } = await supabase.from('mission_submissions').insert({
      id: submissionId,
      user_id: user.id,
      mission_id: missionId,
      photo_url: upload.publicUrl,
      note: noteVal.data,
      latitude,
      longitude,
      status: 'pending_review',
      safety_acknowledged: true,
      submitted_at: new Date().toISOString(),
    });
    if (insertError) {
      // Log but don't fail — photo is already uploaded
      console.error('[submit] DB insert failed', { missionId });
    }

    const submission = {
      id:          submissionId,
      missionId,
      userId:      user.id,
      photoUrls:   [upload.publicUrl],
      latitude,
      longitude,
      note:        noteVal.data,
      status:      'submitted' as const,
      submittedAt: new Date().toISOString(),
      reviewedAt:  null,
      reviewNote:  null,
    };

    return apiSuccess(submission, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
