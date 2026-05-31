import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const metadata: Metadata = { title: 'Analytics / รายงาน — Questory Admin' };

// ADMIN-020 (TASK_ADMIN)

const REVENUE_BY_WEEK = [
  { week: 'สัปดาห์ที่ 1 พ.ค.', revenue: 42500, orders: 88 },
  { week: 'สัปดาห์ที่ 2 พ.ค.', revenue: 61200, orders: 112 },
  { week: 'สัปดาห์ที่ 3 พ.ค.', revenue: 78900, orders: 134 },
  { week: 'สัปดาห์ที่ 4 พ.ค.', revenue: 128450, orders: 356 },
] as const;

const TOP_PRODUCTS = [
  { rank: 1, name: 'Board ดอยอินทนนท์', revenue: 34200, units: 26 },
  { rank: 2, name: 'Pin Set อุทยาน 5 ภาค', revenue: 22530, units: 38 },
  { rank: 3, name: 'Bundle ภาคเหนือ', revenue: 17950, units: 12 },
  { rank: 4, name: 'Board เขาใหญ่ Explorer', revenue: 15120, units: 11 },
  { rank: 5, name: 'Pin ลายดอยอินทนนท์', revenue: 8120, units: 28 },
] as const;

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="Analytics / รายงาน"
        description="สถิติการขายและการใช้งานแพลตฟอร์ม"
      />

      {/* KPI row */}
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'รายได้เดือนนี้', value: '฿311,050', sub: '↑22% จากเดือนที่แล้ว', pos: true },
          { label: 'ออเดอร์เดือนนี้', value: '690', sub: '↑17% จากเดือนที่แล้ว', pos: true },
          { label: 'Quest Activations', value: '3,248', sub: '↑31% จากเดือนที่แล้ว', pos: true },
          { label: 'Avg Order Value', value: '฿451', sub: '↑4% จากเดือนที่แล้ว', pos: true },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold text-ink">{k.value}</p>
            <p className="mt-0.5 text-xs text-muted">{k.label}</p>
            <p className={`mt-2 text-xs font-medium ${k.pos ? 'text-success' : 'text-danger'}`}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* Revenue by week */}
        <div className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-ink">รายได้รายสัปดาห์ (พ.ค.)</h2>
          <div className="mt-4 space-y-3">
            {REVENUE_BY_WEEK.map((r) => {
              const maxRevenue = 130000;
              const barWidth = Math.round((r.revenue / maxRevenue) * 100);
              return (
                <div key={r.week}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted">{r.week}</span>
                    <span className="font-semibold text-ink">฿{r.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-sand-200">
                    <div className="h-full rounded-full bg-forest-700" style={{ width: `${barWidth}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-ink">สินค้าขายดี</h2>
          <table className="mt-4 w-full text-xs">
            <thead>
              <tr className="border-b border-forest-800/8">
                <th className="pb-2 text-left font-semibold text-muted">#</th>
                <th className="pb-2 text-left font-semibold text-muted">สินค้า</th>
                <th className="pb-2 text-right font-semibold text-muted">รายได้</th>
                <th className="pb-2 text-right font-semibold text-muted">ชิ้น</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-800/6">
              {TOP_PRODUCTS.map((p) => (
                <tr key={p.rank} className="hover:bg-sand-100/30">
                  <td className="py-2 font-bold text-muted">{p.rank}</td>
                  <td className="py-2 font-medium text-ink">{p.name}</td>
                  <td className="py-2 text-right font-bold text-forest-700">฿{p.revenue.toLocaleString()}</td>
                  <td className="py-2 text-right text-muted">{p.units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
