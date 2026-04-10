# 🍔 nami — Arquitectura Senior Profesional v3.0

**Fecha:** 26 marzo 2026
**Versión:** 3.0 - Arquitectura Profesional Mejorada
**Scope:** Construcción completa de plataforma + Landing + PWA/App
**Objetivo:** Superar Rappi, Uber Eats en UX, velocidad y elegancia visual

---

## 📋 RESUMEN EJECUTIVO

nami v3.0 es una **plataforma local de descubrimiento de restaurantes** con arquitectura profesional, diseño moderno similar a Stripe/Vercel/Figma, y performance de clase mundial.

### Diferenciadores Vs Competencia

| Aspecto | Rappi | Uber Eats | Google | nami v3 |
|---------|-------|-----------|--------|---------|
| **UX/Diseño** | Funcional | Aceptable | Básico | ⭐ PREMIUM (Stripe-tier) |
| **Velocidad** | Lenta (React) | Media | Rápida | ⭐ ULTRA-RÁPIDA (<1s) |
| **Comisión** | 25-30% | 20-25% | N/A | 0% (Gratis) / 2% (Pro) |
| **Independencia** | Nula | Nula | N/A | ⭐ TOTAL |
| **Mobile-first** | Sí | Sí | Sí | ⭐ PWA + Native-ready |
| **Analytics** | Sí (suyo) | Sí (suyo) | N/A | ⭐ DEL RESTAURANTE |
| **Dark mode** | No | Parcial | Sí | ⭐ BEAUTIFUL |

---

## 🏗️ ARQUITECTURA MEJORADA

### Stack Tecnológico Senior v3.0

```
┌──────────────────────────────────────────────────────────────┐
│                     nami SYSTEM ARCHITECTURE                 │
└──────────────────────────────────────────────────────────────┘

FRONTEND LAYER (Usuarios)
├── Landing Page
│   ├── Framework: Next.js 16 (App Router)
│   ├── Styling: Tailwind v4 + Custom CSS
│   ├── Animations: Framer Motion + CSS keyframes
│   ├── Performance: <800ms LCP, <1s FCP
│   └── Design: Stripe-inspired minimalism
│
├── Web App (nami.app)
│   ├── Framework: Next.js 16 + TypeScript
│   ├── State: Zustand + React Query (TanStack)
│   ├── UI Library: shadcn/ui + Radix UI
│   ├── Search: Algolia (instant search)
│   ├── Maps: Mapbox GL JS (performance)
│   ├── Performance: <500ms TTI, 98+ Lighthouse
│   └── Rendering: SSR + ISR hybrid
│
├── PWA (Progressive Web App)
│   ├── Offline-first (Workbox)
│   ├── Push notifications
│   ├── Install prompts
│   ├── App-like experience
│   └── iOS/Android ready
│
└── Dashboard Restaurante
    ├── Framework: Next.js 16 (mismo repo)
    ├── Complex UIs: Recharts (charts avanzados)
    ├── Real-time: Socket.io (órdenes)
    ├── File upload: Uppy + tus protocol
    └── Performance: React.memo + dynamic imports

API GATEWAY & BACKEND
├── Runtime: Node.js 20 LTS
├── Framework: Express 5 + custom middleware
├── Architecture: Clean architecture + SOLID
├── API Type: REST (GraphQL en Fase 4)
├── Auth: Supabase JWT + OAuth2
├── Validation: Zod + custom rules
├── Error handling: Structured, typed
├── Logging: Pino (ultra-fast)
├── Rate limiting: Redis-backed
├── CORS: Strict, configurable
└── Response format: Standardized ApiResult<T>

CACHING LAYER
├── Browser: Service Worker (Workbox)
├── Edge: Vercel Edge Caching (60s-24h)
├── Application: Redis (ioredis)
│   ├── Search index cache
│   ├── User sessions
│   ├── Rate limits
│   └── Real-time data
└── Database query cache: Prisma

DATABASE
├── Primary: PostgreSQL 15 (Supabase)
├── Schema: Optimized with indices
├── Replication: Multi-region ready
├── Backup: Automated daily + WAL
├── ORM: Prisma 5 (type-safe)
├── Migrations: Automated with checks
└── Row-level security (RLS): Supabase

FILE STORAGE
├── Images: Supabase Storage + CDN
├── Presigned URLs (secure, time-limited)
├── Image optimization: Sharp.js on-the-fly
├── Formats: WebP/AVIF with fallbacks
└── CDN: Cloudflare (global edge)

REAL-TIME FEATURES
├── Websockets: Socket.io (with fallbacks)
├── Message queue: Bull (Redis-backed)
├── Events: Typed event system
├── Subscriptions: GraphQL-ready (future)
└── Latency: <100ms (target)

EXTERNAL INTEGRATIONS
├── ✅ Stripe Connect (pagos)
├── ✅ WhatsApp Business API (mensajes)
├── ✅ Mapbox (mapas/geolocalización)
├── ✅ Twilio (SMS notifications)
├── ✅ SendGrid (email transaccional)
├── ✅ Sentry (error tracking)
├── ✅ LogRocket (session replay)
└── ✅ Google Analytics 4 (analytics)

DEPLOYMENT & INFRASTRUCTURE
├── Frontend: Vercel (Edge Functions, CDN)
├── Backend: Render.com (managed containers)
├── Database: Supabase (managed Postgres)
├── Storage: Supabase Storage (S3-compatible)
├── DNS: Cloudflare (DDoS protection)
├── Email delivery: SendGrid SG + Twilio
├── Monitoring: Datadog + custom dashboards
├── CI/CD: GitHub Actions (automated)
└── Feature flags: LaunchDarkly

SECURITY LAYER
├── TLS 1.3 (HTTPS everywhere)
├── OWASP top 10 protection
├── Rate limiting (5000 req/min/IP)
├── CSRF tokens on forms
├── XSS protection (CSP headers)
├── SQL injection prevention (Prisma)
├── JWT expiration (15min + refresh)
├── Secrets management: Vercel env
├── Regular security audits
└── SOC 2 compliance (target)
```

---

## 🎨 DISEÑO UX/UI - ESTRATEGIA VISUAL

### Referencia de Inspiración

```
Stripe.com          → Limpieza, espaciado, tipografía premium
Vercel.com          → Dark mode elegante, transiciones suaves
Figma.com           → Interfaz intuitiva, real-time collaboration feel
Clerk.com           → Auth flows simplificados, inputs bonitos
Linear.app          → Velocidad visual, animaciones micro
Raycast.app         → Command palette UX, dark aesthetic
Loom.com            → Video-first design, smooth interactions
```

### Paleta de Colores Mejorada

```
Primary (Naranja):
├── 50:   #FFF7ED
├── 100:  #FFEDD5
├── 200:  #FED7AA
├── 300:  #FDBA74
├── 400:  #FB923C
├── 500:  #F97316 ← Brand orange (nami)
├── 600:  #EA580C
├── 700:  #C2410C
├── 800:  #9A360A
└── 900:  #7C2D12

Secundario (Morado Suave):
├── 50:   #F5F3FF
├── 500:  #A78BFA ← Accent (highlights)
└── 900:  #4C1D95

Neutrals (Grises Premium):
├── 50:   #FAFAFA
├── 100:  #F4F4F5
├── 200:  #E4E4E7
├── 300:  #D4D4D8
├── 400:  #A1A1A1
├── 500:  #71717A
├── 600:  #52525B
├── 700:  #3F3F46
├── 800:  #27272A
├── 900:  #18181B ← Dark background
└── 950:  #09090B

Semantic:
├── Success:  #10B981 (esmeralda)
├── Error:    #EF4444 (rojo)
├── Warning:  #F59E0B (ámbar)
└── Info:     #3B82F6 (azul)

Dark mode (automático):
├── Background: #0F172A (slate-900)
├── Surface:    #1E293B (slate-800)
├── Border:     #334155 (slate-700)
└── Text:       #F1F5F9 (slate-100)
```

### Tipografía Premium

```
Display Font (Headings H1-H3):
├── Font: Sora (Google Fonts)
├── Weight: 700-800
├── Sizes: 32px (mobile) → 56px (desktop)
├── Line-height: 1.2
├── Letter-spacing: -0.5px
├── Usage: Títulos principales, branding
└── Fallback: -apple-system, BlinkMacSystemFont

Body Font (P, labels, buttons):
├── Font: Inter (Google Fonts)
├── Weights: 400, 500, 600
├── Sizes: 14px-18px
├── Line-height: 1.5-1.6
├── Letter-spacing: 0px
└── Fallback: system fonts

Code Font (snippets, logs):
├── Font: JetBrains Mono
├── Size: 12px-14px
└── Usage: Minimal (error messages, ref codes)
```

### Espaciado & Layout Grid

```
Base unit: 4px (para micro-espacios)

Escala de espaciado (Tailwind):
0px, 2px, 4px, 8px, 12px, 16px, 20px, 24px, 28px, 32px, 
40px, 48px, 56px, 64px, 80px, 96px

Container widths:
├── Mobile:     100% - 16px padding
├── Tablet:     90% (max 600px)
├── Desktop:    85% (max 1280px)
└── Ultra:      80% (max 1400px)

Breakpoints (Tailwind v4):
├── sm: 640px
├── md: 768px
├── lg: 1024px
├── xl: 1280px
└── 2xl: 1536px

Grid system:
├── Mobile: 1 columna
├── Tablet: 2 columnas
├── Desktop: 3 columnas
└── Components: 12-column grid (advanced)
```

### Motion & Animations

```
Velocidades estándar:
├── Instant:     0ms (hover states)
├── Fast:        150ms (micro-interactions)
├── Normal:      300ms (modal appears)
├── Slow:        500ms (page transitions)
└── Very slow:   800ms (hero animations)

Easing functions:
├── ease-out:    cubic-bezier(0.16, 1, 0.3, 1) - enters
├── ease-in:     cubic-bezier(0.7, 0, 0.84, 0) - exits
├── ease-linear: cubic-bezier(0, 0, 1, 1) - loading bars
└── ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55) - playful

Key animations:
├── Page load:       fade-in + scale (0-1) en 500ms
├── Buttons:         scale on hover (1.0 → 1.02)
├── Cards:           translate + shadow on hover
├── Search results:  stagger children (50ms delay)
├── Modals:          backdrop + scale in/out
├── Loading:         rotation + fade (looping)
└── Success:         pulse + confetti (momentary)

Framer Motion patterns:
├── Initial:     { opacity: 0, y: 20 }
├── Animate:     { opacity: 1, y: 0 }
├── Exit:        { opacity: 0, y: -20 }
├── Transition:  { duration: 0.3, ease: "easeOut" }
└── Viewport:    { once: true, amount: 0.3 }
```

---

## 💻 STACK TECNOLÓGICO DETALLADO

### Core Dependencies (Todas las apps)

```json
{
  "devDependencies": {
    "typescript": "^5.8.0",
    "ts-node": "^10.10.0",
    "@types/node": "^20.15.0",
    "tsx": "^4.11.0",
    "dotenv": "^16.4.5",
    "prettier": "^3.3.0",
    "eslint": "^9.3.0",
    "@typescript-eslint/eslint-plugin": "^7.10.0",
    "zod": "^3.23.8"
  }
}
```

### Frontend Stack (Next.js 16 + Tailwind v4)

```json
{
  "dependencies": {
    "next": "16.1.3",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "typescript": "^5.8.0",

    "tailwindcss": "4.0.0",
    "@tailwindcss/postcss": "4.0.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",

    "framer-motion": "^11.3.28",
    "zustand": "^4.5.2",
    "@tanstack/react-query": "^5.51.0",
    "axios": "^1.7.7",
    "@tanstack/react-table": "^8.20.1",

    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-popover": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.1.6",
    "@radix-ui/react-navigation-menu": "^1.2.1",

    "react-hook-form": "^7.52.1",
    "@hookform/resolvers": "^3.3.4",

    "lucide-react": "^0.576.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.4.0",

    "@supabase/supabase-js": "^2.45.0",
    "qrcode.react": "^1.0.1",

    "algolia": "^4.20.0",
    "algoliasearch": "^4.20.0",
    "react-instantsearch": "^7.10.0",

    "mapbox-gl": "^3.3.0",
    "@mapbox/mapbox-gl-geocoder": "^5.0.1",

    "socket.io-client": "^4.7.2",
    "ioredis": "^5.3.6",

    "workbox-core": "^7.0.0",
    "workbox-precaching": "^7.0.0",
    "workbox-routing": "^7.0.0",
    "workbox-strategies": "^7.0.0",

    "recharts": "^2.12.7",
    "date-fns": "^3.6.0",
    "numeral": "^2.0.6",

    "@stripe/react-stripe-js": "^3.0.0",
    "@stripe/stripe-js": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/node": "^20.15.0",
    "next-pwa": "^5.6.0",
    "@next/bundle-analyzer": "^16.1.0"
  }
}
```

### Backend Stack (Express 5 + Prisma)

```json
{
  "dependencies": {
    "express": "^5.0.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.4.5",

    "@prisma/client": "^5.18.0",
    "@supabase/supabase-js": "^2.45.0",

    "zod": "^3.23.8",
    "jsonwebtoken": "^9.1.2",
    "bcrypt": "^5.1.1",

    "pino": "^8.20.0",
    "pino-http": "^8.6.1",
    "pino-pretty": "^10.3.1",

    "redis": "^4.6.14",
    "ioredis": "^5.3.6",
    "bull": "^4.13.1",

    "socket.io": "^4.7.2",
    "express-rate-limit": "^7.3.0",

    "stripe": "^15.10.0",
    "axios": "^1.7.7",

    "sharp": "^0.33.4",
    "multer": "^1.4.5-lts.1",

    "nodemailer": "^6.9.13",
    "@sendgrid/mail": "^8.1.3",

    "twilio": "^4.20.3",

    "reflect-metadata": "^0.2.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.15.0",
    "@types/bcrypt": "^5.0.2",
    "ts-node": "^10.10.0",
    "tsx": "^4.11.0",
    "nodemon": "^3.1.2",
    "prisma": "^5.18.0"
  }
}
```

### Dependencias Críticas Justificadas

| Package | Versión | Por qué | Alternativa rechazada |
|---------|---------|---------|----------------------|
| **Next.js** | 16.1.3 | App Router estable, best-in-class | Nuxt, SvelteKit, Remix |
| **React** | 19.0.0 | Hooks estables, comunidad | Preact, Qwik |
| **TypeScript** | 5.8 | Type safety completo | Flow |
| **Tailwind** | 4.0 | JIT, utilities, performance | CSS-in-JS, Bootstrap |
| **Framer Motion** | 11.3 | Animations smoothness | Motion One, React Spring |
| **Zustand** | 4.5 | Minimalista, eficiente | Redux, Jotai, Context |
| **Tanstack Query** | 5.51 | Caching inteligente | SWR, Apollo |
| **Prisma** | 5.18 | Type-safe ORM | TypeORM, Sequelize |
| **Express** | 5.0 | Ligero, maduro | Fastify, Hono |
| **Pino** | 8.20 | Ultra-fast logging | Winston, Bunyan |
| **Redis** | 4.6 | Caching + sessions | Memcached |
| **Socket.io** | 4.7 | Real-time confiable | ws, uWebSockets |
| **Stripe** | 15.10 | Pagos integrados | PayPal, 2Checkout |

---

## 🔧 ARQUITECTURA BACKEND - GUÍA DE IMPLEMENTACIÓN

### 1. Setup Inicial Backend

```bash
# 1. Crear directorio
mkdir apps/api && cd apps/api

# 2. Iniciar proyecto
npm init -y

# 3. Instalar dependencias principales
npm install express cors helmet dotenv @prisma/client zod jsonwebtoken bcrypt
npm install -D typescript ts-node nodemon @types/express @types/node prisma

# 4. Crear estructura base
mkdir -p src/{routes,controllers,services,models,middleware,utils,config}
touch src/index.ts src/.env.local

# 5. Inicializar Prisma
npx prisma init

# 6. Setup package.json scripts
```

**package.json - Scripts:**
```json
{
  "scripts": {
    "dev": "nodemon --exec tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx src/seed.ts",
    "lint": "eslint src --fix",
    "type-check": "tsc --noEmit"
  }
}
```

### 2. Estructura Clean Architecture Backend

```
apps/api/
├── src/
│   ├── config/
│   │   ├── env.ts                   (Validación variables env)
│   │   ├── database.ts              (Pool Prisma)
│   │   ├── redis.ts                 (Cliente Redis)
│   │   └── stripe.ts                (Stripe init)
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts       (JWT verification)
│   │   ├── errorHandler.middleware.ts (Manejo de errores)
│   │   ├── validation.middleware.ts (Zod validation)
│   │   ├── rateLimit.middleware.ts  (Rate limiting)
│   │   ├── cors.middleware.ts       (CORS config)
│   │   └── logging.middleware.ts    (Pino logging)
│   │
│   ├── routes/
│   │   ├── auth.routes.ts           (Autenticación)
│   │   ├── stores.routes.ts         (Restaurantes CRUD)
│   │   ├── products.routes.ts       (Menú items)
│   │   ├── orders.routes.ts         (Órdenes)
│   │   ├── search.routes.ts         (Búsqueda Algolia)
│   │   ├── payments.routes.ts       (Stripe webhooks)
│   │   ├── uploads.routes.ts        (File uploads)
│   │   └── admin.routes.ts          (Admin panel)
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── stores.controller.ts
│   │   ├── products.controller.ts
│   │   ├── orders.controller.ts
│   │   ├── search.controller.ts
│   │   └── payments.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts          (Lógica de auth)
│   │   ├── stores.service.ts        (Lógica de restaurantes)
│   │   ├── orders.service.ts        (Lógica de órdenes)
│   │   ├── payment.service.ts       (Stripe integration)
│   │   ├── search.service.ts        (Algolia + cache)
│   │   ├── email.service.ts         (SendGrid)
│   │   ├── sms.service.ts           (Twilio)
│   │   ├── cache.service.ts         (Redis)
│   │   └── storage.service.ts       (Supabase Storage)
│   │
│   ├── models/
│   │   ├── types.ts                 (TypeScript types)
│   │   ├── schemas.ts               (Zod schemas)
│   │   └── constants.ts             (Enums, constants)
│   │
│   ├── utils/
│   │   ├── response.ts              (ApiResult helper)
│   │   ├── jwt.ts                   (JWT utils)
│   │   ├── hash.ts                  (Bcrypt utils)
│   │   ├── validators.ts            (Regex, validators)
│   │   ├── formatters.ts            (Number, date formatters)
│   │   └── errors.ts                (Custom error classes)
│   │
│   ├── jobs/
│   │   ├── email.queue.ts           (Bull queues)
│   │   ├── analytics.queue.ts
│   │   └── notifications.queue.ts
│   │
│   ├── index.ts                     (App entry point)
│   └── server.ts                    (Express app setup)
│
├── prisma/
│   ├── schema.prisma                (DB schema)
│   ├── migrations/                  (Auto-generated)
│   └── seed.ts                      (Seed data)
│
├── .env.local                       (Secrets - never commit)
├── .env.example                     (Template)
├── tsconfig.json
├── package.json
└── README.md
```

### 3. Prisma Schema Optimizado

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "jsonProtocol"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============== AUTH & USERS ==============

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hash
  name      String
  phone     String?
  
  // Role-based access
  role      Role     @default(CUSTOMER)
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relationships
  restaurante Restaurant?
  orders      Order[]
  reviews     Review[]
  
  // Indices for performance
  @@index([email])
  @@index([role])
  @@map("users")
}

enum Role {
  CUSTOMER
  RESTAURANT_OWNER
  ADMIN
}

// ============== RESTAURANTS ==============

model Restaurant {
  id        String   @id @default(cuid())
  
  // Ownership
  ownerId   String   @unique
  owner     User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  
  // Basic info
  name      String
  slug      String   @unique // URL-friendly: "el-rincon-paisa"
  description String?
  phone     String
  whatsapp  String
  
  // Location
  address   String
  city      String
  latitude  Float
  longitude Float
  
  // Media
  imageUrl  String?
  logoUrl   String?
  
  // Operating hours (JSON for flexibility)
  openingHours Json? // { "monday": { "open": "09:00", "close": "22:00" } }
  
  // Business info
  category  RestaurantCategory @default(FAST_FOOD)
  rating    Float?  @default(0)
  reviewCount Int?  @default(0)
  
  // Subscription
  plan      SubscriptionPlan @default(FREE
  stripeSubscriptionId String?
  
  // Status
  isVerified Boolean @default(false)
  isActive   Boolean @default(true)
  
  // SEO
  metaDescription String?
  metaKeywords    String?
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relationships
  products  Product[]
  orders    Order[]
  reviews   Review[]
  analytics Analytics[]
  
  // Full-text search index
  @@fulltext([name, description])
  @@index([slug])
  @@index([city])
  @@index([category])
  @@index([plan])
  @@index([createdAt])
  @@map("restaurants")
}

enum RestaurantCategory {
  FAST_FOOD
  HAMBURGUESAS
  PIZZA
  COMIDA_RAPIDA
  PANADERIA
  CAFE
  CORRIENTAZO
  ASIAN
  VEGETARIANO
  POSTRES
  BEBIDAS
  OTHER
}

enum SubscriptionPlan {
  FREE
  PLUS
  PRO
}

// ============== MENU & PRODUCTS ==============

model Product {
  id        String   @id @default(cuid())
  
  restaurantId String
  restaurant Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  
  // Product info
  name      String
  description String?
  price     Decimal  @db.Decimal(10, 2)
  imageUrl  String?
  
  // Organization
  category  String   // "Platos", "Bebidas", etc
  order     Int      @default(0) // For sorting
  
  // Availability
  isAvailable Boolean @default(true)
  preparationTime Int? // minutes
  
  // Attributes (JSON for flexibility)
  attributes Json?   // { "sizes": ["pequeño", "grande"], "toppings": [...] }
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relationships
  orderItems OrderItem[]
  analytics  Analytics[]
  
  @@index([restaurantId])
  @@index([category])
  @@index([isAvailable])
  @@map("products")
}

// ============== ORDERS ==============

model Order {
  id        String   @id @default(cuid())
  
  // Relations
  customerId String?
  customer   User?    @relation(fields: [customerId], references: [id], onDelete: SetNull)
  
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  
  // Order details
  status    OrderStatus @default(NEW)
  subtotal  Decimal     @db.Decimal(10, 2)
  tax       Decimal     @db.Decimal(10, 2)
  total     Decimal     @db.Decimal(10, 2)
  
  // Delivery/Pickup
  deliveryType DeliveryType @default(PICKUP)
  
  // Payment
  paymentMethod PaymentMethod @default(CASH)
  paymentStatus PaymentStatus @default(PENDING)
  stripePaymentIntentId String?
  
  // Notes
  customerNotes String?
  restaurantNotes String?
  
  // Contact info
  customerPhone String?
  customerName  String?
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  estimatedDeliveryTime DateTime?
  completedAt DateTime?
  
  // Relationships
  items     OrderItem[]
  messages  Message[]
  payment   Payment?
  
  // Indices
  @@index([customerId])
  @@index([restaurantId])
  @@index([status])
  @@index([createdAt])
  @@map("orders")
}

model OrderItem {
  id        String   @id @default(cuid())
  
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
  
  quantity  Int
  priceAtTime Decimal @db.Decimal(10, 2)
  notes     String?
  
  createdAt DateTime @default(now())
  
  @@index([orderId])
  @@index([productId])
  @@map("order_items")
}

enum OrderStatus {
  NEW              // Just created
  CONFIRMED        // Restaurant confirmed
  PREPARING        // Being made
  READY            // Ready for pickup
  IN_DELIVERY      // On the way
  COMPLETED        // Delivered/picked up
  CANCELLED        // Cancelled
  REJECTED         // Restaurant rejected
}

enum DeliveryType {
  PICKUP
  DELIVERY
}

enum PaymentMethod {
  CASH
  CARD
  NEQUI
  BANCOLOMBIA
  TRANSFER
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}

// ============== PAYMENTS ==============

model Payment {
  id        String   @id @default(cuid())
  
  orderId   String   @unique
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  amount    Decimal  @db.Decimal(10, 2)
  stripePaymentIntentId String @unique
  status    PaymentStatus @default(PENDING)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([orderId])
  @@map("payments")
}

// ============== MESSAGING ==============

model Message {
  id        String   @id @default(cuid())
  
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  senderId  String?
  senderName String? // For customer messages before account
  
  content   String
  type      MessageType @default(TEXT)
  direction MessageDirection @default(INBOUND) // From customer or restaurant
  
  metadata  Json?    // WhatsApp ID, etc
  
  createdAt DateTime @default(now())
  
  @@index([orderId])
  @@map("messages")
}

enum MessageType {
  TEXT
  IMAGE
  DOCUMENT
}

enum MessageDirection {
  INBOUND    // From customer
  OUTBOUND   // From restaurant
}

// ============== REVIEWS ==============

model Review {
  id        String   @id @default(cuid())
  
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  
  customerId String?
  customer   User?    @relation(fields: [customerId], references: [id], onDelete: SetNull)
  
  rating    Int      // 1-5
  comment   String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([restaurantId])
  @@index([rating])
  @@map("reviews")
}

// ============== ANALYTICS ==============

model Analytics {
  id        String   @id @default(cuid())
  
  restaurantId String?
  restaurant   Restaurant? @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  
  productId String?
  product   Product? @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  eventType AnalyticsEventType
  metadata  Json?
  
  createdAt DateTime @default(now())
  
  @@index([restaurantId])
  @@index([eventType])
  @@index([createdAt])
  @@map("analytics")
}

enum AnalyticsEventType {
  RESTAURANT_VIEWED
  PRODUCT_VIEWED
  PRODUCT_ADDED_TO_CART
  ORDER_CREATED
  ORDER_COMPLETED
  SEARCH_PERFORMED
  FILTER_APPLIED
}

// ============== SUBSCRIPTIONS ==============

model Subscription {
  id        String   @id @default(cuid())
  
  restaurantId String @unique
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  
  plan      SubscriptionPlan
  status    SubscriptionStatus
  
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  
  stripeSubscriptionId String?
  stripePriceId String?
  
  autoRenew Boolean @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  cancelledAt DateTime?
  
  @@index([plan])
  @@map("subscriptions")
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELLED
  PAUSED
}
```

### 4. Setup Express Server

```typescript
// src/index.ts

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { PrismaClient } from '@prisma/client'
import { pinoHttp } from 'pino-http'
import { createServer } from 'http'
import { Server } from 'socket.io'

import { config } from './config/env'
import { authMiddleware } from './middleware/auth.middleware'
import { errorHandler } from './middleware/errorHandler.middleware'
import { rateLimitMiddleware } from './middleware/rateLimit.middleware'
import { corsMiddleware } from './middleware/cors.middleware'

import authRoutes from './routes/auth.routes'
import storesRoutes from './routes/stores.routes'
import productsRoutes from './routes/products.routes'
import ordersRoutes from './routes/orders.routes'
import searchRoutes from './routes/search.routes'
import paymentsRoutes from './routes/payments.routes'

// Initialize
const app = express()
const httpServer = createServer(app)
export const io = new Server(httpServer, {
  cors: corsMiddleware.options,
  transports: ['websocket', 'polling']
})

// Global Prisma instance
export const prisma = new PrismaClient({
  log: ['error', 'warn']
})

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
    }
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

app.use(corsMiddleware.middleware)
app.use(pinoHttp())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Rate limiting
app.use('/api/', rateLimitMiddleware.createLimiter({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5000 // requests per window
}))

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() })
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/stores', storesRoutes)
app.use('/api/v1/products', productsRoutes)
app.use('/api/v1/orders', authMiddleware, ordersRoutes)
app.use('/api/v1/search', searchRoutes)
app.use('/api/v1/payments', paymentsRoutes)

// Error handling
app.use(errorHandler)

// Socket.io for real-time
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)
  
  socket.on('subscribe_order', (orderId: string) => {
    socket.join(`order_${orderId}`)
  })
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})

// Server startup
const PORT = config.PORT || 3000

httpServer.listen(PORT, async () => {
  try {
    await prisma.$connect()
    console.log(`✅ Server running on http://localhost:${PORT}`)
    console.log(`✅ Database connected`)
  } catch (error) {
    console.error('❌ Database connection failed', error)
    process.exit(1)
  }
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
```

### 5. Response Helper Tipado

```typescript
// src/utils/response.ts

export type ApiResult<T = any> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: string }

export class ApiResponse {
  static success<T>(data: T, statusCode = 200): [ApiResult<T>, number] {
    return [{ success: true, data }, statusCode]
  }

  static error(message: string, statusCode = 400): [ApiResult, number] {
    return [{ success: false, error: message }, statusCode]
  }

  static send(res: any, result: ApiResult, statusCode: number) {
    res.status(statusCode).json(result)
  }
}

// Usage en controller:
const [result, status] = ApiResponse.success({ id: '123', name: 'El Rincón' }, 201)
res.status(status).json(result)
```

---

## 🎨 ARQUITECTURA FRONTEND - GUÍA COMPLETA

### 1. Estructura Next.js 16 App Router

```
apps/web/
├── app/
│   ├── layout.tsx                  (Root layout)
│   ├── page.tsx                    (Home page - Landing + Intro)
│   ├── favicon.ico
│   ├── globals.css
│   ├── globals.ts                  (Tailwind config variables)
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── forgot-password/page.tsx
│   │
│   ├── (app)/
│   │   ├── layout.tsx              (App layout con nav)
│   │   ├── search/
│   │   │   └── page.tsx            (Feed de restaurantes)
│   │   ├── restaurants/
│   │   │   ├── [slug]/page.tsx     (Detalle restaurante)
│   │   │   └── [slug]/loading.tsx  (Loading skeleton)
│   │   ├── orders/
│   │   │   ├── page.tsx            (Historial órdenes)
│   │   │   └── [id]/page.tsx       (Detalle orden)
│   │   ├── account/
│   │   │   ├── page.tsx            (Perfil usuario)
│   │   │   └── settings/page.tsx   (Preferencias)
│   │   └── cart/
│   │       └── page.tsx            (Carrito expandido - raro que se use)
│   │
│   ├── dashboard/
│   │   ├── layout.tsx              (Dashboard layout)
│   │   ├── page.tsx                (Overview)
│   │   ├── restaurants/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx        (Edit restaurant)
│   │   │       ├── menu/page.tsx   (Manage menu)
│   │   │       ├── orders/page.tsx (View orders)
│   │   │       └── analytics/page.tsx
│   │   ├── settings/page.tsx
│   │   └── subscription/page.tsx
│   │
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── restaurants/page.tsx
│   │   ├── users/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── moderation/page.tsx
│   │
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── logout/route.ts
│       ├── uploads/route.ts        (File upload handler)
│       └── webhooks/
│           └── stripe/route.ts
│
├── components/
│   ├── (shared)/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MobileNav.tsx
│   │   └── ThemeToggle.tsx
│   │
│   ├── (auth)/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── OAuthButtons.tsx
│   │
│   ├── (search)/
│   │   ├── SearchBar.tsx            (Con Algolia)
│   │   ├── FilterPanel.tsx
│   │   ├── RestaurantCard.tsx
│   │   ├── RestaurantGrid.tsx
│   │   └── RestaurantSkeleton.tsx
│   │
│   ├── (restaurant)/
│   │   ├── RestaurantHeader.tsx
│   │   ├── MenuSection.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductModal.tsx
│   │   └── ReviewSection.tsx
│   │
│   ├── (cart)/
│   │   ├── CartDrawer.tsx           (Side drawer)
│   │   ├── CartItem.tsx
│   │   ├── CheckoutModal.tsx
│   │   └── SuccessMessage.tsx
│   │
│   ├── (dashboard)/
│   │   ├── DashboardNav.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── StatCard.tsx
│   │   ├── MenuManager.tsx
│   │   ├── OrdersList.tsx
│   │   ├── AnalyticsChart.tsx
│   │   └── SubscriptionCard.tsx
│   │
│   ├── (forms)/
│   │   ├── RestaurantForm.tsx
│   │   ├── ProductForm.tsx
│   │   ├── OrderForm.tsx
│   │   └── ValidationMessages.tsx
│   │
│   └── (ui)/
│       ├── Button.tsx               (Shadcn)
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Dialog.tsx
│       ├── Toast.tsx
│       ├── Spinner.tsx
│       └── Badge.tsx
│
├── hooks/
│   ├── useAuth.ts                  (Auth context hook)
│   ├── useCart.ts                  (Zustand cart)
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   ├── usePagination.ts
│   ├── useInfiniteScroll.ts
│   └── useDarkMode.ts
│
├── stores/
│   ├── authStore.ts                (Zustand auth)
│   ├── cartStore.ts                (Zustand cart)
│   ├── uiStore.ts                  (UI state)
│   └── filtersStore.ts             (Search filters)
│
├── services/
│   ├── api.ts                      (Axios instance)
│   ├── auth.service.ts
│   ├── restaurants.service.ts
│   ├── orders.service.ts
│   ├── search.service.ts
│   ├── uploads.service.ts
│   └── stripe.service.ts
│
├── lib/
│   ├── utils.ts                    (cn(), helpers)
│   ├── validators.ts               (Zod schemas)
│   ├── formatters.ts               (Number, date formatting)
│   ├── constants.ts
│   └── algolia.ts                  (Search config)
│
├── types/
│   ├── index.ts                    (Global types)
│   ├── api.ts
│   ├── restaurant.ts
│   ├── order.ts
│   └── user.ts
│
├── public/
│   ├── icons/
│   ├── images/
│   └── manifest.json               (PWA)
│
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 2. Key Frontend Components (High Performance)

```typescript
// components/search/RestaurantCard.tsx - Optimized rendering

'use client'

import { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, MapPin, Clock } from 'lucide-react'

interface RestaurantCardProps {
  id: string
  name: string
  slug: string
  imageUrl: string
  category: string
  rating: number
  reviewCount: number
  location: string
  openingHours: string
  isOpen: boolean
  plan: 'FREE' | 'PLUS' | 'PRO'
}

export const RestaurantCard = memo(function RestaurantCard({
  name,
  slug,
  imageUrl,
  category,
  rating,
  reviewCount,
  location,
  openingHours,
  isOpen,
  plan
}: RestaurantCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/restaurants/${slug}`}>
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200 dark:border-slate-700">
          
          {/* Image Container */}
          <div className="relative h-40 md:h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              loading="lazy"
            />
            
            {/* Premium Badge */}
            {plan === 'PRO' && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                ⭐ Premium
              </div>
            )}
            
            {/* Status Badge */}
            <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-lg text-xs font-medium ${
              isOpen 
                ? 'bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300/50'
                : 'bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300/50'
            }`}>
              {isOpen ? '🟢 Abierto' : '🔴 Cerrado'}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            
            {/* Name & Category */}
            <div>
              <h3 className="font-semibold text-base md:text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{category}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-sm text-slate-900 dark:text-white">
                  {rating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                ({reviewCount} reseñas)
              </span>
            </div>

            {/* Meta Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-1">{location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{openingHours}</span>
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 active:scale-95">
              Ver menú
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}, (prev, next) => {
  // Custom comparison para evitar re-renders innecesarios
  return (
    prev.id === next.id &&
    prev.imageUrl === next.imageUrl &&
    prev.rating === next.rating
  )
})
```

---

## 📊 LANDING PAGE - ESPECIFICACIÓN MEJORADA

### Landing Strategy Moderna

Tu landing actual es funcional pero necesita **modernización visual importante**. Usaremos referencia de Stripe, Vercel y Linear.app.

**Cambios clave:**

1. **Introducir animaciones micro** - Pequeños detalles que sorprenden
2. **Typography premium** - Sora + Inter (no Inter genérico)
3. **Dark mode elegante** - No opcional, fundamental
4. **Gradients inteligentes** - Naranja + morado sutil
5. **Social proof** - Testimonios, números reales
6. **Video en héroe** - Mockup animado de la app
7. **CTA clara** - Una sola acción por sección

### Landing Page Mejorada - Secciones

```
1. NAVBAR
   ├── Logo nami (tipografía Sora Bold)
   ├── Links: Producto, Planes, Restaurantes, Documentos
   ├── Dark mode toggle
   └── CTA: "Acceso para restaurantes" → Modal login

2. HERO
   ├── Headline: "Descubre la mejor comida sin aplicaciones pesadas"
   ├── Subheadline: "nami conecta clientes reales con restaurantes reales"
   ├── CTA: "Comenzar ahora" (naranja)
   ├── Visual: Mockup animado de app (Loom-style)
   └── Scroll indicator animado

3. PROBLEM SECTION
   ├── Lado izq: Problema (Rappi cobra 30%, Google viejo, etc.)
   ├── Lado der: Solución (nami, 0% comisión, etc.)
   └── Animaciones staggered

4. FEATURES (3 columnas)
   ├── 🔍 Descubrimiento local
   ├── 💬 Ordena por WhatsApp directo
   └── 📊 Datos que importan (para restaurantes)

5. LIVE STATS
   ├── X restaurantes registrados
   ├── X pedidos completados
   ├── X clientes satisfechos
   └── Números actualizados en tiempo real

6. TESTIMONIOS (Slider)
   ├── Restaurante 1: "Gano 2M más al mes"
   ├── Cliente 1: "Descubrí mi comida favorita"
   └── 4-5 testimonios reales

7. PLANES
   ├── Gratis (básico, destacado)
   ├── Plus (recomendado, scale-up)
   └── Pro (para cadenas)

8. FAQ (Accordion)
   ├── 8-10 preguntas reales
   └── Respuestas claras

9. FORMULARIO (Modal o sección)
   ├── Nombre restaurante
   ├── Contacto
   ├── Plan interés
   └── Envía a Google Sheet

10. CTA FINAL
    ├── "¿Listo para crecer?"
    └── Button destacado

11. FOOTER
    ├── Links útiles
    ├── Redes sociales
    └── Copyright
```

---

## 🚀 DEPLOYMENT & DEVOPS

### Vercel Deployment (Frontend)

```
vercel.json:
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_API_URL": "@nami_api_url",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_ALGOLIA_APP_ID": "@algolia_app_id"
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.nami.app/api/:path*"
    }
  ],
  "redirects": [
    {
      "source": "/dashboard",
      "destination": "/dashboard/overview",
      "permanent": false
    }
  ]
}
```

### Render Deployment (Backend)

```
render.yaml:
services:
  - type: web
    name: nami-api
    env: node
    plan: standard
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        scope: build_and_runtime
      - key: SUPABASE_URL
        scope: build_and_runtime
      - key: STRIPE_SECRET_KEY
        scope: runtime
        isPrivate: true
```

---

## 📈 PERFORMANCE TARGETS

```
Web Core Vitals (Google PageSpeed):
├── LCP (Largest Contentful Paint):  < 2.5s
├── FID (First Input Delay):         < 100ms
├── CLS (Cumulative Layout Shift):   < 0.1
├── FCP (First Contentful Paint):    < 1.8s
└── TTFB (Time To First Byte):       < 600ms

Lighthouse Scores:
├── Performance:   > 95
├── Accessibility: > 95
├── Best Practices: > 95
├── SEO:           > 95
└── PWA:           > 90

Real-World Metrics:
├── Mobile Load:     < 3s
├── Desktop Load:    < 1.5s
├── Time to interactive: < 4s
└── Search result time: < 500ms (Algolia)
```

---

## 🔐 SEGURIDAD & COMPLIANCE

```
Checklist de seguridad:

✅ HTTPS/TLS 1.3 everywhere
✅ OWASP Top 10 protections
✅ Rate limiting (5000 req/min)
✅ CORS restrictivo
✅ CSRF tokens
✅ XSS protection (CSP)
✅ SQL injection prevention (Prisma)
✅ JWT con expiration (15min)
✅ Secrets en env variables
✅ Regular security audits
✅ GDPR compliance ready
✅ SOC 2 Type II target
```

---

## 📊 ANALÍTICA & MONITOREO

```
Herramientas:
├── Google Analytics 4
├── Vercel Analytics
├── Sentry (error tracking)
├── LogRocket (session replay)
├── Datadog (infrastructure)
├── Hotjar (heatmaps - futuro)
└── Stripe Analytics (pagos)

Métricas clave:
├── User acquisition
├── Conversion funnel
├── Churn rate
├── LTV vs CAC
├── Error rate
├── API latency
└── Database query time
```

---

## 🎯 ROADMAP FASE 2-5

```
Fase 2 (Actual):
├── ✅ Landing página
├── ✅ MVP producto
├── ✅ 50+ restaurantes
└── ✅ 1000+ usuarios

Fase 3 (Mes 3-4):
├── Stripe Connect
├── WhatsApp Business API
├── Analytics pro
└── 100+ restaurantes

Fase 4 (Mes 5-9):
├── Expansión Colombia
├── Mobile app (React Native)
├── Publicidad
└── 500+ restaurantes

Fase 5 (Año 2):
├── LatAm expansion
├── Delivery propio
├── Marketplace integrado
└── $1M+ MRR
```

---

**Documento actualizado:** 26 marzo 2026
**Versión:** 3.0 - Arquitectura Senior Profesional
**Status:** Listo para implementación

