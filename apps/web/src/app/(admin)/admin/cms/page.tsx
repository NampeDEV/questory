import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const metadata: Metadata = { title: 'CMS / Banner — Questory Admin' };

const MOCK_BANNERS = [
  { id: 'BNR-001', title: 'Summer Quest 2567', targetPage: '/quests', active: true, startDate: '1 มิ.ย. 2567', endDate: '30 มิ.ย. 2567' },
  { id: 'BNR-002', title: 'Board Collection รอบใหม่', targetPage: '/boards', active: true, startDate: '15 พ.ค. 2567', endDate: '15 มิ.ย. 2567' },
  { id: 'BNR-003', title: 'Flash Sale 24 ชั่วโมง', targetPage: '/shop', active: false, startDate: '5 มิ.ย. 2567', endDate: '6 มิ.ย. 2567' },
  { id: 'BNR-004', title: 'Announcement — App Update', targetPage: '/', active: true, startDate: '28 พ.ค. 2567', endDate: '31 พ.ค. 2567' },
] as const;

export default function CmsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="CMS / Banner"
        description="จัดการ Banner และประกาศในแอปพลิเคชัน"
        action={{ label: '+ เพิ่ม Banner', href: '/admin/cms/new' }}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MOCK_BANNERS.map((b) => (
          <div key={b.id} className="overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
            {/* Banner image placeholder */}
            <div className={`h-32 w-full ${b.active ? 'bg-gradient-to-r from-forest-800 to-gold-600' : 'bg-sand-200'} flex items-center justify-center`}>
              <span className="text-xs font-semibold text-white/80">Banner Preview</span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ink">{b.title}</p>
                <div className={`relative h-5 w-9 flex-shrink-0 rounded-full ${b.active ? 'bg-forest-700' : 'bg-sand-300'}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${b.active ? 'left-4' : 'left-0.5'}`} />
                </div>
              </div>
              <p className="mt-1 text-xs text-muted">→ {b.targetPage}</p>
              <p className="mt-1 text-xs text-muted">{b.startDate} – {b.endDate}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" className="flex-1 rounded-lg bg-forest-700/10 py-1.5 text-xs font-semibold text-forest-700 hover:bg-forest-700/20">แก้ไข</button>
                <button type="button" className="flex-1 rounded-lg bg-danger/10 py-1.5 text-xs font-semibold text-danger hover:bg-danger/20">ลบ</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
