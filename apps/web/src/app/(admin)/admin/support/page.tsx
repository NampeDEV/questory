import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'Ticket / Support — Questory Admin' };

// ADMIN-054 (TASK_ADMIN)

const MOCK_TICKETS = [
  { id: 'TKT-001', user: 'ณัฐวุฒิ แสงทอง', subject: 'QR Code ไม่ทำงาน', type: 'technical', priority: 'high', status: 'open', createdAt: '30 พ.ค. 2567 10:21' },
  { id: 'TKT-002', user: 'มินตรา สุขใส', subject: 'ยังไม่ได้รับ Pin หลังจาก 2 สัปดาห์', type: 'shipping', priority: 'high', status: 'in_progress', createdAt: '29 พ.ค. 2567 14:30' },
  { id: 'TKT-003', user: 'กิตติชัย วัฒนา', subject: 'อยากขอ Refund', type: 'billing', priority: 'medium', status: 'open', createdAt: '29 พ.ค. 2567 09:15' },
  { id: 'TKT-004', user: 'Akira Tanaka', subject: 'How to change shipping address?', type: 'general', priority: 'low', status: 'resolved', createdAt: '28 พ.ค. 2567 16:44' },
] as const;

const PRIORITY_COLOR: Record<string, string> = {
  high: 'text-danger font-semibold',
  medium: 'text-gold-700',
  low: 'text-muted',
};

const PRIORITY_LABEL: Record<string, string> = {
  high: 'สูง',
  medium: 'กลาง',
  low: 'ต่ำ',
};

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="Ticket / Support"
        description="จัดการคำร้องและปัญหาจากผู้ใช้งาน"
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest-800/8 bg-sand-100/60">
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">Ticket ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">ผู้ใช้</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">เรื่อง</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted md:table-cell">ประเภท</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">ความสำคัญ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">สถานะ</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-800/6">
            {MOCK_TICKETS.map((t) => (
              <tr key={t.id} className="hover:bg-sand-100/30">
                <td className="px-5 py-3.5 font-mono text-xs font-medium text-forest-700">{t.id}</td>
                <td className="px-4 py-3.5 font-medium text-ink">{t.user}</td>
                <td className="px-4 py-3.5 text-ink">{t.subject}</td>
                <td className="hidden px-4 py-3.5 text-xs capitalize text-muted md:table-cell">{t.type}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs ${PRIORITY_COLOR[t.priority] ?? 'text-muted'}`}>
                    {PRIORITY_LABEL[t.priority] ?? t.priority}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <AdminStatusBadge status={t.status} />
                </td>
                <td className="px-5 py-3.5">
                  <button type="button" className="text-xs font-medium text-forest-700 hover:text-forest-900">
                    ตอบกลับ →
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
