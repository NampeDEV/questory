import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'รายงานบัญหา — Questory Admin' };

const MOCK_REPORTS = [
  { id: 'RPT-001', user: 'ณัฐวุฒิ แสงทอง', title: 'QR Code ของบอร์ดไม่สามารถ Scan ได้', category: 'bug', severity: 'high', status: 'open', createdAt: '30 พ.ค. 2567' },
  { id: 'RPT-002', user: 'มินตรา สุขใส', title: 'รูปหน้า Badge แสดงผลผิดพลาด', category: 'ui', severity: 'medium', status: 'in_progress', createdAt: '29 พ.ค. 2567' },
  { id: 'RPT-003', user: 'Akira Tanaka', title: 'Cannot upload proof photo on iOS Safari', category: 'bug', severity: 'high', status: 'open', createdAt: '29 พ.ค. 2567' },
  { id: 'RPT-004', user: 'กิตติชัย วัฒนา', title: 'Typo in mission description', category: 'content', severity: 'low', status: 'resolved', createdAt: '28 พ.ค. 2567' },
] as const;

const SEVERITY_COLOR: Record<string, string> = {
  high: 'text-danger font-semibold',
  medium: 'text-gold-700',
  low: 'text-muted',
};

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="รายงานบัญหา"
        description="รายงานปัญหาและ Bug จากผู้ใช้งาน"
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest-800/8 bg-sand-100/60">
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">ปัญหา</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted md:table-cell">หมวดหมู่</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">ความรุนแรง</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">สถานะ</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-800/6">
            {MOCK_REPORTS.map((r) => (
              <tr key={r.id} className="hover:bg-sand-100/30">
                <td className="px-5 py-3.5 font-mono text-xs text-forest-700">{r.id}</td>
                <td className="px-4 py-3.5">
                  <p className="font-medium text-ink">{r.title}</p>
                  <p className="text-xs text-muted">โดย: {r.user} · {r.createdAt}</p>
                </td>
                <td className="hidden px-4 py-3.5 capitalize text-xs text-muted md:table-cell">{r.category}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs ${SEVERITY_COLOR[r.severity] ?? 'text-muted'}`}>
                    {r.severity === 'high' ? 'สูง' : r.severity === 'medium' ? 'กลาง' : 'ต่ำ'}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <AdminStatusBadge status={r.status} />
                </td>
                <td className="px-5 py-3.5">
                  <button type="button" className="text-xs font-medium text-forest-700 hover:text-forest-900">จัดการ →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
