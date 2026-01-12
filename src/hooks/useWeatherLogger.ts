import { useCallback, useRef } from 'react';
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

interface LogWeatherViewParams {
  latitude: number;
  longitude: number;
  locationName?: string;
  pageSource?: string;
}

export const useWeatherLogger = () => {
  const lastLogRef = useRef<string>('');
  
  const logWeatherView = useCallback(async ({
    latitude,
    longitude,
    locationName,
    pageSource
  }: LogWeatherViewParams) => {
    // Dedupe: don't log the same coordinates twice in quick succession
    const logKey = `${latitude.toFixed(4)}-${longitude.toFixed(4)}`;
    if (lastLogRef.current === logKey) return;
    lastLogRef.current = logKey;
    
    try {
      const { error } = await supabase
        .from('weather_coordinate_logs')
        .insert({
          session_id: getSessionId(),
          latitude,
          longitude,
          location_name: locationName,
          page_source: pageSource || window.location.pathname,
          user_agent: navigator.userAgent
        });
      
      if (error) {
        console.error('Failed to log weather view:', error);
      }
    } catch (err) {
      console.error('Weather logging error:', err);
    }
  }, []);
  
  return { logWeatherView };
};
