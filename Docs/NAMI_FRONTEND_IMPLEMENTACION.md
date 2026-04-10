# 🎨 ÑAMI Frontend — Guía Completa de Implementación

**Versión:** 3.0 Profesional
**Fecha:** 26 marzo 2026
**Objetivo:** Frontend de clase mundial, superar Rappi/Uber Eats en UX

---

## 📋 ÍNDICE

1. [Setup Inicial](#setup-inicial)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Componentes Clave](#componentes-clave)
4. [Landing Page Mejorada](#landing-page-mejorada)
5. [App Principal](#app-principal)
6. [Performance Optimization](#performance-optimization)
7. [PWA Setup](#pwa-setup)
8. [Testing & QA](#testing--qa)

---

## 🚀 SETUP INICIAL

### 1. Crear proyecto Next.js 16

```bash
# Opción A: Usar create-next-app
npx create-next-app@latest web --typescript --tailwind --eslint

# Seleccionar:
# ✓ TypeScript
# ✓ Tailwind CSS v4
# ✓ ESLint
# ✗ App Router (sí, seleccionar app router)
# ✗ Turbopack

# Opción B: Manual (más control)
mkdir apps/web && cd apps/web
npm init -y
npm install next@16.1.3 react@19.0.0 react-dom@19.0.0
```

### 2. Instalar dependencias críticas

```bash
npm install \
  tailwindcss@4.0.0 \
  @tailwindcss/postcss@4.0.0 \
  framer-motion@11.3.28 \
  zustand@4.5.2 \
  @tanstack/react-query@5.51.0 \
  axios@1.7.7 \
  zod@3.23.8 \
  react-hook-form@7.52.1 \
  @hookform/resolvers@3.3.4 \
  @radix-ui/react-dialog@1.1.2 \
  @radix-ui/react-select@2.1.1 \
  lucide-react@0.576.0 \
  clsx@2.1.1 \
  tailwind-merge@2.4.0 \
  @supabase/supabase-js@2.45.0 \
  qrcode.react@1.0.1 \
  algoliasearch@4.20.0 \
  react-instantsearch@7.10.0 \
  mapbox-gl@3.3.0 \
  socket.io-client@4.7.2 \
  @stripe/react-stripe-js@3.0.0 \
  @stripe/stripe-js@4.0.0 \
  recharts@2.12.7 \
  date-fns@3.6.0
```

### 3. Configurar TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "allowSyntheticDefaultImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"],
      "@stores/*": ["./src/stores/*"],
      "@types/*": ["./src/types/*"],
      "@lib/*": ["./src/lib/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### 4. Configurar Tailwind v4

```css
/* src/app/globals.css */

@import "tailwindcss";

@layer base {
  :root {
    /* Colors */
    --color-primary: 249 115 22; /* orange-500 */
    --color-primary-dark: 234 88 12; /* orange-600 */
    --color-secondary: 167 139 250; /* purple-400 */
    --color-accent: 16 185 129; /* emerald-500 */
    --color-error: 239 68 68; /* red-500 */
    --color-warning: 245 158 11; /* amber-500 */
    
    /* Neutral grays (RGB values for CSS variables) */
    --color-slate-50: 250 250 250;
    --color-slate-900: 15 23 42;
    --color-slate-950: 2 6 23;
    
    /* Animations */
    --animation-duration: 300ms;
    --animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
  }

  [data-theme="dark"] {
    --color-bg: var(--color-slate-950);
    --color-bg-secondary: var(--color-slate-900);
  }

  [data-theme="light"] {
    --color-bg: white;
    --color-bg-secondary: var(--color-slate-50);
  }

  /* Base typography */
  html {
    @apply scroll-smooth;
    font-feature-settings: "rlig" 1 "calt" 1;
  }

  body {
    @apply bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100;
    transition: background-color var(--animation-duration) var(--animation-easing);
  }

  /* Smooth selections */
  ::selection {
    @apply bg-orange-500 text-white;
  }
}

@layer components {
  /* Button base styles */
  .btn-base {
    @apply inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-primary {
    @apply btn-base bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg;
  }

  .btn-secondary {
    @apply btn-base bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600;
  }

  .btn-ghost {
    @apply btn-base text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800;
  }

  /* Card styles */
  .card {
    @apply rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300;
  }

  /* Input styles */
  .input-base {
    @apply w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200;
  }

  /* Container */
  .container-xl {
    @apply mx-auto max-w-7xl px-4 md:px-6;
  }

  /* Smooth fade in */
  .fade-in {
    animation: fadeIn var(--animation-duration) var(--animation-easing) forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-slate-100 dark:bg-slate-900;
}

::-webkit-scrollbar-thumb {
  @apply bg-slate-300 dark:bg-slate-700 rounded hover:bg-slate-400 dark:hover:bg-slate-600;
}
```

### 5. Next.js Config

```javascript
// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_ALGOLIA_APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  },

  // Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/app',
        destination: '/search',
        permanent: false,
      },
    ]
  },

  // Middleware
  experimental: {
    optimizePackageImports: ['@radix-ui', 'lucide-react'],
  },
}

export default nextConfig
```

---

## 📁 ESTRUCTURA DE CARPETAS

```
apps/web/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   │
│   │   ├── (app)/
│   │   │   ├── search/
│   │   │   │   └── page.tsx
│   │   │   ├── restaurants/
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── account/page.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── restaurants/
│   │   │       └── [id]/
│   │   │           ├── menu/page.tsx
│   │   │           ├── orders/page.tsx
│   │   │           └── analytics/page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/route.ts
│   │   │   └── webhooks/
│   │   │       └── stripe/route.ts
│   │   │
│   │   ├── layout.tsx
│   │   ├── page.tsx (Landing)
│   │   ├── globals.css
│   │   └── favicon.ico
│   │
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── ThemeToggle.tsx
│   │   │
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── RestaurantCard.tsx
│   │   │   └── RestaurantGrid.tsx
│   │   │
│   │   ├── restaurant/
│   │   │   ├── Header.tsx
│   │   │   ├── MenuSection.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── ReviewSection.tsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CheckoutModal.tsx
│   │   │   └── CartItem.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── SidebarNav.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── MenuManager.tsx
│   │   │   └── OrdersList.tsx
│   │   │
│   │   └── ui/ (shadcn)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── dialog.tsx
│   │       └── ...
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useMediaQuery.ts
│   │   └── useDarkMode.ts
│   │
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── uiStore.ts
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── restaurants.service.ts
│   │   └── orders.service.ts
│   │
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.ts
│   │   └── restaurant.ts
│   │
│   └── public/
│       ├── icons/
│       ├── images/
│       └── manifest.json (PWA)
│
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── .env.local
```

---

## 🧩 COMPONENTES CLAVE

### 1. Zustand Stores (State Management)

```typescript
// src/stores/cartStore.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  notes?: string
  image?: string
}

export interface CartState {
  items: CartItem[]
  restaurantId: string | null
  deliveryType: 'PICKUP' | 'DELIVERY'
  paymentMethod: 'CASH' | 'CARD' | 'NEQUI' | 'TRANSFER'
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  setRestaurant: (restaurantId: string) => void
  setDeliveryType: (type: 'PICKUP' | 'DELIVERY') => void
  setPaymentMethod: (method: 'CASH' | 'CARD' | 'NEQUI' | 'TRANSFER') => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      deliveryType: 'PICKUP',
      paymentMethod: 'CASH',

      addItem: (item, quantity) => set((state) => {
        if (state.restaurantId && state.restaurantId !== item.productId.split('-')[0]) {
          // Different restaurant, ask to clear cart (handled in component)
          return state
        }
        
        const existingItem = state.items.find(i => i.productId === item.productId)
        if (existingItem) {
          return {
            items: state.items.map(i =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          }
        }
        
        return {
          items: [...state.items, { ...item, quantity }],
        }
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter(i => i.productId !== productId),
      })),

      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(i =>
          i.productId === productId ? { ...i, quantity } : i
        ),
      })),

      setRestaurant: (restaurantId) => set({ restaurantId }),
      setDeliveryType: (type) => set({ deliveryType: type }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),

      clearCart: () => set({
        items: [],
        restaurantId: null,
        deliveryType: 'PICKUP',
        paymentMethod: 'CASH',
      }),

      getTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
    }),
    {
      name: 'ñami-cart',
      version: 1,
    }
  )
)
```

### 2. Hooks Custom

```typescript
// src/hooks/useCart.ts

import { useCartStore } from '@/stores/cartStore'

export function useCart() {
  const store = useCartStore()

  return {
    items: store.items,
    restaurantId: store.restaurantId,
    deliveryType: store.deliveryType,
    paymentMethod: store.paymentMethod,
    total: store.getTotal(),
    itemCount: store.items.reduce((sum, item) => sum + item.quantity, 0),
    
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    setDeliveryType: store.setDeliveryType,
    setPaymentMethod: store.setPaymentMethod,
    clearCart: store.clearCart,
  }
}
```

### 3. Axios Service Instance

```typescript
// src/services/api.ts

import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### 4. React Query Setup

```typescript
// src/app/layout.tsx

'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 min
          gcTime: 1000 * 60 * 10, // 10 min (was cacheTime)
          retry: 1,
          refetchOnWindowFocus: false,
        },
        mutations: {
          retry: 1,
        },
      },
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
```

---

## 🎨 LANDING PAGE MEJORADA

Ver documento separado: `ÑAMI_LANDING_PREMIUM.md`

---

## 🔍 COMPONENTE SEARCH (ALGOLIA)

```typescript
// src/components/search/SearchBar.tsx

'use client'

import { useState } from 'react'
import { debounce } from 'lodash'
import { Search, MapPin, X } from 'lucide-react'
import { motion } from 'framer-motion'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const debouncedSearch = debounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      // Aquí iría Algolia o tu API de búsqueda
      const response = await fetch(
        `/api/v1/search?q=${encodeURIComponent(searchQuery)}`
      )
      const data = await response.json()
      setResults(data.data || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }, 300)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(true)
    debouncedSearch(value)
  }

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Busca restaurantes, comidas..."
          className="input-base pl-12 pr-4"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (query || results.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50"
        >
          {isLoading ? (
            <div className="p-4 text-center text-slate-500">
              Buscando...
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => {
                    // Handle navigation
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                >
                  <div className="font-medium text-slate-900 dark:text-white">
                    {result.name}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <MapPin className="w-4 h-4" />
                    {result.location}
                  </div>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="p-4 text-center text-slate-500">
              No encontramos resultados
            </div>
          ) : null}
        </motion.div>
      )}
    </div>
  )
}
```

---

## 📱 PWA SETUP

```json
// public/manifest.json

{
  "name": "ÑAMI - Descubre comida local",
  "short_name": "ÑAMI",
  "description": "Descubre restaurantes reales sin comisión alta. Ordena directo por WhatsApp.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#ffffff",
  "theme_color": "#f97316",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-maskable-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/desktop.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "categories": ["food", "shopping"],
  "shortcuts": [
    {
      "name": "Buscar comida",
      "url": "/search",
      "icons": [{ "src": "/icons/search.png", "sizes": "96x96" }]
    }
  ]
}
```

```typescript
// src/app/layout.tsx - PWA Setup

export const metadata: Metadata = {
  title: 'ÑAMI | Descubre restaurantes locales',
  description: 'Descubre la mejor comida sin aplicaciones pesadas. Ordena directo por WhatsApp.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ÑAMI',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    url: 'https://ñami.app',
    title: 'ÑAMI',
    description: 'Descubre restaurantes reales',
    images: [
      {
        url: 'https://ñami.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#f97316" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

---

## ✅ PERFORMANCE OPTIMIZATION

### 1. Image Optimization

```typescript
// Usa Next.js Image component siempre
import Image from 'next/image'

<Image
  src={imageUrl}
  alt="Restaurant"
  width={400}
  height={300}
  priority={false}
  loading="lazy"
  quality={85}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 2. Code Splitting

```typescript
// Use dyñamic imports para componentes pesados
import dyñamic from 'next/dyñamic'

const HeavyChart = dyñamic(
  () => import('@/components/dashboard/AnalyticsChart'),
  {
    loading: () => <div>Cargando...</div>,
    ssr: false,
  }
)

export function Dashboard() {
  return (
    <>
      <HeavyChart />
    </>
  )
}
```

### 3. React.memo para evitar re-renders

```typescript
const RestaurantCard = memo(function RestaurantCard({
  restaurant,
}: {
  restaurant: Restaurant
}) {
  return (
    // Component JSX
  )
})
```

---

## 🧪 TESTING & QA

```bash
# Instalar testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test

# Coverage
npm run test:coverage
```

---

**Documento completado:** 26 marzo 2026
**Versión:** 3.0 Profesional
**Status:** Listo para implementación

