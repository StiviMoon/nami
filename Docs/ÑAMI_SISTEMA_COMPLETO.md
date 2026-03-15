# 🍔 ÑAMI — Sistema Completo

**Documento integral del proyecto, visión, tecnología y plan de ejecución**

---

## 📌 ÍNDICE

1. [Qué es ÑAMI](#qué-es-ñami)
2. [El Problema](#el-problema)
3. [La Solución](#la-solución)
4. [Modelo de Negocio](#modelo-de-negocio)
5. [Arquitectura de Producto](#arquitectura-de-producto)
6. [Stack Tecnológico](#stack-tecnológico)
7. [Fases de Desarrollo](#fases-de-desarrollo)
8. [Timeline Estimado](#timeline-estimado)
9. [Componentes del Sistema](#componentes-del-sistema)
10. [Métricas de Éxito](#métricas-de-éxito)
11. [Roadmap Futuro](#roadmap-futuro)

---

## 🎯 QUÉ ES ÑAMI

### Definición Simple
**ÑAMI** es una plataforma local de descubrimiento de restaurantes que conecta a clientes con negocios de comida rápida, eliminando intermediarios costosos como Rappi y descentralizando el poder de decisión en los restaurantes.

### Visión
Convertirse en la **plataforma de referencia en LatAm** para pequeños y medianos restaurantes, permitiéndoles crecer sin comisiones altas, sin dependencia de marketplaces grandes, y con acceso a datos reales de sus clientes.

### Misión
Resolver el problema de **invisibilidad de comercios locales** en ciudades pequeñas, donde plataformas como Rappi no llegan y Google Maps está desactualizado.

### En Una Frase
*"Directorio local + descubrimiento + WhatsApp directo = Restaurantes independientes que crecen sin intermediarios"*

---

## 🔴 EL PROBLEMA

### Problema para CLIENTES (Personas que buscan comer)

**Situación actual:**
- Google Maps: Información vieja (horarios cerrados, números no funcionan)
- Rappi: No llega a ciudades pequeñas (Yumbo, Palmira, etc.)
- Instagram/TikTok: Desorganizado, inconsistente
- Boca a boca: Limitado a amigos/familia

**Resultado:**
- ❌ Solo comen en lugares que conocen
- ❌ Pierden oportunidad de probar cosas nuevas
- ❌ Restaurantes pequeños quedan invisibles
- ❌ Experiencia de descubrimiento pobre

**Validación:** Encuesta a 60+ personas en Yumbo/Cali:
- 92% dice "Hace falta información actualizada"
- 70% come 1-3 veces/semana fuera
- 70% busca en 4+ canales diferentes (fragmentación)

---

### Problema para RESTAURANTES (Dueños/Operadores)

**Situación actual:**
- Clientes = Recomendación boca a boca (lento, limitado)
- Instagram: Requiere mantener, fotos, engagement (tiempo)
- Google Maps: Información se desactualiza rápido
- Rappi/Glovo: 20-30% comisión + pierden datos del cliente
- Sin datos: No saben quién compra, qué prefieren, cuándo

**Resultado:**
- ❌ Crecimiento limitado y caro
- ❌ No entienden su mercado
- ❌ Pierden dinero con comisiones altas
- ❌ Comida de calidad pero invisible

**Validación:** Conversaciones con restaurantes:
- "Rappi me cobra mucho, pero ¿dónde más?"
- "No sé quién me ordena, cuándo piden, qué prefieren"
- "Mi comida es buena pero no me encuentran"
- "Google Maps está desactualizado desde hace meses"

---

### Por qué no se resuelve actualmente

| Competidor | Qué hace bien | Por qué falla en ciudades pequeñas |
|------------|---|---|
| **Rappi** | Logística completa | Requiere volumen alto (no rentable chico) |
| **Google Maps** | Directorio global | Info desactualizada, no especializado |
| **Instagram** | Red social, alcance | Requiere tiempo/expertise, no es discovery |
| **Spoon.com.co** | Directorio similar | Gratis (no monetiza), sin diferencial claro |

**GAP identificado:** Necesita una plataforma que sea:
- Específica a ciudades pequeñas
- Actualizada en tiempo real
- Sin comisión alta
- Directa (WhatsApp)
- Con datos para restaurantes

---

## 💡 LA SOLUCIÓN

### ÑAMI: Plataforma Local + WhatsApp

**Para CLIENTES:**
```
1. Busca "hamburguesas en Yumbo"
2. Ve lista de restaurantes en ÑAMI
3. Ve: Nombre, ubicación, horario, fotos, reseñas
4. Clic en botón WhatsApp
5. Ordena directo (sin intermediario)
6. Restaurante responde por WhatsApp
7. Retira o se lo despachan
```

**Características:**
- ✅ Discovery centralizado (no 4+ apps)
- ✅ Información actualizada en tiempo real
- ✅ Fotos reales (no catálogo fake)
- ✅ Contacto directo (WhatsApp)
- ✅ Sin comisión (cliente paga directo al restaurante)
- ✅ Sin demora (no hay repartidor esperando)

---

### ÑAMI: Para RESTAURANTES

```
1. Se registra en ÑAMI (10 minutos)
2. Carga: Nombre, ubicación, horarios, foto, menú, precios
3. Aparece automáticamente en búsquedas locales
4. Clientes lo encuentran → Click WhatsApp
5. Pedidos llegan a su WhatsApp
6. Despacha (él decide logística)
7. Obtiene dashboard con:
   - Quién le ordena
   - Qué pide (patrones)
   - Cuándo pide
   - Tendencias
```

**Características:**
- ✅ Setup ultra simple (no código)
- ✅ Cero comisión (Plan Gratis/Plus)
- ✅ Información siempre actualizada
- ✅ Datos reales del cliente
- ✅ Crecimiento sin dependencia Rappi
- ✅ Control total del negocio

---

### Diferenciadores Clave

| Aspecto | Rappi | Google | Spoon | ÑAMI |
|--------|-------|--------|-------|------|
| **Comisión** | 20-30% | N/A | Gratis | 0% (o 2-3% opcional) |
| **Funciona en ciudades pequeñas** | ❌ | ✅ pero vieja | ✅ | ✅ ESPECIALIZADO |
| **Datos del cliente** | Rappi tiene | N/A | N/A | ✅ RESTAURANTE tiene |
| **WhatsApp directo** | ❌ (app) | ❌ | ❌ | ✅ |
| **Logística** | Rappi maneja | N/A | N/A | ✅ RESTAURANTE maneja |
| **Independencia** | 0 (dependencia total) | N/A | Posible | ✅ TOTAL |

---

## 💰 MODELO DE NEGOCIO

### Revenue Streams

#### **1. Suscripciones de Restaurantes**

```
Plan GRATIS
├── Precio: $0/mes
├── Listado básico (nombre, foto, ubicación)
├── Menú hasta 20 items
├── Recibir pedidos por WhatsApp
├── Objetivo: Tracción, volumen
└── Conversión meta: 5% → Premium

Plan PLUS (Recomendado)
├── Precio: $19.900 COP/mes
├── Todo de Gratis +
├── Dashboard con analytics
├── Menú ilimitado
├── Fotos ilimitadas
├── Destacar en búsqueda
├── Soporte por chat
├── Objetivo: Restaurantes que quieren crecer
└── Meta: 15% de usuarios convertidos

Plan PRO (Para grandes)
├── Precio: $60.000 COP/mes
├── Todo de Plus +
├── Integración de pagos
├── API para POS externo
├── Reportes avanzados
├── Comisión opcional (2-3% en pagos)
├── Soporte prioritario
└── Target: Multi-tienda, cadenas locales
```

#### **2. Comisión en Pagos** (Futuro)
- Plan Pro integra pagos con Stripe
- ÑAMI cobra 2-3% por transacción
- Restaurante retiene 97-98%
- Optional (restaurante elige)

#### **3. Publicidad** (Futuro)
- Sponsored listings en búsqueda
- Featured position
- Promotional banners
- Restaurantes pagan para destacar

#### **4. Datos / Analytics Premium** (Futuro)
- Reports avanzados (heatmaps, patrones, predicción)
- Benchmarking vs competidores
- Recomendaciones de precios

---

### Proyección Financiera (Conservadora)

#### **Escenario Yumbo (6 meses)**
```
Restaurantes en plataforma: 50
Adopción Plus:              10 (20%)
Adopción Pro:                2 (4%)
Adopción Gratis:            38 (76%)

MRR (Monthly Recurring Revenue):
├── 10 × $19.900  = $199.000
├── 2 × $60.000   = $120.000
└── Total         = $319.000/mes

Yearly: $3.828.000 COP
Suficiente para: 1-2 desarrolladores
```

#### **Escenario Colombia (18 meses)**
```
Ciudades: Cali, Medellín, Bogotá, otras
Restaurantes: 500
Plus adoption: 75 (15%)
Pro adoption:  25 (5%)
Gratis:       400 (80%)

MRR:
├── 75 × $19.900  = $1.492.500
├── 25 × $60.000  = $1.500.000
├── Ads revenue   = $500.000
└── Total         = $3.492.500/mes

Yearly: $41.910.000 COP (~$10k USD)
Viable: Equipo de 3-4 personas
```

---

## 🏗️ ARQUITECTURA DE PRODUCTO

### Componentes Principales del Sistema

```
┌─────────────────────────────────────────────────────┐
│                    ÑAMI ECOSYSTEM                    │
└─────────────────────────────────────────────────────┘

                  ┌──────────────┐
                  │   USUARIOS   │
                  │ (Clientes)   │
                  └──────┬───────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        v                v                v
    Mobile App       Web App          WhatsApp
   (React Native)   (Next.js)          Direct
    (Futuro)         (Hecho)           (Ya)

                         │
        ┌────────────────┼────────────────┐
        │                v                │
        │          API Backend            │
        │        (Express + Node)         │
        │                                 │
        └────────────────┼────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        v                                 v
    Database                        External
  (PostgreSQL)                      Services
  (Supabase)
                                   ├── Formspree
    Tables:                         │   (Forms)
    ├── users                       │
    ├── stores                      ├── Stripe
    ├── products                    │   (Payments)
    ├── orders                      │
    ├── order_items                 ├── WhatsApp API
    ├── order_messages              │   (Mensajes)
    ├── analytics                   │
    └── subscriptions               └── Google Sheets
                                        (Registros)

┌──────────────────────┐
│    DASHBOARD         │
│  (Para restaurantes) │
│                      │
│ - Analytics          │
│ - Menú management    │
│ - Órdenes           │
│ - Clientes          │
└──────────────────────┘

┌──────────────────────┐
│   ADMIN PANEL        │
│  (Steven/Equipo)     │
│                      │
│ - Moderation         │
│ - Metrics            │
│ - Users management   │
└──────────────────────┘
```

---

### Flujo de Usuario Completo

```
CLIENTE:
1. Busca "hamburguesas Yumbo"
2. Ñami landing muestra resultados
3. Ve restaurantes (fotos, horarios, precios)
4. Click en restaurante
5. Ve menú completo
6. Click "Pedir por WhatsApp"
7. Abre WhatsApp con número restaurante
8. Ordena en texto: "2 hamburguesas clásicas + 1 gaseosa"
9. Restaurante responde con precio/confirmación
10. Cliente paga (efectivo, Nequi, bancolombia)
11. Retira o domicilio (restaurante decide)

RESTAURANTE:
1. Se registra en ÑAMI.app
2. Setup perfil (10 min): nombre, ubicación, horarios, foto
3. Carga menú: categorías + items + precios
4. Publica
5. Automáticamente aparece en búsquedas locales
6. Usuario ordena vía WhatsApp
7. Ñami le muestra "nueva orden" en dashboard
8. Confirma en WhatsApp
9. Despacha (él controla logística)
10. Obtiene datos: quién pidió, qué pidió, cuándo, patrón
11. Ver analytics en dashboard

ÑAMI (Backend):
1. Recibe búsqueda de usuario
2. Consulta DB (restaurantes activos en Yumbo)
3. Ranking por relevancia/popularidad
4. Retorna lista
5. Usuario click → Formspree registra lead
6. Analytics de clicks/conversión
7. Dashboard mostrará: clientes nuevos, qué se vende, trends
```

---

## 💻 STACK TECNOLÓGICO

### Arquitectura

```
┌─────────────────────────────────────────────────────┐
│              FRONTEND (Cliente)                      │
├─────────────────────────────────────────────────────┤
│ Technology:  Next.js 15 + React 19 + TypeScript    │
│ Styling:     Tailwind CSS v4 + Dark Mode            │
│ Animations:  Framer Motion                          │
│ Forms:       React Hook Form + Zod                  │
│ Deployment:  Vercel (CDN global)                    │
│                                                     │
│ Performance: <2s load, Lighthouse >90              │
│ Mobile:      PWA-ready, offline-capable (future)   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              BACKEND (API)                          │
├─────────────────────────────────────────────────────┤
│ Technology:  Node.js + Express (JavaScript/TS)     │
│ Database:    PostgreSQL (Supabase)                  │
│ ORM:         Prisma 7.4                            │
│ Auth:        Supabase Auth + JWT                   │
│ API Style:   RESTful (JSON)                         │
│ Deployment:  Render.com o Fly.io                   │
│                                                     │
│ Response:    < 200ms, 99.9% uptime SLA            │
│ Scaling:     Horizontal (serverless-ready)         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL)                  │
├─────────────────────────────────────────────────────┤
│ Hosting:     Supabase (Managed Postgres)           │
│ Region:      Latam (Supabase Frankfurt)            │
│ Backups:     Automáticas diarias                   │
│ Replication: Multi-region (futuro)                 │
│                                                     │
│ Schema:                                            │
│ ├── users (clientes)                               │
│ ├── stores (restaurantes)                          │
│ ├── products (items del menú)                      │
│ ├── orders (órdenes)                               │
│ ├── order_items (detalle orden)                    │
│ ├── subscriptions (planes)                         │
│ ├── analytics (eventos)                            │
│ └── messages (chat/WhatsApp)                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              INTEGRACIONES EXTERNAS                 │
├─────────────────────────────────────────────────────┤
│ ✅ Formspree    → Contacto / Lead capture          │
│ ✅ Google Sheets → Analytics / Registros            │
│ ⏳ Stripe       → Pagos (Plan Pro)                 │
│ ⏳ WhatsApp API → Mensajes (fase 2)                │
│ ⏳ Mapbox       → Mapas / Ubicación                │
│ ⏳ Twilio       → SMS notifications                │
│ ⏳ Segment      → Customer Data                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              HERRAMIENTAS & SERVICES                │
├─────────────────────────────────────────────────────┤
│ Hosting:     Vercel (Frontend) + Render (Backend)  │
│ Monitoring:  Sentry (errors), LogRocket (sessions)│
│ Analytics:   Google Analytics 4 + Vercel Analytics│
│ Email:       SendGrid / Resend (notifications)    │
│ Storage:     Supabase Storage (images)             │
│ CDN:         Vercel CDN (global)                   │
│ DNS:         Namecheap / Route53                   │
│ SSL:         Let's Encrypt (Vercel auto)           │
└─────────────────────────────────────────────────────┘
```

### Tech Decisions Rationale

| Decision | Por qué | Alternativa rechazada |
|----------|--------|----------------------|
| **Next.js** | Full-stack, SSR, deploy fácil | Astro (sin backend), SvelteKit |
| **TypeScript** | Type safety, errores en build | JavaScript puro (riesgo) |
| **Tailwind** | Rápido, utility-first, dark mode | Bootstrap (genérico), Styled Components |
| **Supabase** | PostgreSQL managed, auth, storage | Firebase (caro), Heroku (deprecado) |
| **Vercel** | Optimizado para Next.js, CDN global | AWS (complejo), Netlify (limitado) |
| **Formspree** | Simple, Google Sheets integration | Custom backend (overhead), Typeform |

---

## 📅 FASES DE DESARROLLO

### Fase 0: Investigación & Validación ✅ HECHO
```
Duración: 1-2 semanas
Entregar:
├── Encuesta de 60+ usuarios validando problema
├── Conversaciones con 10+ restaurantes
├── Competitive analysis (Rappi, Spoon, Google)
├── PMF (Product-Market Fit) inicial
└── Especificaciones de landing + producto

Resultado: Decisión de GO/NO-GO
```

### Fase 1: Landing MVP (¡AHORA!)
```
Duración: 1-2 semanas
Entregar:
├── Landing page moderna (Next.js + Tailwind)
├── Formulario de registro (Formspree → Google Sheets)
├── Primeros 50+ registros de restaurantes
├── Setup de analytics
└── Deploy en Vercel (dominio ñami.app)

Responsable: Steven
Resultado: Validación de demanda, 50+ leads
```

### Fase 2: MVP del Producto (Self-Checkout Core)
```
Duración: 6-8 semanas
Entregar:
├── Frontend para usuarios (web + PWA)
│   ├── Búsqueda por ubicación
│   ├── Listado de restaurantes
│   ├── Detalle restaurante + menú
│   ├── "Pedir por WhatsApp"
│   └── Reseñas/ratings
│
├── Dashboard para restaurantes
│   ├── Profile management
│   ├── Menú CRUD
│   ├── Órdenes recibidas
│   ├── Analytics básico
│   └── Horarios
│
├── Backend API
│   ├── Auth (login/signup)
│   ├── CRUD restaurantes
│   ├── Búsqueda + filtering
│   ├── Órdenes tracking
│   └── Webhooks Stripe
│
└── Integraciones
    ├── Stripe Payments (opcional)
    ├── WhatsApp API
    └── Mapbox (ubicación)

Responsable: Steven + 1 dev
Resultado: Producto en manos de 50-100 usuarios piloto
```

### Fase 3: Piloto en Yumbo
```
Duración: 4 semanas
Entregar:
├── 50-100 restaurantes activos en plataforma
├── 1000+ búsquedas/día de usuarios
├── 5-10% conversion rate (búsqueda → orden)
├── Feedback loop establecido
├── Primeros pagos recibidos (opcional)
└── Case studies de restaurantes exitosos

Responsable: Steven (sales/support) + dev team
Resultado: Validación de traction, ajustes basados en uso real
```

### Fase 4: Expansión Cali + Colombia
```
Duración: 8-12 semanas
Entregar:
├── Expansión a Cali, Palmira, otras ciudades
├── 500+ restaurantes en plataforma
├── 10k+ usuarios activos
├── Métricas positivas:
│   ├── DAU > 2000
│   ├── Conversion > 8%
│   ├── Retention M1 > 40%
│   └── NPS > 50
├── Marketing escalado (ads, partnerships)
└── Equipo de 3-5 personas

Responsable: Steven (CEO) + equipo
Resultado: SaaS sustentable, pronto rentable
```

### Fase 5: Monetización Completa
```
Duración: 4-6 meses
Entregar:
├── Stripe Connect implementado
├── Comisiones en pagos activas (2-3%)
├── Publicidad/featured listings
├── Premium analytics
├── Retention optimization
└── International expansion readiness

Responsable: Equipo establecido
Resultado: MRR > $50k COP, rentabilidad operacional
```

---

## ⏰ TIMELINE ESTIMADO

### Mes 1-2: Landing + Fase 1
```
Semana 1-2:   Landing development ✅ HECHO
Semana 2-3:   Formspree setup + primeros registros
Semana 3-4:   Testing QA + deployment Vercel
Semana 4:     Promoción inicial (WhatsApp, Instagram)

Resultado: Landing viva, 50+ leads en Google Sheet
```

### Mes 3-4: MVP Product
```
Semana 1-2:   Backend setup (API, auth, DB schema)
Semana 2-3:   Frontend usuario (búsqueda, detalle)
Semana 3-4:   Dashboard restaurante
Semana 4:     Integración WhatsApp (básica)
Semana 5-6:   Testing, bugfixes, primera ronda piloto

Resultado: 50-100 usuarios piloto testando
```

### Mes 5-6: Piloto Yumbo
```
Semana 1-2:   Onboarding restaurantes (ventas)
Semana 2-4:   Soporte/iteración basada en feedback
Semana 4:     Análisis de metrics, ajustes

Resultado: 50+ restaurantes, 1000+ órdenes, learnings claros
```

### Mes 7-9: Expansión Cali
```
Semana 1-2:   Preparar expansión (marketing, partnerships)
Semana 2-4:   Onboarding Cali
Semana 4-8:   Crecimiento, soporte, optimización
Semana 8-12:  Análisis, ajustes, 2do mercado

Resultado: Cali + Yumbo escalando, 200+ restaurantes
```

### Mes 10-18: Escala Nacional + Monetización
```
Mes 10-12:    Nuevas ciudades (Medellín, Bogotá)
Mes 13-15:    Stripe Connect, comisiones live
Mes 16-18:    Publicidad, analytics premium, expansión

Resultado: SaaS en múltiples ciudades, MRR > $200k
```

---

## 🔧 COMPONENTES DEL SISTEMA

### Lado Cliente (Usuarios Buscando Comida)

```
Landing Page (ñami.app)
├── Hero: "Descubre restaurantes reales en tu pueblo"
├── Features: Discovery, WhatsApp directo, Sin comisión
├── FAQ: Preguntas frecuentes
├── CTA: "Registra tu restaurante" (Formspree)
└── Deploy: Vercel (Global CDN)

Web App (Futuro)
├── Búsqueda por ciudad/categoría
├── Listado de restaurantes
│   ├── Foto
│   ├── Horarios
│   ├── Reseñas
│   ├── Menú completo
│   └── Botón "Pedir por WhatsApp"
├── Perfil de usuario
└── Historial de órdenes

Mobile App (Futuro)
├── PWA (Progressive Web App) primero
├── React Native (iOS/Android) después
├── Notificaciones push
├── Offline capability
└── QR scanner (futuro)
```

### Lado Restaurante (Dashboard)

```
Panel de Control
├── Perfil del Restaurante
│   ├── Foto de portada
│   ├── Horarios de atención
│   ├── Ubicación (mapa)
│   ├── Datos de contacto
│   └── Descripción

├── Gestión de Menú
│   ├── Categorías (Hamburguesas, Bebidas, etc.)
│   ├── Items del menú
│   │   ├── Nombre
│   │   ├── Descripción
│   │   ├── Precio
│   │   ├── Fotos
│   │   └── Destacar/Ocultar
│   └── Importar desde imagen/PDF

├── Órdenes
│   ├── Nueva orden (aparece en real-time)
│   ├── Confirmar/Rechazar
│   ├── Chat con cliente (WhatsApp)
│   ├── Estado (Nueva, Confirmada, Entregada)
│   └── Historial completo

├── Analytics
│   ├── Clientes totales
│   ├── Órdenes por día/semana
│   ├── Item más popular
│   ├── Revenue por período
│   ├── Horarios pico
│   └── Gráficos (pie, bar, line)

├── Configuración
│   ├── Plan actual (Gratis, Plus, Pro)
│   ├── Pagos/Facturación
│   ├── Integración Stripe (si Pro)
│   ├── Notificaciones
│   └── Privacidad

└── Soporte
    ├── Chat con equipo ÑAMI
    ├── FAQ
    ├── Documentación
    └── Community (restaurantes)
```

### Backend (API Endpoints)

```
Authentication
├── POST /auth/register        ← Nuevo usuario/restaurante
├── POST /auth/login           ← Login
├── POST /auth/logout          ← Logout
└── POST /auth/refresh-token   ← JWT refresh

Restaurantes (Stores)
├── GET    /stores                    ← Listar (búsqueda)
├── GET    /stores/:id                ← Detalle
├── POST   /stores                    ← Crear (restaurante nuevo)
├── PATCH  /stores/:id                ← Actualizar datos
├── DELETE /stores/:id                ← Deshabilitar
└── GET    /stores/:id/analytics      ← Analytics del restaurante

Productos (Menu Items)
├── GET    /stores/:id/products       ← Listar menú
├── POST   /stores/:id/products       ← Crear item
├── PATCH  /products/:id              ← Actualizar precio/descripción
├── DELETE /products/:id              ← Eliminar
└── POST   /products/:id/upload-image ← Subir foto

Órdenes (Orders)
├── GET    /orders                    ← Listar (usuario/restaurante)
├── POST   /orders                    ← Crear nueva orden
├── PATCH  /orders/:id                ← Actualizar estado
├── DELETE /orders/:id                ← Cancelar
├── POST   /orders/:id/confirm        ← Restaurante confirma
└── GET    /orders/:id/status         ← Estado en tiempo real

Búsqueda (Search)
├── GET /search?q=hamburgesas&city=yumbo  ← Búsqueda
├── GET /search?category=comida_rapida    ← Por categoría
└── GET /trending                         ← Trending ahora

Stripe Webhooks
├── POST /webhooks/stripe/checkout.session.completed
└── POST /webhooks/stripe/payment_intent.succeeded

Analytics (Admin)
├── GET /admin/analytics/daily-users
├── GET /admin/analytics/conversions
├── GET /admin/analytics/arpu
└── GET /admin/stores/:id/health
```

### Base de Datos (Schema)

```
users
├── id (UUID)
├── email
├── password_hash
├── name
├── phone
├── role (customer, restaurant_owner, admin)
├── created_at
└── updated_at

stores (Restaurantes)
├── id (UUID)
├── owner_id (FK → users)
├── name
├── description
├── photo_url
├── address
├── lat/lng (coordenadas)
├── phone
├── whatsapp
├── website
├── opening_hours (JSON)
├── rating (avg)
├── reviews_count
├── plan (free, plus, pro)
├── subscription_status (active, inactive)
├── is_verified
├── created_at
└── updated_at

products (Menu Items)
├── id (UUID)
├── store_id (FK → stores)
├── category
├── name
├── description
├── price
├── photo_url
├── is_available
├── preparation_time
├── created_at
└── updated_at

orders
├── id (UUID)
├── customer_id (FK → users)
├── store_id (FK → stores)
├── status (new, confirmed, completed, cancelled)
├── total_amount
├── delivery_type (pickup, delivery)
├── notes
├── created_at
└── updated_at

order_items
├── id (UUID)
├── order_id (FK → orders)
├── product_id (FK → products)
├── quantity
├── price_at_time
└── notes

subscriptions
├── id (UUID)
├── store_id (FK → stores)
├── plan (free, plus, pro)
├── status (active, cancelled)
├── current_period_start
├── current_period_end
├── stripe_subscription_id
└── auto_renew

analytics_events
├── id (UUID)
├── event_type (search, click, order_created, etc)
├── store_id (FK → stores, opcional)
├── user_id (FK → users, opcional)
├── properties (JSON)
├── created_at
└── timestamp

messages (Chat WhatsApp)
├── id (UUID)
├── order_id (FK → orders)
├── sender_id (FK → users)
├── content
├── direction (inbound, outbound)
├── created_at
└── metadata (JSON)

reviews
├── id (UUID)
├── store_id (FK → stores)
├── customer_id (FK → users)
├── rating (1-5)
├── comment
├── created_at
└── updated_at
```

---

## 📊 MÉTRICAS DE ÉXITO

### Fase 1 (Landing) - Próximas 2 semanas
```
✅ Landing creada y desplegada
✅ > 50 registros de restaurantes
✅ Lighthouse score > 90
✅ Formspree configurado
✅ Google Sheet con leads

Métrica: Conversion landing → registro > 2%
```

### Fase 2 (MVP) - Mes 3-4
```
✅ MVP funcional en manos de usuarios piloto
✅ 50+ restaurantes activos
✅ 100+ órdenes completadas
✅ Feedback positivo (NPS > 40)

Métricas clave:
├── DAU (Daily Active Users): > 200
├── Orders/día: > 10
├── Conversion (búsqueda → orden): > 5%
├── Restaurant onboarding time: < 15 min
└── Setup completion rate: > 80%
```

### Fase 3 (Piloto) - Mes 5-6
```
✅ Yumbo saturado (50+ restaurantes)
✅ Crecimiento orgánico visible
✅ Restaurantes generando ingresos
✅ Primeras renovaciones de planes

Métricas clave:
├── DAU: > 500
├── MAU: > 2000
├── Orders/mes: > 500
├── Avg order value: > $20k COP
├── Churn restaurantes: < 10%
├── NPS usuarios: > 50
└── NPS restaurantes: > 60
```

### Fase 4 (Escala) - Mes 7-12
```
✅ Expandido a 3+ ciudades
✅ 200+ restaurantes
✅ MRR > $50k
✅ Rentabilidad operacional cercana

Métricas clave:
├── DAU: > 2000
├── MAU: > 10000
├── Restaurantes activos: > 200
├── ARPU (restaurante): > $15k COP
├── LTV/CAC: > 3
└── Burn rate: < 0
```

### Métricas Permanentes

```
Lado Usuarios:
├── Growth rate: > 10% m/m
├── Churn rate: < 5%
├── Repeat order rate: > 60%
├── Conversion (buscar → ordenar): > 7%
├── Avg session time: > 3 min
└── App load time: < 2s

Lado Restaurantes:
├── Signup completion: > 85%
├── Plan upgrade rate: > 15%
├── Order fulfillment rate: > 95%
├── Response time (a orden): < 5 min
├── Review/rating > 4.0/5
└── Retention (30d): > 70%

Comercial:
├── CAC (restaurante): < $200
├── LTV (restaurante): > $5000
├── MRR: > $50k (meta 12mo)
├── Runway: > 18 meses
└── Burn rate: Decreciente
```

---

## 🚀 ROADMAP FUTURO (Años 2-5)

### Año 1: Dominar LatAm Pequeño
```
Q1-Q2: Expandir Colombia (5+ ciudades)
Q3: Expandir a Ecuador, Perú, Bolivia
Q4: Analizar LatAm grande (Brasil, México)

Goal: 10+ ciudades, 1000+ restaurantes, $500k MRR
```

### Año 2: Monetización Completa
```
Q1-Q2: Stripe Connect → Comisiones live
Q3: Publicidad/featured listings
Q4: Analytics premium, marketplace

Goal: $2M MRR, equipo de 15+
```

### Año 3: Verticals Expansion
```
Actuales: Comida rápida
Nuevos:
├── Cafés/Pastelerías
├── Restaurantes fine-dining
├── Pizzerías
├── Comida para llevar
└── Delivery (propio, opcional)

Goal: #1 en descubrimiento de F&B en LatAm
```

### Año 4-5: Marketplace Integrado
```
├── Pagos integrados (no solo WhatsApp)
├── Delivery propio de ÑAMI
├── Loyalty program
├── Suscripciones a restaurantes
└── Super app: comida + cines + eventos

Goal: Estar en Top 100 LatAm startups
```

---

## 👥 EQUIPO & RESPONSABILIDADES

### Fase 1-2: Solo Steven
```
Steven (Founder/CEO/CTO)
├── Arquitectura del sistema
├── Frontend/Backend development
├── Product management
├── Sales/partnerships
├── Operations
└── Financial management
```

### Fase 3-4: Steven + 2 devs
```
Steven (CEO/Founder)
├── Product vision
├── Fundraising (si aplica)
├── Partnerships/Growth hacking
├── Strategic decisions
└── 1-2 dev tech lead

Dev 1 (Backend Lead)
├── API development
├── Database optimization
├── DevOps/Infrastructure
├── Integrations (Stripe, WhatsApp)
└── Performance

Dev 2 (Frontend Lead)
├── Web app development
├── Mobile app (React Native)
├── UI/UX implementation
├── Analytics/Dashboards
└── PWA optimization

Operations/Support
├── Customer support (restaurantes)
├── Onboarding
├── Metrics tracking
└── Community management
```

### Fase 5+: Equipo de 5-10
```
Add specialized roles:
├── Product manager
├── Designer (UI/UX)
├── Data analyst
├── Marketing
├── Sales lead
└── People operations
```

---

## 🎯 VISION 2030

### Estado Actual (Marzo 2026)
- Landing creada
- MVP en desarrollo
- Validación inicial completada
- Steven como founder solo

### Estado Futuro (2030)
```
✅ 50+ ciudades en LatAm
✅ 10,000+ restaurantes activos
✅ 5M+ usuarios mensuales
✅ $50M+ ARR
✅ Equipo de 100+
✅ Potencial de IPO / Acquisición
✅ #1 en descubrimiento F&B LatAm
```

### Impacto Social
```
✅ 10,000+ restaurantes pequeños ganando
   más ingresos (menos comisión)

✅ Millones de usuarios encontrando
   comida local de calidad

✅ Ecosistema de negocios
   descentralizado y accesible

✅ Reducción de dependencia en
   plataformas gigantes (Rappi, etc)
```

---

## 📝 SUMMARY & NEXT STEPS

### Lo que es ÑAMI
```
🍔 ÑAMI = Plataforma local de descubrimiento de restaurantes
└── Clientes encuentran comida local
└── Restaurantes crecen sin comisión alta
└── Ambos usan WhatsApp directo (sin intermediarios)
```

### El Problema
```
❌ Clientes: Google Maps viejo, Rappi no llega, Instagram desorganizado
❌ Restaurantes: Invisibles, dependencia Rappi, sin datos, crecimiento limitado
```

### La Solución
```
✅ ÑAMI: Directorio especializado + WhatsApp + Sin comisión
✅ Para clientes: Discovery centralizado, actualizado, directo
✅ Para restaurantes: Visibilidad, datos, crecimiento independiente
```

### Modelo de Negocio
```
💰 Suscripciones de restaurantes (Free, Plus $19.9k, Pro $60k)
💰 Comisión en pagos (2-3%, plan Pro)
💰 Publicidad/Featured listings (futuro)
💰 Premium analytics (futuro)

Proyección: $3.5M MRR en Colombia (año 2), escalable a LatAm
```

### Timeline
```
⏰ Semana 1-2:   Landing + Lead capture (AHORA)
⏰ Mes 2-3:      MVP product development
⏰ Mes 3-4:      Piloto Yumbo (50+ restaurantes)
⏰ Mes 5-9:      Expansión Colombia
⏰ Año 2+:       Escala LatAm + Monetización completa
```

### Próximos Pasos Inmediatos
```
1. ✅ Landing creada (HECHO)
2. ⏳ Configurar Formspree + Google Sheet
3. ⏳ Deploy en Vercel
4. ⏳ Promover en WhatsApp + Instagram
5. ⏳ Recopilar 50+ registros de restaurantes
6. ⏳ Iniciar MVP backend/frontend
```

---

## 📞 Contacto/Preguntas

**Founder:** Steven
**Email:** steven@ñami.app (futuro)
**WhatsApp:** [Número Yumbo]
**Website:** ñami.app

---

**Documento creado:** 14 de marzo 2026
**Versión:** 1.0 - Snapshot completo del sistema
**Estado:** En ejecución

*ÑAMI: Descubre restaurantes reales en tu pueblo*

---

**FIN DEL DOCUMENTO**

Este documento sirve como:
- ✅ Pitch deck para potenciales inversores
- ✅ Onboarding para nuevo equipo
- ✅ Referencia del proyecto completo
- ✅ Validación de visión y dirección
- ✅ Documento estratégico del negocio
