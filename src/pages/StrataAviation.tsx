import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plane, Cloud, Wind, Eye, Gauge, Thermometer, AlertTriangle, Navigation, ArrowUp, ChevronRight } from "lucide-react";

interface AltitudeLayer {
  name: string;
  altitude: string;
  turbulence: "None" | "Light" | "Moderate" | "Severe";
  temp: string;
  wind: { speed: string; direction: string };
  icing: "None" | "Light" | "Moderate" | "Severe";
}

const StrataAviation = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLayer, setSelectedLayer] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  // Altitude layers with conditions
  const altitudeLayers: AltitudeLayer[] = [
    { name: "Surface", altitude: "0 ft", turbulence: "Light", temp: "-2°C", wind: { speed: "12", direction: "270°" }, icing: "None" },
    { name: "FL100", altitude: "10,000 ft", turbulence: "None", temp: "-15°C", wind: { speed: "25", direction: "285°" }, icing: "Light" },
    { name: "FL180", altitude: "18,000 ft", turbulence: "Moderate", temp: "-28°C", wind: { speed: "45", direction: "290°" }, icing: "Moderate" },
    { name: "FL240", altitude: "24,000 ft", turbulence: "Light", temp: "-42°C", wind: { speed: "65", direction: "295°" }, icing: "None" },
    { name: "FL350", altitude: "35,000 ft", turbulence: "None", temp: "-56°C", wind: { speed: "95", direction: "300°" }, icing: "None" },
  ];

  const getTurbulenceColor = (level: string) => {
    switch (level) {
      case "None": return "text-strata-lume";
      case "Light": return "text-strata-cyan";
      case "Moderate": return "text-strata-orange";
      case "Severe": return "text-strata-red";
      default: return "text-strata-silver";
    }
  };

  const runwayConditions = {
    runway: "RWY 33L",
    surface: "Dry",
    braking: "Good",
    crosswind: "8 kts",
    visibility: "10+ SM",
    ceiling: "BKN 4500",
  };

  const metar = "KBOS 120056Z 27012G18KT 10SM FEW045 BKN250 M02/M08 A3012 RMK AO2";

  return (
    <div className="min-h-screen bg-[hsl(220,30%,8%)] text-white">
      {/* Header */}
      <header className="border-b border-sky-900/30 bg-[hsl(220,40%,6%)]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sky-400 hover:text-sky-300 text-sm font-mono">← Home</Link>
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-sky-400" />
              <h1 className="font-instrument text-2xl tracking-wider text-white">STRATA</h1>
              <span className="text-[10px] font-mono text-sky-400/60 uppercase tracking-widest">Aviation</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-mono">
            <span className="text-sky-400">{formatTime(currentTime)} UTC</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-sky-500/10 border border-sky-500/30">
              <div className="w-2 h-2 rounded-full bg-strata-lume animate-pulse" />
              <span className="text-strata-lume text-xs">METAR LIVE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* METAR Strip */}
        <div className="mb-6 p-3 bg-sky-950/50 border border-sky-900/30 rounded font-mono text-xs text-sky-300 overflow-x-auto">
          <span className="text-sky-500">METAR:</span> {metar}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Altitude Layers Panel */}
          <div className="lg:col-span-2 bg-[hsl(220,35%,10%)] border border-sky-900/30 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-sky-950/50 border-b border-sky-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUp className="w-4 h-4 text-sky-400" />
                <span className="text-sm font-mono uppercase tracking-wider text-sky-300">Altitude Profile</span>
              </div>
              <span className="text-xs font-mono text-sky-400/60">KBOS → Vertical Section</span>
            </div>
            
            <div className="p-4">
              {/* Altitude visualization */}
              <div className="flex gap-4">
                {/* Altitude bar */}
                <div className="w-24 flex flex-col-reverse">
                  {altitudeLayers.map((layer, idx) => (
                    <button
                      key={layer.name}
                      onClick={() => setSelectedLayer(idx)}
                      className={`py-4 px-2 border-l-2 transition-all ${
                        selectedLayer === idx 
                          ? "border-sky-400 bg-sky-500/10" 
                          : "border-sky-900/30 hover:border-sky-700/50"
                      }`}
                    >
                      <div className={`text-xs font-mono ${selectedLayer === idx ? "text-sky-300" : "text-sky-500"}`}>
                        {layer.name}
                      </div>
                      <div className="text-[10px] text-sky-600">{layer.altitude}</div>
                    </button>
                  ))}
                </div>

                {/* Selected layer details */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCard
                    icon={<AlertTriangle className="w-4 h-4" />}
                    label="Turbulence"
                    value={altitudeLayers[selectedLayer].turbulence}
                    valueColor={getTurbulenceColor(altitudeLayers[selectedLayer].turbulence)}
                  />
                  <MetricCard
                    icon={<Thermometer className="w-4 h-4 text-sky-400" />}
                    label="Temperature"
                    value={altitudeLayers[selectedLayer].temp}
                  />
                  <MetricCard
                    icon={<Wind className="w-4 h-4 text-sky-400" />}
                    label="Wind"
                    value={`${altitudeLayers[selectedLayer].wind.speed} kts`}
                    subvalue={altitudeLayers[selectedLayer].wind.direction}
                  />
                  <MetricCard
                    icon={<Cloud className="w-4 h-4" />}
                    label="Icing"
                    value={altitudeLayers[selectedLayer].icing}
                    valueColor={getTurbulenceColor(altitudeLayers[selectedLayer].icing)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Runway Conditions */}
          <div className="bg-[hsl(220,35%,10%)] border border-sky-900/30 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-sky-950/50 border-b border-sky-900/30 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-mono uppercase tracking-wider text-sky-300">Runway Status</span>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="text-center py-4 bg-sky-950/30 rounded border border-sky-900/20">
                <div className="font-instrument text-3xl text-sky-300">{runwayConditions.runway}</div>
                <div className="text-xs font-mono text-strata-lume mt-1">{runwayConditions.surface}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-sky-950/20 rounded">
                  <div className="text-[10px] font-mono text-sky-500 uppercase">Braking</div>
                  <div className="font-mono text-strata-lume">{runwayConditions.braking}</div>
                </div>
                <div className="p-2 bg-sky-950/20 rounded">
                  <div className="text-[10px] font-mono text-sky-500 uppercase">Crosswind</div>
                  <div className="font-mono text-sky-300">{runwayConditions.crosswind}</div>
                </div>
                <div className="p-2 bg-sky-950/20 rounded">
                  <div className="text-[10px] font-mono text-sky-500 uppercase">Visibility</div>
                  <div className="font-mono text-strata-lume">{runwayConditions.visibility}</div>
                </div>
                <div className="p-2 bg-sky-950/20 rounded">
                  <div className="text-[10px] font-mono text-sky-500 uppercase">Ceiling</div>
                  <div className="font-mono text-sky-300">{runwayConditions.ceiling}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Conditions Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
          <SummaryCard label="Flight Category" value="VFR" status="good" />
          <SummaryCard label="Density Altitude" value="850 ft" />
          <SummaryCard label="Altimeter" value="30.12 inHg" />
          <SummaryCard label="Freezing Level" value="2,500 ft" status="caution" />
          <SummaryCard label="Pressure Alt" value="920 ft" />
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-sky-900/20 flex items-center justify-between text-[10px] font-mono text-sky-600 uppercase tracking-wider">
          <span>KBOS • Boston Logan International</span>
          <span>STRATA Aviation Weather Intelligence</span>
          <span>Valid: {currentTime.toLocaleDateString()}</span>
        </footer>
      </main>
    </div>
  );
};

const MetricCard = ({ 
  icon, 
  label, 
  value, 
  subvalue, 
  valueColor = "text-white" 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  subvalue?: string;
  valueColor?: string;
}) => (
  <div className="p-3 bg-sky-950/30 border border-sky-900/20 rounded">
    <div className="flex items-center gap-2 mb-2 text-sky-500">
      {icon}
      <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
    </div>
    <div className={`font-instrument text-xl ${valueColor}`}>{value}</div>
    {subvalue && <div className="text-xs font-mono text-sky-500">{subvalue}</div>}
  </div>
);

const SummaryCard = ({ 
  label, 
  value, 
  status 
}: { 
  label: string; 
  value: string; 
  status?: "good" | "caution" | "warning";
}) => {
  const statusColors = {
    good: "text-strata-lume border-strata-lume/30",
    caution: "text-strata-orange border-strata-orange/30",
    warning: "text-strata-red border-strata-red/30",
  };

  return (
    <div className={`p-3 bg-sky-950/30 border rounded ${status ? statusColors[status] : "border-sky-900/20"}`}>
      <div className="text-[10px] font-mono text-sky-500 uppercase tracking-wider mb-1">{label}</div>
      <div className={`font-instrument text-lg ${status ? statusColors[status].split(" ")[0] : "text-white"}`}>
        {value}
      </div>
    </div>
  );
};

export default StrataAviation;
