import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Music, Zap, Wind, Thermometer, CloudRain, Users, AlertTriangle, CheckCircle, ShieldAlert, Volume2, Tent } from "lucide-react";

const StrataEvents = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const eventInfo = {
    name: "SUMMER SOUNDS FESTIVAL",
    venue: "Gillette Stadium Field",
    date: "July 15, 2026",
    attendance: "45,000",
    status: "MONITORING",
  };

  const currentConditions = {
    temp: { value: 82, feelsLike: 88, unit: "°F" },
    humidity: 68,
    wind: { speed: 12, gust: 22, direction: "SW" },
    uvIndex: { value: 7, level: "High" },
    heatIndex: 91,
    lightningDistance: null as number | null,
  };

  const safetyThresholds = [
    { metric: "Heat Index", current: 91, threshold: 105, status: "safe", unit: "°F" },
    { metric: "Wind Speed", current: 22, threshold: 40, status: "safe", unit: "mph" },
    { metric: "Lightning", current: "Clear", threshold: "8 mi", status: "safe", unit: "" },
    { metric: "Precipitation", current: "5%", threshold: "50%", status: "safe", unit: "" },
  ];

  const hourlyForecast = [
    { time: "4PM", temp: 82, precip: 5, wind: 12, icon: "☀️", crowd: "Gates Open" },
    { time: "5PM", temp: 80, precip: 10, wind: 15, icon: "⛅", crowd: "Peak Entry" },
    { time: "6PM", temp: 78, precip: 15, wind: 14, icon: "⛅", crowd: "Opening Act" },
    { time: "7PM", temp: 75, precip: 20, wind: 12, icon: "🌤️", crowd: "Main Stage" },
    { time: "8PM", temp: 72, precip: 25, wind: 10, icon: "☁️", crowd: "Headliner" },
    { time: "9PM", temp: 70, precip: 35, wind: 8, icon: "🌧️", crowd: "Encore" },
    { time: "10PM", temp: 68, precip: 45, wind: 10, icon: "🌧️", crowd: "Egress" },
  ];

  const stageZones = [
    { name: "Main Stage", status: "operational", windExposure: "Moderate", temp: 84 },
    { name: "North Stage", status: "operational", windExposure: "Low", temp: 82 },
    { name: "VIP Tent", status: "operational", windExposure: "Protected", temp: 78 },
    { name: "Food Court", status: "operational", windExposure: "Variable", temp: 85 },
  ];

  const alerts = [
    { level: "advisory", message: "Heat advisory: Hydration stations activated", time: "2:00 PM" },
    { level: "info", message: "UV index high - Sunscreen stations open", time: "1:30 PM" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe": return "text-strata-lume";
      case "caution": return "text-strata-orange";
      case "danger": return "text-strata-red";
      default: return "text-purple-400";
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(280,30%,8%)] text-white">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-[hsl(280,40%,6%)]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-purple-400 hover:text-purple-300 text-sm font-mono">← Home</Link>
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-400" />
              <h1 className="font-instrument text-2xl tracking-wider text-white">STRATA</h1>
              <span className="text-[10px] font-mono text-purple-400/60 uppercase tracking-widest">Events</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-mono">
            <span className="text-purple-400">{formatTime(currentTime)}</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-strata-lume/10 border border-strata-lume/30">
              <div className="w-2 h-2 rounded-full bg-strata-lume animate-pulse" />
              <span className="text-strata-lume text-xs">{eventInfo.status}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Event Header */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-instrument text-3xl text-white">{eventInfo.name}</h2>
              <div className="text-sm font-mono text-purple-400 mt-1">{eventInfo.venue} • {eventInfo.date}</div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-purple-300">
                <Users className="w-5 h-5" />
                <span className="font-instrument text-2xl">{eventInfo.attendance}</span>
              </div>
              <div className="text-xs font-mono text-purple-500">Expected Attendance</div>
            </div>
          </div>
        </div>

        {/* Alerts Banner */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {alerts.map((alert, idx) => (
              <div 
                key={idx}
                className={`flex items-center gap-3 p-3 rounded border ${
                  alert.level === "advisory" 
                    ? "bg-strata-orange/10 border-strata-orange/30" 
                    : "bg-purple-500/10 border-purple-500/30"
                }`}
              >
                <AlertTriangle className={`w-4 h-4 ${alert.level === "advisory" ? "text-strata-orange" : "text-purple-400"}`} />
                <span className={`text-sm font-mono ${alert.level === "advisory" ? "text-strata-orange" : "text-purple-300"}`}>
                  {alert.message}
                </span>
                <span className="ml-auto text-[10px] font-mono text-purple-500">{alert.time}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Conditions */}
          <div className="bg-[hsl(280,30%,10%)] border border-purple-900/30 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-purple-950/50 border-b border-purple-900/30 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-mono uppercase tracking-wider text-purple-300">Conditions</span>
            </div>
            
            <div className="p-4">
              <div className="text-center mb-4">
                <div className="font-instrument text-5xl text-white">{currentConditions.temp.value}°</div>
                <div className="text-sm font-mono text-purple-400">Feels like {currentConditions.temp.feelsLike}°F</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <MetricBox icon={<Wind className="w-4 h-4" />} label="Wind" value={`${currentConditions.wind.speed} mph`} subvalue={`Gusts ${currentConditions.wind.gust}`} />
                <MetricBox icon={<Thermometer className="w-4 h-4" />} label="Heat Index" value={`${currentConditions.heatIndex}°F`} alert />
                <MetricBox icon={<CloudRain className="w-4 h-4" />} label="Humidity" value={`${currentConditions.humidity}%`} />
                <MetricBox icon={<Zap className="w-4 h-4" />} label="UV Index" value={currentConditions.uvIndex.value.toString()} subvalue={currentConditions.uvIndex.level} alert />
              </div>
            </div>
          </div>

          {/* Safety Thresholds */}
          <div className="bg-[hsl(280,30%,10%)] border border-purple-900/30 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-purple-950/50 border-b border-purple-900/30 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-mono uppercase tracking-wider text-purple-300">Safety Thresholds</span>
            </div>
            
            <div className="divide-y divide-purple-900/20">
              {safetyThresholds.map((item) => (
                <div key={item.metric} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-5 h-5 ${getStatusColor(item.status)}`} />
                    <div>
                      <div className="font-mono text-sm text-white">{item.metric}</div>
                      <div className="text-[10px] font-mono text-purple-500">Limit: {item.threshold}{item.unit}</div>
                    </div>
                  </div>
                  <div className={`font-instrument text-xl ${getStatusColor(item.status)}`}>
                    {item.current}{item.unit}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Lightning monitor */}
            <div className="p-4 bg-strata-lume/5 border-t border-strata-lume/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-strata-lume" />
                  <span className="text-sm font-mono text-strata-lume">Lightning Monitor</span>
                </div>
                <span className="text-strata-lume font-mono">ALL CLEAR</span>
              </div>
            </div>
          </div>

          {/* Stage Zones */}
          <div className="bg-[hsl(280,30%,10%)] border border-purple-900/30 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-purple-950/50 border-b border-purple-900/30 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-mono uppercase tracking-wider text-purple-300">Stage Zones</span>
            </div>
            
            <div className="divide-y divide-purple-900/20">
              {stageZones.map((zone) => (
                <div key={zone.name} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-strata-lume" />
                    <span className="font-mono text-sm text-white">{zone.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm text-purple-300">{zone.temp}°F</div>
                    <div className="text-[10px] font-mono text-purple-500">{zone.windExposure}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Forecast */}
        <div className="mt-6 bg-[hsl(280,30%,10%)] border border-purple-900/30 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-purple-950/50 border-b border-purple-900/30 flex items-center gap-2">
            <Music className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-mono uppercase tracking-wider text-purple-300">Event Timeline</span>
          </div>
          
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 min-w-[700px] divide-x divide-purple-900/20">
              {hourlyForecast.map((hour) => (
                <div key={hour.time} className="p-4 text-center">
                  <div className="text-xs font-mono text-purple-500 mb-1">{hour.time}</div>
                  <div className="text-2xl mb-2">{hour.icon}</div>
                  <div className="font-instrument text-xl text-white">{hour.temp}°</div>
                  <div className="text-[10px] font-mono text-purple-500">{hour.wind} mph</div>
                  <div className={`mt-2 text-[10px] font-mono ${hour.precip > 30 ? "text-strata-orange" : "text-purple-400"}`}>
                    {hour.precip}% rain
                  </div>
                  <div className="mt-2 pt-2 border-t border-purple-900/20">
                    <div className="text-[9px] font-mono text-pink-400 uppercase">{hour.crowd}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-purple-900/20 flex items-center justify-between text-[10px] font-mono text-purple-600 uppercase tracking-wider">
          <span>{eventInfo.venue}</span>
          <span>STRATA Events Weather Intelligence</span>
          <span>{eventInfo.date}</span>
        </footer>
      </main>
    </div>
  );
};

const MetricBox = ({ 
  icon, 
  label, 
  value, 
  subvalue,
  alert = false 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  subvalue?: string;
  alert?: boolean;
}) => (
  <div className={`p-3 rounded border ${alert ? "bg-strata-orange/10 border-strata-orange/30" : "bg-purple-950/30 border-purple-900/20"}`}>
    <div className={`flex items-center gap-1 mb-1 ${alert ? "text-strata-orange" : "text-purple-500"}`}>
      {icon}
      <span className="text-[10px] font-mono uppercase">{label}</span>
    </div>
    <div className={`font-instrument text-lg ${alert ? "text-strata-orange" : "text-white"}`}>{value}</div>
    {subvalue && <div className="text-[10px] font-mono text-purple-500">{subvalue}</div>}
  </div>
);

export default StrataEvents;
