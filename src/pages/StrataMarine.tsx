import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Anchor, Waves, Wind, Compass, Thermometer, Eye, ArrowUp, ArrowDown, Navigation, Droplets } from "lucide-react";

const StrataMarine = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedStation, setSelectedStation] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const stations = [
    { name: "Buzzards Bay", id: "44020" },
    { name: "Nantucket Sound", id: "44018" },
    { name: "Boston Harbor", id: "44013" },
  ];

  const tideData = {
    current: { height: "4.2 ft", status: "Rising", percentToHigh: 65 },
    nextHigh: { time: "14:32", height: "9.8 ft" },
    nextLow: { time: "20:45", height: "0.4 ft" },
    tidalRange: "9.4 ft",
  };

  const seaConditions = {
    waveHeight: { value: "3.5", unit: "ft", trend: "increasing" },
    wavePeriod: { value: "7", unit: "sec" },
    swellDirection: "SSE 165°",
    seaTemp: { value: "42", unit: "°F" },
    salinity: "32.1 ppt",
    visibility: "8+ nm",
  };

  const windData = {
    speed: "18",
    gust: "25",
    direction: "SW",
    bearing: "225°",
  };

  const harborApproach = {
    channel: "Main Ship Channel",
    depth: "42 ft",
    clearance: "135 ft",
    current: "1.2 kts ebb",
    advisory: "Small craft advisory in effect",
  };

  return (
    <div className="min-h-screen bg-[hsl(200,40%,8%)] text-white">
      {/* Header */}
      <header className="border-b border-teal-900/30 bg-[hsl(200,50%,6%)]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-teal-400 hover:text-teal-300 text-sm font-mono">← Home</Link>
            <div className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-teal-400" />
              <h1 className="font-instrument text-2xl tracking-wider text-white">STRATA</h1>
              <span className="text-[10px] font-mono text-teal-400/60 uppercase tracking-widest">Marine</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-mono">
            <span className="text-teal-400">{formatTime(currentTime)} EST</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-teal-500/10 border border-teal-500/30">
              <div className="w-2 h-2 rounded-full bg-strata-lume animate-pulse" />
              <span className="text-strata-lume text-xs">BUOY LIVE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Station Selector */}
        <div className="flex gap-2 mb-6">
          {stations.map((station, idx) => (
            <button
              key={station.id}
              onClick={() => setSelectedStation(idx)}
              className={`px-4 py-2 rounded font-mono text-sm transition-all ${
                selectedStation === idx
                  ? "bg-teal-500/20 border border-teal-400/50 text-teal-300"
                  : "bg-teal-950/30 border border-teal-900/30 text-teal-500 hover:border-teal-700/50"
              }`}
            >
              {station.name}
              <span className="ml-2 text-[10px] opacity-60">#{station.id}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tide Panel */}
          <div className="bg-[hsl(200,40%,10%)] border border-teal-900/30 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-teal-950/50 border-b border-teal-900/30 flex items-center gap-2">
              <Waves className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-mono uppercase tracking-wider text-teal-300">Tides</span>
            </div>
            
            <div className="p-4">
              {/* Current tide visualization */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 mb-2">
                  <ArrowUp className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-mono text-teal-400 uppercase">{tideData.current.status}</span>
                </div>
                <div className="font-instrument text-4xl text-white">{tideData.current.height}</div>
                
                {/* Tide bar */}
                <div className="mt-4 h-3 bg-teal-950/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all"
                    style={{ width: `${tideData.current.percentToHigh}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] font-mono text-teal-600">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 bg-teal-950/30 rounded text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ArrowUp className="w-3 h-3 text-teal-400" />
                    <span className="text-[10px] font-mono text-teal-500 uppercase">Next High</span>
                  </div>
                  <div className="font-instrument text-lg text-white">{tideData.nextHigh.time}</div>
                  <div className="text-xs text-teal-400">{tideData.nextHigh.height}</div>
                </div>
                <div className="p-3 bg-teal-950/30 rounded text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ArrowDown className="w-3 h-3 text-teal-500" />
                    <span className="text-[10px] font-mono text-teal-500 uppercase">Next Low</span>
                  </div>
                  <div className="font-instrument text-lg text-white">{tideData.nextLow.time}</div>
                  <div className="text-xs text-teal-500">{tideData.nextLow.height}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sea Conditions */}
          <div className="bg-[hsl(200,40%,10%)] border border-teal-900/30 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-teal-950/50 border-b border-teal-900/30 flex items-center gap-2">
              <Waves className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-mono uppercase tracking-wider text-teal-300">Sea State</span>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  icon={<Waves className="w-4 h-4 text-teal-400" />}
                  label="Wave Height"
                  value={seaConditions.waveHeight.value}
                  unit={seaConditions.waveHeight.unit}
                  trend={seaConditions.waveHeight.trend}
                />
                <MetricCard
                  icon={<Compass className="w-4 h-4 text-teal-400" />}
                  label="Period"
                  value={seaConditions.wavePeriod.value}
                  unit={seaConditions.wavePeriod.unit}
                />
                <MetricCard
                  icon={<Navigation className="w-4 h-4 text-teal-400" />}
                  label="Swell"
                  value={seaConditions.swellDirection}
                />
                <MetricCard
                  icon={<Thermometer className="w-4 h-4 text-teal-400" />}
                  label="Sea Temp"
                  value={seaConditions.seaTemp.value}
                  unit={seaConditions.seaTemp.unit}
                />
              </div>
              
              <div className="pt-3 border-t border-teal-900/20 grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-[10px] font-mono text-teal-500 uppercase">Salinity</div>
                  <div className="font-mono text-teal-300">{seaConditions.salinity}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-mono text-teal-500 uppercase">Visibility</div>
                  <div className="font-mono text-strata-lume">{seaConditions.visibility}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Wind & Harbor */}
          <div className="space-y-6">
            {/* Wind */}
            <div className="bg-[hsl(200,40%,10%)] border border-teal-900/30 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-teal-950/50 border-b border-teal-900/30 flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-mono uppercase tracking-wider text-teal-300">Wind</span>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-instrument text-3xl text-white">{windData.speed} <span className="text-lg text-teal-500">kts</span></div>
                    <div className="text-xs font-mono text-strata-orange">Gusts {windData.gust} kts</div>
                  </div>
                  <div className="text-right">
                    <div className="font-instrument text-2xl text-teal-300">{windData.direction}</div>
                    <div className="text-xs font-mono text-teal-500">{windData.bearing}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Harbor Approach */}
            <div className="bg-[hsl(200,40%,10%)] border border-teal-900/30 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-teal-950/50 border-b border-teal-900/30 flex items-center gap-2">
                <Anchor className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-mono uppercase tracking-wider text-teal-300">Harbor</span>
              </div>
              
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-teal-500">Channel</span>
                  <span className="font-mono text-white">{harborApproach.channel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-500">Depth</span>
                  <span className="font-mono text-strata-lume">{harborApproach.depth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-500">Clearance</span>
                  <span className="font-mono text-white">{harborApproach.clearance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-500">Current</span>
                  <span className="font-mono text-teal-300">{harborApproach.current}</span>
                </div>
              </div>
              
              <div className="p-3 bg-strata-orange/10 border-t border-strata-orange/30">
                <div className="flex items-center gap-2 text-xs font-mono text-strata-orange">
                  <div className="w-2 h-2 rounded-full bg-strata-orange animate-pulse" />
                  {harborApproach.advisory}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-teal-900/20 flex items-center justify-between text-[10px] font-mono text-teal-600 uppercase tracking-wider">
          <span>{stations[selectedStation].name} • Buoy #{stations[selectedStation].id}</span>
          <span>STRATA Marine Weather Intelligence</span>
          <span>{currentTime.toLocaleDateString()}</span>
        </footer>
      </main>
    </div>
  );
};

const MetricCard = ({ 
  icon, 
  label, 
  value, 
  unit,
  trend 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  unit?: string;
  trend?: string;
}) => (
  <div className="p-3 bg-teal-950/30 border border-teal-900/20 rounded">
    <div className="flex items-center gap-2 mb-1 text-teal-500">
      {icon}
      <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
    </div>
    <div className="font-instrument text-xl text-white">
      {value}
      {unit && <span className="text-sm text-teal-500 ml-1">{unit}</span>}
    </div>
    {trend && (
      <div className="text-[10px] font-mono text-strata-orange flex items-center gap-1 mt-1">
        <ArrowUp className="w-3 h-3" />
        {trend}
      </div>
    )}
  </div>
);

export default StrataMarine;
