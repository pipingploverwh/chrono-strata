import { useState, useEffect, useCallback } from 'react';

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
  permissionState: 'prompt' | 'granted' | 'denied' | 'unavailable';
  locationName: string | null;
}

const STORAGE_KEY = 'user_geolocation';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  locationName: string | null;
  timestamp: number;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: false,
    error: null,
    permissionState: 'prompt',
    locationName: null,
  });

  // Check for cached location on mount
  useEffect(() => {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed: CachedLocation = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_DURATION) {
          setState(prev => ({
            ...prev,
            latitude: parsed.latitude,
            longitude: parsed.longitude,
            accuracy: parsed.accuracy,
            locationName: parsed.locationName,
            permissionState: 'granted',
          }));
        }
      } catch (e) {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Reverse geocode to get location name
  const reverseGeocode = useCallback(async (lat: number, lon: number): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
        { headers: { 'User-Agent': 'LavandarAI/1.0' } }
      );
      if (!response.ok) return null;
      const data = await response.json();
      
      const city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality;
      const state = data.address?.state;
      const country = data.address?.country_code?.toUpperCase();
      
      if (city && state) return `${city}, ${state}`;
      if (city && country) return `${city}, ${country}`;
      if (data.display_name) return data.display_name.split(',').slice(0, 2).join(',');
      return null;
    } catch {
      return null;
    }
  }, []);

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        permissionState: 'unavailable',
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const { latitude, longitude, accuracy } = position.coords;
      const locationName = await reverseGeocode(latitude, longitude);

      // Cache the location
      const cacheData: CachedLocation = {
        latitude,
        longitude,
        accuracy,
        locationName,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));

      setState({
        latitude,
        longitude,
        accuracy,
        loading: false,
        error: null,
        permissionState: 'granted',
        locationName,
      });
    } catch (err) {
      const error = err as GeolocationPositionError;
      let errorMessage = 'Failed to get location';
      let permState: 'prompt' | 'denied' = 'prompt';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location permission denied';
          permState = 'denied';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        permissionState: permState,
      }));
    }
  }, [reverseGeocode]);

  const clearLocation = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setState({
      latitude: null,
      longitude: null,
      accuracy: null,
      loading: false,
      error: null,
      permissionState: 'prompt',
      locationName: null,
    });
  }, []);

  return {
    ...state,
    requestLocation,
    clearLocation,
    hasLocation: state.latitude !== null && state.longitude !== null,
  };
};
