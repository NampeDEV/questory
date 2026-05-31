import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import type { ColumnDef } from '@/components/admin/AdminDataTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import type { OrderStatus } from '@/types/order';

export const metadata: Metadata = { title: 'คำสั่งซื้อ — Questory Admin' };

// ADMIN-030 (TASK_ADMIN) — Orders page

const MOCK_ORDERS = [
  { id: 'ORD-2024-0042', user: 'ณัฐวุฒิ แสงทอง', items: 'Pin Set อุทยาน 5 ภาค × 1', totalThb: 1290, status: 'paid' as OrderStatus, createdAt: '30 พ.ค. 2567 10:21' },
  { id: 'ORD-2024-0041', user: 'ศิริพร อันทรดี', items: 'Board ดอยอินทนนท์ × 1, Pin × 2', totalThb: 2890, status: 'processing' as OrderStatus, createdAt: '30 พ.ค. 2567 09:58' },
  { id: 'ORD-2024-0040', user: 'Akira Tanaka', items: 'Board เขาใหญ่ × 1', totalThb: 1890, status: 'shipped' as OrderStatus, createdAt: '29 พ.ค. 2567 14:11' },
  { id: 'ORD-2024-0039', user: 'วรเมธ ใจดี', items: 'Bundle ภาคเหนือ × 1', totalThb: 3490, status: 'delivered' as OrderStatus, createdAt: '29 พ.ค. 2567 09:30' },
  { id: 'ORD-2024-0038', user: 'มินตรา สุขใส', items: 'Pin ลายทะเล × 3', totalThb: 870, status: 'cancelled' as OrderStatus, createdAt: '28 พ.ค. 2567 20:05' },
  { id: 'ORD-2024-0037', user: 'ปิยะนุช โกมล', items: 'Board สิมิลัน × 1', totalThb: 1990, status: 'paid' as OrderStatus, createdAt: '28 พ.ค. 2567 15:44' },
  { id: 'ORD-2024-0036', user: 'กิตติชัย วัฒนา', items: 'Pin Set ภาคใต้ × 1', totalThb: 1290, status: 'processing' as OrderStatus, createdAt: '28 พ.ค. 2567 11:20' },
] as const;

type OrderRow = (typeof MOCK_ORDERS)[number];

const ORDER_COLUMNS: ColumnDef<OrderRow>[] = [
  {
    key: 'id',
    header: 'Order ID',
    render: (order) => (
      <span className="font-mono text-xs font-medium text-forest-700">{order.id}</span>
    ),
    className: 'px-5 py-3.5',
    headerClassName: 'px-5 py-3',
  },
  {
    key: 'user',
    header: 'ผู้ซื้อ',
    render: (order) => <span className="font-medium text-ink">{order.user}</span>,
    className: 'px-4 py-3.5',
    headerClassName: 'px-4 py-3',
  },
  {
    key: 'items',
    header: 'รายการ',
    render: (order) => <span className="text-xs text-muted">{order.items}</span>,
    className: 'px-4 py-3.5',
    headerClassName: 'px-4 py-3',
    hideOnTablet: true,
  },
  {
    key: 'total',
    header: 'ยอดรวม',
    render: (order) => <span className="font-bold text-ink">฿{order.totalThb.toLocaleString()}</span>,
    className: 'px-4 py-3.5 text-right',
    headerClassName: 'px-4 py-3 text-right',
  },
  {
    key: 'status',
    header: 'สถานะ',
    render: (order) => <AdminStatusBadge status={order.status} />, 
    className: 'px-4 py-3.5',
    headerClassName: 'px-4 py-3',
  },
  {
    key: 'createdAt',
    header: 'วันที่สั่ง',
    render: (order) => <span className="text-xs text-muted">{order.createdAt}</span>,
    className: 'hidden px-4 py-3.5 lg:table-cell',
    headerClassName: 'hidden px-4 py-3 lg:table-cell',
  },
  {
    key: 'actions',
    header: 'จัดการ',
    render: (order) => (
      <Link
        href={`/admin/orders/${order.id}`}
        className="text-xs font-medium text-forest-700 hover:text-forest-900"
      >
        ดูรายละเอียด →
      </Link>
    ),
    className: 'px-5 py-3.5',
    headerClassName: 'px-5 py-3',
  },
];

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="คำสั่งซื้อ"
        description="จัดการและติดตามคำสั่งซื้อทั้งหมด"
        action={{ label: '+ ออเดอร์ใหม่', href: '/admin/orders/new' }}
      />

      {/* Filters */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="ค้นหา Order ID, ชื่อผู้ใช้..."
          className="rounded-lg border border-forest-800/15 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700/30"
        />
        <select
          aria-label="กรองตามสถานะ"
          className="rounded-lg border border-forest-800/15 bg-white px-3 py-1.5 text-sm focus:outline-none"
        >
          <option value="">ทุกสถานะ</option>
          <option value="paid">ชำระแล้ว</option>
          <option value="processing">กำลังดำเนินการ</option>
          <option value="shipped">จัดส่งแล้ว</option>
          <option value="delivered">ส่งสำเร็จ</option>
          <option value="cancelled">ยกเลิก</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <AdminDataTable
          columns={ORDER_COLUMNS}
          rows={MOCK_ORDERS}
          getRowKey={(order) => order.id}
        />
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-forest-800/8 px-5 py-3">
          <p className="text-xs text-muted">แสดง 1–7 จาก 356 รายการ</p>
          <div className="flex gap-2">
            <button type="button" className="rounded-lg border border-forest-800/15 px-3 py-1.5 text-xs text-muted disabled:opacity-40" disabled>ก่อนหน้า</button>
            <button type="button" className="rounded-lg border border-forest-800/15 px-3 py-1.5 text-xs text-forest-800 hover:bg-sand-100">ถัดไป</button>
          </div>
        </div>
      </div>
    </div>
  );
}
