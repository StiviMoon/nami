'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMyRestaurant } from '@/hooks/useMyRestaurant';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { formatPrice } from '@/lib/utils';
import { Plus, Trash2, Save, X, ImagePlus, Flame, Sparkles, ThumbsUp, SlidersHorizontal } from 'lucide-react';
import { normalizeMenuCustomization } from '@/lib/menu-customization';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { PageTransition, FadeIn } from '@/components/motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const BADGE_OPTIONS = [
  { value: '', label: 'Sin badge' },
  { value: 'popular', label: 'Popular', icon: Flame },
  { value: 'nuevo', label: 'Nuevo', icon: Sparkles },
  { value: 'picante', label: 'Picante', icon: Flame },
  { value: 'recomendado', label: 'Recomendado', icon: ThumbsUp },
] as const;

const EMPTY_ITEM = { name: '', description: '', price: '', imageUrl: '', badge: '' };

type ExtraRow = { id: string; name: string; price: string };
const emptyExtraRow = (): ExtraRow => ({ id: '', name: '', price: '' });

function buildCustomizationFromForm(extras: ExtraRow[], removablesText: string) {
  const extrasArr = extras
    .filter((r) => r.name.trim())
    .map((r, i) => ({
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

export default function MenuPage() {
  const qc = useQueryClient();
  const { data: restaurant, isLoading } = useMyRestaurant();
  const categories = restaurant?.categories ?? [];

  const [newCat, setNewCat] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);
  const [addingItem, setAddingItem] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState({ ...EMPTY_ITEM });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [itemExtras, setItemExtras] = useState<ExtraRow[]>([]);
  const [itemRemovables, setItemRemovables] = useState('');
  const [editingCustomItemId, setEditingCustomItemId] = useState<string | null>(null);
  const [editExtras, setEditExtras] = useState<ExtraRow[]>([]);
  const [editRemovables, setEditRemovables] = useState('');

  // ── Mutations ─────────────────────────────────────────────────────────────

  const invalidate = () => qc.invalidateQueries({ queryKey: queryKeys.dashboard.restaurant });

  const createCat = useMutation({
    mutationFn: (name: string) => api.post('/api/dashboard/categories', { name }),
    onSuccess: () => {
      invalidate();
      setNewCat('');
      setShowAddCat(false);
      toast('Categoría creada', 'success');
    },
    onError: () => toast('Error al crear categoría', 'error'),
  });

  const deleteCat = useMutation({
    mutationFn: (id: string) => api.del(`/api/dashboard/categories/${id}`),
    onSuccess: () => { invalidate(); toast('Categoría eliminada', 'success'); },
    onError: () => toast('Error al eliminar', 'error'),
  });

  const createItem = useMutation({
    mutationFn: (data: any) => api.post('/api/dashboard/items', data),
    onSuccess: () => {
      invalidate();
      setAddingItem(null);
      setItemForm({ ...EMPTY_ITEM });
      setImageFile(null);
      setUploadError('');
      toast('Item guardado', 'success');
    },
    onError: (err: any) => toast(err.message || 'Error al guardar item', 'error'),
  });

  // Optimistic update: cambia isAvailable en el caché sin esperar respuesta
  const toggleItem = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      api.put(`/api/dashboard/items/${id}`, { isAvailable }),
    onMutate: async ({ id, isAvailable }) => {
      await qc.cancelQueries({ queryKey: queryKeys.dashboard.restaurant });

      const previous = qc.getQueryData(queryKeys.dashboard.restaurant);

      qc.setQueryData(queryKeys.dashboard.restaurant, (old: any) => {
        if (!old?.data?.categories) return old;
        return {
          ...old,
          data: {
            ...old.data,
            categories: old.data.categories.map((cat: any) => ({
              ...cat,
              items: cat.items.map((item: any) =>
                item.id === id ? { ...item, isAvailable } : item
              ),
            })),
          },
        };
      });

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      // Revertir si falla
      if (ctx?.previous) qc.setQueryData(queryKeys.dashboard.restaurant, ctx.previous);
      toast('Error al actualizar disponibilidad', 'error');
    },
    onSettled: () => invalidate(),
  });

  const deleteItem = useMutation({
    mutationFn: (id: string) => api.del(`/api/dashboard/items/${id}`),
    onSuccess: () => { invalidate(); toast('Item eliminado', 'success'); },
    onError: () => toast('Error al eliminar', 'error'),
  });

  const updateItemCustom = useMutation({
    mutationFn: ({
      id,
      customization,
    }: {
      id: string;
      customization: Record<string, unknown> | null;
    }) => api.put(`/api/dashboard/items/${id}`, { customization }),
    onSuccess: () => {
      invalidate();
      setEditingCustomItemId(null);
      toast('Personalización guardada', 'success');
    },
    onError: () => toast('Error al guardar personalización', 'error'),
  });

  const openCustomizationEditor = (item: { id: string; customization?: unknown }) => {
    setEditingCustomItemId(item.id);
    const n = normalizeMenuCustomization(item.customization);
    setEditExtras(
      n?.extras?.length
        ? n.extras.map((e) => ({ id: e.id, name: e.name, price: String(e.price) }))
        : []
    );
    setEditRemovables(n?.removables?.join('\n') ?? '');
  };

  // ── Upload imagen ─────────────────────────────────────────────────────────

  const uploadItemImage = async () => {
    if (!imageFile) return;
    setUploadingImage(true);
    setUploadError('');
    try {
      const sign = await api.post('/api/dashboard/upload-url', { filename: imageFile.name });
      const { signedUrl, publicUrl } = sign?.data ?? {};
      if (!signedUrl || !publicUrl) throw new Error('No se pudo obtener URL de subida');

      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': imageFile.type || 'application/octet-stream' },
        body: imageFile,
      });
      if (!uploadRes.ok) throw new Error('Error subiendo imagen');

      setItemForm((prev) => ({ ...prev, imageUrl: publicUrl }));
    } catch (error: any) {
      setUploadError(error?.message || 'No se pudo subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
    );
  }

  const totalItems = categories.reduce((sum: number, c: any) => sum + c.items.length, 0);

  return (
    <PageTransition>
      <div className="space-y-8">
        <FadeIn>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-display font-bold text-n-900">Mi menú</h1>
              <p className="text-n-500 mt-1">
                {totalItems} items en {categories.length} categorías
                {restaurant?.plan === 'GRATIS' && ' (máx. 10 items)'}
              </p>
            </div>
            <Button onClick={() => setShowAddCat(true)}>
              <Plus className="w-4 h-4" /> Categoría
            </Button>
          </div>
        </FadeIn>

        {/* Nueva categoría */}
        {showAddCat && (
          <div className="bg-white rounded-2xl p-5 border border-primary/30 flex gap-3">
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && newCat.trim() && createCat.mutate(newCat.trim())}
              placeholder="Nombre de la categoría (ej: Bebidas)"
              className="flex-1 border border-n-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
              autoFocus
            />
            <button
              onClick={() => newCat.trim() && createCat.mutate(newCat.trim())}
              disabled={createCat.isPending || !newCat.trim()}
              className="cursor-pointer bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
            <button onClick={() => setShowAddCat(false)} className="cursor-pointer px-3 py-2.5 rounded-xl hover:bg-n-100 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Lista de categorías */}
        {categories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-n-100">
            <p className="text-4xl mb-3">📂</p>
            <p className="text-n-500">Aún no tienes categorías</p>
            <p className="text-sm text-n-300 mt-1">Crea una categoría y empieza a agregar tu menú</p>
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((cat: any) => (
              <div key={cat.id} className="bg-white rounded-2xl border border-n-100 overflow-hidden">
                {/* Header categoría */}
                <div className="flex justify-between items-center px-6 py-4 bg-n-50 border-b border-n-100">
                  <h3 className="font-display font-semibold text-lg">{cat.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const next = addingItem === cat.id ? null : cat.id;
                        setAddingItem(next);
                        if (next) {
                          setItemExtras([]);
                          setItemRemovables('');
                        }
                      }}
                      className="cursor-pointer text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Item
                    </button>
                    <button
                      onClick={() => confirm('¿Eliminar categoría y todos sus items?') && deleteCat.mutate(cat.id)}
                      disabled={deleteCat.isPending}
                      className="cursor-pointer text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Form nuevo item */}
                {addingItem === cat.id && (
                  <div className="px-6 py-4 bg-primary/5 border-b border-primary/10">
                    <div className="grid md:grid-cols-2 gap-3 mb-3">
                      <input
                        value={itemForm.name}
                        onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                        placeholder="Nombre del item"
                        className="border border-n-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <input
                        value={itemForm.price}
                        onChange={(e) => setItemForm({ ...itemForm, price: e.target.value.replace(/\D/g, '') })}
                        placeholder="Precio (ej: 15000)"
                        className="border border-n-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <input
                      value={itemForm.description}
                      onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                      placeholder="Descripción (opcional)"
                      className="w-full border border-n-200 rounded-xl px-4 py-2.5 mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />

                    {/* Upload imagen */}
                    <div className="mb-4 rounded-xl border border-dashed border-n-200 p-4 bg-white">
                      <label className="block text-sm font-semibold mb-1">Imagen del producto</label>
                      <p className="text-xs text-n-500 mb-3">Selecciona una imagen → pulsa Subir → luego Guardar item</p>
                      <div className="flex flex-col md:flex-row gap-2 md:items-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                          className="text-sm"
                        />
                        <button
                          type="button"
                          onClick={uploadItemImage}
                          disabled={!imageFile || uploadingImage}
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-n-900 text-white hover:bg-n-700 disabled:opacity-50 transition-colors"
                        >
                          <ImagePlus className="w-4 h-4" />
                          {uploadingImage ? 'Subiendo...' : 'Subir imagen'}
                        </button>
                      </div>
                      {itemForm.imageUrl && (
                        <div className="mt-3 flex items-center gap-3">
                          <img src={itemForm.imageUrl} alt="Preview" className="w-14 h-14 rounded-lg object-cover border border-n-200" />
                          <p className="text-xs text-emerald-700 font-medium">Imagen subida correctamente</p>
                        </div>
                      )}
                      {uploadError && <p className="text-xs text-red-600 mt-2">{uploadError}</p>}
                    </div>

                    {/* Badge */}
                    <div className="mb-3">
                      <label className="block text-sm font-semibold mb-2">Badge (opcional)</label>
                      <div className="flex flex-wrap gap-2">
                        {BADGE_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setItemForm({ ...itemForm, badge: opt.value })}
                            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              itemForm.badge === opt.value
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-n-200 text-n-500 hover:border-n-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Personalización (extras / quitables) */}
                    <div className="mb-4 rounded-xl border border-n-200 p-4 bg-white">
                      <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        Personalización del plato (opcional)
                      </label>
                      <p className="text-xs text-n-500 mb-3">
                        Toppings con precio y ingredientes que el cliente puede pedir sin. Se mostrará al elegir el plato en tu menú público.
                      </p>
                      <div className="space-y-2 mb-3">
                        <p className="text-xs font-bold text-n-600">Extras / toppings</p>
                        {itemExtras.map((row, idx) => (
                          <div key={idx} className="flex flex-wrap gap-2 items-center">
                            <input
                              value={row.name}
                              onChange={(e) => {
                                const next = [...itemExtras];
                                next[idx] = { ...next[idx], name: e.target.value };
                                setItemExtras(next);
                              }}
                              placeholder="Ej: Tocineta extra"
                              className="flex-1 min-w-[140px] border border-n-200 rounded-lg px-3 py-2 text-sm"
                            />
                            <input
                              value={row.price}
                              onChange={(e) => {
                                const next = [...itemExtras];
                                next[idx] = { ...next[idx], price: e.target.value.replace(/\D/g, '') };
                                setItemExtras(next);
                              }}
                              placeholder="Precio"
                              className="w-28 border border-n-200 rounded-lg px-3 py-2 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => setItemExtras(itemExtras.filter((_, i) => i !== idx))}
                              className="cursor-pointer text-red-500 p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setItemExtras([...itemExtras, emptyExtraRow()])}
                          className="cursor-pointer text-sm text-primary font-semibold"
                        >
                          + Añadir extra
                        </button>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-n-600 mb-1">Ingredientes que se pueden quitar</p>
                        <textarea
                          value={itemRemovables}
                          onChange={(e) => setItemRemovables(e.target.value)}
                          placeholder={'Uno por línea, ej:\nCebolla\nTomate'}
                          rows={3}
                          className="w-full border border-n-200 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={!itemForm.name || !itemForm.price}
                        onClick={() => {
                          const customization = buildCustomizationFromForm(itemExtras, itemRemovables);
                          createItem.mutate({
                            categoryId: cat.id,
                            name: itemForm.name,
                            description: itemForm.description || undefined,
                            price: Number(itemForm.price),
                            imageUrl: itemForm.imageUrl || undefined,
                            badge: itemForm.badge || undefined,
                            ...(customization ? { customization } : {}),
                          });
                        }}
                        isLoading={createItem.isPending}
                      >
                        Guardar item
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setAddingItem(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Items */}
                {cat.items.length === 0 ? (
                  <div className="px-6 py-8 text-center text-n-300 text-sm">Sin items aún</div>
                ) : (
                  <div className="divide-y divide-n-50">
                    {cat.items.map((item: any) => (
                      <div key={item.id} className="border-b border-n-50 last:border-0">
                        <div className="px-6 py-4 flex items-center gap-4">
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-n-100 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`font-semibold ${!item.isAvailable ? 'line-through text-n-300' : ''}`}>
                                {item.name}
                              </p>
                              {item.badge && (
                                <Badge variant={item.badge === 'popular' ? 'popular' : item.badge === 'nuevo' ? 'nuevo' : item.badge === 'picante' ? 'warning' : 'default'}>
                                  {item.badge}
                                </Badge>
                              )}
                              {normalizeMenuCustomization(item.customization) && (
                                <span className="text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                  Personalizable
                                </span>
                              )}
                            </div>
                            {item.description && <p className="text-sm text-n-400 truncate">{item.description}</p>}
                          </div>
                          <p className="font-bold text-primary whitespace-nowrap shrink-0">{formatPrice(Number(item.price))}</p>
                          <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                editingCustomItemId === item.id
                                  ? setEditingCustomItemId(null)
                                  : openCustomizationEditor(item)
                              }
                              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                                editingCustomItemId === item.id
                                  ? 'bg-primary text-white'
                                  : 'bg-n-100 text-n-600 hover:bg-n-200'
                              }`}
                            >
                              <SlidersHorizontal className="w-3.5 h-3.5" />
                              Extras
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleItem.mutate({ id: item.id, isAvailable: !item.isAvailable })}
                              disabled={toggleItem.isPending && toggleItem.variables?.id === item.id}
                              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-60 ${
                                item.isAvailable ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-n-100 text-n-400 hover:bg-n-200'
                              }`}
                            >
                              {item.isAvailable ? 'Activo' : 'Inactivo'}
                            </button>
                            <button
                              type="button"
                              onClick={() => confirm('¿Eliminar item?') && deleteItem.mutate(item.id)}
                              disabled={deleteItem.isPending}
                              className="cursor-pointer p-1.5 rounded-lg hover:bg-red-50 text-n-300 hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {editingCustomItemId === item.id && (
                          <div className="px-6 py-4 bg-n-50 border-t border-n-100 space-y-3">
                            <p className="text-sm font-semibold text-n-800">
                              Personalización para «{item.name}»
                            </p>
                            <div className="space-y-2">
                              <p className="text-xs font-bold text-n-600">Extras / toppings (nombre + precio)</p>
                              {editExtras.map((row, idx) => (
                                <div key={idx} className="flex flex-wrap gap-2 items-center">
                                  <input
                                    value={row.name}
                                    onChange={(e) => {
                                      const next = [...editExtras];
                                      next[idx] = { ...next[idx], name: e.target.value };
                                      setEditExtras(next);
                                    }}
                                    placeholder="Nombre del extra"
                                    className="flex-1 min-w-[140px] border border-n-200 rounded-lg px-3 py-2 text-sm bg-white"
                                  />
                                  <input
                                    value={row.price}
                                    onChange={(e) => {
                                      const next = [...editExtras];
                                      next[idx] = { ...next[idx], price: e.target.value.replace(/\D/g, '') };
                                      setEditExtras(next);
                                    }}
                                    placeholder="Precio"
                                    className="w-28 border border-n-200 rounded-lg px-3 py-2 text-sm bg-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setEditExtras(editExtras.filter((_, i) => i !== idx))}
                                    className="cursor-pointer text-red-500 p-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => setEditExtras([...editExtras, emptyExtraRow()])}
                                className="cursor-pointer text-sm text-primary font-semibold"
                              >
                                + Añadir extra
                              </button>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-n-600 mb-1">Ingredientes quitables (una por línea)</p>
                              <textarea
                                value={editRemovables}
                                onChange={(e) => setEditRemovables(e.target.value)}
                                rows={3}
                                className="w-full border border-n-200 rounded-lg px-3 py-2 text-sm bg-white"
                              />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                isLoading={updateItemCustom.isPending}
                                onClick={() => {
                                  const customization = buildCustomizationFromForm(editExtras, editRemovables);
                                  updateItemCustom.mutate({
                                    id: item.id,
                                    customization: customization as Record<string, unknown> | null,
                                  });
                                }}
                              >
                                Guardar personalización
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={updateItemCustom.isPending}
                                onClick={() => {
                                  if (confirm('¿Quitar toda la personalización de este plato?')) {
                                    updateItemCustom.mutate({ id: item.id, customization: null });
                                  }
                                }}
                              >
                                Quitar todo
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setEditingCustomItemId(null)}>
                                Cerrar
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
