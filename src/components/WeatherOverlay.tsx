import { useState } from "react";
import { Cloud, Thermometer, Wind, Droplets, Eye, Gauge, X, ChevronUp, ChevronDown } from "lucide-react";

interface WeatherData {
  location: string;
  coords: string;
  temp: { value: string; unit: string };
  wind: { value: string; unit: string };
  humidity: { value: string; unit: string };
  visibility: { value: string; unit: string };
  pressure: { value: string; unit: string };
  condition: string;
}

interface WeatherOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  compact?: boolean;
}

// Foxborough, MA weather data for game day
const weatherData: WeatherData = {
  location: "Foxborough, MA",
  coords: "42.09°N, 71.26°W",
  temp: { value: "32", unit: "°F" },
  wind: { value: "15", unit: "mph" },
  humidity: { value: "62", unit: "%" },
  visibility: { value: "10", unit: "mi" },
  pressure: { value: "29.92", unit: "inHg" },
  condition: "Partly Cloudy",
};

const WeatherOverlay = ({ isOpen, onClose, compact = false }: WeatherOverlayProps) => {
  const [isExpanded, setIsExpanded] = useState(!compact);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-40 transition-all duration-300 ${
        compact 
          ? "bottom-4 right-4" 
          : "top-4 right-4"
      }`}
    >
      <div className="bg-strata-charcoal/95 backdrop-blur-md border border-strata-steel/30 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-strata-black/50 border-b border-strata-steel/20">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-strata-orange" />
            <span className="text-xs font-mono uppercase tracking-wider text-strata-silver">
              Weather
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-strata-lume animate-pulse" />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-strata-steel/30 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-strata-silver" />
              ) : (
                <ChevronUp className="w-4 h-4 text-strata-silver" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-strata-steel/30 rounded transition-colors"
            >
              <X className="w-4 h-4 text-strata-silver" />
            </button>
          </div>
        </div>

        {/* Compact view - always visible */}
        <div className="px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-strata-cyan" />
            <span className="font-instrument text-lg text-strata-white">
              {weatherData.temp.value}{weatherData.temp.unit}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-strata-blue" />
            <span className="font-mono text-sm text-strata-silver">
              {weatherData.wind.value} {weatherData.wind.unit}
            </span>
          </div>
          <div className="text-xs font-mono text-strata-silver/60">
            {weatherData.condition}
          </div>
        </div>

        {/* Expanded view */}
        {isExpanded && (
          <div className="border-t border-strata-steel/20">
            {/* Location */}
            <div className="px-4 py-2 bg-strata-steel/10">
              <div className="text-sm font-instrument text-strata-orange">
                {weatherData.location}
              </div>
              <div className="text-[10px] font-mono text-strata-silver/50">
                {weatherData.coords}
              </div>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 gap-px bg-strata-steel/20">
              <MetricCell
                icon={<Thermometer className="w-3.5 h-3.5 text-strata-cyan" />}
                label="Temperature"
                value={weatherData.temp.value}
                unit={weatherData.temp.unit}
              />
              <MetricCell
                icon={<Wind className="w-3.5 h-3.5 text-strata-blue" />}
                label="Wind"
                value={weatherData.wind.value}
                unit={weatherData.wind.unit}
              />
              <MetricCell
                icon={<Droplets className="w-3.5 h-3.5 text-strata-cyan" />}
                label="Humidity"
                value={weatherData.humidity.value}
                unit={weatherData.humidity.unit}
              />
              <MetricCell
                icon={<Eye className="w-3.5 h-3.5 text-strata-silver" />}
                label="Visibility"
                value={weatherData.visibility.value}
                unit={weatherData.visibility.unit}
              />
              <MetricCell
                icon={<Gauge className="w-3.5 h-3.5 text-strata-orange" />}
                label="Pressure"
                value={weatherData.pressure.value}
                unit={weatherData.pressure.unit}
                colSpan={2}
              />
            </div>

            {/* Footer */}
            <div className="px-4 py-2 text-center">
              <span className="text-[9px] font-mono text-strata-silver/40 uppercase tracking-wider">
                STRATA Weather Intelligence
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MetricCell = ({
  icon,
  label,
  value,
  unit,
  colSpan = 1,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  colSpan?: number;
}) => (
  <div
    className={`bg-strata-charcoal/80 px-3 py-2 ${colSpan === 2 ? "col-span-2" : ""}`}
  >
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <span className="text-[9px] font-mono uppercase text-strata-silver/60 tracking-wider">
        {label}
      </span>
    </div>
    <div className="font-instrument text-strata-white">
      {value}
      <span className="text-xs text-strata-silver/70 ml-1">{unit}</span>
    </div>
  </div>
);

export default WeatherOverlay;
