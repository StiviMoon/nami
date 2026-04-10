'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesStore {
  favorites: string[];
  toggle: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;
}

export const useFavorites = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggle: (restaurantId) =>
        set((s) => ({
          favorites: s.favorites.includes(restaurantId)
            ? s.favorites.filter((id) => id !== restaurantId)
            : [...s.favorites, restaurantId],
        })),
      isFavorite: (restaurantId) => get().favorites.includes(restaurantId),
    }),
    { name: 'ñami-favorites' }
  )
);
