import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getParks } from '@/lib/api/parks';

export const metadata: Metadata = { title: 'ฐานข้อมูลอุทยาน — Questory Admin' };
export const dynamic = 'force-dynamic';

// ADMIN-044 — National Parks list (ThaiPark DB Design)

const REGION_LABEL: Record<string, string> = {
  'rgn-01': 'ภาคเหนือ',
  'rgn-02': 'ภาคกลาง',
  'rgn-03': 'ภาคอีสาน',
  'rgn-04': 'ภาคตะวันออก',
  'rgn-05': 'ภาคใต้',
};

function StarRating({ value }: { value: number }) {
  const full = Math.floor(value);
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < full ? 'text-gold-500' : 'text-forest-800/20'}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-xs font-semibold text-ink">{value.toFixed(1)}</span>
    </span>
  );
}

function ParkStatusBadge({ status }: { status: 'active' | 'inactive' }) {
  const styles =
    status === 'active'
      ? 'bg-success/10 text-success'
      : 'bg-danger/10 text-danger';
  const label = status === 'active' ? 'เปิดบริการ' : 'ปิดบริการ';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${styles}`}>
      {label}
    </span>
  );
}

export default async function ParksPage() {
  const parks = await getParks();

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      <AdminPageHeader
        title="ฐานข้อมูลอุทยาน"
        description={`จัดการอุทยานแห่งชาติทั้งหมด (${parks.length} แห่ง)`}
        action={{ label: '+ เพิ่มอุทยาน', href: '/admin/parks/new' }}
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest-800/8 bg-sand-100/60">
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted">รหัส</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted">ชื่ออุทยาน</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold text-muted md:table-cell">ภาค</th>
                <th className="hidden px-4 py-3 text-center text-xs font-semibold text-muted lg:table-cell">คะแนน</th>
                <th className="hidden px-4 py-3 text-center text-xs font-semibold text-muted lg:table-cell">รีวิว</th>
                <th className="hidden px-4 py-3 text-center text-xs font-semibold text-muted xl:table-cell">พิกัด</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted">สถานะ</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-800/6">
              {parks.map((p) => (
                <tr key={p.id} className="hover:bg-sand-100/30">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-forest-700">
                    {p.parkCode}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-ink">{p.nameTh}</p>
                    <p className="text-[11px] text-muted">{p.nameEn}</p>
                  </td>
                  <td className="hidden px-4 py-3.5 text-xs text-muted md:table-cell">
                    {REGION_LABEL[p.regionId] ?? p.regionId}
                  </td>
                  <td className="hidden px-4 py-3.5 text-center lg:table-cell">
                    <StarRating value={p.avgRating} />
                  </td>
                  <td className="hidden px-4 py-3.5 text-center text-xs text-muted lg:table-cell">
                    {p.totalReviews.toLocaleString()}
                  </td>
                  <td className="hidden px-4 py-3.5 text-center xl:table-cell">
                    <span className="font-mono text-[10px] text-muted">
                      {p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <ParkStatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/parks/${p.id}`}
                        className="text-xs font-medium text-forest-700 hover:text-forest-900"
                      >
                        ดูข้อมูล
                      </Link>
                      <Link
                        href={`/admin/parks/${p.id}/edit`}
                        className="text-xs font-medium text-gold-700 hover:text-gold-900"
                      >
                        แก้ไข
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {parks.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-muted">
                    ยังไม่มีข้อมูลอุทยาน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
