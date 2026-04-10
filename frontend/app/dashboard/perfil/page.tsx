'use client';

import { useState, useLayoutEffect, useMemo, type ElementType } from 'react';
import Link from 'next/link';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';
import { motion } from 'framer-motion';
import {
  Save,
  ImagePlus,
  MapPin,
  Palette,
  Type,
  LayoutGrid,
  LayoutList,
  Instagram,
  Globe,
  Clock,
  MessageCircle,
  Store,
  Upload,
  CheckCircle2,
  Copy,
  ExternalLink,
  ChevronRight,
  Truck,
  Plus,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseDeliveryZones } from '@/lib/delivery-zones';
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
] as const;

const THEME_PRESETS = [
  { value: 'SUNSET', label: 'Sunset — naranja cálido' },
  { value: 'FOREST', label: 'Forest — verde natural' },
  { value: 'OCEAN', label: 'Ocean — azul fresco' },
  { value: 'BERRY', label: 'Berry — morado' },
  { value: 'MONO', label: 'Mono — neutro elegante' },
] as const;

const MENU_STYLES = [
  { value: 'ROUNDED', label: 'Rounded — bordes redondeados' },
  { value: 'SOFT', label: 'Soft — sombra suave' },
  { value: 'MINIMAL', label: 'Minimal — limpio' },
] as const;

const FONT_DEFAULT = '__font_default__';

const SECTION_LINKS = [
  { id: 'perfil-basico', label: 'Datos' },
  { id: 'perfil-envio', label: 'Envío' },
  { id: 'perfil-imagenes', label: 'Imágenes' },
  { id: 'perfil-visual', label: 'Estilo' },
  { id: 'perfil-redes', label: 'Redes' },
  { id: 'perfil-mapa', label: 'Mapa' },
  { id: 'perfil-horarios', label: 'Horarios' },
  { id: 'perfil-estado', label: 'Estado' },
] as const;

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

function ProfileSection({
  id,
  icon: Icon,
  title,
  description,
  children,
}: {
  id: string;
  icon: ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-8 overflow-hidden rounded-3xl border-2 border-n-200/85 bg-white shadow-[0_2px_14px_rgba(15,23,42,0.045)]"
    >
      <div className="border-b border-n-100 bg-linear-to-br from-primary/10 via-white to-n-50/90 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-sm shadow-primary/8">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 pt-0.5">
            <h2 className="font-display text-lg font-black tracking-tight text-n-900 sm:text-xl">{title}</h2>
            {description ? <p className="mt-1 text-sm leading-relaxed text-n-500">{description}</p> : null}
          </div>
        </div>
      </div>
      <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">{children}</div>
    </section>
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
    deliveryZones: [] as { name: string; price: number }[],
  });

  const { data, isLoading } = useMyRestaurant();

  const completeness = useMemo(() => {
    if (!data) return 0;
    const r = data;
    const fields = [
      !!r.name,
      !!r.description,
      !!r.address,
      !!r.whatsapp,
      !!r.logoUrl,
      !!r.coverUrl,
      numOrNull(r.latitude) != null && numOrNull(r.longitude) != null,
      !!(r.instagram || r.facebook || r.tiktok),
      !!r.schedule,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [data]);

  const publicSlug = typeof data?.slug === 'string' ? data.slug : undefined;

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
      themePreset:
        (r.themePreset && THEME_PRESETS.some((t) => t.value === r.themePreset) ? r.themePreset : null) || 'SUNSET',
      menuStyle: (r.menuStyle && MENU_STYLES.some((m) => m.value === r.menuStyle) ? r.menuStyle : null) || 'ROUNDED',
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
      deliveryZones: parseDeliveryZones((r as { deliveryZones?: unknown }).deliveryZones),
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
    if (payload.menuStyle === '' || payload.menuStyle == null) payload.menuStyle = 'ROUNDED';
    if (payload.themePreset === '' || payload.themePreset == null) payload.themePreset = 'SUNSET';
    const zones = (form.deliveryZones ?? [])
      .map((z) => ({
        name: z.name.trim(),
        price: Math.max(0, typeof z.price === 'number' && !Number.isNaN(z.price) ? z.price : Number(z.price) || 0),
      }))
      .filter((z) => z.name.length > 0);
    payload.deliveryZones = zones;
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
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="grid gap-4">
          <Skeleton className="h-56 w-full rounded-3xl" />
          <Skeleton className="h-72 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8 pb-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border-2 border-n-800 bg-linear-to-br from-n-900 via-n-900 to-n-950 p-6 text-white shadow-[0_20px_50px_-12px_rgba(15,23,42,0.35)] sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Perfil del restaurante</p>
                <h1 className="mt-1 font-display text-2xl font-black tracking-tight sm:text-3xl">
                  {data?.name?.trim() || 'Tu restaurante'}
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-n-400">
                  Aquí defines cómo te ven en el feed y en tu menú público. Los cambios se guardan al pulsar{' '}
                  <span className="font-semibold text-n-300">Guardar cambios</span> al final.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {publicSlug ? (
                    <Link
                      href={`/${publicSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/15"
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                      Ver menú público
                      <ChevronRight className="h-4 w-4 opacity-70" aria-hidden />
                    </Link>
                  ) : null}
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-semibold text-n-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Volver al inicio
                  </Link>
                </div>
              </div>
              <div className="w-full shrink-0 lg:max-w-xs">
                <div className="flex items-center justify-between gap-2 text-[10px] font-black uppercase tracking-widest text-n-500">
                  <span>Perfil completado</span>
                  <span className="text-primary">{completeness}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-n-800">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${completeness}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                  />
                </div>
                {completeness < 100 && (
                  <p className="mt-2 text-[11px] leading-snug text-n-500">
                    Completa datos, fotos y ubicación para destacar en el feed.
                  </p>
                )}
              </div>
            </div>
          </div>

          <nav
            className="flex flex-wrap gap-2 border-b border-n-200/90 pb-1 pt-2"
            aria-label="Ir a sección del perfil"
          >
            {SECTION_LINKS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full border border-n-200/90 bg-white px-3.5 py-1.5 text-xs font-bold text-n-600 shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              >
                {label}
              </a>
            ))}
          </nav>
        </FadeIn>

        <form onSubmit={handleSubmit} className="space-y-8">
          <StaggerContainer className="space-y-8">

            {/* === INFO BÁSICA === */}
            <StaggerItem>
              <ProfileSection
                id="perfil-basico"
                icon={Store}
                title="Información básica"
                description="Nombre, descripción y datos de contacto. Aparecen en el feed y en tu página pública."
              >
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
              </ProfileSection>
            </StaggerItem>

            <StaggerItem>
              <ProfileSection
                id="perfil-envio"
                icon={Truck}
                title="Zonas de domicilio"
                description="Define barrios o zonas con precio fijo de envío. En el pedido el cliente elige la suya y el total incluye el domicilio. Si no agregas ninguna, el flujo sigue como antes (solo dirección y barrio)."
              >
                <p className="rounded-2xl border border-n-200/80 bg-n-50/60 px-4 py-3 text-sm text-n-600">
                  Ejemplo: <strong className="text-n-800">Yumbo</strong> $5.000,{' '}
                  <strong className="text-n-800">Guabinas</strong> $7.000. Los precios son en pesos colombianos.
                </p>
                <div className="space-y-3">
                  {form.deliveryZones.length === 0 ? (
                    <p className="text-sm text-n-500">Aún no hay zonas. Pulsa &quot;Agregar zona&quot; para empezar.</p>
                  ) : (
                    <ul className="space-y-3">
                      {form.deliveryZones.map((z, idx) => (
                        <li
                          key={idx}
                          className="flex flex-col gap-3 rounded-2xl border border-n-200/90 bg-white p-4 sm:flex-row sm:items-end"
                        >
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <Label className="text-xs font-bold text-n-500 uppercase tracking-wider">Nombre de la zona</Label>
                            <Input
                              value={z.name}
                              onChange={(e) => {
                                const next = [...form.deliveryZones];
                                next[idx] = { ...next[idx], name: e.target.value };
                                setForm({ ...form, deliveryZones: next });
                              }}
                              placeholder="Ej: Yumbo, Centro, Guabinas…"
                            />
                          </div>
                          <div className="w-full sm:w-40 space-y-1.5">
                            <Label className="text-xs font-bold text-n-500 uppercase tracking-wider">Envío (COP)</Label>
                            <Input
                              type="number"
                              min={0}
                              step={500}
                              value={z.price === 0 ? '' : z.price}
                              onChange={(e) => {
                                const v = e.target.value;
                                const num = v === '' ? 0 : Math.max(0, Number(v) || 0);
                                const next = [...form.deliveryZones];
                                next[idx] = { ...next[idx], price: num };
                                setForm({ ...form, deliveryZones: next });
                              }}
                              placeholder="5000"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="shrink-0 border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() =>
                              setForm({
                                ...form,
                                deliveryZones: form.deliveryZones.filter((_, i) => i !== idx),
                              })
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                            Quitar
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setForm({
                        ...form,
                        deliveryZones: [...form.deliveryZones, { name: '', price: 0 }],
                      })
                    }
                    className="w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar zona
                  </Button>
                </div>
              </ProfileSection>
            </StaggerItem>

            {/* === IMÁGENES === */}
            <StaggerItem>
              <ProfileSection
                id="perfil-imagenes"
                icon={ImagePlus}
                title="Logo y portada"
                description="Primero subes cada imagen a la nube; luego guardas el perfil completo para publicar los cambios."
              >
                <p className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-n-700">
                  <strong className="text-n-900">Flujo:</strong> elegir archivo →{' '}
                  <strong className="text-n-900">Subir a la nube</strong> → al final{' '}
                  <strong className="text-n-900">Guardar cambios</strong>.
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
              </ProfileSection>
            </StaggerItem>

            {/* === ESTILO MENÚ PÚBLICO === */}
            <StaggerItem>
              <ProfileSection
                id="perfil-visual"
                icon={Palette}
                title="Estilo del menú público"
                description="Define cómo se ve tu carta en el enlace y el QR: acentos, tarjetas de platos y disposición."
              >
                {publicSlug ? (
                  <div className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-n-700">
                      Tras guardar, comprueba el resultado en tu página real.
                    </p>
                    <Link
                      href={`/${publicSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-n-200 bg-white px-4 py-2.5 text-sm font-bold text-n-800 shadow-sm transition-all hover:border-primary/35 hover:bg-white"
                    >
                      <ExternalLink className="h-4 w-4 text-primary" aria-hidden />
                      Ver menú público
                    </Link>
                  </div>
                ) : null}

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-n-800">Paleta de acentos</span>
                    <p className="text-xs text-n-500">
                      Tonos para categorías, iconos y detalles cuando no usas color hex propio.
                    </p>
                    <Select
                      value={form.themePreset || 'SUNSET'}
                      onValueChange={(v) => setForm({ ...form, themePreset: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Elige paleta" />
                      </SelectTrigger>
                      <SelectContent>
                        {THEME_PRESETS.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-n-800">Forma de las tarjetas</span>
                    <p className="text-xs text-n-500">Bordes y sombra de cada plato en la lista.</p>
                    <Select
                      value={form.menuStyle || 'ROUNDED'}
                      onValueChange={(v) => setForm({ ...form, menuStyle: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Elige estilo" />
                      </SelectTrigger>
                      <SelectContent>
                        {MENU_STYLES.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-2xl border border-n-200/80 bg-n-50/50 p-4 sm:p-5">
                  <p className="text-sm font-semibold text-n-900">Colores hex (opcional)</p>
                  <p className="mt-1 text-xs text-n-500">
                    El <strong className="text-n-700">primario</strong> pinta precios, botón + y pestañas activas. Si lo dejas vacío,
                    se usan solo los tonos de la paleta. El secundario queda listo para futuros detalles en la cabecera.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setForm({ ...form, primaryColor: '', secondaryColor: '' })}
                        className="self-start text-red-600 hover:bg-red-50 hover:text-red-700 sm:self-center"
                      >
                        Limpiar colores
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <span className="flex items-center gap-2 text-sm font-semibold text-n-800">
                      <Type className="h-4 w-4 text-primary" aria-hidden />
                      Tipografía
                    </span>
                    <p className="text-xs text-n-500">Se carga desde Google Fonts en la página del menú.</p>
                    <Select
                      value={form.fontFamily ? form.fontFamily : FONT_DEFAULT}
                      onValueChange={(v) =>
                        setForm({ ...form, fontFamily: v === FONT_DEFAULT ? '' : v })
                      }
                    >
                      <SelectTrigger
                        className="w-full"
                        style={form.fontFamily ? { fontFamily: form.fontFamily } : undefined}
                      >
                        <SelectValue placeholder="Tipografía del menú" />
                      </SelectTrigger>
                      <SelectContent>
                        {FONTS.map((f) => (
                          <SelectItem
                            key={f.value || FONT_DEFAULT}
                            value={f.value || FONT_DEFAULT}
                            textValue={f.label}
                            style={f.value ? { fontFamily: f.value } : undefined}
                          >
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-n-800">Disposición de platos</span>
                    <p className="text-xs text-n-500">Una columna o dos en pantallas anchas.</p>
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
              </ProfileSection>
            </StaggerItem>

            {/* === REDES SOCIALES === */}
            <StaggerItem>
              <ProfileSection
                id="perfil-redes"
                icon={Globe}
                title="Redes sociales"
                description="Opcional. Aparecen en tu ficha para que los clientes te sigan."
              >
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
              </ProfileSection>
            </StaggerItem>

            {/* === UBICACIÓN === */}
            <StaggerItem>
              <ProfileSection
                id="perfil-mapa"
                icon={MapPin}
                title="Ubicación en el mapa"
                description="Arrastra el pin o usa tu ubicación. Así el feed puede ordenar restaurantes cercanos."
              >
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
              </ProfileSection>
            </StaggerItem>

            {/* === HORARIOS (Radix / estilo shadcn + inputs nativos type=time) === */}
            <StaggerItem>
              <ProfileSection
                id="perfil-horarios"
                icon={Clock}
                title="Horarios de atención"
                description="Marca días cerrados o define apertura y cierre. El cliente lo ve en tu menú público."
              >
                <p className="text-xs leading-relaxed text-n-500">
                  Los interruptores son accesibles (Radix). Las horas usan el{' '}
                  <strong className="text-n-700">selector nativo</strong> del teléfono o del navegador.
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
              </ProfileSection>
            </StaggerItem>

            {/* === ESTADO === */}
            <StaggerItem>
              <ProfileSection
                id="perfil-estado"
                icon={Store}
                title="Disponibilidad"
                description="Si marcas como cerrado, los clientes verán que no recibes pedidos en este momento."
              >
                <div className="flex flex-col gap-4 rounded-2xl border border-n-200/80 bg-n-50/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-n-900">Modo cerrado</p>
                    <p className="mt-1 text-xs leading-relaxed text-n-500">
                      Actívalo cuando no quieras recibir pedidos; tu menú sigue visible.
                    </p>
                  </div>
                  <Toggle
                    checked={form.isClosed}
                    onChange={(v) => setForm({ ...form, isClosed: v })}
                    label={form.isClosed ? 'Cerrado a pedidos' : 'Abierto a pedidos'}
                  />
                </div>
              </ProfileSection>
            </StaggerItem>

            {/* === GUARDAR === */}
            <StaggerItem>
              <div className="sticky bottom-0 z-10 -mx-1 flex flex-col gap-3 rounded-3xl border-2 border-n-200/90 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <p className="text-sm text-n-500">
                  <span className="font-semibold text-n-800">Recuerda:</span> las subidas a la nube no sustituyen guardar el
                  formulario.
                </p>
                <Button type="submit" isLoading={update.isPending} className="w-full shrink-0 sm:w-auto sm:min-w-[200px]">
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </Button>
              </div>
            </StaggerItem>

          </StaggerContainer>
        </form>
      </div>
    </PageTransition>
  );
}
