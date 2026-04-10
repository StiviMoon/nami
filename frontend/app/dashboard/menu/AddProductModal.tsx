'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ImagePlus,
  SlidersHorizontal,
  Upload,
  Trash2,
  UtensilsCrossed,
  FolderOpen,
  Tag,
  Type,
  Banknote,
  AlignLeft,
} from 'lucide-react';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { cn } from '@/lib/utils';
import { compressImage } from '@/lib/image-compress';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';

const DESCRIPTION_MAX = 140;

const BADGE_OPTIONS = [
  { value: '', label: 'Sin badge' },
  { value: 'popular', label: 'Popular' },
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'picante', label: 'Picante' },
  { value: 'recomendado', label: 'Recomendado' },
] as const;

const EMPTY = { name: '', description: '', price: '', imageUrl: '', badge: '' };

type ExtraRow = { id: string; name: string; price: string };
const emptyExtraRow = (): ExtraRow => ({ id: '', name: '', price: '' });

function buildCustomizationFromForm(extras: ExtraRow[], removablesText: string) {
  const extrasArr = extras
    .filter((r) => r.name.trim())
    .map((r) => ({
      id: r.id.trim() || undefined,
      name: r.name.trim(),
      price: Number(String(r.price).replace(/\D/g, '')) || 0,
    }));
  const removables = removablesText
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (extrasArr.length === 0 && removables.length === 0) return null;
  return {
    extras: extrasArr.length ? extrasArr : undefined,
    removables: removables.length ? removables : undefined,
  };
}

const inputClass = cn(
  'w-full rounded-2xl border-2 border-n-200/90 bg-white px-4 py-3.5 text-[15px] font-medium text-n-900',
  'shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200',
  'placeholder:text-n-400 placeholder:font-normal',
  'hover:border-n-300 hover:shadow-[0_2px_10px_rgba(15,23,42,0.06)]',
  'focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/[0.14]'
);

const textareaDescClass = cn(
  inputClass,
  'min-h-[4.5rem] max-h-[4.5rem] resize-none py-2.5 text-sm leading-snug'
);

const labelClass =
  'mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-n-500';

export type MenuCategoryLite = { id: string; name: string; items: { id: string }[] };

type Props = {
  open: boolean;
  onClose: () => void;
  categories: MenuCategoryLite[];
  categoryOrder: string[];
  defaultCategoryId: string | null;
  totalItemCount: number;
  planGratis: boolean;
};

export function AddProductModal({
  open,
  onClose,
  categories,
  categoryOrder,
  defaultCategoryId,
  totalItemCount,
  planGratis,
}: Props) {
  const qc = useQueryClient();
  const [categoryId, setCategoryId] = useState('');
  const [itemForm, setItemForm] = useState({ ...EMPTY });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [itemExtras, setItemExtras] = useState<ExtraRow[]>([]);
  const [itemRemovables, setItemRemovables] = useState('');
  const [customizationEnabled, setCustomizationEnabled] = useState(false);

  const reset = () => {
    setItemForm({ ...EMPTY });
    setImageFile(null);
    setUploadError('');
    setItemExtras([]);
    setItemRemovables('');
    setCustomizationEnabled(false);
  };

  useLayoutEffect(() => {
    if (!open) return;
    reset();
    const first = categoryOrder[0] ?? categories[0]?.id ?? '';
    const pre = defaultCategoryId && categories.some((c) => c.id === defaultCategoryId) ? defaultCategoryId : first;
    setCategoryId(pre);
  }, [open, defaultCategoryId, categoryOrder, categories]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const createItem = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/api/dashboard/items', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.restaurant });
      toast('Producto creado', 'success');
      reset();
      onClose();
    },
    onError: (err: Error) => toast(err.message || 'Error al guardar', 'error'),
  });

  const uploadItemImage = async () => {
    if (!imageFile) return;
    setUploadingImage(true);
    setUploadError('');
    try {
      const compressed = await compressImage(imageFile);
      const sign = await api.post('/api/dashboard/upload-url', { filename: compressed.name });
      const { signedUrl, publicUrl } = sign?.data ?? {};
      if (!signedUrl || !publicUrl) throw new Error('No se pudo obtener URL de subida');

      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': compressed.type || 'application/octet-stream' },
        body: compressed,
      });
      if (!uploadRes.ok) throw new Error('Error subiendo imagen');

      setItemForm((prev) => ({ ...prev, imageUrl: publicUrl }));
      setImageFile(null);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'No se pudo subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const atItemLimit = planGratis && totalItemCount >= 10;
  const canSubmit = !!categoryId && !!itemForm.name.trim() && !!itemForm.price && !atItemLimit;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const customization = customizationEnabled
      ? buildCustomizationFromForm(itemExtras, itemRemovables)
      : null;
    createItem.mutate({
      categoryId,
      name: itemForm.name.trim(),
      description: itemForm.description.trim() || undefined,
      price: Number(itemForm.price),
      imageUrl: itemForm.imageUrl.trim() || undefined,
      badge: itemForm.badge.trim() || undefined,
      ...(customization ? { customization } : {}),
    });
  };

  const orderedOptions = categoryOrder
    .map((id) => categories.find((c) => c.id === id))
    .filter(Boolean) as MenuCategoryLite[];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4 lg:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-n-950/60 backdrop-blur-[3px]"
            aria-label="Cerrar"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-product-title"
            className={cn(
              'relative z-10 flex w-full flex-col overflow-hidden rounded-t-3xl border border-n-200/90 bg-white shadow-[0_25px_80px_-12px_rgba(15,23,42,0.25)]',
              'max-h-[min(92dvh,920px)] sm:max-h-[min(90dvh,880px)] sm:rounded-3xl',
              'max-w-full sm:max-w-[min(96vw,1180px)]'
            )}
            initial={{ y: 48, opacity: 0.95 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 28, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-n-100 bg-linear-to-br from-primary/[0.09] via-white to-n-50/80 px-6 py-5 lg:px-10 lg:py-6">
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2 text-primary">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/12">
                    <UtensilsCrossed className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Nuevo producto</span>
                </div>
                <h2 id="add-product-title" className="font-display text-2xl font-black tracking-tight text-n-900 lg:text-[1.65rem]">
                  Agregar producto
                </h2>
                <p className="mt-1.5 max-w-xl text-sm text-n-500">
                  Categoría arriba; nombre y precio en una línea. Activa personalización solo si aplica.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-2xl p-2.5 text-n-400 transition-colors hover:bg-n-100 hover:text-n-800"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 lg:px-10 lg:py-8">
              {categories.length === 0 ? (
                <p className="rounded-2xl border-2 border-dashed border-n-200 bg-n-50/80 px-6 py-12 text-center text-sm font-medium text-n-500">
                  Crea una categoría primero para poder añadir productos.
                </p>
              ) : (
                <div className="space-y-6 lg:space-y-8">
                  <div>
                    <label htmlFor="add-product-category" className={labelClass}>
                      <FolderOpen className="h-3.5 w-3.5 text-primary" aria-hidden />
                      Categoría del menú
                    </label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger id="add-product-category" className="max-w-3xl">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent sideOffset={8} align="start">
                        {orderedOptions.map((c) => (
                          <SelectItem
                            key={c.id}
                            value={c.id}
                            textValue={`${c.name} ${c.items.length} productos`}
                          >
                            <span className="flex w-full min-w-0 items-center justify-between gap-3">
                              <span className="truncate font-semibold text-n-900">{c.name}</span>
                              <span className="inline-flex shrink-0 rounded-lg bg-n-100 px-2 py-0.5 text-[11px] font-bold tabular-nums text-n-500">
                                {c.items.length}
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {atItemLimit && (
                    <p className="rounded-2xl border-2 border-amber-200/80 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
                      Plan Gratis: ya tienes 10 productos. Sube de plan para añadir más.
                    </p>
                  )}

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
                    <div className="space-y-5 lg:col-span-7">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_9.5rem] sm:items-end">
                        <div className="min-w-0">
                          <label htmlFor="add-product-name" className={labelClass}>
                            <Type className="h-3.5 w-3.5 text-primary" aria-hidden />
                            Nombre
                          </label>
                          <input
                            id="add-product-name"
                            value={itemForm.name}
                            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                            placeholder="Ej: Hamburguesa clásica"
                            className={inputClass}
                            autoComplete="off"
                          />
                        </div>
                        <div className="min-w-0">
                          <label htmlFor="add-product-price" className={labelClass}>
                            <Banknote className="h-3.5 w-3.5 text-primary" aria-hidden />
                            Precio (COP)
                          </label>
                          <input
                            id="add-product-price"
                            value={itemForm.price}
                            onChange={(e) => setItemForm({ ...itemForm, price: e.target.value.replace(/\D/g, '') })}
                            placeholder="18900"
                            inputMode="numeric"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                          <label htmlFor="add-product-desc" className={cn(labelClass, 'mb-0')}>
                            <AlignLeft className="h-3.5 w-3.5 text-primary" aria-hidden />
                            Descripción{' '}
                            <span className="font-semibold normal-case tracking-normal text-n-400">(opcional)</span>
                          </label>
                          <span
                            className={cn(
                              'text-xs font-semibold tabular-nums',
                              itemForm.description.length >= DESCRIPTION_MAX ? 'text-amber-600' : 'text-n-400'
                            )}
                          >
                            {itemForm.description.length}/{DESCRIPTION_MAX}
                          </span>
                        </div>
                        <textarea
                          id="add-product-desc"
                          value={itemForm.description}
                          maxLength={DESCRIPTION_MAX}
                          onChange={(e) =>
                            setItemForm({ ...itemForm, description: e.target.value.slice(0, DESCRIPTION_MAX) })
                          }
                          placeholder={`Breve texto para la carta (máx. ${DESCRIPTION_MAX} caracteres).`}
                          rows={2}
                          className={textareaDescClass}
                        />
                      </div>

                      <div
                        className={cn(
                          'rounded-2xl border-2 bg-linear-to-b from-white to-n-50/50 p-5 lg:p-6',
                          customizationEnabled ? 'border-primary/25' : 'border-n-200/80'
                        )}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex min-w-0 items-start gap-3">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                              <SlidersHorizontal className="h-4 w-4 text-primary" />
                            </span>
                            <div>
                              <p className="text-sm font-bold text-n-900">Extras e ingredientes</p>
                              <p className="mt-0.5 text-sm text-n-500">
                                Activa solo si el cliente puede elegir toppings de pago o quitar ingredientes.
                              </p>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-3 sm:pl-2">
                            <span className="text-xs font-bold uppercase tracking-wide text-n-500">
                              {customizationEnabled ? 'Activado' : 'Desactivado'}
                            </span>
                            <Switch
                              checked={customizationEnabled}
                              onCheckedChange={setCustomizationEnabled}
                              aria-label="Activar extras e ingredientes opcionales"
                            />
                          </div>
                        </div>

                        {customizationEnabled && (
                          <div className="mt-5 space-y-5 border-t border-n-200/80 pt-5">
                            <div className="space-y-3">
                              <p className="text-xs font-bold uppercase tracking-wide text-n-600">Extras / toppings</p>
                              {itemExtras.map((row, idx) => (
                                <div key={idx} className="flex flex-wrap items-center gap-2 sm:gap-3">
                                  <input
                                    value={row.name}
                                    onChange={(e) => {
                                      const next = [...itemExtras];
                                      next[idx] = { ...next[idx], name: e.target.value };
                                      setItemExtras(next);
                                    }}
                                    placeholder="Nombre del extra"
                                    className={cn(inputClass, 'min-w-[140px] flex-1 py-3 text-sm')}
                                  />
                                  <input
                                    value={row.price}
                                    onChange={(e) => {
                                      const next = [...itemExtras];
                                      next[idx] = { ...next[idx], price: e.target.value.replace(/\D/g, '') };
                                      setItemExtras(next);
                                    }}
                                    placeholder="Precio"
                                    className={cn(inputClass, 'w-full py-3 sm:w-32')}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setItemExtras(itemExtras.filter((_, i) => i !== idx))}
                                    className="cursor-pointer rounded-xl p-2.5 text-red-500 transition-colors hover:bg-red-50"
                                    aria-label="Quitar fila"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => setItemExtras([...itemExtras, emptyExtraRow()])}
                                className="cursor-pointer text-sm font-bold text-primary hover:underline"
                              >
                                + Añadir extra
                              </button>
                            </div>
                            <div>
                              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-n-600">
                                Quitar ingredientes (uno por línea)
                              </p>
                              <textarea
                                value={itemRemovables}
                                onChange={(e) => setItemRemovables(e.target.value)}
                                placeholder={'Cebolla\nTomate'}
                                rows={3}
                                className={cn(inputClass, 'min-h-[88px] resize-y text-sm')}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  {/* Columna lateral: imagen + badges */}
                  <div className="space-y-6 lg:col-span-5">
                    <div className="rounded-2xl border-2 border-n-200/80 bg-linear-to-br from-n-50/90 to-white p-5 lg:p-6">
                      <p className="text-sm font-bold text-n-900">Foto del producto</p>
                      <p className="mt-1 text-sm leading-relaxed text-n-500">
                        Elige archivo → <strong className="text-n-700">Subir a la nube</strong> →{' '}
                        <strong className="text-n-700">Crear producto</strong>.
                      </p>
                      <div className="mt-4 space-y-3">
                        <input
                          id="add-product-modal-img"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                          className="sr-only"
                        />
                        <label
                          htmlFor="add-product-modal-img"
                          className="flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-n-300 bg-white px-4 py-4 text-sm font-semibold text-n-700 transition-all hover:border-primary hover:bg-primary/[0.04]"
                        >
                          <ImagePlus className="h-5 w-5 shrink-0 text-primary" />
                          <span className="truncate">{imageFile ? imageFile.name : 'Elegir imagen'}</span>
                        </label>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={uploadItemImage}
                          disabled={!imageFile || uploadingImage}
                          className="w-full"
                        >
                          <Upload className="h-4 w-4" />
                          {uploadingImage ? 'Subiendo…' : 'Subir a la nube'}
                        </Button>
                      </div>
                      {itemForm.imageUrl && (
                        <div className="mt-4 flex gap-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50/70 p-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={itemForm.imageUrl}
                            alt=""
                            className="h-24 w-24 shrink-0 rounded-xl border border-n-200 object-cover shadow-sm sm:h-28 sm:w-28"
                          />
                          <p className="flex items-center text-sm font-medium leading-snug text-emerald-900">
                            Vista previa lista. Pulsa «Crear producto» abajo para guardar.
                          </p>
                        </div>
                      )}
                      {uploadError && <p className="mt-3 text-sm font-medium text-red-600">{uploadError}</p>}
                    </div>

                    <div>
                      <p className={labelClass}>
                        <Tag className="h-3.5 w-3.5 text-primary" aria-hidden />
                        Badge en el menú
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {BADGE_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setItemForm({ ...itemForm, badge: opt.value })}
                            className={cn(
                              'rounded-2xl border-2 px-4 py-2.5 text-sm font-bold transition-all',
                              itemForm.badge === opt.value
                                ? 'border-primary bg-primary/12 text-primary shadow-sm shadow-primary/10'
                                : 'border-n-200/90 bg-white text-n-600 hover:border-n-300 hover:bg-n-50'
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-n-100 bg-n-50/95 px-6 py-4 lg:px-10 lg:py-5">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Button type="button" variant="ghost" size="md" onClick={onClose} className="sm:min-w-[120px]">
                  Cancelar
                </Button>
                <Button
                  type="button"
                  size="md"
                  disabled={!canSubmit}
                  isLoading={createItem.isPending}
                  onClick={handleSubmit}
                  className="sm:min-w-[200px]"
                >
                  Crear producto
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
