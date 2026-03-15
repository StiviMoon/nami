# ÑAMI Landing Page v2

Landing page moderna, minimalista y elegante para ÑAMI — plataforma local de descubrimiento de restaurantes.

## Stack

- **Next.js 15** + App Router
- **TypeScript**
- **Tailwind CSS v4** (CSS-first config)
- **Framer Motion** (animaciones)
- **@formspree/react** (formulario conectado)
- **Lucide React** (iconos)

## Instalacion

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en desarrollo
npm run dev

# 3. Abrir http://localhost:3000
```

## Formspree

El formulario ya esta conectado con el Form ID `mqeydpok`.
Los datos se envian automaticamente cuando alguien completa el registro.

Para cambiar el Form ID, edita `components/contact-form.tsx` linea:
```typescript
const [formspreeState, handleFormspree] = useForm("mqeydpok");
```

## Deploy en Vercel

```bash
npm install -g vercel
vercel login
vercel
```

## Estructura

```
nami-landing/
├── app/
│   ├── layout.tsx          # Layout + fonts (Sora + Plus Jakarta Sans)
│   ├── page.tsx            # Pagina principal
│   └── globals.css         # Theme Tailwind v4 (naranja + lavanda + negro)
├── components/
│   ├── navbar.tsx          # Navbar flotante estilo iOS (pill + blur)
│   ├── hero.tsx            # Hero con mockup de telefono
│   ├── problem-solution.tsx
│   ├── features.tsx        # 3 cards simetricas
│   ├── plans.tsx           # 3 planes simetricos
│   ├── contact-form.tsx    # Formspree mqeydpok
│   ├── faq.tsx             # Accordion
│   └── footer.tsx          # CTA + links
├── lib/utils.ts
└── package.json
```

## Paleta de colores

| Rol | Color | Hex |
|-----|-------|-----|
| Primario (accion) | Naranja | `#FF7A00` |
| Acento (ambiente) | Lavanda | `#B088C9` |
| Detalle | Lima | `#D2E600` |
| Base oscura | Negro | `#0A0A0A` |
| Texto light | Casi negro | `#111111` |
| Texto dark | Casi blanco | `#F0F0F0` |

---

Hecho en Colombia.
