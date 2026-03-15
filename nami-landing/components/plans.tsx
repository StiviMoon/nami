"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  icon: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  style: "default" | "highlight" | "dark";
}

const plans: Plan[] = [
  {
    name: "Gratis",
    icon: "🎁",
    price: "$0",
    period: "/mes",
    description: "Perfecto para empezar",
    features: [
      "Listado basico en NAMI",
      "Menu hasta 20 items",
      "Pedidos por WhatsApp",
      "Perfil de restaurante",
    ],
    style: "default",
  },
  {
    name: "Plus",
    icon: "🚀",
    price: "$19.900",
    period: "/mes",
    description: "Recomendado para crecer",
    features: [
      "Todo del plan Gratis",
      "Dashboard con analytics",
      "Menu ilimitado",
      "Fotos ilimitadas",
      "Destacar en busqueda",
      "Soporte por chat",
    ],
    style: "highlight",
  },
  {
    name: "Pro",
    icon: "👑",
    price: "$60.000",
    period: "/mes",
    description: "Para negocios grandes",
    features: [
      "Todo del plan Plus",
      "Integracion de pagos",
      "API para POS externo",
      "Reportes avanzados",
      "Comisión de ÑAMI opcional (2-3%) solo con pagos integrados",
      "Soporte prioritario",
    ],
    style: "dark",
  },
];

export default function Plans() {
  const go = () =>
    document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="planes" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-n-50/50 dark:bg-n-900/30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-[11px] font-semibold tracking-[0.2em] uppercase text-nami-orange mb-3"
        >
          Planes y precios
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display font-800 text-3xl md:text-[2.6rem] leading-[1.1] tracking-[-0.02em] text-center text-n-900 dark:text-n-0 mb-5"
        >
          Sin{" "}
          <span className="bg-gradient-to-r from-nami-orange to-nami-purple bg-clip-text text-transparent">
            letra chiquita
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-n-400 dark:text-n-500 max-w-md mx-auto mb-14 text-[15px]"
        >
          Comienza gratis y escala cuando tu negocio lo pida. Precios en COP.
        </motion.p>

        {/* Symmetric grid with equal cards */}
        <div className="grid md:grid-cols-3 gap-4 items-stretch">
          {plans.map((plan, i) => {
            const isHighlight = plan.style === "highlight";
            const isDark = plan.style === "dark";

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  "relative rounded-[1.4rem] p-7 flex flex-col border transition-all duration-400",
                  isHighlight &&
                    "bg-gradient-to-br from-nami-orange to-nami-orange-dark border-nami-orange/30 shadow-[0_12px_40px_-8px_rgba(255,122,0,0.25)] md:scale-[1.03] z-10",
                  isDark &&
                    "bg-n-900 dark:bg-n-800/60 border-n-700/40 dark:border-n-700/40",
                  !isHighlight &&
                    !isDark &&
                    "bg-n-0 dark:bg-n-800/30 border-n-200/60 dark:border-n-700/40"
                )}
              >
                {isHighlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-n-0 dark:bg-n-900 text-nami-orange text-[11px] font-bold px-4 py-1.5 rounded-full shadow-sm border border-nami-orange/20 tracking-wide uppercase">
                    Mas popular
                  </span>
                )}

                <div className="text-2xl mb-3">{plan.icon}</div>

                <h3
                  className={cn(
                    "font-display font-700 text-lg mb-0.5",
                    isHighlight || isDark
                      ? "text-n-0"
                      : "text-n-900 dark:text-n-0"
                  )}
                >
                  {plan.name}
                </h3>

                <p
                  className={cn(
                    "text-[13px] mb-5",
                    isHighlight
                      ? "text-white/65"
                      : isDark
                      ? "text-n-400"
                      : "text-n-400 dark:text-n-500"
                  )}
                >
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span
                    className={cn(
                      "font-display font-800 text-[2rem] tracking-tight",
                      isHighlight || isDark
                        ? "text-n-0"
                        : "text-n-900 dark:text-n-0"
                    )}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={cn(
                      "text-sm ml-0.5",
                      isHighlight
                        ? "text-white/50"
                        : isDark
                        ? "text-n-500"
                        : "text-n-400 dark:text-n-500"
                    )}
                  >
                    {plan.period}
                  </span>
                </div>

                <div className="space-y-3 mb-7 flex-1">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          "mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center",
                          isHighlight
                            ? "bg-white/15"
                            : isDark
                            ? "bg-nami-orange/15"
                            : "bg-nami-orange/8 dark:bg-nami-orange/12"
                        )}
                      >
                        <Check
                          size={11}
                          className={cn(
                            isHighlight
                              ? "text-white"
                              : "text-nami-orange"
                          )}
                        />
                      </span>
                      <span
                        className={cn(
                          "text-[13px] leading-snug",
                          isHighlight
                            ? "text-white/80"
                            : isDark
                            ? "text-n-300"
                            : "text-n-500 dark:text-n-400"
                        )}
                      >
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={go}
                  className={cn(
                    "w-full py-3 rounded-xl font-semibold text-[13px] transition-all duration-300 mt-auto active:scale-[0.98]",
                    isHighlight &&
                      "bg-white text-nami-orange hover:bg-n-50 shadow-sm",
                    isDark &&
                      "bg-nami-orange text-white hover:bg-nami-orange-dark hover:shadow-[0_4px_20px_rgba(255,122,0,0.3)]",
                    !isHighlight &&
                      !isDark &&
                      "bg-n-100 dark:bg-n-700 text-n-700 dark:text-n-200 hover:bg-n-200 dark:hover:bg-n-600"
                  )}
                >
                  Empezar con {plan.name}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
