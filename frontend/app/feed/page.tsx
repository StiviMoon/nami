'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import Link from 'next/link';
import { Search, MapPin as MapPinIcon, Heart, Clock } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useFavorites } from '@/hooks/useFavorites';
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

  const { data: categoriesData } = useQuery({
    queryKey: queryKeys.restaurants.categories,
    queryFn: () => api.get('/api/restaurants/categories'),
    staleTime: 1000 * 60 * 15, // categorías cambian poco — 15 min
  });

  const geoParams = geo.latitude && geo.longitude ? `&lat=${geo.latitude}&lng=${geo.longitude}` : '';

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.restaurants.list({ category, search: debouncedSearch, lat: geo.latitude ?? undefined, lng: geo.longitude ?? undefined }),
    queryFn: () =>
      api.get(`/api/restaurants?category=${category === 'all' ? '' : category}&search=${debouncedSearch}&limit=50${geoParams}`),
  });

  const allRestaurants = data?.data?.restaurants || [];
  const restaurants = showFavorites
    ? allRestaurants.filter((r: any) => favorites.includes(r.id))
    : allRestaurants;
  const categories: string[] = categoriesData?.data || [];

  return (
    <PageTransition>
      <main className="min-h-screen bg-n-50">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-xl border-b border-n-100 sticky top-0 z-40 shadow-sm shadow-n-900/5">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              <Link href="/" className="text-xl font-display font-bold text-primary shrink-0 cursor-pointer">
                ÑAMI
              </Link>
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-n-400" />
                <input
                  type="text"
                  placeholder="Buscar restaurantes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-n-50 rounded-xl border border-n-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-n-400"
                />
              </div>
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                title="Favoritos"
                className={`cursor-pointer p-2.5 rounded-xl shrink-0 transition-all ${
                  showFavorites
                    ? 'bg-red-50 text-red-500 scale-110'
                    : 'text-n-400 hover:bg-n-100 hover:text-n-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${showFavorites ? 'fill-red-500' : ''}`} />
              </button>
              <Link
                href="/historial"
                title="Historial"
                className="cursor-pointer p-2.5 rounded-xl text-n-400 hover:bg-n-100 hover:text-n-600 shrink-0 transition-all"
              >
                <Clock className="w-5 h-5" />
              </Link>
            </div>

            {/* Category filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
              <button
                onClick={() => setCategory('all')}
                className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  category === 'all'
                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                    : 'bg-n-100 text-n-500 hover:bg-n-200'
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    category === cat
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'bg-n-100 text-n-500 hover:bg-n-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Location banner */}
        {!geo.requested && (
          <div className="max-w-6xl mx-auto px-4 pt-5">
            <button
              onClick={geo.requestPermission}
              className="cursor-pointer w-full flex items-center justify-center gap-2 bg-white border border-n-200 rounded-xl px-4 py-3 text-sm font-medium text-n-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
            >
              <MapPinIcon className="w-4 h-4" />
              Activar ubicación para ver restaurantes cercanos
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Results header */}
          {!isLoading && restaurants.length > 0 && (
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-n-500 font-medium">
                {showFavorites ? 'Tus favoritos' : `${restaurants.length} restaurante${restaurants.length !== 1 ? 's' : ''}`}
              </p>
              {geo.latitude && (
                <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                  <MapPinIcon className="w-3 h-3" />
                  Ubicación activa
                </span>
              )}
            </div>
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
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {restaurants.map((r: any) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </StaggerContainer>
          )}
        </div>
      </main>
    </PageTransition>
  );
}
