# ÑAMI — Frontend Specification

**Versión:** 2.0
**Fecha:** 26 marzo 2026
**Stack:** Next.js 15 + React 19 + TypeScript + Tailwind v4 + shadcn/ui

---

## 1. Estructura y setup

### 1.1 Monorepo setup

```bash
# Estructura
ñami/
├── apps/
│   ├── web/           # Cliente (feed, restaurante, carrito)
│   ├── dashboard/     # Admin restaurante (login, menú, perfil)
│   └── api/           # Backend (ya documentado)
├── nami-landing/      # Landing (ya existe)
└── Docs/
```

### 1.2 Stack compartido

```json
{
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "qrcode.react": "^1.0.1",
    "lucide-react": "^0.469.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-helpers-nextjs": "^0.10.0"
  }
}
```

---

## 2. apps/web — Cliente (Feed + Restaurante + Carrito)

### 2.1 Estructura de carpetas

```
apps/web/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Feed principal "/"
│   ├── [slug]/
│   │   ├── page.tsx            # Restaurante "/[slug]"
│   │   └── layout.tsx          # (opcional)
│   ├── globals.css             # Tailwind + custom tokens
│   └── loading.tsx
├── components/
│   ├── RestaurantCard.tsx      # Card en feed
│   ├── MenuGrid.tsx            # Grid de items
│   ├── CartDrawer.tsx          # Carrito (drawer side)
│   ├── WhatsAppButton.tsx      # Botón "Enviar pedido"
│   ├── FilterBar.tsx           # Filtros (categoría, búsqueda)
│   ├── RestaurantHeader.tsx    # Header del restaurante
│   ├── LoadingSpinner.tsx      # Skeleton loaders
│   └── ...
├── lib/
│   ├── api.ts                  # API client (fetch wrapper)
│   ├── utils.ts                # Helpers (cn, format, etc.)
│   ├── constants.ts            # URLs, enums
│   └── supabase.ts             # Supabase client (storage)
├── hooks/
│   ├── useCart.ts              # Zustand cart store
│   ├── useRestaurant.ts        # React Query para restaurante
│   ├── useRestaurants.ts       # React Query para feed
│   └── useDebounce.ts          # Search debounce
├── types/
│   └── index.ts                # TypeScript interfaces
├── public/
│   ├── images/
│   └── ...
├── .env.local
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── tailwind.config.ts
```

### 2.2 Rutas y páginas

#### 2.2.1 Root Layout — `app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'ÑAMI - Descubre restaurantes locales',
  description: 'Feed de comida local en Yumbo. Pide directo por WhatsApp.',
  openGraph: {
    type: 'website',
    title: 'ÑAMI - Descubre restaurantes locales',
    description: 'Feed de comida local en Yumbo.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-white dark:bg-slate-950">
        <Providers>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
```

#### 2.2.2 Feed — `app/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RestaurantCard } from '@/components/RestaurantCard';
import { FilterBar } from '@/components/FilterBar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { apiClient } from '@/lib/api';

export default function FeedPage() {
  const [category, setCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurants', category, search],
    queryFn: () =>
      apiClient.get('/restaurants', {
        params: {
          category: category || undefined,
          search: search || undefined,
          limit: 20,
        },
      }),
  });

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">¿Qué hay de comer hoy?</h1>
        <p className="text-gray-600">Descubre restaurantes locales en Yumbo</p>
      </header>

      <FilterBar
        category={category}
        onCategoryChange={setCategory}
        search={search}
        onSearchChange={setSearch}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-500">Error al cargar restaurantes</p>
      ) : data?.data?.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No hay restaurantes disponibles
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((restaurant: any) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </main>
  );
}
```

#### 2.2.3 Restaurante + Menú — `app/[slug]/page.tsx`

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { RestaurantHeader } from '@/components/RestaurantHeader';
import { MenuGrid } from '@/components/MenuGrid';
import { CartDrawer } from '@/components/CartDrawer';
import { useCart } from '@/hooks/useCart';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function RestaurantPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const cart = useCart();

  const { data: restaurant, isLoading: restaurantLoading } = useQuery({
    queryKey: ['restaurant', slug],
    queryFn: () => apiClient.get(`/restaurants/${slug}`),
  });

  const { data: menu, isLoading: menuLoading } = useQuery({
    queryKey: ['menu', restaurant?.data?.id],
    queryFn: () =>
      apiClient.get(`/menu/restaurants/${restaurant?.data?.id}`),
    enabled: !!restaurant?.data?.id,
  });

  if (restaurantLoading) return <LoadingSpinner />;

  return (
    <main className="flex-1">
      <RestaurantHeader restaurant={restaurant?.data} />

      <div className="container mx-auto px-4 py-8">
        {menuLoading ? (
          <LoadingSpinner />
        ) : (
          <MenuGrid categories={menu?.data} />
        )}
      </div>

      <CartDrawer restaurant={restaurant?.data} />
    </main>
  );
}
```

### 2.3 Componentes clave

#### 2.3.1 RestaurantCard

```typescript
// components/RestaurantCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface RestaurantCardProps {
  restaurant: {
    id: string;
    slug: string;
    name: string;
    category: string;
    logoUrl?: string;
    plan: 'GRATIS' | 'PRO';
    isClosed: boolean;
  };
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/${restaurant.slug}`}>
      <div className="rounded-lg border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {restaurant.logoUrl && (
          <div className="relative w-full h-48">
            <Image
              src={restaurant.logoUrl}
              alt={restaurant.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">{restaurant.name}</h3>
            {restaurant.plan === 'PRO' && (
              <Badge className="bg-[#FF7A00]">Pro</Badge>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-2">{restaurant.category}</p>

          {restaurant.isClosed && (
            <Badge variant="destructive">Cerrado</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
```

#### 2.3.2 CartDrawer

```typescript
// components/CartDrawer.tsx
'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { WhatsAppButton } from './WhatsAppButton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CartDrawer({ restaurant }: { restaurant: any }) {
  const cart = useCart();
  const [paymentMethod, setPaymentMethod] = useState('nequi');
  const [deliveryMode, setDeliveryMode] = useState('delivery');
  const [open, setOpen] = useState(false);

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleWhatsApp = () => {
    const message = `Hola! Hice un pedido desde ÑAMI 🍽️\n\n📍 Restaurante: ${restaurant.name}\n🛒 Pedido:\n${cart.items
      .map((item) => `  - ${item.quantity}x ${item.name} $${item.price}`)
      .join('\n')}\n💳 Método de pago: ${paymentMethod}\n📦 Modalidad: ${
      deliveryMode === 'delivery' ? 'A domicilio' : 'Para recoger'
    }\n💰 Total: $${total}`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${restaurant.whatsapp}?text=${encoded}`;
    window.open(url, '_blank');
    setOpen(false);
    cart.clear();
  };

  return (
    <>
      {/* Carrito flotante (botón) */}
      {cart.items.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setOpen(true)}
            className="bg-[#FF7A00] text-white rounded-full px-6 py-3 shadow-lg hover:bg-[#EA580C] flex items-center gap-2"
          >
            🛒 {cart.items.length} items
          </button>
        </div>
      )}

      {/* Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:w-96">
          <SheetHeader>
            <SheetTitle>Mi carrito</SheetTitle>
          </SheetHeader>

          <div className="py-6 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    ${item.price} x {item.quantity}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => cart.decreaseQuantity(item.id)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <button
                    onClick={() => cart.increaseQuantity(item.id)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => cart.removeItem(item.id)}
                    className="px-2 py-1 bg-red-200 text-red-600 rounded"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            <div className="border-t pt-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Método de pago
                </label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nequi">Nequi</SelectItem>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Modalidad
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="delivery"
                      checked={deliveryMode === 'delivery'}
                      onChange={(e) => setDeliveryMode(e.target.value)}
                    />
                    A domicilio
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="recoger"
                      checked={deliveryMode === 'recoger'}
                      onChange={(e) => setDeliveryMode(e.target.value)}
                    />
                    Para recoger
                  </label>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded text-lg font-bold">
                Total: ${total}
              </div>

              <button
                onClick={handleWhatsApp}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 flex items-center justify-center gap-2"
              >
                💬 Enviar pedido por WhatsApp
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
```

#### 2.3.3 useCart Hook

```typescript
// hooks/useCart.ts
import { create } from 'zustand';

interface CartItem {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  restaurantId?: string;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  clear: () => void;
}

export const useCart = create<CartStore>((set) => ({
  items: [],
  restaurantId: undefined,

  addItem: (item) =>
    set((state) => {
      // Un solo restaurante por carrito
      if (state.restaurantId && state.restaurantId !== item.restaurantId) {
        // Limpiar carrito anterior
        return {
          items: [{ ...item, quantity: 1 }],
          restaurantId: item.restaurantId,
        };
      }

      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }

      return {
        items: [...state.items, { ...item, quantity: 1 }],
        restaurantId: item.restaurantId,
      };
    }),

  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    })),

  increaseQuantity: (itemId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
      ),
    })),

  decreaseQuantity: (itemId) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.id === itemId
            ? { ...i, quantity: Math.max(0, i.quantity - 1) }
            : i
        )
        .filter((i) => i.quantity > 0),
    })),

  clear: () => set({ items: [], restaurantId: undefined }),
}));
```

---

## 3. apps/dashboard — Admin Restaurante

### 3.1 Estructura

```
apps/dashboard/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                # Redirect a /dashboard
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Layout con sidebar
│   │   └── dashboard/
│   │       ├── page.tsx        # Overview
│   │       ├── perfil/page.tsx
│   │       ├── menu/page.tsx
│   │       └── qr/page.tsx
│   └── globals.css
├── components/
│   ├── Sidebar.tsx
│   ├── MenuEditor.tsx
│   ├── CategoryList.tsx
│   ├── ItemForm.tsx
│   ├── PlanBadge.tsx
│   ├── ImageUploader.tsx
│   └── ...
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── supabase.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useRestaurant.ts
│   └── useMenu.ts
└── ...
```

### 3.2 Autenticación

#### 3.2.1 useAuth Hook

```typescript
// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) router.push('/login');
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) router.push('/login');
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}
```

#### 3.2.2 Login Page

```typescript
// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <h1 className="text-3xl font-bold">Acceder a ÑAMI</h1>

        {error && <p className="text-red-500">{error}</p>}

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#FF7A00] text-white py-3 rounded-lg font-bold"
        >
          Acceder
        </button>
      </form>
    </div>
  );
}
```

### 3.3 Dashboard Pages

#### 3.3.1 Overview — `app/(dashboard)/dashboard/page.tsx`

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRestaurant } from '@/hooks/useRestaurant';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PlanBadge } from '@/components/PlanBadge';

export default function DashboardPage() {
  const { session, loading: authLoading } = useAuth();
  const { data: restaurant, isLoading } = useRestaurant();

  if (authLoading || isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Mi restaurante</h1>
        <p className="text-gray-600">
          Aquí puedes administrar tu presencia en ÑAMI
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Plan actual</h2>
          <PlanBadge plan={restaurant?.plan} />
          <p className="text-gray-600 mt-4">
            {restaurant?.plan === 'GRATIS'
              ? 'Puedes agregar hasta 10 items en tu menú'
              : 'Acceso ilimitado a todas las funciones'}
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tu link</h2>
          <code className="bg-gray-100 p-3 rounded block mb-4">
            nami.app/{restaurant?.slug}
          </code>
          <button
            onClick={() =>
              navigator.clipboard.writeText(`nami.app/${restaurant?.slug}`)
            }
            className="text-blue-500 hover:underline"
          >
            Copiar
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### 3.3.2 Menu Editor — `app/(dashboard)/dashboard/menu/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRestaurant } from '@/hooks/useRestaurant';
import { MenuEditor } from '@/components/MenuEditor';
import { ItemForm } from '@/components/ItemForm';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function MenuPage() {
  const { data: restaurant, isLoading } = useRestaurant();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Mi menú</h1>
        <p className="text-gray-600">Organiza tus productos por categorías</p>
      </header>

      <MenuEditor restaurant={restaurant} />
    </div>
  );
}
```

---

## 4. Global Styles & Design System

### 4.1 globals.css

```css
@import "tailwindcss";

/* ÑAMI Design Tokens */
@layer base {
  :root {
    --color-primary: #FF7A00;
    --color-primary-dark: #EA580C;
    --color-accent: #B088C9;
    --color-detail: #D2E600;
    --color-gray-950: #0F172A;
  }

  body {
    @apply bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50;
  }

  h1, h2, h3, h4 {
    @apply font-semibold;
  }

  button {
    @apply transition-colors duration-200;
  }
}

/* Utilities */
@layer utilities {
  .truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

---

## 5. API Client

**`lib/api.ts`**:
```typescript
import { ApiResult } from '@/types';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: string,
    path: string,
    options?: FetchOptions
  ): Promise<ApiResult<T>> {
    const url = new URL(`${this.baseUrl}${path}`);

    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la solicitud');
    }

    return response.json();
  }

  async get<T>(path: string, options?: FetchOptions): Promise<ApiResult<T>> {
    return this.request('GET', path, options);
  }

  async post<T>(
    path: string,
    body?: any,
    options?: FetchOptions
  ): Promise<ApiResult<T>> {
    return this.request('POST', path, { ...options, body });
  }

  async put<T>(
    path: string,
    body?: any,
    options?: FetchOptions
  ): Promise<ApiResult<T>> {
    return this.request('PUT', path, { ...options, body });
  }

  async delete<T>(path: string, options?: FetchOptions): Promise<ApiResult<T>> {
    return this.request('DELETE', path, options);
  }
}

export const apiClient = new ApiClient();
```

---

## 6. shadcn/ui Components Necesarios

Instalar estos componentes con:
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add form
```

---

## 7. Performance & SEO

- **Image Optimization:** Usar `next/image` siempre (automatic responsive + lazy loading)
- **Code Splitting:** Lazy load componentes pesados con `next/dynamic`
- **Metadata:** Definir en `layout.tsx` y actualizar dinámicamente por página
- **Caching:** React Query con `staleTime` y `cacheTime`

---

## 8. Variables de entorno

**apps/web/.env.local**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

**apps/dashboard/.env.local**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

