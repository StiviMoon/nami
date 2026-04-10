# 🔧 nami Backend — Guía Completa Implementación

**Versión:** 3.0 Senior Profesional
**Fecha:** 26 marzo 2026
**Objetivo:** Backend ultra-rápido, escalable, tipo Stripe/Linear

---

## 📋 ÍNDICE

1. [Setup Inicial](#setup-inicial)
2. [Configuración Base](#configuración-base)
3. [Arquitectura Clean](#arquitectura-clean)
4. [Middleware & Auth](#middleware--auth)
5. [Rutas API Completas](#rutas-api-completas)
6. [Servicios Clave](#servicios-clave)
7. [Base de Datos Prisma](#base-de-datos-prisma)
8. [Integración Redis](#integración-redis)
9. [Deploy & DevOps](#deploy--devops)
10. [Monitoreo](#monitoreo)

---

## 🚀 SETUP INICIAL

### 1. Crear directorio y setup base

```bash
mkdir apps/api && cd apps/api

# Inicializar proyecto
npm init -y
npm pkg set "type=module"
npm pkg set "scripts.dev=nodemon --exec node --loader tsx src/index.ts"
npm pkg set "scripts.build=tsc"
npm pkg set "scripts.start=node dist/index.js"
npm pkg set "scripts.db:migrate=prisma migrate dev"
npm pkg set "scripts.db:push=prisma db push"

# Core dependencies
npm install \
  express@5.0.1 \
  cors@2.8.5 \
  helmet@7.1.0 \
  dotenv@16.4.5 \
  @prisma/client@5.18.0 \
  @supabase/supabase-js@2.45.0 \
  zod@3.23.8 \
  jsonwebtoken@9.1.2 \
  bcrypt@5.1.1 \
  pino@8.20.0 \
  pino-http@8.6.1 \
  redis@4.6.14 \
  ioredis@5.3.6 \
  bull@4.13.1 \
  socket.io@4.7.2 \
  express-rate-limit@7.3.0 \
  stripe@15.10.0 \
  axios@1.7.7 \
  sharp@0.33.4 \
  multer@1.4.5-lts.1 \
  nodemailer@6.9.13 \
  @sendgrid/mail@8.1.3 \
  twilio@4.20.3

# Dev dependencies
npm install -D \
  typescript@5.8.0 \
  ts-node@10.10.0 \
  tsx@4.11.0 \
  nodemon@3.1.2 \
  @types/express@4.17.21 \
  @types/node@20.15.0 \
  @types/bcrypt@5.0.2 \
  @types/cors@2.8.17 \
  @types/multer@1.4.11 \
  @types/nodemailer@6.4.15 \
  prisma@5.18.0 \
  eslint@9.3.0 \
  prettier@3.3.0
```

### 2. Estructura inicial

```bash
mkdir -p src/{config,middleware,routes,controllers,services,models,utils,jobs,types}
touch src/index.ts src/server.ts .env.local .env.example

# Prisma
npx prisma init
```

---

## ⚙️ CONFIGURACIÓN BASE

### 1. Variables de Entorno (.env.local)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nami_dev"

# Supabase
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="xxx"
SUPABASE_SERVICE_ROLE_KEY="xxx"
SUPABASE_JWT_SECRET="xxx"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-chars-recommended"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Environment
NODE_ENV="development"
PORT=3000
API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3001"

# Stripe
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# Redis
REDIS_URL="redis://localhost:6379"

# Email (SendGrid)
SENDGRID_API_KEY="SG.xxx"
SENDGRID_FROM_EMAIL="no-reply@nami.app"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="AC_xxx"
TWILIO_AUTH_TOKEN="xxx"
TWILIO_PHONE_NUMBER="+1234567890"

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/webp"

# CORS
ALLOWED_ORIGINS="http://localhost:3001,http://localhost:3002,https://nami.app"

# Logging
LOG_LEVEL="info"
```

### 2. Config Files

```typescript
// src/config/env.ts

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_JWT_SECRET: z.string(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRATION: z.string().default('15m'),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  SENDGRID_API_KEY: z.string(),
  SENDGRID_FROM_EMAIL: z.string().email(),
  ALLOWED_ORIGINS: z.string(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
})

export const config = envSchema.parse(process.env)
```

```typescript
// src/config/database.ts

import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = global as unknown as { prisma: PrismaClientSingleton }

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

```typescript
// src/config/redis.ts

import { Redis } from 'ioredis'
import { config } from './env'

export const redis = new Redis(config.REDIS_URL, {
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
})

redis.on('error', (err) => {
  console.error('Redis error:', err)
})

redis.on('connect', () => {
  console.log('✅ Redis connected')
})
```

---

## 🏗️ ARQUITECTURA CLEAN

### 1. Estructura de Middleware

```typescript
// src/middleware/errorHandler.middleware.ts

import { Request, Response, NextFunction } from 'express'
import { logger } from '@/utils/logger'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = err as AppError

  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal Server Error'

  logger.error({
    statusCode,
    message,
    path: req.path,
    method: req.method,
  })

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  })
}
```

```typescript
// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '@/config/env'
import { AppError } from './errorHandler.middleware'

export interface AuthRequest extends Request {
  userId?: string
  role?: 'CUSTOMER' | 'RESTAURANT_OWNER' | 'ADMIN'
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      throw new AppError(401, 'Missing authorization token')
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as {
      sub: string
      role: string
    }

    req.userId = decoded.sub
    req.role = decoded.role as any

    next()
  } catch (error) {
    next(new AppError(401, 'Invalid or expired token'))
  }
}

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.role || !roles.includes(req.role)) {
      throw new AppError(403, 'Insufficient permissions')
    }
    next()
  }
}
```

```typescript
// src/middleware/validation.middleware.ts

import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { AppError } from './errorHandler.middleware'

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      })
      req.body = validated.body
      next()
    } catch (error: any) {
      const message = error.errors?.[0]?.message || 'Validation failed'
      next(new AppError(400, message))
    }
  }
}
```

### 2. Response Helper

```typescript
// src/utils/response.ts

export type ApiResult<T = any> =
  | { success: true; data: T; meta?: Record<string, any> }
  | { success: false; error: string; code?: string }

export class ApiResponse {
  static success<T>(data: T, meta?: Record<string, any>): ApiResult<T> {
    return {
      success: true,
      data,
      ...(meta && { meta }),
    }
  }

  static error(message: string, code?: string): ApiResult {
    return {
      success: false,
      error: message,
      ...(code && { code }),
    }
  }
}

// Usage en express:
export const sendResponse = (res: any, result: ApiResult, statusCode = 200) => {
  res.status(statusCode).json(result)
}
```

### 3. Logger Setup (Pino)

```typescript
// src/utils/logger.ts

import pino from 'pino'
import { config } from '@/config/env'

export const logger = pino({
  level: config.LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: false,
      ignore: 'pid,hostname',
    },
  },
})
```

---

## 🔐 AUTENTICACIÓN

```typescript
// src/services/auth.service.ts

import { prisma } from '@/config/database'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { config } from '@/config/env'
import { AppError } from '@/middleware/errorHandler.middleware'

export class AuthService {
  static async register(email: string, password: string, name: string) {
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw new AppError(409, 'User already exists')
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: { email, password: passwordHash, name, role: 'CUSTOMER' },
      select: { id: true, email: true, name: true, role: true },
    })

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.role)

    return { user, ...tokens }
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new AppError(401, 'Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials')
    }

    const tokens = this.generateTokens(user.id, user.role)

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      ...tokens,
    }
  }

  static generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign(
      { sub: userId, role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRATION }
    )

    const refreshToken = jwt.sign(
      { sub: userId, role },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return { accessToken, refreshToken }
  }

  static refreshAccessToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.JWT_SECRET) as {
        sub: string
        role: string
      }

      const newAccessToken = jwt.sign(
        { sub: decoded.sub, role: decoded.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRATION }
      )

      return { accessToken: newAccessToken }
    } catch {
      throw new AppError(401, 'Invalid refresh token')
    }
  }
}
```

---

## 🛣️ RUTAS API COMPLETAS

### Auth Routes

```typescript
// src/routes/auth.routes.ts

import { Router } from 'express'
import { z } from 'zod'
import { AuthService } from '@/services/auth.service'
import { validate } from '@/middleware/validation.middleware'
import { authMiddleware } from '@/middleware/auth.middleware'
import { ApiResponse, sendResponse } from '@/utils/response'
import { AppError } from '@/middleware/errorHandler.middleware'

const router = Router()

// Schemas
const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2),
  }),
})

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
})

// Register
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const result = await AuthService.register(
      req.body.email,
      req.body.password,
      req.body.name
    )
    sendResponse(res, ApiResponse.success(result), 201)
  } catch (error) {
    next(error)
  }
})

// Login
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const result = await AuthService.login(
      req.body.email,
      req.body.password
    )
    sendResponse(res, ApiResponse.success(result), 200)
  } catch (error) {
    next(error)
  }
})

// Refresh token
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      throw new AppError(400, 'Refresh token required')
    }
    
    const result = AuthService.refreshAccessToken(refreshToken)
    sendResponse(res, ApiResponse.success(result), 200)
  } catch (error) {
    next(error)
  }
})

// Me
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })
    sendResponse(res, ApiResponse.success(user), 200)
  } catch (error) {
    next(error)
  }
})

export default router
```

### Restaurants Routes

```typescript
// src/routes/restaurants.routes.ts

import { Router } from 'express'
import { z } from 'zod'
import { RestaurantController } from '@/controllers/restaurants.controller'
import { authMiddleware } from '@/middleware/auth.middleware'
import { validate } from '@/middleware/validation.middleware'

const router = Router()

const createSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    phone: z.string().regex(/^\+57\d{9}$/),
    whatsapp: z.string().regex(/^\+57\d{9}$/),
    address: z.string().min(5),
    city: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    category: z.enum(['FAST_FOOD', 'HAMBURGUESAS', 'PIZZA', ...]),
  }),
})

// Public routes
router.get('/', RestaurantController.getAll)
router.get('/slug/:slug', RestaurantController.getBySlug)
router.get('/search', RestaurantController.search)

// Protected routes
router.post(
  '/',
  authMiddleware,
  validate(createSchema),
  RestaurantController.create
)

router.patch(
  '/:id',
  authMiddleware,
  RestaurantController.update
)

router.get(
  '/:id/analytics',
  authMiddleware,
  RestaurantController.getAnalytics
)

export default router
```

### Orders Routes

```typescript
// src/routes/orders.routes.ts

import { Router } from 'express'
import { z } from 'zod'
import { OrderController } from '@/controllers/orders.controller'
import { authMiddleware } from '@/middleware/auth.middleware'

const router = Router()

const createSchema = z.object({
  body: z.object({
    restaurantId: z.string(),
    items: z.array(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1),
      })
    ),
    deliveryType: z.enum(['PICKUP', 'DELIVERY']),
    paymentMethod: z.enum(['CASH', 'CARD', 'NEQUI', 'TRANSFER']),
    notes: z.string().optional(),
  }),
})

// Create order
router.post(
  '/',
  validate(createSchema),
  OrderController.create
)

// Get orders (customer or restaurant)
router.get('/', authMiddleware, OrderController.getMyOrders)

// Get order details
router.get('/:id', authMiddleware, OrderController.getById)

// Update order status
router.patch('/:id/status', authMiddleware, OrderController.updateStatus)

// Confirm order (restaurant only)
router.patch('/:id/confirm', authMiddleware, OrderController.confirm)

export default router
```

---

## 🎯 SERVICIOS CLAVE

### Order Service

```typescript
// src/services/order.service.ts

import { prisma } from '@/config/database'
import { redis } from '@/config/redis'
import { AppError } from '@/middleware/errorHandler.middleware'
import { io } from '@/index'

export class OrderService {
  static async createOrder(data: {
    restaurantId: string
    items: { productId: string; quantity: number }[]
    customerEmail?: string
    customerPhone?: string
    deliveryType: 'PICKUP' | 'DELIVERY'
    paymentMethod: 'CASH' | 'CARD' | 'NEQUI' | 'TRANSFER'
    notes?: string
  }) {
    // Get restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: data.restaurantId },
    })
    if (!restaurant) {
      throw new AppError(404, 'Restaurant not found')
    }

    // Get products and validate
    const products = await prisma.product.findMany({
      where: {
        id: { in: data.items.map(i => i.productId) },
      },
    })

    if (products.length !== data.items.length) {
      throw new AppError(400, 'Some products not found')
    }

    // Calculate total
    const total = data.items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId)
      return sum + (product?.price.toNumber() || 0) * item.quantity
    }, 0)

    // Create order
    const order = await prisma.order.create({
      data: {
        restaurantId: data.restaurantId,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        deliveryType: data.deliveryType,
        paymentMethod: data.paymentMethod,
        customerNotes: data.notes,
        subtotal: total,
        tax: total * 0.08, // 8% tax
        total: total * 1.08,
        status: 'NEW',
        paymentStatus: 'PENDING',
        items: {
          createMany: {
            data: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtTime: products
                .find(p => p.id === item.productId)
                ?.price || 0,
            })),
          },
        },
      },
      include: { items: true, restaurant: true },
    })

    // Cache en Redis por 24 horas
    await redis.setex(
      `order:${order.id}`,
      86400,
      JSON.stringify(order)
    )

    // Emit socket event (real-time notification)
    io.to(`restaurant_${restaurant.id}`).emit('new_order', {
      orderId: order.id,
      restaurantId: restaurant.id,
      total: order.total,
      itemCount: data.items.length,
    })

    return order
  }

  static async confirmOrder(orderId: string, restaurantId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { restaurant: true },
    })

    if (!order) {
      throw new AppError(404, 'Order not found')
    }

    if (order.restaurantId !== restaurantId) {
      throw new AppError(403, 'Unauthorized')
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED', updatedAt: new Date() },
    })

    // Actualizar cache
    await redis.setex(
      `order:${orderId}`,
      86400,
      JSON.stringify(updated)
    )

    // Emit notification
    io.to(`order_${orderId}`).emit('order_confirmed', {
      orderId,
      restaurantId,
    })

    return updated
  }
}
```

---

## 📊 BUSQUEDA CON ALGOLIA

```typescript
// src/services/search.service.ts

import algoliasearch from 'algoliasearch'
import { config } from '@/config/env'
import { redis } from '@/config/redis'

const algolia = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.ALGOLIA_ADMIN_API_KEY || ''
)
const index = algolia.initIndex('restaurants')

export class SearchService {
  static async indexRestaurant(restaurant: any) {
    await index.saveObject({
      objectID: restaurant.id,
      name: restaurant.name,
      description: restaurant.description,
      city: restaurant.city,
      category: restaurant.category,
      rating: restaurant.rating,
      imageUrl: restaurant.imageUrl,
      lat: restaurant.latitude,
      lng: restaurant.longitude,
      _geoloc: {
        lat: restaurant.latitude,
        lng: restaurant.longitude,
      },
    })
  }

  static async search(query: string, city: string, limit = 20) {
    // Check cache first
    const cacheKey = `search:${query}:${city}`
    const cached = await redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    // Search Algolia
    const results = await index.search(query, {
      filters: `city:"${city}"`,
      hitsPerPage: limit,
    })

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(results))

    return results
  }

  static async getByCity(city: string) {
    const cacheKey = `restaurants:${city}`
    const cached = await redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    const results = await index.search('', {
      filters: `city:"${city}"`,
      hitsPerPage: 100,
    })

    await redis.setex(cacheKey, 600, JSON.stringify(results))
    return results
  }
}
```

---

## 🔌 INTEGRACIÓN STRIPE

```typescript
// src/services/payment.service.ts

import Stripe from 'stripe'
import { config } from '@/config/env'
import { prisma } from '@/config/database'

const stripe = new Stripe(config.STRIPE_SECRET_KEY)

export class PaymentService {
  static async createPaymentIntent(orderId: string, amount: number) {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: 'cop',
      metadata: { orderId },
      description: `Order ${orderId}`,
    })

    // Save in DB
    await prisma.payment.create({
      data: {
        orderId,
        amount: amount,
        stripePaymentIntentId: intent.id,
        status: 'PENDING',
      },
    })

    return intent
  }

  static async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata.orderId

        await prisma.payment.update({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { status: 'COMPLETED' },
        })

        await prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'COMPLETED' },
        })
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        await prisma.payment.update({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { status: 'FAILED' },
        })
        break
      }
    }
  }
}
```

---

## 📋 EXPRESS SERVER SETUP

```typescript
// src/server.ts

import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { pinoHttp } from 'pino-http'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { config } from '@/config/env'
import { logger } from '@/utils/logger'
import { errorHandler } from '@/middleware/errorHandler.middleware'
import { rateLimitMiddleware } from '@/middleware/rateLimit.middleware'

import authRoutes from '@/routes/auth.routes'
import restaurantRoutes from '@/routes/restaurants.routes'
import productsRoutes from '@/routes/products.routes'
import ordersRoutes from '@/routes/orders.routes'
import searchRoutes from '@/routes/search.routes'
import paymentsRoutes from '@/routes/payments.routes'

export function createExpressApp() {
  const app = express()

  // Security middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }))

  // CORS
  app.use(cors({
    origin: config.ALLOWED_ORIGINS.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }))

  // Logging
  app.use(pinoHttp({ logger }))

  // Body parsing
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ limit: '10mb', extended: true }))

  // Rate limiting
  app.use('/api/', rateLimitMiddleware)

  // Health check
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date() })
  })

  // Routes
  app.use('/api/v1/auth', authRoutes)
  app.use('/api/v1/restaurants', restaurantRoutes)
  app.use('/api/v1/products', productsRoutes)
  app.use('/api/v1/orders', ordersRoutes)
  app.use('/api/v1/search', searchRoutes)
  app.use('/api/v1/payments', paymentsRoutes)

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, error: 'Route not found' })
  })

  // Error handler (must be last)
  app.use(errorHandler)

  return app
}

export function setupWebSocket(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: config.ALLOWED_ORIGINS.split(','),
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  })

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`)

    // Subscribe to restaurant updates
    socket.on('subscribe_restaurant', (restaurantId: string) => {
      socket.join(`restaurant_${restaurantId}`)
    })

    // Subscribe to order updates
    socket.on('subscribe_order', (orderId: string) => {
      socket.join(`order_${orderId}`)
    })

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`)
    })
  })

  return io
}
```

```typescript
// src/index.ts

import 'dotenv/config'
import { createServer } from 'http'
import { createExpressApp, setupWebSocket } from './server'
import { config } from '@/config/env'
import { prisma } from '@/config/database'
import { redis } from '@/config/redis'
import { logger } from '@/utils/logger'

const app = createExpressApp()
const httpServer = createServer(app)
export const io = setupWebSocket(httpServer)

const PORT = config.PORT || 3000

async function startServer() {
  try {
    // Test DB connection
    await prisma.$connect()
    logger.info('✅ Database connected')

    // Test Redis connection
    await redis.ping()
    logger.info('✅ Redis connected')

    // Start server
    httpServer.listen(PORT, () => {
      logger.info(`✅ Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...')
  await prisma.$disconnect()
  redis.disconnect()
  process.exit(0)
})

startServer()
```

---

## 📦 PRISMA MIGRATION

```bash
# Crear nueva migración
npx prisma migrate dev --name init

# Ver estado
npx prisma migrate status

# Push schema sin migración
npx prisma db push

# Reset (cuidado!)
npx prisma migrate reset
```

---

## 🐳 DOCKER SETUP (Opcional pero recomendado)

```dockerfile
# Dockerfile

FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY src ./src
COPY prisma ./prisma
COPY tsconfig.json .

# Build
RUN npm run build

# Run
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml

version: '3.9'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: nami_dev
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  api:
    build: ./apps/api
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://postgres:postgres@postgres:5432/nami_dev"
      REDIS_URL: "redis://redis:6379"
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
```

---

## 🚀 DEPLOYMENT

### Render.com

```yaml
# render.yaml

services:
  - type: web
    name: nami-api
    env: node
    plan: standard
    buildCommand: npm install && npm run build && npx prisma migrate deploy
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        scope: build_and_runtime
      - key: REDIS_URL
        scope: build_and_runtime
      - key: JWT_SECRET
        scope: runtime
        isPrivate: true
```

---

**Documento completado:** 26 marzo 2026
**Versión:** 3.0 Senior
**Status:** Listo para implementación

