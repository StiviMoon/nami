# ÑAMI — package.json Templates

**Copia y pega estos archivos en cada app. Ajusta versiones si es necesario.**

---

## Root: `/package.json`

```json
{
  "name": "nami",
  "version": "1.0.0",
  "description": "Plataforma SaaS de descubrimiento local de restaurantes",
  "private": true,
  "packageManager": "pnpm@8.15.0",
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "start": "turbo run start",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules .turbo"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "eslint": "^8.57.0",
    "prettier": "^3.2.0",
    "typescript": "^5.7.0"
  }
}
```

**Setup:**
```bash
pnpm install
npx turbo init
```

---

## apps/api: `/apps/api/package.json`

```json
{
  "name": "@nami/api",
  "version": "1.0.0",
  "description": "ÑAMI Backend API (Express + Prisma)",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --transpile-only --respawn src/index.ts",
    "build": "tsc --project tsconfig.json",
    "start": "node dist/index.js",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --fix",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "clean": "rm -rf dist"
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
    "@types/cors": "^2.8.17",
    "@types/node": "^20.14.0",
    "@types/jsonwebtoken": "^9.0.7",
    "nodemon": "^3.1.0",
    "prisma": "^5.7.0",
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0"
  }
}
```

**Setup:**
```bash
cd apps/api
pnpm install
npx prisma init
# Configurar DATABASE_URL en .env.local
npx prisma migrate dev --name init
pnpm run dev
```

**Estructura de carpetas:**
```
src/
├── index.ts
├── types.ts
├── config/
│   ├── database.ts
│   └── supabase.ts
├── middleware/
│   ├── auth.ts
│   └── errorHandler.ts
├── modules/
│   ├── restaurants/
│   │   ├── controller.ts
│   │   ├── service.ts
│   │   ├── validators.ts
│   │   └── router.ts
│   ├── menu/
│   ├── auth/
│   ├── dashboard/
│   └── admin/
└── utils/
    ├── errors.ts
    └── validators.ts
```

---

## apps/web: `/apps/web/package.json`

```json
{
  "name": "@nami/web",
  "version": "1.0.0",
  "description": "ÑAMI Web - Cliente (Feed de restaurantes)",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --fix",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next dist"
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
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-sheet": "^1.1.1",
    "@radix-ui/react-slot": "^2.0.2",
    "lucide-react": "^0.469.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "@supabase/supabase-js": "^2.45.0",
    "qrcode.react": "^1.0.1",
    "next-image-export-optimizer": "^1.20.4"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^20.14.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "@tailwindcss/typography": "^0.5.10",
    "eslint": "^8.57.0",
    "eslint-config-next": "^15.1.0"
  }
}
```

**Setup:**
```bash
cd apps/web
pnpm install

# Instalar shadcn components
npx shadcn-ui@latest init --defaults
npx shadcn-ui@latest add button input badge card
npx shadcn-ui@latest add dialog dropdown-menu select sheet tabs
npx shadcn-ui@latest add form

pnpm run dev
# Accede a http://localhost:3001
```

**Estructura de carpetas:**
```
app/
├── layout.tsx
├── page.tsx
├── [slug]/
│   ├── page.tsx
│   └── layout.tsx
├── globals.css
└── loading.tsx

components/
├── RestaurantCard.tsx
├── MenuGrid.tsx
├── CartDrawer.tsx
├── FilterBar.tsx
├── Providers.tsx
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ... (shadcn)
└── LoadingSpinner.tsx

lib/
├── api.ts
├── utils.ts
├── constants.ts
└── supabase.ts

hooks/
├── useCart.ts
├── useRestaurants.ts
├── useRestaurant.ts
└── useDebounce.ts

types/
└── index.ts

public/
└── images/
```

---

## apps/dashboard: `/apps/dashboard/package.json`

```json
{
  "name": "@nami/dashboard",
  "version": "1.0.0",
  "description": "ÑAMI Dashboard - Admin restaurante",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --fix",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next dist"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "@tanstack/react-query": "^5.48.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.4",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-sheet": "^1.1.1",
    "@radix-ui/react-slot": "^2.0.2",
    "lucide-react": "^0.469.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "@supabase/supabase-js": "^2.45.0",
    "@supabase/auth-helpers-nextjs": "^0.10.0",
    "qrcode.react": "^1.0.1",
    "react-dropzone": "^14.2.3",
    "react-dnd": "^16.0.1",
    "react-dnd-html5-backend": "^16.0.1"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^20.14.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/react-dnd": "^3.0.5",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "@tailwindcss/typography": "^0.5.10",
    "eslint": "^8.57.0",
    "eslint-config-next": "^15.1.0"
  }
}
```

**Setup:**
```bash
cd apps/dashboard
pnpm install

# Instalar shadcn components (mismo que web)
npx shadcn-ui@latest init --defaults
npx shadcn-ui@latest add button input badge card form

pnpm run dev
# Accede a http://localhost:3002
```

---

## Instalación completa (one-liner)

```bash
# Desde root
pnpm install

# Setup apps en paralelo
cd apps/api && npx prisma init && pnpm run prisma:migrate &
cd ../web && npx shadcn-ui@latest init --defaults &
cd ../dashboard && npx shadcn-ui@latest init --defaults &

# Esperar a que terminen, luego:
pnpm run dev
```

---

## Verificación post-instalación

```bash
# En root:
pnpm run type-check
# Debe pasar sin errores

# Verificar que puedas ejecutar dev:
pnpm run dev
# Debe mostrar:
# > @nami/api dev
# ✅ Server running on port 3000
# > @nami/web dev
# ▲ Next.js 15.1.0
# > @nami/dashboard dev
# ▲ Next.js 15.1.0
```

---

## Gestionar dependencias

### Agregar dependencia en una app
```bash
cd apps/web
pnpm add [package]
```

### Actualizar todas
```bash
cd root
pnpm update
pnpm run build
pnpm run type-check
```

### Ver dependencias instaladas
```bash
pnpm list
# O en una app específica:
cd apps/api && pnpm list
```

---

## Notas importantes

- **Node.js version:** Usa `nvm` para 20.x
- **pnpm version:** Asegúrate de tener `^8.0.0`
- **.env.local:** Nunca versiones, `.gitignore` debe ignorarlas
- **Prisma:** Después de cambiar `schema.prisma`, siempre corre:
  ```bash
  pnpm run prisma:generate
  npx prisma migrate dev
  ```

