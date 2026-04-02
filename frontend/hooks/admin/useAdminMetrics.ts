import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';

export function useAdminMetrics() {
  return useQuery({
    queryKey: queryKeys.admin.metrics,
    queryFn: () => api.get('/api/admin/metrics'),
    select: (res) => res.data,
    refetchInterval: 30_000,
  });
}
