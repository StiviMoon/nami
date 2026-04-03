import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Za-zÁÉÍÓÚáéíóúÑñ]/, 'Incluye al menos una letra')
    .regex(/[0-9]/, 'Incluye al menos un número')
    .regex(/[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]/, 'Incluye al menos un símbolo (ej. !@#$)'),
  restaurantName: z.string().min(3, 'Mínimo 3 caracteres'),
  whatsapp: z.string().regex(/^\+573\d{9}$/, 'Formato: +573XXXXXXXXX'),
  address: z.string().min(5),
  category: z.string().min(2),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
