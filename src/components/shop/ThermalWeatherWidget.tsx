import { motion } from "framer-motion";
import { Thermometer, Droplets, Wind, MapPin, Activity } from "lucide-react";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { useEffect, useState } from "react";

interface ThermalWeatherWidgetProps {
  terrainCoordinates?: { lat: number; lon: number };
  terrainName?: string;
  compact?: boolean;
}

// Get thermal color based on temperature
const getThermalColor = (tempF: number): string => {
  if (tempF <= 32) return "hsl(210, 100%, 60%)"; // Cold - blue
  if (tempF <= 50) return "hsl(200, 80%, 55%)"; // Cool - cyan
  if (tempF <= 65) return "hsl(120, 60%, 50%)"; // Mild - green
  if (tempF <= 75) return "hsl(45, 90%, 55%)"; // Warm - yellow
  if (tempF <= 85) return "hsl(30, 100%, 55%)"; // Hot - orange
  return "hsl(0, 100%, 55%)"; // Very hot - red
};

// Get recommendation for clothing
const getClothingRecommendation = (tempF: number, condition: string): string => {
  const isRainy = condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle');
  const isWindy = condition.toLowerCase().includes('wind');
  const isSnowy = condition.toLowerCase().includes('snow');

  if (tempF < 32) {
    return isSnowy ? "Full insulation + waterproof shell essential" : "Maximum thermal layers required";
  }
  if (tempF < 50) {
    return isRainy ? "Waterproof shell with mid-layer" : "Mid-weight shell recommended";
  }
  if (tempF < 65) {
    return isRainy ? "Perfect STRATA weather" : isWindy ? "Light shell for wind" : "Shell optional";
  }
  if (tempF < 75) {
    return isRainy ? "Light shell for rain" : "Carry shell for evening";
  }
  return isRainy ? "Light shell for sudden showers" : "Shell stowed for evening use";
};

export const ThermalWeatherWidget = ({ 
  terrainCoordinates, 
  terrainName,
  compact = false 
}: ThermalWeatherWidgetProps) => {
  const { latitude, longitude, requestLocation, hasLocation } = useGeolocation();
  const { unit, formatTemp } = useTemperatureUnit();
  const [pulseIntensity, setPulseIntensity] = useState(0.5);

  // Use terrain coordinates if provided, otherwise user location
  const lat = terrainCoordinates?.lat ?? latitude;
  const lon = terrainCoordinates?.lon ?? longitude;

  const { weather, loading } = useWeatherData(
    lat ?? undefined,
    lon ?? undefined
  );

  // Auto-request location on mount if no terrain coordinates
  useEffect(() => {
    if (!hasLocation && !terrainCoordinates) {
      requestLocation();
    }
  }, [hasLocation, requestLocation, terrainCoordinates]);

  // Animate pulse based on temperature
  useEffect(() => {
    if (weather) {
      const temp = weather.current.temp;
      // Higher temp = faster pulse
      const intensity = Math.min(1, Math.max(0.3, (temp - 32) / 60));
      setPulseIntensity(intensity);
    }
  }, [weather]);

  if (loading || !weather) {
    return (
      <div className="p-3 bg-strata-charcoal/30 border border-strata-steel/20 rounded-lg animate-pulse">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-strata-cyan/40" />
          <span className="font-mono text-[10px] text-strata-silver/40">LOADING THERMAL DATA...</span>
        </div>
      </div>
    );
  }

  const thermalColor = getThermalColor(weather.current.temp);
  const recommendation = getClothingRecommendation(weather.current.temp, weather.current.condition);

  if (compact) {
    return (
      <motion.div
        className="relative overflow-hidden p-3 rounded-lg border"
        style={{
          background: `linear-gradient(135deg, ${thermalColor}10 0%, transparent 50%)`,
          borderColor: `${thermalColor}40`,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Thermal pulse indicator */}
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 rounded-full"
          style={{ backgroundColor: thermalColor }}
          animate={{ 
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 1.5 / pulseIntensity, 
            repeat: Infinity 
          }}
        />

        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${thermalColor}20` }}
          >
            <Thermometer className="w-5 h-5" style={{ color: thermalColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold text-strata-white">
                {formatTemp(weather.current.temp)}
              </span>
              <span className="font-mono text-[9px] text-strata-silver/60 uppercase">
                {weather.current.condition}
              </span>
            </div>
            <p className="font-mono text-[9px] text-strata-silver/60 truncate">
              {recommendation}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg border"
      style={{
        background: `linear-gradient(135deg, ${thermalColor}08 0%, hsl(var(--strata-charcoal)/0.3) 100%)`,
        borderColor: `${thermalColor}30`,
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header with thermal gradient */}
      <div 
        className="px-4 py-2 border-b flex items-center justify-between"
        style={{ 
          borderColor: `${thermalColor}20`,
          background: `linear-gradient(90deg, ${thermalColor}10, transparent)` 
        }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: thermalColor }}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 1.5 / pulseIntensity, repeat: Infinity }}
          />
          <span className="font-mono text-[9px] text-strata-silver/60 uppercase tracking-widest">
            Thermal Intelligence
          </span>
        </div>
        {terrainName && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-strata-silver/40" />
            <span className="font-mono text-[9px] text-strata-silver/40">{terrainName}</span>
          </div>
        )}
      </div>

      {/* Main thermal display */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Temperature */}
          <div className="text-center">
            <div 
              className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2"
              style={{ 
                background: `radial-gradient(circle, ${thermalColor}30 0%, transparent 70%)`,
                boxShadow: `0 0 20px ${thermalColor}20`
              }}
            >
              <Thermometer className="w-5 h-5" style={{ color: thermalColor }} />
            </div>
            <span className="font-mono text-xl font-bold" style={{ color: thermalColor }}>
              {formatTemp(weather.current.temp)}
            </span>
            <p className="font-mono text-[8px] text-strata-silver/50 uppercase">Actual</p>
          </div>

          {/* Feels Like */}
          <div className="text-center">
            <div 
              className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2"
              style={{ 
                background: `radial-gradient(circle, ${getThermalColor(weather.current.feelsLike)}30 0%, transparent 70%)`
              }}
            >
              <Activity className="w-5 h-5" style={{ color: getThermalColor(weather.current.feelsLike) }} />
            </div>
            <span className="font-mono text-xl font-bold" style={{ color: getThermalColor(weather.current.feelsLike) }}>
              {formatTemp(weather.current.feelsLike)}
            </span>
            <p className="font-mono text-[8px] text-strata-silver/50 uppercase">Feels Like</p>
          </div>

          {/* Wind */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 bg-strata-cyan/10">
              <Wind className="w-5 h-5 text-strata-cyan" />
            </div>
            <span className="font-mono text-xl font-bold text-strata-cyan">
              {weather.current.wind}
            </span>
            <p className="font-mono text-[8px] text-strata-silver/50 uppercase">MPH</p>
          </div>
        </div>

        {/* Thermal bar visualization */}
        <div className="mb-4">
          <div className="h-2 rounded-full bg-strata-charcoal/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, 
                  hsl(210, 100%, 60%) 0%, 
                  hsl(200, 80%, 55%) 20%, 
                  hsl(120, 60%, 50%) 40%, 
                  hsl(45, 90%, 55%) 60%, 
                  hsl(30, 100%, 55%) 80%, 
                  hsl(0, 100%, 55%) 100%
                )`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, ((weather.current.temp - 0) / 100) * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-mono text-[8px] text-strata-silver/30">0°F</span>
            <span className="font-mono text-[8px] text-strata-silver/30">100°F</span>
          </div>
        </div>

        {/* Recommendation */}
        <div 
          className="p-3 rounded border"
          style={{ 
            backgroundColor: `${thermalColor}08`,
            borderColor: `${thermalColor}20`
          }}
        >
          <div className="flex items-start gap-2">
            <div 
              className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${thermalColor}20` }}
            >
              <Droplets className="w-3 h-3" style={{ color: thermalColor }} />
            </div>
            <div>
              <p className="font-mono text-[10px] text-strata-silver/80">
                {recommendation}
              </p>
              <p className="font-mono text-[8px] text-strata-silver/40 mt-1">
                {weather.current.condition} • {weather.current.humidity}% humidity
              </p>
            </div>
          </div>
        </div>

        {/* Coordinates */}
        {lat && lon && (
          <div className="mt-3 flex items-center justify-center gap-4 font-mono text-[8px] text-strata-silver/30">
            <span>LAT: {lat.toFixed(4)}</span>
            <span>•</span>
            <span>LON: {lon.toFixed(4)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ThermalWeatherWidget;
