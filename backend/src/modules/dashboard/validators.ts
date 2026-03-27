import { z } from 'zod';

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
  themePreset: z.enum(['SUNSET', 'FOREST', 'OCEAN', 'BERRY', 'MONO']).optional(),
  menuStyle: z.enum(['ROUNDED', 'SOFT', 'MINIMAL']).optional(),
  isClosed: z.boolean().optional(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
  fontFamily: z.string().max(50).optional().nullable(),
  menuLayout: z.enum(['grid', 'list']).optional().nullable(),
  bannerText: z.string().max(200).optional().nullable(),
  instagram: z.string().max(100).optional().nullable(),
  tiktok: z.string().max(100).optional().nullable(),
  facebook: z.string().max(100).optional().nullable(),
  schedule: z.string().optional().nullable(),
});

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
});

export const createMenuItemSchema = z.object({
  categoryId: z.string().cuid(),
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive('Precio debe ser positivo'),
  imageUrl: nullableUrlInput,
  badge: z.enum(['popular', 'nuevo', 'picante', 'recomendado']).optional().nullable(),
});

export const updateMenuItemSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  price: z.number().positive().optional(),
  imageUrl: nullableUrlInput,
  isAvailable: z.boolean().optional(),
  order: z.number().int().optional(),
  badge: z.enum(['popular', 'nuevo', 'picante', 'recomendado']).optional().nullable(),
});
