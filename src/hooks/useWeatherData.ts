import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate or retrieve a session ID for anonymous tracking
const getSessionId = (): string => {
  const storageKey = 'weather_session_id';
  let sessionId = sessionStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
};

export interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    wind: number;
    windGusts: number;
    windDirection: string;
    condition: string;
    precipitation: number;
    fieldCondition: string;
  };
  adjustments: {
    shortRoutes: number;
    deepRoutes: number;
  };
  forecast: Array<{
    time: string;
    temp: number;
    precipProb: number;
    wind: number;
  }>;
  timestamp: string;
}

export const useWeatherData = (lat?: number, lon?: number, locationName?: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Log weather coordinate view to database
  const logWeatherView = useCallback(async (latitude: number, longitude: number, locName?: string) => {
    try {
      await supabase
        .from('weather_coordinate_logs')
        .insert({
          session_id: getSessionId(),
          latitude,
          longitude,
          location_name: locName,
          page_source: window.location.pathname,
          user_agent: navigator.userAgent
        });
    } catch (err) {
      console.error('Weather logging error:', err);
    }
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fnError } = await supabase.functions.invoke('get-weather', {
          body: { lat, lon },
        });

        if (fnError) {
          throw new Error(fnError.message);
        }

        setWeather(data);
        
        // Log this weather view if we have coordinates
        if (lat !== undefined && lon !== undefined) {
          logWeatherView(lat, lon, locationName);
        }
      } catch (err) {
        console.error('Failed to fetch weather:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch weather');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresh every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lat, lon, locationName, logWeatherView]);

  return { weather, loading, error, refetch: () => setWeather(null) };
};
