'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { use, useState, useRef, useCallback } from 'react';
import { ArrowLeft, MapPin, Plus, Minus } from 'lucide-react';
import { getMenuCardStyleClasses, getThemeClasses, getCustomThemeStyle, hasCustomColors, getItemBadge } from '@/lib/restaurant-theme';
import { motion } from 'framer-motion';
import { PageTransition, SlideIn, StaggerContainer, StaggerItem, FadeIn } from '@/components/motion';
import { Badge } from '@/components/ui/badge';
import { Instagram, Facebook, Clock } from 'lucide-react';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { CartDrawer } from '@/components/web/CartDrawer';
import { CartFloatingButton } from '@/components/web/CartFloatingButton';
import { CategoryTabs } from '@/components/web/CategoryTabs';
import { FavoriteButton } from '@/components/web/FavoriteButton';
import { ShareButton } from '@/components/web/ShareButton';

export default function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Una sola request: restaurant + menu combinados
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.restaurants.bySlug(slug),
    queryFn: () => api.get(`/api/restaurants/${slug}?includeMenu=true`),
    select: (res) => res.data as { restaurant: any; menu: any[] },
  });

  const restaurant = data?.restaurant;
  const categories = data?.menu ?? [];

  const theme = getThemeClasses(restaurant?.themePreset);
  const cardStyleClass = getMenuCardStyleClasses(restaurant?.menuStyle);

  const scrollToCategory = useCallback((id: string) => {
    setActiveCategory(id);
    categoryRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-n-50">
        <Skeleton className="h-56 w-full rounded-none" />
        <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-n-100 space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <SkeletonText lines={2} />
          </div>
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <EmptyState
        emoji="🍽️"
        title="Restaurante no encontrado"
        description="Este restaurante no existe o fue eliminado."
        action={
          <Link href="/feed" className="text-primary font-semibold hover:underline">
            Volver al feed
          </Link>
        }
        className="min-h-screen"
      />
    );
  }

  const addToCart = (item: { id: string; name: string; price: string | number }) => {
    cart.addItem(
      { id: item.id, restaurantId: restaurant.id, name: item.name, price: Number(item.price) },
      restaurant.name,
      restaurant.whatsapp
    );
  };

  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <PageTransition>
      <main className="min-h-screen bg-n-50" style={getCustomThemeStyle(restaurant)}>
        {/* Cover banner */}
        <div
          className={`h-56 md:h-64 bg-gradient-to-br ${theme.header} relative overflow-hidden`}
          style={hasCustomColors(restaurant)
            ? { backgroundImage: `linear-gradient(135deg, ${restaurant.secondaryColor || restaurant.primaryColor}, ${restaurant.primaryColor})` }
            : undefined}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
          {restaurant.logoUrl && (
            <div className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none">
              <img
                src={restaurant.logoUrl}
                alt={`Logo de ${restaurant.name}`}
                className="w-24 h-24 md:w-28 md:h-28 rounded-3xl object-cover border-4 border-white/85 shadow-xl bg-white/90"
              />
            </div>
          )}
          {restaurant.bannerText && (
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center z-[3] px-4">
              <p className="text-white text-2xl md:text-3xl font-display font-bold text-center drop-shadow-lg px-4">
                {restaurant.bannerText}
              </p>
            </div>
          )}
          <Link
            href="/feed"
            className="cursor-pointer absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2.5 hover:bg-white transition-colors shadow-sm z-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <FavoriteButton restaurantId={restaurant.id} size="sm" />
            <ShareButton
              url={typeof window !== 'undefined' ? window.location.href : `/${slug}`}
              title={restaurant.name}
              text={`Mira ${restaurant.name} en ÑAMI`}
            />
          </div>
        </div>

        {/* Info card */}
        <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-10">
          <SlideIn direction="up">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-n-100">
              <div className="flex items-start gap-4">
                {restaurant.logoUrl && (
                  <img
                    src={restaurant.logoUrl}
                    alt={`Logo de ${restaurant.name}`}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-n-100 shadow-sm shrink-0 -mt-10 bg-white"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-n-900 truncate">
                      {restaurant.name}
                    </h1>
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      {restaurant.plan === 'PRO' && <Badge variant="pro" icon size="xs">Pro</Badge>}
                      {restaurant.isClosed ? (
                        <Badge variant="danger" size="xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          Cerrado
                        </Badge>
                      ) : (
                        <Badge variant="success" size="xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Abierto
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-n-500">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="text-sm truncate">{restaurant.address}</span>
                  </div>
                  {restaurant.description && (
                    <p className="text-n-500 mt-3 text-sm leading-relaxed">{restaurant.description}</p>
                  )}
                  {(restaurant.instagram || restaurant.tiktok || restaurant.facebook) && (
                    <div className="flex items-center gap-3 mt-3">
                      {restaurant.instagram && (
                        <a href={`https://instagram.com/${restaurant.instagram}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-n-400 hover:text-pink-500 transition-colors">
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {restaurant.tiktok && (
                        <a href={`https://tiktok.com/@${restaurant.tiktok}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-n-400 hover:text-n-900 transition-colors">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.82.11v-3.5a6.37 6.37 0 00-.82-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.35 6.34 6.34 0 006.34-6.34V8.93a8.22 8.22 0 003.76.92V6.4s-.01.29 0 .29z"/></svg>
                        </a>
                      )}
                      {restaurant.facebook && (
                        <a href={`https://facebook.com/${restaurant.facebook}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-n-400 hover:text-blue-600 transition-colors">
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Horarios */}
              {restaurant.schedule && (() => {
                try {
                  const schedule = JSON.parse(restaurant.schedule);
                  const days = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
                  const dayLabels: Record<string, string> = { lun: 'Lun', mar: 'Mar', mie: 'Mié', jue: 'Jue', vie: 'Vie', sab: 'Sáb', dom: 'Dom' };
                  const hasAny = days.some((d) => schedule[d]);
                  if (!hasAny) return null;
                  return (
                    <div className="mt-4 pt-4 border-t border-n-100">
                      <div className="flex items-center gap-2 text-sm font-medium text-n-700 mb-2">
                        <Clock className="w-4 h-4" />
                        Horarios
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                        {days.map((d) => (
                          <div key={d} className="flex justify-between bg-n-50 rounded-lg px-2.5 py-1.5">
                            <span className="font-medium text-n-600">{dayLabels[d]}</span>
                            <span className="text-n-400">{schedule[d] || 'Cerrado'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } catch { return null; }
              })()}
            </div>
          </SlideIn>
        </div>

        {/* Category tabs */}
        <div className="max-w-4xl mx-auto mt-6">
          <CategoryTabs
            categories={categories.map((c: any) => ({ id: c.id, name: c.name }))}
            activeId={activeCategory}
            onSelect={scrollToCategory}
            accentBg={theme.accentBg}
          />
        </div>

        {/* Menú */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          {categories.length === 0 ? (
            <EmptyState
              emoji="📂"
              title="Sin menú disponible"
              description="Este restaurante aún no ha publicado su menú."
            />
          ) : (
            <div className="space-y-8">
              {categories.map((cat: any) => (
                <div
                  key={cat.id}
                  ref={(el) => { categoryRefs.current[cat.id] = el; }}
                  className="scroll-mt-16"
                >
                  <FadeIn>
                    <h3 className="font-display font-semibold text-lg mb-4 text-n-700">{cat.name}</h3>
                  </FadeIn>
                  <StaggerContainer className={restaurant.menuLayout === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
                    {cat.items.map((item: any) => {
                      const inCart = cart.items.find((c) => c.id === item.id);
                      const itemBadge = getItemBadge(item.badge);
                      const isGrid = restaurant.menuLayout === 'grid';

                      return (
                        <StaggerItem key={item.id}>
                          <div className={`${cardStyleClass} ${isGrid ? 'flex flex-col min-h-[252px] p-3 sm:p-4' : 'flex gap-4'} transition-all`}>
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                loading="lazy"
                                className={isGrid ? 'w-full h-28 sm:h-32 rounded-xl object-cover' : 'w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shrink-0'}
                              />
                            )}
                            <div className={`flex-1 min-w-0 ${isGrid ? 'mt-3 flex flex-col' : ''}`}>
                              {itemBadge && (
                                <span className={`mb-1.5 inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full border px-2 py-1 text-[10px] font-semibold leading-none ${itemBadge.color}`}>
                                  {itemBadge.emoji} {itemBadge.label}
                                </span>
                              )}
                              <h4 className={`font-semibold text-n-800 ${isGrid ? 'text-sm sm:text-base leading-tight line-clamp-2 pr-1' : ''}`}>
                                {item.name}
                              </h4>
                              {item.description && (
                                <p className={`text-sm text-n-400 mt-1 ${isGrid ? 'line-clamp-2 min-h-10' : 'line-clamp-2'}`}>
                                  {item.description}
                                </p>
                              )}
                              <p className={`${hasCustomColors(restaurant) ? 'text-r-primary' : theme.accent} font-bold mt-2 ${isGrid ? 'text-lg' : ''}`}>
                                {formatPrice(Number(item.price))}
                              </p>
                            </div>
                            <div className={`flex items-center shrink-0 ${isGrid ? 'mt-3 justify-end pt-1' : ''}`}>
                              {inCart ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => cart.decrease(item.id)}
                                    className="cursor-pointer w-8 h-8 rounded-full bg-n-100 flex items-center justify-center hover:bg-n-200 transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="font-bold w-6 text-center text-sm">{inCart.quantity}</span>
                                  <button
                                    onClick={() => cart.increase(item.id)}
                                    className={`cursor-pointer w-8 h-8 rounded-full ${hasCustomColors(restaurant) ? 'bg-r-primary' : theme.accentBg} text-white flex items-center justify-center ${theme.accentHover} transition-colors`}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => addToCart(item)}
                                  className={`cursor-pointer w-10 h-10 rounded-full ${hasCustomColors(restaurant) ? 'bg-r-primary' : theme.accentBg} text-white flex items-center justify-center ${theme.accentHover} transition-colors shadow-sm`}
                                >
                                  <Plus className="w-5 h-5" />
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                </div>
              ))}
            </div>
          )}
        </div>

        <CartFloatingButton
          visible={totalItems > 0 && !cartOpen}
          totalItems={totalItems}
          total={cart.total()}
          onClick={() => setCartOpen(true)}
          accentBg={theme.accentBg}
          accentHover={theme.accentHover}
        />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          restaurantSlug={slug}
          themeAccent={theme.accent}
          themeAccentBg={theme.accentBg}
          themeAccentHover={theme.accentHover}
        />
      </main>
    </PageTransition>
  );
}
