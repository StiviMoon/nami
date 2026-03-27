import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';

export function useMyRestaurant() {
  return useQuery({
    queryKey: queryKeys.dashboard.restaurant,
    queryFn: () => api.get('/api/dashboard/restaurant'),
    select: (res) => res.data,
  });
}
