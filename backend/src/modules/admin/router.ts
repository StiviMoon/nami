import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { prisma } from '../../config/database';
import { ForbiddenError } from '../../utils/errors';
import { getSingleParam } from '../../utils/http';

const router = Router();
router.use(authMiddleware);

// GET /api/admin/restaurants
router.get('/restaurants', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenError('Solo admins');

    const restaurants = await prisma.restaurant.findMany({
      include: { owner: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: restaurants });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/restaurants/:id/plan
router.put('/restaurants/:id/plan', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenError('Solo admins');

    const id = getSingleParam(req.params.id);
    if (!id) throw new ForbiddenError('ID inválido');

    const { plan } = req.body;
    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: { plan },
    });

    res.json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
});

export default router;
