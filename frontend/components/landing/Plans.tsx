'use client';

import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';
import { motion } from 'framer-motion';
import { cardHover } from '@/components/motion/variants';
import { Check, X } from 'lucide-react';

const free = [
  { text: 'Perfil en ÑAMI', ok: true },
  { text: 'Menú digital (hasta 10 items)', ok: true },
  { text: 'Link propio (nami.app/tu-restaurante)', ok: true },
  { text: 'Pedidos por WhatsApp', ok: true },
  { text: 'QR descargable', ok: false },
  { text: 'Prioridad en feed', ok: false },
];

const pro = [
  'Todo del plan Gratis',
  'Menú ilimitado',
  'Destacado en el feed',
  'QR descargable',
  'Prioridad en búsquedas',
  'Métricas del negocio',
];

export function Plans() {
  return (
    <section id="planes" className="py-24 px-4 bg-n-50">
      <div className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold">Planes simples</h2>
        </FadeIn>

        <StaggerContainer className="grid md:grid-cols-2 gap-8">
          {/* Free */}
          <StaggerItem>
            <motion.div whileHover={cardHover} className="bg-white rounded-3xl p-8 border border-n-200 h-full flex flex-col">
              <h3 className="font-display font-bold text-2xl mb-2">Gratis</h3>
              <p className="text-4xl font-display font-bold mb-6">
                $0 <span className="text-base text-n-400 font-normal">/mes</span>
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {free.map((f, i) => (
                  <li key={i} className={`flex items-center gap-2 ${f.ok ? 'text-n-600' : 'text-n-300'}`}>
                    {f.ok ? (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-n-300 shrink-0" />
                    )}
                    {f.text}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center border-2 border-n-200 text-n-700 px-6 py-3 rounded-2xl font-semibold hover:border-primary hover:text-primary transition-all active:scale-[0.97]"
              >
                Empezar gratis
              </Link>
            </motion.div>
          </StaggerItem>

          {/* Pro */}
          <StaggerItem>
            <div className="relative">
              <div className="absolute -inset-[1px] bg-gradient-to-br from-primary via-accent to-primary rounded-3xl opacity-75 blur-[1px] animate-pulse" />
              <div className="relative bg-primary rounded-3xl p-8 text-white h-full flex flex-col">
                <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                  Popular
                </div>
                <h3 className="font-display font-bold text-2xl mb-2">Pro</h3>
                <p className="text-4xl font-display font-bold mb-6">
                  $29.900 <span className="text-base opacity-70 font-normal">/mes</span>
                </p>
                <ul className="space-y-3 mb-8 opacity-90 flex-1">
                  {pro.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-white/80 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="block text-center bg-white text-primary px-6 py-3 rounded-2xl font-bold hover:bg-n-50 transition-colors active:scale-[0.97]"
                >
                  Comenzar con Pro
                </Link>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
