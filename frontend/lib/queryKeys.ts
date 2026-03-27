/**
 * Centralized TanStack Query key factory.
 * Todas las query keys del proyecto viven aquí para evitar strings mágicos.
 */

export const queryKeys = {
  // ── Feed público ──────────────────────────────────────────────────────────
  restaurants: {
    all: ['restaurants'] as const,
    list: (params: { category?: string; search?: string; lat?: number; lng?: number }) =>
      ['restaurants', 'list', params] as const,
    bySlug: (slug: string) => ['restaurants', 'slug', slug] as const,
    categories: ['restaurants', 'categories'] as const,
  },

  // ── Menú público ─────────────────────────────────────────────────────────
  menu: {
    byRestaurantId: (restaurantId: string) => ['menu', restaurantId] as const,
  },

  // ── Dashboard (autenticado) ───────────────────────────────────────────────
  dashboard: {
    restaurant: ['dashboard', 'restaurant'] as const,
  },
} as const;
