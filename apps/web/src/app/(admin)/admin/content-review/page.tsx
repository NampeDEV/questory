import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'รีวิวและอนุมัติคอนเทนต์ — Questory Admin' };

// ADMIN-053 (TASK_ADMIN)

const MOCK_CONTENT = [
  { id: 'CNT-001', type: 'memory', user: 'ณัฐวุฒิ แสงทอง', title: 'ความทรงจำที่ดอยอินทนนท์', preview: 'วิวยอดเยี่ยมมาก ทะเลหมอกสวยสุดๆ...', submittedAt: '30 พ.ค. 2567', status: 'submitted' },
  { id: 'CNT-002', type: 'review', user: 'มินตรา สุขใส', title: 'รีวิวบอร์ดดอยอินทนนท์ ⭐⭐⭐⭐⭐', preview: 'บอร์ดสวยมาก ภารกิจสนุก คุ้มค่ามากๆ...', submittedAt: '29 พ.ค. 2567', status: 'submitted' },
  { id: 'CNT-003', type: 'memory', user: 'Akira Tanaka', title: 'First Quest Completed!', preview: 'Amazing experience at Khao Yai National Park...', submittedAt: '29 พ.ค. 2567', status: 'approved' },
  { id: 'CNT-004', type: 'plan', user: 'ปิยะนุช โกมล', title: 'แผน 3 วัน เชียงใหม่ National Parks', preview: 'วันที่ 1: ดอยสุเทพ, วันที่ 2: ดอยอินทนนท์...', submittedAt: '28 พ.ค. 2567', status: 'submitted' },
] as const;

const TYPE_LABEL: Record<string, string> = {
  memory: 'Memory',
  review: 'รีวิว',
  plan: 'แผนเที่ยว',
};

export default function ContentReviewPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="รีวิวและอนุมัติคอนเทนต์"
        description="ตรวจสอบ Memory, รีวิว และแผนท่องเที่ยวก่อนเผยแพร่"
      />

      <div className="mt-5 flex flex-col gap-4">
        {MOCK_CONTENT.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-forest-800/8 px-2 py-0.5 text-[11px] font-medium text-forest-800">
                    {TYPE_LABEL[item.type] ?? item.type}
                  </span>
                  <AdminStatusBadge status={item.status} />
                </div>
                <p className="mt-2 font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-xs text-muted">โดย: <strong>{item.user}</strong> · {item.submittedAt}</p>
                <p className="mt-1.5 text-sm text-muted line-clamp-2">{item.preview}</p>
              </div>
              {item.status === 'submitted' && (
                <div className="flex flex-shrink-0 flex-col gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-success/10 px-4 py-1.5 text-xs font-semibold text-success hover:bg-success/20"
                  >
                    อนุมัติ
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-danger/10 px-4 py-1.5 text-xs font-semibold text-danger hover:bg-danger/20"
                  >
                    ปฏิเสธ
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
