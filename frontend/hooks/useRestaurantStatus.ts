import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface MeResponse {
  success: boolean;
  data: {
    user: { id: string; email: string; role: 'OWNER' | 'ADMIN' };
    restaurant: {
      id: string;
      name: string;
      slug: string;
      status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
      rejectionNote: string | null;
    } | null;
  };
}

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get<MeResponse>('/api/auth/me'),
    select: (res) => res.data,
    staleTime: 0,
  });
}
