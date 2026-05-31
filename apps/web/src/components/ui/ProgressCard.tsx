import Link from 'next/link';
import { ProgressBar } from '@/components/ui/ProgressBar';

// FE-COMP-PROGRESS-CARD (SPEC-08) — TASK-007
type ProgressCardProps = {
  title: string;
  completed: number;
  total: number;
  label?: string;
  href?: string;
};

export function ProgressCard({ title, completed, total, label = 'ภารกิจ', href }: ProgressCardProps) {
  const content = (
    <div className="rounded-2xl border border-forest-800/10 bg-parchment p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <p className="text-sm font-semibold text-forest-900 line-clamp-2">{title}</p>
      <div className="mt-3">
        <ProgressBar value={completed} max={total} isCompleted={completed >= total} />
      </div>
      <p className="mt-2 text-xs text-muted">
        {completed} / {total} {label}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-2xl">
        {content}
      </Link>
    );
  }

  return content;
}
