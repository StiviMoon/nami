"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const problems = [
  "Clientes solo por recomendación",
  "Google Maps desactualizado en tu zona",
  "Sin datos de quien te pide ni cuando",
  "Otras plataformas te cobra hasta 30% de comisión a tu negocio",
  "No sabes quién te pide, cuándo piden, qué prefieren",
];

const solutions = [
  "Clientes nuevos te encuentran automáticamente en la plataforma",
  "Información siempre actualizada y precisa",
  "Dashboard con analytics de tu negocio para crecer",
  "ÑAMI no te cobra comisión — pedidos llegan directamente a tu WhatsApp",
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ProblemSolution() {
  return (
    <section className="py-24 md:py-32 relative">
      {/* Subtle bg */}
      <div className="absolute inset-0 bg-n-50/50 dark:bg-n-900/30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-[11px] font-semibold tracking-[0.2em] uppercase text-nami-orange mb-3"
        >
          El problema y la solucion
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display font-800 text-3xl md:text-[2.6rem] leading-[1.1] tracking-[-0.02em] text-center text-n-900 dark:text-n-0 mb-16"
        >
          De invisible a{" "}
          <span className="bg-gradient-to-r from-nami-orange to-nami-purple bg-clip-text text-transparent">
            imperdible
          </span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Problem */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="bg-n-0 dark:bg-n-800/40 border border-n-200/60 dark:border-n-700/40 rounded-[1.6rem] p-7 md:p-9"
          >
            <h3 className="font-display font-700 text-lg md:text-xl text-n-900 dark:text-n-0 mb-7">
              Por que no te encuentran?
            </h3>
            <div className="space-y-4">
              {problems.map((t) => (
                <motion.div key={t} variants={item} className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                    <X size={13} className="text-red-500" />
                  </span>
                  <p className="text-[14px] leading-relaxed text-n-500 dark:text-n-400">
                    {t}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solution */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="relative bg-gradient-to-br from-n-900 to-n-800 dark:from-n-800 dark:to-n-900 border border-n-700/40 rounded-[1.6rem] p-7 md:p-9 overflow-hidden"
          >
            {/* Decorative glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-nami-orange/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-nami-purple/10 rounded-full blur-[50px] pointer-events-none" />

            <h3 className="relative font-display font-700 text-lg md:text-xl text-n-0 mb-7">
              NAMI lo resuelve
            </h3>
            <div className="relative space-y-4">
              {solutions.map((t) => (
                <motion.div key={t} variants={item} className="flex items-start gap-3.5">
                  <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg bg-nami-orange/15 flex items-center justify-center">
                    <Check size={13} className="text-nami-orange" />
                  </span>
                  <p className="text-[14px] leading-relaxed text-n-300">
                    {t}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
