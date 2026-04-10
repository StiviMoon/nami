'use client';

import { Settings2, Plus } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import { getItemBadge } from '@/lib/restaurant-theme';
import { hasCustomization } from '@/lib/menu-customization';
import { ProductImageCarousel } from '@/components/uix/ProductImageCarousel';

export type PublicMenuItem = {
  id: string;
  name: string;
  description?: string | null;
  price: string | number;
  imageUrl?: string | null;
  badge?: string | null;
  isAvailable: boolean;
  customization?: unknown;
};

type Props = {
  item: PublicMenuItem;
  onAdd: (item: PublicMenuItem) => void;
  /** Clases del contenedor (borde, radio, sombra) desde getMenuCardStyleClasses */
  cardClassName?: string;
};

export function RestaurantMenuItemRow({ item, onAdd, cardClassName }: Props) {
  const photos = [item.imageUrl].filter(Boolean) as string[];
  const itemBadge = getItemBadge(item.badge);
  const personalized = hasCustomization(item.customization);

  return (
    <article
      className={cn(
        'flex gap-4 transition-shadow',
        cardClassName ||
          'rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md',
        !item.isAvailable && 'opacity-55'
      )}
    >
      <div className="flex min-w-0 grow flex-col justify-between">
        <div>
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-bold leading-tight text-gray-900">{item.name}</h3>
            {personalized && (
              <Settings2 size={15} className="mt-0.5 shrink-0 text-gray-400" aria-hidden />
            )}
          </div>
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            {personalized && (
              <span className="rounded-full bg-n-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-r-primary ring-1 ring-inset ring-r-primary/25">
                Personalizable
              </span>
            )}
            {itemBadge && (
              <span
                className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-none ${itemBadge.color}`}
              >
                {itemBadge.emoji} {itemBadge.label}
              </span>
            )}
          </div>
          {item.description && (
            <p className="mb-2 line-clamp-2 pr-1 text-sm text-gray-500">{item.description}</p>
          )}
        </div>
        <span className="font-bold text-r-primary">{formatPrice(Number(item.price))}</span>
      </div>

      <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
        <div className="h-full w-full overflow-hidden rounded-xl bg-stone-100 ring-1 ring-black/5">
          <ProductImageCarousel photos={photos} itemName={item.name} />
        </div>
        <button
          type="button"
          disabled={!item.isAvailable}
          onClick={() => onAdd(item)}
          className={cn(
            'absolute -bottom-2 -right-2 rounded-full border border-gray-100 bg-white p-2 shadow-lg transition-colors',
            !item.isAvailable
              ? 'cursor-not-allowed text-gray-300'
              : 'cursor-pointer text-r-primary hover:bg-gray-50'
          )}
          aria-label={!item.isAvailable ? 'Agotado' : personalized ? 'Personalizar' : 'Añadir al carrito'}
        >
          <Plus size={20} strokeWidth={3} />
        </button>
      </div>
    </article>
  );
}
