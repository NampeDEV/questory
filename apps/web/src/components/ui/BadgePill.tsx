import { cn } from '@/lib/utils/cn';

// DS-COMP-BADGE rarity colors (SPEC-05)
type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
type BadgePillVariant = BadgeRarity | 'default' | 'success' | 'warning' | 'danger';

type BadgePillProps = {
  variant?: BadgePillVariant;
  children: React.ReactNode;
  className?: string;
};

const variantClasses: Record<BadgePillVariant, string> = {
  default: 'bg-sand-200 text-ink',
  common: 'bg-moss-500 text-white',
  uncommon: 'bg-[#5F9080] text-white',
  rare: 'bg-gold-500 text-forest-950',
  epic: 'bg-[#7B5BA6] text-white',
  legendary: 'bg-gradient-to-r from-gold-500 to-forest-700 text-white',
  success: 'bg-success text-white',
  warning: 'bg-gold-500 text-forest-950',
  danger: 'bg-danger text-white',
};

export function BadgePill({ variant = 'default', children, className }: BadgePillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-3 py-1 text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
