# ÑAMI — Configuration Files Templates

**Copia y pega estos archivos en cada app según corresponda.**

---

## Root Config Files

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noImplicitAny": true,
    "noFallthroughCasesInSwitch": true,

    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### `.eslintrc.json`

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "warn",
    "no-var": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ]
  },
  "overrides": [
    {
      "files": ["apps/web/**/*", "apps/dashboard/**/*"],
      "extends": ["next/core-web-vitals"],
      "rules": {
        "@next/next/no-img-element": "warn"
      }
    }
  ]
}
```

### `.prettierrc.json`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "printWidth": 100
}
```

### `.prettierignore`

```
node_modules
dist
build
.next
coverage
*.min.js
```

### `.gitignore`

```
# Dependencies
node_modules/
pnpm-lock.yaml
yarn.lock
package-lock.json

# Build
dist/
build/
.turbo/

# Next.js
.next/
out/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Misc
.cache/
coverage/
```

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/json-schema.json",
  "globalDependencies": ["tsconfig.json", ".eslintrc.json"],
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"],
      "cache": true
    },
    "type-check": {
      "cache": false
    },
    "lint": {
      "cache": false
    },
    "clean": {
      "cache": false
    }
  }
}
```

---

## Backend (apps/api)

### `tsconfig.json` (en apps/api)

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "ES2020",
    "target": "ES2020",
    "lib": ["ES2020"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### `.env.local.example` (copiar a .env.local)

```env
# Supabase
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/nami

# Server
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3002,http://localhost:3000

# Storage
SUPABASE_STORAGE_BUCKET=nami-uploads
```

### `.prismaignore`

```
node_modules
dist
```

---

## Frontend (apps/web & apps/dashboard)

### `tsconfig.json` (en apps/web)

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "incremental": true,
    "module": "ESNext",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### `next.config.ts` (apps/web)

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
      ],
    },
  ],

  redirects: async () => [
    {
      source: '/feed',
      destination: '/',
      permanent: true,
    },
  ],

  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/:path*`,
    },
  ],
};

export default nextConfig;
```

### `next.config.ts` (apps/dashboard)

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
      ],
    },
  ],

  redirects: async () => [
    {
      source: '/',
      destination: '/dashboard',
      permanent: false,
    },
  ],

  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/:path*`,
    },
  ],
};

export default nextConfig;
```

### `.env.local.example` (copiar a .env.local)

#### apps/web/.env.local.example

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Supabase (public keys)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### apps/dashboard/.env.local.example

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Supabase (public keys)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### `postcss.config.mjs` (apps/web & apps/dashboard)

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

### `tailwind.config.ts` (apps/web & apps/dashboard)

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8f0',
          100: '#ffe8d6',
          500: '#FF7A00',
          600: '#EA580C',
          900: '#8B3E00',
        },
        accent: {
          500: '#B088C9',
        },
        detail: {
          500: '#D2E600',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
```

### `globals.css` (apps/web & apps/dashboard)

```css
@import "tailwindcss";

@layer base {
  :root {
    --color-primary: #FF7A00;
    --color-primary-dark: #EA580C;
    --color-accent: #B088C9;
    --color-detail: #D2E600;
  }

  html {
    @apply scroll-smooth;
  }

  body {
    @apply bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-semibold;
  }

  button {
    @apply transition-colors duration-200;
  }

  input, textarea, select {
    @apply transition-colors duration-200;
  }
}

@layer utilities {
  .truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .glass {
    @apply bg-white/80 backdrop-blur-md dark:bg-slate-950/80;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-500 text-white hover:bg-primary-600 transition-colors duration-200 px-4 py-2 rounded-lg font-semibold;
  }

  .btn-secondary {
    @apply bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 px-4 py-2 rounded-lg font-semibold;
  }

  .card {
    @apply rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm;
  }

  .input {
    @apply rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500;
  }
}
```

---

## Environment Variables (seguridad)

### Crear archivos `.example`

**apps/api/.env.local.example:**
```env
# NUNCA incluir valores reales, solo estructura
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=3000
NODE_ENV=development
```

**Instrucciones en README.md:**
```markdown
## Setup local

1. Copiar `.env.local.example` a `.env.local`
2. Llenar valores reales desde Supabase dashboard
3. Nunca commitear `.env.local`
```

---

## CI/CD Config (GitHub Actions - opcional para Fase 3)

### `.github/workflows/test.yml`

```yaml
name: Test

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm run type-check
      - run: pnpm run lint
      - run: pnpm run build
```

---

## Checklist de setup

- [ ] Node.js 20.x instalado (verificar con `node -v`)
- [ ] pnpm 8.x instalado (verificar con `pnpm -v`)
- [ ] Clonar repo y `pnpm install`
- [ ] Copiar `.env.local.example` a `.env.local` en cada app
- [ ] Llenar valores de Supabase en `.env.local`
- [ ] `npx prisma migrate dev` en apps/api
- [ ] `npx shadcn-ui@latest init` en apps/web y apps/dashboard
- [ ] `pnpm run dev` para verificar que todo corra sin errores
- [ ] Verificar en:
  - http://localhost:3000 (API health check)
  - http://localhost:3001 (Web)
  - http://localhost:3002 (Dashboard)

