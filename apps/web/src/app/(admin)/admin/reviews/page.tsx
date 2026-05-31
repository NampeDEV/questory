import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'รีวิวจากผู้ใช้ — Questory Admin' };

const MOCK_REVIEWS = [
  { id: 'RVW-001', user: 'ณัฐวุฒิ แสงทอง', product: 'Board ดอยอินทนนท์', rating: 5, text: 'บอร์ดสวยมาก ภารกิจสนุก คุ้มค่ามากๆ ซื้ออีกแน่นอน', status: 'submitted' },
  { id: 'RVW-002', user: 'Akira Tanaka', product: 'Pin ลายเขาใหญ่', rating: 4, text: 'Great quality, beautiful design. Love the adventure theme!', status: 'approved' },
  { id: 'RVW-003', user: 'มินตรา สุขใส', product: 'Bundle ภาคเหนือ', rating: 5, text: 'ของขวัญที่ดีที่สุดเลย! ให้เพื่อนวันเกิดแล้วชอบมาก', status: 'submitted' },
  { id: 'RVW-004', user: 'กิตติชัย วัฒนา', product: 'Board สิมิลัน', rating: 2, text: 'ส่งช้ามากกว่า 3 สัปดาห์ ถึงจะได้รับ', status: 'submitted' },
] as const;

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="รีวิวจากผู้ใช้"
        description="ตรวจสอบและอนุมัติรีวิวสินค้า"
      />

      <div className="mt-5 flex flex-col gap-4">
        {MOCK_REVIEWS.map((r) => (
          <div key={r.id} className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-ink">{r.user}</p>
                  <span className="text-muted">·</span>
                  <p className="text-xs text-muted">{r.product}</p>
                  <AdminStatusBadge status={r.status} />
                </div>
                <div className="mt-1 flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < r.rating ? 'text-gold-500' : 'text-sand-200'}>★</span>
                  ))}
                  <span className="ml-1 text-xs text-muted">({r.rating}/5)</span>
                </div>
                <p className="mt-2 text-sm text-muted">{r.text}</p>
              </div>
              {r.status === 'submitted' && (
                <div className="flex flex-shrink-0 flex-col gap-2">
                  <button type="button" className="rounded-lg bg-success/10 px-4 py-1.5 text-xs font-semibold text-success hover:bg-success/20">อนุมัติ</button>
                  <button type="button" className="rounded-lg bg-danger/10 px-4 py-1.5 text-xs font-semibold text-danger hover:bg-danger/20">ลบ</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
