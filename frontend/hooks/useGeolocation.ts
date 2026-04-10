'use client';

import { useState, useCallback, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  requested: boolean;
}

const STORAGE_KEY = 'ñami-user-location';

// Centro de Yumbo como fallback
const YUMBO_CENTER = { lat: 3.5847, lng: -76.4953 };

function getStoredLocation(): { lat: number; lng: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
    requested: false,
  });

  // Keep first client render identical to server render; hydrate stored location after mount.
  useEffect(() => {
    const stored = getStoredLocation();
    if (!stored) return;

    setState((s) => ({
      ...s,
      latitude: stored.lat,
      longitude: stored.lng,
      requested: true,
    }));
  }, []);

  const requestPermission = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'Geolocalización no soportada', requested: true }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
        setState({
          latitude: loc.lat,
          longitude: loc.lng,
          error: null,
          loading: false,
          requested: true,
        });
      },
      (err) => {
        setState((s) => ({
          ...s,
          error: err.code === 1 ? 'Permiso denegado' : 'Error al obtener ubicación',
          loading: false,
          requested: true,
        }));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return { ...state, requestPermission };
}
