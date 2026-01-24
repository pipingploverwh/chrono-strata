import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cloud, CloudRain, Sun, Wind, Snowflake, Waves, Plane, 
  Compass, ThermometerSun, Droplets, Eye, ArrowUp,
  Navigation, Anchor, Radio, TrendingUp, Clock, MapPin,
  Activity, Gauge, BarChart3, Layers, Signal
} from "lucide-react";
import { useWeatherData } from "@/hooks/useWeatherData";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

// Northeast Atlantic Corridor - Intelligence Network
const NORTHEAST_CITIES = [
  { name: "Boston", lat: 42.3601, lon: -71.0589, designation: "BOS", sector: "Historic Harbor" },
  { name: "New York", lat: 40.7128, lon: -74.0060, designation: "NYC", sector: "Metropolitan" },
  { name: "Portland", lat: 43.6591, lon: -70.2568, designation: "PWM", sector: "Coastal Maine" },
  { name: "Providence", lat: 41.8240, lon: -71.4128, designation: "PVD", sector: "Ocean State" },
  { name: "Cape Cod", lat: 41.6688, lon: -70.2962, designation: "HYA", sector: "Maritime" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURAL ELEMENTS - AAL Precision Geometry & Kengo Kuma Layering
// ═══════════════════════════════════════════════════════════════════════════════

// Kengo Kuma Vertical Slats - Layered transparency
const KumaSlats = ({ count = 12, className = "" }: { count?: number; className?: string }) => (
  <div className={`absolute inset-0 flex justify-between pointer-events-none overflow-hidden ${className}`}>
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        className="w-px bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ delay: i * 0.02, duration: 0.8 }}
      />
    ))}
  </div>
);

// Precision Ruled Surface Lines
const RuledSurface = ({ lines = 8 }: { lines?: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(lines)].map((_, i) => (
      <div
        key={i}
        className="absolute h-px bg-gradient-to-r from-transparent via-zinc-600/20 to-transparent"
        style={{
          top: `${12 + i * 12}%`,
          left: 0,
          right: 0,
          transform: `rotate(${-0.3 + i * 0.05}deg)`
        }}
      />
    ))}
  </div>
);

// AAL Geometric Corner Accents
const PrecisionCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const positions = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0 rotate-90',
    bl: 'bottom-0 left-0 -rotate-90',
    br: 'bottom-0 right-0 rotate-180'
  };
  
  return (
    <div className={`absolute w-8 h-8 ${positions[position]} pointer-events-none`}>
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <path
          d="M0 0 L32 0 L32 4 L4 4 L4 32 L0 32 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-emerald-500/40"
        />
        <circle cx="2" cy="2" r="1" className="fill-emerald-500/60" />
      </svg>
    </div>
  );
};

// Glass Panel with Kuma Layering
const GlassPanel = ({ children, className = "", variant = "default" }: { 
  children: React.ReactNode; 
  className?: string;
  variant?: "default" | "elevated" | "sunken";
}) => {
  const variants = {
    default: "bg-zinc-900/60 backdrop-blur-xl border-zinc-700/30",
    elevated: "bg-zinc-800/70 backdrop-blur-2xl border-emerald-500/20 shadow-2xl shadow-emerald-500/5",
    sunken: "bg-zinc-950/80 backdrop-blur-sm border-zinc-800/40"
  };
  
  return (
    <motion.div 
      className={`relative border ${variants[variant]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <PrecisionCorner position="tl" />
      <PrecisionCorner position="tr" />
      <PrecisionCorner position="bl" />
      <PrecisionCorner position="br" />
      <KumaSlats count={8} className="opacity-30" />
      {children}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATA & UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

const generateFlightData = () => ({
  activeFlights: Math.floor(Math.random() * 200) + 800,
  avgAltitude: Math.floor(Math.random() * 5000) + 30000,
  busyAirport: ["BOS", "JFK", "LGA", "EWR"][Math.floor(Math.random() * 4)],
  delays: Math.floor(Math.random() * 15),
});

const generateMarineData = () => ({
  waveHeight: (Math.random() * 4 + 1).toFixed(1),
  waterTemp: Math.floor(Math.random() * 10 + 55),
  tideStatus: ["RISING", "FALLING", "HIGH", "LOW"][Math.floor(Math.random() * 4)],
  visibility: Math.floor(Math.random() * 5 + 5),
});

const getWeatherIcon = (condition: string, temp: number) => {
  const c = condition?.toLowerCase() || "";
  if (c.includes("snow") || temp < 32) return <Snowflake className="w-8 h-8" />;
  if (c.includes("rain") || c.includes("shower")) return <CloudRain className="w-8 h-8" />;
  if (c.includes("cloud") || c.includes("overcast")) return <Cloud className="w-8 h-8" />;
  if (c.includes("wind")) return <Wind className="w-8 h-8" />;
  return <Sun className="w-8 h-8" />;
};

// AI Insight Generator
const useAIInsight = (weather: any, marine: any, flights: any, cityName: string) => {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!weather?.current) return;
    
    const generateInsight = async () => {
      setLoading(true);
      try {
        const prompt = `You are a concise meteorological analyst. Provide a 1-2 sentence professional insight about ${cityName}. Weather: ${weather.current.temp}°F, ${weather.current.condition}, wind ${weather.current.wind}mph. Ocean waves: ${marine.waveHeight}ft, water ${marine.waterTemp}°F. ${flights.activeFlights} flights in corridor. Be precise and technical. No emojis.`;
        
        const { data } = await supabase.functions.invoke('ai-harmony', {
          body: { prompt, model: 'google/gemini-2.5-flash-lite' }
        });
        
        setInsight(data?.response || getLocalInsight(weather, marine, cityName));
      } catch {
        setInsight(getLocalInsight(weather, marine, cityName));
      }
      setLoading(false);
    };

    generateInsight();
  }, [cityName]);

  return { insight, loading };
};

const getLocalInsight = (weather: any, marine: any, city: string) => {
  const temp = weather?.current?.temp || 60;
  if (temp > 75) return `Optimal conditions in ${city}. Marine activity favorable with moderate swells.`;
  if (temp < 40) return `Cold front active over ${city}. Recommend monitoring wind chill factors.`;
  return `Standard atmospheric conditions in ${city}. All systems nominal.`;
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRECISION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Live Clock - Precision Display
const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="font-mono text-sm tracking-widest">
      <span className="text-emerald-400">
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
      </span>
      <span className="text-zinc-500 ml-2">EST</span>
    </div>
  );
};

// Metric Display - AAL Typography
const MetricDisplay = ({ 
  label, 
  value, 
  unit, 
  icon: Icon,
  accent = false 
}: { 
  label: string; 
  value: string | number; 
  unit?: string; 
  icon: any;
  accent?: boolean;
}) => (
  <div className="flex items-center gap-3 px-3 py-2">
    <div className={`p-1.5 rounded ${accent ? 'bg-emerald-500/20' : 'bg-zinc-800/60'}`}>
      <Icon className={`w-3.5 h-3.5 ${accent ? 'text-emerald-400' : 'text-zinc-400'}`} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-light text-white">{value}</span>
        {unit && <span className="text-[10px] text-zinc-500">{unit}</span>}
      </div>
    </div>
  </div>
);

// City Intelligence Card - Primary Display
const CityCard = ({ city, index, isSelected, onSelect }: any) => {
  const { weather, loading } = useWeatherData(city.lat, city.lon, city.name);
  const [marine] = useState(generateMarineData());
  const [flights] = useState(generateFlightData());
  const { insight } = useAIInsight(weather, marine, flights, city.name);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        className="h-56 rounded-lg bg-zinc-900/50 border border-zinc-800/50 animate-pulse"
      />
    );
  }

  const temp = weather?.current?.temp || 60;
  const condition = weather?.current?.condition || "Clear";
  const windSpeed = weather?.current?.wind || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 120, damping: 20 }}
      whileHover={{ y: -2 }}
      onClick={() => onSelect(city)}
      className="cursor-pointer group"
    >
      <GlassPanel 
        variant={isSelected ? "elevated" : "default"}
        className="rounded-lg overflow-hidden"
      >
        <div className="relative p-5">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {city.designation}
                </span>
                <span className="text-xs text-zinc-600">|</span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                  {city.sector}
                </span>
              </div>
              <h3 className="text-xl font-extralight text-white mt-1 tracking-wide">
                {city.name}
              </h3>
            </div>
            
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="text-emerald-400/80"
            >
              {getWeatherIcon(condition, temp)}
            </motion.div>
          </div>

          {/* Temperature Display - Dominant */}
          <div className="mb-4">
            <div className="flex items-end gap-1">
              <motion.span 
                className="text-5xl font-extralight text-white tracking-tight"
                key={temp}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {temp}
              </motion.span>
              <span className="text-lg text-zinc-500 mb-2 font-light">°F</span>
            </div>
            <p className="text-sm text-zinc-400 font-light tracking-wide">{condition}</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-px bg-zinc-800/30 rounded-lg overflow-hidden mb-4">
            <div className="bg-zinc-900/60 p-3 text-center">
              <Wind className="w-4 h-4 text-zinc-500 mx-auto mb-1" />
              <div className="text-sm font-light text-white">{windSpeed}</div>
              <div className="text-[9px] uppercase tracking-wider text-zinc-600">mph</div>
            </div>
            <div className="bg-zinc-900/60 p-3 text-center">
              <Waves className="w-4 h-4 text-zinc-500 mx-auto mb-1" />
              <div className="text-sm font-light text-white">{marine.waveHeight}</div>
              <div className="text-[9px] uppercase tracking-wider text-zinc-600">ft swell</div>
            </div>
            <div className="bg-zinc-900/60 p-3 text-center">
              <Plane className="w-4 h-4 text-zinc-500 mx-auto mb-1" />
              <div className="text-sm font-light text-white">{flights.activeFlights}</div>
              <div className="text-[9px] uppercase tracking-wider text-zinc-600">flights</div>
            </div>
          </div>

          {/* AI Insight */}
          <AnimatePresence>
            {insight && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-3 border-t border-zinc-800/50"
              >
                <div className="flex items-start gap-2">
                  <Activity className="w-3 h-3 text-emerald-500/60 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">{insight}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassPanel>
    </motion.div>
  );
};

// Live Data Ticker - Precision Stream
const LiveTicker = () => {
  const [flights] = useState(generateFlightData());
  const [marine] = useState(generateMarineData());
  
  return (
    <GlassPanel variant="sunken" className="rounded-lg overflow-hidden">
      <div className="flex items-center gap-6 px-4 py-3 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
          />
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-medium">LIVE</span>
        </div>
        
        <div className="h-3 w-px bg-zinc-700" />
        
        <div className="flex items-center gap-2 text-zinc-400 whitespace-nowrap">
          <Plane className="w-3 h-3" />
          <span className="text-xs font-light">{flights.activeFlights} aircraft</span>
        </div>
        
        <div className="flex items-center gap-2 text-zinc-400 whitespace-nowrap">
          <Waves className="w-3 h-3" />
          <span className="text-xs font-light">{marine.waveHeight}ft swells</span>
        </div>
        
        <div className="flex items-center gap-2 text-zinc-400 whitespace-nowrap">
          <Anchor className="w-3 h-3" />
          <span className="text-xs font-light">{marine.tideStatus}</span>
        </div>
        
        <div className="flex items-center gap-2 text-zinc-400 whitespace-nowrap">
          <ThermometerSun className="w-3 h-3" />
          <span className="text-xs font-light">{marine.waterTemp}°F water</span>
        </div>
      </div>
    </GlassPanel>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const NortheastWeather = () => {
  const [selectedCity, setSelectedCity] = useState(NORTHEAST_CITIES[0]);

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Kuma Architectural Background */}
      <div className="absolute inset-0">
        {/* Gradient Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black" />
        
        {/* Vertical Slat Pattern */}
        <div className="absolute inset-0 flex justify-between px-8 opacity-[0.03]">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-px h-full bg-white" />
          ))}
        </div>
        
        {/* Ruled Surface Lines */}
        <RuledSurface lines={12} />
        
        {/* Subtle Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.04),transparent_60%)]" />
        
        {/* Floating Architectural Elements */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full border border-emerald-500/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ top: "-15%", right: "-10%" }}
        />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8">
        {/* Header - Precision Typography */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <GlassPanel variant="elevated" className="rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="text-emerald-400"
                >
                  <Compass className="w-6 h-6" />
                </motion.div>
                <div>
                  <h1 className="text-lg font-extralight text-white tracking-wide">
                    Northeast Atlantic Corridor
                  </h1>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                    Weather · Marine · Aviation Intelligence
                  </p>
                </div>
              </div>
              <LiveClock />
            </div>
            
            {/* System Status Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Signal className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-zinc-500">CONN</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-zinc-500">5 NODES</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-zinc-500">NOMINAL</span>
                </div>
              </div>
              <Link 
                to="/weather-showcase" 
                className="text-[10px] text-emerald-400/70 hover:text-emerald-400 transition-colors uppercase tracking-wider"
              >
                Global View
              </Link>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Live Ticker */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <LiveTicker />
        </motion.div>

        {/* City Cards */}
        <div className="space-y-4">
          {NORTHEAST_CITIES.map((city, index) => (
            <CityCard
              key={city.name}
              city={city}
              index={index}
              isSelected={selectedCity.name === city.name}
              onSelect={setSelectedCity}
            />
          ))}
        </div>

        {/* Footer - Minimal Attribution */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-zinc-700" />
            <Navigation className="w-3 h-3 text-zinc-600" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-zinc-700" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-light">
            Strata Intelligence Network
          </p>
          <p className="text-[9px] text-zinc-700 mt-1">
            Real-time atmospheric data · AI-enhanced analysis
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NortheastWeather;
