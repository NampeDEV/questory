import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, MapPin, Star, ExternalLink } from 'lucide-react';
import { getParkById, getParkFees, getParkPlaces, getParkReviews } from '@/lib/api/parks';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const park = await getParkById(id);
  return { title: park ? `${park.nameTh} — Admin` : 'อุทยาน — Admin' };
}

const PLACE_CATEGORY_LABEL: Record<string, string> = {
  camping:   'แคมปิ้ง',
  waterfall: 'น้ำตก',
  cave:      'ถ้ำ',
  viewpoint: 'จุดชมวิว',
  trail:     'เส้นทางเดิน',
  forest:    'ป่า',
  lake:      'ทะเลสาบ',
  other:     'อื่นๆ',
};

const PLACE_STATUS_STYLE: Record<string, string> = {
  open:     'bg-success/10 text-success',
  closed:   'bg-danger/10 text-danger',
  seasonal: 'bg-gold-100 text-gold-800',
};

export default async function AdminParkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [park, places, fees, reviews] = await Promise.all([
    getParkById(id),
    getParkPlaces(id),
    getParkFees(id),
    getParkReviews(id),
  ]);

  if (!park) notFound();

  const thaiAdult   = fees.find((f) => f.nationalityType === 'thai'    && f.ageGroup === 'adult');
  const thaiChild   = fees.find((f) => f.nationalityType === 'thai'    && f.ageGroup === 'child');
  const foreignAdult = fees.find((f) => f.nationalityType === 'foreign' && f.ageGroup === 'adult');
  const foreignChild = fees.find((f) => f.nationalityType === 'foreign' && f.ageGroup === 'child');

  return (
    <div className="mx-auto max-w-[1024px] px-4 py-6 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-5 flex items-center gap-2 text-sm text-muted">
        <Link href="/admin/parks" className="flex items-center gap-1 hover:text-ink">
          <ChevronLeft size={14} />
          ฐานข้อมูลอุทยาน
        </Link>
        <span>/</span>
        <span className="text-ink">{park.nameTh}</span>
      </div>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-forest-800/10 px-2 py-0.5 font-mono text-xs font-bold text-forest-800">
              {park.parkCode}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                park.status === 'active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
              }`}
            >
              {park.status === 'active' ? 'เปิดบริการ' : 'ปิดบริการ'}
            </span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-forest-900">{park.nameTh}</h1>
          <p className="text-sm text-muted">{park.nameEn}</p>
        </div>
        <Link
          href={`/admin/parks/${id}/edit`}
          className="rounded-xl bg-forest-800 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-900"
        >
          แก้ไข
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-5 lg:col-span-2">
          {/* Info card */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">ข้อมูลทั่วไป</h2>
            <p className="text-sm leading-relaxed text-ink/80">{park.description || '—'}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="text-forest-600 shrink-0" />
                <span className="font-mono">
                  {park.latitude.toFixed(5)}, {park.longitude.toFixed(5)}
                </span>
              </div>
              {park.mapUrl && (
                <a
                  href={park.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-forest-700 hover:text-forest-900"
                >
                  <ExternalLink size={11} />
                  ดูบน Google Maps
                </a>
              )}
            </div>
          </section>

          {/* Places */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">สถานที่ท่องเที่ยว ({places.length})</h2>
            </div>
            {places.length === 0 ? (
              <p className="text-sm text-muted">ยังไม่มีสถานที่</p>
            ) : (
              <div className="divide-y divide-forest-800/6">
                {places.map((pl) => (
                  <div key={pl.id} className="py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-ink">{pl.placeName}</p>
                        <p className="mt-0.5 text-xs text-muted">{pl.description}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="rounded-full bg-forest-800/8 px-2 py-0.5 text-[10px] font-medium text-forest-700">
                          {PLACE_CATEGORY_LABEL[pl.category] ?? pl.category}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${PLACE_STATUS_STYLE[pl.status] ?? ''}`}>
                          {pl.status === 'open' ? 'เปิด' : pl.status === 'closed' ? 'ปิด' : 'ตามฤดูกาล'}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-muted/60">
                      {pl.latitude.toFixed(5)}, {pl.longitude.toFixed(5)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Reviews */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-ink">รีวิวล่าสุด ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-muted">ยังไม่มีรีวิว</p>
            ) : (
              <div className="divide-y divide-forest-800/6">
                {reviews.map((r) => (
                  <div key={r.id} className="py-3">
                    <div className="flex items-center gap-1 text-gold-500">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={i < Math.floor(r.rating) ? 'text-gold-500' : 'text-forest-800/20'} aria-hidden="true">★</span>
                      ))}
                      <span className="ml-1 text-xs font-semibold text-ink">{r.rating.toFixed(1)}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink/80">{r.reviewText}</p>
                    <p className="mt-1 text-[10px] text-muted">
                      {new Date(r.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Ratings card */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-ink">คะแนนรวม</h2>
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl font-bold text-forest-900">{park.avgRating.toFixed(1)}</span>
              <div>
                <div className="flex text-gold-500">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < Math.floor(park.avgRating) ? 'text-gold-500' : 'text-forest-800/20'} aria-hidden="true">★</span>
                  ))}
                </div>
                <p className="mt-0.5 text-xs text-muted">{park.totalReviews.toLocaleString()} รีวิว</p>
              </div>
            </div>
          </section>

          {/* Fees card */}
          <section className="rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-ink">ค่าธรรมเนียมเข้าอุทยาน</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-forest-800/8">
                  <th className="pb-2 text-left font-medium text-muted">ประเภท</th>
                  <th className="pb-2 text-right font-medium text-muted">ผู้ใหญ่</th>
                  <th className="pb-2 text-right font-medium text-muted">เด็ก</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-800/6">
                <tr>
                  <td className="py-2 font-medium text-ink">คนไทย</td>
                  <td className="py-2 text-right font-bold text-forest-800">{thaiAdult ? `฿${thaiAdult.price}` : '—'}</td>
                  <td className="py-2 text-right font-bold text-forest-800">{thaiChild ? `฿${thaiChild.price}` : '—'}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-ink">ชาวต่างชาติ</td>
                  <td className="py-2 text-right font-bold text-gold-700">{foreignAdult ? `฿${foreignAdult.price}` : '—'}</td>
                  <td className="py-2 text-right font-bold text-gold-700">{foreignChild ? `฿${foreignChild.price}` : '—'}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Cover image preview */}
          {park.coverImage && (
            <section className="overflow-hidden rounded-2xl border border-forest-800/10 bg-white shadow-sm">
              <div
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: `url(${park.coverImage})` }}
                role="img"
                aria-label={park.nameTh}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
