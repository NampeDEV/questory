import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { BadgePill } from '@/components/ui/BadgePill';
import { Users, Clock } from 'lucide-react';
import type { Plan } from '@/types/plan';

type PlanCardProps = {
  plan: Plan;
};

const difficultyLabel: Record<Plan['difficulty'], string> = {
  easy: 'เริ่มต้น',
  moderate: 'ปานกลาง',
  challenging: 'ท้าทาย',
};

const difficultyVariant: Record<Plan['difficulty'], 'success' | 'warning' | 'danger'> = {
  easy: 'success',
  moderate: 'warning',
  challenging: 'danger',
};

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <Link href={`/plans/${plan.slug}`} className="block" aria-label={`ดูแผน ${plan.title}`}>
      <Card hasHover className="overflow-hidden">
        {/* Cover */}
        <div className="relative aspect-[16/9] overflow-hidden bg-forest-800">
          <Image
            src={plan.coverImageUrl}
            alt={plan.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-serif font-bold text-forest-900 line-clamp-2">{plan.title}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <BadgePill variant={difficultyVariant[plan.difficulty]}>
              {difficultyLabel[plan.difficulty]}
            </BadgePill>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-muted">
            <span className="flex items-center gap-1">
              <Clock size={14} aria-hidden="true" />
              {plan.durationDays} วัน
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} aria-hidden="true" />
              คัดลอกแล้ว {plan.copiedByCount.toLocaleString()} ครั้ง
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
