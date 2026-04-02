import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useRealtimeRestaurant(
  restaurantId: string | undefined,
  onUpdate: (data: Record<string, unknown>) => void,
) {
  const stableOnUpdate = useCallback(onUpdate, [onUpdate]);

  useEffect(() => {
    if (!restaurantId) return;

    const channel = supabase
      .channel(`restaurant:${restaurantId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'restaurants',
          filter: `id=eq.${restaurantId}`,
        },
        (payload) => stableOnUpdate(payload.new as Record<string, unknown>),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId, stableOnUpdate]);
}
