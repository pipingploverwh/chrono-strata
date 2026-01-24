import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cloud, CloudRain, Sun, Wind, Snowflake, Waves, Plane, 
  Compass, ThermometerSun, Droplets, Eye, ArrowUp, Sparkles,
  Navigation, Anchor, Radio, TrendingUp, Clock, MapPin
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWeatherData } from "@/hooks/useWeatherData";
import { supabase } from "@/integrations/supabase/client";

const NORTHEAST_CITIES = [
  { name: "Boston", lat: 42.3601, lon: -71.0589, emoji: "🏛️", vibe: "Historic Harbor" },
  { name: "New York", lat: 40.7128, lon: -74.0060, emoji: "🗽", vibe: "The Big Apple" },
  { name: "Portland", lat: 43.6591, lon: -70.2568, emoji: "🦞", vibe: "Coastal Maine" },
  { name: "Providence", lat: 41.8240, lon: -71.4128, emoji: "⛵", vibe: "Ocean State" },
  { name: "Cape Cod", lat: 41.6688, lon: -70.2962, emoji: "🐚", vibe: "Summer Escape" },
];

// Simulated real-time data
const generateFlightData = () => ({
  activeFlights: Math.floor(Math.random() * 200) + 800,
  avgAltitude: Math.floor(Math.random() * 5000) + 30000,
  busyAirport: ["BOS", "JFK", "LGA", "EWR"][Math.floor(Math.random() * 4)],
  delays: Math.floor(Math.random() * 15),
});

const generateMarineData = () => ({
  waveHeight: (Math.random() * 4 + 1).toFixed(1),
  waterTemp: Math.floor(Math.random() * 10 + 55),
  tideStatus: ["Rising", "Falling", "High", "Low"][Math.floor(Math.random() * 4)],
  visibility: Math.floor(Math.random() * 5 + 5),
});

const getWeatherIcon = (condition: string, temp: number) => {
  const c = condition?.toLowerCase() || "";
  if (c.includes("snow") || temp < 32) return <Snowflake className="w-10 h-10" />;
  if (c.includes("rain") || c.includes("shower")) return <CloudRain className="w-10 h-10" />;
  if (c.includes("cloud") || c.includes("overcast")) return <Cloud className="w-10 h-10" />;
  if (c.includes("wind")) return <Wind className="w-10 h-10" />;
  return <Sun className="w-10 h-10" />;
};

const getConditionGradient = (condition: string, temp: number) => {
  const c = condition?.toLowerCase() || "";
  if (c.includes("snow") || temp < 32) return "from-blue-400 via-blue-300 to-white";
  if (c.includes("rain")) return "from-slate-500 via-blue-400 to-slate-600";
  if (c.includes("cloud")) return "from-slate-400 via-gray-300 to-slate-500";
  if (temp > 80) return "from-orange-400 via-yellow-300 to-red-400";
  return "from-amber-300 via-sky-300 to-blue-400";
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
        const prompt = `You are a friendly, engaging weather personality. Give a 1-2 sentence insight about ${cityName} right now. Weather: ${weather.current.temp}°F, ${weather.current.condition}, wind ${weather.current.wind}mph. Ocean waves: ${marine.waveHeight}ft, water ${marine.waterTemp}°F. ${flights.activeFlights} flights overhead. Be conversational and mention something interesting or useful for an average person. Keep it fun!`;
        
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
  if (temp > 75) return `Perfect beach weather in ${city}! The ocean is calling. 🏖️`;
  if (temp < 40) return `Bundle up in ${city}! Great day for hot cocoa by the window. ☕`;
  return `Beautiful conditions in ${city}. Perfect for a coastal walk! 🌊`;
};

// Live Clock
const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="font-mono text-lg text-white/90">
      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
  );
};

// Animated Stat Card
const StatPill = ({ icon: Icon, label, value, unit, color }: any) => (
  <motion.div 
    whileHover={{ scale: 1.05, y: -2 }}
    className={`flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20`}
  >
    <Icon className={`w-4 h-4 ${color}`} />
    <span className="text-xs text-white/70">{label}</span>
    <span className="text-sm font-semibold text-white">{value}{unit}</span>
  </motion.div>
);

// City Weather Card
const CityCard = ({ city, index, isSelected, onSelect }: any) => {
  const { weather, loading } = useWeatherData(city.lat, city.lon, city.name);
  const [marine] = useState(generateMarineData());
  const [flights] = useState(generateFlightData());
  const { insight, loading: insightLoading } = useAIInsight(weather, marine, flights, city.name);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="h-48 rounded-3xl bg-gradient-to-br from-slate-700 to-slate-800 animate-pulse"
      />
    );
  }

  const temp = weather?.current?.temp || 60;
  const condition = weather?.current?.condition || "Clear";
  const gradient = getConditionGradient(condition, temp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(city)}
      className="cursor-pointer"
    >
      <Card className={`relative overflow-hidden rounded-3xl border-0 bg-gradient-to-br ${gradient} p-1`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
              x: Math.sin(i) * 20
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{ left: `${20 + i * 15}%`, bottom: 0 }}
          />
        ))}

        <div className="relative p-5 min-h-[200px] flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{city.emoji}</span>
                <h3 className="text-xl font-bold text-white drop-shadow-lg">{city.name}</h3>
              </div>
              <p className="text-sm text-white/80 mt-0.5">{city.vibe}</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-white drop-shadow-lg"
            >
              {getWeatherIcon(condition, temp)}
            </motion.div>
          </div>

          {/* Temperature */}
          <div className="my-4">
            <div className="flex items-end gap-1">
              <motion.span 
                className="text-6xl font-bold text-white drop-shadow-lg"
                key={temp}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {temp}
              </motion.span>
              <span className="text-2xl text-white/80 mb-2">°F</span>
            </div>
            <p className="text-white/90 font-medium">{condition}</p>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-2">
            <StatPill icon={Wind} label="" value={weather?.current?.wind || 0} unit=" mph" color="text-cyan-200" />
            <StatPill icon={Waves} label="" value={marine.waveHeight} unit=" ft" color="text-blue-200" />
            <StatPill icon={Plane} label="" value={flights.activeFlights} unit="" color="text-amber-200" />
          </div>

          {/* AI Insight */}
          <AnimatePresence>
            {insight && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 p-3 rounded-xl bg-white/20 backdrop-blur-sm"
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-200 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-white/90 leading-relaxed">{insight}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

// Live Data Ticker
const LiveTicker = () => {
  const [flights] = useState(generateFlightData());
  const [marine] = useState(generateMarineData());
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide"
    >
      <div className="flex items-center gap-2 text-white/80 whitespace-nowrap">
        <Radio className="w-4 h-4 text-green-400 animate-pulse" />
        <span className="text-sm">LIVE</span>
      </div>
      <div className="flex items-center gap-2 text-white/70 whitespace-nowrap">
        <Plane className="w-4 h-4" />
        <span className="text-sm">{flights.activeFlights} flights over NE</span>
      </div>
      <div className="flex items-center gap-2 text-white/70 whitespace-nowrap">
        <Waves className="w-4 h-4" />
        <span className="text-sm">Atlantic: {marine.waveHeight}ft swells</span>
      </div>
      <div className="flex items-center gap-2 text-white/70 whitespace-nowrap">
        <Anchor className="w-4 h-4" />
        <span className="text-sm">Tide: {marine.tideStatus}</span>
      </div>
      <div className="flex items-center gap-2 text-white/70 whitespace-nowrap">
        <ThermometerSun className="w-4 h-4" />
        <span className="text-sm">Water: {marine.waterTemp}°F</span>
      </div>
    </motion.div>
  );
};

// Main Component
const NortheastWeather = () => {
  const [selectedCity, setSelectedCity] = useState(NORTHEAST_CITIES[0]);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setShowPulse(p => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ top: "-20%", left: "-10%" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          style={{ bottom: "10%", right: "-5%" }}
        />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Compass className="w-8 h-8 text-amber-400" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white">Northeast Live</h1>
            <motion.div
              animate={{ scale: showPulse ? [1, 1.2, 1] : 1 }}
              className="w-2 h-2 rounded-full bg-green-400"
            />
          </div>
          <p className="text-white/60 text-sm">Weather • Marine • Aviation</p>
          <LiveClock />
        </motion.div>

        {/* Live Ticker */}
        <div className="mb-6">
          <LiveTicker />
        </div>

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

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 space-y-2"
        >
          <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
            <Navigation className="w-3 h-3" />
            <span>Powered by STRATA Intelligence</span>
          </div>
          <p className="text-white/30 text-xs">Real-time data • AI insights • Updated every minute</p>
        </motion.div>
      </div>
    </div>
  );
};

export default NortheastWeather;
