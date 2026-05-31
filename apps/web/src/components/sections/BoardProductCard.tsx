import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { BadgePill } from '@/components/ui/BadgePill';
import { formatThb } from '@/lib/utils/format-thb';
import type { BoardTemplate } from '@/types/board';

type BoardProductCardProps = {
  board: BoardTemplate;
};

const categoryLabels: Record<BoardTemplate['category'], string> = {
  starter: 'Starter',
  regional: 'Regional',
  ultimate: 'Ultimate',
  custom: 'Custom',
};

const categoryVariants: Record<BoardTemplate['category'], 'default' | 'rare' | 'legendary' | 'uncommon'> = {
  starter: 'default',
  regional: 'uncommon',
  ultimate: 'legendary',
  custom: 'rare',
};

export function BoardProductCard({ board }: BoardProductCardProps) {
  return (
    <Link href={`/boards/${board.slug}`} className="block" aria-label={`ดูรายละเอียด ${board.name}`}>
      <Card hasHover className="overflow-hidden">
        {/* Cover image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-forest-800">
          <Image
            src={board.coverImageUrl}
            alt={board.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <BadgePill variant={categoryVariants[board.category]}>
              {categoryLabels[board.category]}
            </BadgePill>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-serif text-lg font-bold text-forest-900 line-clamp-1">
            {board.name}
          </h3>
          <p className="mt-1 text-sm text-muted line-clamp-2">{board.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted">
              {board.questCount} ภารกิจ
            </span>
            <span className="font-semibold text-forest-800">
              {board.priceThb.toLocaleString('th-TH')} บาท
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
