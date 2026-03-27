'use client';

import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { AnimatedNumber } from '@/components/motion';
import { motion } from 'framer-motion';
import { PhoneMockup } from './PhoneMockup';

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-primary/[0.07] blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-accent/[0.08] blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-[300px] h-[300px] rounded-full bg-accent/[0.05] blur-[80px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(var(--color-n-900) 1px, transparent 1px), linear-gradient(90deg, var(--color-n-900) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-28 pb-16 md:pt-36 md:pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              custom={0}
              variants={fade}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/[0.08] border border-primary/20 mb-8"
            >
              <Zap size={13} className="text-primary" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-primary">
                Lanzamiento Yumbo 2026
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fade}
              initial="hidden"
              animate="show"
              className="font-display font-bold text-[2.6rem] leading-[1.08] md:text-[3.8rem] md:leading-[1.05] tracking-tight text-n-900"
            >
              Que te{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                encuentren
              </span>{' '}
              y pidan directo por WhatsApp
            </motion.h1>

            <motion.p
              custom={2}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-6 text-lg md:text-[1.2rem] text-n-500 leading-relaxed max-w-[480px]"
            >
              ÑAMI no cobra comisión. Los clientes te encuentran, piden por WhatsApp
              y te pagan a ti. Sin intermediarios que se queden con tu ganancia.
            </motion.p>

            <motion.div
              custom={3}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-10 flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/feed"
                className="cursor-pointer group relative px-7 py-4 rounded-2xl bg-primary text-white font-semibold text-[15px] transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(255,122,0,0.45)] active:scale-[0.98] inline-flex items-center justify-center gap-2"
              >
                Explorar restaurantes
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/register"
                className="cursor-pointer px-7 py-4 rounded-2xl border border-n-200 text-n-600 font-medium text-[15px] hover:bg-n-50 hover:border-n-300 transition-all duration-300 active:scale-[0.98] inline-flex items-center justify-center"
              >
                Registrar mi restaurante
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              custom={4}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-12 flex items-center gap-8"
            >
              {[
                { num: 50, suffix: '+', label: 'Restaurantes' },
                { num: 0, suffix: '%', label: 'Comisión' },
                { num: 10, suffix: 's', label: 'Para pedir' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display font-bold text-xl text-n-900">
                    <AnimatedNumber value={s.num} suffix={s.suffix} />
                  </p>
                  <p className="text-xs text-n-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
