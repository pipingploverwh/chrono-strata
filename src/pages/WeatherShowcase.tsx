import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Wind, Thermometer, Droplets, MapPin, Clock, Zap, ChevronRight, Sun, Waves } from 'lucide-react';

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
}

interface WeatherPeriod {
  period: string;
  time: string;
  temp: number;
  condition: string;
  weather: {
    wind: number;
    humidity: number;
  };
}

const WeatherShowcase = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activePeriod, setActivePeriod] = useState(0);

  // Weather forecast periods for Falmouth
  const weatherPeriods: WeatherPeriod[] = [
    { 
      period: 'Morning', 
      time: '6:00 AM', 
      temp: 42,
      condition: 'Partly Cloudy',
      weather: { wind: 8, humidity: 72 }
    },
    { 
      period: 'Midday', 
      time: '12:00 PM', 
      temp: 52,
      condition: 'Sunny',
      weather: { wind: 12, humidity: 58 }
    },
    { 
      period: 'Afternoon', 
      time: '3:00 PM', 
      temp: 55,
      condition: 'Clear',
      weather: { wind: 15, humidity: 52 }
    },
    { 
      period: 'Evening', 
      time: '6:00 PM', 
      temp: 48,
      condition: 'Clear',
      weather: { wind: 10, humidity: 62 }
    },
    { 
      period: 'Night', 
      time: '9:00 PM', 
      temp: 40,
      condition: 'Clear',
      weather: { wind: 6, humidity: 75 }
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Auto-advance period based on time
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) setActivePeriod(0);
      else if (hour >= 12 && hour < 15) setActivePeriod(1);
      else if (hour >= 15 && hour < 18) setActivePeriod(2);
      else if (hour >= 18 && hour < 21) setActivePeriod(3);
      else setActivePeriod(4);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const industryLinks = [
    { path: '/aviation', label: 'Aviation', icon: '✈️', description: 'Flight operations' },
    { path: '/marine', label: 'Marine', icon: '⚓', description: 'Coastal weather' },
    { path: '/construction', label: 'Construction', icon: '🏗️', description: 'Site conditions' },
    { path: '/events', label: 'Events', icon: '🎪', description: 'Venue weather' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-background to-background" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-purple-500/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-strata-cyan/10 via-transparent to-transparent blur-3xl" />
        
        {/* Animated lines */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
              style={{
                top: `${20 + i * 15}%`,
                left: '-100%',
                right: '-100%',
                animation: `slide-line ${8 + i * 2}s linear infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <Link to="/" className="text-strata-silver hover:text-purple-400 transition-colors text-sm font-mono">
            ← LAVANDAR AI
          </Link>
          <div className="text-right">
            <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="text-lg font-mono text-purple-400">
              {formatTime(currentTime)}
            </div>
          </div>
        </header>

        {/* Main Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-purple-400/30 bg-purple-500/10 mb-4">
            <MapPin className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-strata-silver">Falmouth, Massachusetts</span>
          </div>
          <h1 className="font-instrument text-5xl md:text-7xl font-bold text-strata-white tracking-tight mb-2">
            WEATHER SHOWCASE
          </h1>
          <p className="text-strata-silver font-mono text-sm">LAVANDAR AI Weather Intelligence Platform</p>
        </div>

        {/* Live Weather Display */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="rounded-xl p-6 bg-strata-charcoal/50 border border-purple-400/20">
            {/* Weather Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-strata-lume/20 border border-strata-lume">
                  <div className="w-2 h-2 rounded-full bg-strata-lume animate-pulse" />
                  <span className="text-xs font-mono text-strata-white">LIVE</span>
                </div>
                <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
                  Current Conditions
                </span>
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                Falmouth Town Center • Cape Cod
              </div>
            </div>

            {/* Main Weather Display */}
            <div className="grid grid-cols-7 gap-4 items-center mb-8">
              {/* Location */}
              <div className="col-span-2 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-purple-500/20 border-2 border-purple-400/40 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <div className="font-instrument text-xl text-strata-white">Falmouth</div>
                  <div className="text-xs text-muted-foreground font-mono">Cape Cod, MA</div>
                </div>
              </div>

              {/* Temperature Display */}
              <div className="col-span-3 flex items-center justify-center gap-4">
                <div className="rounded-lg px-8 py-4 text-center min-w-[120px] bg-strata-charcoal border border-strata-steel/30">
                  <div className="font-instrument text-5xl text-strata-white">
                    {weatherPeriods[activePeriod].temp}°
                  </div>
                  <div className="text-xs font-mono text-purple-400 mt-1">
                    {weatherPeriods[activePeriod].condition}
                  </div>
                </div>
              </div>

              {/* Conditions */}
              <div className="col-span-2 flex items-center justify-end gap-4">
                <div className="text-right">
                  <div className="font-instrument text-xl text-strata-cyan">
                    {weatherPeriods[activePeriod].weather.wind} mph
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">Wind</div>
                </div>
                <div className="w-14 h-14 rounded-full bg-strata-cyan/20 border-2 border-strata-cyan/40 flex items-center justify-center">
                  <Wind className="w-7 h-7 text-strata-cyan" />
                </div>
              </div>
            </div>

            {/* Period Timeline */}
            <div className="border-t border-strata-steel/20 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Daily Forecast
                </span>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {weatherPeriods.map((period, idx) => (
                  <button
                    key={period.period}
                    onClick={() => setActivePeriod(idx)}
                    className={`relative p-4 rounded-lg transition-all ${
                      activePeriod === idx 
                        ? 'bg-purple-950/50 border border-purple-400/50' 
                        : 'bg-secondary/30 border border-transparent hover:bg-secondary/50'
                    }`}
                  >
                    {/* Period indicator */}
                    {idx === activePeriod && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
                    )}
                    
                    <div className="text-center mb-3">
                      <div className={`font-instrument text-lg ${activePeriod === idx ? 'text-strata-white' : 'text-strata-silver'}`}>
                        {period.period}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">{period.time}</div>
                    </div>
                    
                    {/* Temperature for this period */}
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className={`font-mono text-2xl ${activePeriod === idx ? 'text-strata-white' : 'text-muted-foreground'}`}>
                        {period.temp}°
                      </span>
                    </div>

                    {/* Weather conditions */}
                    <div className={`space-y-1 pt-2 border-t ${activePeriod === idx ? 'border-purple-400/20' : 'border-transparent'}`}>
                      <div className="flex items-center justify-center gap-1">
                        <Wind className={`w-3 h-3 ${activePeriod === idx ? 'text-strata-cyan' : 'text-muted-foreground'}`} />
                        <span className={`text-[10px] font-mono ${activePeriod === idx ? 'text-strata-cyan' : 'text-muted-foreground'}`}>
                          {period.weather.wind} mph
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Droplets className={`w-3 h-3 ${activePeriod === idx ? 'text-strata-blue' : 'text-muted-foreground'}`} />
                        <span className={`text-[10px] font-mono ${activePeriod === idx ? 'text-strata-blue' : 'text-muted-foreground'}`}>
                          {period.weather.humidity}%
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Weather Detail */}
            <div className="mt-6 p-4 rounded-lg bg-secondary/20 border border-purple-400/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-strata-cyan" />
                    <div>
                      <div className="text-xs text-muted-foreground">Temperature</div>
                      <div className="font-instrument text-lg text-strata-white">{weatherPeriods[activePeriod].temp}°F</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-strata-blue" />
                    <div>
                      <div className="text-xs text-muted-foreground">Wind</div>
                      <div className="font-instrument text-lg text-strata-white">{weatherPeriods[activePeriod].weather.wind} mph SW</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-strata-cyan" />
                    <div>
                      <div className="text-xs text-muted-foreground">Humidity</div>
                      <div className="font-instrument text-lg text-strata-white">{weatherPeriods[activePeriod].weather.humidity}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-strata-silver" />
                    <div>
                      <div className="text-xs text-muted-foreground">Conditions</div>
                      <div className="font-instrument text-lg text-strata-white">{weatherPeriods[activePeriod].condition}</div>
                    </div>
                  </div>
                </div>
                <Link 
                  to="/strata"
                  className="px-4 py-2 rounded border border-purple-400/20 text-xs font-mono text-purple-400 hover:bg-purple-500/10 transition-colors"
                >
                  Open STRATA →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Industry Solutions Grid */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-center mb-6">
            <h2 className="font-instrument text-2xl text-strata-white mb-2">Industry Solutions</h2>
            <p className="text-sm text-strata-silver/70">Weather intelligence for every sector</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {industryLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="group p-6 rounded-lg bg-strata-charcoal/40 border border-strata-steel/20 hover:border-purple-400/40 transition-all text-center"
              >
                <div className="text-4xl mb-3">{link.icon}</div>
                <h3 className="font-instrument text-lg text-strata-white mb-1">{link.label}</h3>
                <p className="text-xs text-strata-silver/60">{link.description}</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-xs font-mono text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  View <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Location Info */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl p-6 bg-strata-charcoal/30 border border-strata-steel/20">
            <div className="flex items-center gap-4 justify-center">
              <MapPin className="w-5 h-5 text-purple-400" />
              <div className="text-center">
                <div className="font-mono text-sm text-strata-white">
                  Falmouth Town Center • Cape Cod, Massachusetts
                </div>
                <div className="text-xs text-strata-silver/60 font-mono">
                  41.55°N, 70.61°W • LAVANDAR AI Headquarters
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherShowcase;
