# ÑAMI — Integración Landing → Web App

**Versión:** 2.0
**Fecha:** 26 marzo 2026
**Scope:** Arquitectura de producto completo (landing + feed de restaurantes)

---

## 1. Decisión de arquitectura: Monorepo unificado

### 1.1 Estructura actual vs. propuesta

#### Estado actual:
```
ñami/
├── nami-landing/              # Landing aislada (Next.js 15)
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── ...
├── back/                       # Vacío
├── front/                      # Vacío
└── Docs/
```

#### Estado propuesto (RECOMENDADO):
```
ñami/
├── apps/
│   ├── web/                    # NUEVA: Feed + Restaurante + Carrito (Next.js)
│   ├── dashboard/              # Admin restaurante (Next.js)
│   ├── api/                    # Backend (Express)
│   └── landing/                # MIGRAR nami-landing aquí
├── packages/                   # Código compartido (FUTURO)
│   ├── ui/                     # Componentes shadcn compartidos
│   ├── styles/                 # Tailwind tokens + CSS
│   └── types/                  # Types TypeScript compartidos
├── nami-landing/               # (DEPRECATED, guardar como backup)
├── Docs/
└── ...
```

### 1.2 Razón: Por qué migrar landing al monorepo

| Aspecto | Separado | Monorepo | Ganancia |
|---|---|---|---|
| **DRY (Don't Repeat Yourself)** | Duplicar estilos, componentes | Compartir componentes | 40% menos código |
| **Mantenimiento** | 2 `package.json`, 2 configs Tailwind | 1 solo | Menos deuda técnica |
| **Deployment** | 2 deploys en Vercel | 1 deploy, 2 apps | Deploy más simple |
| **Consistencia** | Riesgo de versiones distintas | Monorepo lock | UI/UX uniforme garantizada |
| **Performance** | Cada app con su build | Build cache compartido (TurboRepo) | CI/CD más rápido |

---

## 2. User Flow: Landing → Feed → Restaurante

### 2.1 Flujo visual

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ÑAMI Landing (SEO)                              │
│                      nami.app (o nami.vercel.app)                       │
│                                                                           │
│  Hero → ProblemSolution → Features → Plans → ContactForm → FAQ          │
│                                                                           │
│  [CTA Principal: "Sé uno de los primeros"]  ──────────────────┐         │
│                                                                │         │
│  Usuarios potenciales → Ven propuesta → Se interesan        │         │
└────────────────────────────────────────────────────────────────┼─────────┘
                                                                  │
                                                                  │ (Restaurante
                                                                  │  registrado)
                                                                  │
                                                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Dashboard Restaurante                              │
│                    nami.app/dashboard (protegido)                       │
│                                                                           │
│  Login → Mi Restaurante → Editar Perfil → Gestionar Menú → Ver Link    │
│                                                                           │
│  [Restaurante configura su negocio]                                     │
└────────────────────────────────────────────────────────────────┬─────────┘
                                                                  │
                                                                  │ (Activa
                                                                  │  su perfil)
                                                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Feed Público (Sin Login)                           │
│                         nami.app (mismo dominio)                        │
│                                                                           │
│  Feed → Filtra por categoría → Click en restaurante → Ve menú          │
│                   ↓                                      ↓               │
│         [200+ restaurantes]                    [Items + Carrito]        │
│                                                                           │
│  [Cliente construye pedido]                                             │
└────────────────────────────────────────────────────────────────┬─────────┘
                                                                  │
                                                                  ▼
                                        [Abre WhatsApp al restaurante]
                                        [Cliente + Restaurante negocian]
```

### 2.2 Rutas y navegación

**Todas en MISMO DOMINIO `nami.app`:**

```
nami.app/                          → Landing (SEO, sign-up, formulario)
nami.app/login                     → Login restaurante
nami.app/register                  → Registro restaurante
nami.app/dashboard                 → Mi restaurante (protegido)
nami.app/dashboard/perfil          → Editar perfil (protegido)
nami.app/dashboard/menu            → Gestionar menú (protegido)
nami.app/dashboard/qr              → Descargar QR (protegido, Pro)

nami.app/feed                      → Feed explícito (IGUAL que /)
nami.app/[slug]                    → Perfil restaurante público
nami.app/[slug]/carrito            → Carrito (drawer modal, no necesita ruta)
```

---

## 3. Arquitectura de apps en Vercel

### 3.1 Opción recomendada: Monorepo en una sola deploy

**Setup en Vercel:**
```
Proyecto: "ÑAMI"
├── Root: /
│   ├── Root Directory: apps/web
│   ├── Build Command: pnpm run build
│   ├── Output Directory: .next
│   ├── Env: NEXT_PUBLIC_API_URL=https://api.nami.app
│
├── Preview Deployment: ENABLED
└── Auto-deploy en main branch

Backend separado (Render):
├── Service: nami-api
├── URL: https://api.nami.app
└── Auto-deploy en main branch
```

**Ventaja:**
- Landing + Feed + Dashboard en UNA app Next.js
- Build + deploy simultáneo
- Mismo dominio, mismo contexto

### 3.2 Monorepo en TurboRepo (nuestra estructura)

```bash
# En root, solo correr:
pnpm run dev

# Automáticamente levanta:
# - apps/api en http://localhost:3000
# - apps/web en http://localhost:3001 (con landing + feed + dashboard)
# - apps/dashboard en http://localhost:3002 (opcional, si es app separada)
```

---

## 4. Integración técnica: De Landing a Feed

### 4.1 Decisión 1: ¿Migrar landing a apps/web o mantener separada?

#### Opción A: MIGRAR landing a apps/web (RECOMENDADO)

```
apps/web/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, providers)
│   ├── page.tsx                # "/" → Landing component
│   ├── feed/                   # "/feed" (NUEVO)
│   │   └── page.tsx            # Feed principal
│   ├── [slug]/                 # "/[slug]" → Restaurante
│   │   └── page.tsx
│   ├── login/page.tsx          # "/login" (NUEVO)
│   ├── register/page.tsx       # "/register" (NUEVO)
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── perfil/page.tsx
│   │   └── menu/page.tsx
│   ├── globals.css
│   └── providers.tsx           # QueryClient, Supabase, Themes
├── components/
│   ├── landing/                # Componentes landing (MIGRADO)
│   │   ├── navbar.tsx
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── contact-form.tsx
│   │   └── ...
│   ├── web/                    # Componentes feed
│   │   ├── restaurant-card.tsx
│   │   ├── menu-grid.tsx
│   │   ├── cart-drawer.tsx
│   │   └── ...
│   ├── dashboard/              # Componentes admin
│   │   ├── menu-editor.tsx
│   │   ├── image-uploader.tsx
│   │   └── ...
│   ├── ui/                     # shadcn components (botones, inputs, etc.)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── shared/                 # Shared entre landing + feed + dashboard
│       ├── header.tsx
│       ├── footer.tsx
│       └── ...
└── package.json
```

**Ventajas:**
- ✅ Un solo build, un solo deploy
- ✅ Componentes compartidos (Header, Footer, etc.)
- ✅ Estilos centralizados (un Tailwind)
- ✅ Un solo `package.json`

**Desventajas:**
- ❌ Más código en una sola app (pero Next.js lo maneja bien hasta 500K LOC)

#### Opción B: Mantener landing separada

```
nami-landing/                 # Deploy separado en Vercel
  ├── app/
  └── ...

apps/web/                     # Deploy separado en Vercel
  ├── app/
  └── ...
```

**Desventajas:**
- ❌ Duplicación de código (Tailwind, componentes, types)
- ❌ 2 deploys, 2 builds
- ❌ Riesgo de inconsistencia visual

**❌ NO RECOMENDADO**

---

## 5. Implementación: Estructura de componentes moderna

### 5.1 Sistema de componentes por capas

```
components/
├── 0-primitives/               # UI base (botones, inputs, cards)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   └── ...
│
├── 1-patterns/                 # Componentes reusables (formularios, listas)
│   ├── FormField.tsx           # Input + Label + Error
│   ├── ImageUploader.tsx       # Drag-drop + preview
│   ├── ConfirmDialog.tsx       # Modal de confirmación
│   └── LoadingSpinner.tsx
│
├── 2-sections/                 # Secciones de página (landing, feed, dashboard)
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── FAQSection.tsx
│   │   └── CTASection.tsx
│   │
│   ├── web/                    # Feed
│   │   ├── FeedHeader.tsx
│   │   ├── FilterBar.tsx
│   │   ├── RestaurantGrid.tsx
│   │   └── RestaurantDetail.tsx
│   │
│   └── dashboard/              # Admin
│       ├── SidebarNav.tsx
│       ├── MenuEditor.tsx
│       └── ProfileForm.tsx
│
├── 3-layouts/                  # Layouts reutilizables
│   ├── LandingLayout.tsx       # Sin sidebar, header + footer
│   ├── WebLayout.tsx           # Feed layout
│   └── DashboardLayout.tsx     # Con sidebar protegido
│
└── ui/                         # shadcn/ui componentes importados
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── select.tsx
    ├── sheet.tsx
    ├── tabs.tsx
    └── ... (instalados con shadcn CLI)
```

### 5.2 Patrón: Componentes composables

**Ejemplo 1: RestaurantCard (reutilizable en feed + landing)**

```typescript
// components/2-sections/web/RestaurantCard.tsx
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

interface RestaurantCardProps {
  restaurant: {
    id: string;
    slug: string;
    name: string;
    category: string;
    logoUrl?: string;
    plan: 'GRATIS' | 'PRO';
    isClosed: boolean;
    distance?: number; // Opcional
  };
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/${restaurant.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {/* Imagen */}
        {restaurant.logoUrl && (
          <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900">
            <Image
              src={restaurant.logoUrl}
              alt={restaurant.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Contenido */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Header: Nombre + Plan */}
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-bold text-lg leading-tight truncate-2">
              {restaurant.name}
            </h3>
            {restaurant.plan === 'PRO' && (
              <Badge className="bg-primary-500 text-white flex-shrink-0">
                ⭐ Pro
              </Badge>
            )}
          </div>

          {/* Categoría */}
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            {restaurant.category}
          </p>

          {/* Status */}
          {restaurant.isClosed && (
            <Badge variant="destructive" className="w-fit">
              Cerrado ahora
            </Badge>
          )}

          {/* Footer: Distancia (opcional) */}
          {restaurant.distance && (
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-auto pt-2">
              📍 {restaurant.distance.toFixed(1)} km
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
```

**Ejemplo 2: ImageUploader (dashboard)**

```typescript
// components/1-patterns/ImageUploader.tsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (file: File) => Promise<string>; // Retorna URL
  label?: string;
  maxSize?: number; // MB
}

export function ImageUploader({
  onUpload,
  label = 'Cargar imagen',
  maxSize = 5,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setError('');

      // Validar tamaño
      if (file.size > maxSize * 1024 * 1024) {
        setError(`Máximo ${maxSize}MB`);
        return;
      }

      // Preview local
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      // Upload
      setIsLoading(true);
      try {
        const url = await onUpload(file);
        setPreview(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al subir');
        setPreview('');
      } finally {
        setIsLoading(false);
      }
    },
    [onUpload, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700">
          <Image
            src={preview}
            alt="preview"
            fill
            className="object-cover"
          />
          <button
            onClick={() => setPreview('')}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
              : 'border-slate-300 dark:border-slate-700 hover:border-primary-500'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-2 text-slate-400" size={32} />
          <p className="font-semibold text-slate-900 dark:text-slate-50">
            {label}
          </p>
          <p className="text-sm text-slate-500">
            O arrastra una imagen aquí
          </p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {isLoading && (
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Loader2 className="animate-spin" size={16} />
          Subiendo...
        </div>
      )}
    </div>
  );
}
```

---

## 6. Navegación y flujo de redirecciones

### 6.1 Navbar adaptativo (landing + feed + dashboard)

```typescript
// components/shared/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth'; // Supabase session
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const { session, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Rutas públicas (landing + feed)
  const isPublic = pathname === '/' || pathname.startsWith('/feed') || pathname === '/' || /^\/[^/]+$/.test(pathname);

  // Rutas protegidas (dashboard)
  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/login');

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary-500">
          ÑAMI
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-6 items-center">
          {isPublic && (
            <>
              <Link href="/feed" className="hover:text-primary-500 transition">
                Restaurantes
              </Link>
              <Link href="/#features" className="hover:text-primary-500 transition">
                Características
              </Link>
              <Link href="/#pricing" className="hover:text-primary-500 transition">
                Planes
              </Link>
            </>
          )}

          {session ? (
            <>
              <Link href="/dashboard" className="text-sm hover:text-primary-500">
                Dashboard
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">{session.user?.email}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => signOut()}>
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Acceder</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary-500 hover:bg-primary-600">
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu content */}
      {mobileOpen && (
        <div className="md:hidden border-t p-4 space-y-2">
          {isPublic && (
            <>
              <Link href="/feed" className="block py-2 hover:text-primary-500">
                Restaurantes
              </Link>
              <Link href="/#features" className="block py-2 hover:text-primary-500">
                Características
              </Link>
            </>
          )}
          {session ? (
            <>
              <Link href="/dashboard" className="block py-2">
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="block py-2 text-left w-full"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2">
                Acceder
              </Link>
              <Link href="/register" className="block py-2">
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
```

### 6.2 Redirecciones automáticas

**En `app/page.tsx`:**
```typescript
// nami.app/ → puede ser landing O feed dependiendo si está autenticado
// Lógica: mostrar landing si NO hay usuario restaurante, feed si hay
export default function HomePage() {
  return <LandingPage />; // Para clientes sin login
}
```

**En `app/login/page.tsx`:**
```typescript
// Si ya está autenticado, redirigir a dashboard automáticamente
const { session } = useAuth();
useEffect(() => {
  if (session) router.push('/dashboard');
}, [session]);
```

---

## 7. Styling consistency entre landing + feed

### 7.1 Design tokens centralizados

**`lib/design-tokens.ts`:**
```typescript
export const COLORS = {
  primary: {
    50: '#fff8f0',
    500: '#FF7A00',
    600: '#EA580C',
    900: '#8B3E00',
  },
  accent: '#B088C9',
  detail: '#D2E600',
};

export const TYPOGRAPHY = {
  display: 'font-display',
  body: 'font-body',
};

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
};

export const BREAKPOINTS = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
};
```

**En `globals.css`:**
```css
@import "tailwindcss";

@layer base {
  :root {
    --color-primary: #FF7A00;
    --color-accent: #B088C9;
    --color-detail: #D2E600;
  }

  body {
    @apply bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-500 text-white hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors;
  }

  .card {
    @apply rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow;
  }
}
```

---

## 8. Renderizado y performance

### 8.1 Server vs. Client Components

**Landing (Server side rendering):**
```typescript
// app/page.tsx (Server Component)
export default async function LandingPage() {
  // Puede fetchear data estática en build time
  const testimonials = await getTestimonials(); // ISR/SSG

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection testimonials={testimonials} />
      {/* ContactForm es client component */}
      <ContactFormSection />
    </>
  );
}
```

**Feed (Client side con React Query):**
```typescript
// app/feed/page.tsx (Client Component)
'use client';

import { useQuery } from '@tanstack/react-query';

export default function FeedPage() {
  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => apiClient.get('/restaurants'),
  });

  return <RestaurantGrid restaurants={restaurants} />;
}
```

### 8.2 Optimizaciones automáticas

- **Next.js Image:** Optimization automático de fotos
- **Code splitting:** Lazy load componentes pesados
- **TurboRepo cache:** Build incremental
- **Tailwind purging:** CSS automático minificado

---

## 9. Deployment unificado en Vercel

### 9.1 Configuración en Vercel dashboard

```
Project Name: ÑAMI
Git: GitHub repo (ñami)
Framework: Next.js
Root Directory: apps/web

Environment Variables:
├── NEXT_PUBLIC_API_URL=https://api.nami.app
├── NEXT_PUBLIC_SUPABASE_URL=...
└── NEXT_PUBLIC_SUPABASE_ANON_KEY=...

Domains:
├── nami.app (production)
└── staging-ñami.vercel.app (preview)

Auto-deploy: main branch
```

### 9.2 Build command centralizado

**`turbo.json`:**
```json
{
  "build": {
    "dependsOn": ["^build"],
    "outputs": [".next/**"],
    "cache": true
  }
}
```

**En Vercel, build command:**
```bash
pnpm run build
```

Esto automáticamente:
1. Corre `cd apps/web && next build`
2. Crea `.next/` optimizado
3. Deploy a production

---

## 10. Resumen: De landing a feed en UNA app

| Aspecto | Implementación |
|---|---|
| **Monorepo** | TurboRepo + pnpm |
| **Apps** | `apps/web` (landing + feed + dashboard en 1 app) |
| **Framework** | Next.js 15 (SSR + SSG + ISR) |
| **Styling** | Tailwind v4 + componentes shadcn + design tokens |
| **Componentes** | 3 capas: primitives → patterns → sections |
| **Autenticación** | Supabase Auth (solo para restaurantes) |
| **Datos** | React Query (feed), SSR (landing) |
| **Deploy** | Un solo proyecto en Vercel |
| **Dominio** | nami.app (todas las rutas) |
| **Performance** | Image opt, code splitting, cache, ISR |

---

## 11. Checklist de implementación

- [ ] Migrar `nami-landing/` a `apps/web/app/landing/` o mantener como `app/page.tsx`
- [ ] Crear `components/` con estructura de 3 capas
- [ ] Instalar shadcn/ui en `apps/web`
- [ ] Crear `lib/design-tokens.ts` con colores + spacing
- [ ] Crear `components/shared/Navbar.tsx` adaptativo
- [ ] Crear `app/[slug]/page.tsx` (restaurante)
- [ ] Crear `app/feed/page.tsx` (feed con React Query)
- [ ] Crear `app/dashboard/` protegido con auth
- [ ] Crear hooks: `useAuth()`, `useCart()`, `useRestaurants()`
- [ ] Conectar API en `lib/api.ts`
- [ ] Configurar en Vercel (1 proyecto, 1 deploy)
- [ ] Testing: validar landing + feed + dashboard en producción

