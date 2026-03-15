"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, ValidationError } from "@formspree/react";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

// Formspree: https://formspree.io/f/mqeydpok — los envíos llegan al dashboard y se pueden conectar a Google Sheets (ver README o instrucciones abajo).
const FORMSPREE_FORM_ID = "mqeydpok";

// Solo dígitos para WhatsApp Colombia (9 o 10 dígitos; móvil suele ser 10 empezando en 3).
const WHATSAPP_DIGITS_MAX = 10;
const onlyDigits = (s: string) => s.replace(/\D/g, "").slice(0, WHATSAPP_DIGITS_MAX);

export default function ContactForm() {
  const [formspreeState, handleFormspree] = useForm(FORMSPREE_FORM_ID);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [whatsappDigits, setWhatsappDigits] = useState("");

  const validate = (form: HTMLFormElement): boolean => {
    const data = new FormData(form);
    const errs: Record<string, string> = {};

    const restaurantName = (data.get("restaurantName") as string)?.trim();
    const ownerName = (data.get("ownerName") as string)?.trim();
    const plan = (data.get("plan") as string)?.trim();

    if (!restaurantName || restaurantName.length < 3)
      errs.restaurantName = "Minimo 3 caracteres";
    if (!ownerName || ownerName.length < 3)
      errs.ownerName = "Minimo 3 caracteres";
    const digits = whatsappDigits.trim();
    if (digits.length < 10)
      errs.whatsapp = "Ingresa los 10 dígitos de tu celular (ej: 3235018878)";
    else if (!/^3\d{9}$/.test(digits))
      errs.whatsapp = "Número móvil Colombia: debe empezar en 3 (ej: 300, 323, 350)";
    if (!plan) errs.plan = "Selecciona un plan";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validate(form)) return;
    await handleFormspree(e);
  };

  const inputBase =
    "w-full px-4 py-3.5 rounded-xl bg-n-0 dark:bg-n-800/60 border text-[14px] text-n-900 dark:text-n-0 placeholder:text-n-300 dark:placeholder:text-n-600 transition-all duration-200 outline-none";
  const inputOk =
    "border-n-200 dark:border-n-700 focus:border-nami-orange dark:focus:border-nami-orange focus:ring-2 focus:ring-nami-orange/10";
  const inputErr =
    "border-red-400 dark:border-red-500/60 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-500/10";

  return (
    <section id="contacto" className="py-24 md:py-32 relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-nami-orange/[0.04] dark:bg-nami-orange/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 md:px-8">
        <div className="max-w-md mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-center text-[11px] font-semibold tracking-[0.2em] uppercase text-nami-orange mb-3"
          >
            Registro anticipado
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display font-800 text-3xl md:text-[2.6rem] leading-[1.1] tracking-[-0.02em] text-center text-n-900 dark:text-n-0 mb-4"
          >
            Se uno de los{" "}
            <span className="bg-gradient-to-r from-nami-orange to-nami-purple bg-clip-text text-transparent">
              primeros
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center text-n-400 dark:text-n-500 mb-10 text-[15px]"
          >
            Registra tu restaurante o negocio de comida y recibe pedidos directos por WhatsApp. ÑAMI no te cobra comisión en planes Gratis y Plus.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              {formspreeState.succeeded ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 dark:bg-green-500/5 border border-green-200 dark:border-green-500/15 rounded-[1.4rem] p-10 text-center"
                >
                  <CheckCircle2
                    size={44}
                    className="text-green-500 mx-auto mb-4"
                  />
                  <h3 className="font-display font-700 text-xl text-n-900 dark:text-n-0 mb-2">
                    Perfecto!
                  </h3>
                  <p className="text-[14px] text-n-500 dark:text-n-400">
                    Tu solicitud fue registrada. Te contactaremos pronto con
                    acceso prioritario a NAMI.
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" exit={{ opacity: 0 }}>
                  <div className="bg-n-0 dark:bg-n-800/30 border border-n-200/60 dark:border-n-700/40 rounded-[1.4rem] p-7 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] dark:shadow-none">
                    <form onSubmit={onSubmit} className="space-y-4" noValidate>
                      {/* Restaurant name */}
                      <div>
                        <label className="block text-[13px] font-medium text-n-700 dark:text-n-200 mb-1.5">
                          Nombre del restaurante
                        </label>
                        <input
                          name="restaurantName"
                          type="text"
                          placeholder="Ej: El Clasico Hamburguesas"
                          className={cn(
                            inputBase,
                            errors.restaurantName ? inputErr : inputOk
                          )}
                        />
                        {errors.restaurantName && (
                          <p className="mt-1 text-[12px] text-red-500">
                            {errors.restaurantName}
                          </p>
                        )}
                      </div>

                      {/* Owner */}
                      <div>
                        <label className="block text-[13px] font-medium text-n-700 dark:text-n-200 mb-1.5">
                          Tu nombre
                        </label>
                        <input
                          name="ownerName"
                          type="text"
                          placeholder="Tu nombre completo"
                          className={cn(inputBase, errors.ownerName ? inputErr : inputOk)}
                        />
                        {errors.ownerName && (
                          <p className="mt-1 text-[12px] text-red-500">
                            {errors.ownerName}
                          </p>
                        )}
                      </div>

                      {/* WhatsApp — +57 fijo, bandera Colombia, usuario solo escribe el número */}
                        <div>
                          <label className="block text-[13px] font-medium text-n-700 dark:text-n-200 mb-1.5">
                            WhatsApp
                          </label>
                          <div
                            className={cn(
                              "flex items-center gap-4 rounded-xl border bg-n-0 dark:bg-n-800/60 overflow-hidden transition-all duration-200",
                              errors.whatsapp ? "border-red-400 dark:border-red-500/60 ring-2 ring-red-100 dark:ring-red-500/10" : "border-n-200 dark:border-n-700 focus-within:border-nami-orange dark:focus-within:border-nami-orange focus-within:ring-2 focus-within:ring-nami-orange/10"
                            )}
                          >
                            <span className="flex items-center gap-2 pl-5 pr-4 py-3.5 text-[14px] text-n-600 dark:text-n-400 border-r border-n-200 dark:border-n-700 bg-n-50/50 dark:bg-n-800/50 shrink-0">
                              <span className="text-xl leading-none" aria-hidden>🇨🇴</span>
                              <span className="font-semibold text-n-700 dark:text-n-300">+57</span>
                            </span>
                            <input
                              type="tel"
                              inputMode="numeric"
                              autoComplete="tel-national"
                              placeholder="323 501 8878"
                              value={whatsappDigits}
                              onChange={(e) => setWhatsappDigits(onlyDigits(e.target.value))}
                              className={cn(
                                "flex-1 min-w-0 px-5 py-3.5 text-[15px] text-n-900 dark:text-n-0 placeholder:text-n-300 dark:placeholder:text-n-600 bg-transparent outline-none border-0 tracking-[0.12em] tabular-nums"
                              )}
                            />
                            {/* Formspree recibe el número completo con +57 */}
                            <input type="hidden" name="whatsapp" value={`+57${whatsappDigits}`} />
                          </div>
                          {errors.whatsapp && (
                            <p className="mt-1 text-[12px] text-red-500">
                              {errors.whatsapp}
                            </p>
                          )}
                        </div>

                      {/* Plan */}
                      <div>
                        <label className="block text-[13px] font-medium text-n-700 dark:text-n-200 mb-1.5">
                          Plan de interes
                        </label>
                        <select
                          name="plan"
                          defaultValue=""
                          className={cn(
                            inputBase,
                            "appearance-none cursor-pointer",
                            errors.plan ? inputErr : inputOk
                          )}
                        >
                          <option value="" disabled>
                            Elige un plan...
                          </option>
                          <option value="Gratis">Gratis — $0/mes</option>
                          <option value="Plus">Plus — $19.900/mes</option>
                          <option value="Pro">Pro — $60.000/mes</option>
                        </select>
                        {errors.plan && (
                          <p className="mt-1 text-[12px] text-red-500">
                            {errors.plan}
                          </p>
                        )}
                      </div>

                      {/* Errores de Formspree (red, límite, etc.) */}
                      {Array.isArray(formspreeState.errors) && formspreeState.errors.length > 0 && (
                        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-[13px] text-red-600 dark:text-red-400">
                          <ValidationError
                            prefix="Formulario"
                            errors={formspreeState.errors}
                          />
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={formspreeState.submitting}
                        className="w-full py-3.5 rounded-xl bg-nami-orange hover:bg-nami-orange-dark disabled:opacity-50 text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(255,122,0,0.4)] active:scale-[0.98]"
                      >
                        {formspreeState.submitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            Solicitar acceso
                            <Send size={14} />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
