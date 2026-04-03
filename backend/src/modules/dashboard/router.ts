import { Prisma } from '@prisma/client';
import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { requireApproved } from '../../middleware/requireApproved';
import { prisma } from '../../config/database';
import { supabaseAdmin } from '../../config/supabase';
import { ApiError, ForbiddenError, NotFoundError } from '../../utils/errors';
import { getSingleParam } from '../../utils/http';
import { generateSlug } from '../../utils/slug';
import {
  updateRestaurantSchema,
  createCategorySchema,
  createMenuItemSchema,
  updateMenuItemSchema,
  toPrismaCustomization,
} from './validators';

const router = Router();
router.use(authMiddleware);
router.use(requireApproved);

async function ensureBucketExists(bucket: string) {
  const { data: existingBucket } = await supabaseAdmin.storage.getBucket(bucket);
  if (existingBucket) return;

  const { error } = await supabaseAdmin.storage.createBucket(bucket, { public: true });
  if (error && !error.message.toLowerCase().includes('already')) {
    throw new ApiError(500, `No se pudo crear el bucket de storage: ${error.message}`);
  }
}

// GET /api/dashboard/restaurant — Mi restaurante
router.get('/restaurant', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.restaurantId) throw new NotFoundError('Restaurante');

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.user.restaurantId },
      include: {
        categories: {
          include: { items: { orderBy: { order: 'asc' } } },
          orderBy: { order: 'asc' },
        },
      },
    });

    res.json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
});

// PUT /api/dashboard/restaurant — Actualizar perfil
router.put('/restaurant', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.restaurantId) throw new NotFoundError('Restaurante');
    const data = updateRestaurantSchema.parse(req.body);

    const updatePayload: Record<string, unknown> = { ...data };

    if (data.name !== undefined) {
      let newSlug = generateSlug(data.name);
      const taken = await prisma.restaurant.findFirst({
        where: { slug: newSlug, NOT: { id: req.user.restaurantId } },
      });
      if (taken) {
        newSlug = `${newSlug}-${Date.now().toString(36)}`;
      }
      updatePayload.slug = newSlug;
    }

    const restaurant = await prisma.restaurant.update({
      where: { id: req.user.restaurantId },
      data: updatePayload as Prisma.RestaurantUpdateInput,
    });

    res.json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
});

// POST /api/dashboard/categories — Crear categoría
router.post('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.restaurantId) throw new NotFoundError('Restaurante');
    const { name } = createCategorySchema.parse(req.body);

    const category = await prisma.menuCategory.create({
      data: { restaurantId: req.user.restaurantId, name, order: 0 },
    });

    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
});

// PUT /api/dashboard/categories/:id
router.put('/categories/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.restaurantId) throw new NotFoundError('Restaurante');
    const categoryId = getSingleParam(req.params.id);
    if (!categoryId) throw new ApiError(400, 'ID de categoría inválido');

    const cat = await prisma.menuCategory.findUnique({ where: { id: categoryId } });
    if (!cat || cat.restaurantId !== req.user.restaurantId) throw new ForbiddenError();

    const updated = await prisma.menuCategory.update({
      where: { id: categoryId },
      data: req.body,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/dashboard/categories/:id
router.delete('/categories/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.restaurantId) throw new NotFoundError('Restaurante');
    const categoryId = getSingleParam(req.params.id);
    if (!categoryId) throw new ApiError(400, 'ID de categoría inválido');

    const cat = await prisma.menuCategory.findUnique({ where: { id: categoryId } });
    if (!cat || cat.restaurantId !== req.user.restaurantId) throw new ForbiddenError();

    await prisma.menuCategory.delete({ where: { id: categoryId } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// POST /api/dashboard/items — Crear item
router.post('/items', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.restaurantId) throw new NotFoundError('Restaurante');
    const data = createMenuItemSchema.parse(req.body);

    // Verificar categoría
    const cat = await prisma.menuCategory.findUnique({ where: { id: data.categoryId } });
    if (!cat || cat.restaurantId !== req.user.restaurantId) throw new ForbiddenError();

    // Verificar límite plan gratis
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.user.restaurantId },
    });
    if (restaurant?.plan === 'GRATIS') {
      const count = await prisma.menuItem.count({
        where: { category: { restaurantId: req.user.restaurantId } },
      });
      if (count >= 10) {
        throw new ApiError(402, 'Plan Gratis: máximo 10 items. Actualiza a Pro.');
      }
    }

    const { customization: customizationBody, ...itemFields } = data;
    const customization = toPrismaCustomization(customizationBody ?? undefined);

    const item = await prisma.menuItem.create({
      data: {
        ...itemFields,
        ...(customization !== undefined ? { customization } : {}),
      },
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

// PUT /api/dashboard/items/:id
router.put('/items/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.restaurantId) throw new NotFoundError('Restaurante');
    const itemId = getSingleParam(req.params.id);
    if (!itemId) throw new ApiError(400, 'ID de item inválido');
    const data = updateMenuItemSchema.parse(req.body);

    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { category: true },
    });
    if (!item || item.category.restaurantId !== req.user.restaurantId) throw new ForbiddenError();

    const { customization: customizationBody, ...patch } = data;
    const customization = toPrismaCustomization(customizationBody ?? undefined);

    const updated = await prisma.menuItem.update({
      where: { id: itemId },
      data: {
        ...patch,
        ...(customization !== undefined ? { customization } : {}),
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/dashboard/items/:id
router.delete('/items/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.restaurantId) throw new NotFoundError('Restaurante');
    const itemId = getSingleParam(req.params.id);
    if (!itemId) throw new ApiError(400, 'ID de item inválido');

    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { category: true },
    });
    if (!item || item.category.restaurantId !== req.user.restaurantId) throw new ForbiddenError();

    await prisma.menuItem.delete({ where: { id: itemId } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// POST /api/dashboard/upload-url — Presigned URL
router.post('/upload-url', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.restaurantId) throw new NotFoundError('Restaurante');

    const filename = String(req.body?.filename || '').trim();
    if (!filename) throw new ApiError(400, 'Nombre de archivo requerido');

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `restaurants/${req.user.restaurantId}/${Date.now()}-${safeName}`;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'nami-uploads';
    await ensureBucketExists(bucket);

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error) throw new ApiError(500, `Error al generar URL de upload: ${error.message}`);

    res.json({
      success: true,
      data: {
        signedUrl: data.signedUrl,
        path,
        publicUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
