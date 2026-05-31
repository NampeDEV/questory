import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'การจัดส่ง — Questory Admin' };

// ADMIN-052 (TASK_ADMIN)

const MOCK_SHIPMENTS = [
  { id: 'SHP-001', orderId: 'ORD-2024-0042', recipient: 'ณัฐวุฒิ แสงทอง', address: '123 ถ.วัวลาย เชียงใหม่', items: 'Pin Set × 1', trackingNumber: null, status: 'processing', createdAt: '30 พ.ค. 2567' },
  { id: 'SHP-002', orderId: 'ORD-2024-0041', recipient: 'ศิริพร อันทรดี', address: '45 ซ.พระโขนง กทม.', items: 'Board × 1, Pin × 2', trackingNumber: 'TH123456789TH', status: 'shipped', createdAt: '29 พ.ค. 2567' },
  { id: 'SHP-003', orderId: 'ORD-2024-0040', recipient: 'Akira Tanaka', address: '789 ถ.พัทยา ชลบุรี', items: 'Board × 1', trackingNumber: 'TH987654321TH', status: 'delivered', createdAt: '28 พ.ค. 2567' },
  { id: 'SHP-004', orderId: 'ORD-2024-0039', recipient: 'วรเมธ ใจดี', address: '56 ม.3 กาญจนบุรี', items: 'Bundle × 1', trackingNumber: null, status: 'processing', createdAt: '28 พ.ค. 2567' },
] as const;

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="การจัดส่ง"
        description="จัดการคิวการจัดส่งและพิมพ์ใบส่งของ"
        action={{ label: 'พิมพ์ใบจัดส่งทั้งหมด', href: '/admin/shipping/print' }}
      />

      {/* Status summary */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'รอพิมพ์ใบ', count: 42, color: 'bg-gold-500/10 text-gold-700' },
          { label: 'กำลังจัดส่ง', count: 128, color: 'bg-forest-700/10 text-forest-700' },
          { label: 'ส่งสำเร็จ', count: 356, color: 'bg-success/10 text-success' },
          { label: 'มีปัญหา', count: 6, color: 'bg-danger/10 text-danger' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest-800/8 bg-sand-100/60">
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">ผู้รับ</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted md:table-cell">ที่อยู่</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted lg:table-cell">รายการ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">Tracking</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">สถานะ</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-800/6">
            {MOCK_SHIPMENTS.map((s) => (
              <tr key={s.id} className="hover:bg-sand-100/30">
                <td className="px-5 py-3.5 font-mono text-xs text-forest-700">{s.orderId}</td>
                <td className="px-4 py-3.5 font-medium text-ink">{s.recipient}</td>
                <td className="hidden px-4 py-3.5 text-xs text-muted md:table-cell max-w-[160px] truncate">{s.address}</td>
                <td className="hidden px-4 py-3.5 text-xs text-muted lg:table-cell">{s.items}</td>
                <td className="px-4 py-3.5">
                  {s.trackingNumber ? (
                    <span className="font-mono text-xs text-forest-700">{s.trackingNumber}</span>
                  ) : (
                    <span className="text-xs text-muted">ยังไม่มี</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <AdminStatusBadge status={s.status} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5">
                    <button type="button" className="rounded-md bg-forest-800/8 px-2.5 py-1 text-[11px] font-medium text-forest-800 hover:bg-forest-800/15">
                      พิมพ์ใบ
                    </button>
                    {s.trackingNumber === null && (
                      <button type="button" className="rounded-md bg-gold-500/15 px-2.5 py-1 text-[11px] font-medium text-gold-700 hover:bg-gold-500/25">
                        ใส่ Tracking
                      </button>
                    )}
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
