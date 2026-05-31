import type { Metadata } from 'next';
import {
  ShoppingBag,
  ShoppingCart,
  Compass,
  FileSearch,
  Pin,
  Plus,
  Flag,
  CheckSquare,
  Printer,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { AdminStatsCard } from '@/components/admin/AdminStatsCard';
import { AdminWeeklyChart } from '@/components/admin/AdminWeeklyChart';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminCountUp } from '@/components/admin/AdminCountUp';

export const metadata: Metadata = { title: 'แดชบอร์ดภาพรวม — Questory Admin' };

// ADMIN-010–015 (TASK_ADMIN) · FE-PAGE-ADMIN (SPEC-08)

const WEEKLY_DATA = [
  { label: '24 พ.ค.', orders: 290, activations: 180 },
  { label: '25 พ.ค.', orders: 320, activations: 210 },
  { label: '26 พ.ค.', orders: 380, activations: 260 },
  { label: '27 พ.ค.', orders: 410, activations: 300 },
  { label: '28 พ.ค.', orders: 395, activations: 340 },
  { label: '29 พ.ค.', orders: 440, activations: 390 },
  { label: '30 พ.ค.', orders: 356, activations: 420 },
] as const;

const PENDING_REVIEW = [
  {
    id: 'sub-001',
    avatarInitial: 'ณ',
    userName: 'ณัฐวุฒิ แสงทอง',
    userHandle: '@nuttawut.93',
    quest: 'พิชิตยอดดอยอินทนนท์',
    park: 'อุทยานแห่งชาติดอยอินทนนท์',
    submittedAt: '30 พ.ค. 2567 10:21',
    status: 'submitted' as const,
  },
  {
    id: 'sub-002',
    avatarInitial: 'ศ',
    userName: 'ศิริพร อันทรดี',
    userHandle: '@siriporn.jd',
    quest: 'น้ำตกกลีซอ Explorer',
    park: 'อุทยานแห่งชาติทุ่งแสลงหลวง',
    submittedAt: '30 พ.ค. 2567 09:58',
    status: 'submitted' as const,
  },
  {
    id: 'sub-003',
    avatarInitial: 'A',
    userName: 'Akira Tanaka',
    userHandle: '@akira.tnk',
    quest: 'ภารกิจบนเขาใหญ่',
    park: 'อุทยานแห่งชาติเขาใหญ่',
    submittedAt: '30 พ.ค. 2567 09:30',
    status: 'submitted' as const,
  },
  {
    id: 'sub-004',
    avatarInitial: 'พ',
    userName: 'Patcharida K.',
    userHandle: '@patcha.k',
    quest: 'เดินป่าภูสอยดาว',
    park: 'อุทยานแห่งชาติภูสอยดาว',
    submittedAt: '30 พ.ค. 2567 08:47',
    status: 'submitted' as const,
  },
  {
    id: 'sub-005',
    avatarInitial: 'ว',
    userName: 'วรเมธ ใจดี',
    userHandle: '@woramet.jd',
    quest: 'ล่องแก่งไทรโยค',
    park: 'อุทยานแห่งชาติไทรโยค',
    submittedAt: '30 พ.ค. 2567 08:12',
    status: 'submitted' as const,
  },
] as const;

const LOW_STOCK_ITEMS = [
  { name: 'Pin ลายดอยอินทนนท์', stock: 18, imageColor: 'bg-forest-700' },
  { name: 'Pin ลายเขาใหญ่', stock: 22, imageColor: 'bg-moss-500' },
  { name: 'Pin Set อุทยาน 5 ภาค', stock: 15, imageColor: 'bg-gold-500' },
  { name: 'Badge นักสำรวจ รุ่น 1', stock: 31, imageColor: 'bg-forest-800' },
] as const;

const SHIPPING_STATUS = [
  {
    label: 'รอจัดส่ง',
    sub: 'รอพิมพ์ใบจัดส่ง / เตรียมจัดส่ง',
    count: 42,
    color: 'text-gold-700',
    bgColor: 'bg-gold-500/10',
    dotColor: 'bg-gold-500',
  },
  {
    label: 'จัดส่งแล้ว',
    sub: 'จัดส่งแล้ว (อยู่ระหว่างขนส่ง)',
    count: 128,
    color: 'text-forest-700',
    bgColor: 'bg-forest-700/10',
    dotColor: 'bg-forest-700',
  },
  {
    label: 'ส่งสำเร็จ',
    sub: 'ผู้รับได้รับสินค้าแล้ว',
    count: 356,
    color: 'text-success',
    bgColor: 'bg-success/10',
    dotColor: 'bg-success',
  },
  {
    label: 'คืนสินค้า / ปัญหา',
    sub: 'มีปัญหาการจัดส่ง / คืนสินค้า',
    count: 6,
    color: 'text-danger',
    bgColor: 'bg-danger/10',
    dotColor: 'bg-danger',
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
      {/* Page title */}
      <div className="mb-6 animate-fade-in-up">
        <h1 className="font-display text-2xl font-bold text-forest-900">แดชบอร์ดภาพรวม</h1>
        <p className="mt-0.5 text-sm text-muted">ภาพรวมการดำเนินงานของ Questory</p>
      </div>

      {/* KPI row — staggered fade-in */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <div className="animate-fade-in animate-delay-75">
          <AdminStatsCard
            label="ยอดขายวันนี้"
            value={<AdminCountUp value="฿128450" />}
            trend="↑18.6% จากเมื่อวาน"
            trendDirection="up"
            icon={<ShoppingBag size={20} />}
          />
        </div>
        <div className="animate-fade-in animate-delay-150">
          <AdminStatsCard
            label="คำสั่งซื้อทั้งหมด"
            value={<AdminCountUp value="356" />}
            trend="↑12.4% จากสัปดาห์ที่แล้ว"
            trendDirection="up"
            icon={<ShoppingCart size={20} />}
          />
        </div>
        <div className="animate-fade-in animate-delay-225">
          <AdminStatsCard
            label="เควสที่ถูก Activate"
            value={<AdminCountUp value="842" />}
            trend="↑23.7% จากสัปดาห์ที่แล้ว"
            trendDirection="up"
            icon={<Compass size={20} />}
          />
        </div>
        <div className="animate-fade-in animate-delay-300">
          <AdminStatsCard
            label="หลักฐานรอตรวจ"
            value={<AdminCountUp value="67" />}
            trend="↑8 รายการ"
            trendDirection="up"
            icon={<FileSearch size={20} />}
          />
        </div>
        <div className="animate-fade-in animate-delay-375">
          <AdminStatsCard
            label="Pin รอจัดส่ง"
            value={<AdminCountUp value="42" />}
            trend="↓5 รายการ"
            trendDirection="down"
            icon={<Pin size={20} />}
          />
        </div>
      </div>

      {/* Main content: chart + right panel */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Weekly chart */}
          <div className="animate-scale-in animate-delay-450 rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-ink">แนวโน้มคำสั่งซื้อรายสัปดาห์</h2>
              </div>
              <select
                aria-label="เลือกประเภทข้อมูล"
                className="rounded-lg border border-forest-800/15 bg-sand-100 px-3 py-1.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest-700/30"
                defaultValue="orders"
              >
                <option value="orders">คำสั่งซื้อ (ออเดอร์)</option>
                <option value="activations">เควส Activate</option>
              </select>
            </div>
            {/* Legend */}
            <div className="mt-3 flex gap-5">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <span className="h-0.5 w-6 rounded-full bg-forest-700" />
                คำสั่งซื้อ (ออเดอร์)
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <span className="h-0.5 w-6 rounded-full border-t-2 border-dashed border-gold-500" />
                เควสที่ถูก Activate
              </div>
            </div>
            <div className="mt-4">
              <AdminWeeklyChart data={[...WEEKLY_DATA]} />
            </div>
          </div>

          {/* Pending review table */}
          <div className="animate-fade-in animate-delay-525 rounded-2xl border border-forest-800/10 bg-white shadow-sm">
            <div className="flex items-center justify-between px-5 pt-5">
              <div>
                <h2 className="text-sm font-semibold text-ink">รายการรอตรวจ</h2>
                <p className="text-xs text-muted">67 รายการ</p>
              </div>
              <Link
                href="/admin/submissions"
                className="flex items-center gap-1 text-xs font-medium text-forest-700 hover:text-forest-900"
              >
                ดูทั้งหมด <ChevronRight size={12} />
              </Link>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-forest-800/8 bg-sand-100/50">
                    <th className="px-5 py-2.5 text-left font-medium text-muted">ผู้ใช้งาน</th>
                    <th className="px-3 py-2.5 text-left font-medium text-muted">เควส</th>
                    <th className="px-3 py-2.5 text-left font-medium text-muted hidden md:table-cell">อุทยาน / จุดหมาย</th>
                    <th className="px-3 py-2.5 text-left font-medium text-muted hidden lg:table-cell">ส่งเมื่อ</th>
                    <th className="px-3 py-2.5 text-left font-medium text-muted">สถานะ</th>
                    <th className="px-5 py-2.5 text-left font-medium text-muted">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-800/6">
                  {PENDING_REVIEW.map((row) => (
                    <tr key={row.id} className="hover:bg-sand-100/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-forest-700 text-xs font-bold text-white">
                            {row.avatarInitial}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-ink">{row.userName}</p>
                            <p className="truncate text-muted">{row.userHandle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-medium text-ink">{row.quest}</td>
                      <td className="hidden px-3 py-3 text-muted md:table-cell">{row.park}</td>
                      <td className="hidden px-3 py-3 text-muted lg:table-cell whitespace-nowrap">{row.submittedAt}</td>
                      <td className="px-3 py-3">
                        <AdminStatusBadge status={row.status} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            className="rounded-md bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success hover:bg-success/20"
                          >
                            อนุมัติ
                          </button>
                          <button
                            type="button"
                            className="rounded-md bg-danger/10 px-2.5 py-1 text-[11px] font-semibold text-danger hover:bg-danger/20"
                          >
                            ปฏิเสธ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-forest-800/8 px-5 py-3 text-center">
              <Link
                href="/admin/submissions"
                className="text-xs font-medium text-forest-700 hover:text-forest-900"
              >
                ดูรายการทั้งหมด →
              </Link>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Quick Actions */}
          <div className="animate-slide-in-right animate-delay-300 rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
              <span className="text-base">🌲</span> Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/admin/boards/new"
                className="flex flex-col items-center gap-1.5 rounded-xl bg-forest-800 px-3 py-4 text-center transition-colors hover:bg-forest-700"
              >
                <Plus size={20} className="text-white" />
                <span className="text-xs font-semibold text-white">เพิ่มบอร์ดใหม่</span>
              </Link>
              <Link
                href="/admin/quests/new"
                className="flex flex-col items-center gap-1.5 rounded-xl bg-forest-800 px-3 py-4 text-center transition-colors hover:bg-forest-700"
              >
                <Flag size={20} className="text-white" />
                <span className="text-xs font-semibold text-white">สร้างเควส</span>
              </Link>
              <Link
                href="/admin/submissions"
                className="flex flex-col items-center gap-1.5 rounded-xl bg-gold-500 px-3 py-4 text-center transition-colors hover:bg-gold-400"
              >
                <CheckSquare size={20} className="text-forest-950" />
                <span className="text-xs font-semibold text-forest-950">อนุมัติหลักฐาน</span>
              </Link>
              <Link
                href="/admin/shipping"
                className="flex flex-col items-center gap-1.5 rounded-xl bg-gold-500 px-3 py-4 text-center transition-colors hover:bg-gold-400"
              >
                <Printer size={20} className="text-forest-950" />
                <span className="text-xs font-semibold text-forest-950">พิมพ์ใบจัดส่ง</span>
              </Link>
            </div>
          </div>

          {/* Pin Claim & Shipping */}
          <div className="animate-slide-in-right animate-delay-450 rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Pin Claim &amp; Shipping</h2>
              <Link
                href="/admin/shipping"
                className="text-xs text-forest-700 hover:text-forest-900"
              >
                ดูทั้งหมด
              </Link>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {SHIPPING_STATUS.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 ${item.bgColor}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2 w-2 rounded-full ${item.dotColor}`} />
                    <div>
                      <p className={`text-xs font-semibold ${item.color}`}>{item.label}</p>
                      <p className="text-[10px] text-muted">{item.sub}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-base font-bold ${item.color}`}>{item.count}</span>
                    <ChevronRight size={12} className="text-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low stock */}
          <div className="animate-slide-in-right animate-delay-600 rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                <AlertTriangle size={14} className="text-gold-500" />
                สินค้าใกล้หมด
              </h2>
              <Link
                href="/admin/products"
                className="text-xs text-forest-700 hover:text-forest-900"
              >
                ดูทั้งหมด
              </Link>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {LOW_STOCK_ITEMS.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-forest-800/8 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-8 w-8 flex-shrink-0 rounded-lg ${item.imageColor} opacity-70`}
                    />
                    <span className="text-xs font-medium text-ink">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gold-700">{item.stock} ชิ้น</span>
                    <AdminStatusBadge status="low_stock" className="text-[9px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
