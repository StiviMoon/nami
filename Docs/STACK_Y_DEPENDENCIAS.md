# ÑAMI — Stack Técnico y Dependencias Detalladas

**Versión:** 2.0
**Fecha:** 26 marzo 2026
**Scope:** Todas las librerías para Fase 2 (desarrollo completo)

---

## 1. Decisiones de arquitectura

### 1.1 Monorepo Manager: TurboRepo
- **Elegida:** TurboRepo sobre Nx
- **Razón:** Más ligera, menos configuración, mejor para apps medianas, build cache más rápido
- **Alternativas rechazadas:**
  - Nx: Overkill para 3 apps pequeñas
  - Lerna: Deprecated, mantenimiento pobre
  - pnpm workspaces: Funciona pero sin herramientas de build/cache

### 1.2 Package Manager: pnpm
- **Elegida:** pnpm sobre npm/yarn
- **Razón:** Faster installs, disk space efficient, mejor hoisting control
- **Versión:** `^8.0.0`

### 1.3 Runtime: Node.js
- **Versión recomendada:** `20.x` LTS (hasta abril 2026, luego `22.x`)
- **Usar:** `nvm` para gestionar versiones localmente

---

## 2. Apps compartidas (todas)

### 2.1 TypeScript + Build tools

```json
{
  "devDependencies": {
    "typescript": "^5.7.0",
    "ts-node": "^10.9.0",
    "@types/node": "^20.14.0"
  }
}
```

**TypeScript config:** `tsconfig.json` base en root, extendido por cada app
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "noImplicitAny": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

---

## 3. apps/api — Backend Express

### 3.1 Core dependencies

```json
{
  "dependencies": {
    "express": "^4.19.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.4.0",
    "@prisma/client": "^5.7.0",
    "@supabase/supabase-js": "^2.45.0",
    "zod": "^3.22.0",
    "jsonwebtoken": "^9.1.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "nodemon": "^3.1.0",
    "ts-node-dev": "^2.0.0",
    "prisma": "^5.7.0"
  }
}
```

#### Express ^4.19.0
- **Razón:** Ligero, maduro, estándar para APIs Node.js
- **Alternativas rechazadas:**
  - Fastify: Buena opción pero más compleja para este proyecto
  - Hono: Novedosa, menos documentación

#### CORS ^2.8.5
- **Config:**
```typescript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
```

#### Helmet ^7.1.0
- **Razón:** Seguridad automática (headers HTTP)
- **Alternativas:** Ninguna, es estándar

#### Dotenv ^16.4.0
- **Razón:** Cargar `.env.local` en desarrollo
- **Config:** Llamar en entry point antes de inicializar app

#### Prisma ^5.7.0
- **Razón:** ORM robusto, type-safe, migraciones automáticas
- **Alternativas rechazadas:**
  - TypeORM: Demasiado complejo para este scope
  - Sequelize: No recomendado para TS moderno
  - Drizzle: Buena opción pero menos ecosistema que Prisma
- **Setup:**
```bash
npm install -D prisma @prisma/client
npx prisma init
# Editar schema.prisma
npx prisma migrate dev --name init
```

#### @supabase/supabase-js ^2.45.0
- **Razón:** Auth + Storage desde JavaScript
- **Métodos clave:**
  - `auth.signUpWithPassword()`
  - `auth.signInWithPassword()`
  - `storage.from('bucket').createSignedUploadUrl()`
- **No usar:** RLS directamente desde backend (usar auth JWT)

#### Zod ^3.22.0
- **Razón:** Validación type-safe en runtime
- **Ejemplo:**
```typescript
const restaurantSchema = z.object({
  name: z.string().min(3),
  whatsapp: z.string().regex(/^\+573\d{9}$/),
  category: z.enum(['Hamburguesas', 'Panadería', 'Corrientazo']),
});

const body = restaurantSchema.parse(req.body); // Throws si inválido
```
- **Alternativas rechazadas:**
  - Joi: Menos type-safe
  - Yup: Deprecated, mantenimiento pobre

#### jsonwebtoken ^9.1.0
- **Razón:** Verificar JWT de Supabase en middleware
- **No usar:** Para crear JWTs (Supabase lo hace)
- **Uso:**
```typescript
import jwt from 'jsonwebtoken';
const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
```

---

### 3.2 Dev tools

#### Nodemon ^3.1.0
- **Razón:** Auto-reload en desarrollo
- **Config en package.json:**
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node-dev src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

#### ts-node-dev ^2.0.0
- **Razón:** Ejecutar TypeScript directamente sin compilar
- **Alternativa:** ts-node (más lento, pero más estable)

#### Prisma CLI
- **Incluida con prisma package**
- **Comandos:**
```bash
npx prisma generate        # Regenerate @prisma/client
npx prisma migrate dev     # Crear + aplicar migración
npx prisma studio         # GUI para ver BD (opcional)
npx prisma format         # Formatear schema.prisma
```

---

### 3.3 Estructura de scripts en package.json

```json
{
  "name": "nami-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "ts-node-dev --transpile-only src/index.ts",
    "build": "tsc --project tsconfig.json",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "lint": "eslint src --fix",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 4. apps/web — Cliente (Next.js)

### 4.1 Core dependencies

```json
{
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.7.0",

    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",

    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.48.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.51.0",

    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-dropdown-menu": "^2.1.1",

    "lucide-react": "^0.469.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",

    "@supabase/supabase-js": "^2.45.0",
    "qrcode.react": "^1.0.1"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/node": "^20.14.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "@tailwindcss/typography": "^0.5.10"
  }
}
```

#### Next.js ^15.1.0
- **Razón:** React framework estándar, App Router estable, best-in-class performance
- **Configuración:**
```typescript
// next.config.ts
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xxx.supabase.co', // Supabase Storage
      },
    ],
  },
};
export default nextConfig;
```

#### Tailwind v4 ^4.0.0
- **Razón:** Utility-first CSS, excelente performance, built-in dark mode
- **Setup:**
```javascript
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```
```css
/* app/globals.css */
@import "tailwindcss";

@layer base {
  :root {
    --color-primary: #FF7A00;
    --color-accent: #B088C9;
  }
}
```
- **Alternativas rechazadas:**
  - Styled-components: Runtime overhead, menos performance
  - CSS Modules: Menos ergonómico

#### Zustand ^4.4.0
- **Razón:** State management simple (carrito del cliente)
- **Alternativas rechazadas:**
  - Redux: Overkill para este proyecto
  - Context API: Funciona pero menos optimizado para actualizaciones frecuentes
  - Jotai: Buena opción pero Zustand es más simple
- **Uso:**
```typescript
import create from 'zustand';

const useCart = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item],
  })),
}));
```

#### React Query (TanStack) ^5.48.0
- **Razón:** Data fetching, caching, synchronization
- **Configuración:**
```typescript
// providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      gcTime: 1000 * 60 * 10,   // 10 min (antes cacheTime)
    },
  },
});

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```
- **Alternativas rechazadas:**
  - SWR: Más simple pero menos features
  - Apollo: Para GraphQL, no REST

#### Zod ^3.22.0
- **Razón:** Validación en cliente (validar inputs antes de enviar)
- **Uso:** mismo que en backend

#### React Hook Form ^7.51.0
- **Razón:** Formularios sin re-renders innecesarios
- **Integración con Zod:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(loginSchema),
});
```
- **Alternativas rechazadas:**
  - Formik: Más pesado, más re-renders

#### Radix UI
- **@radix-ui/react-dialog:** Modales accesibles
- **@radix-ui/react-select:** Selects customizables
- **@radix-ui/react-tabs:** Tabs accesibles
- **@radix-ui/react-dropdown-menu:** Menus desplegables
- **Razón:** Componentes sin estilos, accesibles, hechos para shadcn/ui
- **Alternativas rechazadas:**
  - Headless UI: Más opinionado
  - Material-UI: Demasiado estilado, difícil customizar

#### shadcn/ui
- **No está en package.json:** Se instala con CLI
```bash
npx shadcn-ui@latest init
# Instalar componentes según necesites:
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add badge
# ... etc
```
- **Razón:** Componentes Radix preestilados con Tailwind, copiables
- **Alternativas rechazadas:**
  - Material-UI: Overkill
  - Chakra: Menos personalizable

#### Lucide React ^0.469.0
- **Razón:** Iconos SVG, tree-shakeable, lightweight
- **Alternativas rechazadas:**
  - Font Awesome: Demasiado pesado
  - React Icons: Más opciones pero también más pesado

#### Supabase JS ^2.45.0
- **Razón:** Storage presigned URLs, Auth client-side (solo para obtener token)
- **No usar:** Para CRUD en clientes (la API backend lo maneja)

#### qrcode.react ^1.0.1
- **Razón:** Generar QR desde restaurante en dashboard
- **Uso:**
```typescript
import QRCode from 'qrcode.react';
<QRCode value={`https://nami.app/${restaurant.slug}`} size={256} />;
```

---

### 4.2 Dev dependencies

```json
{
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/node": "^20.14.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38"
  }
}
```

---

## 5. apps/dashboard — Admin restaurante

### 5.1 Core dependencies

**Casi idéntico a apps/web**, con adiciones:

```json
{
  "dependencies": {
    // ... todas las de web

    "react-dropzone": "^14.2.3",
    "react-dnd": "^16.0.1",
    "react-dnd-html5-backend": "^16.0.1"
  }
}
```

#### react-dropzone ^14.2.3
- **Razón:** Drop zone para upload de imágenes
- **Uso:**
```typescript
import { useDropzone } from 'react-dropzone';

const { getRootProps, getInputProps } = useDropzone({
  onDrop: (files) => handleUpload(files[0]),
  accept: { 'image/*': ['.jpg', '.png'] },
});
```

#### react-dnd + react-dnd-html5-backend ^16.0.1
- **Razón:** Drag-drop para reordenar categorías/items en menú
- **Alternativas rechazadas:**
  - @dnd-kit: Más moderno pero documentación menos madura
  - Sortable: Más simple pero menos flexible

---

## 6. Root (Monorepo)

### 6.1 package.json en raíz

```json
{
  "name": "nami",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "start": "turbo run start",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "eslint": "^8.57.0",
    "prettier": "^3.2.0"
  }
}
```

#### turbo ^2.0.0
- **Config en turbo.json:**
```json
{
  "globalDependencies": ["tsconfig.json"],
  "build": {
    "dependsOn": ["^build"],
    "outputs": ["dist/**"],
    "cache": false
  },
  "dev": {
    "cache": false,
    "persistent": true
  }
}
```

---

## 7. Linting & Formatting

### 7.1 ESLint ^8.57.0

**Config:** `.eslintrc.json` en root + overrides por app

```json
{
  "extends": [
    "eslint:recommended",
    "next/core-web-vitals"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

**Script:**
```json
{
  "scripts": {
    "lint": "eslint . --fix"
  }
}
```

### 7.2 Prettier ^3.2.0

**Config:** `.prettierrc.json`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

**Script:**
```json
{
  "scripts": {
    "format": "prettier --write ."
  }
}
```

---

## 8. Testing (Opcional, para Fase 3)

**No incluir en Fase 2**, pero preparar estructura:

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.5",
    "ts-jest": "^29.1.1"
  }
}
```

---

## 9. Resumen de versiones pinned

| Librería | Versión | Razón |
|---|---|---|
| Node.js | 20.x LTS | Estable, LTS hasta abril 2026 |
| TypeScript | ^5.7.0 | Latest, excelente soporte |
| Next.js | ^15.1.0 | Latest App Router |
| React | ^19.0.0 | Latest, Hooks estables |
| Tailwind | ^4.0.0 | CSS-first, mejor performance |
| Prisma | ^5.7.0 | Latest, type-safe |
| Zod | ^3.22.0 | Validation, bien mantenida |
| TurboRepo | ^2.0.0 | Build system moderno |

---

## 10. Instalación paso a paso

### 10.1 Setup inicial

```bash
# 1. Clone + pnpm install
git clone <repo>
cd nami
pnpm install

# 2. Setup apps/api (Supabase)
cd apps/api
pnpm add express cors helmet dotenv @prisma/client @supabase/supabase-js zod jsonwebtoken
pnpm add -D typescript ts-node-dev @types/express nodemon prisma
npx prisma init
# Editar .env.local y schema.prisma
npx prisma migrate dev --name init

# 3. Setup apps/web
cd ../web
pnpm create next-app@latest . --typescript --tailwind --eslint
pnpm add zustand @tanstack/react-query zod react-hook-form @hookform/resolvers
pnpm add @supabase/supabase-js qrcode.react lucide-react clsx tailwind-merge
pnpm add @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-tabs
pnpm add -D @hookform/resolvers

# Instalar shadcn
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input badge card dialog dropdown-menu select sheet tabs

# 4. Setup apps/dashboard (similar a web + drag-drop)
cd ../dashboard
# ... mismo que web ...
pnpm add react-dropzone react-dnd react-dnd-html5-backend

# 5. Setup root
cd ../..
pnpm add -D turbo eslint prettier
npx turbo init
```

### 10.2 Environment variables

**apps/api/.env.local:**
```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
DATABASE_URL=postgresql://user:pass@host/dbname
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3002
```

**apps/web/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

**apps/dashboard/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

---

## 11. Decisiones rechazadas (alternativas consideradas)

| Decisión | Elegida | Rechazada | Razón |
|---|---|---|---|
| Framework | Next.js | SvelteKit, Remix, Astro | Mejor ecosistema React, deployment más simple |
| CSS | Tailwind | Styled-comp, CSS Modules, CSS-in-JS | Best-in-class performance, utility-first |
| State | Zustand | Redux, Context, Jotai | Simplicidad + performance para carrito |
| Data fetching | React Query | SWR, Apollo, Axios manual | Caching automático, dev experience superior |
| ORM | Prisma | TypeORM, Sequelize, Drizzle | Type-safe, migraciones, dev experience |
| Monorepo | TurboRepo | Nx, Lerna, pnpm workspaces | Balance entre features y complejidad |
| Icons | Lucide | FontAwesome, React Icons | Lightweight, SVG puro, tree-shakeable |
| Validation | Zod | Yup, Joi, Valibot | Best DX, type inference excelente |
| Forms | React Hook Form | Formik, Unform | Performance (menos re-renders) |

---

## 12. Performance & Security recomendaciones

### 12.1 Frontend optimizaciones
- Next.js Image Optimization automático
- Code splitting automático con dynamic imports
- Font optimization (next/font)
- CSS purging automático en Tailwind
- Lazy loading de componentes con React.lazy

### 12.2 Backend optimizaciones
- Prisma query optimization (select específico, índices)
- Redis cache (Fase 3)
- Rate limiting en endpoints públicos (Fase 3)
- Compression automática (helmet)

### 12.3 Seguridad
- Helmet headers automáticos
- CORS restrictivo a dominio
- JWT en HttpOnly cookies
- Validación Zod en backend
- SQL injection protection (Prisma)
- Environment variables no versionadas

---

## 13. Upgrade path (futuro)

**Fase 3+:**
- Redis: `redis`, `ioredis` para caching/rate limit
- Email: `nodemailer` o `sendgrid` para notificaciones
- Payments: `stripe` para Plan Pro
- Analytics: `segment`, `mixpanel` o GA4
- Testing: `jest`, `vitest`, `playwright`
- Monitoring: `sentry` para errores

