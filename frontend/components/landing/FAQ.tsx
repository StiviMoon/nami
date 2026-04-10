'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '@/components/motion';
import { Plus } from 'lucide-react';

const faqs = [
  { q: '¿nami cobra comisión por pedido?', a: 'No. nami no cobra por pedido ni retiene dinero. El restaurante recibe directamente por WhatsApp y cobra como prefiera.' },
  { q: '¿Cómo recibo los pedidos?', a: 'Los clientes envían su pedido por WhatsApp directamente a tu número. Tú confirmas, preparas y despachas.' },
  { q: '¿Necesito descargar una app?', a: 'No. nami funciona desde el navegador. Solo necesitas un celular con WhatsApp.' },
  { q: '¿Puedo cambiar mi menú en cualquier momento?', a: 'Sí. Desde tu dashboard puedes agregar, editar o desactivar items cuando quieras.' },
  { q: '¿En qué ciudades está disponible?', a: 'Actualmente en Yumbo, Valle del Cauca. Pronto expandiremos a Palmira y Cali.' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-n-200 py-4 sm:py-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 text-left sm:min-h-0 sm:gap-4"
      >
        <span className="font-display font-semibold text-base sm:text-lg text-n-900 pr-2">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center"
        >
          <Plus className="w-4 h-4" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-n-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="py-16 sm:py-20 md:py-24 px-4 sm:px-5 md:px-6">
      <div className="max-w-3xl mx-auto">
        <FadeIn className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight px-2">
            Preguntas frecuentes
          </h2>
        </FadeIn>
        {faqs.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} />
        ))}
      </div>
    </section>
  );
}
