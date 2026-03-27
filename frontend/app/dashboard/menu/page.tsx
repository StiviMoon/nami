'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Plus, Trash2, Save, X, ImagePlus, Flame, Sparkles, Star, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';

const BADGE_OPTIONS = [
  { value: '', label: 'Sin badge', icon: null },
  { value: 'popular', label: 'Popular', icon: Flame },
  { value: 'nuevo', label: 'Nuevo', icon: Sparkles },
  { value: 'picante', label: 'Picante', icon: Flame },
  { value: 'recomendado', label: 'Recomendado', icon: ThumbsUp },
] as const;

export default function MenuPage() {
  const qc = useQueryClient();
  const [newCat, setNewCat] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);
  const [addingItem, setAddingItem] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState({ name: '', description: '', price: '', imageUrl: '', badge: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['my-restaurant'],
    queryFn: () => api.get('/api/dashboard/restaurant'),
  });

  const restaurant = data?.data;
  const categories = restaurant?.categories || [];

  const createCat = useMutation({
    mutationFn: (name: string) => api.post('/api/dashboard/categories', { name }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['my-restaurant'] }); setNewCat(''); setShowAddCat(false); },
  });

  const deleteCat = useMutation({
    mutationFn: (id: string) => api.del(`/api/dashboard/categories/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-restaurant'] }),
  });

  const createItem = useMutation({
    mutationFn: (data: any) => api.post('/api/dashboard/items', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-restaurant'] });
      setAddingItem(null);
      setItemForm({ name: '', description: '', price: '', imageUrl: '', badge: '' });
      setImageFile(null);
      setUploadError('');
    },
  });

  const toggleItem = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      api.put(`/api/dashboard/items/${id}`, { isAvailable }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-restaurant'] }),
  });

  const deleteItem = useMutation({
    mutationFn: (id: string) => api.del(`/api/dashboard/items/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-restaurant'] }),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
    );
  }

  const totalItems = categories.reduce((sum: number, c: any) => sum + c.items.length, 0);

  const uploadItemImage = async () => {
    if (!imageFile) return;
    setUploadingImage(true);
    setUploadError('');

    try {
      const sign = await api.post('/api/dashboard/upload-url', { filename: imageFile.name });
      const signedUrl: string = sign?.data?.signedUrl;
      const publicUrl: string = sign?.data?.publicUrl;

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

  return (
    <PageTransition>
    <div className="space-y-8">
      <FadeIn>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-display font-bold text-n-900">Mi menú</h1>
          <p className="text-n-500 mt-1">
            {totalItems} items en {categories.length} categorías
            {restaurant?.plan === 'GRATIS' && ` (máx. 10 items)`}
          </p>
        </div>
        <Button onClick={() => setShowAddCat(true)}>
          <Plus className="w-4 h-4" /> Categoría
        </Button>
      </div>
      </FadeIn>

      {/* Add category */}
      {showAddCat && (
        <div className="bg-white rounded-2xl p-5 border border-primary/30 flex gap-3">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="Nombre de la categoría (ej: Bebidas)"
            className="flex-1 border border-n-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
            autoFocus
          />
          <button
            onClick={() => newCat.trim() && createCat.mutate(newCat.trim())}
            disabled={createCat.isPending}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-dark disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
          </button>
          <button onClick={() => setShowAddCat(false)} className="px-3 py-2.5 rounded-xl hover:bg-n-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Categories & Items */}
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
              <div className="flex justify-between items-center px-6 py-4 bg-n-50 border-b border-n-100">
                <h3 className="font-display font-semibold text-lg">{cat.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAddingItem(addingItem === cat.id ? null : cat.id)}
                    className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Item
                  </button>
                  <button
                    onClick={() => confirm('¿Eliminar categoría y todos sus items?') && deleteCat.mutate(cat.id)}
                    className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add item form */}
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
                  <div className="mb-4 rounded-xl border border-dashed border-n-200 p-4 bg-white">
                    <label className="block text-sm font-semibold mb-2">Imagen del producto</label>
                    <p className="text-xs text-n-500 mb-3">Paso 1: selecciona una imagen. Paso 2: pulsa subir. Paso 3: guarda el item.</p>
                    <div className="flex flex-col md:flex-row gap-2 md:items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        className="text-sm"
                      />
                      <button
                        type="button"
                        onClick={uploadItemImage}
                        disabled={!imageFile || uploadingImage}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-n-900 text-white hover:bg-n-700 disabled:opacity-50"
                      >
                        <ImagePlus className="w-4 h-4" />
                        {uploadingImage ? 'Subiendo...' : 'Subir imagen'}
                      </button>
                    </div>
                    {itemForm.imageUrl && (
                      <div className="mt-3 flex items-center gap-3">
                        <img src={itemForm.imageUrl} alt="Preview producto" className="w-14 h-14 rounded-lg object-cover border border-n-200" />
                        <p className="text-xs text-green-700">Imagen subida correctamente.</p>
                      </div>
                    )}
                    {uploadError && <p className="text-xs text-red-600 mt-2">{uploadError}</p>}
                  </div>
                  {/* Badge selector */}
                  <div className="mb-3">
                    <label className="block text-sm font-semibold mb-2">Badge (opcional)</label>
                    <div className="flex flex-wrap gap-2">
                      {BADGE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setItemForm({ ...itemForm, badge: opt.value })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
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
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        itemForm.name && itemForm.price &&
                        createItem.mutate({
                          categoryId: cat.id,
                          name: itemForm.name,
                          description: itemForm.description || undefined,
                          price: Number(itemForm.price),
                          imageUrl: itemForm.imageUrl || undefined,
                          badge: itemForm.badge || undefined,
                        })
                      }
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

              {/* Items list */}
              {cat.items.length === 0 ? (
                <div className="px-6 py-8 text-center text-n-300 text-sm">Sin items aún</div>
              ) : (
                <div className="divide-y divide-n-50">
                  {cat.items.map((item: any) => (
                    <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-n-100" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold ${!item.isAvailable ? 'line-through text-n-300' : ''}`}>{item.name}</p>
                          {item.badge && (
                            <Badge variant={item.badge === 'popular' ? 'popular' : item.badge === 'nuevo' ? 'nuevo' : item.badge === 'picante' ? 'warning' : 'default'}>
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && <p className="text-sm text-n-400 truncate">{item.description}</p>}
                      </div>
                      <p className="font-bold text-primary whitespace-nowrap">{formatPrice(Number(item.price))}</p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleItem.mutate({ id: item.id, isAvailable: !item.isAvailable })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                            item.isAvailable ? 'bg-green-50 text-green-600' : 'bg-n-100 text-n-400'
                          }`}
                        >
                          {item.isAvailable ? 'Activo' : 'Inactivo'}
                        </button>
                        <button
                          onClick={() => confirm('¿Eliminar item?') && deleteItem.mutate(item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-n-300 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
