'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMyRestaurant } from '@/hooks/useMyRestaurant';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';
import {
  Save, ImagePlus, MapPin, Palette, Type, LayoutGrid, LayoutList,
  Instagram, Globe, Clock, MessageCircle, Store, Upload, CheckCircle2, Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { compressImage } from '@/lib/image-compress';
import { RestaurantLocationMap } from '@/components/web/RestaurantLocationMap';

const DAYS = [
  { key: 'lun', label: 'Lunes' },
  { key: 'mar', label: 'Martes' },
  { key: 'mie', label: 'Miércoles' },
  { key: 'jue', label: 'Jueves' },
  { key: 'vie', label: 'Viernes' },
  { key: 'sab', label: 'Sábado' },
  { key: 'dom', label: 'Domingo' },
];

const FONTS = [
  { value: '', label: 'Por defecto' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Lora', label: 'Lora' },
];

interface ScheduleDay {
  open: string;
  close: string;
  closed: boolean;
}

type Schedule = Record<string, ScheduleDay>;

function parseSchedule(raw: string | null | undefined): Schedule {
  const defaults: Schedule = {};
  for (const d of DAYS) {
    defaults[d.key] = { open: '08:00', close: '20:00', closed: false };
  }
  if (!raw) return defaults;
  try {
    const parsed = JSON.parse(raw);
    for (const d of DAYS) {
      if (parsed[d.key]) {
        defaults[d.key] = { open: '', close: '', closed: false };
        const val = parsed[d.key];
        if (val === 'Cerrado' || val === 'cerrado') {
          defaults[d.key].closed = true;
        } else if (typeof val === 'string' && val.includes('-')) {
          const [open, close] = val.split('-').map((s: string) => s.trim());
          defaults[d.key] = { open, close, closed: false };
        }
      }
    }
  } catch { /* keep defaults */ }
  return defaults;
}

function serializeSchedule(schedule: Schedule): string {
  const result: Record<string, string> = {};
  for (const d of DAYS) {
    const day = schedule[d.key];
    if (day.closed) {
      result[d.key] = 'Cerrado';
    } else if (day.open && day.close) {
      result[d.key] = `${day.open} - ${day.close}`;
    }
  }
  return JSON.stringify(result);
}

/** Prisma/JSON a veces entrega floats como string; el mapa necesita number */
function numOrNull(v: unknown): number | null {
  if (v == null) return null;
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-n-100">
      <Icon className="w-4 h-4 text-primary" />
      <p className="text-xs font-semibold text-n-500 uppercase tracking-wide">{title}</p>
    </div>
  );
}

async function uploadFileToStorage(file: File): Promise<string> {
  const compressed = await compressImage(file);
  const sign = await api.post('/api/dashboard/upload-url', { filename: compressed.name });
  const signedUrl = sign?.data?.signedUrl as string | undefined;
  const publicUrl = sign?.data?.publicUrl as string | undefined;
  if (!signedUrl || !publicUrl) throw new Error('No se pudo obtener URL de subida');

  const uploadRes = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': compressed.type || 'application/octet-stream' },
    body: compressed,
  });
  if (!uploadRes.ok) throw new Error('Error subiendo imagen');
  return publicUrl;
}

export default function PerfilPage() {
  const qc = useQueryClient();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [schedule, setSchedule] = useState<Schedule>(() => parseSchedule(null));
  /** Evita montar Leaflet antes de hidratar lat/lng desde el API (si no, el mapa queda en el default y ignora lo guardado). */
  const [mapReady, setMapReady] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    whatsapp: '',
    category: '',
    logoUrl: '',
    coverUrl: '',
    themePreset: 'SUNSET',
    menuStyle: 'ROUNDED',
    isClosed: false,
    primaryColor: '',
    secondaryColor: '',
    fontFamily: '',
    menuLayout: 'list',
    bannerText: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const { data, isLoading } = useMyRestaurant();

  // useLayoutEffect: hidratar antes del paint; el mapa solo monta después (mapReady) con coords ya en el formulario
  useLayoutEffect(() => {
    if (!data) {
      setMapReady(false);
      return;
    }
    const r = data;
    setForm({
      name: r.name || '',
      description: r.description || '',
      address: r.address || '',
      whatsapp: r.whatsapp || '',
      category: r.category || '',
      logoUrl: r.logoUrl || '',
      coverUrl: r.coverUrl || '',
      themePreset: r.themePreset || 'SUNSET',
      menuStyle: r.menuStyle || 'ROUNDED',
      isClosed: r.isClosed || false,
      primaryColor: r.primaryColor || '',
      secondaryColor: r.secondaryColor || '',
      fontFamily: r.fontFamily || '',
      menuLayout: r.menuLayout || 'list',
      bannerText: r.bannerText || '',
      instagram: r.instagram || '',
      tiktok: r.tiktok || '',
      facebook: r.facebook || '',
      latitude: numOrNull(r.latitude),
      longitude: numOrNull(r.longitude),
    });
    setSchedule(parseSchedule(r.schedule));
    setMapReady(true);
  }, [data]);

  const update = useMutation({
    mutationFn: (body: Record<string, unknown>) => api.put('/api/dashboard/restaurant', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.restaurant });
      toast('Cambios guardados', 'success');
    },
    onError: () => toast('Error al guardar', 'error'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, unknown> = { ...form };
    payload.schedule = serializeSchedule(schedule);
    // Ubicación: enviar siempre para persistir en BD (null borra coordenadas)
    payload.latitude =
      typeof form.latitude === 'number' && !Number.isNaN(form.latitude)
        ? Math.round(form.latitude * 1e6) / 1e6
        : null;
    payload.longitude =
      typeof form.longitude === 'number' && !Number.isNaN(form.longitude)
        ? Math.round(form.longitude * 1e6) / 1e6
        : null;
    // Clean empty strings to null for nullable fields
    for (const key of ['primaryColor', 'secondaryColor', 'fontFamily', 'bannerText', 'instagram', 'tiktok', 'facebook']) {
      if (payload[key] === '') payload[key] = null;
    }
    if (payload.menuLayout === 'list') payload.menuLayout = null;
    update.mutate(payload);
  };

  const uploadLogo = async () => {
    if (!logoFile) return;
    setUploadingLogo(true);
    try {
      const publicUrl = await uploadFileToStorage(logoFile);
      setForm((prev) => ({ ...prev, logoUrl: publicUrl }));
      setLogoFile(null);
      toast('Logo subido a la nube', 'success');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'No se pudo subir la imagen';
      toast(msg, 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  const uploadCover = async () => {
    if (!coverFile) return;
    setUploadingCover(true);
    try {
      const publicUrl = await uploadFileToStorage(coverFile);
      setForm((prev) => ({ ...prev, coverUrl: publicUrl }));
      setCoverFile(null);
      toast('Foto de portada subida a la nube', 'success');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'No se pudo subir la imagen';
      toast(msg, 'error');
    } finally {
      setUploadingCover(false);
    }
  };

  const getMyLocation = () => {
    if (!navigator.geolocation) {
      toast('Tu navegador no soporta geolocalización', 'error');
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: Math.round(pos.coords.latitude * 1000000) / 1000000,
          longitude: Math.round(pos.coords.longitude * 1000000) / 1000000,
        }));
        setGettingLocation(false);
        toast('Ubicación obtenida', 'success');
      },
      () => {
        setGettingLocation(false);
        toast('No se pudo obtener la ubicación', 'error');
      },
      { enableHighAccuracy: true }
    );
  };

  const updateScheduleDay = (day: string, field: keyof ScheduleDay, value: string | boolean) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  /** Mismo horario que el lunes en martes–viernes (atajo típico de restaurantes). */
  const copyMondayToWeekdays = () => {
    const lun = schedule.lun;
    setSchedule((prev) => ({
      ...prev,
      mar: { ...lun },
      mie: { ...lun },
      jue: { ...lun },
      vie: { ...lun },
    }));
    toast('Horario del lunes aplicado a martes–viernes', 'success');
  };

  if (isLoading) {
    return (
      <div className="space-y-6 overflow-x-hidden">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <FadeIn>
          <h1 className="text-3xl font-display font-bold text-n-900">Perfil del restaurante</h1>
          <p className="text-n-500 mt-1">Personaliza cómo se ve tu restaurante para los clientes</p>
        </FadeIn>

        <form onSubmit={handleSubmit}>
          <StaggerContainer className="space-y-6">

            {/* === INFO BÁSICA === */}
            <StaggerItem>
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-n-100 space-y-5">
                <SectionHeader icon={Store} title="Información básica" />
                <Input
                  label="Nombre del restaurante"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Burger Lab Yumbo"
                />
                <Textarea
                  label="Descripción"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Describe tu propuesta de valor..."
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Dirección"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Calle 12 #34-56, Yumbo"
                  />
                  <Input
                    label="WhatsApp"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="+573001112233"
                    iconLeft={<MessageCircle className="w-4 h-4" />}
                  />
                </div>
                <Input
                  label="Categoría"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Hamburguesas, Sushi, Comida Casera..."
                  hint="Ayuda a los usuarios a filtrar en el feed"
                />
              </div>
            </StaggerItem>

            {/* === IMÁGENES === */}
            <StaggerItem>
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-n-100 space-y-6">
                <SectionHeader icon={ImagePlus} title="Imágenes del restaurante" />
                <p className="text-sm text-n-600 rounded-xl bg-primary/5 border border-primary/15 px-4 py-3">
                  <strong className="text-n-800">Cómo funciona:</strong> primero eliges el archivo en tu teléfono o PC,
                  luego pulsas <strong>Subir a la nube</strong> (eso guarda la imagen en el almacenamiento).
                  Al final, <strong>Guardar cambios</strong> (abajo) envía todo el perfil, incluidas las URLs nuevas, al servidor.
                </p>

                {/* Logo */}
                <div className="rounded-2xl border border-n-200 p-4 sm:p-5 space-y-4 bg-n-50/80">
                  <div>
                    <p className="text-base font-semibold text-n-900">Logo</p>
                    <p className="text-xs text-n-500 mt-1">
                      Cuadrado o casi cuadrado. Se usa en el menú público y como respaldo si no hay foto de portada.
                      Recomendado: <strong>mín. 400×400 px</strong>, sin bordes negros alrededor (recorta antes si hace falta).
                    </p>
                  </div>
                  {form.logoUrl ? (
                    <div className="flex items-center gap-3">
                      <img src={form.logoUrl} alt="Logo actual" className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-sm" />
                      <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        Hay un logo cargado (puedes reemplazarlo)
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">Aún no hay logo.</p>
                  )}
                  <ol className="space-y-3 text-sm">
                    <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="shrink-0 font-bold text-primary w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs">1</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-n-800">Elegir archivo</p>
                        <input
                          id="perfil-logo-file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                          className="sr-only"
                        />
                        <label
                          htmlFor="perfil-logo-file"
                          className="cursor-pointer mt-1 inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-n-300 bg-white px-4 py-3 text-sm font-medium text-n-700 hover:border-primary hover:bg-primary/5 transition-colors w-full sm:w-auto justify-center"
                        >
                          <ImagePlus className="w-4 h-4 text-primary" />
                          {logoFile ? logoFile.name : 'Toca para elegir imagen del logo'}
                        </label>
                      </div>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:items-start gap-2">
                      <span className="shrink-0 font-bold text-primary w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs">2</span>
                      <div className="flex-1 min-w-0 space-y-2">
                        <p className="font-medium text-n-800">Subir a la nube (solo la imagen)</p>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={uploadLogo}
                          disabled={!logoFile || uploadingLogo}
                          isLoading={uploadingLogo}
                          className="w-full sm:w-auto"
                        >
                          <Upload className="w-4 h-4" />
                          Subir logo a la nube
                        </Button>
                        {!logoFile && (
                          <p className="text-xs text-n-400">Este botón se activa cuando ya elegiste un archivo en el paso 1.</p>
                        )}
                      </div>
                    </li>
                  </ol>
                </div>

                {/* Portada / feed */}
                <div className="rounded-2xl border border-n-200 p-4 sm:p-5 space-y-4 bg-n-50/80">
                  <div>
                    <p className="text-base font-semibold text-n-900">Foto de portada (feed)</p>
                    <p className="text-xs text-n-500 mt-1">
                      Es la imagen grande que sale en el <strong>feed</strong>. Mejor <strong>horizontal</strong> (tipo 4:3 o 16:9),
                      bien iluminada. Si subes una foto con franjas negras arriba/abajo o a los lados, se verán en la tarjeta:
                      conviene recortar la foto antes de subirla.
                    </p>
                  </div>
                  {form.coverUrl ? (
                    <div className="space-y-2">
                      <div className="relative w-full max-w-md aspect-4/3 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-n-200">
                        <img src={form.coverUrl} alt="Portada actual" className="absolute inset-0 size-full object-cover object-center" />
                      </div>
                      <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        Hay portada cargada (puedes reemplazarla)
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      Sin portada: en el feed se usará el logo ampliado, que a veces se ve con bandas. Sube una foto horizontal aquí.
                    </p>
                  )}
                  <ol className="space-y-3 text-sm">
                    <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="shrink-0 font-bold text-primary w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs">1</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-n-800">Elegir archivo</p>
                        <input
                          id="perfil-cover-file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                          className="sr-only"
                        />
                        <label
                          htmlFor="perfil-cover-file"
                          className="cursor-pointer mt-1 inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-n-300 bg-white px-4 py-3 text-sm font-medium text-n-700 hover:border-primary hover:bg-primary/5 transition-colors w-full sm:w-auto justify-center"
                        >
                          <ImagePlus className="w-4 h-4 text-primary" />
                          {coverFile ? coverFile.name : 'Toca para elegir foto de portada'}
                        </label>
                      </div>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:items-start gap-2">
                      <span className="shrink-0 font-bold text-primary w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs">2</span>
                      <div className="flex-1 min-w-0 space-y-2">
                        <p className="font-medium text-n-800">Subir a la nube (solo la imagen)</p>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={uploadCover}
                          disabled={!coverFile || uploadingCover}
                          isLoading={uploadingCover}
                          className="w-full sm:w-auto"
                        >
                          <Upload className="w-4 h-4" />
                          Subir portada a la nube
                        </Button>
                        {!coverFile && (
                          <p className="text-xs text-n-400">Este botón se activa cuando ya elegiste un archivo en el paso 1.</p>
                        )}
                      </div>
                    </li>
                  </ol>
                </div>

                <Input
                  label="Texto del banner"
                  value={form.bannerText}
                  onChange={(e) => setForm({ ...form, bannerText: e.target.value })}
                  placeholder="Ej: ¡Los mejores tacos de Yumbo!"
                  hint="Se muestra sobre el color del banner en tu página pública"
                />
              </div>
            </StaggerItem>

            {/* === PERSONALIZACIÓN VISUAL === */}
            <StaggerItem>
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-n-100 space-y-5">
                <SectionHeader icon={Palette} title="Personalización visual" />

                {/* Theme preset */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-n-700">Paleta visual</label>
                    <select
                      value={form.themePreset}
                      onChange={(e) => setForm({ ...form, themePreset: e.target.value })}
                      className="w-full border border-n-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="SUNSET">Sunset (naranja)</option>
                      <option value="FOREST">Forest (verde)</option>
                      <option value="OCEAN">Ocean (azul)</option>
                      <option value="BERRY">Berry (morado)</option>
                      <option value="MONO">Mono (neutro)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-n-700">Estilo de tarjetas</label>
                    <select
                      value={form.menuStyle}
                      onChange={(e) => setForm({ ...form, menuStyle: e.target.value })}
                      className="w-full border border-n-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="ROUNDED">Rounded</option>
                      <option value="SOFT">Soft shadow</option>
                      <option value="MINIMAL">Minimal</option>
                    </select>
                  </div>
                </div>

                {/* Custom colors */}
                <div>
                  <p className="text-sm font-medium text-n-700 mb-2">Colores personalizados</p>
                  <p className="text-xs text-n-400 mb-3">Primario para botones/textos y secundario para el banner superior</p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl border-2 border-n-200 cursor-pointer overflow-hidden relative"
                        style={{ backgroundColor: form.primaryColor || '#e5e5e5' }}
                      >
                        <input
                          type="color"
                          value={form.primaryColor || '#ff6b35'}
                          onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-n-600">Primario</p>
                        <p className="text-[10px] text-n-400 font-mono">{form.primaryColor || 'Sin definir'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl border-2 border-n-200 cursor-pointer overflow-hidden relative"
                        style={{ backgroundColor: form.secondaryColor || '#e5e5e5' }}
                      >
                        <input
                          type="color"
                          value={form.secondaryColor || '#1a1a1a'}
                          onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-n-600">Secundario</p>
                        <p className="text-[10px] text-n-400 font-mono">{form.secondaryColor || 'Sin definir'}</p>
                      </div>
                    </div>
                    {(form.primaryColor || form.secondaryColor) && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, primaryColor: '', secondaryColor: '' })}
                        className="text-xs text-red-500 hover:text-red-600 self-start sm:self-center"
                      >
                        Limpiar colores
                      </button>
                    )}
                  </div>
                </div>

                {/* Font */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-n-700">
                      <Type className="w-3.5 h-3.5 inline mr-1.5" />
                      Fuente
                    </label>
                    <select
                      value={form.fontFamily}
                      onChange={(e) => setForm({ ...form, fontFamily: e.target.value })}
                      className="w-full border border-n-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      style={form.fontFamily ? { fontFamily: form.fontFamily } : undefined}
                    >
                      {FONTS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Menu layout */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-n-700">Layout del menú</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, menuLayout: 'list' })}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          form.menuLayout === 'list'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-n-200 text-n-500 hover:border-n-300'
                        }`}
                      >
                        <LayoutList className="w-4 h-4" />
                        Lista
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, menuLayout: 'grid' })}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          form.menuLayout === 'grid'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-n-200 text-n-500 hover:border-n-300'
                        }`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                        Grilla
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vista previa de fuente (menú público) */}
                <div className="rounded-xl p-4 border border-n-100 bg-n-50">
                  <p className="text-xs font-medium text-n-500 mb-2">Vista previa de fuente</p>
                  <div
                    className="rounded-xl border border-n-200 bg-white p-4 shadow-sm space-y-3"
                    style={form.fontFamily ? { fontFamily: form.fontFamily } : undefined}
                  >
                    <p className="text-lg font-black text-n-900">Tu restaurante</p>
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-n-100 bg-n-50/80 px-3 py-2">
                      <span className="text-sm font-semibold text-n-800">Plato de ejemplo</span>
                      <span className="text-sm font-bold text-primary">$ 15.000</span>
                    </div>
                    <button
                      type="button"
                      className="w-full rounded-xl py-2.5 text-xs font-black uppercase tracking-wider text-white bg-n-900"
                    >
                      Añadir al pedido
                    </button>
                  </div>
                </div>

                {/* Color preview */}
                {form.primaryColor && (
                  <div className="rounded-xl p-4 border border-n-100 bg-n-50">
                    <p className="text-xs font-medium text-n-500 mb-2">Vista previa</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="h-10 px-5 rounded-xl text-white text-sm font-bold flex items-center" style={{ backgroundColor: form.primaryColor }}>
                        Botón primario
                      </div>
                      <div className="text-sm font-bold" style={{ color: form.primaryColor }}>
                        Texto acentuado
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </StaggerItem>

            {/* === REDES SOCIALES === */}
            <StaggerItem>
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-n-100 space-y-5">
                <SectionHeader icon={Globe} title="Redes sociales" />
                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    label="Instagram"
                    value={form.instagram}
                    onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                    placeholder="tu_usuario"
                    iconLeft={<Instagram className="w-4 h-4" />}
                    hint="Sin @"
                  />
                  <Input
                    label="TikTok"
                    value={form.tiktok}
                    onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
                    placeholder="tu_usuario"
                    hint="Sin @"
                  />
                  <Input
                    label="Facebook"
                    value={form.facebook}
                    onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                    placeholder="tu_pagina"
                    hint="Nombre de página o usuario"
                  />
                </div>
              </div>
            </StaggerItem>

            {/* === UBICACIÓN === */}
            <StaggerItem>
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-n-100 space-y-5">
                <SectionHeader icon={MapPin} title="Ubicación" />
                <p className="text-xs text-n-400">Los clientes verán qué tan cerca están de tu restaurante</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Latitud"
                    type="number"
                    step="0.000001"
                    value={form.latitude?.toString() ?? ''}
                    onChange={(e) => setForm({ ...form, latitude: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="3.5847"
                  />
                  <Input
                    label="Longitud"
                    type="number"
                    step="0.000001"
                    value={form.longitude?.toString() ?? ''}
                    onChange={(e) => setForm({ ...form, longitude: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="-76.4953"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getMyLocation}
                  isLoading={gettingLocation}
                  className="w-full sm:w-auto"
                >
                  <MapPin className="w-4 h-4" />
                  Usar mi ubicación actual
                </Button>
                {mapReady ? (
                  <RestaurantLocationMap
                    latitude={form.latitude}
                    longitude={form.longitude}
                    onPositionChange={(lat, lng) => setForm((f) => ({ ...f, latitude: lat, longitude: lng }))}
                  />
                ) : (
                  <div className="h-56 w-full animate-pulse rounded-xl border border-n-200 bg-n-100 sm:h-72" aria-hidden />
                )}
              </div>
            </StaggerItem>

            {/* === HORARIOS (Radix / estilo shadcn + inputs nativos type=time) === */}
            <StaggerItem>
              <div className="rounded-2xl border border-n-100 bg-white p-4 sm:p-6 space-y-4">
                <SectionHeader icon={Clock} title="Horarios de atención" />
                <p className="text-xs text-n-500 leading-relaxed -mt-1">
                  El interruptor usa el patrón accesible de Radix (como shadcn). Las horas usan el{' '}
                  <strong className="text-n-700">selector nativo</strong> del sistema al tocar el campo
                  (iOS / Android / escritorio). Guarda con «Guardar cambios».
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyMondayToWeekdays}
                  className="w-full sm:w-auto"
                >
                  <Copy className="w-4 h-4" />
                  Copiar horario del lunes a martes–viernes
                </Button>

                <div className="space-y-3 pt-1">
                  {DAYS.map(({ key, label }) => {
                    const day = schedule[key];
                    const idOpen = `schedule-${key}-open`;
                    const idClose = `schedule-${key}-close`;
                    const switchId = `schedule-${key}-switch`;
                    const initials =
                      key === 'mie'
                        ? 'Mi'
                        : key === 'sab'
                          ? 'Sa'
                          : key === 'dom'
                            ? 'Do'
                            : label.slice(0, 2);

                    return (
                      <Card
                        key={key}
                        as="div"
                        className={cn(
                          'overflow-visible shadow-sm transition-colors',
                          day.closed
                            ? 'border-red-100/90 bg-red-50/20'
                            : 'border-n-200 bg-n-50/30 hover:border-primary/20'
                        )}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-start gap-3">
                              <div
                                className={cn(
                                  'flex size-11 shrink-0 items-center justify-center rounded-xl text-xs font-black tabular-nums',
                                  day.closed ? 'bg-red-100 text-red-700' : 'bg-primary/12 text-primary'
                                )}
                                aria-hidden
                              >
                                {initials}
                              </div>
                              <div className="min-w-0 space-y-1">
                                <Label
                                  htmlFor={switchId}
                                  className="cursor-pointer text-base font-semibold text-n-900"
                                >
                                  {label}
                                </Label>
                                <p className="text-xs text-n-500 leading-snug">
                                  {day.closed
                                    ? 'Sin atención este día en el menú público'
                                    : `Clientes verán: ${day.open} – ${day.close}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 sm:shrink-0">
                              <span
                                className={cn(
                                  'text-xs font-medium tabular-nums',
                                  day.closed ? 'text-red-600/90' : 'text-emerald-700'
                                )}
                              >
                                {day.closed ? 'Cerrado' : 'Abierto'}
                              </span>
                              <Switch
                                id={switchId}
                                checked={!day.closed}
                                onCheckedChange={(open) => updateScheduleDay(key, 'closed', !open)}
                                aria-label={day.closed ? `Abrir ${label}` : `Cerrar ${label}`}
                              />
                            </div>
                          </div>
                        </CardHeader>

                        {!day.closed && (
                          <>
                            <Separator className="bg-n-200/90" />
                            <CardContent className="pt-4">
                              <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                                <Input
                                  id={idOpen}
                                  label="Apertura"
                                  type="time"
                                  value={day.open}
                                  onChange={(e) => updateScheduleDay(key, 'open', e.target.value)}
                                  className="min-h-12 text-base tabular-nums sm:min-h-11 sm:text-sm"
                                  hint="Selector de hora del dispositivo"
                                />
                                <Input
                                  id={idClose}
                                  label="Cierre"
                                  type="time"
                                  value={day.close}
                                  onChange={(e) => updateScheduleDay(key, 'close', e.target.value)}
                                  className="min-h-12 text-base tabular-nums sm:min-h-11 sm:text-sm"
                                  hint="Selector de hora del dispositivo"
                                />
                              </div>
                            </CardContent>
                          </>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            </StaggerItem>

            {/* === ESTADO === */}
            <StaggerItem>
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-n-100">
                <div className="flex items-start sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-n-800">Restaurante cerrado</p>
                    <p className="text-xs text-n-500 mt-0.5">Si está cerrado, los clientes verán que no estás recibiendo pedidos</p>
                  </div>
                  <Toggle
                    checked={form.isClosed}
                    onChange={(v) => setForm({ ...form, isClosed: v })}
                  />
                </div>
              </div>
            </StaggerItem>

            {/* === GUARDAR === */}
            <StaggerItem>
              <Button type="submit" isLoading={update.isPending} className="w-full md:w-auto">
                <Save className="w-4 h-4" />
                Guardar cambios
              </Button>
            </StaggerItem>

          </StaggerContainer>
        </form>
      </div>
    </PageTransition>
  );
}
