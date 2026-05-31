import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

// AC-APP-008b — OG share card for approved mission submissions.
// Returns a 1200×630 PNG containing user name, mission name, park name, and progress.
// Live data: fetched from Supabase when configured (requires approved + share_permission=true).
// Fallback: mock data for development / when Supabase is not configured.

export const runtime = 'edge';

type RouteContext = {
  params: Promise<{ submissionId: string }>;
};

type OGData = {
  id: string;
  userName: string;
  missionName: string;
  badgeEmoji: string;
  progressText: string;
  parkName: string;
};

// ─── Mock fallback (dev / no Supabase) ───────────────────────────────────────

const MOCK_SUBMISSIONS: Record<string, OGData> = {
  'sub-001': {
    id: 'sub-001',
    userName: 'Chayachai',
    missionName: 'พิชิตยอดดอยอินทนนท์',
    badgeEmoji: '⛰️',
    progressText: '12 / 20 Parks',
    parkName: 'อุทยานแห่งชาติดอยอินทนนท์',
  },
  'sub-002': {
    id: 'sub-002',
    userName: 'Mint',
    missionName: 'สำรวจน้ำตกทีลอซู',
    badgeEmoji: '🌊',
    progressText: '7 / 15 Parks',
    parkName: 'เขตรักษาพันธุ์สัตว์ป่าอุ้มผาง',
  },
};

// ─── Supabase live lookup ─────────────────────────────────────────────────────

type SupabaseRow = {
  missions:    { name: string; park_name: string }                           | null;
  users:       { display_name: string }                                      | null;
  user_boards: { progress_completed: number; progress_total: number }        | null;
};

async function fetchFromSupabase(submissionId: string): Promise<OGData | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;

  // Requires RLS policy "submissions: public read approved shared" (docs/schema.sql)
  const params = new URLSearchParams({
    id:               `eq.${submissionId}`,
    status:           'eq.approved',
    share_permission: 'eq.true',
    select: [
      'missions!mission_id(name,park_name)',
      'users!user_id(display_name)',
      'user_boards!user_board_id(progress_completed,progress_total)',
    ].join(','),
  });

  const res = await fetch(
    `${supabaseUrl}/rest/v1/mission_submissions?${params.toString()}`,
    {
      headers: {
        apikey:        supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      // Cache OG images for 1 hour — reduces DB load for viral shares
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) return null;

  const rows = (await res.json()) as SupabaseRow[];
  const row = rows[0];
  if (!row) return null;

  const completed = row.user_boards?.progress_completed ?? 1;
  const total     = row.user_boards?.progress_total     ?? 10;

  return {
    id:           submissionId,
    userName:     row.users?.display_name ?? 'Explorer',
    missionName:  row.missions?.name      ?? 'ภารกิจสำเร็จ',
    parkName:     row.missions?.park_name ?? 'Questory',
    badgeEmoji:   '🏅',
    progressText: `${completed} / ${total} Parks`,
  };
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  context: RouteContext,
): Promise<ImageResponse> {
  const { submissionId } = await context.params;

  // Try live Supabase data first; fall back to mock for local dev
  const liveData = await fetchFromSupabase(submissionId);
  const submission = liveData ?? MOCK_SUBMISSIONS[submissionId] ?? {
    id: submissionId,
    userName: 'Explorer',
    missionName: 'ภารกิจใหม่ของคุณ',
    badgeEmoji: '🏅',
    progressText: 'เริ่มต้นการเดินทางของคุณ',
    parkName: 'Questory',
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'linear-gradient(135deg, rgba(7,27,22,1) 0%, rgba(30,77,62,1) 55%, rgba(74,139,120,1) 100%)',
          color: 'white',
          padding: '54px',
          fontFamily: 'Noto Sans Thai, sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 28, opacity: 0.9 }}>Questory</span>
            <span style={{ fontSize: 22, opacity: 0.75 }}>Quest</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 96,
              height: 96,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.12)',
              fontSize: 52,
            }}
          >
            {submission.badgeEmoji}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 30, opacity: 0.85 }}>ผู้พิชิต: {submission.userName}</div>
          <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>
            {submission.missionName}
          </div>
          <div style={{ fontSize: 26, opacity: 0.85 }}>{submission.parkName}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: '14px 18px',
              borderRadius: 14,
              background: 'rgba(212,175,55,0.2)',
            }}
          >
            <span style={{ fontSize: 20, opacity: 0.85 }}>ความคืบหน้า</span>
            <span style={{ fontSize: 34, fontWeight: 700 }}>{submission.progressText}</span>
          </div>
          <span style={{ fontSize: 20, opacity: 0.75 }}>questory.app/share/{submission.id}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
