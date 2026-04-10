# ÑAMI — Definición del Proyecto (Fase 2)

**Versión:** 2.0 Producto Real
**Fecha:** 26 marzo 2026
**Estado:** Especificación para desarrollo

---

## 1. Qué es ÑAMI

ÑAMI es una plataforma web que responde a una pregunta diaria simple: **"¿Qué hay de comer hoy en Yumbo?"**

Conecta dos audiencias:
- **Clientes con hambre:** Descubren restaurantes locales, ven el menú, construyen un pedido y lo envían por WhatsApp.
- **Restaurantes locales:** Publican su menú una sola vez, aparecen en el feed, y reciben pedidos directamente en WhatsApp — sin intermediarios, sin comisiones.

**Diferencial:** ÑAMI es un puente, no un controlador. El restaurante conserva el 100% de la relación con el cliente.

---

## 2. Dos tipos de usuario

### 2.1 Cliente (sin login)
- Accede a la plataforma sin necesidad de registrarse
- Ve un feed dinámico de restaurantes cerca (filtrado por categoría, búsqueda)
- Hace clic en un restaurante → ve su menú completo
- Agrega items al carrito
- Hace clic en "Pedir" → se abre WhatsApp con un mensaje pregenerado
- A partir de ahí, el cliente negocia con el restaurante

**Flujo:**
```
Abre ÑAMI → Feed de restaurantes
  → Filtra por "Hamburguesas" (ej.)
  → Toca "El Rincón Paisa"
  → Ve categorías (Platos, Bebidas, Postres)
  → Agrega "2x Bandeja Paisa", "1x Jugo"
  → Escoge: "A domicilio" o "Para recoger"
  → Escoge método de pago: "Nequi" / "Efectivo" / "Transferencia"
  → Toca "Enviar pedido"
  → WhatsApp abre con el mensaje listo
```

### 2.2 Restaurante (con login Supabase)
- Se registra en el dashboard con email + contraseña
- Configura su perfil: nombre, foto, descripción, dirección, horario, WhatsApp, categoría
- Organiza su menú en categorías (ej: "Platos principales", "Bebidas", "Postres")
- Agrega items (nombre, precio, foto, descripción, toggle activo/inactivo)
- Obtiene un link único: `ñami.app/el-rincon-paisa`
- Descarga un QR para imprimir en la puerta/mesa (según plan)
- Ver: métricas básicas o avanzadas (según plan)

**Flujo:**
```
Entra a dashboard → Login Supabase
  → Mi restaurante (editar info)
  → Menú (crear categorías e items)
  → Perfil público (ver cómo se ve)
  → Link/QR (copiar o descargar)
```

---

## 3. Flujo del Cliente — Paso a paso

### 3.1 Descubrimiento (Feed)
- Página inicial `/` muestra un grid/lista de restaurantes
- Filtros: categoría (dropdown), búsqueda por nombre (search input)
- Cada card muestra: foto, nombre, categoría, horario, estado (abierto/cerrado)
- Orden por defecto: restaurantes Plan Pro primero, luego Plan Gratis
- Lazy loading o paginación si hay muchos

### 3.2 Exploración (Restaurante + Menú)
- Ruta: `/[slug]` (ej: `/el-rincon-paisa`)
- Muestra: foto de portada, nombre, descripción, horario, dirección, números de reseñas (futuro)
- Debajo: menú organizado por categorías (ej: "Platos" → "Bebidas" → "Postres")
- Cada item: foto, nombre, precio, descripción, botón "+" para agregar
- Si no hay items o el restaurante está cerrado: mensaje claro

### 3.3 Carrito
- Carrito se abre en un drawer/modal al lado derecho
- Muestra: items seleccionados, cantidad, precio unitario, subtotal
- Permite: aumentar/disminuir cantidad, eliminar item
- Al final: "Método de pago" (dropdown: Nequi, Efectivo, Transferencia)
- Al final: "Modalidad" (radio: A domicilio o Para recoger)
- Botón grande: "Enviar pedido" → genera mensaje WhatsApp

### 3.4 Mensaje WhatsApp pregenerado
El mensaje que se abre en WhatsApp:
```
Hola! Hice un pedido desde ÑAMI 🍽️

📍 Restaurante: El Rincón Paisa
🛒 Pedido:
  - 2x Bandeja Paisa $18.000
  - 1x Jugo de Lulo $5.000
💳 Método de pago: Nequi
📦 Modalidad: A domicilio
💰 Total: $41.000
```

---

## 4. Flujo del Restaurante — Paso a paso

### 4.1 Registro
- Formulario simple: email, contraseña, nombre del restaurante, WhatsApp, dirección, categoría
- Valida que email sea único (en Supabase)
- Crea Usuario (email + supabaseId) + Restaurante (name, slug, whatsapp, etc.)
- Redirige al dashboard

### 4.2 Dashboard — Overview
- Página `/dashboard` muestra:
  - Plan actual (Gratis / Pro)
  - Resumen del restaurante
  - Stats según plan (Pro: visitantes hoy, platos populares, etc.)
  - Botones para editar perfil, editar menú, ver link/QR

### 4.3 Editar Perfil
- Ruta: `/dashboard/perfil`
- Campos editables: nombre, descripción, foto, dirección, horario (abierto/cerrado), categoría, WhatsApp
- Upload de foto: presigned URL a Supabase Storage
- Botón guardar → actualiza en BD

### 4.4 Editar Menú
- Ruta: `/dashboard/menu`
- Vista de árbol: Categorías → Items
- Funcionalidades:
  - Crear categoría (nombre, orden)
  - Reordenar categorías (drag-drop o flechas)
  - Editar/borrar categoría
  - Crear item (nombre, descripción, precio, foto)
  - Editar item (incluye toggle activo/inactivo)
  - Borrar item
  - Upload de foto del item: presigned URL a Supabase Storage
- Validaciones según plan:
  - Gratis: máximo 10 items
  - Pro: ilimitado

### 4.5 Link y QR
- Ruta: `/dashboard/qr`
- Muestra: URL del restaurante (`ñami.app/el-rincon-paisa`)
- Botón copiar al portapapeles
- QR generado (qrcode.js)
- Botón descargar QR (solo Plan Pro)
- Instrucciones: "Imprime y pega en la puerta o la mesa"

---

## 5. Planes y Activación

### 5.1 Estructura

| Característica | Gratis | Pro |
|---|---|---|
| **Precio** | $0 | $29.900/mes |
| **Máx items en menú** | 10 | Ilimitado |
| **Perfil en feed** | Básico | Destacado (aparece primero) |
| **Link propio** | `ñami.app/slug` | `ñami.app/slug` |
| **QR descargable** | ❌ | ✅ |
| **Métricas** | Ninguna | Visitantes, platos populares |
| **Prioridad en búsqueda** | Normal | Alta |

### 5.2 Activación
- **Manual por admin:** Por ahora NO hay Stripe ni PayU integrados.
- Proceso: Admin entra a panel (`/admin/restaurants`), elige restaurante, cambia plan → se guarda en BD
- En futuro (Fase 3): Stripe/PayU para automatizar

---

## 6. Scope — Qué NO se incluye (ahora)

Explícitamente fuera de Fase 2:
- ❌ Pagos dentro de la plataforma (Stripe/PayU/Nequi)
- ❌ Seguimiento del pedido en tiempo real
- ❌ Módulo de repartidores/delivery
- ❌ Notificaciones push al cliente
- ❌ Reseñas y calificaciones
- ❌ Analytics avanzados
- ❌ Integración automática con WhatsApp Business API
- ❌ Multiidioma

---

## 7. Mensajes y Notificaciones

### 7.1 Al cliente
- Éxito al agregar item: Toast breve "Agregado al carrito"
- Al abrir WhatsApp: Nada en ÑAMI (WhatsApp se abre, listo)

### 7.2 Al restaurante
- Hoy: Recibe el mensaje en WhatsApp (texto pregenerado del cliente)
- Futuro: Bot de WhatsApp, webhook, etc. (Fase 3)

---

## 8. Métricas de éxito — Fase 2

| Métrica | Meta Mes 1 | Meta Mes 3 |
|---|---|---|
| Restaurantes registrados | 10 | 30 |
| Restaurantes Plan Pro | 2 | 8 |
| Usuarios únicos en feed | 500 | 2.000 |
| Búsquedas en feed | 300 | 1.200 |
| Pedidos canalizados (estimado) | 50 | 300 |
| Bounce rate feed | < 50% | < 40% |
| Avg session duration | > 1 min | > 2 min |
| Mobile traffic | > 70% | > 75% |

---

## 9. Convenciones técnicas

- **Respuestas API:** Formato `ApiResult<T>` = `{ success: boolean; data?: T; error?: string; }`
- **Rutas:** REST estándar, namespaces `/restaurants`, `/dashboard`, `/admin`
- **Base de datos:** Names en snake_case (Prisma), lógica en español
- **Componentes:** camelCase, colocados en carpeta del feature
- **Variables env:** `.env.local` por app, nunca versionadas
- **Validaciones:** En backend (nunca confiar solo en frontend)
- **Imágenes:** Supabase Storage (presigned URL), no base64
- **Autenticación:** Supabase Auth JWT, verificar en backend

---

## 10. Timeline

- **Semana 1-2:** Setup monorepo, DB Supabase, auth backend
- **Semana 2-3:** API REST (restaurants, menu endpoints)
- **Semana 3-4:** Web frontend (feed, carrito, mensaje WhatsApp)
- **Semana 4-5:** Dashboard restaurante (perfil, menú, link/QR)
- **Semana 5:** QA, fixes, optimizaciones
- **Semana 6:** Deploy beta en Vercel + Render, invitar primeros restaurantes

---

## 11. Dependencias externas

- Supabase: Auth + Postgres + Storage
- Vercel: Deploy apps web y dashboard
- Render: Deploy API
- qrcode.js: Generación de QR
- React Query (TanStack): Data fetching en frontend
- Zustand: Estado del carrito (client-side)
- shadcn/ui: Componentes base (botones, inputs, selects, etc.)
