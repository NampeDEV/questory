import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import type { ColumnDef } from '@/components/admin/AdminDataTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'สินค้า — Questory Admin' };

// ADMIN-031 (TASK_ADMIN) — Products page

const MOCK_PRODUCTS = [
  { id: 'PRD-001', name: 'Pin ลายดอยอินทนนท์', category: 'Pin', price: 290, stock: 18, status: 'low_stock', imageColor: 'bg-forest-700' },
  { id: 'PRD-002', name: 'Pin ลายเขาใหญ่', category: 'Pin', price: 290, stock: 22, status: 'low_stock', imageColor: 'bg-moss-500' },
  { id: 'PRD-003', name: 'Board ดอยอินทนนท์', category: 'Board', price: 1290, stock: 85, status: 'active', imageColor: 'bg-forest-800' },
  { id: 'PRD-004', name: 'Pin Set อุทยาน 5 ภาค', category: 'Bundle', price: 1290, stock: 15, status: 'low_stock', imageColor: 'bg-gold-500' },
  { id: 'PRD-005', name: 'Board สิมิลัน Explorer', category: 'Board', price: 1590, stock: 42, status: 'active', imageColor: 'bg-forest-700' },
  { id: 'PRD-006', name: 'Badge นักสำรวจ รุ่น 1', category: 'Badge', price: 190, stock: 31, status: 'low_stock', imageColor: 'bg-forest-800' },
  { id: 'PRD-007', name: 'Pin ลายทะเล Set', category: 'Pin', price: 590, stock: 0, status: 'out_of_stock', imageColor: 'bg-forest-700' },
  { id: 'PRD-008', name: 'Sticker Pack อุทยาน Vol.1', category: 'Sticker', price: 99, stock: 200, status: 'active', imageColor: 'bg-gold-400' },
] as const;

type ProductRow = (typeof MOCK_PRODUCTS)[number];

const PRODUCT_COLUMNS: ColumnDef<ProductRow>[] = [
  {
    key: 'product',
    header: 'สินค้า',
    render: (product) => (
      <div className="flex items-center gap-3">
        <div className={`h-9 w-9 rounded-lg ${product.imageColor} opacity-70`} />
        <div>
          <p className="text-sm font-semibold text-ink">{product.name}</p>
          <p className="text-xs text-muted">{product.id}</p>
        </div>
      </div>
    ),
    className: 'px-5 py-3.5',
    headerClassName: 'px-5 py-3',
  },
  {
    key: 'category',
    header: 'หมวดหมู่',
    render: (product) => <span className="text-xs text-muted">{product.category}</span>,
    className: 'px-4 py-3.5',
    headerClassName: 'px-4 py-3',
  },
  {
    key: 'price',
    header: 'ราคา',
    render: (product) => <span className="font-bold text-ink">฿{product.price.toLocaleString()}</span>,
    className: 'px-4 py-3.5 text-right',
    headerClassName: 'px-4 py-3 text-right',
  },
  {
    key: 'stock',
    header: 'สต็อก',
    render: (product) => (
      <span
        className={
          product.stock === 0
            ? 'font-semibold text-danger'
            : product.stock < 25
              ? 'font-semibold text-gold-700'
              : 'font-semibold text-success'
        }
      >
        {product.stock}
      </span>
    ),
    className: 'px-4 py-3.5 text-center',
    headerClassName: 'px-4 py-3 text-center',
  },
  {
    key: 'status',
    header: 'สถานะ',
    render: (product) => <AdminStatusBadge status={product.status} />,
    className: 'px-4 py-3.5',
    headerClassName: 'px-4 py-3',
  },
  {
    key: 'actions',
    header: 'จัดการ',
    render: (product) => (
      <div className="flex gap-2">
        <Link
          href={`/admin/products/${product.id}/edit`}
          className="rounded-lg border border-forest-800/20 px-3 py-1.5 text-xs font-medium text-forest-800 hover:bg-sand-100"
        >
          แก้ไข
        </Link>
        <button
          type="button"
          className="rounded-lg border border-forest-800/20 px-3 py-1.5 text-xs font-medium text-muted hover:bg-sand-100"
        >
          เติมสต็อก
        </button>
      </div>
    ),
    className: 'px-5 py-3.5',
    headerClassName: 'px-5 py-3',
  },
];

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="สินค้า"
        description="จัดการสินค้าและสต็อกทั้งหมด"
        action={{ label: '+ เพิ่มสินค้า', href: '/admin/products/new' }}
      />

      {/* Filters */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="ค้นหาชื่อสินค้า..."
          className="rounded-lg border border-forest-800/15 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700/30"
        />
        <select
          aria-label="กรองตามหมวดหมู่"
          className="rounded-lg border border-forest-800/15 bg-white px-3 py-1.5 text-sm focus:outline-none"
        >
          <option value="">ทุกหมวดหมู่</option>
          <option value="board">Board</option>
          <option value="pin">Pin</option>
          <option value="bundle">Bundle</option>
          <option value="sticker">Sticker</option>
          <option value="badge">Badge</option>
        </select>
        <select
          aria-label="กรองตามสถานะ"
          className="rounded-lg border border-forest-800/15 bg-white px-3 py-1.5 text-sm focus:outline-none"
        >
          <option value="">ทุกสถานะ</option>
          <option value="active">มีสต็อก</option>
          <option value="low_stock">ใกล้หมด</option>
          <option value="out_of_stock">หมด</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <AdminDataTable
          columns={PRODUCT_COLUMNS}
          rows={MOCK_PRODUCTS}
          getRowKey={(product) => product.id}
        />
      </div>
    </div>
  );
}
