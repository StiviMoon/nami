# ÑAMI — Arquitectura del Sistema

**Versión:** 2.0
**Fecha:** 26 marzo 2026
**Scope:** Fase 2 (Feed + Menú + Dashboard)

---

## 1. Diagrama de arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                 │
└─────────────────────────────────────────────────────────────────┘
                                  ▲
                    ┌─────────────┼─────────────┐
                    │             │             │
              ┌─────▼────┐  ┌─────▼────┐  ┌────▼──────┐
              │  apps/   │  │  apps/   │  │ nami-     │
              │  web     │  │dashboard │  │ landing   │
              │ (Vercel) │  │(Vercel)  │  │(Vercel)   │
              └─────┬────┘  └─────┬────┘  └────┬──────┘
                    │             │            │
                    │             └────┬───────┘
                    │                  │
              ┌─────▼──────────────────▼────────────────────┐
              │                                              │
              │         API Backend (Express)                │
              │         apps/api (Render)                    │
              │         Port: 3000                           │
              │                                              │
              │  /restaurants  /menu  /dashboard  /admin    │
              └─────┬──────────────────────────────────────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
      ┌──▼──┐  ┌───▼────┐  ┌──▼────────┐
      │Auth │  │Postgres│  │ Storage   │
      │(JWT)│  │(Prisma)│  │(Presigned)│
      └──┬──┘  └────┬───┘  └───┬──────┘
         │          │          │
         └──────────┼──────────┘
                    │
              ┌─────▼──────────┐
              │   SUPABASE     │
              │  (PostgreSQL)  │
              │  (Auth + DB)   │
              │  (Storage)     │
              └────────────────┘
```

---

## 2. Estructura de carpetas (monorepo)

```
ñami/
├── nami-landing/              # Landing page (ya existe, no tocar)
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── ...
│
├── apps/
│   ├── web/                   # Cliente (feed, restaurante, carrito)
│   │   ├── app/
│   │   │   ├── page.tsx       # Feed principal "/"
│   │   │   ├── [slug]/
│   │   │   │   ├── page.tsx   # Restaurante "/[slug]"
│   │   │   │   └── carrito/
│   │   │   │       └── page.tsx # (o drawer modal)
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── RestaurantCard.tsx
│   │   │   ├── MenuGrid.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── WhatsAppButton.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── api.ts         # fetch wrappers
│   │   │   └── utils.ts
│   │   ├── hooks/
│   │   │   └── useCart.ts     # Zustand store
│   │   ├── package.json
│   │   └── .env.local         # NEXT_PUBLIC_API_URL, etc.
│   │
│   ├── dashboard/             # Admin restaurante
│   │   ├── app/
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── perfil/page.tsx
│   │   │   │   ├── menu/page.tsx
│   │   │   │   └── qr/page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── auth-layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── MenuEditor.tsx
│   │   │   ├── CategoryList.tsx
│   │   │   ├── ItemForm.tsx
│   │   │   ├── PlanBadge.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts        # useAuth, protectedRoute
│   │   │   └── utils.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useRestaurant.ts
│   │   ├── package.json
│   │   └── .env.local
│   │
│   └── api/                   # Backend Express + Prisma
│       ├── src/
│       │   ├── index.ts       # entry point
│       │   ├── middleware/
│       │   │   ├── auth.ts    # JWT verification
│       │   │   ├── errorHandler.ts
│       │   │   └── ...
│       │   ├── modules/
│       │   │   ├── restaurants/
│       │   │   │   ├── controller.ts
│       │   │   │   ├── service.ts
│       │   │   │   └── router.ts
│       │   │   ├── menu/
│       │   │   │   ├── controller.ts
│       │   │   │   ├── service.ts
│       │   │   │   └── router.ts
│       │   │   ├── auth/
│       │   │   │   ├── controller.ts
│       │   │   │   └── router.ts
│       │   │   ├── dashboard/
│       │   │   │   ├── controller.ts
│       │   │   │   ├── service.ts
│       │   │   │   └── router.ts
│       │   │   └── admin/
│       │   │       ├── controller.ts
│       │   │       └── router.ts
│       │   ├── utils/
│       │   │   ├── apiResponse.ts
│       │   │   ├── validators.ts
│       │   │   └── storage.ts
│       │   ├── config/
│       │   │   ├── database.ts
│       │   │   └── supabase.ts
│       │   └── types.ts
│       ├── prisma/
│       │   ├── schema.prisma  # ← CRITICAL
│       │   └── migrations/
│       ├── package.json
│       ├── .env.local         # Supabase keys, JWT secret, etc.
│       └── tsconfig.json
│
└── Docs/
    ├── PROYECTO.md            # (nuevo)
    ├── ARQUITECTURA.md        # (este archivo)
    ├── BACKEND.md             # (nuevo)
    ├── FRONTEND.md            # (nuevo)
    ├── ÑAMI_SISTEMA_COMPLETO.md
    └── ...
```

---

## 3. Base de datos — Schema Prisma

### 3.1 Tablas

```prisma
// User: Owner del restaurante
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  supabaseId    String   @unique
  role          Role     @default(OWNER)  // OWNER | ADMIN
  restaurant    Restaurant?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// Restaurant: El negocio
model Restaurant {
  id            String     @id @default(cuid())
  slug          String     @unique           // "el-rincon-paisa"
  name          String
  description   String?    @db.Text
  address       String
  whatsapp      String     // +57...
  category      String     // "Hamburguesas", "Panadería", etc.

  // Foto de perfil y portada
  logoUrl       String?    // Supabase URL
  coverUrl      String?    // Supabase URL

  // Plan actual
  plan          Plan       @default(GRATIS)  // GRATIS | PRO

  // Estado
  isActive      Boolean    @default(true)
  isClosed      Boolean    @default(false)   // Toggle abierto/cerrado

  // Relación con usuario dueño
  owner         User       @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  ownerId       String     @unique

  // Relaciones
  categories    MenuCategory[]

  // Metadata
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

// MenuCategory: Categorías del menú
model MenuCategory {
  id            String     @id @default(cuid())
  name          String     // "Platos principales", "Bebidas", etc.
  order         Int        @default(0)     // Para reordenar

  restaurant    Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  restaurantId  String

  items         MenuItem[]

  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  @@unique([restaurantId, name])  // No categorías duplicadas por restaurante
}

// MenuItem: Items del menú
model MenuItem {
  id            String     @id @default(cuid())
  name          String
  description   String?    @db.Text
  price         Float      // En COP
  imageUrl      String?    // Supabase URL
  isAvailable   Boolean    @default(true)
  order         Int        @default(0)

  category      MenuCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  categoryId    String

  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

// Enums
enum Role {
  OWNER
  ADMIN
}

enum Plan {
  GRATIS
  PRO
}
```

### 3.2 Índices recomendados

```prisma
// En Restaurant:
@@index([ownerId])
@@index([slug])
@@index([category])
@@index([plan])
@@index([isActive])

// En MenuCategory:
@@index([restaurantId])

// En MenuItem:
@@index([categoryId])
@@index([isAvailable])
```

---

## 4. Variables de entorno

### 4.1 `apps/api/.env.local`
```env
# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
SUPABASE_JWT_SECRET=xxx

# Database
DATABASE_URL="postgresql://user:pass@host/dbname"

# Server
PORT=3000
NODE_ENV=development

# CORS (apps que pueden conectarse)
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3002,https://nami.app

# Storage
SUPABASE_STORAGE_BUCKET=nami-uploads
```

### 4.2 `apps/web/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

### 4.3 `apps/dashboard/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

---

## 5. Flujos de autenticación

### 5.1 Restaurante (Dashboard)
```
Login (/login)
  → Email + contraseña en form
  → POST /auth/login con credentials
  → Backend valida en Supabase
  → Backend retorna JWT en HttpOnly cookie
  → Frontend redirige a /dashboard
  → Todas las rutas /dashboard protegidas con middleware
```

### 5.2 Cliente (Web)
```
No hay autenticación
  → Feed es público
  → Carrito vive en localStorage + Zustand
```

---

## 6. Uploadde imágenes

Todos los uploads van a **Supabase Storage** con presigned URLs (NO multipart, NO base64):

```
Frontend:
  1. POST /api/upload-sign → pide URL presigned
  2. Backend genera URL presigned válida 1 hora
  3. Frontend PUT a Supabase directamente
  4. Guarda URL pública en BD

Ventajas:
  - Backend no maneja bytes
  - Escalable
  - Seguro (presigned URL expira)
  - Fast (P2P)
```

---

## 7. Deploy

### 7.1 Frontend (apps/web + dashboard)
- **Plataforma:** Vercel
- **Ramas:** `main` → producción, `dev` → staging
- **Environment variables:** Configuradas en Vercel dashboard
- **Build:** `next build`
- **Deploy automático:** Al merge en `main`

### 7.2 Backend (apps/api)
- **Plataforma:** Render.com
- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- **Environment variables:** Configuradas en Render dashboard
- **Deploy:** Manual o con webhook de GitHub

### 7.3 Database (Supabase)
- **Hosting:** Supabase cloud (no local)
- **Migraciones:** `npx prisma migrate deploy`
- **Backups automáticos:** Incluidos en plan

---

## 8. Convenciones técnicas

### 8.1 Respuestas API
Todas las respuestas siguen el patrón `ApiResult<T>`:

```typescript
interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

// Ejemplo exitoso:
{ success: true, data: { id: "123", name: "El Rincón" } }

// Ejemplo error:
{ success: false, error: "Email ya registrado" }
```

### 8.2 HTTP Status Codes
- `200 OK` — Éxito general
- `201 Created` — Recurso creado
- `400 Bad Request` — Validación fallida
- `401 Unauthorized` — No autenticado
- `403 Forbidden` — No autorizado
- `404 Not Found` — Recurso no existe
- `500 Internal Server Error` — Error del servidor

### 8.3 Naming Conventions
- **Rutas:** snake_case, plurales `/restaurants`, `/menu-items`
- **Variables BD:** snake_case `logo_url`, `is_active`
- **Funciones:** camelCase `getRestaurant()`, `createMenuItem()`
- **Componentes React:** PascalCase `RestaurantCard.tsx`
- **Tipos/Interfaces:** PascalCase `Restaurant`, `CreateRestaurantDTO`

### 8.4 Validaciones
- **Frontend:** UI feedback al usuario (localValidation con Zod)
- **Backend:** SIEMPRE re-validar (Zod + guards)
- **Nunca:** Confiar en validación frontend

### 8.5 Errores
```typescript
// Backend: Usar clase custom
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

// Middleware de error lo convierte a { success: false, error: "..." }
```

---

## 9. Seguridad

- **CORS:** Configurado en backend, solo dominios permitidos
- **JWT:** HttpOnly cookies, no localStorage
- **SQL Injection:** Protegido por Prisma (prepared statements)
- **Validación:** Zod en backend
- **HTTPS:** Obligatorio en producción
- **Rate limiting:** (opcional, Fase 3) — token bucket en Redis
- **Logs:** Estructura centralizada (Sentry opcional)

---

## 10. Performance

- **Frontend:** Image optimization (next/image), code splitting automático
- **Backend:** Caching con Redis (Fase 3), índices de BD
- **Database:** Índices en foreign keys, límite de queries grandes
- **API:** Pagination en feed (`limit=20, offset=0`)
- **Assets:** CDN automático en Vercel

---

## 11. Monitoreo y logs

- **Frontend:** Vercel analytics automáticos
- **Backend:** Render logs + (opcional) Sentry para errores
- **Database:** Supabase console para queries lentas
