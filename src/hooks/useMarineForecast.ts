import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MarinePeriod {
  name: string;
  wind: string;
  seas: string;
  conditions: string;
}

export interface MarineForecast {
  zone: string;
  location: string;
  issuedAt: string;
  warnings: string[];
  periods: MarinePeriod[];
  rawText: string;
}

export interface MarineZone {
  id: string;
  name: string;
  description: string;
}

// Coastal zones with their approximate bounding boxes
const COASTAL_ZONES: { zone: string; bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number } }[] = [
  { zone: 'anz233', bounds: { minLat: 41.2, maxLat: 41.7, minLon: -70.9, maxLon: -70.4 } }, // Vineyard Sound
  { zone: 'anz230', bounds: { minLat: 41.7, maxLat: 42.2, minLon: -70.6, maxLon: -69.9 } }, // Cape Cod Bay
  { zone: 'anz232', bounds: { minLat: 41.2, maxLat: 41.6, minLon: -70.5, maxLon: -69.8 } }, // Nantucket Sound
  { zone: 'anz231', bounds: { minLat: 41.4, maxLat: 41.8, minLon: -71.1, maxLon: -70.6 } }, // Buzzards Bay
  { zone: 'anz234', bounds: { minLat: 41.0, maxLat: 41.4, minLon: -71.8, maxLon: -71.2 } }, // Block Island Sound
];

// Distance from coast to consider "near water" (in degrees, ~30km)
const COASTAL_THRESHOLD = 0.3;

export const useMarineForecast = (lat?: number, lon?: number) => {
  const [forecast, setForecast] = useState<MarineForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNearWater, setIsNearWater] = useState(false);
  const [detectedZone, setDetectedZone] = useState<string | null>(null);

  // Determine if location is near coastal waters and find closest zone
  const detectCoastalZone = useCallback((latitude: number, longitude: number): string | null => {
    for (const { zone, bounds } of COASTAL_ZONES) {
      // Check if within zone bounds with threshold
      const inLatRange = latitude >= bounds.minLat - COASTAL_THRESHOLD && latitude <= bounds.maxLat + COASTAL_THRESHOLD;
      const inLonRange = longitude >= bounds.minLon - COASTAL_THRESHOLD && longitude <= bounds.maxLon + COASTAL_THRESHOLD;
      
      if (inLatRange && inLonRange) {
        return zone;
      }
    }
    
    // Fallback: if near any Massachusetts coast (rough check)
    if (latitude >= 41.0 && latitude <= 42.5 && longitude >= -71.5 && longitude <= -69.5) {
      return 'anz233'; // Default to Vineyard Sound
    }
    
    return null;
  }, []);

  const fetchForecast = useCallback(async (zone: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('noaa-marine', {
        body: { zone }
      });

      if (fnError) throw new Error(fnError.message);
      if (!data.success) throw new Error(data.error || 'Failed to fetch marine forecast');

      setForecast(data.data);
    } catch (err) {
      console.error('Marine forecast error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch marine forecast');
    } finally {
      setLoading(false);
    }
  }, []);

  // Check location and fetch forecast if near water
  useEffect(() => {
    if (lat === undefined || lon === undefined) {
      setIsNearWater(false);
      setDetectedZone(null);
      return;
    }

    const zone = detectCoastalZone(lat, lon);
    setDetectedZone(zone);
    setIsNearWater(!!zone);

    if (zone) {
      fetchForecast(zone);
    }
  }, [lat, lon, detectCoastalZone, fetchForecast]);

  const refetch = useCallback(() => {
    if (detectedZone) {
      fetchForecast(detectedZone);
    }
  }, [detectedZone, fetchForecast]);

  return {
    forecast,
    loading,
    error,
    isNearWater,
    detectedZone,
    refetch,
  };
};
