'use client';

import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils/cn';
import type { ButtonHTMLAttributes } from 'react';

// DS-COMP-BUTTON (SPEC-05)
type ButtonVariant = 'primary' | 'gold' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  asChild?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-forest-800 text-white hover:bg-forest-700 focus-visible:ring-forest-700',
  gold: 'bg-gold-500 text-forest-950 hover:bg-gold-400 focus-visible:ring-gold-400',
  secondary:
    'bg-transparent border border-forest-700 text-forest-900 hover:bg-sand-100 focus-visible:ring-forest-700',
  ghost: 'bg-transparent text-forest-900 hover:bg-sand-100 focus-visible:ring-forest-700',
  danger: 'bg-danger text-white hover:opacity-90 focus-visible:ring-danger',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm min-h-[36px]',
  md: 'px-6 py-[14px] text-base min-h-[44px]',
  lg: 'px-8 py-4 text-lg min-h-[52px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  asChild = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : null}
          {children}
        </>
      )}
    </Comp>
  );
}
