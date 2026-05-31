import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import type { ColumnDef } from '@/components/admin/AdminDataTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'Mission / จุดหมาย — Questory Admin' };

// ADMIN-042 (TASK_ADMIN)

const MOCK_MISSIONS = [
  { id: 'MSN-001', name: 'ยอดดอยอินทนนท์', park: 'ดอยอินทนนท์', region: 'ภาคเหนือ', difficulty: 'hard', category: 'mountain', reward: 'Badge นักพิชิต', status: 'active' },
  { id: 'MSN-002', name: 'น้ำตกวชิรธาร', park: 'ดอยอินทนนท์', region: 'ภาคเหนือ', difficulty: 'easy', category: 'waterfall', reward: 'Badge สายน้ำ', status: 'active' },
  { id: 'MSN-003', name: 'ป่าดงดิบเขาใหญ่', park: 'เขาใหญ่', region: 'ภาคกลาง', difficulty: 'medium', category: 'forest', reward: 'Badge นักสำรวจ', status: 'active' },
  { id: 'MSN-004', name: 'หาดปอมจ้า', park: 'หมู่เกาะสิมิลัน', region: 'ภาคใต้', difficulty: 'easy', category: 'marine', reward: 'Badge นักดำน้ำ', status: 'active' },
  { id: 'MSN-005', name: 'ยอดภูกระดึง', park: 'ภูกระดึง', region: 'ภาคอีสาน', difficulty: 'hard', category: 'mountain', reward: 'Badge ยอดเขา', status: 'draft' },
] as const;

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'text-success',
  medium: 'text-gold-700',
  hard: 'text-danger',
};

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'ง่าย',
  medium: 'ปานกลาง',
  hard: 'ยาก',
};

type MissionRow = (typeof MOCK_MISSIONS)[number];

const MISSION_COLUMNS: ColumnDef<MissionRow>[] = [
  {
    key: 'name',
    header: 'ชื่อภารกิจ',
    render: (mission) => (
      <>
        <p className="font-medium text-ink">{mission.name}</p>
        <p className="font-mono text-xs text-muted">{mission.id}</p>
      </>
    ),
    className: 'px-5 py-3.5',
    headerClassName: 'px-5 py-3',
  },
  {
    key: 'park',
    header: 'อุทยาน',
    render: (mission) => <span className="text-xs text-muted">{mission.park}</span>,
    className: 'px-4 py-3.5',
    headerClassName: 'px-4 py-3',
    hideOnTablet: true,
  },
  {
    key: 'region',
    header: 'ภาค',
    render: (mission) => <span className="text-xs text-muted">{mission.region}</span>,
    className: 'hidden px-4 py-3.5 lg:table-cell',
    headerClassName: 'hidden px-4 py-3 lg:table-cell',
  },
  {
    key: 'difficulty',
    header: 'ระดับ',
    render: (mission) => (
      <span className={`text-xs font-semibold ${DIFFICULTY_COLOR[mission.difficulty] ?? 'text-muted'}`}>
        {DIFFICULTY_LABEL[mission.difficulty] ?? mission.difficulty}
      </span>
    ),
    className: 'px-4 py-3.5',
    headerClassName: 'px-4 py-3',
  },
  {
    key: 'reward',
    header: 'รางวัล',
    render: (mission) => <span className="text-xs text-muted">{mission.reward}</span>,
    className: 'hidden px-4 py-3.5 xl:table-cell',
    headerClassName: 'hidden px-4 py-3 xl:table-cell',
  },
  {
    key: 'status',
    header: 'สถานะ',
    render: (mission) => <AdminStatusBadge status={mission.status} />,
    className: 'px-4 py-3.5',
    headerClassName: 'px-4 py-3',
  },
  {
    key: 'actions',
    header: 'จัดการ',
    render: (mission) => (
      <div className="flex gap-2">
        <Link href={`/admin/missions/${mission.id}/edit`} className="text-xs font-medium text-forest-700 hover:text-forest-900">แก้ไข</Link>
      </div>
    ),
    className: 'px-5 py-3.5',
    headerClassName: 'px-5 py-3',
  },
];

export default function MissionsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="Mission / จุดหมาย"
        description="จัดการภารกิจแต่ละจุดหมายในอุทยาน"
        action={{ label: '+ เพิ่มภารกิจ', href: '/admin/missions/new' }}
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <AdminDataTable
          columns={MISSION_COLUMNS}
          rows={MOCK_MISSIONS}
          getRowKey={(mission) => mission.id}
        />
      </div>
    </div>
  );
}
