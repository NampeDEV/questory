import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'Memory Wall — Questory Admin' };

const MOCK_MEMORIES = [
  { id: 'MEM-001', user: 'ณัฐวุฒิ แสงทอง', park: 'ดอยอินทนนท์', caption: 'วิวทะเลหมอกยามเช้า สวยสุดในชีวิต...', likesCount: 42, status: 'submitted' },
  { id: 'MEM-002', user: 'Akira Tanaka', park: 'เขาใหญ่', caption: 'First time seeing a wild elephant! Amazing...', likesCount: 128, status: 'approved' },
  { id: 'MEM-003', user: 'มินตรา สุขใส', park: 'หมู่เกาะสิมิลัน', caption: 'น้ำสวยใสมากๆ ปลาเยอะมากเลย...', likesCount: 76, status: 'submitted' },
  { id: 'MEM-004', user: 'ปิยะนุช โกมล', park: 'ภูกระดึง', caption: 'ดอกไม้บนยอดเขา สวยกว่าที่คิดไว้มาก...', likesCount: 19, status: 'approved' },
] as const;

export default function MemoryWallPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="Memory Wall"
        description="อนุมัติและจัดการ Memory ที่ผู้ใช้ส่งมา"
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MOCK_MEMORIES.map((mem) => (
          <div key={mem.id} className="overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
            {/* Image placeholder */}
            <div className="h-40 w-full bg-gradient-to-br from-forest-800 to-forest-700 opacity-70" />
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-ink">{mem.user}</p>
                  <p className="text-xs text-muted">{mem.park}</p>
                </div>
                <AdminStatusBadge status={mem.status} />
              </div>
              <p className="mt-2 text-sm text-muted line-clamp-2">{mem.caption}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted">
                <span>❤️</span> <span>{mem.likesCount}</span>
              </div>
              {mem.status === 'submitted' && (
                <div className="mt-3 flex gap-2">
                  <button type="button" className="flex-1 rounded-lg bg-success/10 py-1.5 text-xs font-semibold text-success hover:bg-success/20">อนุมัติ</button>
                  <button type="button" className="flex-1 rounded-lg bg-danger/10 py-1.5 text-xs font-semibold text-danger hover:bg-danger/20">ปฏิเสธ</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
