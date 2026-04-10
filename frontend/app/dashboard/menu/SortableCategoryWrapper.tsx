'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode } from 'react';

type HandleBag = Pick<ReturnType<typeof useSortable>, 'listeners' | 'attributes'>;

type Props = {
  id: string;
  children: (handle: HandleBag) => ReactNode;
};

/**
 * Tarjeta de categoría reordenable. El arrastre solo se activa desde el mango
 * (listeners + attributes), no desde toda la tarjeta.
 */
export function SortableCategoryWrapper({ id, children }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    opacity: isDragging ? 0.92 : 1,
    zIndex: isDragging ? 40 : undefined,
    position: 'relative' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        isDragging
          ? 'rounded-2xl shadow-2xl ring-2 ring-primary/35 ring-offset-2 ring-offset-n-50'
          : ''
      }
    >
      {children({ listeners, attributes })}
    </div>
  );
}
