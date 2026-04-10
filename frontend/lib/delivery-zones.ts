export type DeliveryZone = { name: string; price: number };

/** Normaliza JSON de API/Prisma a lista de zonas válidas. */
export function parseDeliveryZones(raw: unknown): DeliveryZone[] {
  if (!Array.isArray(raw)) return [];
  const out: DeliveryZone[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue;
    const o = entry as Record<string, unknown>;
    const name = String(o.name ?? '').trim();
    if (!name) continue;
    const p = o.price;
    const price =
      typeof p === 'number' && Number.isFinite(p)
        ? Math.max(0, p)
        : typeof p === 'string' && p.trim() !== ''
          ? Math.max(0, Number(p) || 0)
          : 0;
    out.push({ name, price });
  }
  return out;
}
