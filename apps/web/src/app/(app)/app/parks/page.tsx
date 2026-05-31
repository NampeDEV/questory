import type { Metadata } from 'next';
import Link from 'next/link';
import { TreePine, MapPin, Star, Search } from 'lucide-react';
import { getParks, getRegions } from '@/lib/api/parks';

export const metadata: Metadata = {
  title: 'อุทยานแห่งชาติ — Questory',
  description: 'สำรวจอุทยานแห่งชาติในประเทศไทยทั้ง 5 ภาค',
};

export const dynamic = 'force-dynamic';

// FE-PAGE-PARKS — National park directory

const DIFFICULTY_COLOR: Record<string, string> = {
  'rgn-01': 'bg-blue-100 text-blue-800',
  'rgn-02': 'bg-green-100 text-green-800',
  'rgn-03': 'bg-orange-100 text-orange-800',
  'rgn-04': 'bg-teal-100 text-teal-800',
  'rgn-05': 'bg-purple-100 text-purple-800',
};

export default async function ParksPage() {
  const [parks, regions] = await Promise.all([
    getParks({ status: 'active' }),
    getRegions(),
  ]);

  const regionMap = Object.fromEntries(regions.map((r) => [r.id, r.nameTh]));

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <TreePine size={20} className="text-forest-700" aria-hidden="true" />
          <h1 className="font-display text-xl font-bold text-forest-900">อุทยานแห่งชาติ</h1>
        </div>
        <p className="mt-1 text-sm text-muted">
          {parks.length} แห่งทั่วประเทศไทย
        </p>
      </div>

      {/* Region filter chips */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        <span className="shrink-0 rounded-full bg-forest-800 px-3 py-1 text-xs font-semibold text-white">
          ทั้งหมด
        </span>
        {regions.map((r) => (
          <span
            key={r.id}
            className="shrink-0 rounded-full border border-forest-800/20 px-3 py-1 text-xs text-muted"
          >
            {r.nameTh}
          </span>
        ))}
      </div>

      {/* Park cards */}
      <div className="space-y-3">
        {parks.map((park) => (
          <Link
            key={park.id}
            href={`/app/parks/${park.id}`}
            className="block rounded-2xl border border-forest-800/10 bg-white p-4 shadow-sm transition-all hover:border-forest-700/30 hover:shadow-md active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              {/* Cover image or placeholder */}
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-forest-800/10">
                {park.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={park.coverImage}
                    alt={park.nameTh}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <TreePine size={24} className="text-forest-600" aria-hidden="true" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{park.nameTh}</p>
                    <p className="truncate text-xs text-muted">{park.nameEn}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${DIFFICULTY_COLOR[park.regionId] ?? 'bg-sand-200 text-ink'}`}>
                    {regionMap[park.regionId] ?? '—'}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-3">
                  {/* Rating */}
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-gold-600">
                    <Star size={11} fill="currentColor" aria-hidden="true" />
                    {park.avgRating.toFixed(1)}
                    <span className="font-normal text-muted">({park.totalReviews.toLocaleString()})</span>
                  </span>

                  {/* Coordinates badge */}
                  <span className="flex items-center gap-1 text-[10px] text-muted">
                    <MapPin size={10} aria-hidden="true" />
                    <span className="font-mono">{park.latitude.toFixed(2)}, {park.longitude.toFixed(2)}</span>
                  </span>
                </div>
              </div>
            </div>

            {park.description && (
              <p className="mt-3 line-clamp-2 text-xs text-muted">{park.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
