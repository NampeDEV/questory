import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const metadata: Metadata = { title: 'การแจ้งเตือน — Questory Admin' };

const MOCK_NOTIFICATIONS = [
  { id: 'NTF-001', type: 'submission', message: 'ณัฐวุฒิ แสงทอง ส่งหลักฐานภารกิจใหม่', time: '5 นาทีที่แล้ว', read: false },
  { id: 'NTF-002', type: 'order', message: 'ออเดอร์ ORD-2024-0042 ชำระเงินสำเร็จ ฿1,290', time: '12 นาทีที่แล้ว', read: false },
  { id: 'NTF-003', type: 'stock', message: 'Pin ลายดอยอินทนนท์ สต็อกเหลือ 18 ชิ้น (ใกล้หมด)', time: '1 ชั่วโมงที่แล้ว', read: false },
  { id: 'NTF-004', type: 'user', message: 'ผู้ใช้ใหม่สมัครสมาชิก 12 คนในวันนี้', time: '2 ชั่วโมงที่แล้ว', read: true },
  { id: 'NTF-005', type: 'support', message: 'Ticket TKT-002 รอการตอบกลับนาน 24 ชั่วโมง', time: '3 ชั่วโมงที่แล้ว', read: true },
  { id: 'NTF-006', type: 'submission', message: 'มีหลักฐานรอตรวจสอบ 67 รายการ', time: '4 ชั่วโมงที่แล้ว', read: true },
] as const;

const TYPE_ICON: Record<string, string> = {
  submission: '📋',
  order: '🛒',
  stock: '⚠️',
  user: '👤',
  support: '🎧',
};

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="การแจ้งเตือน"
        description="แจ้งเตือนล่าสุดจากระบบ"
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-forest-800/8 px-5 py-3">
          <p className="text-xs font-semibold text-muted">ทั้งหมด {MOCK_NOTIFICATIONS.length} รายการ</p>
          <button type="button" className="text-xs text-forest-700 hover:text-forest-900">
            ทำเครื่องหมายอ่านทั้งหมด
          </button>
        </div>
        <div className="divide-y divide-forest-800/6">
          {MOCK_NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-5 py-4 transition-colors hover:bg-sand-100/40 ${n.read ? '' : 'bg-forest-700/5'}`}
            >
              <span className="mt-0.5 text-xl">{TYPE_ICON[n.type] ?? '🔔'}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.read ? 'text-muted' : 'font-medium text-ink'}`}>{n.message}</p>
                <p className="mt-0.5 text-xs text-muted">{n.time}</p>
              </div>
              {!n.read && (
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-gold-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
