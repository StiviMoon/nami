'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
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
    queryKey: ['categories'],
    queryFn: () => api.get('/api/restaurants/categories'),
  });

  const geoParams = geo.latitude && geo.longitude ? `&lat=${geo.latitude}&lng=${geo.longitude}` : '';

  const { data, isLoading } = useQuery({
    queryKey: ['restaurants', category, debouncedSearch, geo.latitude, geo.longitude],
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
        <header className="bg-white border-b border-n-100 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/" className="text-2xl font-display font-bold text-primary shrink-0">
                ÑAMI
              </Link>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-n-400" />
                <input
                  type="text"
                  placeholder="Buscar restaurantes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-n-50 rounded-xl border border-n-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                  showFavorites ? 'bg-red-50 text-red-500' : 'text-n-400 hover:bg-n-50'
                }`}
                title="Favoritos"
              >
                <Heart className={`w-5 h-5 ${showFavorites ? 'fill-red-500' : ''}`} />
              </button>
              <Link
                href="/historial"
                className="p-2.5 rounded-xl text-n-400 hover:bg-n-50 shrink-0 transition-colors"
                title="Historial"
              >
                <Clock className="w-5 h-5" />
              </Link>
            </div>

            {/* Category filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  category === 'all'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-n-100 text-n-600 hover:bg-n-200'
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    category === cat
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-n-100 text-n-600 hover:bg-n-200'
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
          <div className="max-w-6xl mx-auto px-4 pt-6">
            <button
              onClick={geo.requestPermission}
              className="w-full flex items-center justify-center gap-2 bg-primary/5 text-primary border border-primary/20 rounded-xl px-4 py-3 text-sm font-medium hover:bg-primary/10 transition-colors"
            >
              <MapPinIcon className="w-4 h-4" />
              Activar ubicación para ver restaurantes cercanos
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {isLoading ? (
            <FeedSkeleton />
          ) : restaurants.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Sin resultados"
              description="No encontramos restaurantes con esa búsqueda. Intenta con otra categoría o término."
            />
          ) : (
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
