import Image from 'next/image';
import Link from 'next/link';
import { Copy } from 'lucide-react';
import type { MissionCategory, MissionDifficulty } from '@/types/mission';

// FE-COMP-QUEST-CARD (SPEC-08) — TASK-010
type QuestCardProps = {
  id: string;
  slug: string;
  name: string;
  coverImageUrl: string;
  parkName: string;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  copiedCount: number;
};

const DIFFICULTY_LABEL: Record<MissionDifficulty, string> = {
  easy:   'ง่าย',
  medium: 'ปานกลาง',
  hard:   'ยาก',
};

const CATEGORY_LABEL: Record<MissionCategory, string> = {
  mountain:  'ภูเขา',
  waterfall: 'น้ำตก',
  marine:    'ทะเล',
  forest:    'ป่า',
};

export function QuestCard({ slug, name, coverImageUrl, parkName, category, difficulty, copiedCount }: QuestCardProps) {
  return (
    <Link
      href={`/quests/${slug}`}
      className="group block overflow-hidden rounded-2xl border border-forest-800/10 bg-parchment shadow-card transition-shadow hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
    >
      {/* Cover image */}
      <div className="relative h-40 overflow-hidden bg-sand-200">
        <Image
          src={coverImageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Pills */}
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-medium text-forest-800">
            {CATEGORY_LABEL[category]}
          </span>
          <span className="rounded-full bg-sand-200 px-2 py-0.5 text-[10px] font-medium text-ink">
            {DIFFICULTY_LABEL[difficulty]}
          </span>
        </div>

        <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-forest-900">{name}</h3>
        <p className="mt-0.5 text-[11px] text-muted">{parkName}</p>

        <p className="mt-3 flex items-center gap-1 text-[11px] text-muted">
          <Copy size={11} aria-hidden="true" />
          คัดลอกแผน · {copiedCount.toLocaleString('th-TH')} ครั้ง
        </p>
      </div>
    </Link>
  );
}
