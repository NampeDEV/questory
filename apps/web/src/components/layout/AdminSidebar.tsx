'use client';

// ADMIN-001 (TASK_ADMIN) — sidebar navigation
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart2,
  Bell,
  ShoppingCart,
  Package,
  Gift,
  Sticker,
  Tag,
  Flag,
  Compass,
  MapPin,
  Map,
  TreePine,
  Award,
  QrCode,
  FileCheck,
  Pin,
  Truck,
  MessageSquareMore,
  LifeBuoy,
  Users,
  UserCheck,
  ImagePlay,
  Star,
  AlertTriangle,
  ShieldCheck,
  Settings,
  Bot,
  Megaphone,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Mountain,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  badge?: number;
};

type NavGroup = {
  groupLabel: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: '1) ภาพรวม',
    items: [
      { label: 'แดชบอร์ด', href: '/admin', icon: LayoutDashboard },
      { label: 'Analytics / รายงาน', href: '/admin/analytics', icon: BarChart2 },
      { label: 'การแจ้งเตือน', href: '/admin/notifications', icon: Bell, badge: 12 },
    ],
  },
  {
    groupLabel: '2) การขาย / Commerce',
    items: [
      { label: 'คำสั่งซื้อ', href: '/admin/orders', icon: ShoppingCart, badge: 8 },
      { label: 'สินค้า', href: '/admin/products', icon: Package },
      { label: 'Bundle / Gift Set', href: '/admin/bundles', icon: Gift },
      { label: 'สติกเกอร์สินค้า', href: '/admin/stickers', icon: Sticker },
      { label: 'คูปอง / โปรโมชัน', href: '/admin/coupons', icon: Tag },
    ],
  },
  {
    groupLabel: '3) Quest & Content',
    items: [
      { label: 'บอร์ดภารกิจ', href: '/admin/boards', icon: Flag },
      { label: 'เควส', href: '/admin/quests', icon: Compass },
      { label: 'Mission / จุดหมาย', href: '/admin/missions', icon: MapPin },
      { label: 'แผนท่องเที่ยว', href: '/admin/plans', icon: Map },
      { label: 'ฐานข้อมูลอุทยาน', href: '/admin/parks', icon: TreePine },
      { label: 'คลัง Badge & Pin', href: '/admin/badges', icon: Award },
      { label: 'QR Activation', href: '/admin/qr-activation', icon: QrCode },
    ],
  },
  {
    groupLabel: '4) การตรวจสอบ / Operations',
    items: [
      { label: 'ตรวจหลักฐานส่งเควส', href: '/admin/submissions', icon: FileCheck, badge: 67 },
      { label: 'Claim Pin', href: '/admin/pin-claims', icon: Pin, badge: 42 },
      { label: 'การจัดส่ง', href: '/admin/shipping', icon: Truck },
      { label: 'รีวิวและอนุมัติคอนเทนต์', href: '/admin/content-review', icon: MessageSquareMore },
      { label: 'Ticket / Support', href: '/admin/support', icon: LifeBuoy },
    ],
  },
  {
    groupLabel: '5) ผู้ใช้ & ชุมชน',
    items: [
      { label: 'ผู้ใช้งาน', href: '/admin/users', icon: Users },
      { label: 'Creator / Partner', href: '/admin/creators', icon: UserCheck },
      { label: 'Memory Wall', href: '/admin/memory-wall', icon: ImagePlay },
      { label: 'รีวิวจากผู้ใช้', href: '/admin/reviews', icon: Star },
      { label: 'รายงานบัญหา', href: '/admin/reports', icon: AlertTriangle },
    ],
  },
  {
    groupLabel: '6) ระบบ',
    items: [
      { label: 'สิทธิ์การใช้งาน / Roles', href: '/admin/roles', icon: ShieldCheck },
      { label: 'ตั้งค่าแอป', href: '/admin/settings', icon: Settings },
      { label: 'ตั้งค่า AI Planner', href: '/admin/ai-settings', icon: Bot },
      { label: 'CMS / Banner', href: '/admin/cms', icon: Megaphone },
      { label: 'Audit Log', href: '/admin/audit-log', icon: ClipboardList },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(href: string): boolean {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        'relative flex h-screen flex-col border-r border-forest-800/20 bg-forest-950 transition-all duration-200',
        collapsed ? 'w-[60px]' : 'w-[220px]',
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-forest-800/30 px-4">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gold-500">
          <Mountain size={16} className="text-forest-950" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-xs font-bold leading-none text-gold-400">QUESTORY</p>
            <p className="truncate text-[10px] uppercase tracking-widest text-forest-400">ADMIN</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        {NAV_GROUPS.map((group) => (
          <div key={group.groupLabel} className="mb-1">
            {!collapsed && (
              <p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-forest-500">
                {group.groupLabel}
              </p>
            )}
            {collapsed && <div className="mx-2 my-1 border-t border-forest-800/40" />}
            {group.items.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs transition-colors',
                    active
                      ? 'bg-forest-700 text-white'
                      : 'text-forest-300 hover:bg-forest-800 hover:text-white',
                    collapsed && 'justify-center',
                  )}
                >
                  <span className="relative flex-shrink-0">
                    <Icon size={16} />
                    {item.badge !== undefined && item.badge > 0 && collapsed && (
                      <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold-500 text-[8px] font-bold text-forest-950">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-gold-500 px-1 text-[9px] font-bold text-forest-950">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        aria-label={collapsed ? 'ขยาย sidebar' : 'ย่อ sidebar'}
        className="absolute -right-3 top-16 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-forest-800/40 bg-forest-900 text-forest-400 shadow-sm hover:text-white"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
