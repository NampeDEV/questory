import { cn } from '@/lib/utils/cn';
import type { HTMLAttributes } from 'react';

// DS-COMP-CARD (SPEC-05)
type CardProps = HTMLAttributes<HTMLDivElement> & {
  hasHover?: boolean;
};

export function Card({ hasHover = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-forest-800/8 shadow-card',
        hasHover && 'cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lift',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
