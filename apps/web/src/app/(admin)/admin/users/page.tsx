import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import type { ColumnDef } from '@/components/admin/AdminDataTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'ผู้ใช้งาน — Questory Admin' };

// ADMIN-060 (TASK_ADMIN)

const MOCK_USERS = [
  { id: 'USR-001', displayName: 'ณัฐวุฒิ แสงทอง', handle: '@nuttawut.93', email: 'nuttawut@example.com', questsCompleted: 12, joinedAt: '12 ม.ค. 2567', status: 'active', initial: 'ณ' },
  { id: 'USR-002', displayName: 'ศิริพร อันทรดี', handle: '@siriporn.jd', email: 'siriporn@example.com', questsCompleted: 8, joinedAt: '20 ก.พ. 2567', status: 'active', initial: 'ศ' },
  { id: 'USR-003', displayName: 'Akira Tanaka', handle: '@akira.tnk', email: 'akira@example.com', questsCompleted: 5, joinedAt: '05 มี.ค. 2567', status: 'active', initial: 'A' },
  { id: 'USR-004', displayName: 'วรเมธ ใจดี', handle: '@woramet.jd', email: 'woramet@example.com', questsCompleted: 3, joinedAt: '18 มี.ค. 2567', status: 'inactive', initial: 'ว' },
  { id: 'USR-005', displayName: 'มินตรา สุขใส', handle: '@mintra.s', email: 'mintra@example.com', questsCompleted: 0, joinedAt: '02 เม.ย. 2567', status: 'active', initial: 'ม' },
] as const;

type UserRow = (typeof MOCK_USERS)[number];

const USER_COLUMNS: ColumnDef<UserRow>[] = [
  {
    key: 'user',
    header: 'ผู้ใช้',
    render: (user) => (
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-forest-700 text-xs font-bold text-white">
          {user.initial}
        </div>
        <div>
          <p className="font-medium text-ink">{user.displayName}</p>
          <p className="text-xs text-muted">{user.handle}</p>
        </div>
      </div>
    ),
    className: 'px-5 py-3.5',
    headerClassName: 'px-5 py-3',
  },
  {
    key: 'email',
    header: 'Email',
    render: (user) => <span className="text-xs text-muted">{user.email}</span>,
    className: 'px-4 py-3.5',
    headerClassName: 'px-4 py-3',
    hideOnTablet: true,
  },
  {
    key: 'quests',
    header: 'เควสสำเร็จ',
    render: (user) => <span className="font-bold text-forest-700">{user.questsCompleted}</span>,
    className: 'px-4 py-3.5 text-center',
    headerClassName: 'px-4 py-3 text-center',
  },
  {
    key: 'joinedAt',
    header: 'สมัครเมื่อ',
    render: (user) => <span className="text-xs text-muted">{user.joinedAt}</span>,
    className: 'hidden px-4 py-3.5 lg:table-cell',
    headerClassName: 'hidden px-4 py-3 lg:table-cell',
  },
  {
    key: 'status',
    header: 'สถานะ',
    render: (user) => <AdminStatusBadge status={user.status} />,
    className: 'px-4 py-3.5',
    headerClassName: 'px-4 py-3',
  },
  {
    key: 'actions',
    header: 'จัดการ',
    render: (user) => (
      <div className="flex gap-2">
        <Link href={`/admin/users/${user.id}`} className="text-xs font-medium text-forest-700 hover:text-forest-900">ดูโปรไฟล์</Link>
        <button type="button" className="text-xs font-medium text-danger hover:text-danger/80">ระงับ</button>
      </div>
    ),
    className: 'px-5 py-3.5',
    headerClassName: 'px-5 py-3',
  },
];

export default function UsersPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="ผู้ใช้งาน"
        description="จัดการบัญชีผู้ใช้งานทั้งหมด"
      />

      {/* Summary */}
      <div className="mt-5 grid grid-cols-3 gap-4">
        {[
          { label: 'ผู้ใช้ทั้งหมด', value: '1,248' },
          { label: 'Active (30 วัน)', value: '842' },
          { label: 'สมัครใหม่ (7 วัน)', value: '64' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-forest-800/10 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-ink">{s.value}</p>
            <p className="mt-1 text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mt-4 flex gap-3">
        <input
          type="search"
          placeholder="ค้นหาชื่อ, email, handle..."
          className="flex-1 rounded-lg border border-forest-800/15 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700/30"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <AdminDataTable
          columns={USER_COLUMNS}
          rows={MOCK_USERS}
          getRowKey={(user) => user.id}
        />
      </div>
    </div>
  );
}
