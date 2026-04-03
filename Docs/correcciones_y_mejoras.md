# 📋 Correcciones y Mejoras — Plataforma de Restaurantes

> Documento de feedback técnico estructurado para desarrollo.
> Cada sección contiene el problema identificado, el comportamiento esperado y notas adicionales.

---
que mi menu de usuaro las ajuste al tamaño, tambien el tamaño de las imagnees que ve mi usaurio quiero que sean mas peuqeñas adaptadas a la vision de movil, y responsivas, actaulemnte estan muy grandes

## 1. PERSONALIZACIÓN — Fuente y Vista Previa

**Problema:**
- La fuente por defecto no se comporta igual que las demás opciones.
- El cambio de tipo de letra **no se refleja en la vista previa** en tiempo real.

**Comportamiento esperado:**
- Todas las fuentes, incluyendo la por defecto, deben actualizar la vista previa inmediatamente al seleccionarse.

**Idea adicional (opcional):**
- Permitir que la personalización de colores del restaurante (fondo, botones, etc.) pueda **extraerse automáticamente desde una imagen** subida por el usuario (ej. logo o foto del local). Esto ayudaría a restaurantes que no recuerdan sus colores exactos.

---

## 2. UBICACIÓN — Sección de Registro

**Problema:**
- El botón "Usar mi ubicación actual" solo funciona si el usuario está físicamente en el restaurante en el momento del registro.
- En `localhost` no funciona en absoluto.
- Muchos usuarios no saben obtener latitud/longitud desde Google Maps manualmente.

**Comportamiento esperado:**
- Mantener el botón "Usar mi ubicación actual".
- **Agregar un mapa interactivo** usando **OpenStreetMap (Leaflet.js)** — gratuito — donde el usuario pueda hacer clic o arrastrar un marcador para seleccionar la ubicación del restaurante.
- El mapa debe actualizar automáticamente los campos de Latitud y Longitud.

**Implementación sugerida:**
```
Librería: Leaflet.js + OpenStreetMap tiles
Flujo:
  1. El mapa carga centrado en una ubicación por defecto (o la actual si está disponible).
  2. El usuario arrastra el pin o hace clic en el mapa.
  3. Los campos Latitud y Longitud se actualizan en tiempo real.
  4. El botón "Usar ubicación actual" sigue funcionando como alternativa rápida.
```

---

## 3. HORARIOS — Área Interactiva

**Problema:**
- El área de edición de horarios solo responde al clic cuando se presiona **exactamente sobre el ícono del reloj**.
- Hacer clic en cualquier otra zona del recuadro no activa la edición.

**Comportamiento esperado:**
- Todo el recuadro de horario (no solo el ícono) debe ser clickeable para abrir el editor.

---

## 4. CATEGORÍAS — Tipos de Restaurante

**Problema:**
- Las categorías actuales son muy específicas (Pizza, Hamburguesas, etc.) y no contemplan restaurantes con menú variado.

**Categorías actuales:**
`Comida Rápida, Corrientazo, Hamburguesas, Pizza, Panadería, Postres, Asados, Comida Saludable, Comida China, Heladería, Otro`

**Comportamiento esperado:**
- Agregar categorías más amplias como: `Menú del día`, `Variado / De todo`, `Restaurante familiar`, `Café`, `Mariscos`, `Comida italiana`, `Árabe`, entre otras.
- Considerar permitir que un restaurante seleccione **múltiples categorías**.

---

## 5. VERIFICACIÓN DE CORREO — Flujo de Registro

**Requerimiento:**
Implementar verificación de correo electrónico en el registro de restaurantes.

**Flujo propuesto:**
```
1. Usuario llena el formulario de registro.
2. Se envía un código de verificación al correo ingresado.
3. Usuario ingresa el código para confirmar su email.
4. Una vez confirmado, aparece la pantalla: "Solicitud en revisión".
```

**Seguridad mínima requerida (si no se implementa verificación de correo por ahora):**
- Validación de fortaleza de contraseña (longitud mínima, caracteres especiales, etc.).

---

## 6. ETIQUETA "PRO" — Visibilidad

**Problema:**
- La etiqueta "PRO" es visible para los clientes finales en la sección pública y dentro del restaurante, lo cual no es deseable.

**Comportamiento esperado:**
- La etiqueta "PRO" **no debe mostrarse a los clientes**.
- En su lugar, usar etiquetas orientadas al cliente como: `🔥 Tendencia`, `HOT`, `Destacado`, `Nuevo`, etc., asignadas según el plan de pago del restaurante.

---

## 7. DESCRIPCIÓN DEL RESTAURANTE — Visualización

**Problema:**
- La descripción se muestra en la tarjeta del restaurante (listado), pero si es larga, se corta y se ve mal.
- La descripción **no aparece dentro de la vista individual del restaurante**.
- El banner del restaurante **no se muestra en ninguna parte** de la vista pública.

**Comportamiento esperado:**
- En la **tarjeta del listado de restaurantes**: mostrar el **banner** (imagen horizontal) en lugar de la descripción.
- La **descripción** solo debe mostrarse **dentro de la página del restaurante**, en el área de información (debajo de la imagen de portada, junto a dirección y horarios).

---

## 8. LOGO — Visualización en Vista Pública

**Problema:**
- El logo del restaurante **no aparece en el listado público** de restaurantes.
- Solo se muestra la imagen de portada (cover) en ambas vistas.

**Comportamiento esperado:**
- El logo debe aparecer visible en la tarjeta del restaurante dentro del listado público.
- Las imágenes subidas deben quedar **contenidas dentro de su marco** sin recortarse (usar `object-fit: contain` o similar).

---

## 9. EDICIÓN DE ÍTEMS DEL MENÚ

**Problema:**
- Una vez creado un ítem, **no se puede editar**. Si el usuario cometió un error, debe eliminar el ítem y volver a crearlo desde cero.

**Comportamiento esperado:**
- Agregar botón o acción de **editar ítem** que permita modificar nombre, descripción, precio e imagen sin recrearlo.

**Idea a futuro:**
- Ofrecer **categorías predeterminadas con imágenes de calidad** (ej. sección de Bebidas con productos comunes ya cargados) como parte de un plan de pago.

---

---

## 11. VARIANTES DE PRODUCTO — Bebidas con Sabores

**Problema actual:**
- Bebidas del mismo tipo (ej. Jugo Hit en diferentes sabores) se crean como ítems separados, saturando el menú.

**Comportamiento esperado:**
- Permitir crear un **producto base** con variantes de sabor seleccionables.
- Si todos los sabores tienen el mismo precio → un solo ítem con selector de sabor.
- Si los sabores tienen precios distintos → cada sabor muestra su precio individual al seleccionarlo.

**Ejemplo de UI:**
```
Jugo Hit Personal — $5.000
Elige tu sabor: [Mango] [Mora] [Naranja Piña] [Frutos Tropicales]
```
import React, { useState, useMemo } from 'react';
import { 
  LucideCheckCircle2, 
  LucideShoppingBag, 
  LucidePlus, 
  LucideMinus, 
  LucideFlame, 
  LucideUtensils, 
  LucideCircleDot,
  LucideChevronRight,
  LucideLayers,
  LucideInfo,
  LucideStar
} from 'lucide-react';

/**
 * FUENTE DE DATOS DEL PRODUCTO
 * Totalmente personalizable. El componente se adapta si faltan secciones.
 */
const PRODUCT_DATA = {
  name: "Hamburguesa Gourmet X",
  category: "Parrilla de Autor",
  badge: "Más Vendido",
  rating: "4.8",
  reviews: "128",
  description: "200g de carne Angus premium, doble queso cheddar fundido, tocineta ahumada crujiente, cebolla caramelizada y pan brioche artesanal sellado con mantequilla.",
  image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
  basePrice: 28000,

  variants: {
    title: "Tamaño de la Hamburguesa",
    icon: <LucideLayers size={16} className="text-orange-500" />,
    options: [
      { id: 'v1', name: 'Sencilla', label: '1 Carne (200g)', extra: 0 },
      { id: 'v2', name: 'Doble', label: '2 Carnes (400g)', extra: 8500 },
      { id: 'v3', name: 'Monster', label: '3 Carnes (600g)', extra: 15000 }
    ]
  },

  attributes: {
    title: "Término de la Carne",
    icon: <LucideFlame size={16} className="text-orange-500" />,
    options: [
      { id: 'a1', name: 'Término Medio', desc: 'Centro rojo y muy jugoso' },
      { id: 'a2', name: 'Tres Cuartos', desc: 'Punto ideal de la casa' },
      { id: 'a3', name: 'Bien Asada', desc: 'Totalmente cocida' }
    ]
  },

  additions: {
    title: "Elige tu Acompañante",
    icon: <LucideUtensils size={16} className="text-orange-500" />,
    options: [
      { id: 'ad1', name: 'Papas Francesas', extra: 0 },
      { id: 'ad2', name: 'Papa Criolla', extra: 1500 },
      { id: 'ad3', name: 'Aros de Cebolla', extra: 3000 },
      { id: 'ad4', name: 'Papas en Cascos', extra: 2500 }
    ]
  }
};

const App = () => {
  const product = PRODUCT_DATA;

  const [selectedVariant, setSelectedVariant] = useState(product.variants?.options[0] || null);
  const [selectedAttr, setSelectedAttr] = useState(product.attributes?.options[1] || null); // Seleccionado 3/4 por defecto
  const [selectedAddition, setSelectedAddition] = useState(product.additions?.options[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const totalPrice = useMemo(() => {
    let total = product.basePrice;
    if (selectedVariant) total += selectedVariant.extra;
    if (selectedAddition) total += selectedAddition.extra;
    return total * quantity;
  }, [selectedVariant, selectedAddition, quantity, product.basePrice]);

  const handleAdd = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 sm:p-4 lg:p-8 font-sans text-slate-800 flex items-center justify-center">
      
      {/* CONTENEDOR PRINCIPAL: Modo App Móvil en pantallas pequeñas, Tarjeta en Desktop */}
      <div className="w-full max-w-6xl bg-white sm:rounded-[2rem] shadow-2xl sm:shadow-slate-200/50 overflow-hidden flex flex-col lg:flex-row h-[100dvh] sm:h-auto lg:h-[780px] max-h-[100dvh] sm:max-h-[95vh] relative">
        
        {/* IMAGEN (Mobile: Header, Desktop: Lado Izquierdo) */}
        <div className="w-full h-56 sm:h-72 lg:h-full lg:w-[45%] relative shrink-0">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {/* Sombra sutil interna para contraste */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
          
          {/* Botón flotante simulado "Volver" (Solo visual para dar feel de App) */}
          <div className="absolute top-4 left-4 lg:hidden w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
            <LucideChevronRight size={24} className="rotate-180 text-slate-700" />
          </div>
        </div>

        {/* ÁREA DE CONTENIDO Y FORMULARIO */}
        <div className="flex-1 flex flex-col h-full bg-white relative">
          
          {/* ZONA SCROLLABLE (Info + Opciones) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
            
            {/* INFORMACIÓN DEL PRODUCTO */}
            <div className="p-5 sm:p-8 lg:p-10 border-b border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest">
                  {product.badge}
                </span>
                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md">
                  <LucideStar size={12} fill="currentColor" />
                  <span className="text-[10px] font-bold text-yellow-700">{product.rating} <span className="opacity-60">({product.reviews})</span></span>
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-3 leading-[1.1]">
                {product.name}
              </h1>
              
              <p className="text-slate-500 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* SECCIONES DE CONFIGURACIÓN */}
            <div className="p-5 sm:p-8 lg:p-10 space-y-10">
              
              {/* 1. VARIANTES */}
              {product.variants && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {product.variants.icon}
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">{product.variants.title}</h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">Requerido</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {product.variants.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedVariant(opt)}
                        className={`flex flex-col p-4 rounded-2xl border-2 transition-all text-left group ${
                          selectedVariant?.id === opt.id 
                          ? 'border-orange-500 bg-orange-50/50 shadow-sm' 
                          : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-start w-full mb-1">
                          <span className={`font-black text-xs uppercase ${selectedVariant?.id === opt.id ? 'text-orange-700' : 'text-slate-700'}`}>
                            {opt.name}
                          </span>
                          <LucideCircleDot size={16} className={selectedVariant?.id === opt.id ? 'text-orange-500' : 'text-slate-300'} />
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 mb-2">{opt.label}</span>
                        <span className={`text-sm font-black mt-auto ${selectedVariant?.id === opt.id ? 'text-orange-600' : 'text-slate-400'}`}>
                          {opt.extra === 0 ? 'Base' : `+$${(opt.extra / 1000).toFixed(1)}k`}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* 2. ATRIBUTOS (Listado) */}
              {product.attributes && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {product.attributes.icon}
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">{product.attributes.title}</h3>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2.5">
                    {product.attributes.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedAttr(opt)}
                        className={`flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all w-full ${
                          selectedAttr?.id === opt.id 
                          ? 'border-slate-900 bg-slate-900 text-white shadow-md' 
                          : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <LucideCheckCircle2 size={18} className={selectedAttr?.id === opt.id ? 'text-white' : 'text-transparent'} />
                          <div className="text-left">
                            <span className={`font-black text-[11px] uppercase tracking-wider block mb-0.5 ${selectedAttr?.id === opt.id ? 'text-white' : 'text-slate-800'}`}>
                              {opt.name}
                            </span>
                            <span className={`text-[10px] font-medium ${selectedAttr?.id === opt.id ? 'text-slate-300' : 'text-slate-500'}`}>
                              {opt.desc}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* 3. ADICIONES */}
              {product.additions && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {product.additions.icon}
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">{product.additions.title}</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {product.additions.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedAddition(opt)}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          selectedAddition?.id === opt.id 
                          ? 'border-orange-500 bg-orange-50/50' 
                          : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col items-start overflow-hidden">
                          <span className={`font-black text-[10px] sm:text-[11px] uppercase truncate w-full mb-0.5 ${selectedAddition?.id === opt.id ? 'text-orange-700' : 'text-slate-700'}`}>
                            {opt.name}
                          </span>
                          <span className={`text-[10px] font-bold ${selectedAddition?.id === opt.id ? 'text-orange-600' : 'text-slate-400'}`}>
                            {opt.extra > 0 ? `+ $${opt.extra.toLocaleString()}` : 'Incluido'}
                          </span>
                        </div>
                        <LucideCircleDot size={16} className={`shrink-0 ${selectedAddition?.id === opt.id ? 'text-orange-500' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* FOOTER: ZONA DE ACCIÓN (STICKY) */}
          <div className="sticky bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 sm:p-6 lg:p-8 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 lg:gap-6">
              
              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                {/* CONTROL DE CANTIDAD MODO CLARO */}
                <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity-1))} 
                    className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm hover:text-slate-900 transition-all active:scale-95"
                  >
                    <LucideMinus size={18}/>
                  </button>
                  <span className="w-12 lg:w-14 text-center font-black text-slate-800 text-xl tabular-nums">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity+1)} 
                    className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm hover:text-slate-900 transition-all active:scale-95"
                  >
                    <LucidePlus size={18}/>
                  </button>
                </div>

                {/* TOTAL */}
                <div className="flex flex-col items-end sm:items-start min-w-[120px]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total</span>
                  <span className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter whitespace-nowrap">
                    $ {totalPrice.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>

              {/* BOTÓN DE COMPRA PREMIUM */}
              <button
                onClick={handleAdd}
                disabled={isAdded}
                className={`h-14 lg:h-16 px-8 lg:px-10 w-full sm:w-auto flex-1 rounded-2xl lg:rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
                  isAdded 
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                  : 'bg-slate-900 text-white hover:bg-black hover:-translate-y-1 active:translate-y-0 shadow-slate-900/20'
                }`}
              >
                {isAdded ? <LucideCheckCircle2 size={18} strokeWidth={3}/> : <LucideShoppingBag size={18} strokeWidth={3}/>}
                {isAdded ? 'CONFIRMADO' : 'AGREGAR AL PEDIDO'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Estilos para que el scrollbar en modo claro se vea sutil */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #cbd5e1; }
      `}} />
    </div>
  );
};

export default App;

**Aplica también para:**
- Jugos naturales (agua o leche como base, con incremento de precio para leche).
- Limonadas (diferentes sabores con precios distintos).
- Cafés (temperatura, variedad: espresso, latte, cappuccino, americano).

**Regla general:** Cada restaurante personaliza sus propias variantes y precios. El sistema debe ser flexible, no imponer estructura fija.

---

## 12. COMBOS Y MODALIDADES DE PLATOS

**Requerimiento:**
Los restaurantes necesitan poder configurar sus platos con modalidades (ej. solo, con papas, combo completo).

**Comportamiento esperado:**
- Al crear un ítem, poder definir **modalidades** con precios propios:
  - Ej: `Solo Perro $14.000 | Con Papas $18.800 | Combo Completo $25.000`
- Al seleccionar una modalidad que incluye papas, mostrar opciones de tipo de papa (Papa Criolla, Papa Francesa, Papas en Casco, Papas con Queso, etc.) con posibles sobrecostos.
- Algunos restaurantes incluyen papas por defecto con el plato → opción de configurarlo como "incluido".

**Aplica para:** Perros calientes, hamburguesas, carnes, salchipapas, y cualquier plato con acompañantes opcionales.

---

## 13. CONFIGURACIÓN DE PIZZA

**Requerimiento:**
Los restaurantes de pizza necesitan una configuración específica.

**Comportamiento esperado:**
- Crear un ítem de tipo pizza con:
  1. **Selección de sabor** (Hawaiana, Pepperoni, Margarita, Pollo & Tocineta, etc.)
  2. **Tamaño/Porciones** (Personal, Mediana, Familiar) — cada uno con su precio configurable
  3. **Adición: borde de queso** — precio variable según tamaño (configurable)
- Alternativa: si el restaurante prefiere, puede crear ítems individuales por pizza con su propia configuración.

---

## 14. CONFIGURACIÓN DE SALCHIPAPAS

**Requerimiento:**
- Tipo de salchipapa (configurable por el restaurante).
- Tamaño con precios distintos por tamaño.
- Opciones adicionales: tipo de papa, tipo de salchicha (con sobrecosto configurable).
- Opción de selección de salsas o "todas las salsas".

---

## 15. CONFIGURACIÓN DE HAMBURGUESAS Y CARNES

**Requerimiento:**
- Igual que los perros: modalidades (sola, con papas, en combo).
- Opción de configurar **término de cocción** (1/2, 3/4, Bien Asado) — solo si el restaurante lo desea.
- Para carnes: acompañante de papa (Francesa gratis, Criolla o en Casco con sobrecosto).
- Ícono visual opcional que indique "incluye papas" en la tarjeta del ítem.

---

## 16. CÓDIGO QR — Logo

**Problema:**
- El QR descargado como imagen **no incluye el logo** del restaurante en el centro.
- En la vista de impresión sí aparece correctamente.

**Comportamiento esperado:**
- El archivo descargado del QR debe incluir el logo del restaurante embebido, igual que en la impresión.

---

## 17. URL DEL RESTAURANTE — Cambio de Nombre

**Problema:**
- Al cambiar el nombre del restaurante, la URL pública **no se actualiza** y permanece con el slug anterior.

**Ejemplo:**
```
Nombre anterior: "La pizzeria (PRUEBA)"  →  URL: /la-pizzeria-prueba
Nombre nuevo: "Sabor & Ando"            →  URL sigue siendo: /la-pizzeria-prueba  ❌
```

**Comportamiento esperado:**
- Al cambiar el nombre, se debe **regenerar el slug** de la URL (con manejo de colisiones si el slug ya existe).
- Opcionalmente, redirigir la URL anterior a la nueva para no romper QRs impresos existentes.

---

## 18. MENÚ PÚBLICO — Barra de Categorías Sticky

**Problema:**
- Al hacer scroll en el menú de un restaurante, la barra de filtros y categorías **desaparece hacia arriba**.
- El usuario debe volver al inicio para cambiar de categoría.

**Comportamiento esperado:**
- La barra de categorías debe ser **sticky** (fija en la parte superior) mientras el usuario hace scroll hacia abajo.

---

## 19. PANEL DE ADMINISTRADOR — Reordenar Menú

**Requerimiento:**
- Desde el panel del restaurante, el administrador debe poder:
  - **Reordenar ítems** dentro de una categoría (drag & drop o flechas).
  - **Reordenar categorías** del menú.
  - **Previsualizar** cómo queda el menú antes de guardar.

---

## 20. CONFIGURACIÓN DE DOMICILIO Y EMPAQUE

**Requerimiento:**
Desde el panel del restaurante, permitir configurar:

- **Costo de domicilio:**
  - Por precio fijo según barrio/zona.
  - O indicar que el precio se coordina por WhatsApp (sin costo en plataforma).

- **Costo de empaque:**
  - Agregar cargo adicional por empaque para pedidos que no se consumen en el punto.
  - El restaurante define si aplica y cuánto cobra.

---

## RESUMEN DE PRIORIDADES SUGERIDAS

| # | Ítem | Tipo | Prioridad sugerida |
|---|------|------|--------------------|
| 2 | Mapa interactivo para ubicación (OpenStreetMap) | Bug + Feature | 🔴 Alta |
| 3 | Área de horarios clickeable completa | Bug | 🔴 Alta |
| 9 | Edición de ítems del menú | Bug | 🔴 Alta |
| 7 | Descripción y banner mal ubicados | Bug | 🔴 Alta |
| 8 | Logo no aparece en listado público | Bug | 🔴 Alta |
| 17 | URL no se actualiza al cambiar nombre | Bug | 🔴 Alta |
| 16 | QR sin logo al descargar | Bug | 🟡 Media |
| 18 | Categorías sticky en menú público | UX | 🟡 Media |
| 1 | Vista previa de fuente en tiempo real | Bug | 🟡 Media |
| 6 | Ocultar etiqueta PRO a clientes | UX | 🟡 Media |
| 5 | Verificación de correo en registro | Feature | 🟡 Media |
| 4 | Ampliar categorías de restaurantes | Feature | 🟡 Media |
| 19 | Reordenar menú desde admin | Feature | 🟡 Media |
| 20 | Configuración de domicilio y empaque | Feature | 🟡 Media |
| 11 | Variantes de bebidas/sabores | Feature | 🟢 Baja |
| 12 | Combos y modalidades de platos | Feature | 🟢 Baja |
| 13 | Configuración especial para pizza | Feature | 🟢 Baja |
| 14 | Configuración de salchipapas | Feature | 🟢 Baja |
| 15 | Configuración de hamburguesas/carnes | Feature | 🟢 Baja |
| 10 | Mejora de imágenes con IA (premium) | Feature futura | ⚪ Backlog |
