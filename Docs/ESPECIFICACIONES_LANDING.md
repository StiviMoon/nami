# 🍔 ÑAMI Landing Page — Especificación Completa

**Fecha:** 14 de marzo 2026
**Proyecto:** ÑAMI - Plataforma local de descubrimiento de restaurantes
**Versión:** 1.0 MVP
**Estado:** Funcional, listo para refinamiento

---

## 📋 RESUMEN EJECUTIVO

ÑAMI es una landing page moderna, minimalista y totalmente responsiva que captura registros de restaurantes interesados en usar la plataforma de descubrimiento local.

**Objetivo:** Convertir visitantes en leads (restaurantes) mediante formulario integrado con Formspree → Google Sheets.

**Audiencia:** Dueños de restaurantes/negocios de comida rápida en Yumbo, Palmira, Cali (LatAm).

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

### 1. **Navbar Sticky (Navegación)**
- Logo + "ÑAMI" con emoji 🍔
- Links de navegación (Features, Planes, FAQ, Contacto)
- CTA Button "Únete ahora" (scroll a formulario)
- Mobile menu hamburguesa (responsive < 768px)
- Fixed top, z-index 50, backdrop-blur semi-transparente
- Smooth scroll a secciones

### 2. **Hero Section**
- Headline principal: "Descubre restaurantes reales en tu pueblo"
- Subheadline: "Pide directo por WhatsApp. Sin comisión alta. Sin demoras."
- CTA primario: "Sé uno de los primeros →" (button naranja)
- Visual placeholder: Icono 📱 en gradiente naranja
- Animaciones Framer Motion:
  - Fade in + slide up (0.8s)
  - Scroll indicator animado (bounce)
- Hero ocupa min-height: 100vh
- Background gradient blanco → naranja 10% opacity

### 3. **Problem-Solution Section**
- 2 columnas (mobile: 1 columna)
- **Lado izquierdo (Problema):**
  - Headline: "¿Por qué no te encuentran?"
  - 4 problemas con icono ❌:
    - Clientes solo por recomendación
    - Google Maps desactualizado
    - Sin datos de quién te pide
    - Rappi te cobra 30% comisión

- **Lado derecho (Solución):**
  - Headline: "ÑAMI lo resuelve"
  - 4 soluciones con icono ✅:
    - Clientes nuevos automáticamente
    - Información siempre actualizada
    - Dashboard con analytics
    - Sin comisión, solo directo

- Background gris claro (#F9FAFB)
- Animaciones entrada: fade + slide lateral (0.8s)

### 4. **Features Section**
- 3 cards responsivas (1 columna mobile, 3 desktop)
- **Feature 1:** 🔍 "Clic para encontrar"
  - "Los clientes buscan tu restaurante en ÑAMI. Apareces primero. Simple."

- **Feature 2:** 💬 "Pedidos directos"
  - "Sin plataforma de terceros. Recibe pedidos en tu WhatsApp."

- **Feature 3:** 📊 "Entiende tu negocio"
  - "Mira qué piden, cuándo, quién ordena. Crece con información real."

- Estilos card:
  - Border 1px gris claro
  - Padding 24px
  - Border-radius 10px
  - Hover: shadow + scale 1.02
  - Transición 0.3s

- Animaciones stagger: delay incremental por card

### 5. **Plans Section**
- 3 tarjetas de precios (responsive)
- **Plan 1: GRATIS**
  - Icon: 🎁
  - Precio: $0/mes
  - Descripción: "Perfecto para empezar"
  - 4 features
  - Background: gris claro
  - Button: gris

- **Plan 2: PLUS** ⭐ (DESTACADO)
  - Icon: 🚀
  - Precio: $19.900/mes
  - Descripción: "Recomendado para crecer"
  - 6 features
  - Background: Naranja (#F97316)
  - Text: Blanco
  - Scale: 1.05 más grande (desktop)
  - Shadow: prominente
  - Button: Blanco texto naranja

- **Plan 3: PRO**
  - Icon: 👑
  - Precio: $60.000/mes
  - Descripción: "Para negocios grandes"
  - 6 features
  - Background: gris oscuro
  - Text: blanco
  - Button: naranja

- Todos los buttons hacen scroll a formulario
- Features listadas con checkmark ✓ verde

### 6. **Form Section (CRM Hub)**
- **Header:**
  - Headline: "Sé uno de los primeros en ÑAMI"
  - Subheadline: "Regístrate ahora y obtén acceso prioritario"

- **Form Fields:**
  1. "Nombre del restaurante" (text, required, min 3 chars)
     - Placeholder: "Ej: El Clásico Hamburguesas"

  2. "Tu nombre" (text, required, min 3 chars)
     - Placeholder: "Tu nombre completo"

  3. "WhatsApp" (tel, required, validación Colombia +57)
     - Placeholder: "+57 300 1234567"
     - Regex: `^\+?57\d{9,10}$`

  4. "Plan de interés" (select, required)
     - Opciones: "Elige un plan...", "Gratis", "Plus", "Pro"

- **Validación:**
  - React Hook Form + Zod
  - Error messages en rojo
  - Client-side validation
  - Required fields destacados

- **Submit Button:**
  - Text: "Solicitar acceso →"
  - Ancho: 100%
  - Background: naranja
  - Disabled state con loading
  - Ripple effect en click

- **Success Message (5 segundos):**
  - Background verde claro
  - Icono checkmark verde
  - Título: "¡Perfecto! 🎉"
  - Mensaje: "Tu solicitud fue registrada. Te contactaremos en 2 semanas..."
  - Auto-desaparece

- **Form Submit:**
  - POST a Formspree: `https://formspree.io/f/YOUR_FORM_ID`
  - Headers: `Accept: application/json`
  - Formspree redirige a Google Sheets automáticamente

- Background: amarillo claro (#FEF3C7)
- Max-width: 500px formulario

### 7. **FAQ Section**
- Headline: "Preguntas frecuentes"
- 5 acordeones expandibles

**FAQ Items:**
1. "¿Cuándo sale ÑAMI en mi ciudad?"
   - "Estamos en fase de piloto en Yumbo y Palmira..."

2. "¿Pagaré comisión por cada pedido?"
   - "No. En Plan Gratis y Plus, cero comisión..."

3. "¿Cómo recibo los pedidos?"
   - "Directamente en tu WhatsApp..."

4. "¿Necesito cambiar mis operaciones?"
   - "No. ÑAMI se adapta a ti..."

5. "¿Qué pasa con mis datos?"
   - "Tus datos son privados. No los vendemos..."

**Accordion Behavior:**
- Click expande/contrae
- Icono chevron rota 180° al expandir
- Height animation 0.3s ease
- Múltiples pueden estar abiertas

### 8. **Footer**
- **CTA Section (antes):**
  - Headline: "¿Listo para crecer?"
  - Button naranja
  - Background naranja

- **Footer Content:**
  - 3 columnas (mobile: 1 columna)
  - **Col 1:** Logo + tagline
  - **Col 2:** Links (Features, Planes, FAQ, Contacto)
  - **Col 3:** Redes (Instagram, TikTok, WhatsApp)

- **Bottom:**
  - Copyright: "© 2026 ÑAMI. Hecho con ❤️ en Colombia."
  - Links: Privacidad, Términos

- Background: gris oscuro (#1F2937)
- Links hover: color naranja

---

## 🎨 DISEÑO & VISUAL

### Paleta de Colores
```
Primario:        #F97316 (Naranja vibrante)
Primario Dark:   #EA580C (Naranja oscuro hover)
Gris Oscuro:     #1F2937 (Texto, títulos)
Gris Medio:      #6B7280 (Texto secundario)
Gris Claro:      #D1D5DB (Borders, dividers)
Background:      #FFFFFF (Blanco)
Background Dark: #0F172A (Gris muy oscuro, dark mode)
Éxito:           #10B981 (Verde, checkmarks)
Error:           #EF4444 (Rojo, errores)
```

### Tipografía
- **Font-family:** Inter (Google Fonts)
- **Weights:**
  - Regular: 400
  - Semibold: 600
  - Bold: 700
  - Extra Bold: 800 (headlines)

- **Sizes:**
  - Hero H1: 28px mobile, 48px desktop
  - Section H2: 24px mobile, 40px desktop
  - Subheading: 16px mobile, 20px desktop
  - Body: 14-16px
  - Small: 12px

- **Line-height:**
  - Headings: 1.2-1.3
  - Body: 1.6

### Espaciado (8px grid)
```
4px, 8px, 12px, 16px, 20px, 24px, 28px, 32px, 40px, 48px, 60px, 80px
```

### Border Radius
- Small buttons: 8px
- Cards: 10px
- Large containers: 12px

### Sombras
```
Sutil:     0 1px 2px 0 rgba(0, 0, 0, 0.05)
Medio:     0 4px 6px -1px rgba(0, 0, 0, 0.1)
Grande:    0 10px 15px -3px rgba(0, 0, 0, 0.1)
XL:        0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

### Transiciones
- Rápida: 0.2s ease
- Normal: 0.3s ease
- Lenta: 0.5s ease

### Animaciones (Framer Motion)
- **Fade In:** opacity 0→1
- **Slide Up:** translateY 20px→0 + opacity
- **Scale Hover:** 1 → 1.02 en cards
- **Rotate:** Chevron en accordion
- **Bounce:** Scroll indicator infinito

### Dark Mode
- Soportado automáticamente
- Basado en `prefers-color-scheme`
- Colores adaptativos por sección

### Responsive Breakpoints
```
Mobile:    < 640px   (100% width, padding 16px)
Tablet:    640-768px (gradual scaling)
Desktop:   > 768px   (max-width containers, padding 24px)
```

---

## 🏗️ ARQUITECTURA TÉCNICA

### Stack
```
Frontend Framework:  Next.js 15
Language:           TypeScript
Styling:            Tailwind CSS v4 + Dark Mode
Animations:         Framer Motion
Form Validation:    React Hook Form + Zod
UI Library:         Radix UI (accesibility)
Icons:              Lucide React + Emojis
External Forms:     Formspree (→ Google Sheets)
Deployment:         Vercel
```

### Estructura de Carpetas
```
landing/
├── app/
│   ├── layout.tsx              ← Root layout + metadata + fonts
│   ├── page.tsx                ← Página principal (todas las secciones)
│   ├── globals.css             ← Estilos globales + CSS custom
│   └── favicon.ico             ← Favicon
│
├── components/
│   ├── Navbar.tsx              ← Navbar sticky + mobile menu
│   ├── Hero.tsx                ← Hero section con CTA
│   ├── ProblemSolution.tsx      ← Problema vs Solución (lado a lado)
│   ├── Features.tsx            ← 3 Features con cards
│   ├── Plans.tsx               ← 3 Planes con precios
│   ├── Form.tsx                ← Formulario Formspree + validación
│   ├── FAQ.tsx                 ← FAQ accordion
│   └── Footer.tsx              ← Footer + CTA final
│
├── lib/
│   └── utils.ts                ← Utility: cn() para clases Tailwind
│
├── public/
│   └── images/                 ← Imágenes estáticas
│
├── tailwind.config.js          ← Config Tailwind (colores, theme)
├── postcss.config.js           ← PostCSS + @tailwindcss/postcss
├── tsconfig.json               ← TypeScript config
├── next.config.js              ← Next.js config
├── package.json                ← Dependencies + scripts
├── .gitignore
├── README.md
└── ESPECIFICACIONES_LANDING.md ← Este archivo
```

### Flujo de Datos

```
Usuario visita landing
        ↓
Navbar (sticky) + Hero section
        ↓
Scroll por secciones (ProblemSolution, Features, Plans, FAQ)
        ↓
Click "Únete ahora" o "Solicitar acceso"
        ↓
Scroll a Form section
        ↓
Completa formulario:
   - Nombre restaurante
   - Nombre dueño
   - WhatsApp
   - Plan elegido
        ↓
Validación (React Hook Form + Zod)
        ↓
Si válido → Submit POST a Formspree
        ↓
Formspree recibe → Automáticamente añade a Google Sheet
        ↓
Success message mostrada (5 segundos)
        ↓
Form se resetea
```

### Dependencias Principales

| Package | Versión | Propósito |
|---------|---------|-----------|
| next | 16.1.6 | Framework |
| react | 19.2.4 | Library |
| typescript | 5.9.3 | Type safety |
| tailwindcss | 4.2.1 | Styling |
| @tailwindcss/postcss | 4.2.1 | Tailwind PostCSS plugin |
| framer-motion | 12.36.0 | Animaciones |
| react-hook-form | 7.71.2 | Form validation |
| zod | 4.3.6 | Schema validation |
| lucide-react | 0.577.0 | Icons |
| @radix-ui/* | Latest | Accesible components |
| clsx | 2.1.1 | Class merging |
| tailwind-merge | 3.5.0 | Class conflict resolution |

---

## 🔌 INTEGRACIONES EXTERNAS

### Formspree (Form Submission)
```
Endpoint: https://formspree.io/f/{FORM_ID}
Method:   POST
Headers:  Content-Type: application/json, Accept: application/json
Body:     {
            restaurantName: string
            ownerName: string
            whatsapp: string
            plan: 'free' | 'plus' | 'pro'
          }
Response: 200 OK → Success state
```

**Configuración:**
1. Registrarse en formspree.io (gratis)
2. Crear nuevo formulario
3. Copiar Form ID
4. Reemplazar `YOUR_FORM_ID` en `components/Form.tsx` línea 43

**Google Sheets Integration:**
- Formspree conecta automáticamente a Google Sheets
- Los registros aparecen en tiempo real
- Steven puede ver lista de leads en el sheet

### Google Fonts
- Font: Inter (weights 400, 600, 700)
- Preload en layout.tsx

### Lucide Icons
- Usados en: Navbar (menu), ProblemSolution, Features, FAQ, etc.
- Sizes: 16px-48px según contexto

---

## 🚀 INSTRUCCIONES DE USO

### Setup Local

```bash
# 1. Navegar a proyecto
cd /home/steven/Documentos/Proyectos/ñami/landing

# 2. Instalar dependencias (ya hecho)
npm install

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir en navegador
# http://localhost:3000
```

### Configurar Formspree (CRÍTICO)

```bash
# 1. Ir a https://formspree.io
# 2. Sign up (gratis)
# 3. Create new form
# 4. Copiar Form ID (ej: f/abc123def456)
# 5. Abrir: components/Form.tsx
# 6. Línea 43, reemplazar:
#    'https://formspree.io/f/YOUR_FORM_ID'
# Con:
#    'https://formspree.io/f/abc123def456'
# 7. Save
```

### Build para Producción

```bash
npm run build
npm run start
```

### Deploy en Vercel

```bash
npm install -g vercel
vercel login
vercel
```

Vercel auto-detecta Next.js y configura todo.

---

## ✅ CHECKLIST DE QA

### Funcionalidad
- [ ] Navbar links scrollean a secciones correctamente
- [ ] Mobile menu abre/cierra
- [ ] CTA buttons hacen scroll a formulario
- [ ] Formulario valida campos (required, formato WhatsApp)
- [ ] Submit envía POST a Formspree
- [ ] Success message muestra 5 segundos
- [ ] Form se resetea después de submit
- [ ] FAQ accordion abre/cierra items

### Diseño
- [ ] Colores coinciden especificación (naranja #F97316)
- [ ] Tipografía Inter carga correctamente
- [ ] Espaciado consistente (8px grid)
- [ ] Sombras sutiles en cards/buttons
- [ ] Border radius correcto (8-12px)

### Responsive
- [ ] Mobile (375px): todas las secciones apiladas
- [ ] Tablet (768px): layouts adaptan
- [ ] Desktop (1200px): 3 columnas visibles
- [ ] Navbar mobile menu funciona
- [ ] Formulario completo legible en mobile

### Performance
- [ ] Load time < 2s
- [ ] Lighthouse score > 90
- [ ] Images optimizadas (WebP)
- [ ] No console errors
- [ ] Smooth scrolling

### Accesibilidad
- [ ] Alt text en imágenes
- [ ] Form labels accesibles
- [ ] Buttons focusables (keyboard)
- [ ] Color contrast adecuado
- [ ] Dark mode funciona

### Dark Mode
- [ ] Colores adaptan automáticamente
- [ ] Text legible en dark
- [ ] Scrollbar visible en dark
- [ ] Respeta `prefers-color-scheme`

---

## 🔒 Consideraciones de Seguridad

1. **CSRF:** Formspree maneja automáticamente
2. **XSS:** React sanitiza JSX automáticamente
3. **Input Validation:** Zod valida client + server side (Formspree)
4. **Rate Limiting:** Formspree tiene límites por defecto
5. **Privacy:** No se almacenan datos locales, todo en Google Sheets
6. **HTTPS:** Vercel fuerza HTTPS automáticamente

---

## 📊 Métricas a Monitorear

Una vez en producción, rastrear:

```
1. Conversion Rate: % que completa formulario
2. Bounce Rate: % que deja sin interactuar
3. Time on Page: Segundos promedio en landing
4. Scroll Depth: Cuán abajo llegan usuarios
5. Device Split: Mobile vs Desktop traffic
6. Form Errors: Campos más problemáticos
7. Success Rate: % de submits exitosos
8. Google Analytics: Fuentes de tráfico
```

**Herramientas:**
- Google Analytics 4
- Vercel Analytics
- Formspree Stats (built-in)

---

## 🎯 Flujo de Mejora Continua

1. **Semana 1:** Lanzar, monitorear métricas
2. **Semana 2:** Recopilar feedback, ajustar copy
3. **Semana 3:** A/B test buttons/colores
4. **Semana 4:** Optimizar conversion rate
5. **Futuro:** Agregar testimonios, blog, chatbot

---

## 📝 Notas Importantes

1. **Formspree obligatorio:** Sin configurar, el formulario no enviará datos
2. **Google Sheets:** Crear manualmente en cuenta Google (Formspree lo guía)
3. **WhatsApp validation:** Acepta formato colombiano (+57) y otros LatAm
4. **Dark mode:** Funciona automáticamente, no requiere toggle
5. **Mobile-first:** Diseño optimizado para teléfono primero
6. **Animaciones:** Framer Motion, suaves pero no exageradas
7. **Accesibilidad:** Radix UI + semantic HTML

---

## 🎬 Próximos Pasos

1. ✅ Landing funcional (YA HECHO)
2. ⏳ Configurar Formspree
3. ⏳ Crear Google Sheet
4. ⏳ Deploy en Vercel
5. ⏳ Promover en redes/WhatsApp
6. ⏳ Monitorear leads
7. ⏳ Iterar basado en feedback

---

## 📞 Contacto/Soporte

Para dudas técnicas sobre la landing:
- Stack: Next.js 15 + TypeScript + Tailwind v4
- Animations: Framer Motion
- Forms: Formspree + React Hook Form
- Hosting: Vercel

---

**Documento creado:** 14 de marzo 2026
**Versión:** 1.0
**Estado:** Funcional MVP
**Próxima revisión:** Post-lanzamiento

---

*Esta especificación es un snapshot del estado actual del proyecto. Será actualizada según evolucione la landing.*
