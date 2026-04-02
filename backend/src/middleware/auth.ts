import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { prisma } from '../config/database';
import { ApiError } from '../utils/errors';

export interface AuthUser {
  id: string;
  email: string;
  supabaseId: string;
  role: 'OWNER' | 'ADMIN';
  restaurantId?: string;
  restaurantStatus?: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Token no proporcionado');
    }

    const { data: { user: supaUser }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !supaUser) {
      throw new ApiError(401, 'Token inválido o expirado');
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: supaUser.id },
      include: { restaurant: { select: { id: true, status: true } } },
    });

    if (!dbUser) {
      throw new ApiError(401, 'Usuario no encontrado en BD');
    }

    req.user = {
      id: dbUser.id,
      email: dbUser.email,
      supabaseId: dbUser.supabaseId,
      role: dbUser.role,
      restaurantId: dbUser.restaurant?.id,
      restaurantStatus: dbUser.restaurant?.status,
    };

    next();
  } catch (err) {
    next(err);
  }
}
