# 🛠️ ÑAMI Landing — Instrucciones para Desarrollo/Refinamiento

**Dirigido a:** Modelos de IA avanzados, desarrolladores, equipos de frontend.

---

## 📌 ESTADO ACTUAL

✅ **Funcional:** Proyecto Next.js 15 + TypeScript + Tailwind CSS v4
✅ **Corriendo:** npm run dev en http://localhost:3000
✅ **Componentes:** Todos creados (Navbar, Hero, ProblemSolution, Features, Plans, Form, FAQ, Footer)
✅ **Formulario:** Conectado a Formspree (falta configuración de Form ID)
✅ **Styling:** Completo con dark mode
✅ **Animaciones:** Implementadas con Framer Motion
✅ **Responsive:** Mobile-first, testeado

---

## 🎯 PRÓXIMAS ACCIONES (En orden de prioridad)

### CRÍTICO - Debe hacerse antes de lanzar

#### 1. **Configurar Formspree** (30 minutos)
```
Status: ⏳ Pendiente (bloquea launch)

Pasos:
1. Steven va a https://formspree.io
2. Sign up gratis
3. Create new form
4. Copia el Form ID que genera (ej: f/abc123def456)
5. Abre: /landing/components/Form.tsx
6. Línea 43: reemplaza YOUR_FORM_ID con el ID real
7. Guarda

Qué hace: Permite que los registros se envíen a Google Sheets
```

#### 2. **Crear Google Sheet** (20 minutos)
```
Status: ⏳ Pendiente

Pasos:
1. Steven abre Google Drive
2. New → Google Sheets
3. Nombre: "ÑAMI - Registros"
4. Crea columnas:
   - Timestamp
   - Nombre Restaurante
   - Nombre Dueño
   - WhatsApp
   - Plan
5. Formspree auto-llenará esto

Qué hace: Centraliza todos los leads en un sheet
```

#### 3. **Deploy en Vercel** (10 minutos)
```
Status: ⏳ Pendiente

Pasos:
1. npm install -g vercel (si no tiene)
2. vercel login (auth con cuenta)
3. cd /landing && vercel
4. Follow prompts
5. Vercel genera URL (ej: nami.vercel.app)

Qué hace: Landing en vivo públicamente accesible
```

---

### ALTA PRIORIDAD - Mejoras antes de "lanzar a la venta"

#### 4. **Personalización de contenido** (2-4 horas)
```
Items a editar/validar:

□ Navbar
  - Logo: Cambiar emoji 🍔 si quieres otro
  - Links: Verificar que scrollean correctamente
  - Mobile menu: Testear en iPhone real

□ Hero
  - Headline: "Descubre restaurantes reales en tu pueblo" ✓
  - Subheadline: "Pide directo..." ✓
  - Visual: Placeholder es icono 📱, cambiar si tienes imagen
  - Animaciones: Activadas, suaves

□ Problem/Solution
  - Problema side: ❌ items (actualizar si necesario)
  - Solution side: ✅ items (actualizar si necesario)

□ Features
  - 3 features descritas (revisar que sean claras)
  - Iconos emojis (puedes cambiar)

□ Plans
  - Precios en COP: $0, $19.900, $60.000 ✓
  - Features por plan: Verificar que sean accurate
  - Plus destacado: Debe ser el más prominente

□ Form
  - Labels: Spanish ✓
  - Placeholders: Claros ✓
  - WhatsApp format: Validar que acepta tu región
  - Success message: Personalizar si quieres

□ FAQ
  - 5 preguntas en Spanish ✓
  - Respuestas precisas: Revisar

□ Footer
  - Redes sociales: Agregar URLs reales (Instagram, TikTok, WhatsApp)
  - Copyright: "© 2026 ÑAMI" ✓
  - Links privacidad/términos: Crear páginas si falta
```

#### 5. **Agregar imágenes/visual assets** (4-8 horas)
```
Lugares donde meter imágenes:

1. Hero section visual:
   - Reemplazar placeholder 📱 con mockup de app
   - O ilustración custom (hamburguesa, teléfono, etc.)
   - Recomendado: Ilustración style 21st.dev (minimalist)

2. Feature icons:
   - Cambiar emojis por SVG custom si quieres
   - Mantener minimalista (21st style)

3. Logo:
   - Crear logo "ÑAMI" si quieres reemplazar emoji
   - Agregarlo a public/images

4. Favicon:
   - Crear favicon (32x32 PNG)
   - Guardar en public/favicon.ico
   - Link ya existe en layout.tsx

Recomendación: Mantener minimalista, emojis están bien para MVP.
```

#### 6. **Testing y QA** (2-3 horas)
```
Checklist de testing:

Mobile Testing (375px):
□ Navbar hamburger funciona
□ Hero es legible
□ Form campos alineados
□ Botones tocables (48px mín)
□ Scroll suave

Desktop Testing (1200px):
□ 3 columnas en Features/Plans visible
□ Navbar desktop menu visible
□ Formeulario max-width respetado
□ Sombras visibles

Dark Mode:
□ Todos los textos legibles
□ Colores adaptan correctamente
□ No hay contraste bajo

Forms:
□ Validación funciona (campos requeridos)
□ WhatsApp error si formato incorrecto
□ Submit va a Formspree (CHECK logs)
□ Success message aparece

Performance:
□ Google Lighthouse score > 90
□ Load time < 2s
□ No console errors
```

---

### MEDIA PRIORIDAD - Después de lanzar

#### 7. **Analytics Setup** (1-2 horas)
```
Añadir Google Analytics:

1. Crear cuenta en Google Analytics 4
2. Copiar Tracking ID
3. Agregar a app/layout.tsx dentro de <head>:

<script
  async
  src={`https://www.googletagmanager.com/gtag/js?id=GA_ID`}
></script>
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_ID');
    `,
  }}
/>

Qué rastrear:
- Form submissions
- Scroll depth
- Time on page
- Device type
```

#### 8. **A/B Testing** (Variable, 2+ semanas)
```
Ideas para testear:

Button Color:
- Actual: Naranja (#F97316)
- Test: Rojo/Verde

Button Text:
- Actual: "Sé uno de los primeros →"
- Test: "Solicitar acceso ahora"

Headline:
- Actual: "Descubre restaurantes reales en tu pueblo"
- Test: "Encuentra restaurantes nuevos sin esperar"

CTA Hero position:
- Actual: Bajo hero
- Test: Sticky al scroll

Usar Vercel Analytics para comparar conversión.
```

---

### BAJA PRIORIDAD - Futuro

#### 9. **Agregar secciones futuras** (TBD)
```
Posibles adiciones (NO AHORA):

□ Testimonios section
  - Cards con foto + nombre + quote
  - "Restaurante X está ganando 10 clientes/día"

□ Blog section
  - Posts sobre cómo crecer con ÑAMI
  - Historias de éxito

□ Chatbot
  - Responder preguntas sobre planes
  - Pre-qualify leads

□ Comparativa con Rappi
  - Tabla: Comisión, features, etc.
  - Subrayar ventajas ÑAMI

□ Vídeo demostrativo
  - 30 seg de cómo funciona ÑAMI
  - Embedded en Hero o Features
```

---

## 🔧 Guía de Desarrollo

### Agregar nueva sección

```tsx
// 1. Crear componente en components/NuevaSeccion.tsx
'use client'

import { motion } from 'framer-motion'

export default function NuevaSeccion() {
  return (
    <section id="nueva-seccion" className="py-20 md:py-32 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12"
        >
          Título
        </motion.h2>

        {/* Contenido */}
      </div>
    </section>
  )
}

// 2. Importar en app/page.tsx
import NuevaSeccion from '@/components/NuevaSeccion'

// 3. Agregar al flujo
<NuevaSeccion />

// 4. Usar Tailwind para styling
// 5. Framer Motion para animaciones
```

### Cambiar colores

```js
// tailwind.config.js - sección colors
orange: {
  50: '#fef3c7',
  500: '#f97316',  // ← Cambiar este
  600: '#ea580c',
}
```

### Cambiar textos

```tsx
// En componente correspondiente
const text = "Nuevo texto aquí"

// O si es mucho contenido, crear archivo separado
// lib/content.ts
export const heroText = {
  headline: "...",
  subheadline: "...",
}
```

### Agregar animación

```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
>
  Contenido
</motion.div>
```

### Agregar validación de campo

```tsx
{...register('email', {
  required: 'El email es requerido',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Email inválido'
  }
})}
```

---

## 🚀 Deployment Checklist

Antes de hacer `npm run build && vercel`:

```
□ Formspree configurado (Form ID real)
□ Google Sheet creado
□ Sin console.error en dev
□ Lighthouse score > 90
□ Mobile testing pasado
□ Contenido finalizado
□ Images optimizadas
□ Links externos funcionan
□ Favicon presente
□ Meta tags correctos
□ robots.txt configurado (Vercel auto)
□ sitemap.xml (Next.js auto)
```

---

## 📊 Métrica de Éxito

Medir post-lanzamiento:

```
META: 50+ registros en Google Sheet en primer mes

Indicadores:
- Daily visits: > 100
- Conversion rate: > 5% (formulario completo)
- Bounce rate: < 40%
- Avg time: > 30 segundos
- Mobile vs Desktop: 70% mobile

Si no llega, investigar:
1. Tráfico insuficiente (mejorar promotion)
2. Copy no resonante (iterar headlines)
3. Formulario tedioso (simplificar)
4. Technical issues (checar logs)
```

---

## 🐛 Troubleshooting Común

| Problema | Causa | Solución |
|----------|-------|----------|
| Form no envía | Formspree no configurado | Agregar Form ID real en Form.tsx |
| Estilos rotos | Tailwind no compila | npm install @tailwindcss/postcss |
| Animaciones lentas | Framer Motion issue | Usar transform + opacity (no color) |
| Mobile responsive roto | Breakpoints incorrecto | Revisar tailwind.config.js |
| Dark mode no funciona | CSS issue | Verificar app/globals.css @import |
| Build falla | TypeScript error | Revisar tipos en componentes |

---

## 📚 Recursos Útiles

```
Documentation:
- Next.js: https://nextjs.org/docs
- Tailwind: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/
- React Hook Form: https://react-hook-form.com/
- Formspree: https://formspree.io/docs

Inspiration:
- 21st.dev (diseño minimalista)
- Stripe.com (landing structure)
- Vercel.com (dark mode, animations)

Tools:
- Vercel CLI: vercel.com/docs/cli
- Tailwind IntelliSense: VS Code extension
- Lighthouse: Built-in Chrome DevTools
```

---

## 🎬 Ejecución Recomendada

**Hoy (Ya hecho):**
1. ✅ Crear proyecto Next.js
2. ✅ Instalar dependencias
3. ✅ Crear componentes
4. ✅ Implementar formulario

**Mañana:**
1. Configurar Formspree (30 min)
2. Crear Google Sheet (20 min)
3. Testing local (1 hora)
4. Deploy Vercel (10 min)

**Esta semana:**
1. Promocionar en WhatsApp (grupos, contactos)
2. Compartir en Instagram Stories
3. Monitorear primeros registros
4. Iterar basado en feedback

**Próximas semanas:**
1. A/B testing de copy
2. Agregar analytics
3. Escalar marketing
4. Refinamiento basado en datos

---

## ✅ Sign-Off

Landing ÑAMI está **lista para lanzar** una vez:
1. ✅ Formspree configurado
2. ✅ Google Sheet creado
3. ✅ Testing completado
4. ✅ Deployed en Vercel

**Sin estos, el formulario no funcionará.**

---

**Documento preparado:** 14 de marzo 2026
**Versión:** 1.0
**Para:** Desarrollo y refinamiento futuro

---

*¿Dudas? Revisar ESPECIFICACIONES_LANDING.md para detalles técnicos.*
