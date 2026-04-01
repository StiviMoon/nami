'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/motion';
import { UtensilsCrossed, Image, Clock, QrCode, ArrowRight, Check, Rocket } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: Rocket,
    title: '¡Tu restaurante está listo!',
    description: 'Ya tienes tu página pública con menú digital. Ahora personalízala para atraer más clientes.',
    color: 'text-[#E85D04] bg-orange-50',
  },
  {
    icon: Image,
    title: 'Sube tu logo y portada',
    description: 'Una buena imagen hace la diferencia. Los restaurantes con fotos reciben 3x más visitas.',
    href: '/dashboard/perfil',
    cta: 'Ir al perfil',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    icon: UtensilsCrossed,
    title: 'Agrega tu menú',
    description: 'Crea categorías (Entradas, Platos fuertes, Bebidas...) y agrega tus items con precios.',
    href: '/dashboard/menu',
    cta: 'Ir al menú',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Clock,
    title: 'Configura tus horarios',
    description: 'Así tus clientes sabrán cuándo estás abierto. Se muestra automáticamente en tu página.',
    href: '/dashboard/perfil',
    cta: 'Configurar horarios',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: QrCode,
    title: 'Comparte tu QR',
    description: 'Descarga tu código QR e imprímelo. Pégalo en la puerta, mesas o volantes.',
    href: '/dashboard/qr',
    cta: 'Ver QR',
    color: 'text-amber-600 bg-amber-50',
  },
];

export default function BienvenidaPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <PageTransition>
      <div className="max-w-lg mx-auto py-8">
        {/* Progress */}
        <div className="flex gap-1.5 mb-10">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= currentStep ? 'bg-[#E85D04]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className={`w-20 h-20 rounded-3xl ${step.color} flex items-center justify-center mx-auto mb-6`}>
              <step.icon className="w-9 h-9" />
            </div>

            <h1 className="text-3xl font-black text-gray-900 mb-3">{step.title}</h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto mb-8">
              {step.description}
            </p>

            <div className="flex flex-col gap-3">
              {step.href && (
                <Link href={step.href}>
                  <Button className="w-full py-3.5" size="lg">
                    {step.cta} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}

              <div className="flex gap-3 justify-center">
                {currentStep > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep((s) => s - 1)}
                  >
                    Anterior
                  </Button>
                )}
                {isLast ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      localStorage.setItem('nami_onboarded', '1');
                      router.push('/dashboard');
                    }}
                  >
                    <Check className="w-4 h-4 mr-1" /> Ir al dashboard
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep((s) => s + 1)}
                  >
                    {currentStep === 0 ? 'Comenzar' : 'Siguiente'} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>

              {currentStep > 0 && !isLast && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('nami_onboarded', '1');
                    router.push('/dashboard');
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  Saltar, ya lo haré después
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
