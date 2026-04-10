'use client';

import { Utensils, Smartphone, MessageCircle, MapPin, TrendingUp, BarChart3 } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/motion';
import { motion } from 'framer-motion';

const howItWorks = [
  {
    num: '01',
    icon: Utensils,
    title: 'Descubre',
    desc: 'Navega el feed de restaurantes locales. Filtra por categoría y encuentra nuevos lugares cerca de ti.',
    color: 'bg-orange-50 text-orange-500',
    border: 'border-orange-100',
  },
  {
    num: '02',
    icon: Smartphone,
    title: 'Elige y arma',
    desc: 'Ve el menú completo con fotos y precios. Agrega lo que quieras a tu carrito con un toque.',
    color: 'bg-purple-50 text-purple-500',
    border: 'border-purple-100',
  },
  {
    num: '03',
    icon: MessageCircle,
    title: 'Pide por WhatsApp',
    desc: 'Con un clic tu pedido se envía directo al restaurante por WhatsApp. Así de fácil.',
    color: 'bg-emerald-50 text-emerald-500',
    border: 'border-emerald-100',
  },
];

const forRestaurants = [
  {
    icon: MapPin,
    title: 'Visibilidad total',
    desc: 'Aparece en el feed de nami. Clientes nuevos te encuentran todos los días sin esfuerzo.',
    bg: 'bg-primary/5',
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    icon: TrendingUp,
    title: 'Menú digital',
    desc: 'Un menú profesional con fotos, precios y categorías. Actualízalo en tiempo real cuando quieras.',
    bg: 'bg-accent/5',
    iconBg: 'bg-accent/10 text-accent',
  },
  {
    icon: BarChart3,
    title: 'Cero comisiones',
    desc: 'Tú recibes el pedido, tú cobras, tú manejas al cliente. nami no se queda con nada.',
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
];

export function Features() {
  return (
    <>
      {/* How it works */}
      <section id="features" className="py-16 sm:py-20 md:py-24 px-4 sm:px-5 md:px-6 bg-n-50">
        <div className="max-w-6xl mx-auto">
          <StaggerContainer className="text-center mb-10 md:mb-14 lg:mb-16">
            <StaggerItem>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3">Cómo funciona</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight px-2">Tres pasos, tu pedido listo</h2>
            </StaggerItem>
            <StaggerItem>
              <p className="text-n-500 max-w-xl mx-auto mt-3 md:mt-4 text-base md:text-lg px-2">Sin registros, sin apps, sin complicaciones</p>
            </StaggerItem>
          </StaggerContainer>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 relative">
            {/* Connector line — solo 3 columnas */}
            <div className="hidden lg:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-linear-to-r from-orange-200 via-purple-200 to-emerald-200 z-0" />

            {howItWorks.map((f, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-7 border ${f.border} h-full relative z-10`}
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center shrink-0`}>
                      <f.icon className="w-6 h-6" />
                    </div>
                    <span className="text-5xl font-display font-bold text-n-100 leading-none mt-1">{f.num}</span>
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2 text-n-900">{f.title}</h3>
                  <p className="text-n-500 leading-relaxed text-sm">{f.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* For restaurants */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-5 md:px-6">
        <div className="max-w-6xl mx-auto">
          <StaggerContainer className="text-center mb-10 md:mb-14 lg:mb-16">
            <StaggerItem>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3">Para negocios</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight px-2">
                Tu restaurante en digital,
                <br />
                en minutos
              </h2>
            </StaggerItem>
            <StaggerItem>
              <p className="text-n-500 max-w-xl mx-auto mt-3 md:mt-4 text-base md:text-lg px-2">Todo lo que necesitas para digitalizar tu negocio hoy</p>
            </StaggerItem>
          </StaggerContainer>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {forRestaurants.map((f, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`${f.bg} rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-7 h-full`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${f.iconBg} flex items-center justify-center mb-5`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2 text-n-900">{f.title}</h3>
                  <p className="text-n-500 leading-relaxed text-sm">{f.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
