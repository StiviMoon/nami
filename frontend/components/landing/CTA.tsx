'use client';

import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';

export function CTA() {
  return (
    <section className="py-24 px-4 bg-primary relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <StaggerContainer className="max-w-3xl mx-auto text-center text-white relative z-10">
        <StaggerItem>
          <h2 className="text-4xl font-display font-bold mb-6">¿Listo para descubrir?</h2>
        </StaggerItem>
        <StaggerItem>
          <p className="text-xl opacity-90 mb-10">Explora los restaurantes de Yumbo o registra tu negocio.</p>
        </StaggerItem>
        <StaggerItem>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/feed"
              className="bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:bg-n-50 transition-colors active:scale-[0.97]"
            >
              Ver restaurantes
            </Link>
            <Link
              href="/register"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors active:scale-[0.97]"
            >
              Soy restaurante
            </Link>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
}
