'use client';

import { useEffect, useRef } from 'react';

const DEFAULT_LAT = 3.5814;
const DEFAULT_LNG = -76.4833;

const round6 = (n: number) => Math.round(n * 1e6) / 1e6;

type Props = {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  onPositionChange: (lat: number, lng: number) => void;
};

export function RestaurantLocationMap({ latitude, longitude, onPositionChange }: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);
  const markerRef = useRef<import('leaflet').Marker | null>(null);
  const skipNextExternalSync = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let cancelled = false;

    void (async () => {
      const L = (await import('leaflet')).default;

      // Iconos en bundlers (Next.js)
      type IconProto = { _getIconUrl?: string };
      delete (L.Icon.Default.prototype as IconProto)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      if (cancelled || !elRef.current) return;

      const hasValid =
        typeof latitude === 'number' &&
        !Number.isNaN(latitude) &&
        typeof longitude === 'number' &&
        !Number.isNaN(longitude);
      const lat = hasValid ? latitude : DEFAULT_LAT;
      const lng = hasValid ? longitude : DEFAULT_LNG;

      const map = L.map(elRef.current, { scrollWheelZoom: true }).setView([lat, lng], 16);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      markerRef.current = marker;

      // Si no había coordenadas guardadas, el pin visible debe quedar reflejado en el formulario al guardar
      if (!hasValid) {
        skipNextExternalSync.current = true;
        onPositionChange(round6(lat), round6(lng));
      }

      marker.on('dragend', () => {
        const p = marker.getLatLng();
        skipNextExternalSync.current = true;
        onPositionChange(round6(p.lat), round6(p.lng));
      });

      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        skipNextExternalSync.current = true;
        onPositionChange(round6(e.latlng.lat), round6(e.latlng.lng));
      });

      setTimeout(() => map.invalidateSize(), 200);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init una vez; sync en otro efecto
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;
    if (latitude == null || longitude == null || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return;
    }
    if (skipNextExternalSync.current) {
      skipNextExternalSync.current = false;
      return;
    }
    const ll: [number, number] = [latitude, longitude];
    marker.setLatLng(ll);
    map.setView(ll, Math.max(map.getZoom(), 15));
  }, [latitude, longitude]);

  return (
    <div className="space-y-2">
      <p className="text-xs text-n-500">
        Toca el mapa o arrastra el pin para fijar la ubicación del restaurante (OpenStreetMap).
      </p>
      <div
        ref={elRef}
        className="relative z-0 h-56 w-full overflow-hidden rounded-xl border border-n-200 bg-n-100 sm:h-72"
      />
    </div>
  );
}
