import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'คูปอง / โปรโมชัน — Questory Admin' };

// ADMIN-034 (TASK_ADMIN)

const MOCK_COUPONS = [
  { id: 'CPN-001', code: 'NATURE20', discount: '20%', type: 'percent', minOrder: 500, usageCount: 142, maxUsage: 200, expiry: '31 ธ.ค. 2567', status: 'active' },
  { id: 'CPN-002', code: 'PARK50OFF', discount: '฿50', type: 'fixed', minOrder: 300, usageCount: 88, maxUsage: 100, expiry: '30 มิ.ย. 2567', status: 'active' },
  { id: 'CPN-003', code: 'FIRSTPIN', discount: '15%', type: 'percent', minOrder: 0, usageCount: 200, maxUsage: 200, expiry: '31 พ.ค. 2567', status: 'inactive' },
  { id: 'CPN-004', code: 'SUMMER30', discount: '30%', type: 'percent', minOrder: 800, usageCount: 0, maxUsage: 500, expiry: '31 ส.ค. 2567', status: 'draft' },
] as const;

export default function CouponsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="คูปอง / โปรโมชัน"
        description="สร้างและจัดการโค้ดส่วนลด"
        action={{ label: '+ สร้างคูปอง', href: '/admin/coupons/new' }}
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest-800/8 bg-sand-100/60">
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">โค้ด</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">ส่วนลด</th>
              <th className="hidden px-4 py-3 text-right text-xs font-semibold text-muted md:table-cell">ขั้นต่ำ</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted">ใช้แล้ว / สูงสุด</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted lg:table-cell">หมดอายุ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">สถานะ</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-800/6">
            {MOCK_COUPONS.map((c) => (
              <tr key={c.id} className="hover:bg-sand-100/30">
                <td className="px-5 py-3.5">
                  <span className="rounded-lg bg-forest-800/8 px-2.5 py-1 font-mono text-xs font-bold text-forest-800">
                    {c.code}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-bold text-gold-700">{c.discount}</td>
                <td className="hidden px-4 py-3.5 text-right text-muted md:table-cell">
                  {c.minOrder > 0 ? `฿${c.minOrder}` : '—'}
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className={c.usageCount >= c.maxUsage ? 'text-danger font-bold' : 'text-ink'}>
                    {c.usageCount}
                  </span>
                  <span className="text-muted"> / {c.maxUsage}</span>
                </td>
                <td className="hidden px-4 py-3.5 text-muted lg:table-cell">{c.expiry}</td>
                <td className="px-4 py-3.5">
                  <AdminStatusBadge status={c.status} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <button type="button" className="text-xs font-medium text-forest-700 hover:text-forest-900">แก้ไข</button>
                    <button type="button" className="text-xs font-medium text-danger hover:text-danger/80">ลบ</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
