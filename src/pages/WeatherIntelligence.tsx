import { useState, useEffect, useMemo } from 'react';
import { 
  Lock, RefreshCw, Shield, Thermometer, Wind, Radio, Clock, 
  MapPin, Target, TrendingUp, Timer, AlertTriangle, Zap, 
  ChevronRight, Activity, Droplets, Cloud, Sun
} from 'lucide-react';
import { useWeatherData } from '@/hooks/useWeatherData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Falmouth, MA coordinates (Town Center)
const FALMOUTH_LAT = 41.5515;
const FALMOUTH_LON = -70.6148;

interface WeatherScenario {
  id: string;
  situation: string;
  threshold: string;
  impact: string;
  recommendation: string;
  priority: 'critical' | 'high' | 'standard';
  actions: string[];
}

const weatherScenarios: WeatherScenario[] = [
  {
    id: 'high-wind',
    situation: 'High Wind Advisory',
    threshold: '> 25 mph sustained',
    impact: 'Marine operations, outdoor events affected',
    recommendation: 'Postpone marine activities, secure outdoor equipment',
    priority: 'critical',
    actions: ['Alert marine vessels', 'Secure construction sites', 'Notify event coordinators', 'Monitor gusts']
  },
  {
    id: 'fog-advisory',
    situation: 'Dense Fog Conditions',
    threshold: 'Visibility < 0.25 mi',
    impact: 'Aviation delays, marine traffic slowdown',
    recommendation: 'Delay departures, enhanced navigation protocols',
    priority: 'high',
    actions: ['Issue NOTAM', 'Activate fog signals', 'Reduce vessel speed', 'Monitor visibility trends']
  },
  {
    id: 'storm-watch',
    situation: 'Coastal Storm Approaching',
    threshold: 'NWS Storm Watch',
    impact: 'All outdoor operations at risk',
    recommendation: 'Activate emergency protocols, evacuate if necessary',
    priority: 'critical',
    actions: ['Emergency notifications', 'Secure all facilities', 'Prepare shelters', 'Staff contingency plans']
  },
  {
    id: 'optimal-conditions',
    situation: 'Optimal Weather Window',
    threshold: 'Clear, winds < 10 mph',
    impact: 'Maximum operational capacity',
    recommendation: 'Maximize outdoor activities and operations',
    priority: 'standard',
    actions: ['Full marine operations', 'Outdoor events proceed', 'Construction on schedule', 'Tourism peak']
  }
];

const locationData = {
  name: 'Falmouth',
  state: 'Massachusetts',
  region: 'Cape Cod',
  features: [
    { name: 'Woods Hole', type: 'Research Hub', status: 'active' },
    { name: 'Falmouth Harbor', type: 'Marine Port', status: 'active' },
    { name: 'Vineyard Sound', type: 'Waterway', status: 'monitored' },
    { name: 'Town Center', type: 'Commercial', status: 'active' }
  ]
};

const operationalMetrics = [
  { category: 'Marine Safety', detail: 'Optimal conditions for coastal operations', impact: '+18%' },
  { category: 'Event Planning', detail: 'Weather windows identified for outdoor events', impact: '+12%' },
  { category: 'Construction', detail: 'Work conditions favorable', impact: '+15%' },
  { category: 'Tourism', detail: 'Weather-driven visitor optimization', impact: '+22%' }
];

export default function WeatherIntelligence() {
  const { weather, loading } = useWeatherData(FALMOUTH_LAT, FALMOUTH_LON);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeScenario, setActiveScenario] = useState<string>('optimal-conditions');
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const documentId = useMemo(() => {
    const date = new Date();
    return `LAV-WX-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  }, []);

  const weatherScore = useMemo(() => {
    if (!weather) return 50;
    let score = 70;
    // Temperature comfort
    if (weather.current.temp >= 50 && weather.current.temp <= 75) score += 15;
    else if (weather.current.temp >= 40 && weather.current.temp <= 85) score += 8;
    // Low wind bonus
    if (weather.current.wind < 10) score += 10;
    else if (weather.current.wind < 15) score += 5;
    else if (weather.current.wind > 25) score -= 15;
    // No precipitation bonus
    if (weather.current.precipitation === 0) score += 5;
    else score -= 10;
    return Math.min(Math.max(score, 0), 100);
  }, [weather]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const selectedScenario = weatherScenarios.find(s => s.id === activeScenario);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Classified Header */}
      <div className="border-2 border-purple-600/60 bg-purple-950/20 m-4 p-4 rounded-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-purple-400 font-mono text-lg md:text-xl font-bold tracking-wider">
              LAVANDAR AI - WEATHER INTELLIGENCE
            </h1>
            <div className="flex items-center gap-2 mt-2 text-slate-400">
              <Lock className="w-4 h-4" />
              <span className="font-mono text-xs">
                Enterprise Access • Document ID: {documentId}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <RefreshCw className={`w-4 h-4 ${isLive ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
              <span className="font-mono text-xs uppercase">Live Telemetry</span>
            </div>
            <Badge variant="outline" className="border-purple-500/50 text-purple-400 font-mono">
              <Shield className="w-3 h-3 mr-1" />
              PROPRIETARY
            </Badge>
          </div>
        </div>
      </div>

      {/* Live Weather Strip */}
      <div className="mx-4 mb-4 p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-green-400 font-mono text-sm font-semibold">LIVE WEATHER</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-blue-400" />
              <span className="font-mono text-xl font-bold">
                {loading ? '--' : `${Math.round(weather?.current.temp || 45)}°F`}
              </span>
            </div>
            <div className="text-slate-500">|</div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-slate-400" />
              <span className="font-mono text-xl font-bold">
                {loading ? '--' : weather?.current.wind || 0}
              </span>
              <span className="text-slate-400 text-sm">mph</span>
            </div>
          </div>

          <Badge className="bg-green-600/20 text-green-400 border-green-500/50 font-mono">
            OPERATIONAL SCORE: {weatherScore}%
          </Badge>
        </div>
      </div>

      {/* Location Card */}
      <div className="mx-4 mb-4 rounded-lg overflow-hidden">
        <div className="flex">
          {/* Location Info */}
          <div className="flex-1 bg-gradient-to-br from-purple-950/60 to-slate-900 p-6 flex flex-col items-center justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 border-2 border-purple-400/30">
              <MapPin className="w-12 h-12 text-purple-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-center">{locationData.name}</h2>
            <h3 className="text-lg text-slate-300">{locationData.state}</h3>
            <Badge className="mt-2 bg-purple-600/30 border-purple-400/50 text-purple-300">{locationData.region}</Badge>
          </div>

          {/* Center Info */}
          <div className="w-32 md:w-48 bg-slate-900/90 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-slate-400 font-mono text-xs mb-2">{formatDate(currentTime)}</p>
            <Sun className="w-10 h-10 text-yellow-400 mb-2" />
            <p className="font-mono text-lg font-bold text-white">{formatTime(currentTime)}</p>
            <p className="text-purple-400 text-sm mt-1">Falmouth Town Center</p>
            <p className="text-slate-500 text-xs">41.55°N, 70.61°W</p>
          </div>

          {/* Weather Conditions */}
          <div className="flex-1 bg-gradient-to-bl from-blue-950/60 to-slate-900 p-6 flex flex-col items-center justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border-2 border-blue-400/30">
              <Cloud className="w-12 h-12 text-blue-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-center">CURRENT</h2>
            <h3 className="text-lg text-slate-300">Conditions</h3>
            <Badge className="mt-2 bg-blue-600/30 border-blue-400/50 text-blue-300">
              {loading ? 'Loading...' : weather?.current.condition || 'Partly Cloudy'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Location Features Tabs */}
      <div className="mx-4 mb-4">
        <Tabs defaultValue="woods-hole" className="w-full">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-4 h-4" />
              <span className="font-mono text-sm">Coverage Areas</span>
            </div>
            <TabsList className="bg-slate-800/50">
              {locationData.features.map((feature) => (
                <TabsTrigger 
                  key={feature.name.toLowerCase().replace(' ', '-')}
                  value={feature.name.toLowerCase().replace(' ', '-')} 
                  className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-400"
                >
                  <Target className="w-3 h-3 mr-1" />
                  {feature.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {locationData.features.map((feature) => (
            <TabsContent 
              key={feature.name.toLowerCase().replace(' ', '-')}
              value={feature.name.toLowerCase().replace(' ', '-')} 
              className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-white">{feature.name}</h4>
                  <p className="text-slate-400 text-sm">{feature.type}</p>
                </div>
                <Badge className={`${feature.status === 'active' ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'}`}>
                  {feature.status.toUpperCase()}
                </Badge>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Operational Metrics */}
      <div className="mx-4 mb-4 bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h3 className="text-green-400 font-mono text-lg font-semibold tracking-wide">OPERATIONAL METRICS</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {operationalMetrics.map((metric) => (
            <div key={metric.category} className="bg-slate-900/50 p-4 rounded-lg border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-semibold">{metric.category}</span>
                <Badge className="bg-green-600/20 text-green-300 font-mono">{metric.impact}</Badge>
              </div>
              <p className="text-slate-400 text-sm">{metric.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Scenarios */}
      <div className="mx-4 mb-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-purple-400" />
            <h3 className="text-purple-400 font-mono text-lg font-semibold tracking-wide">WEATHER SCENARIO PROTOCOLS</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-sm">System Time:</span>
            <span className="text-white font-mono font-bold">{formatTime(currentTime)}</span>
          </div>
        </div>

        {/* Scenario Selection */}
        <div className="flex flex-wrap gap-2 mb-4">
          {weatherScenarios.map((scenario) => (
            <Button
              key={scenario.id}
              variant={activeScenario === scenario.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveScenario(scenario.id)}
              className={`font-mono text-xs ${
                activeScenario === scenario.id 
                  ? scenario.priority === 'critical' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : scenario.priority === 'high'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-purple-600 hover:bg-purple-700'
                  : 'border-slate-600 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {scenario.priority === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {scenario.situation}
            </Button>
          ))}
        </div>

        {/* Selected Scenario Detail */}
        {selectedScenario && (
          <div className="bg-slate-900/70 rounded-lg p-4 border border-slate-700/50">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-500/30">
                  <span className="text-purple-400 font-mono text-lg font-bold">{selectedScenario.threshold}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{selectedScenario.situation}</p>
                  <p className="text-slate-400 text-sm font-mono">
                    {selectedScenario.impact}
                  </p>
                </div>
              </div>
              <Badge className={`font-mono ${
                selectedScenario.priority === 'critical' 
                  ? 'bg-red-600/20 text-red-400 border-red-500/50' 
                  : selectedScenario.priority === 'high'
                  ? 'bg-amber-600/20 text-amber-400 border-amber-500/50'
                  : 'bg-purple-600/20 text-purple-400 border-purple-500/50'
              }`}>
                {selectedScenario.priority.toUpperCase()} PRIORITY
              </Badge>
            </div>

            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border-l-4 border-purple-500">
              <p className="text-slate-300">
                <Zap className="w-4 h-4 inline text-purple-400 mr-2" />
                {selectedScenario.recommendation}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {selectedScenario.actions.map((action, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded bg-slate-800/30 text-sm"
                >
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300">{action}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mx-4 mb-4 p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500">
          <span>LAVANDAR AI Weather Intelligence Platform</span>
          <span>Falmouth, MA • Cape Cod Region</span>
        </div>
      </div>
    </div>
  );
}
