# Conectar Formspree (ÑAMI) con Google Sheets

Tu formulario ya está enviando a **Formspree** con el ID `mqeydpok` (https://formspree.io/f/mqeydpok). Para ver los interesados en una **hoja de cálculo de Google**, tienes dos caminos.

---

## Opción 1: Zapier (recomendada, muy fácil)

1. **Cuenta**
   - Entra en [zapier.com](https://zapier.com) y crea una cuenta (plan gratis suele bastar para empezar).

2. **Crear un Zap**
   - Clic en **Create Zap**.
   - **Trigger (desencadenador):** busca **Webhooks by Zapier** → elige **Catch Hook**. Zapier te dará una URL (ej. `https://hooks.zapier.com/hooks/catch/...`). **Cópiala**.

3. **Conectar Formspree al webhook**
   - En [Formspree](https://formspree.io), entra a tu formulario (`mqeydpok`).
   - Ve a **Settings** → **Integrations** (o **Notifications**).
   - Añade una **Webhook** y pega la URL de Zapier. Así, cada envío del formulario dispara el Zap.

4. **Probar el trigger**
   - Envía un envío de prueba desde tu landing (o el formulario de Formspree).
   - En Zapier, clic en **Test trigger**. Deberías ver los datos del envío (restaurantName, ownerName, whatsapp, plan).

5. **Añadir la acción Google Sheets**
   - **Action:** busca **Google Sheets** → **Create Spreadsheet Row**.
   - Conecta tu cuenta de Google y elige (o crea) una hoja de cálculo.
   - Elige la **hoja** (pestaña) donde quieres que lleguen los datos.
   - Mapea las columnas a los campos del webhook:
     - Columna A → `restaurantName`
     - Columna B → `ownerName`
     - Columna C → `whatsapp`
     - Columna D → `plan`
     - (Opcional) Columna E → fecha/hora (Zapier suele ofrecerla).
   - Guarda y activa el Zap.

A partir de ahí, cada envío del formulario ÑAMI creará una fila en tu Google Sheet.

---

## Opción 2: Make (Integromat)

Similar a Zapier pero con más ejecuciones gratis.

1. Entra en [make.com](https://make.com).
2. Crea un **Scenario**.
3. **Módulo 1 – Webhook:** crea un webhook y copia la URL.
4. En Formspree, en **Integrations / Webhooks**, añade esa URL.
5. **Módulo 2 – Google Sheets:** “Add a row” y mapea los campos del webhook a las columnas de tu hoja (restaurantName, ownerName, whatsapp, plan, etc.).
6. Activa el scenario.

---

## Preparar la Google Sheet

Antes de mapear en Zapier/Make, crea la hoja con estas columnas en la **primera fila**:

| A              | B           | C         | D     | E (opcional) |
|----------------|-------------|-----------|-------|----------------|
| Restaurante    | Dueño       | WhatsApp  | Plan  | Fecha         |

Así coinciden con los `name` del formulario: `restaurantName`, `ownerName`, `whatsapp`, `plan`.

---

## Resumen

- **Formulario ÑAMI** → ya envía a Formspree (`mqeydpok`).
- **Formspree** → añades un webhook con la URL que te da Zapier o Make.
- **Zapier/Make** → recibe el webhook y escribe una fila en Google Sheets con los datos de cada interesado.

Si quieres, en el siguiente paso podemos definir exactamente qué columnas quieres (por ejemplo añadir “Ciudad” o “Comentarios”) y te digo cómo mapearlas en Zapier o Make.
