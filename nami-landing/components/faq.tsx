"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Cuando sale NAMI en mi ciudad?",
    a: "Estamos en fase de piloto en Yumbo y Palmira, Valle del Cauca. Si te registras ahora, seras de los primeros en tener acceso cuando lancemos en tu zona. Planeamos expandirnos a Cali y otras ciudades de Colombia en los proximos meses.",
  },
  {
    q: "¿ÑAMI me cobra comisión por cada pedido?",
    a: "No. En los planes Gratis y Plus, ÑAMI no te cobra ninguna comisión. Los pedidos llegan directo a tu WhatsApp y el cliente te paga a ti. En el plan Pro hay una comisión opcional de ÑAMI (2-3%) solo si activas pagos integrados.",
  },
  {
    q: "Como recibo los pedidos?",
    a: "Directamente en tu WhatsApp. Cuando un cliente te encuentra en NAMI y hace clic en pedir, se abre una conversacion contigo. Tu manejas todo: confirmas, despachas y cobras.",
  },
  {
    q: "Necesito cambiar mis operaciones?",
    a: "No. NAMI se adapta a como ya trabajas. Si ya usas WhatsApp para pedidos, perfecto. Solo necesitas registrarte, subir tu menu y listo. En menos de 10 minutos estas visible para nuevos clientes.",
  },
  {
    q: "Que pasa con mis datos?",
    a: "Tus datos son tuyos y son privados. No los vendemos ni los compartimos con terceros. De hecho, con NAMI tu eres quien recibe los datos de tus clientes para entender mejor tu negocio.",
  },
];

function FaqItem({
  q,
  a,
  open,
  onClick,
}: {
  q: string;
  a: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-n-100 dark:border-n-800 last:border-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 text-left group transition-colors duration-200"
        aria-expanded={open}
      >
        <span
          className={cn(
            "font-display font-600 text-[15px] md:text-base pr-4 transition-colors duration-200",
            open
              ? "text-nami-orange"
              : "text-n-900 dark:text-n-0 group-hover:text-nami-orange"
          )}
        >
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex-shrink-0 text-n-300 dark:text-n-600"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[14px] leading-relaxed text-n-500 dark:text-n-400 max-w-2xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-n-50/50 dark:bg-n-900/30 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-5 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-[11px] font-semibold tracking-[0.2em] uppercase text-nami-orange mb-3"
        >
          Preguntas frecuentes
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display font-800 text-3xl md:text-[2.6rem] leading-[1.1] tracking-[-0.02em] text-center text-n-900 dark:text-n-0 mb-12"
        >
          Resolvemos tus{" "}
          <span className="bg-gradient-to-r from-nami-orange to-nami-purple bg-clip-text text-transparent">
            dudas
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-n-0 dark:bg-n-800/20 border border-n-200/60 dark:border-n-700/40 rounded-[1.4rem] px-6 md:px-8 py-2"
        >
          {faqs.map((faq, i) => (
            <FaqItem
              key={i}
              q={faq.q}
              a={faq.a}
              open={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
