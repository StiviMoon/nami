import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, emoji, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {Icon && (
        <div className="mb-4 rounded-2xl bg-n-50 p-5">
          <Icon className="h-10 w-10 text-n-300" strokeWidth={1.5} />
        </div>
      )}
      {emoji && !Icon && (
        <div className="mb-4 text-5xl">{emoji}</div>
      )}
      <h3 className="font-display text-lg font-semibold text-n-800">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-n-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
