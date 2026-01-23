import { useState, useEffect, useCallback } from "react";

// Acuparse API response types
interface AcuparseDashboardData {
  main?: {
    tempF: number;
    tempC: number;
    humidity: number;
    windSpeedMph: number;
    windSpeedKmh: number;
    windDir: string;
    windDeg: number;
    pressureIn: number;
    pressureMb: number;
    dewF: number;
    dewC: number;
    feelsF: number;
    feelsC: number;
    uvIndex: number;
    rainIn: number;
    rainMm: number;
  };
  towers?: Array<{
    id: string;
    name: string;
    tempF: number;
    humidity: number;
  }>;
  lastUpdate: string;
}

interface AcuparseConfig {
  baseUrl: string;
  apiToken?: string;
}

interface UseAcuparseWeatherOptions {
  config?: AcuparseConfig;
  refreshInterval?: number;
  enabled?: boolean;
}

interface AcuparseWeatherState {
  data: AcuparseDashboardData | null;
  isLoading: boolean;
  error: string | null;
  lastFetch: Date | null;
}

/**
 * Hook for fetching weather data from Acuparse API
 * 
 * Acuparse API Endpoints:
 * - GET /api/v1/json/dashboard - Full station data
 * - GET /api/v1/json/dashboard?main - Primary sensor only
 * - GET /api/v1/json/tower - All tower sensors
 * - GET /api/v1/json/tower?id={ID} - Specific tower
 * - GET /api/v1/json/archive/search - Historical data
 */
export const useAcuparseWeather = (options: UseAcuparseWeatherOptions = {}) => {
  const {
    config = { baseUrl: "" },
    refreshInterval = 60000, // 1 minute default
    enabled = true,
  } = options;

  const [state, setState] = useState<AcuparseWeatherState>({
    data: null,
    isLoading: false,
    error: null,
    lastFetch: null,
  });

  const fetchDashboard = useCallback(async (mainOnly = false) => {
    if (!config.baseUrl) {
      // Return mock data when no Acuparse server configured
      setState(prev => ({
        ...prev,
        data: getMockAcuparseData(),
        isLoading: false,
        lastFetch: new Date(),
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const endpoint = mainOnly 
        ? `${config.baseUrl}/api/v1/json/dashboard?main`
        : `${config.baseUrl}/api/v1/json/dashboard`;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (config.apiToken) {
        headers["Authorization"] = `Bearer ${config.apiToken}`;
      }

      const response = await fetch(endpoint, { headers });

      if (!response.ok) {
        throw new Error(`Acuparse API error: ${response.status}`);
      }

      const data = await response.json();
      
      setState({
        data,
        isLoading: false,
        error: null,
        lastFetch: new Date(),
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch weather data",
      }));
    }
  }, [config.baseUrl, config.apiToken]);

  const fetchTowers = useCallback(async (towerId?: string) => {
    if (!config.baseUrl) return null;

    try {
      const endpoint = towerId
        ? `${config.baseUrl}/api/v1/json/tower?id=${towerId}`
        : `${config.baseUrl}/api/v1/json/tower`;

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Tower API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch tower data:", error);
      return null;
    }
  }, [config.baseUrl]);

  const fetchArchive = useCallback(async (
    queryType: "wind" | "rain" | "temp" | "humidity",
    startDate: string,
    endDate: string
  ) => {
    if (!config.baseUrl) return null;

    try {
      const endpoint = `${config.baseUrl}/api/v1/json/archive/search?query=${queryType}&start=${startDate}&end=${endDate}`;
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Archive API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch archive data:", error);
      return null;
    }
  }, [config.baseUrl]);

  // Initial fetch and refresh interval
  useEffect(() => {
    if (!enabled) return;

    fetchDashboard();

    if (refreshInterval > 0) {
      const interval = setInterval(() => fetchDashboard(), refreshInterval);
      return () => clearInterval(interval);
    }
  }, [enabled, fetchDashboard, refreshInterval]);

  return {
    ...state,
    refetch: fetchDashboard,
    fetchTowers,
    fetchArchive,
  };
};

// Mock data when no Acuparse server is configured
function getMockAcuparseData(): AcuparseDashboardData {
  return {
    main: {
      tempF: 42,
      tempC: 5.6,
      humidity: 78,
      windSpeedMph: 15,
      windSpeedKmh: 24,
      windDir: "NW",
      windDeg: 315,
      pressureIn: 30.12,
      pressureMb: 1020,
      dewF: 35,
      dewC: 1.7,
      feelsF: 36,
      feelsC: 2.2,
      uvIndex: 1,
      rainIn: 0.00,
      rainMm: 0.0,
    },
    towers: [
      { id: "tower-1", name: "Dock Sensor", tempF: 41, humidity: 82 },
      { id: "tower-2", name: "Marina Sensor", tempF: 43, humidity: 75 },
    ],
    lastUpdate: new Date().toISOString(),
  };
}

export default useAcuparseWeather;
