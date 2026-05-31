import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const metadata: Metadata = { title: 'Bundle / Gift Set — Questory Admin' };

// ADMIN-032 (TASK_ADMIN)

const MOCK_BUNDLES = [
  { id: 'BND-001', name: 'Bundle ภาคเหนือ', contents: ['Board ดอยอินทนนท์', 'Pin × 3', 'Sticker × 5'], price: 2990, stock: 20, status: 'active' },
  { id: 'BND-002', name: 'Gift Set สิมิลัน', contents: ['Board สิมิลัน', 'Pin ลายทะเล × 2'], price: 2490, stock: 12, status: 'active' },
  { id: 'BND-003', name: 'Bundle ผจญภัย Premium', contents: ['Board × 2', 'Pin × 5', 'Badge × 1'], price: 4990, stock: 5, status: 'low_stock' },
  { id: 'BND-004', name: 'Starter Kit', contents: ['Board สำหรับผู้เริ่มต้น × 1', 'Pin × 1', 'Map'], price: 1490, stock: 0, status: 'out_of_stock' },
] as const;

export default function BundlesPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="Bundle / Gift Set"
        description="จัดการชุดสินค้าและของขวัญ"
        action={{ label: '+ สร้าง Bundle', href: '/admin/bundles/new' }}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MOCK_BUNDLES.map((bundle) => (
          <div
            key={bundle.id}
            className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-ink">{bundle.name}</p>
                <p className="mt-0.5 text-xs font-mono text-muted">{bundle.id}</p>
              </div>
              <AdminStatusBadge status={bundle.status} />
            </div>
            <ul className="mt-3 space-y-1">
              {bundle.contents.map((c) => (
                <li key={c} className="flex items-center gap-1.5 text-xs text-muted">
                  <span className="h-1 w-1 rounded-full bg-forest-700" />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-forest-800/8 pt-4">
              <span className="text-lg font-bold text-ink">฿{bundle.price.toLocaleString()}</span>
              <span className="text-xs text-muted">สต็อก: <strong>{bundle.stock}</strong></span>
            </div>
            <button
              type="button"
              className="mt-3 w-full rounded-lg border border-forest-800/20 py-1.5 text-xs font-medium text-forest-800 hover:bg-sand-100"
            >
              แก้ไข Bundle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
