'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/motion';

export function CTA() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-5 md:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-n-900 -z-10" />
      <div className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,122,0,0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(176,136,201,0.15) 0%, transparent 50%),
                            radial-gradient(circle at 60% 80%, rgba(210,230,0,0.08) 0%, transparent 40%)`
        }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <StaggerContainer className="max-w-3xl mx-auto text-center text-white relative z-10 px-1">
        <StaggerItem>
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3 md:mb-4">Únete hoy</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-5 md:mb-6 leading-[1.15] tracking-tight">
            ¿Listo para descubrir
            <br />
            lo mejor de Yumbo?
          </h2>
        </StaggerItem>
        <StaggerItem>
          <p className="text-base md:text-lg text-n-400 mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed px-1">
            Explora restaurantes cerca de ti o registra tu negocio y llega a más clientes hoy mismo.
          </p>
        </StaggerItem>
        <StaggerItem>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/feed"
              className="cursor-pointer bg-primary text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-primary-dark transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.97] inline-flex items-center justify-center gap-2"
            >
              Ver restaurantes <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register"
              className="cursor-pointer border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/10 hover:border-white/40 transition-all active:scale-[0.97] inline-flex items-center justify-center gap-2"
            >
              Soy restaurante
            </Link>
          </div>
        </StaggerItem>

        <StaggerItem>
          <p className="text-n-500 text-sm mt-10">
            Más de 50 restaurantes ya están en nami · 100% gratis para clientes
          </p>
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
}
