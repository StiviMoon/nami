import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'pro' | 'nuevo' | 'popular' | 'picante';

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-n-100 text-n-700',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  pro: 'bg-primary/10 text-primary border-primary/20',
  nuevo: 'bg-blue-50 text-blue-700 border-blue-200',
  popular: 'bg-orange-50 text-orange-700 border-orange-200',
  picante: 'bg-red-50 text-red-600 border-red-200',
};

const variantIcons: Partial<Record<BadgeVariant, string>> = {
  pro: '⭐',
  nuevo: '🆕',
  popular: '🔥',
  picante: '🌶️',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  icon?: boolean;
  size?: 'xs' | 'sm' | 'md';
}

export function Badge({ variant = 'default', children, className, icon = false, size = 'sm' }: BadgeProps) {
  const iconEmoji = icon ? variantIcons[variant] : null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        size === 'xs'
          ? 'px-1.5 py-0.5 text-[10px]'
          : size === 'sm'
            ? 'px-2 py-0.5 text-xs'
            : 'px-3 py-1 text-sm',
        variantStyles[variant],
        className
      )}
    >
      {iconEmoji && <span>{iconEmoji}</span>}
      {children}
    </span>
  );
}
