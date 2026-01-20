import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, CloudFog, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTemperatureUnit } from '@/hooks/useTemperatureUnit';
import TemperatureUnitToggle from '@/components/TemperatureUnitToggle';

interface Location {
  id: string;
  name: string;
  timezone: string;
  lat: number;
  lon: number;
}

interface WeatherInfo {
  temp: number;
  condition: string;
  description: string;
}

interface ClockData {
  location: Location;
  time: Date;
  weather?: WeatherInfo;
  loading: boolean;
}

const getWeatherIcon = (condition: string) => {
  const code = parseInt(condition) || 0;
  if (code === 0) return Sun;
  if (code <= 3) return Cloud;
  if (code >= 51 && code <= 67) return CloudRain;
  if (code >= 71 && code <= 77) return Snowflake;
  if (code >= 80 && code <= 82) return CloudRain;
  if (code >= 95) return CloudRain;
  if (code >= 45 && code <= 48) return CloudFog;
  return Cloud;
};

const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Clear skies';
  if (code <= 3) return 'Partly cloudy';
  if (code >= 45 && code <= 48) return 'Foggy conditions';
  if (code >= 51 && code <= 55) return 'Light drizzle';
  if (code >= 56 && code <= 57) return 'Freezing drizzle';
  if (code >= 61 && code <= 65) return 'Rainfall';
  if (code >= 66 && code <= 67) return 'Freezing rain';
  if (code >= 71 && code <= 75) return 'Snowfall';
  if (code === 77) return 'Snow grains';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 85 && code <= 86) return 'Snow showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Variable conditions';
};

interface AALWorldClockProps {
  locations: Location[];
  variant?: 'minimal' | 'detailed';
}

const AALWorldClock = ({ locations, variant = 'detailed' }: AALWorldClockProps) => {
  const { formatTemp } = useTemperatureUnit();
  const [clockData, setClockData] = useState<ClockData[]>([]);

  useEffect(() => {
    // Initialize clock data
    setClockData(locations.map(loc => ({
      location: loc,
      time: new Date(),
      loading: true
    })));

    // Fetch weather for all locations
    const fetchWeather = async () => {
      const updatedData = await Promise.all(
        locations.map(async (loc) => {
          try {
            const { data, error } = await supabase.functions.invoke('get-weather', {
              body: { lat: loc.lat, lon: loc.lon }
            });

            if (error) throw error;

            return {
              location: loc,
              time: new Date(),
              weather: {
                temp: Math.round(data.current?.temp || 0),
                condition: String(data.current?.condition || '0'),
                description: getWeatherDescription(parseInt(data.current?.condition) || 0)
              },
              loading: false
            };
          } catch {
            return {
              location: loc,
              time: new Date(),
              loading: false
            };
          }
        })
      );
      setClockData(updatedData);
    };

    fetchWeather();

    // Update times every second
    const interval = setInterval(() => {
      setClockData(prev => prev.map(d => ({ ...d, time: new Date() })));
    }, 1000);

    return () => clearInterval(interval);
  }, [locations]);

  const formatTime = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: timezone
    }).format(date);
  };

  const formatDate = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: timezone
    }).format(date);
  };

  const getTimeAngle = (date: Date, timezone: string) => {
    const timeStr = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timezone
    }).format(date);
    const [hours, minutes] = timeStr.split(':').map(Number);
    return ((hours % 12) * 30) + (minutes * 0.5);
  };

  return (
    <div className={`grid gap-6 ${
      locations.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
      locations.length === 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5' :
      'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7'
    }`}>
      {clockData.map((data, index) => {
        const WeatherIcon = data.weather ? getWeatherIcon(data.weather.condition) : Cloud;
        const hourAngle = getTimeAngle(data.time, data.location.timezone);
        const minuteAngle = (data.time.getMinutes() * 6) + (data.time.getSeconds() * 0.1);

        return (
          <div
            key={data.location.id}
            className="group relative"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* AAL-style geometric card */}
            <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:border-rose-500/30 hover:shadow-[0_0_40px_rgba(244,63,94,0.1)]">
              {/* Ruled surface lines - AAL signature */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-px bg-gradient-to-r from-transparent via-rose-400 to-transparent"
                    style={{
                      top: `${12 + i * 12}%`,
                      left: '5%',
                      right: '5%',
                      transform: `rotate(${-2 + i * 0.5}deg)`
                    }}
                  />
                ))}
              </div>

              {/* Precision corner accents - AAL detail */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-rose-500/40 rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-rose-500/40 rounded-br-2xl" />

              {/* Location name */}
              <div className="relative z-10 mb-4">
                <h3 className="text-lg font-light text-white tracking-wide">{data.location.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{data.location.timezone}</p>
              </div>

              {/* Analog clock face */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-inner">
                  {/* Hour markers */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-0.5 h-2 bg-rose-400/60"
                      style={{
                        top: '8%',
                        left: '50%',
                        transformOrigin: '50% 400%',
                        transform: `translateX(-50%) rotate(${i * 30}deg)`
                      }}
                    />
                  ))}
                  
                  {/* Hour hand */}
                  <div
                    className="absolute w-1 h-6 bg-gradient-to-t from-rose-500 to-rose-300 rounded-full origin-bottom"
                    style={{
                      bottom: '50%',
                      left: 'calc(50% - 2px)',
                      transform: `rotate(${hourAngle}deg)`
                    }}
                  />
                  
                  {/* Minute hand */}
                  <div
                    className="absolute w-0.5 h-8 bg-gradient-to-t from-white to-slate-300 rounded-full origin-bottom"
                    style={{
                      bottom: '50%',
                      left: 'calc(50% - 1px)',
                      transform: `rotate(${minuteAngle}deg)`
                    }}
                  />
                  
                  {/* Center dot */}
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                </div>
              </div>

              {/* Digital time */}
              <div className="text-center mb-4">
                <p className="text-2xl font-mono text-white tracking-widest">
                  {formatTime(data.time, data.location.timezone)}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatDate(data.time, data.location.timezone)}
                </p>
              </div>

              {/* Weather section */}
              {variant === 'detailed' && (
                <div className="relative z-10 pt-4 border-t border-slate-700/30">
                  {data.loading ? (
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs">Loading weather...</span>
                    </div>
                  ) : data.weather ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <WeatherIcon className="w-5 h-5 text-rose-400" />
                          <span className="text-xl font-light text-white">{formatTemp(data.weather.temp)}</span>
                        </div>
                        <TemperatureUnitToggle variant="minimal" size="sm" />
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {data.weather.description}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center">Weather unavailable</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AALWorldClock;
