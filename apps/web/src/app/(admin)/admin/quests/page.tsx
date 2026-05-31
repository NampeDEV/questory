import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'เควส — Questory Admin' };

// ADMIN-041 (TASK_ADMIN)

const MOCK_QUESTS = [
  { id: 'QST-001', name: 'พิชิตยอดดอยอินทนนท์', board: 'บอร์ดดอยอินทนนท์', activations: 342, completions: 189, status: 'active' },
  { id: 'QST-002', name: 'Explorer เขาใหญ่', board: 'บอร์ดเขาใหญ่ Explorer', activations: 218, completions: 97, status: 'active' },
  { id: 'QST-003', name: 'สำรวจใต้ทะเลสิมิลัน', board: 'บอร์ดสิมิลัน Diver', activations: 156, completions: 62, status: 'active' },
  { id: 'QST-004', name: 'น้ำตกใจกลางป่า', board: 'บอร์ดดอยอินทนนท์', activations: 88, completions: 44, status: 'active' },
  { id: 'QST-005', name: 'ยอดภูกระดึงฤดูหนาว', board: 'บอร์ดภูกระดึง', activations: 0, completions: 0, status: 'draft' },
] as const;

export default function QuestsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="เควส"
        description="จัดการเควสและสถิติการ Activate"
        action={{ label: '+ สร้างเควส', href: '/admin/quests/new' }}
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest-800/8 bg-sand-100/60">
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">ชื่อเควส</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted md:table-cell">บอร์ด</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted">Activations</th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold text-muted lg:table-cell">Completions</th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold text-muted lg:table-cell">อัตราสำเร็จ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">สถานะ</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-800/6">
            {MOCK_QUESTS.map((q) => {
              const rate = q.activations > 0
                ? Math.round((q.completions / q.activations) * 100)
                : 0;
              return (
                <tr key={q.id} className="hover:bg-sand-100/30">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-ink">{q.name}</p>
                    <p className="font-mono text-xs text-muted">{q.id}</p>
                  </td>
                  <td className="hidden px-4 py-3.5 text-xs text-muted md:table-cell">{q.board}</td>
                  <td className="px-4 py-3.5 text-center font-bold text-gold-700">{q.activations}</td>
                  <td className="hidden px-4 py-3.5 text-center text-ink lg:table-cell">{q.completions}</td>
                  <td className="hidden px-4 py-3.5 text-center lg:table-cell">
                    <span className={rate >= 50 ? 'text-success font-semibold' : 'text-muted'}>
                      {rate}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <AdminStatusBadge status={q.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/quests/${q.id}/edit`} className="text-xs font-medium text-forest-700 hover:text-forest-900">
                      แก้ไข
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
