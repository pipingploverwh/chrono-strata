import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tv, Radio, Smartphone, MapPin, Clock, Trophy, Zap, ChevronRight, Cloud, Wind, Thermometer, Droplets } from 'lucide-react';

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
  isPast: boolean;
}

interface QuarterScore {
  quarter: string;
  time: string;
  patriots: number;
  chargers: number;
  weather: {
    temp: number;
    condition: string;
    wind: number;
    humidity: number;
  };
}

const PatriotWay = () => {
  const [countdown, setCountdown] = useState<CountdownTime>({ hours: 0, minutes: 0, seconds: 0, isLive: false, isPast: false });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeQuarter, setActiveQuarter] = useState(0);

  // Game time: January 11, 2026 at 8:15 PM EST
  const gameTime = new Date('2026-01-11T20:15:00-05:00');
  const gameEndEstimate = new Date('2026-01-11T23:30:00-05:00');

  // Quarter-by-quarter data with weather conditions
  const quarterData: QuarterScore[] = [
    { 
      quarter: 'Q1', 
      time: '8:15 PM', 
      patriots: 7, 
      chargers: 3,
      weather: { temp: 32, condition: 'Partly Cloudy', wind: 12, humidity: 65 }
    },
    { 
      quarter: 'Q2', 
      time: '8:45 PM', 
      patriots: 14, 
      chargers: 10,
      weather: { temp: 30, condition: 'Clear', wind: 15, humidity: 62 }
    },
    { 
      quarter: 'Q3', 
      time: '9:30 PM', 
      patriots: 21, 
      chargers: 17,
      weather: { temp: 28, condition: 'Clear', wind: 18, humidity: 58 }
    },
    { 
      quarter: 'Q4', 
      time: '10:15 PM', 
      patriots: 28, 
      chargers: 24,
      weather: { temp: 26, condition: 'Cold & Clear', wind: 20, humidity: 55 }
    },
    { 
      quarter: 'FINAL', 
      time: '11:00 PM', 
      patriots: 31, 
      chargers: 27,
      weather: { temp: 25, condition: 'Cold & Clear', wind: 22, humidity: 52 }
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const diff = gameTime.getTime() - now.getTime();
      const gameEndDiff = gameEndEstimate.getTime() - now.getTime();

      if (diff <= 0 && gameEndDiff > 0) {
        setCountdown({ hours: 0, minutes: 0, seconds: 0, isLive: true, isPast: false });
        // Simulate quarter progression during game
        const elapsed = now.getTime() - gameTime.getTime();
        const quarterMins = 45; // ~45 mins per quarter
        const currentQ = Math.min(4, Math.floor(elapsed / (quarterMins * 60 * 1000)));
        setActiveQuarter(currentQ);
      } else if (gameEndDiff <= 0) {
        setCountdown({ hours: 0, minutes: 0, seconds: 0, isLive: false, isPast: true });
        setActiveQuarter(4);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ hours, minutes, seconds, isLive: false, isPast: false });
      }
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

  const watchOptions = [
    { icon: Tv, label: 'NBC', sublabel: 'National Broadcast', primary: true },
    { icon: Tv, label: 'NBC 10 Boston', sublabel: 'Local Coverage', primary: false },
    { icon: Smartphone, label: 'Peacock', sublabel: 'Streaming', primary: true },
    { icon: Smartphone, label: 'NFL+', sublabel: 'Mobile Streaming', primary: false },
    { icon: Radio, label: '98.5 The Sports Hub', sublabel: 'Radio', primary: false },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-patriots-navy via-background to-background" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-patriots-red/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-patriots-navy/20 via-transparent to-transparent blur-3xl" />
        
        {/* Animated lines */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-patriots-silver to-transparent"
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
          <Link to="/launch" className="text-strata-silver hover:text-patriots-silver transition-colors text-sm font-mono">
            ← STRATA
          </Link>
          <div className="text-right">
            <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="text-lg font-mono text-patriots-silver-bright">
              {formatTime(currentTime)}
            </div>
          </div>
        </header>

        {/* Main Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-patriots-red/30 bg-patriots-red/10 mb-4">
            <Trophy className="w-4 h-4 text-patriots-red" />
            <span className="text-xs font-mono uppercase tracking-widest text-patriots-silver">NFL Wild Card Playoff</span>
          </div>
          <h1 className="font-instrument text-5xl md:text-7xl font-bold text-patriots-white tracking-tight mb-2">
            PATRIOT WAY
          </h1>
          <p className="text-patriots-silver font-mono text-sm">Game Night Command Center</p>
        </div>

        {/* Live Score Tracker */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="patriots-card rounded-xl p-6">
            {/* Score Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {countdown.isLive && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-patriots-red/20 border border-patriots-red">
                    <div className="w-2 h-2 rounded-full bg-patriots-red-bright animate-pulse" />
                    <span className="text-xs font-mono text-patriots-white">LIVE</span>
                  </div>
                )}
                <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
                  {countdown.isPast ? 'Final Score' : countdown.isLive ? 'Game In Progress' : 'Projected Score'}
                </span>
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                Gillette Stadium • Foxborough, MA
              </div>
            </div>

            {/* Main Scoreboard */}
            <div className="grid grid-cols-7 gap-4 items-center mb-8">
              {/* Chargers */}
              <div className="col-span-2 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-chargers-blue/20 border-2 border-chargers-gold/40 flex items-center justify-center">
                  <Zap className="w-7 h-7 chargers-accent" />
                </div>
                <div>
                  <div className="font-instrument text-xl text-chargers-gold">LAC</div>
                  <div className="text-xs text-muted-foreground font-mono">11-6</div>
                </div>
              </div>

              {/* Score Display */}
              <div className="col-span-3 flex items-center justify-center gap-4">
                <div className="patriots-score-box rounded-lg px-8 py-4 text-center min-w-[80px]">
                  <div className="font-instrument text-4xl text-chargers-gold">
                    {quarterData[activeQuarter].chargers}
                  </div>
                </div>
                <div className="text-patriots-silver font-instrument text-xl">-</div>
                <div className="patriots-score-box rounded-lg px-8 py-4 text-center min-w-[80px] ring-2 ring-patriots-red/30">
                  <div className="font-instrument text-4xl text-patriots-white">
                    {quarterData[activeQuarter].patriots}
                  </div>
                </div>
              </div>

              {/* Patriots */}
              <div className="col-span-2 flex items-center justify-end gap-4">
                <div className="text-right">
                  <div className="font-instrument text-xl patriots-glow">NE</div>
                  <div className="text-xs text-muted-foreground font-mono">14-3</div>
                </div>
                <div className="w-14 h-14 rounded-full bg-patriots-navy border-2 border-patriots-red/60 flex items-center justify-center">
                  <span className="font-instrument text-xl text-patriots-white">NE</span>
                </div>
              </div>
            </div>

            {/* Quarter Timeline with Weather */}
            <div className="border-t border-patriots-silver/10 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-4 h-4 text-patriots-red" />
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Quarter-by-Quarter Timeline
                </span>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {quarterData.map((q, idx) => (
                  <button
                    key={q.quarter}
                    onClick={() => setActiveQuarter(idx)}
                    className={`relative p-4 rounded-lg transition-all ${
                      activeQuarter === idx 
                        ? 'bg-patriots-navy border border-patriots-red/50' 
                        : 'bg-secondary/30 border border-transparent hover:bg-secondary/50'
                    }`}
                  >
                    {/* Quarter indicator */}
                    {countdown.isLive && idx === activeQuarter && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-patriots-red-bright animate-pulse" />
                    )}
                    
                    <div className="text-center mb-3">
                      <div className={`font-instrument text-lg ${activeQuarter === idx ? 'text-patriots-white' : 'text-patriots-silver'}`}>
                        {q.quarter}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">{q.time}</div>
                    </div>
                    
                    {/* Score for this quarter */}
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className={`font-mono text-sm ${activeQuarter === idx ? 'text-chargers-gold' : 'text-muted-foreground'}`}>
                        {q.chargers}
                      </span>
                      <span className="text-muted-foreground">-</span>
                      <span className={`font-mono text-sm ${activeQuarter === idx ? 'text-patriots-white' : 'text-muted-foreground'}`}>
                        {q.patriots}
                      </span>
                    </div>

                    {/* Weather data */}
                    <div className={`space-y-1 pt-2 border-t ${activeQuarter === idx ? 'border-patriots-silver/20' : 'border-transparent'}`}>
                      <div className="flex items-center justify-center gap-1">
                        <Thermometer className={`w-3 h-3 ${activeQuarter === idx ? 'text-strata-cyan' : 'text-muted-foreground'}`} />
                        <span className={`text-[10px] font-mono ${activeQuarter === idx ? 'text-strata-cyan' : 'text-muted-foreground'}`}>
                          {q.weather.temp}°F
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Wind className={`w-3 h-3 ${activeQuarter === idx ? 'text-strata-blue' : 'text-muted-foreground'}`} />
                        <span className={`text-[10px] font-mono ${activeQuarter === idx ? 'text-strata-blue' : 'text-muted-foreground'}`}>
                          {q.weather.wind} mph
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Cloud className={`w-3 h-3 ${activeQuarter === idx ? 'text-patriots-silver' : 'text-muted-foreground'}`} />
                        <span className={`text-[9px] font-mono ${activeQuarter === idx ? 'text-patriots-silver' : 'text-muted-foreground'}`}>
                          {q.weather.condition.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Weather Detail */}
            <div className="mt-6 p-4 rounded-lg bg-secondary/20 border border-patriots-silver/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-strata-cyan" />
                    <div>
                      <div className="text-xs text-muted-foreground">Temperature</div>
                      <div className="font-instrument text-lg text-patriots-white">{quarterData[activeQuarter].weather.temp}°F</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-strata-blue" />
                    <div>
                      <div className="text-xs text-muted-foreground">Wind</div>
                      <div className="font-instrument text-lg text-patriots-white">{quarterData[activeQuarter].weather.wind} mph SW</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-strata-cyan" />
                    <div>
                      <div className="text-xs text-muted-foreground">Humidity</div>
                      <div className="font-instrument text-lg text-patriots-white">{quarterData[activeQuarter].weather.humidity}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-patriots-silver" />
                    <div>
                      <div className="text-xs text-muted-foreground">Conditions</div>
                      <div className="font-instrument text-lg text-patriots-white">{quarterData[activeQuarter].weather.condition}</div>
                    </div>
                  </div>
                </div>
                <Link 
                  to="/strata"
                  className="px-4 py-2 rounded border border-patriots-silver/20 text-xs font-mono text-patriots-silver hover:bg-patriots-silver/10 transition-colors"
                >
                  Open STRATA →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown (only show when not live) */}
        {!countdown.isLive && !countdown.isPast && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="patriots-card rounded-xl p-6">
              <div className="text-center mb-4">
                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Kickoff In</div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="countdown-digit rounded-lg px-4 py-3 text-center min-w-[70px]">
                  <div className="font-instrument text-3xl text-patriots-white">{String(countdown.hours).padStart(2, '0')}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">HRS</div>
                </div>
                <div className="text-2xl text-patriots-red font-bold">:</div>
                <div className="countdown-digit rounded-lg px-4 py-3 text-center min-w-[70px]">
                  <div className="font-instrument text-3xl text-patriots-white">{String(countdown.minutes).padStart(2, '0')}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">MIN</div>
                </div>
                <div className="text-2xl text-patriots-red font-bold">:</div>
                <div className="countdown-digit rounded-lg px-4 py-3 text-center min-w-[70px]">
                  <div className="font-instrument text-3xl text-patriots-white">{String(countdown.seconds).padStart(2, '0')}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">SEC</div>
                </div>
              </div>
              <div className="text-center mt-4">
                <div className="text-patriots-silver font-mono text-sm">8:15 PM EST • NBC</div>
              </div>
            </div>
          </div>
        )}

        {/* Game Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {/* Location Card */}
          <div className="patriots-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-patriots-red" />
              <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Location</span>
            </div>
            <div className="font-instrument text-2xl text-patriots-white mb-1">Gillette Stadium</div>
            <div className="text-patriots-silver font-mono text-sm">Foxborough, Massachusetts</div>
            <div className="mt-4 pt-4 border-t border-patriots-silver/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Weather at Kickoff</span>
                <span className="text-patriots-silver">32°F • Partly Cloudy</span>
              </div>
            </div>
          </div>

          {/* Odds Card */}
          <div className="patriots-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-5 h-5 text-chargers-gold" />
              <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Game Odds</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-patriots-silver">Patriots Favored</span>
                <span className="font-instrument text-xl text-patriots-white">-3.5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-patriots-silver">Over/Under</span>
                <span className="font-instrument text-xl text-patriots-white">45.5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Watch Options */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Tv className="w-5 h-5 text-patriots-red" />
            <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground">How to Watch</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {watchOptions.map((option, index) => (
              <button
                key={index}
                className={`group patriots-card rounded-lg p-4 text-center transition-all hover:border-patriots-red/50 ${
                  option.primary ? 'ring-1 ring-patriots-red/30' : ''
                }`}
              >
                <option.icon className={`w-5 h-5 mx-auto mb-2 ${option.primary ? 'text-patriots-red' : 'text-patriots-silver'}`} />
                <div className="font-instrument text-sm text-patriots-white">{option.label}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{option.sublabel}</div>
                <ChevronRight className="w-3 h-3 mx-auto mt-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Key Players */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-patriots-red" />
            <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Players to Watch</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Patriots Player */}
            <div className="patriots-card rounded-xl p-5 border-l-4 border-patriots-red">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-patriots-navy border border-patriots-red/40 flex items-center justify-center">
                  <span className="font-instrument text-lg text-patriots-white">#4</span>
                </div>
                <div>
                  <div className="font-instrument text-lg text-patriots-white">Drake Maye</div>
                  <div className="text-sm text-patriots-silver">Quarterback • Patriots</div>
                  <div className="text-xs text-muted-foreground mt-1">AFC's top-rated passer</div>
                </div>
              </div>
            </div>
            {/* Chargers Player */}
            <div className="patriots-card rounded-xl p-5 border-l-4 border-chargers-gold">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-chargers-blue/30 border border-chargers-gold/40 flex items-center justify-center">
                  <span className="font-instrument text-lg text-chargers-gold">#10</span>
                </div>
                <div>
                  <div className="font-instrument text-lg text-patriots-white">Justin Herbert</div>
                  <div className="text-sm text-chargers-gold">Quarterback • Chargers</div>
                  <div className="text-xs text-muted-foreground mt-1">Elite arm talent</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-patriots-silver/10">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
            Go Pats • AFC Wild Card • January 11, 2026
          </div>
          <Link 
            to="/strata" 
            className="inline-flex items-center gap-2 text-sm text-patriots-silver hover:text-patriots-white transition-colors"
          >
            <Clock className="w-4 h-4" />
            View Full Weather Conditions in STRATA
          </Link>
        </footer>
      </div>

      <style>{`
        @keyframes slide-line {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(50%); }
        }
      `}</style>
    </div>
  );
};

export default PatriotWay;