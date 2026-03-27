# ÑAMI — Estructura de Carpetas Simple (Frontend + Backend)

**Versión:** 2.0
**Fecha:** 26 marzo 2026
**Scope:** Estructura simplificada sin TurboRepo

---

## 1. Estructura de directorios

```
ñami/
│
├── frontend/                   # Next.js (landing + feed + dashboard)
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # "/" → Landing
│   │   ├── feed/page.tsx       # "/feed" → Feed restaurantes
│   │   ├── [slug]/page.tsx     # "/[slug]" → Restaurante detalle
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── perfil/page.tsx
│   │   │   └── menu/page.tsx
│   │   ├── globals.css
│   │   └── providers.tsx
│   │
│   ├── components/
│   │   ├── landing/
│   │   │   ├── navbar.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   └── ...
│   │   ├── web/
│   │   │   ├── restaurant-card.tsx
│   │   │   ├── menu-grid.tsx
│   │   │   ├── cart-drawer.tsx
│   │   │   └── ...
│   │   ├── dashboard/
│   │   │   ├── menu-editor.tsx
│   │   │   └── ...
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ... (shadcn)
│   │   └── shared/
│   │       ├── header.tsx
│   │       └── footer.tsx
│   │
│   ├── lib/
│   │   ├── api.ts              # Fetch wrapper
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── supabase.ts
│   │
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useAuth.ts
│   │   ├── useRestaurants.ts
│   │   └── useDebounce.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── public/
│   │   └── images/
│   │
│   ├── .env.local               # NO versionar
│   ├── .env.local.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   ├── postcss.config.mjs
│   └── README.md
│
├── backend/                    # Express + Prisma
│   ├── src/
│   │   ├── index.ts            # Entry point
│   │   ├── types.ts
│   │   │
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── supabase.ts
│   │   │   └── env.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── ...
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── restaurants/
│   │   │   ├── menu/
│   │   │   ├── dashboard/
│   │   │   └── admin/
│   │   │
│   │   └── utils/
│   │       ├── errors.ts
│   │       ├── storage.ts
│   │       └── slug.ts
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── .env.local               # NO versionar
│   ├── .env.local.example
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── Docs/                        # Documentación
│   ├── ÑAMI_SISTEMA_COMPLETO.md
│   ├── PROYECTO.md
│   ├── ARQUITECTURA.md
│   ├── BACKEND_COMPLETO_PRISMA_SUPABASE.md
│   ├── FRONTEND.md
│   ├── INTEGRACION_LANDING_WEBAPP.md
│   ├── STACK_Y_DEPENDENCIAS.md
│   ├── PACKAGE_JSON_TEMPLATES.md
│   ├── CONFIG_TEMPLATES.md
│   └── ESTRUCTURA_CARPETAS_SIMPLE.md (este archivo)
│
├── .gitignore                  # Root gitignore
├── .prettierrc.json            # Prettier config compartido
├── .eslintrc.json              # ESLint config compartido
├── README.md                   # README root
└── package.json                # Root (scripts útiles)
```

---

## 2. Setup sin TurboRepo (MÁS SIMPLE)

### 2.1 Root package.json (simplificado)

```json
{
  "name": "nami",
  "version": "1.0.0",
  "description": "Plataforma SaaS de descubrimiento local de restaurantes",
  "private": true,
  "packageManager": "pnpm@8.15.0",
  "scripts": {
    "dev": "concurrently \"cd backend && pnpm run dev\" \"cd frontend && pnpm run dev\"",
    "dev:backend": "cd backend && pnpm run dev",
    "dev:frontend": "cd frontend && pnpm run dev",
    "build": "cd backend && pnpm run build && cd ../frontend && pnpm run build",
    "build:backend": "cd backend && pnpm run build",
    "build:frontend": "cd frontend && pnpm run build",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "lint": "eslint . --fix"
  },
  "devDependencies": {
    "concurrently": "^8.2.0",
    "prettier": "^3.2.0",
    "eslint": "^8.57.0"
  }
}
```

**Instalar en root:**
```bash
pnpm install
```

### 2.2 Instalación (orden correcto)

```bash
# 1. Root
cd ñami
pnpm install

# 2. Backend
cd backend
pnpm install
npx prisma init
# Copiar schema.prisma
npx prisma migrate dev --name init
npx prisma generate

# 3. Frontend
cd ../frontend
pnpm install
npx shadcn-ui@latest init --defaults

# 4. Volver a root
cd ..
```

### 2.3 Ejecutar desarrollo (opción A)

```bash
# Desde root: levanta AMBAS apps
pnpm run dev

# Verás:
# > backend: ✅ Server running on port 3000
# > frontend: ▲ Next.js 15.1.0
```

### 2.4 Ejecutar desarrollo (opción B - por separado)

```bash
# Terminal 1: Backend
cd backend && pnpm run dev
# http://localhost:3000

# Terminal 2: Frontend
cd frontend && pnpm run dev
# http://localhost:3001
```

---

## 3. Frontend package.json (actualizado)

```json
{
  "name": "@nami/frontend",
  "version": "1.0.0",
  "description": "ÑAMI Frontend (Next.js)",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --fix",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.48.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.4",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-sheet": "^1.1.1",
    "lucide-react": "^0.469.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "@supabase/supabase-js": "^2.45.0",
    "qrcode.react": "^1.0.1"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^20.14.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38"
  }
}
```

---

## 4. Backend package.json (actualizado)

```json
{
  "name": "@nami/backend",
  "version": "1.0.0",
  "description": "ÑAMI Backend (Express)",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --transpile-only --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "type-check": "tsc --noEmit",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
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
    "typescript": "^5.7.0",
    "ts-node-dev": "^2.0.0",
    "ts-node": "^10.9.0",
    "@types/express": "^4.17.21",
    "@types/node": "^20.14.0",
    "prisma": "^5.7.0"
  }
}
```

---

## 5. Variables de entorno

### frontend/.env.local.example

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

### backend/.env.local.example

```env
# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
SUPABASE_JWT_SECRET=xxx

# Database
DATABASE_URL=postgresql://user:pass@host/dbname

# Server
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3001
```

---

## 6. URLs y routing

### Frontend (Next.js en localhost:3001)

```
http://localhost:3001/              → Landing
http://localhost:3001/feed          → Feed restaurantes
http://localhost:3001/[slug]        → Restaurante detalle
http://localhost:3001/login         → Login
http://localhost:3001/register      → Registro
http://localhost:3001/dashboard     → Mi restaurante (protegido)
```

### Backend (Express en localhost:3000)

```
http://localhost:3000/health        → Health check
http://localhost:3000/api/auth/register
http://localhost:3000/api/auth/login
http://localhost:3000/api/restaurants
http://localhost:3000/api/restaurants/:slug
http://localhost:3000/api/dashboard/*
```

### Frontend → Backend (API calls)

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

fetch(`${API_URL}/api/restaurants`)
```

---

## 7. Deploy (en producción)

### Frontend (Vercel)

```
- Repository: GitHub
- Framework: Next.js
- Root Directory: frontend
- Build Command: npm run build (o pnpm run build)
- Environment Variable: NEXT_PUBLIC_API_URL=https://api.nami.app
- Deploy on main branch
- Domain: nami.app
```

### Backend (Render o Railway)

```
- Repository: GitHub
- Root Directory: backend
- Build Command: npm install && npm run build
- Start Command: npm start
- Environment Variables:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - DATABASE_URL
  - etc.
- Deploy on main branch
- Domain: api.nami.app
```

---

## 8. Checklist de setup inicial

- [ ] Crear carpetas: `mkdir frontend backend`
- [ ] `cd backend && pnpm init`
- [ ] Copiar `backend/package.json` template
- [ ] `cd ../frontend && pnpm create next-app@latest . --typescript`
- [ ] Copiar `frontend/package.json` template
- [ ] `cd .. && pnpm install`
- [ ] Setup Supabase (proyecto, keys, bucket, auth)
- [ ] Copiar `.env.local.example` → `.env.local` en ambas carpetas
- [ ] Llenar valores reales en `.env.local`
- [ ] `cd backend && npx prisma init`
- [ ] Copiar `schema.prisma`
- [ ] `npx prisma migrate dev --name init`
- [ ] `cd ../frontend && npx shadcn-ui@latest init`
- [ ] Instalar componentes: `npx shadcn-ui@latest add button card input`
- [ ] `cd .. && pnpm run dev` (verifica que levanten ambas)
- [ ] Probar rutas:
  - `http://localhost:3001/` (landing)
  - `http://localhost:3000/health` (backend health)

---

## 9. Estructura mínima para empezar

**Lo MÍNIMO para que funcione el primer día:**

### frontend/
```
app/
├── layout.tsx          (ROOT LAYOUT)
├── page.tsx            (LANDING - copia de nami-landing/)
├── globals.css
└── providers.tsx       (Supabase + React Query)

components/
├── landing/
│   ├── navbar.tsx
│   ├── hero.tsx
│   └── footer.tsx
└── ui/
    └── button.tsx

lib/
├── api.ts
└── supabase.ts

.env.local
package.json
tsconfig.json
next.config.ts
tailwind.config.ts
postcss.config.mjs
```

### backend/
```
src/
├── index.ts            (EXPRESS APP)
├── config/
│   ├── database.ts
│   └── supabase.ts
├── middleware/
│   └── errorHandler.ts
└── modules/
    └── health/
        └── router.ts

prisma/
└── schema.prisma

.env.local
package.json
tsconfig.json
```

---

## 10. Comandos útiles

### Desarrollo

```bash
# Ambas apps
pnpm run dev

# Solo backend
cd backend && pnpm run dev

# Solo frontend
cd frontend && pnpm run dev

# Verificar tipos
cd frontend && pnpm run type-check
cd backend && pnpm run type-check
```

### Prisma

```bash
cd backend

# Ver BD en GUI
pnpm run prisma:studio

# Crear migración
pnpm run prisma:migrate

# Generar cliente
pnpm run prisma:generate
```

### Build & Deploy

```bash
# Build ambas
pnpm run build

# Build solo backend
pnpm run build:backend

# Build solo frontend
pnpm run build:frontend
```

---

## 11. Resumen de diferencias vs TurboRepo

| Aspecto | TurboRepo | Simple (Este) |
|---|---|---|
| **Setup** | Complejo (turbo.json) | Trivial (package.json) |
| **Dev** | `turbo run dev` | `pnpm run dev` |
| **Build cache** | Automático | Manual (simplificar) |
| **Size** | +2GB | Mínimo |
| **Learning curve** | Empinada | Plana |
| **Mantenimiento** | Más complicado | Muy simple |
| **Ideal para** | Empresas grandes (50+ apps) | Startups, MVPs (2-3 apps) |

**Para ÑAMI (2 apps): estructura simple es MEJOR**

---

## 12. Migración futura a monorepo

**Si en Fase 4+ necesitas múltiples apps (admin, mobile, etc.):**
```bash
# Creas estructura TurboRepo
npm install -g turbo
npx create-turbo@latest

# Migraste frontend/ → apps/web/
# Migraste backend/ → apps/api/
# Agregas apps/admin/, apps/mobile/, etc.
```

**Por ahora: Keep It Simple! ✨**

