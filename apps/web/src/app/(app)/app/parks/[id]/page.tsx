import type { Metadata } from 'next';
import type { ElementType } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronLeft,
  MapPin,
  Star,
  ExternalLink,
  Tent,
  Waves,
  Mountain,
  Eye,
  TreePine,
  Droplets,
} from 'lucide-react';
import { getParkById, getParkFees, getParkPlaces, getParkReviews } from '@/lib/api/parks';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const park = await getParkById(id);
  return {
    title: park ? `${park.nameTh} — Questory` : 'อุทยานแห่งชาติ',
    description: park?.description,
  };
}

// Category icons mapping
const CATEGORY_ICON: Record<string, ElementType> = {
  camping:   Tent,
  waterfall: Droplets,
  cave:      Mountain,
  viewpoint: Eye,
  trail:     TreePine,
  forest:    TreePine,
  lake:      Waves,
  other:     MapPin,
};

const CATEGORY_LABEL: Record<string, string> = {
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

const PLACE_STATUS_LABEL: Record<string, string> = {
  open:     'เปิดบริการ',
  closed:   'ปิดบริการ',
  seasonal: 'ตามฤดูกาล',
};

export default async function ParkDetailPage({
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

  const thaiAdult    = fees.find((f) => f.nationalityType === 'thai'    && f.ageGroup === 'adult');
  const thaiChild    = fees.find((f) => f.nationalityType === 'thai'    && f.ageGroup === 'child');
  const foreignAdult = fees.find((f) => f.nationalityType === 'foreign' && f.ageGroup === 'adult');
  const foreignChild = fees.find((f) => f.nationalityType === 'foreign' && f.ageGroup === 'child');

  return (
    <div className="mx-auto max-w-lg pb-28">
      {/* Hero image */}
      <div className="relative h-56 w-full overflow-hidden bg-forest-800/20">
        {park.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={park.coverImage}
            alt={park.nameTh}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <TreePine size={64} className="text-forest-600/40" aria-hidden="true" />
          </div>
        )}
        {/* Back button */}
        <Link
          href="/app/parks"
          className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
          aria-label="ย้อนกลับ"
        >
          <ChevronLeft size={18} />
        </Link>
        {/* Status badge */}
        <span
          className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${
            park.status === 'active' ? 'bg-success/80 text-white' : 'bg-danger/80 text-white'
          }`}
        >
          {park.status === 'active' ? 'เปิดบริการ' : 'ปิดบริการ'}
        </span>
      </div>

      <div className="px-4 pt-5">
        {/* Park identity */}
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded bg-forest-800/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-forest-700">
            {park.parkCode}
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold text-forest-900">{park.nameTh}</h1>
        <p className="text-sm text-muted">{park.nameEn}</p>

        {/* Rating row */}
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-gold-500" fill="currentColor" aria-hidden="true" />
            <span className="text-sm font-bold text-ink">{park.avgRating.toFixed(1)}</span>
            <span className="text-xs text-muted">({park.totalReviews.toLocaleString()} รีวิว)</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted">
            <MapPin size={11} aria-hidden="true" />
            <span className="font-mono">{park.latitude.toFixed(4)}, {park.longitude.toFixed(4)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex gap-2">
          {park.mapUrl && (
            <a
              href={park.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-forest-800/20 py-2.5 text-sm font-medium text-forest-700 hover:bg-forest-800/5"
            >
              <ExternalLink size={14} aria-hidden="true" />
              ดูแผนที่
            </a>
          )}
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-forest-800 py-2.5 text-sm font-semibold text-white hover:bg-forest-900"
          >
            <Star size={14} aria-hidden="true" />
            บันทึกไว้ดู
          </button>
        </div>

        {/* Description */}
        {park.description && (
          <div className="mt-5">
            <h2 className="mb-2 text-sm font-semibold text-ink">เกี่ยวกับอุทยาน</h2>
            <p className="text-sm leading-relaxed text-ink/80">{park.description}</p>
          </div>
        )}

        {/* Entry fees */}
        {fees.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">ค่าธรรมเนียมเข้าอุทยาน</h2>
            <div className="overflow-hidden rounded-2xl border border-forest-800/10 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-forest-800/8 bg-sand-100/60">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted">ประเภท</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted">ผู้ใหญ่</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted">เด็ก</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-800/6">
                  <tr>
                    <td className="px-4 py-2.5 text-sm font-medium text-ink">คนไทย</td>
                    <td className="px-4 py-2.5 text-right font-bold text-forest-800">
                      {thaiAdult ? `฿${thaiAdult.price}` : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-forest-800">
                      {thaiChild ? `฿${thaiChild.price}` : '—'}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-sm font-medium text-ink">ชาวต่างชาติ</td>
                    <td className="px-4 py-2.5 text-right font-bold text-gold-700">
                      {foreignAdult ? `฿${foreignAdult.price}` : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-gold-700">
                      {foreignChild ? `฿${foreignChild.price}` : '—'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Places */}
        {places.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">สถานที่ท่องเที่ยว ({places.length} แห่ง)</h2>
            <div className="space-y-2.5">
              {places.map((pl) => {
                const Icon = CATEGORY_ICON[pl.category] ?? MapPin;
                return (
                  <div
                    key={pl.id}
                    className="flex items-start gap-3 rounded-2xl border border-forest-800/10 bg-white p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-800/8">
                      <Icon size={18} className="text-forest-700" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-ink">{pl.placeName}</p>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${PLACE_STATUS_STYLE[pl.status] ?? ''}`}>
                          {PLACE_STATUS_LABEL[pl.status] ?? pl.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted">{pl.description}</p>
                      <span className="mt-1 inline-block rounded-full bg-sand-200/60 px-2 py-0.5 text-[10px] font-medium text-muted">
                        {CATEGORY_LABEL[pl.category] ?? pl.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">รีวิว ({reviews.length})</h2>
            <div className="space-y-3">
              {reviews.slice(0, 5).map((r) => (
                <div key={r.id} className="rounded-2xl border border-forest-800/10 bg-white p-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={i < Math.floor(r.rating) ? 'text-gold-500' : 'text-forest-800/20'}
                        aria-hidden="true"
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-1 text-xs font-semibold text-ink">{r.rating.toFixed(1)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink/80">{r.reviewText}</p>
                  <p className="mt-1.5 text-[10px] text-muted">
                    {new Date(r.createdAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
