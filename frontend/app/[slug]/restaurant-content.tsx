'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import Link from 'next/link';
import { useEffect, useState, type ComponentProps } from 'react';
import { PageTransition } from '@/components/motion';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { RestaurantMenuUix } from '@/components/web/RestaurantMenuUix';
import type { WeekSchedule } from '@/lib/uix-schedule';

export function RestaurantContent({ slug }: { slug: string }) {
  const [parsedSchedule, setParsedSchedule] = useState<WeekSchedule | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.restaurants.bySlug(slug),
    queryFn: () => api.get(`/api/restaurants/${slug}?includeMenu=true`),
    select: (res) => res.data as { restaurant: Record<string, unknown>; menu: unknown[] },
  });

  const restaurant = data?.restaurant as
    | {
        id: string;
        name: string;
        address?: string | null;
        description?: string | null;
        bannerText?: string | null;
        coverUrl?: string | null;
        isClosed: boolean;
        schedule?: string | null;
        whatsapp?: string | null;
        instagram?: string | null;
        tiktok?: string | null;
        facebook?: string | null;
      }
    | undefined;

  const categories = (data?.menu ?? []) as ComponentProps<typeof RestaurantMenuUix>['categories'];

  useEffect(() => {
    if (!restaurant?.schedule) {
      setParsedSchedule(null);
      return;
    }
    try {
      setParsedSchedule(JSON.parse(restaurant.schedule) as WeekSchedule);
    } catch {
      setParsedSchedule(null);
    }
  }, [restaurant?.schedule]);

  if (isLoading) {
    return (
      <main className="min-h-dvh bg-gray-50">
        <Skeleton className="h-56 w-full rounded-none" />
        <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-gray-100 space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <SkeletonText lines={2} />
          </div>
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <EmptyState
        emoji="🍽️"
        title="Restaurante no encontrado"
        description="Este restaurante no existe o fue eliminado."
        action={
          <Link href="/feed" className="text-[#E85D04] font-black hover:underline text-sm">
            Volver al feed
          </Link>
        }
        className="min-h-dvh bg-gray-50"
      />
    );
  }

  return (
    <PageTransition>
      <RestaurantMenuUix restaurant={restaurant} categories={categories} slug={slug} schedule={parsedSchedule} />
    </PageTransition>
  );
}
