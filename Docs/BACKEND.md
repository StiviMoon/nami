# ÑAMI — Backend API Specification

**Versión:** 2.0
**Fecha:** 26 marzo 2026
**Stack:** Express + TypeScript + Prisma + Supabase

---

## 1. Setup inicial

### 1.1 Stack y dependencias

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "typescript": "^5.3.0",
    "@prisma/client": "^5.7.0",
    "@supabase/supabase-js": "^2.38.0",
    "dotenv": "^16.3.0",
    "zod": "^3.22.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "ts-node": "^10.9.0",
    "nodemon": "^3.0.0",
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0"
  }
}
```

### 1.2 Configuración inicial

**`src/index.ts`** (entry point):
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import restaurantRouter from './modules/restaurants/router';
import menuRouter from './modules/menu/router';
import authRouter from './modules/auth/router';
import dashboardRouter from './modules/dashboard/router';
import adminRouter from './modules/admin/router';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));

// Routes
app.use('/api/restaurants', restaurantRouter);
app.use('/api/menu', menuRouter);
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handler (último middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

---

## 2. Tipos compartidos

**`src/types.ts`**:
```typescript
export interface ApiResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  restaurantId?: string;
  role: 'OWNER' | 'ADMIN';
}

export enum Plan {
  GRATIS = 'GRATIS',
  PRO = 'PRO',
}
```

---

## 3. Middleware

### 3.1 Authentication

**`src/middleware/auth.ts`**:
```typescript
import { Request, Response, NextFunction } from 'express';
import { jwtDecode } from 'jwt-decode';
import { ApiError } from '../utils/errors';

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token ||
                  req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Token no encontrado');
    }

    // Verify con Supabase JWT secret
    const decoded = jwtDecode<AuthPayload>(token);
    req.auth = decoded;
    next();
  } catch (err) {
    throw new ApiError(401, 'Token inválido o expirado');
  }
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token ||
                  req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      req.auth = jwtDecode<AuthPayload>(token);
    }
  } catch (err) {
    // Ignore, auth es opcional
  }
  next();
};
```

### 3.2 Error Handler

**`src/middleware/errorHandler.ts`**:
```typescript
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    timestamp: new Date().toISOString(),
  });
};
```

---

## 4. Módulos

### 4.1 Restaurants (público)

#### 4.1.1 Controller: `src/modules/restaurants/controller.ts`

```typescript
import { Request, Response } from 'express';
import { RestaurantService } from './service';

export class RestaurantController {
  constructor(private service: RestaurantService) {}

  // GET /api/restaurants?category=...&search=...
  async list(req: Request, res: Response) {
    const { category, search, limit = 20, offset = 0 } = req.query;

    const data = await this.service.list({
      category: category as string,
      search: search as string,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // GET /api/restaurants/:slug
  async getBySlug(req: Request, res: Response) {
    const { slug } = req.params;
    const data = await this.service.getBySlug(slug);

    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  }
}
```

#### 4.1.2 Service: `src/modules/restaurants/service.ts`

```typescript
import { prisma } from '../../config/database';
import { ApiError } from '../../utils/errors';

export class RestaurantService {
  async list(filters: {
    category?: string;
    search?: string;
    limit: number;
    offset: number;
  }) {
    const where: any = { isActive: true };

    if (filters.category) where.category = filters.category;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        logoUrl: true,
        plan: true,
        isClosed: true,
      },
      orderBy: [
        { plan: 'desc' }, // PRO primero
        { updatedAt: 'desc' },
      ],
      take: filters.limit,
      skip: filters.offset,
    });

    return restaurants;
  }

  async getBySlug(slug: string) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        address: true,
        whatsapp: true,
        category: true,
        logoUrl: true,
        coverUrl: true,
        isClosed: true,
        plan: true,
      },
    });

    if (!restaurant) {
      throw new ApiError(404, 'Restaurante no encontrado');
    }

    return restaurant;
  }
}
```

#### 4.1.3 Router: `src/modules/restaurants/router.ts`

```typescript
import { Router } from 'express';
import { RestaurantController } from './controller';
import { RestaurantService } from './service';
import { optionalAuth } from '../../middleware/auth';

const router = Router();
const service = new RestaurantService();
const controller = new RestaurantController(service);

router.get('/', (req, res) => controller.list(req, res));
router.get('/:slug', (req, res) => controller.getBySlug(req, res));

export default router;
```

---

### 4.2 Menu (público)

#### 4.2.1 Controller: `src/modules/menu/controller.ts`

```typescript
import { Request, Response } from 'express';
import { MenuService } from './service';

export class MenuController {
  constructor(private service: MenuService) {}

  // GET /api/menu/restaurants/:restaurantId
  async getRestaurantMenu(req: Request, res: Response) {
    const { restaurantId } = req.params;
    const data = await this.service.getRestaurantMenu(restaurantId);

    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  }
}
```

#### 4.2.2 Service: `src/modules/menu/service.ts`

```typescript
import { prisma } from '../../config/database';
import { ApiError } from '../../utils/errors';

export class MenuService {
  async getRestaurantMenu(restaurantId: string) {
    const categories = await prisma.menuCategory.findMany({
      where: { restaurantId },
      include: {
        items: {
          where: { isAvailable: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    return categories;
  }
}
```

---

### 4.3 Auth

#### 4.3.1 Controller: `src/modules/auth/controller.ts`

```typescript
import { Request, Response } from 'express';
import { AuthService } from './service';
import { registerSchema, loginSchema } from './validators';

export class AuthController {
  constructor(private service: AuthService) {}

  // POST /api/auth/register
  async register(req: Request, res: Response) {
    const body = registerSchema.parse(req.body);
    const data = await this.service.register(body);

    // Set HttpOnly cookie
    res.cookie('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      data: { user: data.user },
      timestamp: new Date().toISOString(),
    });
  }

  // POST /api/auth/login
  async login(req: Request, res: Response) {
    const body = loginSchema.parse(req.body);
    const data = await this.service.login(body);

    res.cookie('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: { user: data.user },
      timestamp: new Date().toISOString(),
    });
  }

  // POST /api/auth/logout
  async logout(req: Request, res: Response) {
    res.clearCookie('token');
    res.json({ success: true });
  }
}
```

#### 4.3.2 Service: `src/modules/auth/service.ts`

```typescript
import { prisma } from '../../config/database';
import { supabase } from '../../config/supabase';
import { ApiError } from '../../utils/errors';

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    restaurantName: string;
    whatsapp: string;
    address: string;
    category: string;
  }) {
    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signUpWithPassword({
        email: data.email,
        password: data.password,
      });

    if (authError) throw new ApiError(400, authError.message);

    // Crear usuario en BD
    const user = await prisma.user.create({
      data: {
        email: data.email,
        supabaseId: authData.user!.id,
        role: 'OWNER',
        restaurant: {
          create: {
            slug: this.generateSlug(data.restaurantName),
            name: data.restaurantName,
            whatsapp: data.whatsapp,
            address: data.address,
            category: data.category,
          },
        },
      },
      include: { restaurant: true },
    });

    const token = authData.session?.access_token!;
    return { user, token };
  }

  async login(data: { email: string; password: string }) {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

    if (authError) throw new ApiError(401, 'Credenciales inválidas');

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { restaurant: true },
    });

    const token = authData.session?.access_token!;
    return { user, token };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .slice(0, 50);
  }
}
```

#### 4.3.3 Validators: `src/modules/auth/validators.ts`

```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  restaurantName: z.string().min(3),
  whatsapp: z.string().regex(/^\+573\d{9}$/, 'WhatsApp inválido'),
  address: z.string().min(5),
  category: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
```

---

### 4.4 Dashboard (restaurante autenticado)

#### 4.4.1 Controller: `src/modules/dashboard/controller.ts`

```typescript
import { Request, Response } from 'express';
import { DashboardService } from './service';
import { z } from 'zod';

export class DashboardController {
  constructor(private service: DashboardService) {}

  // GET /api/dashboard/restaurant
  async getRestaurant(req: Request, res: Response) {
    const restaurantId = req.auth?.restaurantId;
    const data = await this.service.getRestaurant(restaurantId!);

    res.json({ success: true, data });
  }

  // PUT /api/dashboard/restaurant
  async updateRestaurant(req: Request, res: Response) {
    const restaurantId = req.auth?.restaurantId;
    const data = await this.service.updateRestaurant(
      restaurantId!,
      req.body
    );

    res.json({ success: true, data });
  }

  // POST /api/dashboard/menu/categories
  async createCategory(req: Request, res: Response) {
    const restaurantId = req.auth?.restaurantId;
    const { name } = req.body;
    const data = await this.service.createCategory(restaurantId!, name);

    res.status(201).json({ success: true, data });
  }

  // POST /api/dashboard/menu/items
  async createMenuItem(req: Request, res: Response) {
    const restaurantId = req.auth?.restaurantId;
    const data = await this.service.createMenuItem(restaurantId!, req.body);

    // Validar límite según plan
    const count = await this.service.countMenuItems(restaurantId!);
    const restaurant = await this.service.getRestaurant(restaurantId!);

    if (restaurant.plan === 'GRATIS' && count > 10) {
      throw new Error('Plan Gratis: máximo 10 items');
    }

    res.status(201).json({ success: true, data });
  }

  // PUT /api/dashboard/menu/items/:itemId
  async updateMenuItem(req: Request, res: Response) {
    const { itemId } = req.params;
    const restaurantId = req.auth?.restaurantId;
    const data = await this.service.updateMenuItem(
      restaurantId!,
      itemId,
      req.body
    );

    res.json({ success: true, data });
  }

  // DELETE /api/dashboard/menu/items/:itemId
  async deleteMenuItem(req: Request, res: Response) {
    const { itemId } = req.params;
    const restaurantId = req.auth?.restaurantId;
    await this.service.deleteMenuItem(restaurantId!, itemId);

    res.json({ success: true });
  }

  // POST /api/dashboard/upload-sign
  async getUploadSignedUrl(req: Request, res: Response) {
    const { filename, filetype } = req.body;
    const restaurantId = req.auth?.restaurantId;
    const url = await this.service.getSignedUrl(
      restaurantId!,
      filename,
      filetype
    );

    res.json({ success: true, data: { url } });
  }
}
```

#### 4.4.2 Service: `src/modules/dashboard/service.ts`

```typescript
import { prisma } from '../../config/database';
import { supabase } from '../../config/supabase';
import { ApiError } from '../../utils/errors';

export class DashboardService {
  async getRestaurant(restaurantId: string) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        categories: {
          include: { items: true },
        },
      },
    });

    if (!restaurant) {
      throw new ApiError(404, 'Restaurante no encontrado');
    }

    return restaurant;
  }

  async updateRestaurant(restaurantId: string, data: any) {
    return await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        whatsapp: data.whatsapp,
        category: data.category,
        logoUrl: data.logoUrl,
        coverUrl: data.coverUrl,
        isClosed: data.isClosed,
      },
    });
  }

  async createCategory(restaurantId: string, name: string) {
    return await prisma.menuCategory.create({
      data: {
        name,
        restaurantId,
        order: 0,
      },
    });
  }

  async createMenuItem(restaurantId: string, data: any) {
    const category = await prisma.menuCategory.findUnique({
      where: { id: data.categoryId },
    });

    if (!category || category.restaurantId !== restaurantId) {
      throw new ApiError(403, 'No autorizado');
    }

    return await prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        isAvailable: true,
        order: 0,
      },
    });
  }

  async updateMenuItem(
    restaurantId: string,
    itemId: string,
    data: any
  ) {
    // Validar que el item pertenece al restaurante
    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { category: true },
    });

    if (!item || item.category.restaurantId !== restaurantId) {
      throw new ApiError(403, 'No autorizado');
    }

    return await prisma.menuItem.update({
      where: { id: itemId },
      data: {
        name: data.name,
        description: data.description,
        price: data.price ? parseFloat(data.price) : undefined,
        imageUrl: data.imageUrl,
        isAvailable: data.isAvailable,
      },
    });
  }

  async deleteMenuItem(restaurantId: string, itemId: string) {
    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: { category: true },
    });

    if (!item || item.category.restaurantId !== restaurantId) {
      throw new ApiError(403, 'No autorizado');
    }

    await prisma.menuItem.delete({ where: { id: itemId } });
  }

  async countMenuItems(restaurantId: string): Promise<number> {
    return await prisma.menuItem.count({
      where: {
        category: { restaurantId },
      },
    });
  }

  async getSignedUrl(
    restaurantId: string,
    filename: string,
    filetype: string
  ): Promise<string> {
    const path = `restaurants/${restaurantId}/${Date.now()}-${filename}`;

    const { data, error } = await supabase.storage
      .from('nami-uploads')
      .createSignedUploadUrl(path);

    if (error) throw new ApiError(500, 'Error al generar URL');

    return data.signedUrl;
  }
}
```

---

### 4.5 Admin

#### 4.5.1 Controller: `src/modules/admin/controller.ts`

```typescript
import { Request, Response } from 'express';
import { AdminService } from './service';

export class AdminController {
  constructor(private service: AdminService) {}

  // GET /api/admin/restaurants
  async listRestaurants(req: Request, res: Response) {
    if (req.auth?.role !== 'ADMIN') {
      throw new ApiError(403, 'Solo admins');
    }

    const data = await this.service.listAllRestaurants();
    res.json({ success: true, data });
  }

  // PUT /api/admin/restaurants/:restaurantId/plan
  async changePlan(req: Request, res: Response) {
    if (req.auth?.role !== 'ADMIN') {
      throw new ApiError(403, 'Solo admins');
    }

    const { restaurantId } = req.params;
    const { plan } = req.body;
    const data = await this.service.changePlan(restaurantId, plan);

    res.json({ success: true, data });
  }
}
```

#### 4.5.2 Service: `src/modules/admin/service.ts`

```typescript
import { prisma } from '../../config/database';

export class AdminService {
  async listAllRestaurants() {
    return await prisma.restaurant.findMany({
      include: { owner: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async changePlan(restaurantId: string, plan: 'GRATIS' | 'PRO') {
    return await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { plan },
    });
  }
}
```

---

## 5. Utilidades

### 5.1 Errors

**`src/utils/errors.ts`**:
```typescript
export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}
```

### 5.2 Database Config

**`src/config/database.ts`**:
```typescript
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['info'] : [],
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
```

### 5.3 Supabase Config

**`src/config/supabase.ts`**:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
```

---

## 6. Tabla de endpoints

| Método | Ruta | Auth | Responsabilidad |
|---|---|---|---|
| GET | `/api/restaurants` | No | Listar restaurantes (feed) |
| GET | `/api/restaurants/:slug` | No | Perfil del restaurante |
| GET | `/api/menu/restaurants/:id` | No | Menú del restaurante |
| POST | `/api/auth/register` | No | Crear cuenta restaurante |
| POST | `/api/auth/login` | No | Login restaurante |
| POST | `/api/auth/logout` | Sí (Owner) | Logout |
| GET | `/api/dashboard/restaurant` | Sí (Owner) | Info del restaurante |
| PUT | `/api/dashboard/restaurant` | Sí (Owner) | Editar restaurante |
| POST | `/api/dashboard/menu/categories` | Sí (Owner) | Crear categoría |
| POST | `/api/dashboard/menu/items` | Sí (Owner) | Crear item |
| PUT | `/api/dashboard/menu/items/:id` | Sí (Owner) | Editar item |
| DELETE | `/api/dashboard/menu/items/:id` | Sí (Owner) | Borrar item |
| POST | `/api/dashboard/upload-sign` | Sí (Owner) | Generar URL presigned |
| GET | `/api/admin/restaurants` | Sí (Admin) | Listar todos (admin) |
| PUT | `/api/admin/restaurants/:id/plan` | Sí (Admin) | Cambiar plan |

