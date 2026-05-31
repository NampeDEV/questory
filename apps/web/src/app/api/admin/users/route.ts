import { type NextRequest, NextResponse } from 'next/server';
import { handleRouteError } from '@/lib/api/response';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/api/auth';
import type { User } from '@/types/user';

// Mock user list (fallback — M4: query from Supabase auth.users when service role key is set)
const MOCK_USERS: User[] = [
  { id: 'usr-001', displayName: 'ณัฐวุฒิ แสงทอง',  email: 'nuttawut@example.com',   avatarUrl: null, createdAt: '2026-01-15T08:00:00Z' },
  { id: 'usr-002', displayName: 'ศิริพร อันทรดี',    email: 'siriporn@example.com',    avatarUrl: null, createdAt: '2026-02-20T09:30:00Z' },
  { id: 'usr-003', displayName: 'Akira Tanaka',     email: 'akira@example.com',       avatarUrl: null, createdAt: '2026-03-05T12:00:00Z' },
  { id: 'usr-004', displayName: 'พรทิพย์ รักไทย',   email: 'pornthip@example.com',    avatarUrl: null, createdAt: '2026-04-10T14:00:00Z' },
  { id: 'usr-005', displayName: 'สมชาย วีระกุล',    email: 'somchai@example.com',     avatarUrl: null, createdAt: '2026-05-01T10:00:00Z' },
];

// API-ADM-004 (SPEC-07) — GET /api/admin/users
// Paginated list of users.

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    await requireAdmin(supabase);

    const { searchParams } = req.nextUrl;
    const page           = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const PAGE_SIZE      = 20;
    const search         = searchParams.get('q')?.toLowerCase();

    const supabaseUrl        = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey     = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      const { createClient } = await import('@supabase/supabase-js');
      // Security: service role used only for admin user listing, never exposed to client
      const adminDb = createClient(supabaseUrl, serviceRoleKey);

      const { data, error } = await adminDb.auth.admin.listUsers({
        page,
        perPage: PAGE_SIZE,
      });

      if (error) {
        // Fall through to mock on error
      } else {
        let users: User[] = (data.users ?? []).map((u) => ({
          id:          u.id,
          displayName: (u.user_metadata?.['full_name'] as string | undefined)
                       ?? u.email?.split('@')[0]
                       ?? 'User',
          email:       u.email ?? '',
          avatarUrl:   (u.user_metadata?.['avatar_url'] as string | undefined) ?? null,
          createdAt:   u.created_at,
        }));

        if (search) {
          users = users.filter(
            (u) =>
              u.displayName.toLowerCase().includes(search) ||
              u.email.toLowerCase().includes(search),
          );
        }

        const total = users.length;
        return NextResponse.json({ data: users, meta: { total, page, pageSize: PAGE_SIZE } });
      }
    }

    // Fallback: mock data
    let users = [...MOCK_USERS];
    if (search) {
      users = users.filter(
        (u) =>
          u.displayName.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search),
      );
    }

    const total = users.length;
    const slice = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return NextResponse.json({ data: slice, meta: { total, page, pageSize: PAGE_SIZE } });
  } catch (err) {
    return handleRouteError(err);
  }
}
