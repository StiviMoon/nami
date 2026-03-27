type ThemePreset = 'SUNSET' | 'FOREST' | 'OCEAN' | 'BERRY' | 'MONO';
type MenuStyle = 'ROUNDED' | 'SOFT' | 'MINIMAL';

export function getThemeClasses(theme: ThemePreset | string | undefined) {
  switch (theme) {
    case 'FOREST':
      return {
        accent: 'text-emerald-700',
        accentBg: 'bg-emerald-600',
        accentHover: 'hover:bg-emerald-700',
        ring: 'focus:ring-emerald-300',
        header: 'from-emerald-300/30 to-lime-300/20',
        badge: 'bg-emerald-600',
      };
    case 'OCEAN':
      return {
        accent: 'text-sky-700',
        accentBg: 'bg-sky-600',
        accentHover: 'hover:bg-sky-700',
        ring: 'focus:ring-sky-300',
        header: 'from-sky-300/30 to-cyan-300/20',
        badge: 'bg-sky-600',
      };
    case 'BERRY':
      return {
        accent: 'text-violet-700',
        accentBg: 'bg-violet-600',
        accentHover: 'hover:bg-violet-700',
        ring: 'focus:ring-violet-300',
        header: 'from-violet-300/30 to-fuchsia-300/20',
        badge: 'bg-violet-600',
      };
    case 'MONO':
      return {
        accent: 'text-slate-800',
        accentBg: 'bg-slate-800',
        accentHover: 'hover:bg-slate-900',
        ring: 'focus:ring-slate-300',
        header: 'from-slate-300/30 to-zinc-300/20',
        badge: 'bg-slate-800',
      };
    case 'SUNSET':
    default:
      return {
        accent: 'text-primary',
        accentBg: 'bg-primary',
        accentHover: 'hover:bg-primary-dark',
        ring: 'focus:ring-primary/30',
        header: 'from-primary/30 to-accent/20',
        badge: 'bg-primary',
      };
  }
}

export function getMenuCardStyleClasses(style: MenuStyle | string | undefined) {
  switch (style) {
    case 'SOFT':
      return 'rounded-2xl p-4 border border-n-100 bg-white shadow-sm hover:shadow-lg';
    case 'MINIMAL':
      return 'rounded-lg p-4 border border-n-100 bg-white hover:border-n-300';
    case 'ROUNDED':
    default:
      return 'rounded-xl p-4 border border-n-100 bg-white hover:shadow-md';
  }
}

/**
 * Returns inline CSS custom properties for restaurants with custom colors.
 * Falls back to preset colors if no custom colors are set.
 */
export function getCustomThemeStyle(restaurant: {
  primaryColor?: string | null;
  secondaryColor?: string | null;
  themePreset?: string;
}): React.CSSProperties {
  if (!restaurant.primaryColor) return {};

  return {
    '--r-primary': restaurant.primaryColor,
    '--r-secondary': restaurant.secondaryColor || restaurant.primaryColor,
  } as React.CSSProperties;
}

/**
 * Returns true if the restaurant has custom colors (not just presets).
 */
export function hasCustomColors(restaurant: { primaryColor?: string | null }): boolean {
  return !!restaurant.primaryColor;
}

const badgeConfig: Record<string, { emoji: string; label: string; color: string }> = {
  popular: { emoji: '🔥', label: 'Popular', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  nuevo: { emoji: '🆕', label: 'Nuevo', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  picante: { emoji: '🌶️', label: 'Picante', color: 'bg-red-50 text-red-600 border-red-200' },
  recomendado: { emoji: '⭐', label: 'Recomendado', color: 'bg-amber-50 text-amber-700 border-amber-200' },
};

export function getItemBadge(badge: string | null | undefined) {
  if (!badge) return null;
  return badgeConfig[badge] || null;
}
