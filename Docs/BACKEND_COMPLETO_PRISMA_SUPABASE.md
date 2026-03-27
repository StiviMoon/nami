# ÑAMI — Backend Completo: Prisma + Supabase (Arquitectura Ejecutable)

**Versión:** 2.0
**Fecha:** 26 marzo 2026
**Scope:** Backend production-ready con Prisma + Supabase

---

## 1. Setup Supabase (paso a paso)

### 1.1 Crear proyecto en Supabase

```bash
# 1. Ir a https://supabase.com/dashboard
# 2. Crear nuevo proyecto:
#    - Nombre: nami
#    - Password: (guardarlo seguro)
#    - Region: us-east-1 (o la más cercana a tu audiencia)
#    - Pricing: Free (escalable)

# 3. Esperar ~2 minutos a que inicialice
# 4. Copiar credenciales en Settings → API
```

### 1.2 Credenciales necesarias

**En Supabase dashboard → Settings → API:**

```env
# Copiar estos valores a apps/api/.env.local

# URLs
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co

# API Keys
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Secret (en Settings → API → JWT Secret)
SUPABASE_JWT_SECRET=super-secret-key-xxx

# Database (en Settings → Database)
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

### 1.3 Habilitar Auth en Supabase

```
Dashboard → Authentication → Providers
  ✅ Email/Password (ON)
  ✅ Phone (OFF por ahora)
  ✅ OAuth (OFF por ahora)

Settings → Auth → Email Template
  - Customizar si deseas (dejar default es OK)
```

### 1.4 Crear Storage bucket

```
Dashboard → Storage → New bucket
  - Name: nami-uploads
  - Public: false (abierto solo con presigned URLs)
  - File size limit: 10 MB
```

---

## 2. Prisma Schema Completo

### 2.1 Inicializar Prisma

```bash
cd apps/api
npx prisma init
```

### 2.2 Schema.prisma — Tabla por tabla

**`apps/api/prisma/schema.prisma`:**

```prisma
// Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_DIRECT_URL")
}

// ============================================================================
// ENUMS
// ============================================================================

enum Role {
  OWNER
  ADMIN
}

enum Plan {
  GRATIS
  PRO
}

// ============================================================================
// USERS & RESTAURANTS
// ============================================================================

/// Usuario dueño de restaurante o admin
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  supabaseId    String   @unique @db.Uuid
  role          Role     @default(OWNER)

  // Relación a restaurante
  restaurant    Restaurant?

  // Metadata
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([supabaseId])
  @@map("users")
}

/// Restaurante (negocio)
model Restaurant {
  id            String     @id @default(cuid())

  // Identidad
  slug          String     @unique @db.VarChar(100)
  name          String     @db.VarChar(255)
  description   String?    @db.Text

  // Ubicación & Contacto
  address       String     @db.VarChar(500)
  whatsapp      String     @db.VarChar(20) // +573xxxxxxxxx
  category      String     @db.VarChar(50) // "Hamburguesas", "Panadería", etc.

  // Imágenes
  logoUrl       String?    @db.VarChar(500)  // URL a Supabase Storage
  coverUrl      String?    @db.VarChar(500)  // URL a Supabase Storage

  // Estado
  plan          Plan       @default(GRATIS)
  isActive      Boolean    @default(true)
  isClosed      Boolean    @default(false)   // Toggle abierto/cerrado

  // Relaciones
  owner         User       @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  ownerId       String     @unique

  categories    MenuCategory[]

  // Metadata
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  @@index([ownerId])
  @@index([slug])
  @@index([category])
  @@index([plan])
  @@index([isActive])
  @@map("restaurants")
}

// ============================================================================
// MENU
// ============================================================================

/// Categoría del menú (ej: "Platos principales", "Bebidas")
model MenuCategory {
  id            String     @id @default(cuid())

  name          String     @db.VarChar(100)
  description   String?    @db.Text
  order         Int        @default(0)      // Para reordenar

  // Relación a restaurante
  restaurant    Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  restaurantId  String

  // Relación a items
  items         MenuItem[]

  // Metadata
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  @@unique([restaurantId, name])
  @@index([restaurantId])
  @@map("menu_categories")
}

/// Item del menú (ej: "Bandeja Paisa", "Jugo de Lulo")
model MenuItem {
  id            String     @id @default(cuid())

  name          String     @db.VarChar(255)
  description   String?    @db.Text
  price         Decimal    @db.Decimal(10, 2) // $XXX.XX
  imageUrl      String?    @db.VarChar(500)   // URL a Supabase Storage

  isAvailable   Boolean    @default(true)
  order         Int        @default(0)

  // Relación a categoría
  category      MenuCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  categoryId    String

  // Metadata
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  @@index([categoryId])
  @@index([isAvailable])
  @@map("menu_items")
}

// ============================================================================
// ORDERS (futuro, para tracking básico - Fase 3)
// ============================================================================

enum OrderStatus {
  PENDING      // Cliente envió por WhatsApp
  ACCEPTED     // Restaurante confirmó
  PREPARING    // En preparación
  READY        // Listo para recoger/entregar
  COMPLETED    // Entregado
  CANCELLED    // Cancelado
}

model Order {
  id            String     @id @default(cuid())

  // Cliente (sin registro)
  clientName    String     @db.VarChar(255)
  clientPhone   String     @db.VarChar(20)

  // Restaurante
  restaurant    Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  restaurantId  String

  // Items ordenados (JSON array)
  items         Json       // [{ itemId, name, price, quantity }]

  // Detalles
  totalPrice    Decimal    @db.Decimal(10, 2)
  paymentMethod String     @db.VarChar(50) // "nequi", "efectivo", "transferencia"
  deliveryMode  String     @db.VarChar(20) // "delivery", "recoger"

  // Dirección (si es delivery)
  deliveryAddress String?  @db.VarChar(500)

  // Estado
  status        OrderStatus @default(PENDING)
  notes         String?    @db.Text

  // Metadata
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  @@index([restaurantId])
  @@index([status])
  @@index([createdAt])
  @@map("orders")
}

// ============================================================================
// ANALYTICS (futuro - Fase 3)
// ============================================================================

model AnalyticsEvent {
  id            String     @id @default(cuid())

  event         String     @db.VarChar(100) // "feed_view", "restaurant_view", "order_sent"
  restaurantId  String?
  metadata      Json?      // { userId, sessionId, ... }

  createdAt     DateTime   @default(now())

  @@index([restaurantId])
  @@index([event])
  @@index([createdAt])
  @@map("analytics_events")
}
```

### 2.3 Notas sobre el schema

**Decisiones importantes:**

1. **Slug vs ID:** `slug` es unique y human-readable para URLs (`nami.app/el-rincon-paisa`)
2. **Decimal para precios:** `Decimal(10, 2)` para evitar float errors en dinero
3. **JSON para items en Order:** Flexibilidad (futuro: agregar variantes, tamaños, etc.)
4. **Índices estratégicos:** En foreign keys, enums, búsquedas comunes
5. **Soft deletes:** No implementados (simple: `isActive = false`)
6. **Timestamps automáticos:** `createdAt`, `updatedAt` en todos los modelos
7. **CUID para IDs:** Mejor que UUID (más corto, ordenado por tiempo)
8. **@map para tablas:** Convenio snake_case en BD, camelCase en Prisma

---

## 3. Estructura de carpetas Backend (Detallada)

```
apps/api/
├── src/
│   ├── index.ts                    # Entry point (express app)
│   ├── types.ts                    # TypeScript types globales
│   │
│   ├── config/
│   │   ├── database.ts             # Prisma client + shutdown
│   │   ├── supabase.ts             # Supabase client
│   │   └── env.ts                  # Validar environment variables
│   │
│   ├── middleware/
│   │   ├── auth.ts                 # JWT verification
│   │   ├── errorHandler.ts         # Global error handler
│   │   ├── requestLogger.ts        # Log de requests (opcional)
│   │   └── rateLimit.ts            # Rate limiting (Fase 3)
│   │
│   ├── modules/                    # Feature-based architecture
│   │   │
│   │   ├── restaurants/
│   │   │   ├── controller.ts       # Handlers HTTP
│   │   │   ├── service.ts          # Business logic
│   │   │   ├── validators.ts       # Zod schemas
│   │   │   └── router.ts           # Express routes
│   │   │
│   │   ├── menu/
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── validators.ts
│   │   │   └── router.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── validators.ts
│   │   │   └── router.ts
│   │   │
│   │   ├── dashboard/              # Restaurante autenticado
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── validators.ts
│   │   │   └── router.ts
│   │   │
│   │   ├── admin/                  # Admin panel
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   └── router.ts
│   │   │
│   │   └── health/                 # Health checks
│   │       └── router.ts
│   │
│   ├── utils/
│   │   ├── errors.ts               # Custom error classes
│   │   ├── response.ts             # ApiResult wrapper
│   │   ├── validators.ts           # Zod schemas compartidas
│   │   ├── storage.ts              # Supabase Storage helpers
│   │   ├── slug.ts                 # Generar slugs
│   │   └── logger.ts               # Winston/Pino logger
│   │
│   ├── services/
│   │   ├── supabaseAuth.ts         # Wrapper para Supabase Auth
│   │   └── storage.ts              # Wrapper para Storage
│   │
│   └── seeds/                      # Seeders (datos de prueba)
│       ├── seed.ts
│       └── data.ts
│
├── prisma/
│   ├── schema.prisma               # Schema (ya creado)
│   └── migrations/
│       └── (automático)
│
├── .env.local                      # Environment (no versionar)
├── .env.local.example              # Template
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md                       # Instrucciones setup
```

---

## 4. Código Backend Completo (Módulo por módulo)

### 4.1 Config files

#### `src/config/database.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['info', 'warn', 'error']
        : ['error'],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
};

export const prisma =
  globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production')
  globalThis.prismaGlobal = prisma;

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 SIGINT: desconectando Prisma...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM: desconectando Prisma...');
  await prisma.$disconnect();
  process.exit(0);
});
```

#### `src/config/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

#### `src/config/env.ts`

```typescript
import { z } from 'zod';

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.string().default('3000'),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_JWT_SECRET: z.string(),
  DATABASE_URL: z.string().url(),

  // CORS
  ALLOWED_ORIGINS: z.string().default('http://localhost:3001,http://localhost:3002'),

  // Storage
  SUPABASE_STORAGE_BUCKET: z.string().default('nami-uploads'),
});

export const env = envSchema.parse(process.env);
```

### 4.2 Middleware

#### `src/middleware/auth.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { jwtDecode } from 'jwt-decode';
import { ApiError } from '../utils/errors';

export interface AuthPayload {
  sub: string; // user ID
  email: string;
  role: 'authenticated' | 'anon';
  aud: 'authenticated' | 'anon';
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload & { userId: string };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obtener token de header o cookie
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Token no proporcionado');
    }

    // Decodificar (NO verificar aquí, Supabase ya lo verificó)
    const decoded = jwtDecode<AuthPayload>(token);

    // Adjuntar al request
    req.auth = {
      ...decoded,
      userId: decoded.sub,
    };

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
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const decoded = jwtDecode<AuthPayload>(token);
      req.auth = {
        ...decoded,
        userId: decoded.sub,
      };
    }
  } catch (err) {
    // Ignorar si falla, auth es opcional
  }
  next();
};
```

#### `src/middleware/errorHandler.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // ApiError personalizado
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validación fallida',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
      timestamp: new Date().toISOString(),
    });
  }

  // Error genérico
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    timestamp: new Date().toISOString(),
  });
};
```

### 4.3 Utils

#### `src/utils/errors.ts`

```typescript
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, `${resource} no encontrado`);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'No autorizado') {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Acceso denegado') {
    super(403, message);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message);
  }
}
```

#### `src/utils/storage.ts`

```typescript
import { supabaseAdmin } from '../config/supabase';
import { ApiError } from './errors';
import { env } from '../config/env';

export class StorageService {
  /**
   * Genera URL presigned para upload (cliente sube directamente a Supabase)
   */
  async getSignedUploadUrl(
    restaurantId: string,
    filename: string,
    mimeType: string
  ): Promise<string> {
    const path = `restaurants/${restaurantId}/${Date.now()}-${filename}`;

    const { data, error } = await supabaseAdmin.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .createSignedUploadUrl(path);

    if (error) {
      throw new ApiError(500, `Error al generar URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  /**
   * Obtiene URL pública de una imagen ya subida
   */
  getPublicUrl(path: string): string {
    const { data } = supabaseAdmin.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Elimina archivo de storage
   */
  async deleteFile(path: string): Promise<void> {
    const { error } = await supabaseAdmin.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .remove([path]);

    if (error) {
      console.warn(`Error al eliminar ${path}:`, error);
    }
  }
}

export const storageService = new StorageService();
```

#### `src/utils/slug.ts`

```typescript
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/\s+/g, '-')             // Espacios → guiones
    .replace(/[^\w-]/g, '')           // Caracteres especiales
    .replace(/-+/g, '-')              // Múltiples guiones → uno
    .slice(0, 100);                   // Máximo 100 chars
}

// Ejemplo:
// generateSlug("El Rincón Paisa") → "el-rincon-paisa"
```

### 4.4 Auth Module

#### `src/modules/auth/validators.ts`

```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  restaurantName: z.string().min(3, 'Mínimo 3 caracteres'),
  whatsapp: z
    .string()
    .regex(/^\+573\d{9}$/, 'WhatsApp debe ser +57 3XXXXXXXXX'),
  address: z.string().min(5, 'Dirección mínima 5 caracteres'),
  category: z.string().min(3, 'Categoría requerida'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
```

#### `src/modules/auth/service.ts`

```typescript
import { supabase, supabaseAdmin } from '../../config/supabase';
import { prisma } from '../../config/database';
import { generateSlug } from '../../utils/slug';
import { ApiError, ValidationError } from '../../utils/errors';
import { RegisterInput, LoginInput } from './validators';

export class AuthService {
  /**
   * Registrar nuevo restaurante
   */
  async register(input: RegisterInput) {
    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true, // Auto-confirm en desarrollo
      });

    if (authError) {
      throw new ApiError(400, `Auth error: ${authError.message}`);
    }

    try {
      // 2. Crear usuario en BD
      const user = await prisma.user.create({
        data: {
          email: input.email,
          supabaseId: authData.user!.id,
          role: 'OWNER',
          restaurant: {
            create: {
              slug: generateSlug(input.restaurantName),
              name: input.restaurantName,
              whatsapp: input.whatsapp,
              address: input.address,
              category: input.category,
            },
          },
        },
        include: { restaurant: true },
      });

      // 3. Obtener token
      const { data: sessionData } =
        await supabaseAdmin.auth.admin.generateLink({
          type: 'magiclink',
          email: input.email,
        });

      // En realidad, para login automático usamos:
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      return {
        user,
        token: signInData?.session?.access_token,
      };
    } catch (err) {
      // Rollback: eliminar usuario Supabase si la BD falla
      await supabaseAdmin.auth.admin.deleteUser(authData.user!.id);
      throw err;
    }
  }

  /**
   * Login restaurante
   */
  async login(input: LoginInput) {
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

    if (signInError) {
      throw new ApiError(401, 'Email o contraseña incorrectos');
    }

    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { restaurant: true },
    });

    if (!user) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    return {
      user,
      token: signInData.session?.access_token,
    };
  }

  /**
   * Logout (revocar token en Supabase)
   */
  async logout(token: string) {
    // Supabase maneja logout en cliente, aquí es informativo
    return { success: true };
  }
}

export const authService = new AuthService();
```

#### `src/modules/auth/controller.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { authService } from './service';
import { registerSchema, loginSchema } from './validators';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = registerSchema.parse(req.body);
      const result = await authService.register(body);

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            restaurant: result.user.restaurant,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = loginSchema.parse(req.body);
      const result = await authService.login(body);

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            restaurant: result.user.restaurant,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('token');
      res.json({
        success: true,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
```

#### `src/modules/auth/router.ts`

```typescript
import { Router } from 'express';
import { authController } from './controller';

const router = Router();

router.post('/register', (req, res, next) =>
  authController.register(req, res, next)
);
router.post('/login', (req, res, next) =>
  authController.login(req, res, next)
);
router.post('/logout', (req, res, next) =>
  authController.logout(req, res, next)
);

export default router;
```

### 4.5 Restaurants Module (Público)

#### `src/modules/restaurants/service.ts`

```typescript
import { prisma } from '../../config/database';
import { NotFoundError } from '../../utils/errors';

interface ListFilters {
  category?: string;
  search?: string;
  limit: number;
  offset: number;
}

export class RestaurantService {
  /**
   * Listar restaurantes (feed público)
   */
  async list(filters: ListFilters) {
    const where: any = { isActive: true };

    if (filters.category && filters.category !== 'all') {
      where.category = filters.category;
    }

    if (filters.search && filters.search.trim()) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        select: {
          id: true,
          slug: true,
          name: true,
          category: true,
          logoUrl: true,
          plan: true,
          isClosed: true,
          _count: { select: { categories: true } },
        },
        orderBy: [
          { plan: 'desc' }, // PRO primero
          { updatedAt: 'desc' },
        ],
        take: filters.limit,
        skip: filters.offset,
      }),
      prisma.restaurant.count({ where }),
    ]);

    return {
      data: restaurants,
      total,
      limit: filters.limit,
      offset: filters.offset,
    };
  }

  /**
   * Obtener restaurante por slug
   */
  async getBySlug(slug: string) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: {
        _count: { select: { categories: true } },
      },
    });

    if (!restaurant) {
      throw new NotFoundError('Restaurante');
    }

    return restaurant;
  }

  /**
   * Listar categorías de un restaurante
   */
  async getCategories(restaurantId: string) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundError('Restaurante');
    }

    return await prisma.menuCategory.findMany({
      where: { restaurantId },
      orderBy: { order: 'asc' },
    });
  }
}

export const restaurantService = new RestaurantService();
```

#### `src/modules/restaurants/controller.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { restaurantService } from './service';

export class RestaurantController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, search, limit = '20', offset = '0' } = req.query;

      const result = await restaurantService.list({
        category: category as string,
        search: search as string,
        limit: Math.min(parseInt(limit as string), 100),
        offset: parseInt(offset as string),
      });

      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const restaurant = await restaurantService.getBySlug(slug);

      res.json({
        success: true,
        data: restaurant,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { restaurantId } = req.params;
      const categories = await restaurantService.getCategories(restaurantId);

      res.json({
        success: true,
        data: categories,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
}

export const restaurantController = new RestaurantController();
```

#### `src/modules/restaurants/router.ts`

```typescript
import { Router } from 'express';
import { restaurantController } from './controller';

const router = Router();

// Público
router.get('/', (req, res, next) =>
  restaurantController.list(req, res, next)
);
router.get('/:slug', (req, res, next) =>
  restaurantController.getBySlug(req, res, next)
);
router.get('/:restaurantId/categories', (req, res, next) =>
  restaurantController.getCategories(req, res, next)
);

export default router;
```

### 4.6 Dashboard Module (Autenticado)

#### `src/modules/dashboard/service.ts`

```typescript
import { prisma } from '../../config/database';
import { storageService } from '../../utils/storage';
import { ApiError, ForbiddenError, NotFoundError } from '../../utils/errors';
import { Plan } from '@prisma/client';

export class DashboardService {
  /**
   * Obtener restaurante autenticado
   */
  async getRestaurant(restaurantId: string) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        categories: {
          include: {
            items: { orderBy: { order: 'asc' } },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundError('Restaurante');
    }

    return restaurant;
  }

  /**
   * Actualizar perfil restaurante
   */
  async updateRestaurant(
    restaurantId: string,
    data: {
      name?: string;
      description?: string;
      address?: string;
      whatsapp?: string;
      category?: string;
      logoUrl?: string;
      coverUrl?: string;
      isClosed?: boolean;
    }
  ) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundError('Restaurante');
    }

    return await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        name: data.name || undefined,
        description: data.description || undefined,
        address: data.address || undefined,
        whatsapp: data.whatsapp || undefined,
        category: data.category || undefined,
        logoUrl: data.logoUrl || undefined,
        coverUrl: data.coverUrl || undefined,
        isClosed: data.isClosed,
      },
    });
  }

  /**
   * Crear categoría menú
   */
  async createCategory(restaurantId: string, name: string) {
    // Verificar que el restaurante existe y pertenece al usuario
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundError('Restaurante');
    }

    // Verificar nombre duplicado
    const existing = await prisma.menuCategory.findFirst({
      where: { restaurantId, name },
    });

    if (existing) {
      throw new ApiError(400, 'Categoría ya existe');
    }

    return await prisma.menuCategory.create({
      data: { restaurantId, name, order: 0 },
    });
  }

  /**
   * Crear item menú (validar límite de plan)
   */
  async createMenuItem(
    restaurantId: string,
    data: {
      categoryId: string;
      name: string;
      description?: string;
      price: string;
      imageUrl?: string;
    }
  ) {
    // Verificar categoría pertenece al restaurante
    const category = await prisma.menuCategory.findUnique({
      where: { id: data.categoryId },
    });

    if (!category || category.restaurantId !== restaurantId) {
      throw new ForbiddenError('Categoría no pertenece a este restaurante');
    }

    // Obtener restaurante (para verificar plan)
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundError('Restaurante');
    }

    // Contar items si plan es GRATIS
    if (restaurant.plan === 'GRATIS') {
      const itemCount = await prisma.menuItem.count({
        where: {
          category: { restaurantId },
        },
      });

      if (itemCount >= 10) {
        throw new ApiError(
          402,
          'Plan Gratis: máximo 10 items. Upgrade a Pro para más items.'
        );
      }
    }

    return await prisma.menuItem.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        imageUrl: data.imageUrl,
        isAvailable: true,
        order: 0,
      },
    });
  }

  /**
   * Obtener URL presigned para upload
   */
  async getUploadSignedUrl(
    restaurantId: string,
    filename: string,
    filetype: string
  ): Promise<{ url: string; path: string }> {
    const url = await storageService.getSignedUploadUrl(
      restaurantId,
      filename,
      filetype
    );

    const path = `restaurants/${restaurantId}/${Date.now()}-${filename}`;

    return { url, path };
  }
}

export const dashboardService = new DashboardService();
```

---

## 5. Entry Point (Express app)

### `src/index.ts`

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Config
dotenv.config({ path: '.env.local' });
import { env } from './config/env';

// Routes
import healthRouter from './modules/health/router';
import authRouter from './modules/auth/router';
import restaurantRouter from './modules/restaurants/router';
import dashboardRouter from './modules/dashboard/router';

// Middleware
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security & Parsing
app.use(helmet());
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS.split(','),
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/auth', authRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/dashboard', dashboardRouter);

// Error handler (último)
app.use(errorHandler);

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
```

---

## 6. Migraciones y Setup

### 6.1 Crear y aplicar migración

```bash
cd apps/api

# Crear migración desde schema.prisma
npx prisma migrate dev --name init

# O si ya existe BD:
npx prisma migrate dev --name add_fields

# Aplicar en producción:
npx prisma migrate deploy
```

### 6.2 Seeder (datos de prueba)

**`prisma/seed.ts`:**

```typescript
import { PrismaClient, Plan } from '@prisma/client';
import { generateSlug } from '../src/utils/slug';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // Limpiar
  await prisma.user.deleteMany();
  // cascada elimina restaurantes, categorías, items

  // Crear usuario de prueba
  const user = await prisma.user.create({
    data: {
      email: 'dueno@example.com',
      supabaseId: '00000000-0000-0000-0000-000000000000',
      role: 'OWNER',
      restaurant: {
        create: {
          slug: 'el-rincon-paisa',
          name: 'El Rincón Paisa',
          description: 'Comida tradicional colombiana',
          address: 'Cra 10 #50-40, Yumbo, Valle',
          whatsapp: '+573201234567',
          category: 'Comida Rápida',
          plan: Plan.PRO,
          isActive: true,
          isClosed: false,
        },
      },
    },
    include: { restaurant: true },
  });

  // Crear categorías
  const categories = await Promise.all([
    prisma.menuCategory.create({
      data: {
        restaurantId: user.restaurant!.id,
        name: 'Platos Principales',
        order: 1,
      },
    }),
    prisma.menuCategory.create({
      data: {
        restaurantId: user.restaurant!.id,
        name: 'Bebidas',
        order: 2,
      },
    }),
  ]);

  // Crear items
  await Promise.all([
    prisma.menuItem.create({
      data: {
        categoryId: categories[0].id,
        name: 'Bandeja Paisa',
        description: 'Arepa, chicharrón, huevo, frijoles',
        price: 18000,
        isAvailable: true,
        order: 1,
      },
    }),
    prisma.menuItem.create({
      data: {
        categoryId: categories[1].id,
        name: 'Jugo de Lulo',
        description: 'Jugo natural de lulo frio',
        price: 5000,
        isAvailable: true,
        order: 1,
      },
    }),
  ]);

  console.log('✅ Seeding complete!');
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**En `package.json`:**

```json
{
  "scripts": {
    "prisma:seed": "ts-node --transpile-only prisma/seed.ts"
  }
}
```

**Ejecutar:**

```bash
pnpm run prisma:seed
```

---

## 7. Testing (Fase 3)

**Para Fase 2, estructura lista:**

```typescript
// __tests__/auth.test.ts
import request from 'supertest';
import app from '../src/index';

describe('Auth', () => {
  it('should register a restaurant', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      restaurantName: 'Test Restaurant',
      whatsapp: '+573001234567',
      address: 'Calle 1 #1',
      category: 'Comida Rápida',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
```

---

## 8. Checklist de Setup Backend

- [ ] Crear proyecto en Supabase
- [ ] Copiar credenciales a `.env.local`
- [ ] Crear bucket `nami-uploads` en Storage
- [ ] `pnpm install` en apps/api
- [ ] `npx prisma init`
- [ ] Copiar schema.prisma
- [ ] `npx prisma migrate dev --name init`
- [ ] `pnpm run prisma:seed`
- [ ] Verificar `npx prisma studio`
- [ ] `pnpm run dev` en apps/api
- [ ] Testear endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/restaurants`
  - `GET /api/restaurants/:slug`

---

## 9. Production Readiness

**Antes de deploy:**

- [ ] Variables env en Render dashboard
- [ ] DB backups activados en Supabase
- [ ] CORS restrictivo (solo dominios reales)
- [ ] Rate limiting en endpoints públicos
- [ ] Logging centralizado (Sentry)
- [ ] Monitoreo de base datos
- [ ] Health checks funcionando
- [ ] SSL/HTTPS en todas las rutas

