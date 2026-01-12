import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HardHat, Wind, Thermometer, CloudRain, Clock, AlertTriangle, CheckCircle, XCircle, Droplets, Sun } from "lucide-react";

interface WorkWindow {
  activity: string;
  status: "go" | "caution" | "no-go";
  window: string;
  limiting: string;
}

const StrataConstruction = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const currentConditions = {
    temp: { value: 28, unit: "°F", trend: "falling" },
    wind: { speed: 22, gust: 35, unit: "mph" },
    humidity: 45,
    precip: { chance: 15, type: "Snow" },
    visibility: "8 mi",
    pressure: { value: 30.15, trend: "rising" },
  };

  const workWindows: WorkWindow[] = [
    { activity: "Concrete Pour", status: "no-go", window: "Not today", limiting: "Temp < 35°F" },
    { activity: "Crane Operations", status: "caution", window: "Until 2:00 PM", limiting: "Wind gusts approaching limit" },
    { activity: "Roofing Work", status: "go", window: "All day", limiting: "—" },
    { activity: "Exterior Paint", status: "no-go", window: "Not today", limiting: "Temp < 50°F, Humidity" },
    { activity: "Steel Erection", status: "caution", window: "Morning only", limiting: "Afternoon gusts" },
    { activity: "Excavation", status: "go", window: "All day", limiting: "Ground not frozen" },
  ];

  const craneData = {
    maxSpeed: 35,
    currentSpeed: 22,
    currentGust: 35,
    status: "CAUTION",
    standDown: "At 40 mph sustained",
  };

  const pourConditions = {
    groundTemp: 26,
    airTemp: 28,
    minRequired: 35,
    cureTime: "N/A",
    recommendation: "Delay pour - use hot water mix or heated enclosure",
  };

  const hourlyForecast = [
    { hour: "Now", temp: 28, wind: 22, precip: 15, icon: "☁️" },
    { hour: "10A", temp: 30, wind: 20, precip: 10, icon: "⛅" },
    { hour: "12P", temp: 32, wind: 25, precip: 5, icon: "☀️" },
    { hour: "2P", temp: 31, wind: 30, precip: 5, icon: "💨" },
    { hour: "4P", temp: 28, wind: 28, precip: 10, icon: "☁️" },
    { hour: "6P", temp: 25, wind: 20, precip: 20, icon: "🌨️" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "go": return <CheckCircle className="w-5 h-5 text-strata-lume" />;
      case "caution": return <AlertTriangle className="w-5 h-5 text-strata-orange" />;
      case "no-go": return <XCircle className="w-5 h-5 text-strata-red" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "go": return "border-strata-lume/30 bg-strata-lume/5";
      case "caution": return "border-strata-orange/30 bg-strata-orange/5";
      case "no-go": return "border-strata-red/30 bg-strata-red/5";
      default: return "border-amber-900/30";
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(35,20%,8%)] text-white">
      {/* Header */}
      <header className="border-b border-amber-900/30 bg-[hsl(35,30%,6%)]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-amber-400 hover:text-amber-300 text-sm font-mono">← Home</Link>
            <div className="flex items-center gap-2">
              <HardHat className="w-5 h-5 text-amber-400" />
              <h1 className="font-instrument text-2xl tracking-wider text-white">STRATA</h1>
              <span className="text-[10px] font-mono text-amber-400/60 uppercase tracking-widest">Construction</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-mono">
            <span className="text-amber-400">{formatTime(currentTime)}</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30">
              <div className="w-2 h-2 rounded-full bg-strata-lume animate-pulse" />
              <span className="text-strata-lume text-xs">SITE MONITOR</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Current Conditions Bar */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <ConditionPill icon={<Thermometer className="w-4 h-4" />} label="Temp" value={`${currentConditions.temp.value}°F`} />
          <ConditionPill icon={<Wind className="w-4 h-4" />} label="Wind" value={`${currentConditions.wind.speed} mph`} alert />
          <ConditionPill icon={<Wind className="w-4 h-4" />} label="Gusts" value={`${currentConditions.wind.gust} mph`} alert />
          <ConditionPill icon={<Droplets className="w-4 h-4" />} label="Humidity" value={`${currentConditions.humidity}%`} />
          <ConditionPill icon={<CloudRain className="w-4 h-4" />} label="Precip" value={`${currentConditions.precip.chance}%`} />
          <ConditionPill icon={<Sun className="w-4 h-4" />} label="Visibility" value={currentConditions.visibility} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Work Windows */}
          <div className="lg:col-span-2 bg-[hsl(35,25%,10%)] border border-amber-900/30 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-amber-950/50 border-b border-amber-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-mono uppercase tracking-wider text-amber-300">Work Windows</span>
              </div>
              <span className="text-[10px] font-mono text-amber-500">Updated {formatTime(currentTime)}</span>
            </div>
            
            <div className="divide-y divide-amber-900/20">
              {workWindows.map((item) => (
                <div key={item.activity} className={`p-4 flex items-center justify-between ${getStatusColor(item.status)}`}>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <div className="font-instrument text-lg text-white">{item.activity}</div>
                      <div className="text-xs font-mono text-amber-500">{item.limiting}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono text-sm ${
                      item.status === "go" ? "text-strata-lume" : 
                      item.status === "caution" ? "text-strata-orange" : "text-strata-red"
                    }`}>
                      {item.window}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Crane Monitor */}
            <div className="bg-[hsl(35,25%,10%)] border border-amber-900/30 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-amber-950/50 border-b border-amber-900/30 flex items-center gap-2">
                <Wind className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-mono uppercase tracking-wider text-amber-300">Crane Wind Limit</span>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs font-mono text-amber-500 uppercase">Current</div>
                    <div className="font-instrument text-3xl text-white">{craneData.currentSpeed} <span className="text-lg text-amber-500">mph</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-amber-500 uppercase">Max Limit</div>
                    <div className="font-instrument text-3xl text-strata-red">{craneData.maxSpeed} <span className="text-lg text-amber-500">mph</span></div>
                  </div>
                </div>
                
                {/* Wind gauge */}
                <div className="h-4 bg-amber-950/50 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-strata-lume via-strata-orange to-strata-red rounded-full transition-all"
                    style={{ width: `${(craneData.currentSpeed / craneData.maxSpeed) * 100}%` }}
                  />
                  <div className="absolute right-0 top-0 h-full w-1 bg-strata-red" />
                </div>
                
                <div className="mt-3 p-2 bg-strata-orange/10 border border-strata-orange/30 rounded text-center">
                  <span className="text-xs font-mono text-strata-orange">{craneData.status}: {craneData.standDown}</span>
                </div>
              </div>
            </div>

            {/* Concrete Pour Conditions */}
            <div className="bg-[hsl(35,25%,10%)] border border-strata-red/30 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-strata-red/10 border-b border-strata-red/30 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-strata-red" />
                <span className="text-sm font-mono uppercase tracking-wider text-strata-red">Concrete Pour</span>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-[10px] font-mono text-amber-500 uppercase">Ground Temp</div>
                    <div className="font-mono text-strata-red">{pourConditions.groundTemp}°F</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-amber-500 uppercase">Min Required</div>
                    <div className="font-mono text-strata-lume">{pourConditions.minRequired}°F</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-amber-900/20">
                  <div className="text-[10px] font-mono text-amber-500 uppercase mb-1">Recommendation</div>
                  <div className="text-xs text-amber-300">{pourConditions.recommendation}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="mt-6 bg-[hsl(35,25%,10%)] border border-amber-900/30 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-amber-950/50 border-b border-amber-900/30 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-mono uppercase tracking-wider text-amber-300">Today's Forecast</span>
          </div>
          
          <div className="grid grid-cols-6 divide-x divide-amber-900/20">
            {hourlyForecast.map((hour) => (
              <div key={hour.hour} className="p-4 text-center">
                <div className="text-xs font-mono text-amber-500 mb-2">{hour.hour}</div>
                <div className="text-2xl mb-2">{hour.icon}</div>
                <div className="font-instrument text-lg text-white">{hour.temp}°</div>
                <div className="text-[10px] font-mono text-amber-500">{hour.wind} mph</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-amber-900/20 flex items-center justify-between text-[10px] font-mono text-amber-600 uppercase tracking-wider">
          <span>Site: Downtown Tower • Boston, MA</span>
          <span>STRATA Construction Weather</span>
          <span>{currentTime.toLocaleDateString()}</span>
        </footer>
      </main>
    </div>
  );
};

const ConditionPill = ({ 
  icon, 
  label, 
  value,
  alert = false 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  alert?: boolean;
}) => (
  <div className={`flex items-center gap-2 px-3 py-2 rounded border ${
    alert ? "bg-strata-orange/10 border-strata-orange/30" : "bg-amber-950/30 border-amber-900/30"
  }`}>
    <div className={alert ? "text-strata-orange" : "text-amber-500"}>{icon}</div>
    <div>
      <div className="text-[9px] font-mono text-amber-500 uppercase">{label}</div>
      <div className={`font-mono text-sm ${alert ? "text-strata-orange" : "text-white"}`}>{value}</div>
    </div>
  </div>
);

export default StrataConstruction;
