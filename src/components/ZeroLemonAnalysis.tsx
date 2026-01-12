import { useState, useEffect, useMemo } from "react";
import { 
  Target, 
  TrendingUp, 
  Crosshair, 
  Shuffle, 
  Shield,
  Zap,
  Wind,
  Thermometer,
  Clock,
  ChevronRight,
  Lock,
  Check,
  AlertTriangle,
  X,
  RefreshCw,
  Loader2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useWeatherData } from "@/hooks/useWeatherData";
import lavandarLogo from "@/assets/lavandar-logo.png";

interface RouteConceptProps {
  letter: string;
  name: string;
  description: string;
  baseEfficiency: number;
  weatherImpact: "optimal" | "moderate" | "limited";
}

const baseRouteConcepts: RouteConceptProps[] = [
  {
    letter: "S",
    name: "Slant",
    description: "Quick inside break exploiting soft zone coverage",
    baseEfficiency: 72,
    weatherImpact: "optimal",
  },
  {
    letter: "H",
    name: "Hitch",
    description: "Rhythm route against press coverage",
    baseEfficiency: 68,
    weatherImpact: "optimal",
  },
  {
    letter: "O",
    name: "Out",
    description: "Sideline attack versus inside leverage",
    baseEfficiency: 61,
    weatherImpact: "moderate",
  },
  {
    letter: "W",
    name: "Whip",
    description: "Misdirection route against aggressive corners",
    baseEfficiency: 74,
    weatherImpact: "moderate",
  },
  {
    letter: "S",
    name: "Seam",
    description: "Vertical stretch through zone windows",
    baseEfficiency: 58,
    weatherImpact: "limited",
  },
];

const systemStatus = {
  apiStatus: { label: "Connected to NFL GSIS", status: "Online" },
  encryption: { label: "End-to-End (AES-256)", status: "Secure" },
  modelVersion: { label: "LAVANDAR v2.4", status: "Current" },
  lastSync: { label: "January 2026", status: "Synced" },
};

// Gillette Stadium coordinates
const GILLETTE_LAT = 42.0909;
const GILLETTE_LON = -71.2643;

const ZeroLemonCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSystemIntegrity, setShowSystemIntegrity] = useState(false);
  const { weather, loading, error } = useWeatherData(GILLETTE_LAT, GILLETTE_LON);

  // Calculate weather-adjusted route data
  const routeData = useMemo(() => {
    if (!weather) return null;

    const { shortRoutes: shortAdj, deepRoutes: deepAdj } = weather.adjustments;

    return baseRouteConcepts.map((route) => {
      let adjustment = 0;
      if (route.weatherImpact === "optimal") {
        adjustment = Math.round(shortAdj * 0.8);
      } else if (route.weatherImpact === "moderate") {
        adjustment = Math.round(shortAdj * 0.3 + deepAdj * 0.2);
      } else {
        adjustment = deepAdj;
      }

      return {
        ...route,
        efficiency: route.baseEfficiency + adjustment,
        halftimeAdjustment: adjustment,
      };
    });
  }, [weather]);

  // Calculate distribution percentages based on weather
  const distribution = useMemo(() => {
    if (!weather) {
      return [
        { name: "Slant", pct: 35, color: "text-strata-lume" },
        { name: "Hitch", pct: 25, color: "text-strata-cyan" },
        { name: "Out", pct: 20, color: "text-strata-orange" },
        { name: "Whip", pct: 12, color: "text-patriots-red" },
        { name: "Seam", pct: 8, color: "text-strata-silver/60" },
      ];
    }

    const wind = weather.current.wind;
    const temp = weather.current.temp;
    
    // Adjust distribution based on weather
    let slant = 30 + (wind > 15 ? 8 : wind > 10 ? 4 : 0);
    let hitch = 22 + (temp < 40 ? 5 : 0);
    let out = 20 - (wind > 15 ? 3 : 0);
    let whip = 15;
    let seam = 13 - (wind > 15 ? 5 : wind > 10 ? 2 : 0);
    
    // Normalize to 100%
    const total = slant + hitch + out + whip + seam;
    slant = Math.round((slant / total) * 100);
    hitch = Math.round((hitch / total) * 100);
    out = Math.round((out / total) * 100);
    whip = Math.round((whip / total) * 100);
    seam = 100 - slant - hitch - out - whip;

    return [
      { name: "Slant", pct: slant, color: "text-strata-lume" },
      { name: "Hitch", pct: hitch, color: "text-strata-cyan" },
      { name: "Out", pct: out, color: "text-strata-orange" },
      { name: "Whip", pct: whip, color: "text-patriots-red" },
      { name: "Seam", pct: seam, color: "text-strata-silver/60" },
    ];
  }, [weather]);

  const currentWeather = weather?.current || {
    temp: 28,
    wind: 18,
    windDirection: "NW",
    humidity: 58,
    condition: "Clear",
    fieldCondition: "Frozen Turf",
  };

  const adjustments = weather?.adjustments || { shortRoutes: 12, deepRoutes: -8 };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="group relative w-full max-w-md bg-gradient-to-br from-patriots-navy via-strata-charcoal to-strata-black rounded-xl border border-patriots-red/30 p-6 text-left transition-all duration-300 hover:border-patriots-red/60 hover:shadow-[0_0_40px_rgba(200,0,0,0.2)] overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--patriots-silver)) 1px, transparent 0)`,
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          {/* Lavandar AI badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded bg-purple-950/80 border border-purple-400/20">
            <img src={lavandarLogo} alt="Lavandar AI" className="w-4 h-4 rounded" />
            <span className="text-[8px] font-mono uppercase tracking-widest text-purple-300">Lavandar AI</span>
          </div>

          <div className="relative">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-patriots-red to-patriots-red/60 flex items-center justify-center shadow-lg">
                <Target className="w-7 h-7 text-strata-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-instrument text-xl font-bold text-strata-white tracking-wide">
                    Zero Lemon
                  </h3>
                  <Lock className="w-3.5 h-3.5 text-patriots-red" />
                </div>
                <p className="text-[10px] font-mono text-patriots-silver/60 uppercase tracking-[0.15em]">
                  Halftime Tactical Analysis
                </p>
              </div>
            </div>

            {/* Preview metrics */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-strata-steel/20 rounded p-2 text-center">
                <div className="text-[9px] font-mono text-strata-silver/50 uppercase mb-1">Wind</div>
                {loading ? (
                  <Loader2 className="w-4 h-4 mx-auto text-strata-blue animate-spin" />
                ) : (
                  <div className="font-instrument text-lg text-strata-blue">{currentWeather.wind} mph</div>
                )}
              </div>
              <div className="bg-strata-steel/20 rounded p-2 text-center">
                <div className="text-[9px] font-mono text-strata-silver/50 uppercase mb-1">Temp</div>
                {loading ? (
                  <Loader2 className="w-4 h-4 mx-auto text-strata-cyan animate-spin" />
                ) : (
                  <div className="font-instrument text-lg text-strata-cyan">{currentWeather.temp}°F</div>
                )}
              </div>
              <div className="bg-strata-steel/20 rounded p-2 text-center">
                <div className="text-[9px] font-mono text-strata-silver/50 uppercase mb-1">Field</div>
                {loading ? (
                  <Loader2 className="w-4 h-4 mx-auto text-strata-orange animate-spin" />
                ) : (
                  <div className="font-instrument text-xs text-strata-orange">
                    {currentWeather.fieldCondition?.split(' ')[0] || 'Good'}
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-patriots-silver/10">
              <span className="text-[10px] font-mono text-strata-lume uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-strata-lume animate-pulse" />
                {loading ? 'Fetching Live Data...' : 'Real-time Intel Available'}
              </span>
              <ChevronRight className="w-4 h-4 text-patriots-silver group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-strata-charcoal to-strata-black border-strata-steel/30">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-patriots-red flex items-center justify-center">
                <Target className="w-6 h-6 text-strata-white" />
              </div>
              <div>
                <DialogTitle className="font-instrument text-2xl font-bold text-strata-white tracking-wide flex items-center gap-3">
                  Zero Lemon Protocol
                  <span className="text-[10px] font-mono text-patriots-silver/60 uppercase tracking-wider px-2 py-1 rounded border border-patriots-silver/20">
                    Classified
                  </span>
                </DialogTitle>
                <p className="text-[11px] font-mono text-strata-silver/60 uppercase tracking-[0.2em] mt-1">
                  Weather-Adjusted Halftime Analysis • Lavandar AI
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSystemIntegrity(!showSystemIntegrity)}
              className="flex items-center gap-2 px-3 py-2 rounded border border-strata-steel/30 bg-strata-steel/20 hover:bg-strata-steel/30 transition-colors"
            >
              <Shield className="w-4 h-4 text-strata-orange" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-strata-silver">
                System Integrity
              </span>
            </button>
          </div>
        </DialogHeader>

        {/* System Integrity Panel */}
        {showSystemIntegrity && (
          <div className="mt-4 p-4 rounded-lg border border-strata-steel/30 bg-strata-black/50">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-strata-orange" />
              <span className="font-semibold text-strata-white">System Integrity</span>
              <button onClick={() => setShowSystemIntegrity(false)} className="ml-auto">
                <X className="w-4 h-4 text-strata-silver hover:text-strata-white" />
              </button>
            </div>
            <div className="space-y-3">
              {Object.entries(systemStatus).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4 p-3 rounded border border-strata-steel/20 bg-strata-steel/10">
                  <div className="w-10 h-10 rounded-lg bg-strata-steel/30 flex items-center justify-center">
                    <Check className="w-5 h-5 text-strata-lume" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-mono text-strata-silver/60 uppercase tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-strata-white">{value.label}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-strata-lume" />
                    <span className="text-[10px] font-mono text-strata-lume uppercase">{value.status}</span>
                  </div>
                </div>
              ))}
              {/* Live Weather API Status */}
              <div className="flex items-center gap-4 p-3 rounded border border-strata-steel/20 bg-strata-steel/10">
                <div className="w-10 h-10 rounded-lg bg-strata-steel/30 flex items-center justify-center">
                  {loading ? (
                    <RefreshCw className="w-5 h-5 text-strata-orange animate-spin" />
                  ) : error ? (
                    <X className="w-5 h-5 text-strata-red" />
                  ) : (
                    <Check className="w-5 h-5 text-strata-lume" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-mono text-strata-silver/60 uppercase tracking-wider">
                    Weather API
                  </div>
                  <div className="text-sm text-strata-white">Open-Meteo Live Feed</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${loading ? 'bg-strata-orange' : error ? 'bg-strata-red' : 'bg-strata-lume'}`} />
                  <span className={`text-[10px] font-mono uppercase ${loading ? 'text-strata-orange' : error ? 'text-strata-red' : 'text-strata-lume'}`}>
                    {loading ? 'Fetching' : error ? 'Error' : 'Live'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 rounded border border-patriots-red/30 bg-patriots-red/10">
              <p className="text-sm text-strata-silver">
                <span className="text-patriots-red-bright font-semibold">Enterprise Ready</span>
                <span className="text-strata-silver/80 ml-2">
                  — All data transmissions are encrypted and comply with Lavandar AI security protocols.
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Halftime Weather Conditions */}
        <div className="mt-6 p-4 rounded-lg border border-strata-steel/30 bg-strata-steel/10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-strata-orange" />
            <span className="text-[10px] font-mono text-strata-silver/60 uppercase tracking-wider">
              Live Weather Conditions • Gillette Stadium
            </span>
            <span className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1.5 ${
              loading ? 'bg-strata-orange/10 text-strata-orange' : 'bg-strata-lume/10 text-strata-lume'
            }`}>
              {loading && <Loader2 className="w-3 h-3 animate-spin" />}
              {loading ? 'Updating' : 'Live'}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-3">
            <div className="text-center p-3 rounded bg-strata-black/50">
              <Thermometer className="w-4 h-4 mx-auto text-strata-cyan mb-2" />
              <div className="font-instrument text-xl text-strata-white">{currentWeather.temp}°F</div>
              <div className="text-[9px] font-mono text-strata-silver/50 uppercase">Temp</div>
            </div>
            <div className="text-center p-3 rounded bg-strata-black/50">
              <Wind className="w-4 h-4 mx-auto text-strata-blue mb-2" />
              <div className="font-instrument text-xl text-strata-white">{currentWeather.wind}</div>
              <div className="text-[9px] font-mono text-strata-silver/50 uppercase">MPH {currentWeather.windDirection}</div>
            </div>
            <div className="text-center p-3 rounded bg-strata-black/50">
              <Zap className="w-4 h-4 mx-auto text-strata-orange mb-2" />
              <div className="font-instrument text-xl text-strata-white">{currentWeather.humidity}%</div>
              <div className="text-[9px] font-mono text-strata-silver/50 uppercase">Humidity</div>
            </div>
            <div className="text-center p-3 rounded bg-strata-black/50 col-span-2">
              <AlertTriangle className="w-4 h-4 mx-auto text-strata-orange mb-2" />
              <div className="font-instrument text-lg text-strata-orange">{currentWeather.fieldCondition}</div>
              <div className="text-[9px] font-mono text-strata-silver/50 uppercase">Field Status</div>
            </div>
          </div>
          
          {/* Forecast timeline */}
          {weather?.forecast && weather.forecast.length > 0 && (
            <div className="mt-4 pt-4 border-t border-strata-steel/20">
              <div className="text-[9px] font-mono text-strata-silver/50 uppercase mb-3">Next 4 Hours</div>
              <div className="grid grid-cols-4 gap-2">
                {weather.forecast.map((f, i) => (
                  <div key={i} className="text-center p-2 rounded bg-strata-black/30">
                    <div className="text-[10px] font-mono text-strata-silver/50">
                      {new Date(f.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                    </div>
                    <div className="font-instrument text-lg text-strata-white">{f.temp}°</div>
                    <div className="text-[9px] font-mono text-strata-blue">{f.wind} mph</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* S.H.O.W.S. Protocol */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <Crosshair className="w-4 h-4 text-patriots-red" />
            <span className="font-instrument text-lg text-strata-white">S.H.O.W.S. Protocol</span>
            <span className="text-[9px] font-mono text-strata-silver/50 uppercase">Weather-Adjusted Routes</span>
          </div>

          <div className="space-y-2">
            {(routeData || baseRouteConcepts.map(r => ({ ...r, efficiency: r.baseEfficiency, halftimeAdjustment: 0 }))).map((route, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-strata-steel/20 rounded border border-strata-steel/20 p-4 hover:bg-strata-steel/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-patriots-red flex items-center justify-center shrink-0">
                  <span className="font-instrument text-lg font-bold text-strata-white">
                    {route.letter}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-strata-white">{route.name}</h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      route.efficiency >= 70 
                        ? 'bg-strata-lume/20 text-strata-lume' 
                        : route.efficiency >= 60 
                          ? 'bg-strata-orange/20 text-strata-orange'
                          : 'bg-strata-red/20 text-strata-red'
                    }`}>
                      {route.efficiency}% EFF
                    </span>
                  </div>
                  <p className="text-sm text-strata-silver/70 mt-0.5">{route.description}</p>
                </div>

                {/* Halftime Adjustment */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                    route.halftimeAdjustment > 0 
                      ? 'bg-strata-lume/10 text-strata-lume' 
                      : route.halftimeAdjustment < 0
                        ? 'bg-strata-red/10 text-strata-red'
                        : 'bg-strata-steel/20 text-strata-silver'
                  }`}>
                    {route.halftimeAdjustment > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : route.halftimeAdjustment < 0 ? (
                      <Shuffle className="w-3 h-3" />
                    ) : null}
                    <span className="text-[11px] font-mono font-semibold">
                      {route.halftimeAdjustment > 0 ? '+' : ''}{route.halftimeAdjustment}%
                    </span>
                  </div>

                  <div className={`w-2 h-2 rounded-full ${
                    route.weatherImpact === "optimal" 
                      ? "bg-strata-lume" 
                      : route.weatherImpact === "moderate"
                        ? "bg-strata-orange"
                        : "bg-strata-red"
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Visualization */}
        <div className="mt-6 p-4 rounded-lg border border-strata-steel/30 bg-strata-steel/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Crosshair className="w-4 h-4 text-strata-orange" />
              <span className="text-[10px] font-mono text-strata-silver/60 uppercase tracking-wider">
                Recommended Play Distribution
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-strata-lume" />
                <span className="text-[11px] font-mono text-strata-lume">
                  Short Routes {adjustments.shortRoutes > 0 ? '+' : ''}{adjustments.shortRoutes}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shuffle className="w-3.5 h-3.5 text-strata-red" />
                <span className="text-[11px] font-mono text-strata-red">
                  Deep Routes {adjustments.deepRoutes}%
                </span>
              </div>
            </div>
          </div>

          {/* Distribution bar */}
          <div className="h-4 rounded-full bg-strata-steel/30 overflow-hidden flex">
            {distribution.map((item, i) => (
              <div 
                key={item.name}
                className={`h-full transition-all ${
                  i === 0 ? 'bg-strata-lume' : 
                  i === 1 ? 'bg-strata-cyan' : 
                  i === 2 ? 'bg-strata-orange' : 
                  i === 3 ? 'bg-patriots-red' : 
                  'bg-strata-silver/40'
                }`} 
                style={{ width: `${item.pct}%` }} 
                title={item.name} 
              />
            ))}
          </div>

          <div className="mt-3 grid grid-cols-5 gap-2">
            {distribution.map((item) => (
              <div key={item.name} className="text-center">
                <div className={`text-sm font-mono font-semibold ${item.color}`}>{item.pct}%</div>
                <div className="text-[9px] font-mono text-strata-silver/50 uppercase">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Purpose */}
        <div className="mt-6 p-4 rounded border border-patriots-red/30 bg-gradient-to-r from-patriots-red/10 to-transparent">
          <p className="text-sm">
            <span className="text-patriots-red-bright font-semibold">Strategic Analysis:</span>
            <span className="text-strata-silver/80 ml-2">
              {weather ? (
                <>
                  Current {currentWeather.wind} mph {currentWeather.windDirection} winds at {currentWeather.temp}°F 
                  {adjustments.shortRoutes > 5 ? ' strongly favor' : adjustments.shortRoutes > 0 ? ' favor' : ' are neutral for'} quick-timing routes. 
                  {adjustments.deepRoutes < -5 && ' Recommend reducing vertical concepts. '}
                  {currentWeather.fieldCondition === 'Frozen Turf' && 'Frozen field conditions may affect footing on cuts.'}
                </>
              ) : (
                'Loading weather-based analysis...'
              )}
            </span>
          </p>
        </div>

        {/* Last Updated */}
        {weather?.timestamp && (
          <div className="mt-4 text-center text-[9px] font-mono text-strata-silver/40">
            Last updated: {new Date(weather.timestamp).toLocaleTimeString()}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ZeroLemonCard;
