import { useState, useEffect, useMemo } from 'react';
import { 
  Lock, RefreshCw, Shield, Thermometer, Wind, Radio, Clock, 
  Users, Target, TrendingUp, Timer, AlertTriangle, Zap, 
  ChevronRight, Activity, Play, Pause, RotateCcw
} from 'lucide-react';
import { useWeatherData } from '@/hooks/useWeatherData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Gillette Stadium coordinates
const GILLETTE_LAT = 42.0909;
const GILLETTE_LON = -71.2643;

interface ClockScenario {
  id: string;
  situation: string;
  timeRemaining: string;
  quarter: number;
  down: number;
  distance: number;
  fieldPosition: string;
  recommendation: string;
  priority: 'critical' | 'high' | 'standard';
  tactics: string[];
}

const clockScenarios: ClockScenario[] = [
  {
    id: 'two-minute-drill',
    situation: 'Two-Minute Drill',
    timeRemaining: '2:00',
    quarter: 2,
    down: 1,
    distance: 10,
    fieldPosition: 'OWN 25',
    recommendation: 'No-huddle offense, sideline routes priority',
    priority: 'critical',
    tactics: ['Spike ball option', 'Use timeouts strategically', 'Target sidelines', 'Avoid middle of field']
  },
  {
    id: 'clock-kill',
    situation: 'Clock Management - Leading',
    timeRemaining: '4:30',
    quarter: 4,
    down: 2,
    distance: 6,
    fieldPosition: 'OPP 45',
    recommendation: 'Run-heavy, drain clock, force opponent timeouts',
    priority: 'high',
    tactics: ['Run between tackles', 'Let play clock drain', 'Avoid out of bounds', 'Secure the football']
  },
  {
    id: 'hurry-up',
    situation: 'Hurry-Up - Trailing',
    timeRemaining: '5:15',
    quarter: 4,
    down: 1,
    distance: 10,
    fieldPosition: 'OWN 35',
    recommendation: 'Quick tempo, chunk plays, manage timeouts',
    priority: 'critical',
    tactics: ['10-15 yard gains', 'Save timeouts for final 2 min', 'Mix run/pass', 'Attack middle of field']
  },
  {
    id: 'end-of-half',
    situation: 'End of Half Management',
    timeRemaining: '0:45',
    quarter: 2,
    down: 1,
    distance: 10,
    fieldPosition: 'OPP 40',
    recommendation: 'Field goal range priority, clock awareness',
    priority: 'high',
    tactics: ['Already in FG range', 'Take end zone shot', 'Spike if needed', 'Timeout at 0:05']
  }
];

const keyPlayers = {
  patriots: [
    { name: 'Drake Maye', position: 'QB', number: 10, status: 'active' },
    { name: 'Rhamondre Stevenson', position: 'RB', number: 38, status: 'active' },
    { name: 'Ja\'Lynn Polk', position: 'WR', number: 0, status: 'active' },
    { name: 'Hunter Henry', position: 'TE', number: 85, status: 'active' }
  ],
  opponent: [
    { name: 'Justin Herbert', position: 'QB', number: 10, status: 'active' },
    { name: 'J.K. Dobbins', position: 'RB', number: 27, status: 'active' },
    { name: 'Ladd McConkey', position: 'WR', number: 15, status: 'active' },
    { name: 'Khalil Mack', position: 'EDGE', number: 52, status: 'active' }
  ]
};

const strengthsToLeverage = [
  { category: 'Weather Advantage', detail: 'Cold weather favors Patriots conditioning', impact: '+12%' },
  { category: 'Home Field', detail: 'Crowd noise on 3rd down conversions', impact: '+8%' },
  { category: 'Run Defense', detail: 'Top 5 against inside zone schemes', impact: '+15%' },
  { category: 'Red Zone', detail: 'Improved TD% in cold conditions', impact: '+6%' }
];

export default function PatriotsEvaluation() {
  const { weather, loading } = useWeatherData(GILLETTE_LAT, GILLETTE_LON);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeScenario, setActiveScenario] = useState<string>('two-minute-drill');
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const documentId = useMemo(() => {
    const date = new Date();
    return `NE-LAC-${date.getFullYear()}-SNF-001`;
  }, []);

  const weatherAdvantage = useMemo(() => {
    if (!weather) return 0;
    let advantage = 0;
    // Cold weather bonus
    if (weather.current.temp < 40) advantage += 15;
    else if (weather.current.temp < 50) advantage += 8;
    // Wind advantage (Patriots practice in wind)
    if (weather.current.wind > 15) advantage += 12;
    else if (weather.current.wind > 10) advantage += 6;
    // Precipitation advantage
    if (weather.current.precipitation > 0) advantage += 8;
    return Math.min(advantage, 40);
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

  const selectedScenario = clockScenarios.find(s => s.id === activeScenario);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Classified Header */}
      <div className="border-2 border-red-600/60 bg-red-950/20 m-4 p-4 rounded-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-red-500 font-mono text-lg md:text-xl font-bold tracking-wider">
              CLASSIFIED - KRAFT GROUP INTERNAL
            </h1>
            <div className="flex items-center gap-2 mt-2 text-slate-400">
              <Lock className="w-4 h-4" />
              <span className="font-mono text-xs">
                Security Level: Executive Access Only • Document ID: {documentId}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <RefreshCw className={`w-4 h-4 ${isLive ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
              <span className="font-mono text-xs uppercase">Live Telemetry</span>
            </div>
            <Badge variant="outline" className="border-amber-500/50 text-amber-400 font-mono">
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
                {loading ? '--' : `${Math.round(weather?.current.temp || 32)}°F`}
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
            PATRIOTS WEATHER ADVANTAGE: +{weatherAdvantage}%
          </Badge>
        </div>
      </div>

      {/* Game Matchup Card */}
      <div className="mx-4 mb-4 rounded-lg overflow-hidden">
        <div className="flex">
          {/* Patriots Side */}
          <div className="flex-1 bg-gradient-to-br from-[#002244] to-[#0a1628] p-6 flex flex-col items-center justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl md:text-5xl">🏈</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-center">NEW ENGLAND</h2>
            <h3 className="text-lg text-slate-300">PATRIOTS</h3>
            <Badge className="mt-2 bg-blue-600/30 border-blue-400/50 text-blue-300">14-3</Badge>
          </div>

          {/* Center Info */}
          <div className="w-32 md:w-40 bg-slate-900/90 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-slate-400 font-mono text-xs mb-2">{formatDate(currentTime)}</p>
            <span className="text-3xl md:text-4xl font-bold text-white mb-2">VS</span>
            <p className="font-mono text-lg font-bold text-white">8:15 PM ET</p>
            <p className="text-red-400 text-sm mt-1">Gillette Stadium</p>
            <p className="text-slate-500 text-xs">Foxborough</p>
            
            <div className="flex gap-2 mt-4">
              <div className="bg-slate-800 px-3 py-1 rounded text-xs font-mono">
                <span className="text-slate-500">LAC</span>
                <span className="text-white ml-1">-6.5</span>
              </div>
              <div className="bg-slate-800 px-3 py-1 rounded text-xs font-mono">
                <span className="text-slate-500">O/U</span>
                <span className="text-white ml-1">44.5</span>
              </div>
            </div>
          </div>

          {/* Chargers Side */}
          <div className="flex-1 bg-gradient-to-bl from-[#0080C6] to-[#0a3654] p-6 flex flex-col items-center justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl md:text-5xl">⚡</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-center">LOS ANGELES</h2>
            <h3 className="text-lg text-slate-300">CHARGERS</h3>
            <Badge className="mt-2 bg-yellow-600/30 border-yellow-400/50 text-yellow-300">11-6</Badge>
          </div>
        </div>
      </div>

      {/* Live Roster & Intel Tabs */}
      <div className="mx-4 mb-4">
        <Tabs defaultValue="drake-maye" className="w-full">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-4 h-4" />
              <span className="font-mono text-sm">Live Roster</span>
            </div>
            <TabsList className="bg-slate-800/50">
              <TabsTrigger value="drake-maye" className="data-[state=active]:bg-red-600/30 data-[state=active]:text-red-400">
                <Target className="w-3 h-3 mr-1" />
                Drake Maye
              </TabsTrigger>
              <TabsTrigger value="herbert-intel" className="data-[state=active]:bg-blue-600/30 data-[state=active]:text-blue-400">
                <Shield className="w-3 h-3 mr-1" />
                Herbert Intel
              </TabsTrigger>
              <TabsTrigger value="passing-chart" className="data-[state=active]:bg-green-600/30 data-[state=active]:text-green-400">
                <Activity className="w-3 h-3 mr-1" />
                Passing Chart
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="drake-maye" className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {keyPlayers.patriots.map((player) => (
                <div key={player.name} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-red-400">#{player.number}</span>
                    <Badge className="bg-green-600/20 text-green-400 text-xs">{player.status}</Badge>
                  </div>
                  <p className="font-semibold text-white">{player.name}</p>
                  <p className="text-slate-400 text-sm">{player.position}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="herbert-intel" className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {keyPlayers.opponent.map((player) => (
                <div key={player.name} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-blue-400">#{player.number}</span>
                    <Badge className="bg-green-600/20 text-green-400 text-xs">{player.status}</Badge>
                  </div>
                  <p className="font-semibold text-white">{player.name}</p>
                  <p className="text-slate-400 text-sm">{player.position}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="passing-chart" className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-slate-400">Real-time passing chart updates during live play</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Strengths to Leverage */}
      <div className="mx-4 mb-4 bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h3 className="text-green-400 font-mono text-lg font-semibold tracking-wide">STRENGTHS TO LEVERAGE</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {strengthsToLeverage.map((strength) => (
            <div key={strength.category} className="bg-slate-900/50 p-4 rounded-lg border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-semibold">{strength.category}</span>
                <Badge className="bg-green-600/20 text-green-300 font-mono">{strength.impact}</Badge>
              </div>
              <p className="text-slate-400 text-sm">{strength.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Clock Management Essentials */}
      <div className="mx-4 mb-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-amber-400" />
            <h3 className="text-amber-400 font-mono text-lg font-semibold tracking-wide">CLOCK MANAGEMENT ESSENTIALS</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-sm">System Time:</span>
            <span className="text-white font-mono font-bold">{formatTime(currentTime)}</span>
          </div>
        </div>

        {/* Scenario Selection */}
        <div className="flex flex-wrap gap-2 mb-4">
          {clockScenarios.map((scenario) => (
            <Button
              key={scenario.id}
              variant={activeScenario === scenario.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveScenario(scenario.id)}
              className={`font-mono text-xs ${
                activeScenario === scenario.id 
                  ? scenario.priority === 'critical' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-amber-600 hover:bg-amber-700'
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
                <div className="bg-amber-500/20 px-4 py-2 rounded-lg border border-amber-500/30">
                  <span className="text-amber-400 font-mono text-2xl font-bold">{selectedScenario.timeRemaining}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{selectedScenario.situation}</p>
                  <p className="text-slate-400 text-sm font-mono">
                    Q{selectedScenario.quarter} • {selectedScenario.down}{'&'}{selectedScenario.distance} • {selectedScenario.fieldPosition}
                  </p>
                </div>
              </div>
              <Badge className={`font-mono ${
                selectedScenario.priority === 'critical' 
                  ? 'bg-red-600/20 text-red-400 border-red-500/50' 
                  : 'bg-amber-600/20 text-amber-400 border-amber-500/50'
              }`}>
                {selectedScenario.priority.toUpperCase()} PRIORITY
              </Badge>
            </div>

            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border-l-4 border-amber-500">
              <p className="text-slate-300">
                <Zap className="w-4 h-4 inline text-amber-400 mr-2" />
                <span className="font-semibold text-white">Recommendation:</span> {selectedScenario.recommendation}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-2 font-mono">TACTICAL PRIORITIES:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedScenario.tactics.map((tactic, index) => (
                  <div key={index} className="flex items-center gap-2 text-slate-300">
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                    <span className="text-sm">{tactic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clock Controls Visual */}
            <div className="mt-4 flex items-center justify-center gap-4 pt-4 border-t border-slate-700/50">
              <Button variant="outline" size="sm" className="border-slate-600">
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button variant="outline" size="sm" className={`border-slate-600 ${isLive ? 'bg-green-600/20 text-green-400' : ''}`} onClick={() => setIsLive(!isLive)}>
                {isLive ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                {isLive ? 'Live' : 'Paused'}
              </Button>
              <div className="flex items-center gap-2 text-slate-400 font-mono text-sm">
                <Clock className="w-4 h-4" />
                <span>Play Clock: 40s</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mx-4 mb-4 p-4 bg-slate-900/50 border border-slate-800 rounded-lg text-center">
        <p className="text-slate-500 font-mono text-xs">
          KRAFT GROUP ENTERPRISES • PROPRIETARY GAME INTELLIGENCE SYSTEM
        </p>
        <p className="text-slate-600 font-mono text-xs mt-1">
          Document Classification: INTERNAL USE ONLY • {documentId}
        </p>
      </div>
    </div>
  );
}
