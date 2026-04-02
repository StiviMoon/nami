import { Router, Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from './validators';
import * as authService from './service';
import { authMiddleware } from '../../middleware/auth';
import { prisma } from '../../config/database';

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = registerSchema.parse(req.body);
    const result = await authService.register(body);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      data: {
        user: { id: result.user.id, email: result.user.email, role: result.user.role },
        restaurant: result.user.restaurant,
        token: result.token,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = loginSchema.parse(req.body);
    const result = await authService.login(body);

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        user: { id: result.user.id, email: result.user.email, role: result.user.role },
        restaurant: result.user.restaurant,
        token: result.token,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// GET /api/auth/me — Info del usuario + restaurante (sin requireApproved)
router.get('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    const restaurant = user.restaurantId
      ? await prisma.restaurant.findUnique({
          where: { id: user.restaurantId },
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            rejectionNote: true,
          },
        })
      : null;

    res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, role: user.role },
        restaurant,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
