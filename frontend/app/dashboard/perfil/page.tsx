'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { toast } from '@/components/ui/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';
import {
  Save, ImagePlus, MapPin, Palette, Type, LayoutGrid, LayoutList,
  Instagram, Globe, Clock, MessageCircle, Store,
} from 'lucide-react';

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

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-n-100">
      <Icon className="w-4 h-4 text-primary" />
      <p className="text-xs font-semibold text-n-500 uppercase tracking-wide">{title}</p>
    </div>
  );
}

export default function PerfilPage() {
  const qc = useQueryClient();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [schedule, setSchedule] = useState<Schedule>(() => parseSchedule(null));

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

  const { data, isLoading } = useQuery({
    queryKey: ['my-restaurant'],
    queryFn: () => api.get('/api/dashboard/restaurant'),
  });

  useEffect(() => {
    if (data?.data) {
      const r = data.data;
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
        latitude: r.latitude ?? null,
        longitude: r.longitude ?? null,
      });
      setSchedule(parseSchedule(r.schedule));
    }
  }, [data]);

  const update = useMutation({
    mutationFn: (body: Record<string, unknown>) => api.put('/api/dashboard/restaurant', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-restaurant'] });
      toast('Cambios guardados', 'success');
    },
    onError: () => toast('Error al guardar', 'error'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, unknown> = { ...form };
    payload.schedule = serializeSchedule(schedule);
    // Clean empty strings to null for nullable fields
    for (const key of ['primaryColor', 'secondaryColor', 'fontFamily', 'bannerText', 'instagram', 'tiktok', 'facebook']) {
      if (payload[key] === '') payload[key] = null;
    }
    if (payload.menuLayout === 'list') payload.menuLayout = null;
    update.mutate(payload);
  };

  const uploadImage = async () => {
    const file = logoFile;
    if (!file) return;

    setUploadingLogo(true);

    try {
      const sign = await api.post('/api/dashboard/upload-url', { filename: file.name });
      const signedUrl: string = sign?.data?.signedUrl;
      const publicUrl: string = sign?.data?.publicUrl;
      if (!signedUrl || !publicUrl) throw new Error('No se pudo obtener URL de subida');

      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });
      if (!uploadRes.ok) throw new Error('Error subiendo imagen');

      setForm((prev) => ({ ...prev, logoUrl: publicUrl }));
      toast('Logo subido', 'success');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'No se pudo subir la imagen';
      toast(msg, 'error');
    } finally {
      setUploadingLogo(false);
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
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-n-100 space-y-5">
                <SectionHeader icon={ImagePlus} title="Imágenes" />
                <div className="rounded-xl border border-dashed border-n-200 p-4 bg-n-50">
                  <p className="text-sm font-semibold mb-3">Logo del restaurante</p>
                  {form.logoUrl && (
                    <img src={form.logoUrl} alt="Logo" className="w-20 h-20 rounded-2xl object-cover border-2 border-n-100 mb-3" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    className="text-sm mb-2 w-full"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={uploadImage}
                    disabled={!logoFile || uploadingLogo}
                    isLoading={uploadingLogo}
                  >
                    <ImagePlus className="w-4 h-4" />
                    Subir logo
                  </Button>
                </div>
                <Input
                  label="Texto del banner"
                  value={form.bannerText}
                  onChange={(e) => setForm({ ...form, bannerText: e.target.value })}
                  placeholder="Ej: ¡Los mejores tacos de Yumbo!"
                  hint="Se muestra sobre el color del banner"
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
              </div>
            </StaggerItem>

            {/* === HORARIOS === */}
            <StaggerItem>
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-n-100 space-y-5">
                <SectionHeader icon={Clock} title="Horarios de atención" />
                <div className="space-y-2">
                  {DAYS.map(({ key, label }) => {
                    const day = schedule[key];
                    return (
                      <div
                        key={key}
                        className={`rounded-xl px-3 sm:px-4 py-3 transition-colors ${
                          day.closed ? 'bg-red-50/50' : 'bg-n-50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-n-700">{label}</span>
                          <Toggle
                            size="sm"
                            checked={!day.closed}
                            onChange={(v) => updateScheduleDay(key, 'closed', !v)}
                          />
                        </div>
                        <div className="mt-2 flex-1">
                          {day.closed ? (
                            <span className="text-sm text-red-400">Cerrado</span>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 items-center">
                              <input
                                type="time"
                                value={day.open}
                                onChange={(e) => updateScheduleDay(key, 'open', e.target.value)}
                                className="w-full min-w-0 border border-n-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                              />
                              <span className="hidden sm:inline text-n-400 text-sm text-center">—</span>
                              <input
                                type="time"
                                value={day.close}
                                onChange={(e) => updateScheduleDay(key, 'close', e.target.value)}
                                className="w-full min-w-0 border border-n-200 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                              />
                            </div>
                          )}
                        </div>
                      </div>
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
