import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'บอร์ดภารกิจ — Questory Admin' };

// ADMIN-040 (TASK_ADMIN)

const MOCK_BOARDS = [
  { id: 'BRD-001', name: 'บอร์ดดอยอินทนนท์', park: 'ดอยอินทนนท์', region: 'north', missionsTotal: 8, missionsActive: 8, activationsCount: 342, status: 'active' },
  { id: 'BRD-002', name: 'บอร์ดเขาใหญ่ Explorer', park: 'เขาใหญ่', region: 'central', missionsTotal: 6, missionsActive: 6, activationsCount: 218, status: 'active' },
  { id: 'BRD-003', name: 'บอร์ดสิมิลัน Diver', park: 'หมู่เกาะสิมิลัน', region: 'south', missionsTotal: 5, missionsActive: 4, activationsCount: 156, status: 'active' },
  { id: 'BRD-004', name: 'บอร์ดภูกระดึง', park: 'ภูกระดึง', region: 'northeast', missionsTotal: 6, missionsActive: 0, activationsCount: 0, status: 'draft' },
] as const;

const REGION_LABEL: Record<string, string> = {
  north: 'ภาคเหนือ',
  central: 'ภาคกลาง',
  northeast: 'ภาคอีสาน',
  east: 'ภาคตะวันออก',
  south: 'ภาคใต้',
};

export default function BoardsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="บอร์ดภารกิจ"
        description="จัดการบอร์ดและโครงสร้าง Quest ทั้งหมด"
        action={{ label: '+ สร้างบอร์ดใหม่', href: '/admin/boards/new' }}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MOCK_BOARDS.map((board) => (
          <div
            key={board.id}
            className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-ink">{board.name}</p>
                <p className="mt-0.5 text-xs text-muted">{board.park} · {REGION_LABEL[board.region] ?? board.region}</p>
              </div>
              <AdminStatusBadge status={board.status} />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-sand-100/60 p-3">
              <div className="text-center">
                <p className="text-lg font-bold text-forest-800">{board.missionsTotal}</p>
                <p className="text-[10px] text-muted">ภารกิจทั้งหมด</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-success">{board.missionsActive}</p>
                <p className="text-[10px] text-muted">Active</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gold-700">{board.activationsCount}</p>
                <p className="text-[10px] text-muted">Activations</p>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <Link href={`/admin/missions?board=${board.id}`} className="flex-1 rounded-lg border border-forest-800/20 py-1.5 text-center text-xs font-medium text-forest-800 hover:bg-sand-100">
                จัดการภารกิจ
              </Link>
              <Link href={`/admin/boards/${board.id}/edit`} className="rounded-lg border border-forest-800/20 px-3 py-1.5 text-xs font-medium text-muted hover:bg-sand-100">
                แก้ไข
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
