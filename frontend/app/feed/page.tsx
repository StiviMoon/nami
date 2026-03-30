'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import Link from 'next/link';
import { Search, MapPin as MapPinIcon, Heart, Bell, Clock } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/hooks/useCart';
import { RestaurantCard } from '@/components/web/RestaurantCard';
import { FeedSkeleton } from '@/components/web/FeedSkeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { StaggerContainer, PageTransition } from '@/components/motion';

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

  return (
    <PageTransition>
      <main className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 py-5 px-6 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col gap-5">
            <div className="flex justify-between items-center gap-3">
              <Link href="/" className="text-2xl font-black italic tracking-tighter text-gray-900 shrink-0">
                ÑAMI <span className="text-[#E85D04]">!</span>
              </Link>
              <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                {cartActive && (
                  <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 animate-pulse shrink-0">
                    <Bell size={14} className="text-[#E85D04]" />
                    <span className="text-[9px] font-black uppercase text-[#E85D04] whitespace-nowrap">
                      Carrito activo
                    </span>
                  </div>
                )}
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100 shrink-0 hidden sm:inline">
                  Yumbo
                </span>
                <button
                  type="button"
                  onClick={() => setShowFavorites(!showFavorites)}
                  title="Favoritos"
                  className={`cursor-pointer p-2.5 rounded-full shrink-0 transition-all ${
                    showFavorites
                      ? 'bg-red-50 text-red-500 scale-110'
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${showFavorites ? 'fill-red-500' : ''}`} />
                </button>
                <Link
                  href="/historial"
                  title="Mis pedidos"
                  className="cursor-pointer p-2.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 shrink-0 transition-all"
                >
                  <Clock className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:hidden">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                Yumbo
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
              <button
                type="button"
                onClick={() => setCategory('all')}
                className={`cursor-pointer px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all shrink-0 ${
                  category === 'all'
                    ? 'bg-[#E85D04] text-white shadow-lg shadow-orange-500/25'
                    : 'bg-white text-gray-400 border border-gray-100'
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`cursor-pointer px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all shrink-0 ${
                    category === cat
                      ? 'bg-[#E85D04] text-white shadow-lg shadow-orange-500/25'
                      : 'bg-white text-gray-400 border border-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {!geo.requested && (
          <div className="max-w-7xl mx-auto px-6 pt-5">
            <button
              type="button"
              onClick={geo.requestPermission}
              className="cursor-pointer w-full flex items-center justify-center gap-2 bg-white border-2 border-dashed border-gray-200 rounded-3xl px-4 py-3 text-sm font-bold text-gray-500 hover:border-[#E85D04] hover:text-[#E85D04] hover:bg-orange-50/50 transition-all"
            >
              <MapPinIcon className="w-4 h-4" />
              Activar ubicación para ver restaurantes cercanos
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto p-6 space-y-10">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-4xl font-black leading-none text-gray-900">
                Tu ciudad, <br />
                <span className="text-[#E85D04]">en un plato.</span>
              </h2>
              {geo.latitude != null && (
                <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full font-black flex items-center gap-1.5 shrink-0 border border-emerald-100 w-fit">
                  <MapPinIcon className="w-3 h-3" />
                  Cerca de ti
                </span>
              )}
            </div>
            <div className="relative max-w-xl group">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E85D04] transition-colors"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Busca tu restaurante..."
                className="w-full bg-white border-2 border-gray-100 rounded-[1.5rem] py-4 pl-14 pr-6 text-sm font-bold shadow-sm focus:border-orange-100 outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {!isLoading && restaurants.length > 0 && (search || showFavorites || category !== 'all') && (
            <p className="text-sm text-gray-500 font-bold">
              {showFavorites ? 'Tus favoritos' : `${restaurants.length} resultado${restaurants.length !== 1 ? 's' : ''}`}
            </p>
          )}

          {isLoading ? (
            <FeedSkeleton />
          ) : restaurants.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Sin resultados"
              description={
                showFavorites
                  ? 'Aún no tienes restaurantes favoritos.'
                  : 'No encontramos restaurantes con esa búsqueda.'
              }
            />
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {restaurants.map((r: (typeof restaurants)[number]) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </StaggerContainer>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
