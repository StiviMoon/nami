/**
 * Centralized TanStack Query key factory.
 * Todas las query keys del proyecto viven aquí para evitar strings mágicos.
 */

export const queryKeys = {
  // ── Auth ─────────────────────────────────────────────────────────────────
  auth: {
    me: ['auth', 'me'] as const,
  },

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

  // ── Super Admin ───────────────────────────────────────────────────────────
  admin: {
    metrics: ['admin', 'metrics'] as const,
    restaurants: (params: Record<string, unknown>) => ['admin', 'restaurants', params] as const,
    restaurant: (id: string) => ['admin', 'restaurant', id] as const,
    logs: (params: Record<string, unknown>) => ['admin', 'logs', params] as const,
  },
} as const;
