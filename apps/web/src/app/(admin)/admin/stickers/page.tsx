import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'สติกเกอร์สินค้า — Questory Admin' };

// ADMIN-033 (TASK_ADMIN)

const MOCK_STICKERS = [
  { id: 'STK-001', name: 'Sticker Pack อุทยาน Vol.1', designs: 12, priceTHB: 99, stock: 200, status: 'active' },
  { id: 'STK-002', name: 'Sticker Pack ภาคเหนือ', designs: 8, priceTHB: 79, stock: 150, status: 'active' },
  { id: 'STK-003', name: 'Holographic Pin Sticker Set', designs: 6, priceTHB: 149, stock: 45, status: 'active' },
  { id: 'STK-004', name: 'Mini Quest Sticker', designs: 20, priceTHB: 59, stock: 0, status: 'out_of_stock' },
] as const;

export default function StickersPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="สติกเกอร์สินค้า"
        description="จัดการ Sticker packs และสต็อก"
        action={{ label: '+ เพิ่ม Pack', href: '/admin/stickers/new' }}
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest-800/8 bg-sand-100/60">
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">Pack</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted">จำนวนดีไซน์</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted">ราคา</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted">สต็อก</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">สถานะ</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-800/6">
            {MOCK_STICKERS.map((s) => (
              <tr key={s.id} className="hover:bg-sand-100/30">
                <td className="px-5 py-3.5">
                  <p className="font-medium text-ink">{s.name}</p>
                  <p className="font-mono text-xs text-muted">{s.id}</p>
                </td>
                <td className="px-4 py-3.5 text-center text-sm text-ink">{s.designs}</td>
                <td className="px-4 py-3.5 text-right font-bold text-ink">฿{s.priceTHB}</td>
                <td className="px-4 py-3.5 text-center text-sm text-ink">{s.stock}</td>
                <td className="px-4 py-3.5">
                  <AdminStatusBadge status={s.status} />
                </td>
                <td className="px-5 py-3.5">
                  <button type="button" className="text-xs font-medium text-forest-700 hover:text-forest-900">
                    แก้ไข
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
