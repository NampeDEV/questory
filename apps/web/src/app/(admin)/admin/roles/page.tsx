import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const metadata: Metadata = { title: 'Roles & Permissions — Questory Admin' };

const ROLES = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'สิทธิ์สูงสุด ควบคุมทุกส่วนของระบบ',
    color: 'bg-danger/10 text-danger',
    permissions: ['ดูแดชบอร์ด', 'จัดการออเดอร์', 'จัดการสินค้า', 'จัดการเควส', 'จัดการผู้ใช้', 'ตั้งค่าระบบ', 'ดู Audit Log', 'จัดการ Roles'],
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'จัดการระบบส่วนใหญ่ ยกเว้นการตั้งค่าขั้นสูง',
    color: 'bg-gold-500/10 text-gold-700',
    permissions: ['ดูแดชบอร์ด', 'จัดการออเดอร์', 'จัดการสินค้า', 'จัดการเควส', 'จัดการผู้ใช้'],
  },
  {
    id: 'moderator',
    name: 'Moderator',
    description: 'ตรวจสอบเนื้อหาและหลักฐานจากผู้ใช้',
    color: 'bg-forest-800/10 text-forest-800',
    permissions: ['ดูแดชบอร์ด', 'ตรวจสอบหลักฐาน', 'จัดการ Memory Wall', 'จัดการ Reviews'],
  },
  {
    id: 'support',
    name: 'Support',
    description: 'ตอบกระทู้และจัดการ Ticket จากผู้ใช้',
    color: 'bg-moss-500/10 text-moss-700',
    permissions: ['ดูแดชบอร์ด', 'จัดการ Support Tickets', 'ดูข้อมูลผู้ใช้'],
  },
] as const;

export default function RolesPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="Roles & Permissions"
        description="กำหนดสิทธิ์การเข้าถึงสำหรับแต่ละ Role"
      />

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {ROLES.map((role) => (
          <div key={role.id} className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className={`rounded-lg px-3 py-1 text-sm font-bold ${role.color}`}>{role.name}</span>
              <button type="button" className="text-xs font-medium text-forest-700 hover:text-forest-900">แก้ไข</button>
            </div>
            <p className="mt-2 text-xs text-muted">{role.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {role.permissions.map((perm) => (
                <span key={perm} className="flex items-center gap-1 rounded-md bg-sand-100 px-2 py-1 text-[11px] text-ink">
                  <span className="text-success">✓</span> {perm}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
