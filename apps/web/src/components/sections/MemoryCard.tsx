import Image from 'next/image';
import { MapPin, Calendar } from 'lucide-react';

// FE-COMP-MEMORY-CARD (SPEC-08) — TASK-009
type MemoryCardProps = {
  title: string;
  body: string;
  photoUrl?: string;
  parkName?: string;
  date?: string;
  badgeLabel?: string;
};

export function MemoryCard({ title, body, photoUrl, parkName, date, badgeLabel }: MemoryCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-forest-800/10 bg-parchment shadow-card">
      {/* 4:3 image */}
      <div className="relative aspect-[4/3] bg-sand-200">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <span className="text-3xl">🏕️</span>
          </div>
        )}
        {badgeLabel && (
          <span className="absolute right-2 top-2 rounded-full bg-gold-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow backdrop-blur-sm">
            {badgeLabel}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-forest-900">{title}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{body}</p>

        {(parkName ?? date) && (
          <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted">
            {parkName && (
              <span className="flex items-center gap-1">
                <MapPin size={11} aria-hidden="true" />
                {parkName}
              </span>
            )}
            {date && (
              <span className="flex items-center gap-1">
                <Calendar size={11} aria-hidden="true" />
                {date}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
