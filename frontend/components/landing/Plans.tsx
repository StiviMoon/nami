'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

type PlanStyle = 'default' | 'highlight' | 'dark';

interface Plan {
  name: string;
  icon: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  style: PlanStyle;
  cta: string;
  ctaHref: string;
}

const plans: Plan[] = [
  {
    name: 'Gratis',
    icon: '🎁',
    price: '$0',
    period: '/mes',
    desc: 'Perfecto para empezar',
    features: [
      'Perfil en ÑAMI',
      'Menú hasta 20 items',
      'Pedidos por WhatsApp',
      'Link propio',
    ],
    style: 'default',
    cta: 'Empezar gratis',
    ctaHref: '/register',
  },
  {
    name: 'Pro',
    icon: '🚀',
    price: '$29.900',
    period: '/mes',
    desc: 'Recomendado para crecer',
    features: [
      'Todo del plan Gratis',
      'Menú ilimitado',
      'Destacado en feed',
      'QR descargable',
      'Prioridad en búsquedas',
      'Métricas del negocio',
    ],
    style: 'highlight',
    cta: 'Comenzar con Pro',
    ctaHref: '/contacto?plan=pro&from=landing',
  },
  {
    name: 'Business',
    icon: '👑',
    price: '$79.900',
    period: '/mes',
    desc: 'Para negocios grandes',
    features: [
      'Todo del plan Pro',
      'Múltiples sucursales',
      'API para POS',
      'Reportes avanzados',
      'Soporte prioritario',
    ],
    style: 'dark',
    cta: 'Contactar ventas',
    ctaHref: '/contacto?plan=business&from=landing',
  },
];

export function Plans() {
  return (
    <section id="planes" className="py-16 sm:py-20 md:py-28 lg:py-32 relative">
      <div className="absolute inset-0 bg-n-50/50 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-3"
        >
          Planes y precios
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display font-bold text-3xl sm:text-4xl md:text-[2.35rem] lg:text-[2.6rem] leading-[1.12] tracking-tight text-center text-n-900 mb-4 md:mb-5 px-2"
        >
          Sin{' '}
          <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            letra chiquita
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-n-400 max-w-md mx-auto mb-10 md:mb-12 lg:mb-14 text-sm md:text-[15px] px-2"
        >
          Comienza gratis y escala cuando tu negocio lo pida. Precios en COP.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 items-stretch max-w-5xl xl:max-w-none mx-auto">
          {plans.map((plan, i) => {
            const isHighlight = plan.style === 'highlight';
            const isDark = plan.style === 'dark';

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`relative rounded-[1.25rem] md:rounded-[1.4rem] p-5 sm:p-6 md:p-7 flex flex-col border transition-all duration-300 ${
                  isHighlight
                    ? 'bg-linear-to-br from-primary to-primary-dark border-primary/30 shadow-[0_12px_40px_-8px_rgba(255,122,0,0.3)] xl:scale-[1.03] z-10'
                    : isDark
                    ? 'bg-n-900 border-n-700/40'
                    : 'bg-white border-n-200/60 hover:border-primary/30 hover:shadow-[0_8px_40px_-12px_rgba(255,122,0,0.10)]'
                }`}
              >
                {isHighlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary text-[11px] font-bold px-4 py-1.5 rounded-full shadow-sm border border-primary/20 tracking-wide uppercase">
                    Más popular
                  </span>
                )}

                <div className="text-2xl mb-3">{plan.icon}</div>

                <h3 className={`font-display font-bold text-lg mb-0.5 ${isHighlight || isDark ? 'text-white' : 'text-n-900'}`}>
                  {plan.name}
                </h3>

                <p className={`text-[13px] mb-5 ${isHighlight ? 'text-white/65' : isDark ? 'text-n-400' : 'text-n-400'}`}>
                  {plan.desc}
                </p>

                <div className="mb-6">
                  <span className={`font-display font-bold text-[2rem] tracking-tight ${isHighlight || isDark ? 'text-white' : 'text-n-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ml-0.5 ${isHighlight ? 'text-white/50' : isDark ? 'text-n-500' : 'text-n-400'}`}>
                    {plan.period}
                  </span>
                </div>

                <div className="space-y-3 mb-7 flex-1">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center ${
                        isHighlight ? 'bg-white/15' : isDark ? 'bg-primary/15' : 'bg-primary/8'
                      }`}>
                        <Check size={11} className={isHighlight ? 'text-white' : 'text-primary'} />
                      </span>
                      <span className={`text-[13px] leading-snug ${
                        isHighlight ? 'text-white/80' : isDark ? 'text-n-300' : 'text-n-500'
                      }`}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.ctaHref}
                  className={`cursor-pointer block w-full py-3 rounded-xl font-semibold text-[13px] text-center transition-all duration-300 mt-auto active:scale-[0.98] ${
                    isHighlight
                      ? 'bg-white text-primary hover:bg-n-50 shadow-sm'
                      : isDark
                      ? 'bg-primary text-white hover:bg-primary-dark hover:shadow-[0_4px_20px_rgba(255,122,0,0.3)]'
                      : 'bg-n-100 text-n-700 hover:bg-n-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
