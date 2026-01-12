import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tv, Radio, Smartphone, MapPin, Clock, Trophy, Zap, ChevronRight, Volume2 } from 'lucide-react';

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
  isPast: boolean;
}

const PatriotWay = () => {
  const [countdown, setCountdown] = useState<CountdownTime>({ hours: 0, minutes: 0, seconds: 0, isLive: false, isPast: false });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Game time: January 11, 2026 at 8:15 PM EST
  const gameTime = new Date('2026-01-11T20:15:00-05:00');
  const gameEndEstimate = new Date('2026-01-11T23:30:00-05:00'); // ~3.25 hours later

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const diff = gameTime.getTime() - now.getTime();
      const gameEndDiff = gameEndEstimate.getTime() - now.getTime();

      if (diff <= 0 && gameEndDiff > 0) {
        setCountdown({ hours: 0, minutes: 0, seconds: 0, isLive: true, isPast: false });
      } else if (gameEndDiff <= 0) {
        setCountdown({ hours: 0, minutes: 0, seconds: 0, isLive: false, isPast: true });
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
          <Link to="/" className="text-strata-silver hover:text-patriots-silver transition-colors text-sm font-mono">
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-patriots-red/30 bg-patriots-red/10 mb-4">
            <Trophy className="w-4 h-4 text-patriots-red" />
            <span className="text-xs font-mono uppercase tracking-widest text-patriots-silver">NFL Wild Card Playoff</span>
          </div>
          <h1 className="font-instrument text-5xl md:text-7xl font-bold text-patriots-white tracking-tight mb-2">
            PATRIOT WAY
          </h1>
          <p className="text-patriots-silver font-mono text-sm">Game Night Command Center</p>
        </div>

        {/* Matchup */}
        <div className="flex items-center justify-center gap-8 mb-12">
          {/* Chargers */}
          <div className="text-center">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-chargers-blue/20 border-2 border-chargers-gold/40 flex items-center justify-center mb-3 mx-auto">
              <Zap className="w-10 h-10 md:w-14 md:h-14 chargers-accent" />
            </div>
            <div className="font-instrument text-xl md:text-2xl text-chargers-gold">CHARGERS</div>
            <div className="text-muted-foreground text-sm font-mono">11-6</div>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="patriots-score-box rounded-lg px-6 py-4">
              <div className="text-muted-foreground text-xs font-mono mb-1">AT</div>
              <div className="font-instrument text-2xl text-patriots-silver-bright">VS</div>
            </div>
          </div>

          {/* Patriots */}
          <div className="text-center">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-patriots-navy border-2 border-patriots-red/60 flex items-center justify-center mb-3 mx-auto game-live-pulse">
              <span className="font-instrument text-3xl md:text-4xl text-patriots-white">NE</span>
            </div>
            <div className="font-instrument text-xl md:text-2xl patriots-glow">PATRIOTS</div>
            <div className="text-muted-foreground text-sm font-mono">14-3 • #2 AFC</div>
          </div>
        </div>

        {/* Countdown / Live Status */}
        <div className="max-w-2xl mx-auto mb-12">
          {countdown.isLive ? (
            <div className="patriots-card rounded-xl p-8 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-patriots-red/30 border border-patriots-red mb-4">
                <div className="w-3 h-3 rounded-full bg-patriots-red-bright animate-pulse" />
                <span className="font-instrument text-2xl text-patriots-white">GAME IN PROGRESS</span>
              </div>
              <p className="text-patriots-silver font-mono">Watch live on NBC, Peacock, or NFL+</p>
            </div>
          ) : countdown.isPast ? (
            <div className="patriots-card rounded-xl p-8 text-center">
              <div className="font-instrument text-2xl text-patriots-silver mb-2">GAME COMPLETE</div>
              <p className="text-muted-foreground font-mono text-sm">Check scores on NFL.com</p>
            </div>
          ) : (
            <div className="patriots-card rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Kickoff In</div>
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="countdown-digit rounded-lg px-6 py-4 text-center min-w-[90px]">
                  <div className="font-instrument text-4xl md:text-5xl text-patriots-white">{String(countdown.hours).padStart(2, '0')}</div>
                  <div className="text-xs font-mono text-muted-foreground mt-1">HOURS</div>
                </div>
                <div className="text-3xl text-patriots-red font-bold">:</div>
                <div className="countdown-digit rounded-lg px-6 py-4 text-center min-w-[90px]">
                  <div className="font-instrument text-4xl md:text-5xl text-patriots-white">{String(countdown.minutes).padStart(2, '0')}</div>
                  <div className="text-xs font-mono text-muted-foreground mt-1">MINUTES</div>
                </div>
                <div className="text-3xl text-patriots-red font-bold">:</div>
                <div className="countdown-digit rounded-lg px-6 py-4 text-center min-w-[90px]">
                  <div className="font-instrument text-4xl md:text-5xl text-patriots-white">{String(countdown.seconds).padStart(2, '0')}</div>
                  <div className="text-xs font-mono text-muted-foreground mt-1">SECONDS</div>
                </div>
              </div>
              <div className="text-center mt-6">
                <div className="text-patriots-silver font-mono">8:15 PM EST • NBC</div>
              </div>
            </div>
          )}
        </div>

        {/* Game Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
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
                <span className="text-muted-foreground">Weather</span>
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
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center gap-3 mb-6">
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
                <option.icon className={`w-6 h-6 mx-auto mb-2 ${option.primary ? 'text-patriots-red' : 'text-patriots-silver'}`} />
                <div className="font-instrument text-sm text-patriots-white">{option.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{option.sublabel}</div>
                <ChevronRight className="w-4 h-4 mx-auto mt-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Key Players */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-patriots-red" />
            <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Players to Watch</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Patriots Player */}
            <div className="patriots-card rounded-xl p-6 border-l-4 border-patriots-red">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-patriots-navy border border-patriots-red/40 flex items-center justify-center">
                  <span className="font-instrument text-xl text-patriots-white">#4</span>
                </div>
                <div>
                  <div className="font-instrument text-xl text-patriots-white">Drake Maye</div>
                  <div className="text-sm text-patriots-silver">Quarterback • Patriots</div>
                  <div className="text-xs text-muted-foreground mt-1">Rookie sensation, AFC's top-rated passer</div>
                </div>
              </div>
            </div>
            {/* Chargers Player */}
            <div className="patriots-card rounded-xl p-6 border-l-4 border-chargers-gold">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-chargers-blue/30 border border-chargers-gold/40 flex items-center justify-center">
                  <span className="font-instrument text-xl text-chargers-gold">#10</span>
                </div>
                <div>
                  <div className="font-instrument text-xl text-patriots-white">Justin Herbert</div>
                  <div className="text-sm text-chargers-gold">Quarterback • Chargers</div>
                  <div className="text-xs text-muted-foreground mt-1">Elite arm talent, top-10 pass rush</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-patriots-silver/10">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
            Go Pats • AFC Wild Card • January 11, 2026
          </div>
          <Link 
            to="/strata" 
            className="inline-flex items-center gap-2 text-sm text-patriots-silver hover:text-patriots-white transition-colors"
          >
            <Clock className="w-4 h-4" />
            View Weather Conditions in STRATA
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