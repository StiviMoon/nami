import { z } from 'zod';

export const statusChangeSchema = z.object({
  status: z.enum(['ACTIVE', 'REJECTED', 'SUSPENDED']),
  note: z.string().max(500).optional(),
});

export const updateRestaurantAdminSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  address: z.string().min(5).max(500).optional(),
  whatsapp: z.string().max(20).optional(),
  category: z.string().max(50).optional(),
  description: z.string().max(2000).optional(),
});

export const changePlanSchema = z.object({
  plan: z.enum(['GRATIS', 'PRO']),
});

export type StatusChangeInput = z.infer<typeof statusChangeSchema>;
export type UpdateRestaurantAdminInput = z.infer<typeof updateRestaurantAdminSchema>;
