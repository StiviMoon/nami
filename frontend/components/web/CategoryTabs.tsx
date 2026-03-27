'use client';

import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
}

interface CategoryTabsProps {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string) => void;
  accentBg?: string;
}

export function CategoryTabs({ categories, activeId, onSelect, accentBg }: CategoryTabsProps) {
  if (categories.length <= 1) return null;

  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-n-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      <div
        className="flex gap-2 overflow-x-auto py-2.5 px-4 scrollbar-hide"
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              'px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all shrink-0',
              activeId === cat.id
                ? `${accentBg || 'bg-primary'} text-white`
                : 'bg-n-100 text-n-600 hover:bg-n-200'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
