import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { ApiError } from '../../utils/errors';
import { getSingleParam } from '../../utils/http';

const router = Router();

// GET /api/menu/:restaurantId — Menú completo agrupado por categoría
// Nota: preferir GET /api/restaurants/:slug?includeMenu=true para evitar request doble
router.get('/:restaurantId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurantId = getSingleParam(req.params.restaurantId);
    if (!restaurantId) throw new ApiError(400, 'ID de restaurante inválido');

    const categories = await prisma.menuCategory.findMany({
      where: { restaurantId },
      include: {
        items: {
          where: { isAvailable: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
});

export default router;
