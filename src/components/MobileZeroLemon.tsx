import { useState, useEffect, useMemo } from "react";
import { 
  Target, 
  Wind, 
  Thermometer, 
  Droplets,
  Sun,
  Moon,
  MapPin,
  Loader2,
  Shield,
  Zap,
  TrendingUp,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import TemperatureUnitToggle from "@/components/TemperatureUnitToggle";

// Gillette Stadium coordinates
const GILLETTE_LAT = 42.0909;
const GILLETTE_LON = -71.2643;

interface MobileZeroLemonProps {
  className?: string;
}

const MobileZeroLemon = ({ className = "" }: MobileZeroLemonProps) => {
  const { formatTemp } = useTemperatureUnit();
  const [lumeMode, setLumeMode] = useState(true);
  const [lumeIntensity, setLumeIntensity] = useState(70);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  
  const { weather, loading, error } = useWeatherData(GILLETTE_LAT, GILLETTE_LON);

  // Detect orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    
    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  // Calculate glow based on intensity
  const glowMultiplier = lumeIntensity / 100;
  const glowOpacity = (base: number) => (base * glowMultiplier).toFixed(2);
  const glowSize = (base: number) => Math.round(base * glowMultiplier);

  const currentWeather = weather?.current || {
    temp: 28,
    wind: 18,
    windDirection: "NW",
    humidity: 58,
    condition: "Clear",
    fieldCondition: "Frozen Turf",
  };

  const adjustments = weather?.adjustments || { shortRoutes: 12, deepRoutes: -8 };

  // Route efficiency data
  const routeData = useMemo(() => {
    const baseRoutes = [
      { letter: "S", name: "Slant", efficiency: 72 },
      { letter: "H", name: "Hitch", efficiency: 68 },
      { letter: "O", name: "Out", efficiency: 61 },
      { letter: "W", name: "Whip", efficiency: 74 },
      { letter: "S", name: "Seam", efficiency: 58 },
    ];

    if (!weather) return baseRoutes;

    return baseRoutes.map((route, i) => ({
      ...route,
      efficiency: route.efficiency + (i < 2 ? adjustments.shortRoutes : adjustments.deepRoutes)
    }));
  }, [weather, adjustments]);

  const containerStyle = lumeMode ? {
    boxShadow: `0 0 ${glowSize(30)}px hsla(120, 100%, 62%, ${glowOpacity(0.3)}), inset 0 0 ${glowSize(20)}px hsla(120, 100%, 62%, ${glowOpacity(0.1)})`
  } : {};

  return (
    <div 
      className={`
        ${className}
        ${isLandscape ? 'flex flex-row gap-4' : 'flex flex-col gap-4'}
        w-full
        ${lumeMode ? 'bg-black/95' : 'bg-neutral-900'}
        rounded-2xl border transition-all duration-500
        ${lumeMode ? 'border-strata-lume/30' : 'border-neutral-700'}
        p-4 pb-32
      `}
      style={containerStyle}
    >
      {/* Header with Lume Controls */}
      <div className={`${isLandscape ? 'w-1/3 flex flex-col' : 'w-full'}`}>
        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div 
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              lumeMode ? 'bg-strata-lume/20' : 'bg-red-600'
            }`}
            style={lumeMode ? { 
              boxShadow: `0 0 ${glowSize(15)}px hsla(120, 100%, 62%, ${glowOpacity(0.5)})` 
            } : {}}
          >
            <Target className={`w-6 h-6 ${lumeMode ? 'text-strata-lume' : 'text-white'}`} />
          </div>
          <div>
            <h2 
              className={`text-2xl font-bold tracking-wide ${lumeMode ? 'text-strata-lume' : 'text-white'}`}
              style={lumeMode ? { 
                textShadow: `0 0 ${glowSize(10)}px hsla(120, 100%, 62%, ${glowOpacity(0.8)})` 
              } : {}}
            >
              ZERO LEMON
            </h2>
            <p className={`text-xs font-mono uppercase tracking-widest ${lumeMode ? 'text-strata-lume/50' : 'text-neutral-500'}`}>
              Tactical Analysis
            </p>
          </div>
        </div>

        {/* Lume Control Panel */}
        <div className={`p-4 rounded-xl border transition-all duration-300 ${
          lumeMode 
            ? 'bg-strata-lume/5 border-strata-lume/20' 
            : 'bg-neutral-800 border-neutral-700'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Moon className={`w-5 h-5 ${lumeMode ? 'text-strata-lume fill-strata-lume' : 'text-neutral-400'}`} />
              <span className={`text-lg font-semibold ${lumeMode ? 'text-strata-lume' : 'text-white'}`}>
                Lume Mode
              </span>
            </div>
            <Switch
              checked={lumeMode}
              onCheckedChange={setLumeMode}
              className={lumeMode ? 'data-[state=checked]:bg-strata-lume' : ''}
            />
          </div>
          
          {/* Intensity Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-mono ${lumeMode ? 'text-strata-lume/70' : 'text-neutral-400'}`}>
                Intensity
              </span>
              <span 
                className={`text-lg font-bold ${lumeMode ? 'text-strata-lume' : 'text-white'}`}
                style={lumeMode ? { 
                  textShadow: `0 0 ${glowSize(8)}px hsla(120, 100%, 62%, ${glowOpacity(0.9)})` 
                } : {}}
              >
                {lumeIntensity}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Sun className={`w-4 h-4 ${lumeMode ? 'text-strata-lume/40' : 'text-neutral-500'}`} />
              <Slider
                value={[lumeIntensity]}
                onValueChange={(v) => setLumeIntensity(v[0])}
                min={0}
                max={100}
                step={5}
                disabled={!lumeMode}
                className="flex-1"
              />
              <Moon className={`w-4 h-4 ${lumeMode ? 'text-strata-lume' : 'text-neutral-500'}`} />
            </div>
          </div>
        </div>

        {/* Location Badge */}
        <div className={`mt-4 flex items-center gap-2 text-sm ${lumeMode ? 'text-strata-lume/60' : 'text-neutral-500'}`}>
          <MapPin className="w-4 h-4" />
          <span className="font-mono">Gillette Stadium</span>
          <div className={`ml-auto w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-strata-lume'}`} />
        </div>
      </div>

      {/* Weather & Route Data */}
      <div className={`${isLandscape ? 'flex-1 flex flex-col' : 'w-full'}`}>
        {/* Weather Grid */}
        <div className={`grid ${isLandscape ? 'grid-cols-4' : 'grid-cols-2'} gap-3`}>
          {/* Temperature */}
          <div 
            className={`p-4 rounded-xl border transition-all duration-300 ${
              lumeMode ? 'bg-black/50 border-strata-lume/20' : 'bg-neutral-800 border-neutral-700'
            }`}
            style={lumeMode ? { 
              boxShadow: `inset 0 0 ${glowSize(10)}px hsla(120, 100%, 62%, ${glowOpacity(0.1)})` 
            } : {}}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Thermometer className={`w-5 h-5 ${lumeMode ? 'text-strata-lume' : 'text-cyan-400'}`} />
                <span className={`text-xs font-mono uppercase ${lumeMode ? 'text-strata-lume/50' : 'text-neutral-500'}`}>
                  Temp
                </span>
              </div>
              <TemperatureUnitToggle variant="minimal" size="sm" className={lumeMode ? 'text-strata-lume/60' : ''} />
            </div>
            {loading ? (
              <Loader2 className={`w-6 h-6 animate-spin ${lumeMode ? 'text-strata-lume' : 'text-cyan-400'}`} />
            ) : (
              <div 
                className={`text-3xl font-bold ${lumeMode ? 'text-strata-lume' : 'text-white'}`}
                style={lumeMode ? { 
                  textShadow: `0 0 ${glowSize(12)}px hsla(120, 100%, 62%, ${glowOpacity(0.8)})` 
                } : {}}
              >
                {formatTemp(currentWeather.temp)}
              </div>
            )}
          </div>

          {/* Wind */}
          <div 
            className={`p-4 rounded-xl border transition-all duration-300 ${
              lumeMode ? 'bg-black/50 border-strata-lume/20' : 'bg-neutral-800 border-neutral-700'
            }`}
            style={lumeMode ? { 
              boxShadow: `inset 0 0 ${glowSize(10)}px hsla(120, 100%, 62%, ${glowOpacity(0.1)})` 
            } : {}}
          >
            <div className="flex items-center gap-2 mb-2">
              <Wind className={`w-5 h-5 ${lumeMode ? 'text-strata-lume' : 'text-blue-400'}`} />
              <span className={`text-xs font-mono uppercase ${lumeMode ? 'text-strata-lume/50' : 'text-neutral-500'}`}>
                Wind
              </span>
            </div>
            {loading ? (
              <Loader2 className={`w-6 h-6 animate-spin ${lumeMode ? 'text-strata-lume' : 'text-blue-400'}`} />
            ) : (
              <div 
                className={`text-3xl font-bold ${lumeMode ? 'text-strata-lume' : 'text-white'}`}
                style={lumeMode ? { 
                  textShadow: `0 0 ${glowSize(12)}px hsla(120, 100%, 62%, ${glowOpacity(0.8)})` 
                } : {}}
              >
                {currentWeather.wind}<span className="text-lg ml-1">mph</span>
              </div>
            )}
          </div>

          {/* Humidity */}
          <div 
            className={`p-4 rounded-xl border transition-all duration-300 ${
              lumeMode ? 'bg-black/50 border-strata-lume/20' : 'bg-neutral-800 border-neutral-700'
            }`}
            style={lumeMode ? { 
              boxShadow: `inset 0 0 ${glowSize(10)}px hsla(120, 100%, 62%, ${glowOpacity(0.1)})` 
            } : {}}
          >
            <div className="flex items-center gap-2 mb-2">
              <Droplets className={`w-5 h-5 ${lumeMode ? 'text-strata-lume' : 'text-teal-400'}`} />
              <span className={`text-xs font-mono uppercase ${lumeMode ? 'text-strata-lume/50' : 'text-neutral-500'}`}>
                Humidity
              </span>
            </div>
            {loading ? (
              <Loader2 className={`w-6 h-6 animate-spin ${lumeMode ? 'text-strata-lume' : 'text-teal-400'}`} />
            ) : (
              <div 
                className={`text-3xl font-bold ${lumeMode ? 'text-strata-lume' : 'text-white'}`}
                style={lumeMode ? { 
                  textShadow: `0 0 ${glowSize(12)}px hsla(120, 100%, 62%, ${glowOpacity(0.8)})` 
                } : {}}
              >
                {currentWeather.humidity}%
              </div>
            )}
          </div>

          {/* Field Condition */}
          <div 
            className={`p-4 rounded-xl border transition-all duration-300 ${
              lumeMode ? 'bg-black/50 border-strata-lume/20' : 'bg-neutral-800 border-neutral-700'
            }`}
            style={lumeMode ? { 
              boxShadow: `inset 0 0 ${glowSize(10)}px hsla(120, 100%, 62%, ${glowOpacity(0.1)})` 
            } : {}}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className={`w-5 h-5 ${lumeMode ? 'text-strata-lume' : 'text-orange-400'}`} />
              <span className={`text-xs font-mono uppercase ${lumeMode ? 'text-strata-lume/50' : 'text-neutral-500'}`}>
                Field
              </span>
            </div>
            {loading ? (
              <Loader2 className={`w-6 h-6 animate-spin ${lumeMode ? 'text-strata-lume' : 'text-orange-400'}`} />
            ) : (
              <div 
                className={`text-xl font-bold ${lumeMode ? 'text-strata-lume' : 'text-orange-400'}`}
                style={lumeMode ? { 
                  textShadow: `0 0 ${glowSize(10)}px hsla(120, 100%, 62%, ${glowOpacity(0.7)})` 
                } : {}}
              >
                {currentWeather.fieldCondition?.split(' ')[0] || 'Good'}
              </div>
            )}
          </div>
        </div>

        {/* Route Efficiency - Expandable */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`mt-4 w-full p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
            lumeMode ? 'bg-black/50 border-strata-lume/20 hover:bg-strata-lume/5' : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-750'
          }`}
        >
          <div className="flex items-center gap-3">
            <TrendingUp className={`w-5 h-5 ${lumeMode ? 'text-strata-lume' : 'text-green-400'}`} />
            <span className={`text-lg font-semibold ${lumeMode ? 'text-strata-lume' : 'text-white'}`}>
              S.H.O.W.S. Protocol
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className={`w-5 h-5 ${lumeMode ? 'text-strata-lume' : 'text-neutral-400'}`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${lumeMode ? 'text-strata-lume' : 'text-neutral-400'}`} />
          )}
        </button>

        {isExpanded && (
          <div className={`mt-2 p-4 rounded-xl border transition-all duration-300 ${
            lumeMode ? 'bg-black/30 border-strata-lume/10' : 'bg-neutral-800/50 border-neutral-700'
          }`}>
            <div className="space-y-3">
              {routeData.map((route, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div 
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                      lumeMode ? 'bg-strata-lume/20 text-strata-lume' : 'bg-neutral-700 text-white'
                    }`}
                    style={lumeMode ? { 
                      boxShadow: `0 0 ${glowSize(8)}px hsla(120, 100%, 62%, ${glowOpacity(0.4)})` 
                    } : {}}
                  >
                    {route.letter}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold ${lumeMode ? 'text-strata-lume' : 'text-white'}`}>
                      {route.name}
                    </div>
                    <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden mt-1">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${lumeMode ? 'bg-strata-lume' : 'bg-green-500'}`}
                        style={{ 
                          width: `${route.efficiency}%`,
                          boxShadow: lumeMode ? `0 0 ${glowSize(6)}px hsla(120, 100%, 62%, ${glowOpacity(0.6)})` : undefined
                        }}
                      />
                    </div>
                  </div>
                  <div 
                    className={`text-xl font-bold ${lumeMode ? 'text-strata-lume' : 'text-white'}`}
                    style={lumeMode ? { 
                      textShadow: `0 0 ${glowSize(8)}px hsla(120, 100%, 62%, ${glowOpacity(0.7)})` 
                    } : {}}
                  >
                    {route.efficiency}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div className={`mt-4 flex items-center gap-2 p-3 rounded-lg ${
          lumeMode ? 'bg-strata-lume/5 border border-strata-lume/10' : 'bg-neutral-800 border border-neutral-700'
        }`}>
          <Shield className={`w-4 h-4 ${lumeMode ? 'text-strata-lume' : 'text-green-400'}`} />
          <span className={`text-xs font-mono ${lumeMode ? 'text-strata-lume/60' : 'text-neutral-500'}`}>
            Encrypted • Lavandar AI Enterprise
          </span>
          <div className={`ml-auto w-2 h-2 rounded-full ${lumeMode ? 'bg-strata-lume' : 'bg-green-500'}`} />
        </div>
      </div>

      {/* Google Maps Overlay - Bottom Right */}
      <div 
        className="fixed bottom-4 right-4 w-36 h-28 rounded-xl overflow-hidden border-2 transition-all duration-300 z-10 shadow-lg"
        style={{
          borderColor: lumeMode ? `hsla(120, 100%, 62%, ${glowOpacity(0.4)})` : 'rgba(255,255,255,0.3)',
          boxShadow: lumeMode 
            ? `0 0 ${glowSize(15)}px hsla(120, 100%, 62%, ${glowOpacity(0.3)}), 0 4px 20px rgba(0,0,0,0.5)` 
            : '0 4px 20px rgba(0,0,0,0.5)'
        }}
      >
        {/* Live Map Label */}
        <div 
          className={`absolute top-1 left-1 z-20 px-1.5 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider flex items-center gap-1 ${
            lumeMode ? 'bg-black/80 text-strata-lume' : 'bg-black/80 text-white'
          }`}
          style={lumeMode ? { 
            boxShadow: `0 0 ${glowSize(6)}px hsla(120, 100%, 62%, ${glowOpacity(0.5)})` 
          } : {}}
        >
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${lumeMode ? 'bg-strata-lume' : 'bg-red-500'}`} />
          Live
        </div>
        
        {/* Google Maps Embed - Gillette Stadium */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2959.8799073476584!2d-71.26648082346907!3d42.09095497123199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e4612ba3153e5d%3A0x54a9bb1c5e7c6f2c!2sGillette%20Stadium!5e0!3m2!1sen!2sus!4v1704989200000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0, filter: lumeMode ? 'invert(1) hue-rotate(180deg) saturate(0.5) brightness(0.8)' : 'none' }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Gillette Stadium Location"
          className="w-full h-full"
        />
        
        {/* Tap to expand overlay */}
        <a
          href={`https://www.google.com/maps/place/Gillette+Stadium/@${GILLETTE_LAT},${GILLETTE_LON},15z`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10"
          aria-label="Open Gillette Stadium in Google Maps"
        />
      </div>
    </div>
  );
};

export default MobileZeroLemon;
