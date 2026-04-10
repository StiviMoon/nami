import { z } from 'zod';
import { Prisma } from '@prisma/client';

const nullableUrlInput = z.preprocess(
  (value) => (value === '' ? null : value),
  z.string().url().optional().nullable()
);

export const updateRestaurantSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  address: z.string().min(5).optional(),
  whatsapp: z.string().regex(/^\+573\d{9}$/).optional(),
  category: z.string().optional(),
  logoUrl: nullableUrlInput,
  coverUrl: nullableUrlInput,
  themePreset: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : v),
    z.enum(['SUNSET', 'FOREST', 'OCEAN', 'BERRY', 'MONO']).optional()
  ),
  menuStyle: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : v),
    z.enum(['ROUNDED', 'SOFT', 'MINIMAL']).optional()
  ),
  isClosed: z.boolean().optional(),
  latitude: z.preprocess(
    (v) => {
      if (v === '' || v === undefined) return undefined;
      if (v === null) return null;
      const n = typeof v === 'string' ? parseFloat(v) : Number(v);
      return Number.isFinite(n) ? n : v;
    },
    z.number().min(-90).max(90).optional().nullable()
  ),
  longitude: z.preprocess(
    (v) => {
      if (v === '' || v === undefined) return undefined;
      if (v === null) return null;
      const n = typeof v === 'string' ? parseFloat(v) : Number(v);
      return Number.isFinite(n) ? n : v;
    },
    z.number().min(-180).max(180).optional().nullable()
  ),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
  fontFamily: z.string().max(50).optional().nullable(),
  menuLayout: z.preprocess(
    (v) => (v === '' ? null : v === undefined ? undefined : v),
    z.enum(['grid', 'list']).optional().nullable()
  ),
  bannerText: z.string().max(200).optional().nullable(),
  instagram: z.string().max(100).optional().nullable(),
  tiktok: z.string().max(100).optional().nullable(),
  facebook: z.string().max(100).optional().nullable(),
  schedule: z.string().optional().nullable(),
  deliveryZones: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(120),
        price: z.coerce.number().nonnegative().max(5_000_000),
      })
    )
    .max(40)
    .optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
});

/** Orden completo de categorías del restaurante (mismo conjunto que en BD). */
export const reorderCategoriesSchema = z.object({
  categoryIds: z.array(z.string().cuid()).min(1),
});

export const menuCustomizationSchema = z
  .object({
    extras: z
      .array(
        z.object({
          id: z.string().min(1).max(64).optional(),
          name: z.string().min(1).max(120),
          price: z.number().nonnegative(),
        })
      )
      .max(25)
      .optional(),
    removables: z.array(z.string().min(1).max(80)).max(30).optional(),
  })
  .strict();

export type MenuCustomizationInput = z.infer<typeof menuCustomizationSchema>;

/** Para Prisma: undefined = no tocar; null / vacío = borrar JSON */
export function toPrismaCustomization(
  value: MenuCustomizationInput | null | undefined
): Prisma.InputJsonValue | typeof Prisma.JsonNull | undefined {
  if (value === undefined) return undefined;
  if (value === null) {
    return Prisma.JsonNull;
  }
  const extras = (value.extras ?? []).map((e, i) => ({
    id: (e.id?.trim() || `extra-${i}`).slice(0, 64),
    name: e.name.trim(),
    price: e.price,
  }));
  const removables = [
    ...new Set((value.removables ?? []).map((s) => s.trim()).filter(Boolean)),
  ] as string[];
  if (extras.length === 0 && removables.length === 0) {
    return Prisma.JsonNull;
  }
  return { extras, removables };
}

export const createMenuItemSchema = z.object({
  categoryId: z.string().cuid(),
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive('Precio debe ser positivo'),
  imageUrl: nullableUrlInput,
  badge: z.enum(['popular', 'nuevo', 'picante', 'recomendado']).optional().nullable(),
  customization: menuCustomizationSchema.nullish(),
});

export const updateMenuItemSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  price: z.number().positive().optional(),
  imageUrl: nullableUrlInput,
  isAvailable: z.boolean().optional(),
  order: z.number().int().optional(),
  badge: z.enum(['popular', 'nuevo', 'picante', 'recomendado']).optional().nullable(),
  customization: menuCustomizationSchema.nullish(),
});
