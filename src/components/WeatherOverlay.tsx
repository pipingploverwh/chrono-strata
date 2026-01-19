import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cloud, 
  Thermometer, 
  Wind, 
  Droplets, 
  X, 
  ChevronUp, 
  ChevronDown,
  MapPin,
  Navigation,
  Loader2,
  RefreshCw,
  Waves,
  Compass,
  Anchor,
  AlertTriangle,
  Ship
} from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useWeatherLogger } from "@/hooks/useWeatherLogger";
import { useMarineForecast } from "@/hooks/useMarineForecast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WeatherOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  compact?: boolean;
}

const WeatherOverlay = ({ isOpen, onClose, compact = false }: WeatherOverlayProps) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [activeTab, setActiveTab] = useState<'weather' | 'marine'>('weather');
  const geolocation = useGeolocation();
  const { weather, loading: weatherLoading, error: weatherError, refetch } = useWeatherData(
    geolocation.latitude ?? undefined,
    geolocation.longitude ?? undefined,
    geolocation.locationName ?? undefined
  );
  const { logWeatherView } = useWeatherLogger();
  const { 
    forecast: marineForecast, 
    loading: marineLoading, 
    isNearWater,
    refetch: refetchMarine 
  } = useMarineForecast(
    geolocation.latitude ?? undefined,
    geolocation.longitude ?? undefined
  );

  // Log weather view when location is available
  useEffect(() => {
    if (isOpen && geolocation.hasLocation && geolocation.latitude && geolocation.longitude) {
      logWeatherView({
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
        locationName: geolocation.locationName ?? undefined,
        pageSource: window.location.pathname,
      });
    }
  }, [isOpen, geolocation.hasLocation, geolocation.latitude, geolocation.longitude, geolocation.locationName, logWeatherView]);

  // Auto-switch to marine tab if near water and has warnings
  useEffect(() => {
    if (isNearWater && marineForecast?.warnings && marineForecast.warnings.length > 0) {
      setActiveTab('marine');
    }
  }, [isNearWater, marineForecast]);

  if (!isOpen) return null;

  const isLoading = geolocation.loading || weatherLoading;
  const hasData = geolocation.hasLocation && weather;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed z-40 ${compact ? "bottom-4 right-4" : "top-4 right-4"}`}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div 
          className="bg-strata-charcoal/95 backdrop-blur-xl border border-strata-steel/30 rounded-lg shadow-2xl overflow-hidden min-w-[320px]"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--strata-charcoal) / 0.95) 0%, hsl(var(--strata-black) / 0.98) 100%)',
          }}
        >
          {/* Kuma glass header with AAL geometric accent */}
          <div className="relative flex items-center justify-between px-4 py-3 bg-strata-black/50 border-b border-strata-steel/20">
            {/* AAL corner accent */}
            <div className="absolute top-0 left-0 w-3 h-3">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-strata-orange/60 to-transparent" />
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-strata-orange/60 to-transparent" />
            </div>

            <div className="flex items-center gap-2">
              {isNearWater ? (
                <Anchor className="w-4 h-4 text-strata-cyan" />
              ) : (
                <Cloud className="w-4 h-4 text-strata-orange" />
              )}
              <span className="text-xs font-mono uppercase tracking-wider text-strata-silver">
                {isNearWater ? 'Coastal Intelligence' : 'Weather Intelligence'}
              </span>
              {hasData && (
                <div className="w-1.5 h-1.5 rounded-full bg-strata-lume animate-pulse" />
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {hasData && (
                <button
                  onClick={() => { refetch(); if (isNearWater) refetchMarine(); }}
                  className="p-1.5 hover:bg-strata-steel/30 rounded transition-colors"
                  title="Refresh data"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-strata-silver" />
                </button>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:bg-strata-steel/30 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-strata-silver" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-strata-silver" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-strata-steel/30 rounded transition-colors"
              >
                <X className="w-4 h-4 text-strata-silver" />
              </button>
            </div>
          </div>

          {/* Content */}
          {!geolocation.hasLocation ? (
            // Location permission request
            <motion.div 
              className="p-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-strata-orange/10 border border-strata-orange/30 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-strata-orange" />
                </div>
                <div>
                  <h3 className="font-instrument text-strata-white text-base mb-1">
                    Enable Location
                  </h3>
                  <p className="text-[11px] text-strata-silver/60 font-mono">
                    Access weather & marine conditions for your area
                  </p>
                </div>
                
                {geolocation.error && (
                  <div className="text-[10px] font-mono text-red-400 bg-red-500/10 px-3 py-2 rounded">
                    {geolocation.error}
                  </div>
                )}

                <button
                  onClick={geolocation.requestLocation}
                  disabled={geolocation.loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-strata-orange/20 border border-strata-orange/40 rounded-lg text-strata-orange hover:bg-strata-orange/30 transition-colors disabled:opacity-50"
                >
                  {geolocation.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  <span className="text-xs font-mono uppercase tracking-wider">
                    {geolocation.loading ? 'Locating...' : 'Share Location'}
                  </span>
                </button>
              </div>
            </motion.div>
          ) : weatherLoading ? (
            // Loading state
            <div className="p-6 flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 text-strata-orange animate-spin" />
              <span className="text-xs font-mono text-strata-silver/60">
                Fetching weather data...
              </span>
            </div>
          ) : weatherError ? (
            // Error state
            <div className="p-5 text-center">
              <div className="text-red-400 text-xs font-mono mb-3">
                {weatherError}
              </div>
              <button
                onClick={refetch}
                className="text-xs text-strata-orange hover:underline"
              >
                Try again
              </button>
            </div>
          ) : weather ? (
            // Weather data display with tabs if near water
            <>
              {/* Tab selector for coastal locations */}
              {isNearWater && (
                <div className="px-3 pt-3">
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'weather' | 'marine')}>
                    <TabsList className="w-full bg-strata-steel/20 h-9">
                      <TabsTrigger 
                        value="weather" 
                        className="flex-1 text-[10px] font-mono uppercase data-[state=active]:bg-strata-orange/20 data-[state=active]:text-strata-orange"
                      >
                        <Cloud className="w-3 h-3 mr-1.5" />
                        Weather
                      </TabsTrigger>
                      <TabsTrigger 
                        value="marine" 
                        className="flex-1 text-[10px] font-mono uppercase data-[state=active]:bg-strata-cyan/20 data-[state=active]:text-strata-cyan relative"
                      >
                        <Anchor className="w-3 h-3 mr-1.5" />
                        Marine
                        {marineForecast?.warnings && marineForecast.warnings.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        )}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="weather" className="mt-0">
                      <WeatherContent 
                        weather={weather} 
                        geolocation={geolocation} 
                        isExpanded={isExpanded} 
                      />
                    </TabsContent>

                    <TabsContent value="marine" className="mt-0">
                      <MarineContent 
                        forecast={marineForecast} 
                        loading={marineLoading} 
                        isExpanded={isExpanded}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {/* Regular weather display for non-coastal locations */}
              {!isNearWater && (
                <WeatherContent 
                  weather={weather} 
                  geolocation={geolocation} 
                  isExpanded={isExpanded} 
                />
              )}

              {/* Footer */}
              <div className="relative px-4 py-2 text-center border-t border-strata-steel/20">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-strata-steel/30 to-transparent" />
                <span className="text-[9px] font-mono text-strata-silver/40 uppercase tracking-wider">
                  {isNearWater ? 'NOAA Marine Forecast' : 'LAVANDAR Weather Intelligence'}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Weather content component
const WeatherContent = ({ 
  weather, 
  geolocation, 
  isExpanded 
}: { 
  weather: any; 
  geolocation: ReturnType<typeof useGeolocation>; 
  isExpanded: boolean;
}) => (
  <>
    {/* Compact view - always visible */}
    <div className="px-4 py-3 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Thermometer className="w-4 h-4 text-strata-cyan" />
        <span className="font-instrument text-xl text-strata-white">
          {Math.round(weather.current.temp)}°F
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Wind className="w-4 h-4 text-strata-blue" />
        <span className="font-mono text-sm text-strata-silver">
          {Math.round(weather.current.wind)} mph
        </span>
      </div>
      <div className="text-xs font-mono text-strata-silver/60">
        {weather.current.condition}
      </div>
    </div>

    {/* Expanded view */}
    <AnimatePresence>
      {isExpanded && (
        <motion.div 
          className="border-t border-strata-steel/20"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Location */}
          <div className="relative px-4 py-3 bg-strata-steel/10">
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-strata-orange/20 to-transparent" />
            
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-3.5 h-3.5 text-strata-orange" />
              <span className="text-sm font-instrument text-strata-orange">
                {geolocation.locationName || 'Current Location'}
              </span>
            </div>
            <div className="text-[10px] font-mono text-strata-silver/50 flex items-center gap-2">
              <Compass className="w-3 h-3" />
              {geolocation.latitude?.toFixed(4)}°N, {Math.abs(geolocation.longitude ?? 0).toFixed(4)}°W
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-px bg-strata-steel/20">
            <MetricCell
              icon={<Thermometer className="w-3.5 h-3.5 text-strata-cyan" />}
              label="Feels Like"
              value={Math.round(weather.current.feelsLike).toString()}
              unit="°F"
            />
            <MetricCell
              icon={<Wind className="w-3.5 h-3.5 text-strata-blue" />}
              label="Wind Gusts"
              value={Math.round(weather.current.windGusts).toString()}
              unit="mph"
            />
            <MetricCell
              icon={<Droplets className="w-3.5 h-3.5 text-strata-cyan" />}
              label="Humidity"
              value={weather.current.humidity.toString()}
              unit="%"
            />
            <MetricCell
              icon={<Waves className="w-3.5 h-3.5 text-strata-blue" />}
              label="Precipitation"
              value={weather.current.precipitation.toString()}
              unit="in"
            />
          </div>

          {/* Forecast strip */}
          {weather.forecast && weather.forecast.length > 0 && (
            <div className="px-4 py-3 bg-strata-black/30">
              <div className="text-[9px] font-mono text-strata-silver/50 uppercase tracking-wider mb-2">
                4-Hour Outlook
              </div>
              <div className="flex gap-3">
                {weather.forecast.slice(0, 4).map((hour: any, idx: number) => (
                  <div key={idx} className="flex-1 text-center">
                    <div className="text-[10px] font-mono text-strata-silver/60">
                      {hour.time}
                    </div>
                    <div className="font-instrument text-sm text-strata-white">
                      {Math.round(hour.temp)}°
                    </div>
                    {hour.precipProb > 0 && (
                      <div className="text-[9px] font-mono text-strata-cyan">
                        {hour.precipProb}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </>
);

// Marine content component
const MarineContent = ({ 
  forecast, 
  loading,
  isExpanded 
}: { 
  forecast: any; 
  loading: boolean;
  isExpanded: boolean;
}) => {
  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center gap-3">
        <Loader2 className="w-5 h-5 text-strata-cyan animate-spin" />
        <span className="text-xs font-mono text-strata-silver/60">
          Fetching NOAA marine data...
        </span>
      </div>
    );
  }

  if (!forecast) {
    return (
      <div className="p-5 text-center">
        <div className="text-strata-silver/50 text-xs font-mono">
          Marine forecast unavailable
        </div>
      </div>
    );
  }

  const currentPeriod = forecast.periods?.[0];

  return (
    <>
      {/* Warnings banner */}
      {forecast.warnings && forecast.warnings.length > 0 && (
        <div className="mx-3 mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
              Active Alerts
            </span>
          </div>
          {forecast.warnings.map((warning: string, idx: number) => (
            <div key={idx} className="text-xs font-mono text-amber-300 mt-1">
              {warning}
            </div>
          ))}
        </div>
      )}

      {/* Location and current conditions */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Ship className="w-4 h-4 text-strata-cyan" />
          <span className="text-sm font-instrument text-strata-cyan">
            {forecast.location}
          </span>
          <span className="text-[9px] font-mono text-strata-silver/40 bg-strata-steel/20 px-1.5 py-0.5 rounded">
            {forecast.zone}
          </span>
        </div>

        {currentPeriod && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-2.5 rounded-lg bg-strata-steel/10">
              <div className="text-[9px] font-mono text-strata-silver/50 uppercase mb-1">Wind</div>
              <div className="text-xs font-mono text-strata-white leading-tight">
                {currentPeriod.wind || 'Variable'}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-strata-steel/10">
              <div className="text-[9px] font-mono text-strata-silver/50 uppercase mb-1">Seas</div>
              <div className="text-xs font-mono text-strata-white leading-tight">
                {currentPeriod.seas || 'Light'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Extended forecast when expanded */}
      <AnimatePresence>
        {isExpanded && forecast.periods && forecast.periods.length > 1 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-strata-steel/20 px-4 py-3 bg-strata-black/30"
          >
            <div className="text-[9px] font-mono text-strata-silver/50 uppercase tracking-wider mb-2">
              Extended Forecast
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {forecast.periods.slice(1, 5).map((period: any, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-[10px]">
                  <span className="font-mono text-strata-cyan w-20 flex-shrink-0">
                    {period.name}
                  </span>
                  <span className="font-mono text-strata-silver/70">
                    {period.wind || period.conditions || 'Variable'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
    className={`bg-strata-charcoal/80 px-3 py-2.5 ${colSpan === 2 ? "col-span-2" : ""}`}
    style={{
      background: 'linear-gradient(180deg, hsl(var(--strata-charcoal) / 0.8) 0%, hsl(var(--strata-charcoal) / 0.6) 100%)',
    }}
  >
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <span className="text-[9px] font-mono uppercase text-strata-silver/60 tracking-wider">
        {label}
      </span>
    </div>
    <div className="font-instrument text-strata-white">
      {value}
      {unit && <span className="text-xs text-strata-silver/70 ml-1">{unit}</span>}
    </div>
  </div>
);

export default WeatherOverlay;
