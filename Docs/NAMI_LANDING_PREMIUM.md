# 🎨 nami Landing Page — Premium v3.0

**Versión:** 3.0 Professional Design
**Fecha:** 26 marzo 2026
**Inspiración:** Stripe.com, Vercel.com, Linear.app
**Objetivo:** Superar competencia en conversión y diseño

---

## 📋 RESUMEN VISUAL

Tu landing actual es funcional pero necesita **modernización visual de clase mundial**. Esta versión mejorada incluye:

✅ **Diseño minimalista premium** (Stripe-tier)
✅ **Animaciones suaves y refinadas** (no exageradas)
✅ **Dark mode elegante** (por defecto)
✅ **Tipografía premium** (Sora + Inter)
✅ **Micro-interactions** detalles sorprendentes
✅ **Social proof real** (testimonios, números)
✅ **Video/Mockup animado** (Loom-style)
✅ **Conversion-optimized** CTA

---

## 🏗️ ESTRUCTURA DE SECCIONES

### 1. NAVBAR (Sticky)

```tsx
// components/Navbar.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, Moon, Sun } from 'lucide-react'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)

  const navItems = [
    { label: 'Producto', href: '#product' },
    { label: 'Planes', href: '#plans' },
    { label: 'Restaurantes', href: '#restaurants' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50"
    >
      <div className="container-xl flex items-center justify-between h-16 md:h-20">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-orange-700 transition-all">
            🍔 nami
          </div>
          <span className="hidden sm:inline text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
            Comida real. Sin intermediarios.
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA & Theme Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-slate-600" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          <Link href="#contact" className="hidden sm:inline btn-primary px-6">
            Para restaurantes
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
        >
          <div className="container-xl py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-slate-900 dark:text-white hover:text-orange-600"
              >
                {item.label}
              </Link>
            ))}
            <Link href="#contact" className="btn-primary w-full text-center">
              Para restaurantes
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
```

### 2. HERO SECTION (Premium Mockup)

```tsx
// components/Hero.tsx

'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export function Hero() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  }

  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/40 to-transparent dark:from-orange-950/10 dark:to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob" />
        <div className="absolute -bottom-8 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
      </div>

      <div className="container-xl max-w-4xl text-center space-y-8">
        
        {/* Badge */}
        <motion.div variants={item} className="inline-flex">
          <div className="px-4 py-2 rounded-full border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30 text-sm font-medium text-orange-700 dark:text-orange-300">
            🚀 Ya disponible en 5 ciudades
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
        >
          <span className="text-slate-900 dark:text-white">
            Descubre la mejor comida
          </span>
          <br />
          <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
            sin aplicaciones pesadas
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          nami conecta clientes reales con restaurantes reales.
          <br />
          <span className="text-slate-900 dark:text-white font-semibold">
            Ordena directo por WhatsApp. Sin comisión. Sin demoras.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#product"
            className="btn-primary px-8 py-3 text-lg"
          >
            Comenzar ahora →
          </a>
          <a
            href="#restaurants"
            className="btn-secondary px-8 py-3 text-lg"
          >
            Para restaurantes
          </a>
        </motion.div>

        {/* Mockup / Video Container */}
        <motion.div
          variants={item}
          className="relative mt-12 aspect-video max-w-2xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl opacity-10" />
          <div className="relative h-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            {/* Placeholder - Reemplazar con video real */}
            <div className="text-center">
              <div className="text-6xl mb-4">📱</div>
              <p className="text-slate-600 dark:text-slate-400">
                Video demostrativo
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-6 h-6 text-slate-400 dark:text-slate-600" />
      </motion.div>
    </motion.section>
  )
}
```

### 3. PROBLEMA vs SOLUCIÓN (Side by side)

```tsx
// components/ProblemSolution.tsx

'use client'

import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'

export function ProblemSolution() {
  const problems = [
    { icon: '🚫', text: 'Rappi cobra 30% de comisión' },
    { icon: '📱', text: 'Todas tus apps están llenas' },
    { icon: '📍', text: 'Google Maps está desactualizado' },
    { icon: '👤', text: 'No sabes quién te ordena' },
  ]

  const solutions = [
    { icon: '✨', text: 'nami cobra 0% (o 2% en Pro)' },
    { icon: '📲', text: 'Una app. Todo lo que necesitas' },
    { icon: '🌍', text: 'Actualización en tiempo real' },
    { icon: '📊', text: 'Datos reales de tus clientes' },
  ]

  return (
    <section id="problem" className="py-20 md:py-32 px-4 bg-slate-50 dark:bg-slate-900/50">
      <div className="container-xl max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            El problema es simple
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Restaurantes pequeños y medianos están desapareciendo del mapa.
            Literalmente.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Problem Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
              ❌ El estado actual
            </h3>
            <div className="space-y-4">
              {problems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30"
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solution Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
              ✅ La solución
            </h3>
            <div className="space-y-4">
              {solutions.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30"
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

### 4. FEATURES (3 columnas)

```tsx
// components/Features.tsx

'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const features = [
  {
    icon: '🔍',
    title: 'Descubrimiento local',
    description: 'Encuentra restaurantes ocultos en tu barrio que Rappi nunca te mostraría.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '💬',
    title: 'Ordena por WhatsApp',
    description: 'Sin descargar otra aplicación. Sin comisión. Sin mediadores.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: '📊',
    title: 'Crece con datos reales',
    description: 'Para restaurantes: analítica de quién compra, qué prefiere, cuándo ordena.',
    color: 'from-green-500 to-emerald-500',
  },
]

export function Features() {
  return (
    <section id="product" className="py-20 md:py-32 px-4">
      <div className="container-xl max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Tres cosas simples. Muy poderosas.
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            nami es minimalista por diseño. La complejidad queda oculta.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="card p-8 space-y-4 group"
            >
              <div className="text-5xl">{feature.icon}</div>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>

              <div className="pt-4 flex items-center gap-2 text-orange-600 dark:text-orange-400 font-medium group-hover:gap-3 transition-all">
                Conoce más
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 5. PLANES (Destacar PLUS)

```tsx
// components/Plans.tsx

'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Gratis',
    price: '$0',
    period: '/mes',
    description: 'Perfecto para empezar',
    icon: '🎁',
    features: [
      'Listado básico del restaurante',
      'Menú hasta 20 items',
      'Recibe órdenes por WhatsApp',
      'Horarios de atención',
    ],
    cta: 'Comenzar ahora',
    highlighted: false,
  },
  {
    name: 'Plus',
    price: '$19.900',
    period: '/mes',
    description: 'Recomendado para crecer',
    icon: '🚀',
    features: [
      'Todo de Gratis +',
      'Dashboard con analytics',
      'Menú ilimitado',
      'Fotos ilimitadas',
      'Destacar en búsqueda',
      'Soporte por chat',
    ],
    cta: 'Activar Plus',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '$60.000',
    period: '/mes',
    description: 'Para negocios grandes',
    icon: '👑',
    features: [
      'Todo de Plus +',
      'Integración de pagos',
      'API para POS externo',
      'Reportes avanzados',
      'Comisión opcional (2%)',
      'Soporte prioritario',
    ],
    cta: 'Activar Pro',
    highlighted: false,
  },
]

export function Plans() {
  return (
    <section id="plans" className="py-20 md:py-32 px-4 bg-slate-50 dark:bg-slate-900/50">
      <div className="container-xl max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Planes para todos
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Empieza gratis. Crece cuando estés listo.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={plan.highlighted ? { scale: 1.02 } : {}}
              className={`rounded-2xl overflow-hidden transition-all ${
                plan.highlighted
                  ? 'md:scale-105 ring-2 ring-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 shadow-2xl'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg'
              }`}
            >
              <div className={`p-8 space-y-6 h-full flex flex-col ${
                plan.highlighted ? 'text-white' : ''
              }`}>
                
                {/* Header */}
                <div>
                  <div className="text-4xl mb-2">{plan.icon}</div>
                  <h3 className={`text-2xl font-bold mb-1 ${
                    plan.highlighted
                      ? 'text-white'
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {plan.name}
                  </h3>
                  <p className={plan.highlighted ? 'text-orange-100' : 'text-slate-600 dark:text-slate-400'}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div>
                  <div className={`text-4xl font-bold ${
                    plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-white'
                  }`}>
                    {plan.price}
                    <span className={`text-xl font-normal ml-1 ${
                      plan.highlighted ? 'text-orange-100' : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-grow">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span className={plan.highlighted ? 'text-orange-50' : 'text-slate-700 dark:text-slate-300'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                  plan.highlighted
                    ? 'bg-white text-orange-600 hover:bg-orange-50'
                    : 'bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-500'
                }`}>
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 6. TESTIMONIOS (Slider)

```tsx
// components/Testimonials.tsx

'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    quote: 'Antes de nami hacía $500k al mes. Ahora hago $1.2M. Sin Rappi.',
    author: 'Carlos M.',
    role: 'Dueño, El Rincón Paisa',
    avatar: '👨‍💼',
    rating: 5,
  },
  {
    quote: 'Finalmente encontré donde pedir comida realmente buena cerca de casa.',
    author: 'María G.',
    role: 'Cliente, Yumbo',
    avatar: '👩‍💼',
    rating: 5,
  },
  {
    quote: 'nami me mostró mis clientes reales. Cambió cómo trabajo.',
    author: 'Juan P.',
    role: 'Dueño, Pizzería Don Juan',
    avatar: '👨‍🍳',
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-32 px-4">
      <div className="container-xl max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Lo que dicen
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Historias reales de restaurantes que crecen con nami.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="card p-6 space-y-4"
            >
              {/* Rating */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-lg italic text-slate-700 dark:text-slate-300">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="text-3xl mb-2">{testimonial.avatar}</div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {testimonial.author}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 7. FORMULARIO (Lead Capture)

```tsx
// components/ContactForm.tsx

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const formSchema = z.object({
  restaurantName: z.string().min(3, 'Mínimo 3 caracteres'),
  ownerName: z.string().min(3, 'Mínimo 3 caracteres'),
  whatsapp: z.string().regex(/^\+57\d{10}$/, 'Formato: +573001234567'),
  plan: z.enum(['free', 'plus', 'pro']),
})

type FormData = z.infer<typeof formSchema>

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setSubmitted(true)
        reset()
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <section id="contact" className="py-20 md:py-32 px-4 bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-orange-950/10 dark:via-slate-900 dark:to-purple-950/10">
      <div className="container-xl max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Sé uno de los primeros
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Registra tu restaurante ahora. Acceso prioritario en tu ciudad.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 dark:bg-green-950/30 border-2 border-green-500 rounded-xl p-8 text-center space-y-4"
          >
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">
              ¡Perfecto! 🎉
            </h3>
            <p className="text-green-600 dark:text-green-300">
              Tu solicitud fue registrada. Te contactaremos en 2 semanas con tu código de acceso.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg space-y-4 border border-slate-200 dark:border-slate-700"
          >
            
            {/* Restaurant Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre del restaurante
              </label>
              <input
                type="text"
                placeholder="Ej: El Clásico Hamburguesas"
                {...register('restaurantName')}
                className="input-base"
              />
              {errors.restaurantName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.restaurantName.message}
                </p>
              )}
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tu nombre completo
              </label>
              <input
                type="text"
                placeholder="Ej: Juan Pérez"
                {...register('ownerName')}
                className="input-base"
              />
              {errors.ownerName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ownerName.message}
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium mb-2">
                WhatsApp (+57)
              </label>
              <input
                type="tel"
                placeholder="+573001234567"
                {...register('whatsapp')}
                className="input-base"
              />
              {errors.whatsapp && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.whatsapp.message}
                </p>
              )}
            </div>

            {/* Plan */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Plan de interés
              </label>
              <select
                {...register('plan')}
                className="input-base"
              >
                <option value="">Elige un plan</option>
                <option value="free">Gratis</option>
                <option value="plus">Plus ($19.900/mes)</option>
                <option value="pro">Pro ($60.000/mes)</option>
              </select>
              {errors.plan && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.plan.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 mt-6"
            >
              {isSubmitting ? 'Enviando...' : 'Solicitar acceso →'}
            </button>

            <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
              Nos pondremos en contacto en máximo 2 semanas con tu código de acceso.
            </p>
          </motion.form>
        )}
      </div>
    </section>
  )
}
```

### 8. FAQ (Accordion)

```tsx
// components/FAQ.tsx

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: '¿Cuándo llega nami a mi ciudad?',
    answer: 'Estamos en fase de piloto en Yumbo, Palmira y Cali. Pronto llega a más ciudades. Registra tu restaurante para acceso prioritario.',
  },
  {
    question: '¿Cuánto cuesta? ¿Hay comisión?',
    answer: 'Plan Gratis: $0 y 0% comisión. Plan Plus: $19.900/mes con 0% comisión. Plan Pro: $60.000/mes con 2% comisión (opcional).',
  },
  {
    question: '¿Cómo recibo los pedidos?',
    answer: 'Directamente en tu WhatsApp. Cuando un cliente ordena, recibes un mensaje con los detalles. Tú confirmas, preparas y entregas.',
  },
  {
    question: '¿Tengo que cambiar mi forma de trabajar?',
    answer: 'No. nami se adapta a ti. Sigues trabajando igual. Solo apareces en un lugar donde más gente te encuentra.',
  },
  {
    question: '¿Qué pasa con mis datos?',
    answer: 'Tus datos y los de tus clientes son privados. nami es un puente, no un controlador. Tú eres dueño de tu relación con el cliente.',
  },
]

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 md:py-32 px-4 bg-slate-50 dark:bg-slate-900/50">
      <div className="container-xl max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Todo lo que necesitas saber sobre nami.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="card"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-left">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIdx === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                </motion.div>
              </button>

              {openIdx === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-slate-200 dark:border-slate-700"
                >
                  <p className="p-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 9. FOOTER

```tsx
// components/Footer.tsx

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Github, Twitter, Instagram, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-100 border-t border-slate-800">
      <div className="container-xl py-16 md:py-20">
        
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center space-y-4"
        >
          <h3 className="text-3xl font-bold">¿Listo para crecer?</h3>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Únete a los restaurantes que ya están usando nami
          </p>
          <a href="#contact" className="btn-primary inline-block">
            Solicitar acceso →
          </a>
        </motion.div>

        <div className="border-t border-slate-800 pt-16">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            
            {/* Brand */}
            <div>
              <h4 className="text-2xl font-bold mb-4">🍔 nami</h4>
              <p className="text-slate-400 text-sm">
                Comida real. Sin intermediarios.
              </p>
            </div>

            {/* Links */}
            <div>
              <h5 className="font-semibold mb-4">Producto</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#product" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#plans" className="hover:text-white transition">Planes</Link></li>
                <li><Link href="#restaurants" className="hover:text-white transition">Para restaurantes</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Empresa</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contacto</Link></li>
                <li><Link href="#" className="hover:text-white transition">Trabajos</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#" className="hover:text-white transition">Privacidad</Link></li>
                <li><Link href="#" className="hover:text-white transition">Términos</Link></li>
                <li><Link href="#" className="hover:text-white transition">Cookies</Link></li>
              </ul>
            </div>
          </div>

          {/* Social & Copyright */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              © 2026 nami. Hecho con ❤️ en Colombia.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Github, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400 transition"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

---

## 🎬 LANDING PAGE COMPLETA

```tsx
// app/page.tsx

import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { ProblemSolution } from '@/components/ProblemSolution'
import { Features } from '@/components/Features'
import { Plans } from '@/components/Plans'
import { Testimonials } from '@/components/Testimonials'
import { ContactForm } from '@/components/ContactForm'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-white dark:bg-slate-950">
      <Navbar />
      <Hero />
      <ProblemSolution />
      <Features />
      <Plans />
      <Testimonials />
      <ContactForm />
      <FAQ />
      <Footer />
    </main>
  )
}
```

---

## 🚀 DEPLOYMENT

```bash
# Build
npm run build

# Test locally
npm run dev

# Deploy a Vercel
vercel

# Configurar variables env en Vercel:
NEXT_PUBLIC_FORMSPREE_ID=your_form_id
```

---

**Documento completado:** 26 marzo 2026
**Versión:** 3.0 Premium
**Status:** Listo para implementación

