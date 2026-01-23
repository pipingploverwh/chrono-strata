import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CityLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  timezone: string;
  icao?: string; // For aviation data
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  windGusts: number;
  windDirection: string;
  condition: string;
  visibility?: number;
  ceiling?: string;
}

export interface MarineData {
  zone: string;
  location: string;
  warnings: string[];
  wind?: string;
  seas?: string;
  conditions?: string;
}

export interface AviationData {
  metar: string;
  ceiling: string;
  visibility: string;
  windSpeed: number;
  windDirection: string;
  conditions: string;
  flightRules: "VFR" | "MVFR" | "IFR" | "LIFR";
}

export interface CityData {
  location: CityLocation;
  weather: WeatherData | null;
  marine: MarineData | null;
  aviation: AviationData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// 8 strategic cities
export const OPERATIONS_CITIES: CityLocation[] = [
  { id: "tel-aviv", name: "Tel Aviv", lat: 32.0853, lon: 34.7818, timezone: "Asia/Jerusalem", icao: "LLBG" },
  { id: "tehran", name: "Tehran", lat: 35.6892, lon: 51.3890, timezone: "Asia/Tehran", icao: "OIIE" },
  { id: "dc", name: "Washington DC", lat: 38.9072, lon: -77.0369, timezone: "America/New_York", icao: "KDCA" },
  { id: "miami", name: "Miami", lat: 25.7617, lon: -80.1918, timezone: "America/New_York", icao: "KMIA" },
  { id: "boston", name: "Boston", lat: 42.3601, lon: -71.0589, timezone: "America/New_York", icao: "KBOS" },
  { id: "paris", name: "Paris", lat: 48.8566, lon: 2.3522, timezone: "Europe/Paris", icao: "LFPG" },
  { id: "tokyo", name: "Tokyo", lat: 35.6762, lon: 139.6503, timezone: "Asia/Tokyo", icao: "RJTT" },
  { id: "beijing", name: "Beijing", lat: 39.9042, lon: 116.4074, timezone: "Asia/Shanghai", icao: "ZBAA" },
];

// Simulated METAR data for demo (in production, integrate with aviation weather API)
const generateMockAviation = (city: CityLocation, weather: WeatherData | null): AviationData => {
  const visibility = weather ? (weather.condition.includes("Fog") ? 2 : 10) : 10;
  const windSpeed = weather?.wind || 8;
  const windDir = weather?.windDirection || "N";
  
  let flightRules: AviationData["flightRules"] = "VFR";
  if (visibility < 1) flightRules = "LIFR";
  else if (visibility < 3) flightRules = "IFR";
  else if (visibility < 5) flightRules = "MVFR";

  return {
    metar: `${city.icao} ${new Date().toISOString().slice(8, 10)}${new Date().getUTCHours().toString().padStart(2, "0")}55Z ${windDir.substring(0, 2).padStart(3, "0")}${windSpeed.toString().padStart(2, "0")}KT ${visibility}SM SCT045 BKN250 ${weather?.temp || 20}/${Math.round((weather?.temp || 20) - 8)} A3012`,
    ceiling: weather?.condition.includes("Clear") ? "CLR" : "BKN 4500",
    visibility: `${visibility} SM`,
    windSpeed,
    windDirection: windDir,
    conditions: weather?.condition || "Clear",
    flightRules,
  };
};

export function useOperationsData() {
  const [citiesData, setCitiesData] = useState<CityData[]>(
    OPERATIONS_CITIES.map((loc) => ({
      location: loc,
      weather: null,
      marine: null,
      aviation: null,
      loading: true,
      error: null,
      lastUpdated: null,
    }))
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCityData = useCallback(async (location: CityLocation): Promise<CityData> => {
    try {
      // Fetch weather
      const { data: weatherData, error: weatherError } = await supabase.functions.invoke(
        "get-weather",
        { body: { lat: location.lat, lon: location.lon } }
      );

      if (weatherError) throw weatherError;

      const weather: WeatherData = {
        temp: weatherData.current?.temp || 0,
        feelsLike: weatherData.current?.feelsLike || 0,
        humidity: weatherData.current?.humidity || 0,
        wind: weatherData.current?.wind || 0,
        windGusts: weatherData.current?.windGusts || 0,
        windDirection: weatherData.current?.windDirection || "N",
        condition: weatherData.current?.condition || "Unknown",
      };

      // Generate simulated aviation data (in production, use real METAR)
      const aviation = generateMockAviation(location, weather);

      // Marine data - only for coastal cities
      let marine: MarineData | null = null;
      if (["miami", "boston", "tokyo", "tel-aviv"].includes(location.id)) {
        marine = {
          zone: location.id.toUpperCase(),
          location: `${location.name} Coastal`,
          warnings: weather.wind > 20 ? ["SMALL CRAFT ADVISORY"] : [],
          wind: `${weather.windDirection} ${weather.wind} kt`,
          seas: weather.wind > 15 ? "4-6 ft" : "2-3 ft",
          conditions: weather.condition,
        };
      }

      return {
        location,
        weather,
        marine,
        aviation,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error(`Error fetching data for ${location.name}:`, error);
      return {
        location,
        weather: null,
        marine: null,
        aviation: null,
        loading: false,
        error: "Failed to load data",
        lastUpdated: null,
      };
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    const results = await Promise.all(OPERATIONS_CITIES.map(fetchCityData));
    setCitiesData(results);
    setIsRefreshing(false);
  }, [fetchCityData]);

  useEffect(() => {
    refreshAll();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(refreshAll, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshAll]);

  return { citiesData, isRefreshing, refreshAll };
}
