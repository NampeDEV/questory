import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'คลัง Badge & Pin — Questory Admin' };

// ADMIN-045 (TASK_ADMIN)

const MOCK_BADGES = [
  { id: 'BDG-001', name: 'Badge นักพิชิตดอย', type: 'badge', rarity: 'epic', missionLinked: 'ยอดดอยอินทนนท์', stock: null, status: 'active' },
  { id: 'BDG-002', name: 'Badge สายน้ำ', type: 'badge', rarity: 'uncommon', missionLinked: 'น้ำตกวชิรธาร', stock: null, status: 'active' },
  { id: 'PIN-001', name: 'Pin ลายดอยอินทนนท์', type: 'pin', rarity: 'rare', missionLinked: 'ยอดดอยอินทนนท์', stock: 18, status: 'active' },
  { id: 'PIN-002', name: 'Pin ลายเขาใหญ่', type: 'pin', rarity: 'uncommon', missionLinked: 'ป่าดงดิบเขาใหญ่', stock: 22, status: 'active' },
  { id: 'PIN-003', name: 'Pin ลายทะเลสิมิลัน', type: 'pin', rarity: 'rare', missionLinked: 'หาดปอมจ้า', stock: 0, status: 'out_of_stock' },
  { id: 'BDG-003', name: 'Badge ตำนาน Explorer', type: 'badge', rarity: 'legendary', missionLinked: null, stock: null, status: 'draft' },
] as const;

const RARITY_COLOR: Record<string, string> = {
  common: 'text-muted',
  uncommon: 'text-success',
  rare: 'text-forest-700',
  epic: 'text-gold-600',
  legendary: 'text-danger font-bold',
};

export default function BadgesPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="คลัง Badge & Pin"
        description="จัดการ Badge และ Physical Pin ทั้งหมด"
        action={{ label: '+ เพิ่ม Badge / Pin', href: '/admin/badges/new' }}
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest-800/8 bg-sand-100/60">
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">ชื่อ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">ประเภท</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">Rarity</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted lg:table-cell">ภารกิจที่ผูก</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted">สต็อก (Pin)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">สถานะ</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-800/6">
            {MOCK_BADGES.map((b) => (
              <tr key={b.id} className="hover:bg-sand-100/30">
                <td className="px-5 py-3.5">
                  <p className="font-medium text-ink">{b.name}</p>
                  <p className="font-mono text-xs text-muted">{b.id}</p>
                </td>
                <td className="px-4 py-3.5">
                  <span className="rounded-md bg-forest-800/8 px-2 py-0.5 text-xs font-medium text-forest-800">
                    {b.type === 'pin' ? 'Physical Pin' : 'Digital Badge'}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs capitalize ${RARITY_COLOR[b.rarity] ?? 'text-muted'}`}>
                    {b.rarity}
                  </span>
                </td>
                <td className="hidden px-4 py-3.5 text-xs text-muted lg:table-cell">
                  {b.missionLinked ?? '—'}
                </td>
                <td className="px-4 py-3.5 text-center">
                  {b.type === 'pin' ? (
                    <span className={b.stock === 0 ? 'font-bold text-danger' : b.stock! < 25 ? 'font-bold text-gold-700' : 'text-ink'}>
                      {b.stock}
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <AdminStatusBadge status={b.status} />
                </td>
                <td className="px-5 py-3.5">
                  <Link href={`/admin/badges/${b.id}/edit`} className="text-xs font-medium text-forest-700 hover:text-forest-900">
                    แก้ไข
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
