import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Mail, Calendar, Trophy, Shield } from 'lucide-react';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const metadata: Metadata = { title: 'รายละเอียดผู้ใช้ — Questory Admin' };

// ADMIN-060b — User detail page

// Mock lookup — replace with GET /api/admin/users/:id when Supabase is wired
const MOCK_USERS: Record<string, {
  id: string; displayName: string; handle: string; email: string;
  questsCompleted: number; joinedAt: string; status: string; initial: string;
  boards: { name: string; progress: number; activatedAt: string }[];
  recentActivity: { action: string; at: string }[];
}> = {
  'USR-001': {
    id: 'USR-001', displayName: 'ณัฐวุฒิ แสงทอง', handle: '@nuttawut.93',
    email: 'nuttawut@example.com', questsCompleted: 12, joinedAt: '12 ม.ค. 2567',
    status: 'active', initial: 'ณ',
    boards: [
      { name: 'บอร์ดดอยอินทนนท์', progress: 75, activatedAt: '15 ม.ค. 2567' },
      { name: 'บอร์ดเขาใหญ่ Explorer', progress: 100, activatedAt: '20 ก.พ. 2567' },
    ],
    recentActivity: [
      { action: 'ส่งหลักฐานภารกิจ "ยอดดอยอินทนนท์"', at: '30 พ.ค. 2567 10:00' },
      { action: 'ได้รับ Badge นักพิชิต', at: '28 พ.ค. 2567 15:30' },
      { action: 'Activate บอร์ดดอยอินทนนท์', at: '15 ม.ค. 2567 09:00' },
    ],
  },
  'USR-002': {
    id: 'USR-002', displayName: 'ศิริพร อันทรดี', handle: '@siriporn.jd',
    email: 'siriporn@example.com', questsCompleted: 8, joinedAt: '20 ก.พ. 2567',
    status: 'active', initial: 'ศ',
    boards: [
      { name: 'บอร์ดเขาใหญ่ Explorer', progress: 66, activatedAt: '25 ก.พ. 2567' },
    ],
    recentActivity: [
      { action: 'ส่งหลักฐาน "ป่าดงดิบเขาใหญ่"', at: '29 พ.ค. 2567 09:00' },
    ],
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = MOCK_USERS[id];

  if (!user) {
    return (
      <div className="mx-auto max-w-[860px] px-4 py-12 sm:px-6 text-center">
        <p className="text-muted">ไม่พบผู้ใช้ ID: {id}</p>
        <Link href="/admin/users" className="mt-4 inline-block text-sm text-forest-700 hover:underline">
          ← กลับรายการผู้ใช้
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[860px] px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-2 text-sm text-muted">
        <Link href="/admin/users" className="flex items-center gap-1 hover:text-ink">
          <ChevronLeft size={14} />
          ผู้ใช้งาน
        </Link>
        <span>/</span>
        <span className="text-ink">{user.displayName}</span>
      </div>

      <AdminPageHeader
        title={user.displayName}
        description={`${user.handle} · ${user.id}`}
      />

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* Left — profile info */}
        <div className="space-y-5 lg:col-span-2">

          {/* Profile card */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-700 text-xl font-bold text-white">
                {user.initial}
              </div>
              <div>
                <p className="font-semibold text-ink">{user.displayName}</p>
                <p className="text-sm text-muted">{user.handle}</p>
              </div>
              <div className="ml-auto">
                <AdminStatusBadge status={user.status} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-sand-100/60 p-3 text-center">
                <p className="text-lg font-bold text-forest-800">{user.questsCompleted}</p>
                <p className="text-[10px] text-muted">เควสสำเร็จ</p>
              </div>
              <div className="rounded-xl bg-sand-100/60 p-3 text-center">
                <p className="text-lg font-bold text-gold-700">{user.boards.length}</p>
                <p className="text-[10px] text-muted">บอร์ดที่มี</p>
              </div>
              <div className="col-span-2 rounded-xl bg-sand-100/60 p-3">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Mail size={12} />
                  <span>{user.email}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-muted">
                  <Calendar size={12} />
                  <span>สมัครเมื่อ {user.joinedAt}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Boards */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">บอร์ดที่ Activate แล้ว</h2>
            <div className="space-y-3">
              {user.boards.map((board) => (
                <div key={board.name} className="flex items-center gap-3 rounded-xl bg-sand-100/40 p-3">
                  <Trophy size={16} className="flex-shrink-0 text-gold-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{board.name}</p>
                    <p className="text-xs text-muted">Activated: {board.activatedAt}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-forest-700">{board.progress}%</p>
                    <p className="text-[10px] text-muted">สำเร็จ</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Activity */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">กิจกรรมล่าสุด</h2>
            <ul className="space-y-3">
              {user.recentActivity.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-forest-700" />
                  <div>
                    <p className="text-sm text-ink">{item.action}</p>
                    <p className="text-xs text-muted">{item.at}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right — actions */}
        <div className="space-y-5">
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">การจัดการ</h2>
            <div className="space-y-2">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg border border-forest-800/20 px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-sand-100 transition-colors"
              >
                <Mail size={14} />
                ส่งอีเมลถึงผู้ใช้
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg border border-forest-800/20 px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-sand-100 transition-colors"
              >
                <Shield size={14} />
                {user.status === 'active' ? 'ระงับบัญชี' : 'เปิดใช้งานบัญชี'}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-ink">ข้อมูลบัญชี</h2>
            <dl className="space-y-2 text-xs">
              <div>
                <dt className="text-muted">User ID</dt>
                <dd className="font-mono font-medium text-ink">{user.id}</dd>
              </div>
              <div>
                <dt className="text-muted">สถานะ</dt>
                <dd><AdminStatusBadge status={user.status} /></dd>
              </div>
              <div>
                <dt className="text-muted">วันที่สมัคร</dt>
                <dd className="text-ink">{user.joinedAt}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
