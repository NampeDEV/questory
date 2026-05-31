// ADMIN-008 (TASK_ADMIN) — reusable page header for admin pages
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: never;
  } | {
    label: string;
    href?: never;
    onClick?: () => void;
  };
  className?: string;
};

export function AdminPageHeader({ title, description, action, className }: AdminPageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div>
        <h1 className="font-display text-2xl font-bold text-forest-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action && (
        <div>
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-2 rounded-lg bg-forest-800 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-700"
            >
              {action.label}
            </Link>
          ) : (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-forest-800 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-700"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
