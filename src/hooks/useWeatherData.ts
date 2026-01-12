import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useWeatherData = (lat?: number, lon?: number) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [lat, lon]);

  return { weather, loading, error, refetch: () => setWeather(null) };
};
