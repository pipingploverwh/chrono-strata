import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Clock, Thermometer, Wind, Droplets, Gauge, Eye, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogEntry {
  timestamp: Date;
  temperature: number;
  windSpeed: number;
  humidity: number;
  pressure: number;
  visibility: number;
  cloudCover: number;
}

// Mock Open Meteo data with 5-minute intervals
const generateMockLogs = (): LogEntry[] => {
  const logs: LogEntry[] = [];
  const now = new Date();
  
  for (let i = 0; i < 48; i++) { // 4 hours of 5-minute logs
    const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000);
    logs.push({
      timestamp,
      temperature: 28 + Math.random() * 4 - 2, // 26-32°F
      windSpeed: 20 + Math.random() * 15, // 20-35 mph
      humidity: 80 + Math.random() * 10, // 80-90%
      pressure: 29.5 + Math.random() * 0.3, // 29.5-29.8 inHg
      visibility: 8 + Math.random() * 4, // 8-12 mi
      cloudCover: 30 + Math.random() * 20, // 30-50%
    });
  }
  
  return logs;
};

const Logs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    setLogs(generateMockLogs());
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLogs(generateMockLogs());
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/strata">
              <Button variant="ghost" size="sm" className="text-strata-silver hover:text-strata-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="font-instrument text-2xl sm:text-3xl font-bold text-strata-white tracking-wide">
                ARCHIVE LOGS
              </h1>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-strata-silver/60 mt-1">
                Open Meteo • 5 Minute Intervals
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-mono text-strata-silver/60">
              Last update: {formatTime(lastUpdate)}
            </span>
            <Button 
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="bg-strata-charcoal/50 border-strata-steel/30 text-strata-silver hover:bg-strata-steel/50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
          <div className="strata-pod rounded p-3 border border-strata-steel/30">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3 h-3 text-strata-lume" />
              <span className="text-[8px] font-mono uppercase text-strata-silver/60">Entries</span>
            </div>
            <span className="text-lg font-instrument font-bold text-strata-white">{logs.length}</span>
          </div>
          <div className="strata-pod rounded p-3 border border-strata-steel/30">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer className="w-3 h-3 text-strata-orange" />
              <span className="text-[8px] font-mono uppercase text-strata-silver/60">Avg Temp</span>
            </div>
            <span className="text-lg font-instrument font-bold text-strata-white">
              {logs.length > 0 ? (logs.reduce((a, b) => a + b.temperature, 0) / logs.length).toFixed(1) : '--'}°F
            </span>
          </div>
          <div className="strata-pod rounded p-3 border border-strata-steel/30">
            <div className="flex items-center gap-2 mb-1">
              <Wind className="w-3 h-3 text-strata-cyan" />
              <span className="text-[8px] font-mono uppercase text-strata-silver/60">Max Wind</span>
            </div>
            <span className="text-lg font-instrument font-bold text-strata-white">
              {logs.length > 0 ? Math.max(...logs.map(l => l.windSpeed)).toFixed(0) : '--'} mph
            </span>
          </div>
          <div className="strata-pod rounded p-3 border border-strata-steel/30">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="w-3 h-3 text-strata-blue" />
              <span className="text-[8px] font-mono uppercase text-strata-silver/60">Humidity</span>
            </div>
            <span className="text-lg font-instrument font-bold text-strata-white">
              {logs.length > 0 ? (logs.reduce((a, b) => a + b.humidity, 0) / logs.length).toFixed(0) : '--'}%
            </span>
          </div>
          <div className="strata-pod rounded p-3 border border-strata-steel/30">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="w-3 h-3 text-strata-silver" />
              <span className="text-[8px] font-mono uppercase text-strata-silver/60">Pressure</span>
            </div>
            <span className="text-lg font-instrument font-bold text-strata-white">
              {logs.length > 0 ? (logs.reduce((a, b) => a + b.pressure, 0) / logs.length).toFixed(2) : '--'}
            </span>
          </div>
          <div className="strata-pod rounded p-3 border border-strata-steel/30">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-3 h-3 text-strata-lume" />
              <span className="text-[8px] font-mono uppercase text-strata-silver/60">Visibility</span>
            </div>
            <span className="text-lg font-instrument font-bold text-strata-white">
              {logs.length > 0 ? (logs.reduce((a, b) => a + b.visibility, 0) / logs.length).toFixed(1) : '--'} mi
            </span>
          </div>
        </div>

        {/* Log Table */}
        <div className="strata-pod rounded border border-strata-steel/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-strata-steel/20 border-b border-strata-steel/30">
                  <th className="px-4 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-strata-silver/70">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Timestamp
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-strata-silver/70">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-3 h-3" />
                      Temp
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-strata-silver/70">
                    <div className="flex items-center gap-2">
                      <Wind className="w-3 h-3" />
                      Wind
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-strata-silver/70">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-3 h-3" />
                      Humidity
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-strata-silver/70">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-3 h-3" />
                      Pressure
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-strata-silver/70">
                    <div className="flex items-center gap-2">
                      <Eye className="w-3 h-3" />
                      Visibility
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-strata-silver/70">
                    <div className="flex items-center gap-2">
                      <Cloud className="w-3 h-3" />
                      Cloud
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-strata-steel/20 hover:bg-strata-steel/10 transition-colors ${
                      index === 0 ? 'bg-strata-lume/5' : ''
                    }`}
                  >
                    <td className="px-4 py-2">
                      <span className={`text-xs font-mono ${index === 0 ? 'text-strata-lume' : 'text-strata-white'}`}>
                        {formatTime(log.timestamp)}
                      </span>
                      {index === 0 && (
                        <span className="ml-2 text-[8px] font-mono uppercase text-strata-lume animate-lume-pulse">
                          LIVE
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-xs font-mono text-strata-white">{log.temperature.toFixed(1)}°F</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`text-xs font-mono ${log.windSpeed > 30 ? 'text-strata-orange' : 'text-strata-white'}`}>
                        {log.windSpeed.toFixed(1)} mph
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-xs font-mono text-strata-white">{log.humidity.toFixed(0)}%</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-xs font-mono text-strata-white">{log.pressure.toFixed(2)} inHg</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-xs font-mono text-strata-white">{log.visibility.toFixed(1)} mi</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-xs font-mono text-strata-white">{log.cloudCover.toFixed(0)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-[8px] font-mono text-strata-silver/40 uppercase tracking-wider">
          <span>Falmouth, MA • 41.65°N, 70.52°W</span>
          <span>Data Source: Open-Meteo API</span>
          <span>Interval: 5 Minutes</span>
        </div>
      </div>
    </div>
  );
};

export default Logs;
