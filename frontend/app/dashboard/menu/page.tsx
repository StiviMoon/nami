'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMyRestaurant } from '@/hooks/useMyRestaurant';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { formatPrice } from '@/lib/utils';
import {
  Plus,
  Trash2,
  Save,
  X,
  ImagePlus,
  Flame,
  Sparkles,
  ThumbsUp,
  SlidersHorizontal,
  Upload,
  Pencil,
  GripVertical,
  ChevronDown,
  ChevronUp,
  ChevronsDownUp,
  ChevronsUpDown,
  PackagePlus,
} from 'lucide-react';
import { normalizeMenuCustomization } from '@/lib/menu-customization';
import { compressImage } from '@/lib/image-compress';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { PageTransition, FadeIn } from '@/components/motion';
import { SortableCategoryWrapper } from './SortableCategoryWrapper';
import { AddProductModal } from './AddProductModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  imageUrl?: string;
  badge?: string;
  isAvailable: boolean;
  customization?: unknown;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

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

export default function MenuPage() {
  const qc = useQueryClient();
  const { data: restaurant, isLoading } = useMyRestaurant();
  const categories = useMemo(
    () => (restaurant?.categories ?? []) as MenuCategory[],
    [restaurant?.categories]
  );

  const [newCat, setNewCat] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addProductPrefillCategoryId, setAddProductPrefillCategoryId] = useState<string | null>(null);
  const [editingCustomItemId, setEditingCustomItemId] = useState<string | null>(null);
  const [editExtras, setEditExtras] = useState<ExtraRow[]>([]);
  const [editRemovables, setEditRemovables] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemForm, setEditItemForm] = useState({ ...EMPTY_ITEM });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editUploadingImage, setEditUploadingImage] = useState(false);
  const [editUploadError, setEditUploadError] = useState('');

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

  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  useEffect(() => {
    setCategoryOrder(categories.map((c) => c.id));
  }, [categories]);

  const reorderSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reorderCategories = useMutation({
    mutationFn: (categoryIds: string[]) =>
      api.patch('/api/dashboard/categories/reorder', { categoryIds }),
    onSuccess: () => {
      invalidate();
      toast('Orden del menú guardado', 'success');
    },
    onError: () => toast('No se pudo guardar el orden', 'error'),
  });

  const handleCategoryReorder = (next: string[]) => {
    setCategoryOrder(next);
    if (reorderSaveTimer.current) clearTimeout(reorderSaveTimer.current);
    reorderSaveTimer.current = setTimeout(() => {
      reorderCategories.mutate(next);
    }, 450);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = categoryOrder.indexOf(String(active.id));
    const newIndex = categoryOrder.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    handleCategoryReorder(arrayMove(categoryOrder, oldIndex, newIndex));
  };

  const bumpCategory = (catId: string, dir: -1 | 1) => {
    const i = categoryOrder.indexOf(catId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= categoryOrder.length) return;
    handleCategoryReorder(arrayMove(categoryOrder, i, j));
  };

  /** Secciones desplegadas; por defecto colapsadas para reordenar sin scroll infinito. */
  const [sectionOpen, setSectionOpen] = useState<Record<string, boolean>>({});

  const toggleSectionOpen = (id: string) => {
    setSectionOpen((prev) => ({ ...prev, [id]: !(prev[id] ?? false) }));
  };

  const expandAllSections = () => {
    const next: Record<string, boolean> = {};
    categoryOrder.forEach((id) => {
      next[id] = true;
    });
    setSectionOpen(next);
  };

  const collapseAllSections = () => setSectionOpen({});

  // Optimistic update: cambia isAvailable en el caché sin esperar respuesta
  const toggleItem = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      api.put(`/api/dashboard/items/${id}`, { isAvailable }),
    onMutate: async ({ id, isAvailable }) => {
      await qc.cancelQueries({ queryKey: queryKeys.dashboard.restaurant });

      const previous = qc.getQueryData(queryKeys.dashboard.restaurant);

      qc.setQueryData(queryKeys.dashboard.restaurant, (old: { data?: { categories?: MenuCategory[] } }) => {
        if (!old?.data?.categories) return old;
        return {
          ...old,
          data: {
            ...old.data,
            categories: old.data.categories.map((cat) => ({
              ...cat,
              items: cat.items.map((item) =>
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

  const updateItem = useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      name: string;
      description?: string | null;
      price: number;
      imageUrl?: string | null;
      badge?: string | null;
    }) => api.put(`/api/dashboard/items/${id}`, body),
    onSuccess: () => {
      invalidate();
      setEditingItemId(null);
      setEditItemForm({ ...EMPTY_ITEM });
      setEditImageFile(null);
      setEditUploadError('');
      toast('Item actualizado', 'success');
    },
    onError: (err: Error) => toast(err.message || 'Error al actualizar item', 'error'),
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

  // ── Upload imagen (edición) ─────────────────────────────────────────────────

  const uploadEditItemImage = async () => {
    if (!editImageFile) return;
    setEditUploadingImage(true);
    setEditUploadError('');
    try {
      const compressed = await compressImage(editImageFile);
      const sign = await api.post('/api/dashboard/upload-url', { filename: compressed.name });
      const { signedUrl, publicUrl } = sign?.data ?? {};
      if (!signedUrl || !publicUrl) throw new Error('No se pudo obtener URL de subida');

      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': compressed.type || 'application/octet-stream' },
        body: compressed,
      });
      if (!uploadRes.ok) throw new Error('Error subiendo imagen');

      setEditItemForm((prev) => ({ ...prev, imageUrl: publicUrl }));
      setEditImageFile(null);
    } catch (error) {
      setEditUploadError(error instanceof Error ? error.message : 'No se pudo subir la imagen');
    } finally {
      setEditUploadingImage(false);
    }
  };

  const openAddProductModal = (categoryId?: string | null) => {
    setAddProductPrefillCategoryId(categoryId ?? null);
    setAddProductOpen(true);
  };

  const openItemEditor = (item: MenuItem) => {
    setEditingCustomItemId(null);
    setEditingItemId(item.id);
    setEditItemForm({
      name: item.name,
      description: item.description ?? '',
      price: String(Number(item.price)),
      imageUrl: item.imageUrl ?? '',
      badge: item.badge ?? '',
    });
    setEditImageFile(null);
    setEditUploadError('');
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

  const totalItems = categories.reduce((sum: number, c: MenuCategory) => sum + c.items.length, 0);

  return (
    <PageTransition>
      <div className="space-y-8">
        <FadeIn>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-display font-black text-n-900 tracking-tight">Mi menú</h1>
              <p className="text-xs text-n-400 font-bold uppercase tracking-wide mt-0.5">
                {totalItems} items · {categories.length} categorías
                {restaurant?.plan === 'GRATIS' && <span className="text-amber-500"> · máx. 10 items</span>}
              </p>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-n-500">
                Reordenar: usa las flechas <span className="font-semibold text-n-700">▲▼</span> o arrastra el mango{' '}
                <span className="font-semibold text-n-700">⋮⋮</span> (tras mover ~6px para no chocar con clics). Las
                secciones empiezan plegadas; abre con el título o la chevron.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                type="button"
                size="sm"
                className="gap-1.5 shadow-sm"
                onClick={() => openAddProductModal(categoryOrder[0] ?? null)}
                disabled={categories.length === 0}
              >
                <PackagePlus className="h-4 w-4" />
                Crear producto
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={expandAllSections}
              >
                <ChevronsUpDown className="h-4 w-4" />
                Desplegar todo
              </Button>
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={collapseAllSections}>
                <ChevronsDownUp className="h-4 w-4" />
                Plegar todo
              </Button>
              <Button onClick={() => setShowAddCat(true)} size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" /> Nueva categoría
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* Nueva categoría */}
        {showAddCat && (
          <div className="bg-white rounded-2xl p-4 border border-primary/20 flex gap-2 shadow-sm">
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && newCat.trim() && createCat.mutate(newCat.trim())}
              placeholder="Nombre de la categoría (ej: Bebidas)"
              className="flex-1 bg-n-50 border border-n-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all"
              autoFocus
            />
            <button
              onClick={() => newCat.trim() && createCat.mutate(newCat.trim())}
              disabled={createCat.isPending || !newCat.trim()}
              className="cursor-pointer bg-primary text-white px-4 py-2.5 rounded-xl font-bold disabled:opacity-50 transition-colors hover:bg-primary/90 text-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Guardar
            </button>
            <button onClick={() => setShowAddCat(false)} className="cursor-pointer px-3 py-2.5 rounded-xl hover:bg-n-100 transition-colors text-n-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Lista de categorías */}
        {categories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-n-100 border-dashed">
            <p className="text-5xl mb-4">🍽</p>
            <h3 className="font-display font-bold text-n-800 text-lg">Tu menú está vacío</h3>
            <p className="text-sm text-n-400 mt-1.5 mb-5">Crea una categoría para comenzar</p>
            <button
              type="button"
              onClick={() => setShowAddCat(true)}
              className="cursor-pointer inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> Nueva categoría
            </button>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onCategoryDragEnd}>
            <SortableContext items={categoryOrder} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-3">
                {categoryOrder.map((catId) => {
                  const cat = categories.find((c: MenuCategory) => c.id === catId);
                  if (!cat) return null;
                  const idx = categoryOrder.indexOf(catId);
                  const hasOpenEditor =
                    cat.items.some((i) => i.id === editingItemId) ||
                    cat.items.some((i) => i.id === editingCustomItemId);
                  const sectionExpanded = hasOpenEditor || (sectionOpen[cat.id] ?? false);
                  return (
                    <SortableCategoryWrapper key={catId} id={catId}>
                      {({ listeners, attributes }) => (
              <div className="bg-white rounded-2xl border border-n-100 overflow-hidden">
                {/* Header categoría */}
                <div
                  className={`flex items-center justify-between gap-3 bg-n-900 px-5 py-4 ${
                    sectionExpanded ? 'border-b border-n-800' : ''
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
                    <div className="flex shrink-0 flex-col gap-0.5">
                      <button
                        type="button"
                        title="Subir sección"
                        disabled={idx <= 0}
                        onClick={() => bumpCategory(cat.id, -1)}
                        className="cursor-pointer rounded-md p-0.5 text-n-500 hover:bg-n-800 hover:text-white disabled:pointer-events-none disabled:opacity-25"
                      >
                        <ChevronUp className="h-4 w-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        title="Bajar sección"
                        disabled={idx >= categoryOrder.length - 1}
                        onClick={() => bumpCategory(cat.id, 1)}
                        className="cursor-pointer rounded-md p-0.5 text-n-500 hover:bg-n-800 hover:text-white disabled:pointer-events-none disabled:opacity-25"
                      >
                        <ChevronDown className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 cursor-grab rounded-lg p-1.5 text-n-500 hover:bg-n-800 hover:text-white active:cursor-grabbing"
                      {...listeners}
                      {...attributes}
                      aria-label="Arrastrar para reordenar sección"
                    >
                      <GripVertical className="h-5 w-5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center gap-2 rounded-xl py-1 pl-1 pr-2 text-left hover:bg-n-800/60"
                      onClick={() => {
                        if (hasOpenEditor) return;
                        toggleSectionOpen(cat.id);
                      }}
                      aria-expanded={sectionExpanded}
                      aria-label={sectionExpanded ? 'Plegar categoría' : 'Desplegar categoría'}
                    >
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-n-400 transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                          sectionExpanded ? 'rotate-180' : ''
                        }`}
                        aria-hidden
                      />
                      <span className="h-5 w-1 shrink-0 rounded-full bg-primary" />
                      <h3 className="font-display truncate text-base font-black tracking-tight text-white">{cat.name}</h3>
                      <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-n-500 bg-n-800 px-2 py-0.5 rounded-full">
                        {cat.items.length} items
                      </span>
                    </button>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSectionOpen((s) => ({ ...s, [cat.id]: true }));
                        openAddProductModal(cat.id);
                      }}
                      className="cursor-pointer flex items-center gap-1.5 rounded-lg bg-primary/20 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-primary transition-colors hover:bg-primary/30"
                    >
                      <Plus className="w-3.5 h-3.5" /> Producto
                    </button>
                    <button
                      type="button"
                      onClick={() => confirm('¿Eliminar categoría y todos sus items?') && deleteCat.mutate(cat.id)}
                      disabled={deleteCat.isPending}
                      className="cursor-pointer text-n-500 hover:bg-red-950 hover:text-red-400 p-1.5 rounded-lg text-sm disabled:opacity-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                {sectionExpanded && (
                <motion.div
                  key={`${cat.id}-body`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                {/* Items */}
                {cat.items.length === 0 ? (
                  <div className="px-6 py-10 text-center">
                    <p className="text-2xl mb-2">🍽</p>
                    <p className="text-sm text-n-400 font-medium">Sin items en esta categoría</p>
                    <button
                      type="button"
                      onClick={() => openAddProductModal(cat.id)}
                      className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Agregar primer producto
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-n-50">
                    {cat.items.map((item: MenuItem) => (
                      <div key={item.id} className="border-b border-n-50 last:border-0">
                        {editingItemId === item.id ? (
                          <div className="px-4 sm:px-6 py-4 bg-primary/5 space-y-3">
                            <div className="grid md:grid-cols-2 gap-3">
                              <input
                                value={editItemForm.name}
                                onChange={(e) => setEditItemForm({ ...editItemForm, name: e.target.value })}
                                placeholder="Nombre del item"
                                className="border border-n-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                              />
                              <input
                                value={editItemForm.price}
                                onChange={(e) => setEditItemForm({ ...editItemForm, price: e.target.value.replace(/\D/g, '') })}
                                placeholder="Precio"
                                className="border border-n-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                              />
                            </div>
                            <input
                              value={editItemForm.description}
                              onChange={(e) => setEditItemForm({ ...editItemForm, description: e.target.value })}
                              placeholder="Descripción (opcional)"
                              className="w-full border border-n-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <div className="rounded-xl border border-n-200 p-4 bg-white space-y-3">
                              <p className="text-sm font-semibold text-n-900">Foto del producto</p>
                              <div className="space-y-2">
                                <input
                                  id={`menu-edit-item-img-${item.id}`}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setEditImageFile(e.target.files?.[0] ?? null)}
                                  className="sr-only"
                                />
                                <label
                                  htmlFor={`menu-edit-item-img-${item.id}`}
                                  className="cursor-pointer flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-n-300 bg-n-50 px-4 py-3 text-sm font-medium text-n-700 hover:border-primary hover:bg-primary/5 transition-colors"
                                >
                                  <ImagePlus className="w-4 h-4 text-primary shrink-0" />
                                  {editImageFile ? editImageFile.name : 'Cambiar foto (opcional)'}
                                </label>
                                <button
                                  type="button"
                                  onClick={uploadEditItemImage}
                                  disabled={!editImageFile || editUploadingImage}
                                  className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-n-900 text-white hover:bg-n-700 disabled:opacity-50 transition-colors"
                                >
                                  <Upload className="w-4 h-4" />
                                  {editUploadingImage ? 'Subiendo...' : 'Subir foto'}
                                </button>
                              </div>
                              {editItemForm.imageUrl && (
                                <div className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50/50 px-3 py-2">
                                  <img src={editItemForm.imageUrl} alt="" className="w-14 h-14 rounded-lg object-cover border border-n-200" />
                                  <p className="text-xs text-emerald-800 font-medium">Imagen lista en la nube</p>
                                </div>
                              )}
                              {editUploadError && <p className="text-xs text-red-600">{editUploadError}</p>}
                            </div>
                            <div>
                              <p className="text-sm font-semibold mb-2">Badge</p>
                              <div className="flex flex-wrap gap-2">
                                {BADGE_OPTIONS.map((opt) => (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setEditItemForm({ ...editItemForm, badge: opt.value })}
                                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                      editItemForm.badge === opt.value
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-n-200 text-n-500 hover:border-n-300'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                disabled={!editItemForm.name || !editItemForm.price}
                                isLoading={updateItem.isPending}
                                onClick={() =>
                                  updateItem.mutate({
                                    id: item.id,
                                    name: editItemForm.name,
                                    description: editItemForm.description.trim() || null,
                                    price: Number(editItemForm.price),
                                    imageUrl: editItemForm.imageUrl.trim() || null,
                                    badge: editItemForm.badge.trim() || null,
                                  })
                                }
                              >
                                Guardar cambios
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingItemId(null);
                                  setEditItemForm({ ...EMPTY_ITEM });
                                  setEditImageFile(null);
                                  setEditUploadError('');
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                        <>
                        <div className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            {/* Imagen */}
                            <div className="shrink-0">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className={`w-20 h-20 rounded-xl object-cover border border-n-100 ${!item.isAvailable ? 'grayscale opacity-50' : ''}`}
                                />
                              ) : (
                                <div className={`w-20 h-20 rounded-xl bg-n-100 flex items-center justify-center ${!item.isAvailable ? 'opacity-50' : ''}`}>
                                  <span className="text-3xl opacity-30">🍽</span>
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <p className={`font-display font-bold text-sm ${!item.isAvailable ? 'line-through text-n-300' : 'text-n-900'}`}>
                                  {item.name}
                                </p>
                                {item.badge && (
                                  <Badge variant={item.badge === 'popular' ? 'popular' : item.badge === 'nuevo' ? 'nuevo' : item.badge === 'picante' ? 'warning' : 'default'}>
                                    {item.badge}
                                  </Badge>
                                )}
                                {normalizeMenuCustomization(item.customization) && (
                                  <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                    Personalizable
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-xs text-n-400 line-clamp-1 mb-1.5">{item.description}</p>
                              )}
                              <p className="font-display font-black text-primary text-base">
                                {formatPrice(Number(item.price))}
                              </p>
                            </div>

                            {/* Toggle disponibilidad */}
                            <button
                              type="button"
                              onClick={() => toggleItem.mutate({ id: item.id, isAvailable: !item.isAvailable })}
                              disabled={toggleItem.isPending && toggleItem.variables?.id === item.id}
                              className={`cursor-pointer shrink-0 w-11 h-6 rounded-full relative transition-all duration-200 disabled:opacity-60 ${
                                item.isAvailable ? 'bg-emerald-500' : 'bg-n-200'
                              }`}
                              title={item.isAvailable ? 'Disponible — clic para desactivar' : 'Inactivo — clic para activar'}
                            >
                              <span
                                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                                  item.isAvailable ? 'left-[calc(100%-1.375rem)]' : 'left-0.5'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Acciones */}
                          <div className="flex gap-1.5 mt-3 pt-3 border-t border-n-50">
                            <button
                              type="button"
                              onClick={() => openItemEditor(item)}
                              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-n-100 text-n-600 hover:bg-n-200 transition-colors"
                            >
                              <Pencil className="w-3 h-3" />
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                editingCustomItemId === item.id
                                  ? setEditingCustomItemId(null)
                                  : openCustomizationEditor(item)
                              }
                              className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                editingCustomItemId === item.id
                                  ? 'bg-primary text-white'
                                  : 'bg-n-100 text-n-600 hover:bg-n-200'
                              }`}
                            >
                              <SlidersHorizontal className="w-3 h-3" />
                              Extras
                            </button>
                            <button
                              type="button"
                              onClick={() => confirm('¿Eliminar item?') && deleteItem.mutate(item.id)}
                              disabled={deleteItem.isPending}
                              className="cursor-pointer ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-n-300 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-3 h-3" />
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
                        </>
                      )}
                      </div>
                    ))}
                  </div>
                )}
                </motion.div>
                )}
                </AnimatePresence>
              </div>
                      )}
                    </SortableCategoryWrapper>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <AddProductModal
        open={addProductOpen}
        onClose={() => {
          setAddProductOpen(false);
          setAddProductPrefillCategoryId(null);
        }}
        categories={categories}
        categoryOrder={categoryOrder}
        defaultCategoryId={addProductPrefillCategoryId}
        totalItemCount={totalItems}
        planGratis={restaurant?.plan === 'GRATIS'}
      />
    </PageTransition>
  );
}
