import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Package, Truck, CheckCircle2 } from 'lucide-react';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import type { OrderStatus } from '@/types/order';

export const metadata: Metadata = { title: 'รายละเอียดคำสั่งซื้อ — Questory Admin' };

// ADMIN-030b — Order detail page

const STATUS_STEPS: OrderStatus[] = ['paid', 'processing', 'shipped', 'delivered'];

const STATUS_LABEL: Record<OrderStatus, string> = {
  draft: 'Draft',
  paid: 'ชำระแล้ว',
  processing: 'กำลังจัดส่ง',
  shipped: 'จัดส่งแล้ว',
  delivered: 'ส่งถึงแล้ว',
  cancelled: 'ยกเลิก',
};

// Mock lookup — replace with GET /api/admin/orders/:id when Supabase is wired
const MOCK_ORDERS: Record<string, {
  id: string; user: string; userEmail: string;
  items: { name: string; qty: number; priceThb: number }[];
  totalThb: number; status: OrderStatus;
  createdAt: string; trackingNumber: string | null;
  shippingAddress: string;
}> = {
  'ORD-2024-0042': {
    id: 'ORD-2024-0042', user: 'ณัฐวุฒิ แสงทอง', userEmail: 'nuttawut@example.com',
    items: [{ name: 'Pin Set อุทยาน 5 ภาค', qty: 1, priceThb: 1290 }],
    totalThb: 1290, status: 'paid', createdAt: '30 พ.ค. 2567 10:21',
    trackingNumber: null, shippingAddress: '123 ถนนสุขุมวิท กรุงเทพฯ 10110',
  },
  'ORD-2024-0041': {
    id: 'ORD-2024-0041', user: 'ศิริพร อันทรดี', userEmail: 'siriporn@example.com',
    items: [
      { name: 'Board ดอยอินทนนท์', qty: 1, priceThb: 1290 },
      { name: 'Pin ลายดอยอินทนนท์', qty: 2, priceThb: 1600 },
    ],
    totalThb: 2890, status: 'processing', createdAt: '30 พ.ค. 2567 09:58',
    trackingNumber: null, shippingAddress: '456 ถนนเพชรบุรี กรุงเทพฯ 10400',
  },
  'ORD-2024-0040': {
    id: 'ORD-2024-0040', user: 'Akira Tanaka', userEmail: 'akira@example.com',
    items: [{ name: 'Board เขาใหญ่ Explorer', qty: 1, priceThb: 1890 }],
    totalThb: 1890, status: 'shipped', createdAt: '29 พ.ค. 2567 14:11',
    trackingNumber: 'TH123456789TH', shippingAddress: '789 ถนนสีลม กรุงเทพฯ 10500',
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = MOCK_ORDERS[id];

  if (!order) {
    return (
      <div className="mx-auto max-w-[860px] px-4 py-12 sm:px-6 text-center">
        <p className="text-muted">ไม่พบคำสั่งซื้อ ID: {id}</p>
        <Link href="/admin/orders" className="mt-4 inline-block text-sm text-forest-700 hover:underline">
          ← กลับรายการคำสั่งซื้อ
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="mx-auto max-w-[860px] px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-2 text-sm text-muted">
        <Link href="/admin/orders" className="flex items-center gap-1 hover:text-ink">
          <ChevronLeft size={14} />
          คำสั่งซื้อ
        </Link>
        <span>/</span>
        <span className="font-mono text-ink">{order.id}</span>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <AdminPageHeader
          title={`คำสั่งซื้อ ${order.id}`}
          description={`${order.user} · ${order.createdAt}`}
        />
        <AdminStatusBadge status={order.status} />
      </div>

      {/* Progress tracker */}
      {order.status !== 'cancelled' && (
        <div className="mb-6 rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-sand-200" aria-hidden="true" />
            {STATUS_STEPS.map((step, i) => {
              const isDone = i <= currentStepIndex;
              return (
                <div key={step} className="relative flex flex-col items-center gap-1.5 text-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      isDone
                        ? 'border-forest-700 bg-forest-700 text-white'
                        : 'border-sand-300 bg-white text-muted'
                    }`}
                  >
                    {isDone ? <CheckCircle2 size={14} /> : <span className="text-xs">{i + 1}</span>}
                  </div>
                  <span className={`text-[10px] font-medium ${isDone ? 'text-forest-700' : 'text-muted'}`}>
                    {STATUS_LABEL[step]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Items */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
              <Package size={14} />
              รายการสินค้า
            </h2>
            <div className="divide-y divide-forest-800/5">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-ink">{item.name}</p>
                    <p className="text-xs text-muted">จำนวน {item.qty} ชิ้น</p>
                  </div>
                  <p className="font-bold text-ink">฿{item.priceThb.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-forest-800/10 pt-4">
              <span className="text-sm font-semibold text-ink">ยอดรวม</span>
              <span className="text-lg font-bold text-forest-800">฿{order.totalThb.toLocaleString()}</span>
            </div>
          </section>

          {/* Shipping */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
              <Truck size={14} />
              ข้อมูลการจัดส่ง
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted">ที่อยู่จัดส่ง</dt>
                <dd className="mt-0.5 text-ink">{order.shippingAddress}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">หมายเลขพัสดุ</dt>
                <dd className="mt-0.5 font-mono font-medium text-ink">
                  {order.trackingNumber ?? '—'}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Right — customer + actions */}
        <div className="space-y-5">
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-ink">ลูกค้า</h2>
            <p className="font-medium text-ink">{order.user}</p>
            <p className="mt-0.5 text-xs text-muted">{order.userEmail}</p>
          </section>

          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-ink">ข้อมูลคำสั่งซื้อ</h2>
            <dl className="space-y-2 text-xs">
              <div>
                <dt className="text-muted">Order ID</dt>
                <dd className="font-mono font-medium text-ink">{order.id}</dd>
              </div>
              <div>
                <dt className="text-muted">วันที่สั่งซื้อ</dt>
                <dd className="text-ink">{order.createdAt}</dd>
              </div>
              <div>
                <dt className="text-muted">สถานะ</dt>
                <dd className="mt-0.5"><AdminStatusBadge status={order.status} /></dd>
              </div>
            </dl>
          </section>

          <Link
            href={`/admin/shipping`}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-forest-800/20 px-4 py-3 text-sm font-semibold text-forest-800 hover:bg-sand-100 transition-colors"
          >
            <Truck size={14} />
            ไปหน้า Shipping
          </Link>
        </div>
      </div>
    </div>
  );
}
