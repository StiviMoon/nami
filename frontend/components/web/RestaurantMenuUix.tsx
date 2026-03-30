'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
import { Instagram, Facebook } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { formatTodayHoursLabel, type WeekSchedule } from '@/lib/uix-schedule';
import { ProductImageCarousel } from '@/components/uix/ProductImageCarousel';
import { CartModal, CartFloatingBarUix } from '@/components/uix/CartModal';
import { ClosedStoreModal } from '@/components/web/ClosedStoreModal';
import { FavoriteButton } from '@/components/web/FavoriteButton';
import { ShareButton } from '@/components/web/ShareButton';
import { Badge } from '@/components/ui/badge';
import { getItemBadge } from '@/lib/restaurant-theme';

const ACCENT = '#E85D04';

type MenuCategory = {
  id: string;
  name: string;
  items: Array<{
    id: string;
    name: string;
    description?: string | null;
    price: string | number;
    imageUrl?: string | null;
    badge?: string | null;
    isAvailable: boolean;
  }>;
};

type Restaurant = {
  id: string;
  name: string;
  address?: string | null;
  description?: string | null;
  coverUrl?: string | null;
  isClosed: boolean;
  plan: string;
  whatsapp?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  facebook?: string | null;
};

type Props = {
  restaurant: Restaurant;
  categories: MenuCategory[];
  slug: string;
  schedule: WeekSchedule | null;
};

export function RestaurantMenuUix({ restaurant, categories, slug, schedule }: Props) {
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');
  const [closedModalOpen, setClosedModalOpen] = useState(false);
  const open = !restaurant.isClosed;

  useEffect(() => {
    if (restaurant.isClosed) setClosedModalOpen(true);
  }, [restaurant.isClosed]);

  useEffect(() => {
    if (categories[0]?.id) setActiveCategory(categories[0].id);
  }, [categories]);

  const addToCart = (item: { id: string; name: string; price: string | number }) => {
    cart.addItem(
      { id: item.id, restaurantId: restaurant.id, name: item.name, price: Number(item.price) },
      restaurant.name,
      restaurant.whatsapp || ''
    );
  };

  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const todayHours = formatTodayHoursLabel(schedule);
  const activeItems =
    categories.find((c) => c.id === activeCategory)?.items || [];

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `/${slug}`;

  return (
    <div className="min-h-screen bg-gray-50 lg:flex font-sans text-gray-900 antialiased">
      <ClosedStoreModal
        isOpen={closedModalOpen}
        onClose={() => setClosedModalOpen(false)}
        restaurantName={restaurant.name}
        schedule={schedule ?? undefined}
      />

      <aside className="hidden lg:flex flex-col w-[400px] h-screen bg-white sticky top-0 border-r border-gray-100 p-10 overflow-y-auto">
        <Link
          href="/feed"
          className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase mb-10 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft size={16} /> Volver
        </Link>
        <div
          className={`h-48 rounded-[2rem] overflow-hidden mb-6 shadow-xl ${!open ? 'grayscale' : ''}`}
        >
          {restaurant.coverUrl ? (
            <img src={restaurant.coverUrl} alt={restaurant.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center text-5xl opacity-40">
              🍽
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${open ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            {open ? 'Abierto ahora' : 'Cerrado'}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-4xl font-black leading-none tracking-tight text-gray-900">{restaurant.name}</h1>
          {restaurant.plan === 'PRO' && (
            <Badge variant="pro" icon size="xs">
              Pro
            </Badge>
          )}
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
          {restaurant.address && (
            <div className="flex items-start gap-3 text-xs font-bold text-gray-400">
              <MapPin size={16} className="shrink-0" style={{ color: ACCENT }} /> {restaurant.address}
            </div>
          )}
          <div className="flex items-start gap-3 text-xs font-bold text-gray-400">
            <Clock size={16} className="shrink-0" style={{ color: ACCENT }} /> {todayHours}
          </div>
        </div>
        {(restaurant.instagram || restaurant.tiktok || restaurant.facebook) && (
          <div className="flex items-center gap-3 mt-4">
            {restaurant.instagram && (
              <a
                href={`https://instagram.com/${restaurant.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {restaurant.tiktok && (
              <a
                href={`https://tiktok.com/@${restaurant.tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.82.11v-3.5a6.37 6.37 0 00-.82-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.35 6.34 6.34 0 006.34-6.34V8.93a8.22 8.22 0 003.76.92V6.4s-.01.29 0 .29z" />
                </svg>
              </a>
            )}
            {restaurant.facebook && (
              <a
                href={`https://facebook.com/${restaurant.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
        <nav className="mt-10 space-y-2 flex-1 min-h-0 overflow-y-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full text-left px-5 py-3 rounded-xl text-[11px] font-black uppercase transition-all cursor-pointer ${
                activeCategory === cat.id ? 'bg-orange-50 text-[#E85D04]' : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-8 flex items-center gap-2 border-t border-gray-100">
          <FavoriteButton restaurantId={restaurant.id} />
          <ShareButton url={shareUrl} title={restaurant.name} text={`Mira ${restaurant.name} en ÑAMI`} />
        </div>
      </aside>

      <div className="lg:hidden w-full">
        <div className="h-48 relative overflow-hidden">
          {restaurant.coverUrl ? (
            <img
              src={restaurant.coverUrl}
              alt=""
              className={`w-full h-full object-cover ${!open ? 'grayscale' : ''}`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100" />
          )}
          <Link
            href="/feed"
            className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white"
          >
            <ArrowLeft className="text-white" />
          </Link>
          <div className="absolute top-4 right-4 flex gap-2">
            <FavoriteButton restaurantId={restaurant.id} size="sm" />
            <ShareButton url={shareUrl} title={restaurant.name} text={`Mira ${restaurant.name} en ÑAMI`} />
          </div>
        </div>
        <div className="bg-white p-6 -mt-8 relative rounded-t-[2.5rem] shadow-xl">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-3xl font-black leading-none text-gray-900">{restaurant.name}</h1>
            {restaurant.plan === 'PRO' && (
              <Badge variant="pro" icon size="xs">
                Pro
              </Badge>
            )}
          </div>
          {restaurant.address && (
            <div className="mt-3 text-[10px] font-black uppercase text-gray-400">
              <MapPin size={12} className="inline mr-1" style={{ color: ACCENT }} />
              {restaurant.address}
            </div>
          )}
        </div>
        <div className="sticky top-0 z-30 bg-gray-50/90 backdrop-blur-xl py-4 flex gap-2 overflow-x-auto scrollbar-hide px-6 border-b border-gray-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id ? 'bg-[#E85D04] text-white' : 'bg-white text-gray-400 border border-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 pb-32 space-y-6 w-full min-w-0">
        {activeItems.map((item) => {
          const photos = [item.imageUrl].filter(Boolean) as string[];
          const itemBadge = getItemBadge(item.badge);
          return (
            <article
              key={item.id}
              className={`bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden flex flex-col sm:flex-row shadow-sm hover:shadow-md transition-all ${
                !item.isAvailable ? 'opacity-60' : ''
              }`}
            >
              <div className="h-56 sm:w-60 shrink-0 relative">
                <ProductImageCarousel photos={photos} itemName={item.name} />
              </div>
              <div className="p-6 flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h4 className="font-black text-lg text-gray-900">{item.name}</h4>
                  </div>
                  {itemBadge && (
                    <span
                      className={`mb-2 inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full border px-2 py-1 text-[10px] font-semibold leading-none ${itemBadge.color}`}
                    >
                      {itemBadge.emoji} {itemBadge.label}
                    </span>
                  )}
                  {item.description && (
                    <p className="text-gray-500 text-xs italic leading-snug">&quot;{item.description}&quot;</p>
                  )}
                </div>
                <div className="mt-4 flex justify-between items-center gap-3">
                  <span className="font-black" style={{ color: ACCENT }}>
                    {formatPrice(Number(item.price))}
                  </span>
                  <button
                    type="button"
                    disabled={!item.isAvailable}
                    onClick={() => addToCart(item)}
                    className={`px-5 py-2.5 text-white text-[10px] font-black rounded-xl uppercase tracking-widest transition-all cursor-pointer ${
                      !item.isAvailable ? 'bg-gray-200 text-gray-400' : 'bg-gray-900 hover:bg-[#E85D04]'
                    }`}
                  >
                    {!item.isAvailable ? 'Agotado' : 'Añadir'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </main>

      <CartFloatingBarUix cartCount={totalItems} total={cart.total()} onOpen={() => setCartOpen(true)} />
      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        restaurantName={restaurant.name}
        restaurantSlug={slug}
      />
    </div>
  );
}
