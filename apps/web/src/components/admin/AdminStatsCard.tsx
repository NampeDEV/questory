// ADMIN-004 (TASK_ADMIN) — reusable KPI stats card
import { cn } from '@/lib/utils/cn';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type TrendDirection = 'up' | 'down' | 'neutral';

type AdminStatsCardProps = {
  label: string;
  /** Accepts string or a client component like AdminCountUp */
  value: React.ReactNode;
  trend?: string;
  trendDirection?: TrendDirection;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
};

export function AdminStatsCard({
  label,
  value,
  trend,
  trendDirection = 'neutral',
  icon,
  className,
}: AdminStatsCardProps) {
  const TrendIcon =
    trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus;

  const trendColor =
    trendDirection === 'up'
      ? 'text-success'
      : trendDirection === 'down'
        ? 'text-danger'
        : 'text-muted';

  return (
    <div
      className={cn(
        'rounded-2xl border border-forest-800/10 bg-white p-5 shadow-sm',
        className,
      )}
    >
      {/* Icon + info button row */}
      <div className="flex items-start justify-between">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sand-100 text-forest-700">
            {icon}
          </div>
        )}
        <button
          type="button"
          aria-label="ข้อมูลเพิ่มเติม"
          className="text-muted hover:text-ink"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6.5" stroke="currentColor" />
            <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Value */}
      <p className="mt-3 text-2xl font-bold text-ink">{value}</p>

      {/* Label */}
      <p className="mt-0.5 text-xs text-muted">{label}</p>

      {/* Trend */}
      {trend && (
        <div className={cn('mt-2 flex items-center gap-1 text-xs font-medium', trendColor)}>
          <TrendIcon size={12} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
