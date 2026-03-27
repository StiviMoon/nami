import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { ApiError, NotFoundError } from '../../utils/errors';
import { getSingleParam, getSingleQuery } from '../../utils/http';

const router = Router();

// GET /api/restaurants — Feed público (con geolocalización opcional)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = getSingleQuery(req.query.category);
    const search = getSingleQuery(req.query.search);
    const limit = getSingleQuery(req.query.limit) || '20';
    const offset = getSingleQuery(req.query.offset) || '0';
    const lat = parseFloat(getSingleQuery(req.query.lat) || '');
    const lng = parseFloat(getSingleQuery(req.query.lng) || '');
    const hasGeo = !isNaN(lat) && !isNaN(lng);

    const take = Math.min(parseInt(limit, 10) || 20, 100);
    const skip = parseInt(offset, 10) || 0;

    // If user provided location, use raw SQL with Haversine for distance sorting
    if (hasGeo) {
      const conditions: string[] = ['"isActive" = true'];
      const params: (string | number)[] = [lat, lng];
      let paramIdx = 3;

      if (category && category !== 'all') {
        conditions.push(`"category" = $${paramIdx}`);
        params.push(category);
        paramIdx++;
      }
      if (search?.trim()) {
        conditions.push(`("name" ILIKE $${paramIdx} OR "description" ILIKE $${paramIdx})`);
        params.push(`%${search}%`);
        paramIdx++;
      }

      const whereClause = conditions.join(' AND ');
      params.push(take, skip);

      const restaurants = await prisma.$queryRawUnsafe<any[]>(
        `SELECT "id", "slug", "name", "description", "category", "address",
                "logoUrl" AS "logoUrl", "coverUrl" AS "coverUrl",
                "themePreset" AS "themePreset", "menuStyle" AS "menuStyle",
                "plan", "isClosed" AS "isClosed", "whatsapp",
                "latitude", "longitude",
                CASE WHEN "latitude" IS NOT NULL AND "longitude" IS NOT NULL THEN
                  (6371 * acos(
                    LEAST(1, cos(radians($1)) * cos(radians("latitude")) *
                    cos(radians("longitude") - radians($2)) +
                    sin(radians($1)) * sin(radians("latitude")))
                  ))
                ELSE NULL END AS "distance"
         FROM "restaurants"
         WHERE ${whereClause}
         ORDER BY "plan" DESC,
                  CASE WHEN "latitude" IS NOT NULL AND "longitude" IS NOT NULL THEN
                    (6371 * acos(
                      LEAST(1, cos(radians($1)) * cos(radians("latitude")) *
                      cos(radians("longitude") - radians($2)) +
                      sin(radians($1)) * sin(radians("latitude")))
                    ))
                  ELSE 999999 END ASC
         LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
        ...params
      );

      // Round distance
      const formatted = restaurants.map((r) => ({
        ...r,
        distance: r.distance !== null ? Math.round(r.distance * 10) / 10 : null,
      }));

      const countResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
        `SELECT COUNT(*) as count FROM "restaurants" WHERE ${whereClause}`,
        ...params.slice(0, -2)
      );

      res.json({ success: true, data: { restaurants: formatted, total: Number(countResult[0].count) } });
    } else {
      // Standard Prisma query (no geo)
      const where: any = { isActive: true };
      if (category && category !== 'all') where.category = category;
      if (search?.trim()) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [restaurants, total] = await Promise.all([
        prisma.restaurant.findMany({
          where,
          select: {
            id: true,
            slug: true,
            name: true,
            description: true,
            category: true,
            address: true,
            logoUrl: true,
            coverUrl: true,
            themePreset: true,
            menuStyle: true,
            plan: true,
            isClosed: true,
            whatsapp: true,
            latitude: true,
            longitude: true,
          },
          orderBy: [{ plan: 'desc' }, { updatedAt: 'desc' }],
          take,
          skip,
        }),
        prisma.restaurant.count({ where }),
      ]);

      res.json({ success: true, data: { restaurants, total } });
    }
  } catch (err) {
    next(err);
  }
});

// GET /api/restaurants/categories — Categorías únicas
router.get('/categories', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.restaurant.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });
    res.json({ success: true, data: categories.map((c) => c.category) });
  } catch (err) {
    next(err);
  }
});

// GET /api/restaurants/:slug — Restaurante por slug
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = getSingleParam(req.params.slug);
    if (!slug) throw new ApiError(400, 'Slug inválido');
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
    });
    if (!restaurant) throw new NotFoundError('Restaurante');
    res.json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
});

export default router;
