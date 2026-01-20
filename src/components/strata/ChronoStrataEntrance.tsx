import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Anchor, Plane, Ship, Snowflake, Sun, Thermometer, Building2, 
  Wind, Droplets, Eye, ArrowRight, Loader2, Globe, MapPin,
  Cloud, CloudRain, Waves, Compass
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTemperatureUnit } from '@/hooks/useTemperatureUnit';
import TemperatureUnitToggle from '@/components/TemperatureUnitToggle';

// The seven global strata - key environmental zones
interface Stratum {
  id: string;
  name: string;
  icon: React.ElementType;
  timezone: string;
  lat: number;
  lon: number;
  climate: 'polar' | 'temperate' | 'desert' | 'tropical' | 'maritime' | 'urban' | 'equatorial';
  description: string;
  color: string;
  gradient: string;
}

const GLOBAL_STRATA: Stratum[] = [
  {
    id: 'marine',
    name: 'Pacific Marine',
    icon: Anchor,
    timezone: 'Pacific/Auckland',
    lat: -36.8485,
    lon: 174.7633,
    climate: 'maritime',
    description: 'Oceanic conditions, tidal rhythms',
    color: 'text-cyan-400',
    gradient: 'from-cyan-500/20 via-blue-600/10 to-transparent'
  },
  {
    id: 'aviation',
    name: 'Dubai Aviation',
    icon: Plane,
    timezone: 'Asia/Dubai',
    lat: 25.2048,
    lon: 55.2708,
    climate: 'desert',
    description: 'High-altitude corridor, thermal drafts',
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 via-orange-600/10 to-transparent'
  },
  {
    id: 'port',
    name: 'Rotterdam Port',
    icon: Ship,
    timezone: 'Europe/Amsterdam',
    lat: 51.9244,
    lon: 4.4777,
    climate: 'temperate',
    description: 'Maritime logistics, North Sea influence',
    color: 'text-slate-400',
    gradient: 'from-slate-500/20 via-zinc-600/10 to-transparent'
  },
  {
    id: 'polar',
    name: 'Tromsø Arctic',
    icon: Snowflake,
    timezone: 'Europe/Oslo',
    lat: 69.6496,
    lon: 18.9560,
    climate: 'polar',
    description: 'Extreme cold, aurora conditions',
    color: 'text-blue-300',
    gradient: 'from-blue-300/20 via-indigo-400/10 to-transparent'
  },
  {
    id: 'desert',
    name: 'Sahara Interior',
    icon: Sun,
    timezone: 'Africa/Tunis',
    lat: 33.8869,
    lon: 9.5375,
    climate: 'desert',
    description: 'Extreme heat, sandstorm patterns',
    color: 'text-orange-500',
    gradient: 'from-orange-500/20 via-red-600/10 to-transparent'
  },
  {
    id: 'equatorial',
    name: 'Singapore Equator',
    icon: Thermometer,
    timezone: 'Asia/Singapore',
    lat: 1.3521,
    lon: 103.8198,
    climate: 'equatorial',
    description: 'Constant humidity, monsoon cycles',
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/20 via-teal-600/10 to-transparent'
  },
  {
    id: 'urban',
    name: 'Tokyo Metropolis',
    icon: Building2,
    timezone: 'Asia/Tokyo',
    lat: 35.6762,
    lon: 139.6503,
    climate: 'urban',
    description: 'Urban heat island, dense atmosphere',
    color: 'text-violet-400',
    gradient: 'from-violet-500/20 via-purple-600/10 to-transparent'
  }
];

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
}

interface StratumLive extends Stratum {
  weather?: WeatherData;
  time?: string;
  date?: string;
  loading: boolean;
}

const getConditionIcon = (code: number) => {
  if (code === 0) return Sun;
  if (code <= 3) return Cloud;
  if (code >= 51 && code <= 67) return CloudRain;
  if (code >= 71 && code <= 77) return Snowflake;
  if (code >= 80) return CloudRain;
  if (code >= 45) return Cloud;
  return Cloud;
};

const getTemperatureColor = (temp: number): string => {
  if (temp <= -10) return 'text-blue-200';
  if (temp <= 0) return 'text-blue-300';
  if (temp <= 10) return 'text-cyan-400';
  if (temp <= 20) return 'text-emerald-400';
  if (temp <= 30) return 'text-amber-400';
  if (temp <= 40) return 'text-orange-500';
  return 'text-red-500';
};

const ChronoStrataEntrance = () => {
  const navigate = useNavigate();
  const { formatTemp } = useTemperatureUnit();
  const [strataData, setStrataData] = useState<StratumLive[]>([]);
  const [selectedStratum, setSelectedStratum] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const [interactionMode, setInteractionMode] = useState<'observe' | 'select' | 'auto'>('observe');
  const [hasAccess, setHasAccess] = useState(false);

  // Check existing access
  useEffect(() => {
    const access = localStorage.getItem('strata_access');
    if (access) setHasAccess(true);
  }, []);

  // Initialize strata data
  useEffect(() => {
    setStrataData(GLOBAL_STRATA.map(s => ({ ...s, loading: true })));

    // Fetch weather for all strata
    const fetchAllWeather = async () => {
      const results = await Promise.all(
        GLOBAL_STRATA.map(async (stratum) => {
          try {
            const { data, error } = await supabase.functions.invoke('get-weather', {
              body: { lat: stratum.lat, lon: stratum.lon }
            });

            if (error) throw error;

            const now = new Date();
            const time = new Intl.DateTimeFormat('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
              timeZone: stratum.timezone
            }).format(now);

            const date = new Intl.DateTimeFormat('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              timeZone: stratum.timezone
            }).format(now);

            return {
              ...stratum,
              weather: {
                temp: Math.round(data.current?.temp || 0),
                humidity: data.current?.humidity || 0,
                windSpeed: data.current?.wind || 0,
                condition: String(data.current?.condition || '0'),
                description: data.current?.fieldCondition || 'Unknown'
              },
              time,
              date,
              loading: false
            };
          } catch {
            return { ...stratum, loading: false };
          }
        })
      );
      setStrataData(results);
    };

    fetchAllWeather();

    // Update times every second
    const interval = setInterval(() => {
      setStrataData(prev => prev.map(s => {
        const now = new Date();
        return {
          ...s,
          time: new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: s.timezone
          }).format(now)
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-detect user location
  useEffect(() => {
    if (interactionMode === 'auto' && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const name = data.address?.city || data.address?.town || 'Your Location';
            setUserLocation({ lat: latitude, lon: longitude, name });

            // Find closest stratum
            let closestId = GLOBAL_STRATA[0].id;
            let minDist = Infinity;
            GLOBAL_STRATA.forEach(s => {
              const dist = Math.sqrt(Math.pow(s.lat - latitude, 2) + Math.pow(s.lon - longitude, 2));
              if (dist < minDist) {
                minDist = dist;
                closestId = s.id;
              }
            });
            setSelectedStratum(closestId);
          } catch {
            setUserLocation({ lat: latitude, lon: longitude, name: 'Your Location' });
          }
        },
        () => {
          // Fallback to first stratum
          setSelectedStratum(GLOBAL_STRATA[0].id);
        }
      );
    }
  }, [interactionMode, userLocation]);

  const activeStratum = useMemo(() => 
    strataData.find(s => s.id === selectedStratum),
    [strataData, selectedStratum]
  );

  const handleEnter = () => {
    if (!hasAccess) {
      navigate('/strata-gate');
      return;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      const count = localStorage.getItem('strata_location_count') || '7';
      navigate(`/world-${count}`);
    }, 1500);
  };

  const handleExplore = () => {
    navigate('/strata');
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Dynamic environment background */}
      <div className="absolute inset-0">
        {/* Base grid - scientific aesthetic */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="chrono-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
                <circle cx="0" cy="0" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#chrono-grid)" />
          </svg>
        </div>

        {/* Dynamic gradient based on selected stratum */}
        <AnimatePresence mode="wait">
          {activeStratum && (
            <motion.div
              key={activeStratum.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className={`absolute inset-0 bg-gradient-to-br ${activeStratum.gradient}`}
            />
          )}
        </AnimatePresence>

        {/* Climate-specific particle effects */}
        <div className="absolute inset-0 pointer-events-none">
          {activeStratum?.climate === 'polar' && (
            <div className="absolute inset-0">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-200 rounded-full opacity-60"
                  initial={{ x: Math.random() * window.innerWidth, y: -10 }}
                  animate={{ y: window.innerHeight + 10 }}
                  transition={{ 
                    duration: 3 + Math.random() * 2, 
                    repeat: Infinity, 
                    delay: Math.random() * 2,
                    ease: 'linear'
                  }}
                />
              ))}
            </div>
          )}
          {activeStratum?.climate === 'desert' && (
            <div className="absolute inset-0 bg-gradient-to-t from-orange-900/10 to-transparent" />
          )}
          {activeStratum?.climate === 'maritime' && (
            <div className="absolute bottom-0 left-0 right-0 h-32">
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
          )}
        </div>

        {/* Transition overlay */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-950 z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <Globe className="w-16 h-16 text-slate-400 mx-auto mb-4 animate-pulse" />
                <p className="text-slate-500 font-mono text-sm tracking-widest">ENTERING STRATA</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-px bg-gradient-to-r from-slate-500 to-transparent" />
                <span className="text-[10px] font-mono text-slate-500 tracking-[0.3em]">CHRONO</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extralight text-white tracking-wide">STRATA</h1>
              <p className="text-[10px] font-mono text-slate-600 tracking-widest mt-1">POWERED BY LAVANDAR</p>
            </div>
            
            {/* Interaction mode selector */}
            <div className="flex items-center gap-2 bg-zinc-900/50 rounded-lg p-1 border border-zinc-800">
              {[
                { mode: 'observe', label: 'Observe', icon: Eye },
                { mode: 'select', label: 'Select', icon: Compass },
                { mode: 'auto', label: 'Auto', icon: MapPin }
              ].map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setInteractionMode(mode as typeof interactionMode)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-mono transition-all ${
                    interactionMode === mode
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Seven Strata Display */}
        <main className="flex-1 px-4 sm:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            {/* Stratum Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 mb-8">
              {strataData.map((stratum, index) => {
                const Icon = stratum.icon;
                const isActive = selectedStratum === stratum.id;
                const ConditionIcon = stratum.weather 
                  ? getConditionIcon(parseInt(stratum.weather.condition))
                  : Cloud;

                return (
                  <motion.button
                    key={stratum.id}
                    onClick={() => interactionMode !== 'observe' && setSelectedStratum(stratum.id)}
                    disabled={interactionMode === 'observe'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={interactionMode !== 'observe' ? { scale: 1.02 } : {}}
                    className={`relative p-4 rounded-xl border transition-all duration-300 text-left ${
                      isActive
                        ? 'bg-zinc-800/80 border-slate-600 shadow-lg'
                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                    } ${interactionMode === 'observe' ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent"
                      />
                    )}

                    {/* Name */}
                    <div className="mb-3">
                      <span className="text-xs font-mono text-slate-400 truncate">{stratum.name.split(' ')[0]}</span>
                    </div>

                    {/* Time */}
                    <div className="mb-2">
                      {stratum.loading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                      ) : (
                        <p className="text-xl font-mono text-white tracking-wider">{stratum.time}</p>
                      )}
                    </div>

                    {/* Weather */}
                    {stratum.weather && (
                      <div className="flex items-center gap-2">
                        <ConditionIcon className="w-3.5 h-3.5 text-slate-500" />
                        <span className={`text-sm font-mono ${getTemperatureColor(stratum.weather.temp)}`}>
                          {formatTemp(stratum.weather.temp)}
                        </span>
                      </div>
                    )}

                    {/* Climate tag */}
                    <div className="absolute bottom-2 right-2">
                      <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">
                        {stratum.climate}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Active Stratum Detail Panel */}
            <AnimatePresence mode="wait">
              {activeStratum && (
                <motion.div
                  key={activeStratum.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8 mb-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Primary info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${activeStratum.gradient} flex items-center justify-center border border-zinc-700`}>
                          <activeStratum.icon className={`w-7 h-7 ${activeStratum.color}`} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-light text-white mb-1">{activeStratum.name}</h2>
                          <p className="text-sm text-slate-400">{activeStratum.description}</p>
                          <p className="text-xs font-mono text-slate-600 mt-1">{activeStratum.timezone}</p>
                        </div>
                      </div>

                      {/* Metrics grid */}
                      {activeStratum.weather && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                            <div className="flex items-center justify-between mb-2">
                              <Thermometer className="w-4 h-4 text-slate-500" />
                              <TemperatureUnitToggle variant="minimal" size="sm" />
                            </div>
                            <p className={`text-2xl font-mono ${getTemperatureColor(activeStratum.weather.temp)}`}>
                              {formatTemp(activeStratum.weather.temp)}
                            </p>
                            <p className="text-[10px] font-mono text-slate-600 uppercase">Temperature</p>
                          </div>
                          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                            <Droplets className="w-4 h-4 text-cyan-500 mb-2" />
                            <p className="text-2xl font-mono text-white">{activeStratum.weather.humidity}%</p>
                            <p className="text-[10px] font-mono text-slate-600 uppercase">Humidity</p>
                          </div>
                          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                            <Wind className="w-4 h-4 text-slate-400 mb-2" />
                            <p className="text-2xl font-mono text-white">{activeStratum.weather.windSpeed}</p>
                            <p className="text-[10px] font-mono text-slate-600 uppercase">Wind m/s</p>
                          </div>
                          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                            <Cloud className="w-4 h-4 text-slate-400 mb-2" />
                            <p className="text-lg font-mono text-white truncate">{activeStratum.weather.description}</p>
                            <p className="text-[10px] font-mono text-slate-600 uppercase">Condition</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Time display */}
                    <div className="flex flex-col items-center justify-center p-6 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
                      <p className="text-5xl sm:text-6xl font-mono text-white tracking-wider mb-2">
                        {activeStratum.time}
                      </p>
                      <p className="text-sm text-slate-400">{activeStratum.date}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <Waves className={`w-4 h-4 ${activeStratum.color}`} />
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                          {activeStratum.climate} zone
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Entry actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={handleEnter}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border border-slate-600 rounded-xl text-white font-medium transition-all"
              >
                <span>{hasAccess ? 'Enter World Clock' : 'Unlock Access'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <button
                onClick={handleExplore}
                className="flex items-center gap-2 px-6 py-4 text-slate-400 hover:text-white transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                <span>Explore Strata Instrument</span>
              </button>
            </div>

            {/* User location indicator */}
            {userLocation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 rounded-full border border-zinc-800">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-mono text-slate-400">
                    Your location: <span className="text-white">{userLocation.name}</span>
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 sm:p-8 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-600">
            <span>CHRONO STRATA × LAVANDAR</span>
            <span>7 STRATA • REAL-TIME GLOBAL CONDITIONS</span>
            <span>DESIGNED BY AAL</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChronoStrataEntrance;
