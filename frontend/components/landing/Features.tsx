'use client';

import { Utensils, Smartphone, MessageCircle, MapPin, TrendingUp, BarChart3 } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/motion';
import { motion } from 'framer-motion';
import { cardHover } from '@/components/motion/variants';

const howItWorks = [
  { icon: Utensils, title: 'Descubre', desc: 'Navega el feed de restaurantes locales. Filtra por categoría y encuentra nuevos lugares.' },
  { icon: Smartphone, title: 'Elige y arma', desc: 'Ve el menú completo con fotos y precios. Agrega lo que quieras a tu carrito.' },
  { icon: MessageCircle, title: 'Pide por WhatsApp', desc: 'Con un clic, tu pedido se envía directo al restaurante por WhatsApp. Así de fácil.' },
];

const forRestaurants = [
  { icon: MapPin, title: 'Visibilidad total', desc: 'Aparece en el feed de ÑAMI. Clientes nuevos te encuentran todos los días.' },
  { icon: TrendingUp, title: 'Menú digital', desc: 'Un menú profesional con fotos, precios y categorías. Actualízalo cuando quieras.' },
  { icon: BarChart3, title: 'Cero comisiones', desc: 'Tú recibes el pedido, tú cobras, tú manejas al cliente. ÑAMI no se queda con nada.' },
];

export function Features() {
  return (
    <>
      {/* How it works */}
      <section id="features" className="py-24 px-4 bg-n-50">
        <div className="max-w-6xl mx-auto">
          <StaggerContainer className="text-center mb-16">
            <StaggerItem>
              <h2 className="text-4xl font-display font-bold mb-4">¿Cómo funciona?</h2>
            </StaggerItem>
            <StaggerItem>
              <p className="text-n-500 max-w-xl mx-auto">Tres pasos simples para encontrar y pedir tu comida favorita</p>
            </StaggerItem>
          </StaggerContainer>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((f, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={cardHover}
                  className="bg-white rounded-3xl p-8 border border-n-100 h-full"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <f.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">{f.title}</h3>
                  <p className="text-n-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* For restaurants */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <StaggerContainer className="text-center mb-16">
            <StaggerItem>
              <h2 className="text-4xl font-display font-bold mb-4">Para restaurantes</h2>
            </StaggerItem>
            <StaggerItem>
              <p className="text-n-500 max-w-xl mx-auto">Todo lo que necesitas para digitalizar tu negocio en minutos</p>
            </StaggerItem>
          </StaggerContainer>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {forRestaurants.map((f, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={cardHover}
                  className="bg-n-50 rounded-3xl p-8 h-full transition-colors hover:bg-primary/5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <f.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">{f.title}</h3>
                  <p className="text-n-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
