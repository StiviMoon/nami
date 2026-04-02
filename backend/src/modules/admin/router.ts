import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { requireSuperAdmin } from '../../middleware/requireSuperAdmin';
import { prisma } from '../../config/database';
import { ApiError, NotFoundError } from '../../utils/errors';
import { getSingleParam, getSingleQuery } from '../../utils/http';
import { statusChangeSchema, updateRestaurantAdminSchema, changePlanSchema } from './validators';

const router = Router();
router.use(authMiddleware);
router.use(requireSuperAdmin);

// ── Métricas globales ──────────────────────────────────────────────────────
router.get('/metrics', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [total, pending, active, rejected, suspended, gratis, pro, recentSignups] =
      await Promise.all([
        prisma.restaurant.count(),
        prisma.restaurant.count({ where: { status: 'PENDING' } }),
        prisma.restaurant.count({ where: { status: 'ACTIVE' } }),
        prisma.restaurant.count({ where: { status: 'REJECTED' } }),
        prisma.restaurant.count({ where: { status: 'SUSPENDED' } }),
        prisma.restaurant.count({ where: { plan: 'GRATIS' } }),
        prisma.restaurant.count({ where: { plan: 'PRO' } }),
        prisma.restaurant.findMany({
          where: { status: 'PENDING' },
          select: { id: true, name: true, category: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
      ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        active,
        rejected,
        suspended,
        byPlan: { GRATIS: gratis, PRO: pro },
        recentSignups,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── Listar restaurantes con filtros y paginación ───────────────────────────
router.get('/restaurants', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = getSingleQuery(req.query.status);
    const search = getSingleQuery(req.query.search);
    const page = parseInt(getSingleQuery(req.query.page) || '1', 10);
    const limit = Math.min(parseInt(getSingleQuery(req.query.limit) || '20', 10), 100);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status && ['PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED'].includes(status)) {
      where.status = status;
    }
    if (search?.trim()) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { owner: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        include: { owner: { select: { email: true } } },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.restaurant.count({ where }),
    ]);

    res.json({
      success: true,
      data: { restaurants, total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

// ── Detalle de un restaurante ──────────────────────────────────────────────
router.get('/restaurants/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) throw new ApiError(400, 'ID inválido');

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, email: true, createdAt: true } },
        categories: {
          include: { _count: { select: { items: true } } },
        },
      },
    });

    if (!restaurant) throw new NotFoundError('Restaurante');

    const totalItems = await prisma.menuItem.count({
      where: { category: { restaurantId: id } },
    });

    const logs = await prisma.adminLog.findMany({
      where: { targetId: id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({
      success: true,
      data: {
        ...restaurant,
        _stats: {
          totalCategories: restaurant.categories.length,
          totalItems,
        },
        logs,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── Cambiar status (aprobar / rechazar / suspender) ────────────────────────
router.patch('/restaurants/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) throw new ApiError(400, 'ID inválido');

    const { status, note } = statusChangeSchema.parse(req.body);

    const existing = await prisma.restaurant.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Restaurante');

    const updateData: Record<string, unknown> = {
      status,
      reviewedAt: new Date(),
      reviewedBy: req.user!.id,
    };

    if (status === 'ACTIVE') {
      updateData.isActive = true;
      updateData.rejectionNote = null;
    } else if (status === 'SUSPENDED') {
      updateData.isActive = false;
    } else if (status === 'REJECTED') {
      updateData.rejectionNote = note || null;
      updateData.isActive = false;
    }

    const [restaurant] = await prisma.$transaction([
      prisma.restaurant.update({ where: { id }, data: updateData }),
      prisma.adminLog.create({
        data: {
          adminId: req.user!.id,
          action: 'STATUS_CHANGE',
          targetId: id,
          targetType: 'restaurant',
          metadata: { from: existing.status, to: status, note: note || null },
        },
      }),
    ]);

    res.json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
});

// ── Editar datos de restaurante (soporte) ──────────────────────────────────
router.put('/restaurants/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) throw new ApiError(400, 'ID inválido');

    const data = updateRestaurantAdminSchema.parse(req.body);

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data,
    });

    await prisma.adminLog.create({
      data: {
        adminId: req.user!.id,
        action: 'EDIT_RESTAURANT',
        targetId: id,
        targetType: 'restaurant',
        metadata: { fields: Object.keys(data) },
      },
    });

    res.json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
});

// ── Cambiar plan ───────────────────────────────────────────────────────────
router.put('/restaurants/:id/plan', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getSingleParam(req.params.id);
    if (!id) throw new ApiError(400, 'ID inválido');

    const { plan } = changePlanSchema.parse(req.body);

    const [restaurant] = await prisma.$transaction([
      prisma.restaurant.update({ where: { id }, data: { plan } }),
      prisma.adminLog.create({
        data: {
          adminId: req.user!.id,
          action: 'PLAN_CHANGE',
          targetId: id,
          targetType: 'restaurant',
          metadata: { plan },
        },
      }),
    ]);

    res.json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
});

// ── Logs de actividad ──────────────────────────────────────────────────────
router.get('/logs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetId = getSingleQuery(req.query.targetId);
    const page = parseInt(getSingleQuery(req.query.page) || '1', 10);
    const limit = 30;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (targetId) where.targetId = targetId;

    const [logs, total] = await Promise.all([
      prisma.adminLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.adminLog.count({ where }),
    ]);

    res.json({
      success: true,
      data: { logs, total, page, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
