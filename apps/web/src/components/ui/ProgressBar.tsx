'use client';

// DS-COMP-PROGRESS (SPEC-05)
type ProgressBarProps = {
  value: number;
  max: number;
  label?: string;
  size?: 'sm' | 'lg';
  isCompleted?: boolean;
};

export function ProgressBar({ value, max, label, size = 'sm', isCompleted = false }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const height = size === 'sm' ? 'h-2' : 'h-3';
  const fillColor = isCompleted || percentage >= 100 ? 'bg-gold-500' : 'bg-forest-700';

  return (
    <div className="w-full">
      {label && (
        <p className="mb-1 text-sm text-muted">
          {label}
        </p>
      )}
      <div
        className={`w-full overflow-hidden rounded-pill bg-sand-200 ${height}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={`h-full rounded-pill transition-all duration-[600ms] ease-out ${fillColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
