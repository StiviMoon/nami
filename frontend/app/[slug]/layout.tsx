import type { ReactNode } from 'react';

/**
 * Shell del menú público del restaurante: safe-area, gestos táctiles y altura estable en móvil/PWA.
 */
export default function RestaurantSlugLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh min-w-0 touch-manipulation bg-gray-50 [-webkit-tap-highlight-color:transparent]">
      {children}
    </div>
  );
}
