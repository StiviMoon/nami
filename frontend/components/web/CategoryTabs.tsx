'use client';

import { cn } from '@/lib/utils';

export interface CategoryTabItem {
  id: string;
  name: string;
}

interface CategoryTabsProps {
  categories: CategoryTabItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  /** Feed: pills con primary. Menú público: pills oscuros y wrap en desktop. */
  variant?: 'feed' | 'menu';
  className?: string;
  accentBg?: string;
}

export function CategoryTabs({
  categories,
  activeId,
  onSelect,
  variant = 'feed',
  className,
  accentBg,
}: CategoryTabsProps) {
  if (variant === 'feed' && categories.length <= 1) return null;
  if (variant === 'menu' && categories.length === 0) return null;

  const isMenu = variant === 'menu';

  return (
    <div
      className={cn(
        isMenu
          ? 'sticky top-0 z-20 -mx-4 bg-gray-50 px-4 pb-2 pt-4 sm:mx-0 sm:px-0'
          : 'sticky top-0 z-20 border-b border-n-100 bg-white/95 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-sm',
        className
      )}
    >
      <div
        className={cn(
          'flex gap-3 pb-2',
          isMenu
            ? 'flex-wrap max-md:flex-nowrap max-md:overflow-x-auto max-md:scrollbar-hide'
            : 'gap-2 overflow-x-auto py-2.5 px-4 scrollbar-hide'
        )}
        style={isMenu ? undefined : undefined}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={cn(
              'shrink-0 cursor-pointer rounded-full border font-semibold whitespace-nowrap transition-all',
              isMenu
                ? cn(
                    'px-5 py-2 text-sm',
                    activeId === cat.id
                      ? accentBg
                        ? cn('border-transparent text-white shadow-md', accentBg)
                        : 'border-gray-900 bg-gray-900 text-white shadow-md'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                  )
                : cn(
                    'px-3.5 py-2 text-xs sm:text-sm font-medium',
                    activeId === cat.id
                      ? `${accentBg || 'bg-primary'} text-white`
                      : 'bg-n-100 text-n-600 hover:bg-n-200'
                  )
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
