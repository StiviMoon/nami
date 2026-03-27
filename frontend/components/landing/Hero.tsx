'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { StaggerContainer, StaggerItem, AnimatedNumber } from '@/components/motion';

export function Hero() {
  return (
    <section className="py-24 md:py-32 px-4 overflow-hidden">
      <StaggerContainer className="max-w-4xl mx-auto text-center">
        <StaggerItem>
          <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            🍽️ Nuevo en Yumbo
          </div>
        </StaggerItem>

        <StaggerItem>
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 text-n-900">
            ¿Qué hay de{' '}
            <span className="text-primary relative">
              comer
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C50 2 150 2 198 8" stroke="#FF7A00" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
              </svg>
            </span>{' '}
            hoy?
          </h1>
        </StaggerItem>

        <StaggerItem>
          <p className="text-xl text-n-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Descubre los mejores restaurantes locales de Yumbo.
            Ve su menú, arma tu pedido y pídelo directo por WhatsApp.
            Sin comisiones. Sin intermediarios.
          </p>
        </StaggerItem>

        <StaggerItem>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/feed"
              className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all hover:shadow-lg active:scale-[0.97] inline-flex items-center justify-center gap-2"
            >
              Explorar restaurantes <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register"
              className="border-2 border-n-200 text-n-700 px-8 py-4 rounded-2xl font-bold text-lg hover:border-primary hover:text-primary transition-all active:scale-[0.97]"
            >
              Registrar mi restaurante
            </Link>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-primary">
                <AnimatedNumber value={50} suffix="+" />
              </div>
              <p className="text-sm text-n-400 mt-1">Restaurantes</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-primary">
                <AnimatedNumber value={0} suffix="%" />
              </div>
              <p className="text-sm text-n-400 mt-1">Comisión</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-primary">
                <AnimatedNumber value={10} suffix="s" />
              </div>
              <p className="text-sm text-n-400 mt-1">Para pedir</p>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
}
