export type MenuExtra = { id: string; name: string; price: number };

export type MenuCustomization = {
  extras?: MenuExtra[];
  removables?: string[];
};

export function hasCustomization(c: unknown): c is MenuCustomization {
  if (c == null || typeof c !== 'object') return false;
  const o = c as MenuCustomization;
  const extras = o.extras;
  const removables = o.removables;
  const hasExtras = Array.isArray(extras) && extras.length > 0;
  const hasRemovables = Array.isArray(removables) && removables.length > 0;
  return hasExtras || hasRemovables;
}

export function normalizeMenuCustomization(raw: unknown): MenuCustomization | null {
  if (!hasCustomization(raw)) return null;
  const o = raw as MenuCustomization;
  return {
    extras: (o.extras ?? [])
      .filter((e) => e && typeof e.name === 'string' && typeof e.price === 'number')
      .map((e, i) => ({
        id: typeof e.id === 'string' && e.id ? e.id : `ex-${i}`,
        name: String(e.name).trim(),
        price: Number(e.price),
      })),
    removables: [...new Set((o.removables ?? []).map((s) => String(s).trim()).filter(Boolean))],
  };
}

export function buildCartLineId(
  menuItemId: string,
  extras: MenuExtra[],
  exclusions: string[]
): string {
  const ex = [...extras]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((e) => e.id)
    .join('|');
  const rm = [...exclusions].sort().join('|');
  if (!ex && !rm) return menuItemId;
  return `${menuItemId}::${ex}::${rm}`;
}
