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
  reorderCategoriesSchema,
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

/** Logo como data URL (mismo origen en el cliente) para QR / impresión sin problemas de CORS en canvas. */
router.get('/restaurant/logo-data', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.restaurantId) throw new NotFoundError('Restaurante');

    const row = await prisma.restaurant.findUnique({
      where: { id: req.user.restaurantId },
      select: { logoUrl: true },
    });
    const raw = row?.logoUrl?.trim();
    if (!raw) {
      res.json({ success: true, data: { dataUrl: null } });
      return;
    }

    let target: URL;
    try {
      target = new URL(raw);
    } catch {
      res.json({ success: true, data: { dataUrl: null } });
      return;
    }
    if (target.protocol !== 'http:' && target.protocol !== 'https:') {
      res.json({ success: true, data: { dataUrl: null } });
      return;
    }

    const controller = new AbortController();
    const kill = setTimeout(() => controller.abort(), 12_000);
    let fetchRes: globalThis.Response;
    try {
      fetchRes = await fetch(target.toString(), { signal: controller.signal });
    } finally {
      clearTimeout(kill);
    }
    if (!fetchRes.ok) {
      res.json({ success: true, data: { dataUrl: null } });
      return;
    }

    const buf = Buffer.from(await fetchRes.arrayBuffer());
    if (buf.length > 4 * 1024 * 1024) {
      throw new ApiError(413, 'El logo es demasiado grande');
    }
    const mime = fetchRes.headers.get('content-type')?.split(';')[0]?.trim() || 'image/png';
    if (!mime.startsWith('image/')) {
      res.json({ success: true, data: { dataUrl: null } });
      return;
    }

    const b64 = buf.toString('base64');
    res.json({ success: true, data: { dataUrl: `data:${mime};base64,${b64}` } });
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

    const agg = await prisma.menuCategory.aggregate({
      where: { restaurantId: req.user.restaurantId },
      _max: { order: true },
    });
    const nextOrder = (agg._max.order ?? -1) + 1;

    const category = await prisma.menuCategory.create({
      data: { restaurantId: req.user.restaurantId, name, order: nextOrder },
    });

    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/dashboard/categories/reorder — Orden del menú público
router.patch('/categories/reorder', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.restaurantId) throw new NotFoundError('Restaurante');
    const { categoryIds } = reorderCategoriesSchema.parse(req.body);
    const restaurantId = req.user.restaurantId;

    const existing = await prisma.menuCategory.findMany({
      where: { restaurantId },
      select: { id: true },
    });
    if (categoryIds.length !== existing.length) {
      throw new ApiError(400, 'Debes enviar todas las categorías en el orden deseado');
    }
    const set = new Set(existing.map((c) => c.id));
    if (new Set(categoryIds).size !== categoryIds.length) {
      throw new ApiError(400, 'categoryIds no debe tener duplicados');
    }
    for (const id of categoryIds) {
      if (!set.has(id)) throw new ApiError(400, 'ID de categoría inválido');
    }

    await prisma.$transaction(
      categoryIds.map((id, index) =>
        prisma.menuCategory.update({ where: { id }, data: { order: index } })
      )
    );

    res.json({ success: true });
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

// PATCH /api/dashboard/items/:id/toggle — Cambiar disponibilidad
router.patch('/items/:id/toggle', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.restaurantId) throw new NotFoundError('Restaurante');
    const itemId = getSingleParam(req.params.id);
    if (!itemId) throw new ApiError(400, 'ID de item inválido');

    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { category: true },
    });
    if (!item || item.category.restaurantId !== req.user.restaurantId) throw new ForbiddenError();

    const updated = await prisma.menuItem.update({
      where: { id: itemId },
      data: { isAvailable: !item.isAvailable },
    });

    res.json({ success: true, data: updated });
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
