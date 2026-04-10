'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import Link from 'next/link';
import { Search, MapPin as MapPinIcon, Heart, Clock, Sparkles } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/hooks/useCart';
import { RestaurantCard } from '@/components/web/RestaurantCard';
import { FeedSkeleton } from '@/components/web/FeedSkeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { StaggerContainer, PageTransition } from '@/components/motion';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_EMOJIS: Record<string, string> = {
  'Comida Rápida': '🍔',
  'Corrientazo': '🍛',
  'Hamburguesas': '🍔',
  'Pizza': '🍕',
  'Panadería': '🥐',
  'Postres': '🍰',
  'Asados': '🥩',
  'Comida Saludable': '🥗',
  'Sushi': '🍣',
  'Heladería': '🍦',
  'Menú del día': '🍽',
  'Variado / De todo': '✨',
  'Restaurante familiar': '👨‍👩‍👧',
  'Café': '☕',
  'Mariscos': '🦐',
  'Comida Italiana': '🍝',
  'Árabe': '🥙',
  'Vegetariano': '🥦',
};

function getCategoryEmoji(cat: string): string {
  return CATEGORY_EMOJIS[cat] ?? '🍴';
}

export default function FeedPage() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const geo = useGeolocation();
  const { favorites } = useFavorites();
  const cart = useCart();

  const { data: categoriesData } = useQuery({
    queryKey: queryKeys.restaurants.categories,
    queryFn: () => api.get('/api/restaurants/categories'),
    staleTime: 1000 * 60 * 15,
  });

  const geoParams = geo.latitude && geo.longitude ? `&lat=${geo.latitude}&lng=${geo.longitude}` : '';

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.restaurants.list({
      category,
      search: debouncedSearch,
      lat: geo.latitude ?? undefined,
      lng: geo.longitude ?? undefined,
    }),
    queryFn: () =>
      api.get(`/api/restaurants?category=${category === 'all' ? '' : category}&search=${debouncedSearch}&limit=50${geoParams}`),
  });

  const allRestaurants = data?.data?.restaurants || [];
  const restaurants = showFavorites
    ? allRestaurants.filter((r: { id: string }) => favorites.includes(r.id))
    : allRestaurants;
  const categories: string[] = categoriesData?.data || [];
  const cartActive = cart.items.length > 0;

  const hasFilter = search.length > 0 || category !== 'all' || showFavorites;

  return (
    <PageTransition>
      <div className="min-h-screen bg-n-50 antialiased">

        {/* ══ HEADER ══ */}
        <header className="bg-white/85 backdrop-blur-xl border-b border-n-100 sticky top-0 z-40 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">

            {/* Top bar */}
            <div className="flex items-center justify-between h-14 gap-3">
              <Link href="/" className="shrink-0 flex items-center gap-1.5">
                <span className="font-display text-2xl font-black tracking-tighter text-n-900 leading-none">
                  nami
                </span>
                <span className="text-primary text-2xl font-black leading-none">!</span>
              </Link>

              {/* Yumbo chip */}
              <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-n-400 bg-n-50 px-3 py-1.5 rounded-full border border-n-100">
                <MapPinIcon size={9} />
                Yumbo
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-1 ml-auto">
                {cartActive && (
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/15 mr-1 cursor-pointer"
                  >
                    <Sparkles size={11} />
                    <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                      Carrito activo
                    </span>
                  </motion.div>
                )}
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  type="button"
                  onClick={() => setShowFavorites(!showFavorites)}
                  title="Favoritos"
                  className={`cursor-pointer p-2.5 rounded-full transition-all ${
                    showFavorites
                      ? 'bg-red-50 text-red-500'
                      : 'text-n-400 hover:bg-n-100 hover:text-n-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${showFavorites ? 'fill-red-500' : ''}`} />
                </motion.button>
                <Link
                  href="/historial"
                  title="Mis pedidos"
                  className="cursor-pointer p-2.5 rounded-full text-n-400 hover:bg-n-100 hover:text-n-600 transition-all"
                >
                  <Clock className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-3 pt-1 scrollbar-hide -mx-1 px-1 max-md:flex-nowrap">
              <button
                type="button"
                onClick={() => setCategory('all')}
                className={`cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black whitespace-nowrap transition-all shrink-0 ${
                  category === 'all'
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-white text-n-500 border border-n-100 hover:border-n-200'
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black whitespace-nowrap transition-all shrink-0 ${
                    category === cat
                      ? 'bg-primary text-white shadow-md shadow-primary/25'
                      : 'bg-white text-n-500 border border-n-100 hover:border-n-200'
                  }`}
                >
                  <span>{getCategoryEmoji(cat)}</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">

          {/* ══ HERO ══ */}
          <AnimatePresence mode="wait">
            {!hasFilter && (
              <motion.section
                key="hero"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="pt-8 pb-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8 mb-6">
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
                      Yumbo, Valle del Cauca
                    </p>
                    <h1 className="font-display text-[2.6rem] sm:text-[3.5rem] font-black leading-[0.92] tracking-tighter text-n-900">
                      Tu ciudad,{' '}
                      <span className="relative inline-block">
                        en un plato
                        <span
                          className="absolute -bottom-1 left-0 right-0 h-[4px] rounded-full bg-primary"
                          aria-hidden
                        />
                      </span>
                      <span className="text-primary">.</span>
                    </h1>
                    <p className="mt-3 text-sm text-n-500 font-medium max-w-sm leading-relaxed">
                      Pide directo por WhatsApp. Sin intermediarios, sin comisiones.
                    </p>
                  </div>

                  {geo.latitude != null && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-2xl font-black border border-emerald-100 w-fit shrink-0"
                    >
                      <MapPinIcon className="w-3.5 h-3.5" />
                      Mostrando cerca de ti
                    </motion.div>
                  )}
                </div>

                {/* Geo prompt */}
                {!geo.requested && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    type="button"
                    onClick={geo.requestPermission}
                    className="cursor-pointer w-full max-w-md flex items-center gap-2.5 bg-white border-2 border-dashed border-n-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-n-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all mb-4"
                  >
                    <MapPinIcon className="w-4 h-4 shrink-0" />
                    <span>Activar ubicación para ver restaurantes cercanos</span>
                  </motion.button>
                )}
              </motion.section>
            )}
          </AnimatePresence>

          {/* ══ BÚSQUEDA ══ */}
          <div className={`${hasFilter ? 'pt-5' : ''} mb-6`}>
            <div className="relative max-w-xl group">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-n-300 group-focus-within:text-primary transition-colors pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Busca restaurante o plato..."
                className="w-full bg-white border-2 border-n-100 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-bold shadow-sm focus:border-primary/40 outline-none transition-all placeholder:text-n-300 placeholder:font-medium"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-n-300 hover:text-n-600 text-xs font-black cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* ══ CONTADOR DE RESULTADOS ══ */}
          {!isLoading && hasFilter && restaurants.length > 0 && (
            <p className="text-[11px] text-n-400 font-black uppercase tracking-widest mb-5">
              {showFavorites
                ? `${restaurants.length} favorito${restaurants.length !== 1 ? 's' : ''}`
                : `${restaurants.length} resultado${restaurants.length !== 1 ? 's' : ''}`}
            </p>
          )}

          {/* ══ GRID ══ */}
          {isLoading ? (
            <FeedSkeleton />
          ) : restaurants.length === 0 ? (
            <EmptyState
              icon={Search}
              title={showFavorites ? 'Sin favoritos' : 'Sin resultados'}
              description={
                showFavorites
                  ? 'Aún no tienes restaurantes favoritos. Toca el corazón en cualquier restaurante.'
                  : search
                  ? `No encontramos "${search}". Intenta con otra búsqueda.`
                  : 'No hay restaurantes disponibles en este momento.'
              }
            />
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restaurants.map((r: (typeof restaurants)[number]) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </StaggerContainer>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
