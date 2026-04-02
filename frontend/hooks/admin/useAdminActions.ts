import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/toast';

export function useAdminStatusChange() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) =>
      api.patch(`/api/admin/restaurants/${id}/status`, { status, note }),
    onSuccess: (_data, { status }) => {
      qc.invalidateQueries({ queryKey: ['admin'] });
      const msg =
        status === 'ACTIVE' ? 'Restaurante aprobado' :
        status === 'REJECTED' ? 'Restaurante rechazado' :
        'Restaurante suspendido';
      toast(msg, 'success');
    },
    onError: (err: Error) => {
      toast(err.message || 'Error al cambiar status', 'error');
    },
  });
}

export function useAdminEditRestaurant() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.put(`/api/admin/restaurants/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin'] });
      toast('Restaurante actualizado', 'success');
    },
    onError: (err: Error) => {
      toast(err.message || 'Error al editar', 'error');
    },
  });
}

export function useAdminChangePlan() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: string }) =>
      api.put(`/api/admin/restaurants/${id}/plan`, { plan }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin'] });
      toast('Plan actualizado', 'success');
    },
    onError: (err: Error) => {
      toast(err.message || 'Error al cambiar plan', 'error');
    },
  });
}
