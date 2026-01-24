import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Cloud, Wind, Thermometer, Droplets, MapPin, Clock, 
  ChevronRight, RefreshCw, TrendingUp, Loader2, Navigation,
  Waves, Plane, Building2, Calendar, ExternalLink, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Location {
  city: string;
  region: string;
  regionCode: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  displayName: string;
  isFallback: boolean;
}

interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    wind: number;
    windGusts: number;
    windDirection: string;
    condition: string;
    precipitation: number;
  };
  forecast: Array<{
    time: string;
    temp: number;
    precipProb: number;
    wind: number;
  }>;
  timestamp: string;
}

// Kengo Kuma glass panel
const GlassPanel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] ${className}`}>
    <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-emerald-500/40" />
    <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-emerald-500/40" />
    <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-emerald-500/40" />
    <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-emerald-500/40" />
    {children}
  </div>
);

const VerticalSlats = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
    {[...Array(50)].map((_, i) => (
      <div key={i} className="absolute h-full w-px bg-white" style={{ left: `${(i + 1) * 2}%` }} />
    ))}
  </div>
);

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="text-right">
      <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
        {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      <div className="font-mono text-lg text-emerald-400 tracking-wider">
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
    </div>
  );
};

const WeatherShowcase = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLocation = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ip-geolocation');
      if (error) throw error;
      if (data?.location) {
        setLocation(data.location);
        return data.location;
      }
    } catch (err) {
      console.error('Location error:', err);
      // Fallback
      const fallback: Location = {
        city: 'Washington',
        region: 'District of Columbia',
        regionCode: 'DC',
        country: 'United States',
        countryCode: 'US',
        latitude: 38.8977,
        longitude: -77.0365,
        timezone: 'America/New_York',
        displayName: 'Washington, DC',
        isFallback: true,
      };
      setLocation(fallback);
      return fallback;
    }
  };

  const fetchWeather = async (lat: number, lon: number, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { lat, lon }
      });
      if (error) throw error;
      setWeather(data);
      if (isRefresh) toast.success('Weather updated');
    } catch (err) {
      console.error('Weather error:', err);
      toast.error('Failed to fetch weather');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const loc = await fetchLocation();
      if (loc) {
        await fetchWeather(loc.latitude, loc.longitude);
      }
      setLoading(false);
    };
    init();
  }, []);

  const industryLinks = [
    { path: '/aviation', label: 'Aviation', icon: Plane, description: 'Flight operations weather' },
    { path: '/marine', label: 'Marine', icon: Waves, description: 'Coastal & maritime' },
    { path: '/construction', label: 'Construction', icon: Building2, description: 'Site conditions' },
    { path: '/events', label: 'Events', icon: Calendar, description: 'Venue forecasts' },
  ];

  const getConditionIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('clear') || c.includes('sunny')) return '☀️';
    if (c.includes('cloud')) return '☁️';
    if (c.includes('rain') || c.includes('shower')) return '🌧️';
    if (c.includes('snow')) return '❄️';
    if (c.includes('thunder')) return '⛈️';
    if (c.includes('fog')) return '🌫️';
    return '🌤️';
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      <VerticalSlats />
      
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/5 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <Link to="/" className="text-zinc-500 hover:text-emerald-400 transition-colors text-xs font-mono uppercase tracking-wider">
            ← LAVANDAR
          </Link>
          <LiveClock />
        </header>

        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-emerald-500" />
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Weather Intelligence</span>
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
            <Shield className="w-6 h-6 text-emerald-500" />
          </div>
          
          <h1 className="text-4xl font-light tracking-[0.1em] text-white mb-2">
            WEATHER SHOWCASE
          </h1>
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Real-Time Atmospheric Intelligence
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            <span className="ml-3 text-zinc-500 text-sm">Detecting location...</span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Location Card */}
            <GlassPanel className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/30">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl text-white font-light tracking-wide">
                      {location?.city || 'Unknown'}
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      {location?.region}, {location?.countryCode}
                    </p>
                  </div>
                  {location?.isFallback && (
                    <Badge variant="outline" className="text-[8px] border-amber-500/50 text-amber-400">
                      FALLBACK
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => location && fetchWeather(location.latitude, location.longitude, true)}
                    disabled={refreshing}
                    className="text-zinc-500 hover:text-white h-8 w-8 p-0"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>

              {weather && (
                <>
                  {/* Main Weather Display */}
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-5xl mb-2">{getConditionIcon(weather.current.condition)}</div>
                      <p className="text-sm text-zinc-400">{weather.current.condition}</p>
                    </div>
                    <div className="text-center border-x border-zinc-800 px-6">
                      <div className="text-5xl font-light text-white">{weather.current.temp}°</div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1">
                        Feels like {weather.current.feelsLike}°F
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-light text-emerald-400">{weather.current.wind}</div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                        mph {weather.current.windDirection}
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-4 p-4 bg-zinc-900/50 border border-zinc-800">
                    <div className="text-center">
                      <Thermometer className="w-4 h-4 mx-auto text-zinc-500 mb-1" />
                      <p className="text-lg text-white">{weather.current.temp}°F</p>
                      <p className="text-[9px] uppercase text-zinc-600">Temperature</p>
                    </div>
                    <div className="text-center">
                      <Wind className="w-4 h-4 mx-auto text-zinc-500 mb-1" />
                      <p className="text-lg text-white">{weather.current.windGusts} mph</p>
                      <p className="text-[9px] uppercase text-zinc-600">Gusts</p>
                    </div>
                    <div className="text-center">
                      <Droplets className="w-4 h-4 mx-auto text-zinc-500 mb-1" />
                      <p className="text-lg text-white">{weather.current.humidity}%</p>
                      <p className="text-[9px] uppercase text-zinc-600">Humidity</p>
                    </div>
                    <div className="text-center">
                      <Cloud className="w-4 h-4 mx-auto text-zinc-500 mb-1" />
                      <p className="text-lg text-white">{weather.current.precipitation}"</p>
                      <p className="text-[9px] uppercase text-zinc-600">Precip</p>
                    </div>
                  </div>

                  {/* Hourly Forecast */}
                  <div className="mt-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Next 4 Hours
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      {weather.forecast.map((hour, i) => (
                        <div key={i} className="p-3 bg-zinc-900/30 border border-zinc-800 text-center">
                          <p className="text-[10px] text-zinc-500 mb-2">
                            {new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric' })}
                          </p>
                          <p className="text-lg text-white">{hour.temp}°</p>
                          <p className="text-[9px] text-zinc-600">{hour.precipProb}% rain</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Coordinates */}
              <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div className="font-mono text-[10px] text-zinc-600">
                  {location?.latitude.toFixed(4)}°N, {Math.abs(location?.longitude || 0).toFixed(4)}°W
                </div>
                <div className="text-[9px] text-zinc-600">
                  Updated {weather?.timestamp ? new Date(weather.timestamp).toLocaleTimeString() : '--'}
                </div>
              </div>
            </GlassPanel>

            {/* Industry Links */}
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-4 px-1">
                Industry Solutions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {industryLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="group p-4 border border-zinc-800 bg-zinc-900/30 hover:border-emerald-500/40 transition-all"
                    >
                      <Icon className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 mb-2 transition-colors" />
                      <h4 className="text-sm text-white mb-1">{link.label}</h4>
                      <p className="text-[10px] text-zinc-600">{link.description}</p>
                      <div className="mt-2 flex items-center gap-1 text-[9px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        View <ChevronRight className="w-3 h-3" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Navigation Links */}
            <GlassPanel className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Navigation className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-sm text-white">Economic Intelligence</h3>
                    <p className="text-[10px] text-zinc-500">5-Day Market Forecast & Policy Radar</p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/forecast')}
                  variant="outline"
                  size="sm"
                  className="text-[10px] uppercase tracking-wider border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                >
                  View Forecast
                  <TrendingUp className="w-3 h-3 ml-2" />
                </Button>
              </div>
            </GlassPanel>

            {/* Footer */}
            <footer className="text-center pt-6 border-t border-zinc-900">
              <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-700">
                LAVANDAR Precision Intelligence • IP-Based Location Detection
              </p>
            </footer>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WeatherShowcase;