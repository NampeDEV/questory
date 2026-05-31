import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const metadata: Metadata = { title: 'Audit Log — Questory Admin' };

const MOCK_LOGS = [
  { id: 'LOG-001', admin: 'Super Admin', action: 'อนุมัติหลักฐาน', resource: 'Submission #SUB-2024-0213', timestamp: '30 พ.ค. 2567 14:22' },
  { id: 'LOG-002', admin: 'Admin Somchai', action: 'สร้างสินค้าใหม่', resource: 'Product: Pin ลายภูกระดึง', timestamp: '30 พ.ค. 2567 11:05' },
  { id: 'LOG-003', admin: 'Moderator Aom', action: 'ปฏิเสธ Memory Wall', resource: 'Memory #MEM-048', timestamp: '30 พ.ค. 2567 09:41' },
  { id: 'LOG-004', admin: 'Super Admin', action: 'เปลี่ยน Feature Flag', resource: 'Creator Hub → ON', timestamp: '29 พ.ค. 2567 17:30' },
  { id: 'LOG-005', admin: 'Admin Somchai', action: 'อัปเดตราคาสินค้า', resource: 'Bundle ภาคเหนือ ฿990 → ฿890', timestamp: '29 พ.ค. 2567 15:12' },
  { id: 'LOG-006', admin: 'Support Nan', action: 'ปิด Ticket', resource: 'TKT-005', timestamp: '29 พ.ค. 2567 10:00' },
] as const;

export default function AuditLogPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="Audit Log"
        description="บันทึกการกระทำของ Admin ทุกคน — อ่านได้อย่างเดียว"
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest-800/8 bg-sand-100/60">
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">เวลา</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">Admin</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">การกระทำ</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted lg:table-cell">Resource</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-800/6">
            {MOCK_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-sand-100/30">
                <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-muted">{log.timestamp}</td>
                <td className="px-4 py-3.5 font-medium text-ink">{log.admin}</td>
                <td className="px-4 py-3.5 text-ink">{log.action}</td>
                <td className="hidden px-4 py-3.5 text-xs text-muted lg:table-cell">{log.resource}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
