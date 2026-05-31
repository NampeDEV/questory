import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'แผนท่องเที่ยว — Questory Admin' };

const MOCK_PLANS = [
  { id: 'PLN-001', title: 'แผน 3 วัน เชียงใหม่ National Parks', author: 'ปิยะนุช โกมล', parks: ['ดอยสุเทพ', 'ดอยอินทนนท์'], likes: 42, status: 'submitted' },
  { id: 'PLN-002', title: 'เที่ยวอีสานสุดฟิน 5 วัน', author: 'กิตติชัย วัฒนา', parks: ['ภูกระดึง', 'น้ำตกตาดโตน'], likes: 28, status: 'approved' },
  { id: 'PLN-003', title: 'ทริปใต้ทะเล สิมิลัน 2 คืน', author: 'Akira Tanaka', parks: ['หมู่เกาะสิมิลัน'], likes: 65, status: 'approved' },
  { id: 'PLN-004', title: 'เที่ยวเขาใหญ่แบบ Slow Life', author: 'มินตรา สุขใส', parks: ['เขาใหญ่'], likes: 0, status: 'draft' },
] as const;

export default function PlansPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="แผนท่องเที่ยว"
        description="ตรวจสอบและอนุมัติแผนท่องเที่ยวจากผู้ใช้"
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest-800/8 bg-sand-100/60">
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">ชื่อแผน</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted md:table-cell">ผู้สร้าง</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted lg:table-cell">อุทยาน</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted">Likes</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted">สถานะ</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-800/6">
            {MOCK_PLANS.map((p) => (
              <tr key={p.id} className="hover:bg-sand-100/30">
                <td className="px-5 py-3.5">
                  <p className="font-medium text-ink">{p.title}</p>
                  <p className="font-mono text-xs text-muted">{p.id}</p>
                </td>
                <td className="hidden px-4 py-3.5 text-muted md:table-cell">{p.author}</td>
                <td className="hidden px-4 py-3.5 lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {p.parks.map((park) => (
                      <span key={park} className="rounded-md bg-forest-800/8 px-1.5 py-0.5 text-[10px] text-forest-800">
                        {park}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-center font-bold text-gold-700">{p.likes}</td>
                <td className="px-4 py-3.5">
                  <AdminStatusBadge status={p.status} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    {p.status === 'submitted' && (
                      <>
                        <button type="button" className="text-xs font-medium text-success hover:text-success/80">อนุมัติ</button>
                        <button type="button" className="text-xs font-medium text-danger hover:text-danger/80">ปฏิเสธ</button>
                      </>
                    )}
                    <button type="button" className="text-xs font-medium text-forest-700 hover:text-forest-900">ดู</button>
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
