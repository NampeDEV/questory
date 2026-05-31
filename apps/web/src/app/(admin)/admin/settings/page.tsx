import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const metadata: Metadata = { title: 'ตั้งค่าระบบ — Questory Admin' };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-[860px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="ตั้งค่าระบบ"
        description="กำหนดค่าแอปพลิเคชัน Feature Flags และ Maintenance Mode"
      />

      {/* General */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-bold text-ink">ทั่วไป</h2>
        <div className="rounded-2xl border border-forest-800/10 bg-white shadow-sm divide-y divide-forest-800/6">
          {[
            { label: 'ชื่อแอปพลิเคชัน', value: 'Questory' },
            { label: 'Support Email', value: 'support@questory.app' },
            { label: 'Version', value: '1.2.4' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between px-5 py-4">
              <p className="text-sm font-medium text-ink">{item.label}</p>
              <p className="text-sm text-muted">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Flags */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold text-ink">Feature Flags</h2>
        <div className="rounded-2xl border border-forest-800/10 bg-white shadow-sm divide-y divide-forest-800/6">
          {[
            { label: 'AI Planner', desc: 'เปิดใช้งาน AI วางแผนการท่องเที่ยว', enabled: true },
            { label: 'Memory Wall', desc: 'ผู้ใช้สามารถโพสต์ Memory สาธารณะได้', enabled: true },
            { label: 'Creator Hub', desc: 'หน้า Creator/Partner สำหรับผู้สร้างเนื้อหา', enabled: false },
            { label: 'QR Batch Activation', desc: 'เปิดใช้งาน Batch Activate QR Code', enabled: true },
          ].map((flag) => (
            <div key={flag.label} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-ink">{flag.label}</p>
                <p className="text-xs text-muted">{flag.desc}</p>
              </div>
              <div className={`relative h-6 w-11 rounded-full transition-colors ${flag.enabled ? 'bg-forest-700' : 'bg-sand-300'}`}>
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${flag.enabled ? 'left-6' : 'left-1'}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Maintenance */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold text-ink">Maintenance Mode</h2>
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-danger">โหมดซ่อมบำรุง</p>
              <p className="text-xs text-muted">เมื่อเปิด ผู้ใช้จะไม่สามารถเข้าถึงแอปได้ชั่วคราว</p>
            </div>
            <div className="relative h-6 w-11 rounded-full bg-sand-300">
              <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow" />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 flex justify-end">
        <button type="button" className="rounded-xl bg-forest-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest-900 transition-colors">
          บันทึกการตั้งค่า
        </button>
      </div>
    </div>
  );
}
