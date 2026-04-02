import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';

interface Params {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useAdminRestaurants(params: Params = {}) {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set('status', params.status);
  if (params.search) searchParams.set('search', params.search);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const qs = searchParams.toString();

  return useQuery({
    queryKey: queryKeys.admin.restaurants(params as Record<string, unknown>),
    queryFn: () => api.get(`/api/admin/restaurants${qs ? `?${qs}` : ''}`),
    select: (res) => res.data,
  });
}

export function useAdminRestaurant(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.restaurant(id),
    queryFn: () => api.get(`/api/admin/restaurants/${id}`),
    select: (res) => res.data,
    enabled: !!id,
  });
}
