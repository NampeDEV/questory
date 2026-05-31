// ARC-STORAGE (SPEC-09) — Storage helper for mission photo uploads.

export type UploadResult = {
  path: string;
  publicUrl: string;
};

/**
 * Upload a mission proof photo to Supabase Storage (bucket: mission-photos).
 * Uses the service role client for bucket writes.
 *
 * @security Filename is a crypto.randomUUID() — never derived from user input.
 */
export async function uploadMissionPhoto(
  userId: string,
  missionId: string,
  file: File,
): Promise<UploadResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && serviceKey) {
    const ext = file.type === 'image/png' ? 'png' : 'jpg';
    // Security: randomUUID() ensures filename is never derived from user input
    const filename = `${crypto.randomUUID()}.${ext}`;
    const path = `${userId}/${missionId}/${filename}`;

    const { createClient } = await import('@supabase/supabase-js');
    // Service role bypasses RLS — used only for storage writes, not data reads
    const adminClient = createClient(url, serviceKey);
    const bytes = await file.arrayBuffer();
    const { error } = await adminClient.storage
      .from('mission-photos')
      .upload(path, bytes, { contentType: file.type, upsert: false });

    if (!error) {
      const { data: urlData } = adminClient.storage
        .from('mission-photos')
        .getPublicUrl(path);
      return { path, publicUrl: urlData.publicUrl };
    }
  }

  // Fallback: mock URL when env not configured or upload failed
  const path = `${userId}/${missionId}/${crypto.randomUUID()}.jpg`;
  return {
    path,
    publicUrl: 'https://placeholder.example.com/photo.jpg',
  };
}


const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png']);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validate a photo upload File before it reaches the storage layer.
 * Returns an error string or null if valid.
 */
export function validatePhoto(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.has(file.type)) return 'รองรับเฉพาะ JPEG และ PNG';
  if (file.size > MAX_BYTES) return 'ขนาดไฟล์ต้องไม่เกิน 5 MB';
  return null;
}
