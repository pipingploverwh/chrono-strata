import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Check, 
  Wind, 
  Droplets, 
  Thermometer, 
  Gauge,
  Shield,
  Zap,
  Eye,
  Layers,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════
// STRATA LIVE DISPLAY COMPONENT - "Live Jewelry"
// Recessed OLED with emerald halo, pulse animation
// ═══════════════════════════════════════════════════════════════
const StrataDisplay = ({ variant = 'dial' }: { variant?: 'dial' | 'status' | 'metrics' }) => {
  const [time, setTime] = useState(new Date());
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    const pulseInterval = setInterval(() => setPulse(p => !p), 3000);
    return () => {
      clearInterval(interval);
      clearInterval(pulseInterval);
    };
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  if (variant === 'status') {
    return (
      <div className="relative w-32 h-20 bg-zinc-950 rounded border border-zinc-800 overflow-hidden">
        {/* Emerald halo - diffused */}
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ${pulse ? 'opacity-40' : 'opacity-20'}`}
          style={{ 
            background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.3) 0%, transparent 70%)',
            filter: 'blur(8px)'
          }} 
        />
        {/* Beveled glass effect */}
        <div className="absolute inset-[2px] bg-zinc-950 rounded-sm border border-zinc-900">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
            {/* GIG GO Status */}
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                style={{ boxShadow: '0 0 8px rgba(16,185,129,0.8)' }}
              />
              <span 
                className="text-xs font-mono tracking-widest text-emerald-400"
                style={{ textShadow: '0 0 6px rgba(16,185,129,0.6)' }}
              >
                GIG GO
              </span>
            </div>
            {/* Metrics row */}
            <div className="flex gap-3 text-[9px] text-zinc-500 font-mono">
              <span>W:12kt</span>
              <span>H:45%</span>
              <span>T:72°</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'metrics') {
    return (
      <div className="relative w-40 h-24 bg-zinc-950 rounded border border-zinc-800 overflow-hidden">
        {/* Emerald halo */}
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ${pulse ? 'opacity-30' : 'opacity-15'}`}
          style={{ 
            background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.25) 0%, transparent 70%)',
            filter: 'blur(10px)'
          }} 
        />
        {/* Content */}
        <div className="absolute inset-[2px] bg-zinc-950 rounded-sm border border-zinc-900 p-2">
          <div className="text-[8px] text-zinc-600 uppercase tracking-widest mb-2">Operational Window</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {[
              { icon: Wind, label: 'Wind', value: '12kt', ok: true },
              { icon: Droplets, label: 'Precip', value: '5%', ok: true },
              { icon: Gauge, label: 'Press', value: '1013', ok: true },
              { icon: Thermometer, label: 'Temp', value: '72°F', ok: true },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-1">
                <m.icon className="w-2.5 h-2.5 text-zinc-600" />
                <span 
                  className={`text-[10px] font-mono ${m.ok ? 'text-emerald-400' : 'text-amber-400'}`}
                  style={{ textShadow: m.ok ? '0 0 4px rgba(16,185,129,0.5)' : '0 0 4px rgba(245,158,11,0.5)' }}
                >
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Dial variant
  return (
    <div className="relative w-24 h-24 bg-zinc-950 rounded-full border border-zinc-800 overflow-hidden">
      {/* Emerald halo - breathing pulse */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${pulse ? 'opacity-50' : 'opacity-25'}`}
        style={{ 
          background: 'radial-gradient(circle at center, rgba(16,185,129,0.4) 0%, transparent 60%)',
          filter: 'blur(12px)'
        }} 
      />
      {/* Beveled glass */}
      <div className="absolute inset-[3px] bg-zinc-950 rounded-full border border-zinc-900 flex items-center justify-center">
        <svg width="70" height="70" viewBox="0 0 70 70">
          {/* Dial markers */}
          {[...Array(12)].map((_, i) => {
            const angle = i * 30 - 90;
            const x1 = 35 + 28 * Math.cos(angle * Math.PI / 180);
            const y1 = 35 + 28 * Math.sin(angle * Math.PI / 180);
            const x2 = 35 + 32 * Math.cos(angle * Math.PI / 180);
            const y2 = 35 + 32 * Math.sin(angle * Math.PI / 180);
            return (
              <line 
                key={i} x1={x1} y1={y1} x2={x2} y2={y2} 
                stroke="rgb(16 185 129)" 
                strokeWidth={i % 3 === 0 ? 2 : 1}
                style={{ filter: 'drop-shadow(0 0 3px rgb(16 185 129))' }}
              />
            );
          })}
          {/* Hour hand */}
          <line 
            x1="35" y1="35" 
            x2={35 + 16 * Math.cos((hourAngle - 90) * Math.PI / 180)} 
            y2={35 + 16 * Math.sin((hourAngle - 90) * Math.PI / 180)}
            stroke="rgb(16 185 129)" strokeWidth="2.5" strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 4px rgb(16 185 129))' }}
          />
          {/* Minute hand */}
          <line 
            x1="35" y1="35" 
            x2={35 + 22 * Math.cos((minuteAngle - 90) * Math.PI / 180)} 
            y2={35 + 22 * Math.sin((minuteAngle - 90) * Math.PI / 180)}
            stroke="rgb(16 185 129)" strokeWidth="2" strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 4px rgb(16 185 129))' }}
          />
          {/* Second hand */}
          <line 
            x1="35" y1="35" 
            x2={35 + 26 * Math.cos((secondAngle - 90) * Math.PI / 180)} 
            y2={35 + 26 * Math.sin((secondAngle - 90) * Math.PI / 180)}
            stroke="rgb(52 211 153)" strokeWidth="1" strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 6px rgb(52 211 153))' }}
          />
          {/* Center */}
          <circle cx="35" cy="35" r="3" fill="rgb(16 185 129)" style={{ filter: 'drop-shadow(0 0 6px rgb(16 185 129))' }} />
        </svg>
      </div>
      {/* STRATA label */}
      <div className="absolute bottom-1 left-0 right-0 text-center">
        <span 
          className="text-[7px] tracking-[0.2em] text-emerald-500/70 uppercase"
          style={{ textShadow: '0 0 4px rgba(16,185,129,0.5)' }}
        >
          STRATA
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MATERIAL SWATCH COMPONENT
// ═══════════════════════════════════════════════════════════════
const MaterialSwatch = ({ 
  name, 
  description, 
  gradient, 
  isHero = false 
}: { 
  name: string; 
  description: string; 
  gradient: string; 
  isHero?: boolean;
}) => (
  <div className={`group relative ${isHero ? 'col-span-2 row-span-2' : ''}`}>
    <div 
      className={`${isHero ? 'h-48' : 'h-24'} w-full rounded-sm overflow-hidden border border-zinc-800/50 transition-all duration-300 group-hover:border-emerald-500/30`}
      style={{ background: gradient }}
    />
    <div className="mt-3">
      <p className="text-xs font-medium text-zinc-300">{name}</p>
      <p className="text-[10px] text-zinc-600">{description}</p>
    </div>
    {isHero && (
      <div className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-[8px] text-emerald-400 uppercase tracking-widest">
        Hero
      </div>
    )}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN LANDING PAGE
// ═══════════════════════════════════════════════════════════════
const Apex1Landing = () => {
  const navigate = useNavigate();
  const [activeFinish, setActiveFinish] = useState<'carbon' | 'marble' | 'titanium'>('carbon');

  const finishes = {
    carbon: { 
      name: 'Carbon Fiber', 
      bg: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
      accent: 'rgba(16,185,129,0.4)'
    },
    marble: { 
      name: 'Italian Marble', 
      bg: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 30%, #f8f8f8 60%, #e5e5e5 100%)',
      accent: 'rgba(16,185,129,0.3)'
    },
    titanium: { 
      name: 'Brushed Titanium', 
      bg: 'linear-gradient(135deg, #6b7280 0%, #4b5563 50%, #6b7280 100%)',
      accent: 'rgba(16,185,129,0.5)'
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ═══════════════════════════════════════════════════════
          HEADER - Minimal, architectural
          ═══════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xs tracking-[0.4em] text-zinc-500 uppercase hover:text-zinc-300 transition-colors">
            ← Back
          </Link>
          <div className="text-center">
            <span className="text-[10px] tracking-[0.5em] text-zinc-600 uppercase">LAVANDAR</span>
            <span className="mx-2 text-zinc-800">•</span>
            <span className="text-[10px] tracking-[0.3em] text-emerald-500/80 uppercase">Performance Division</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="text-[10px] tracking-widest uppercase border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
            onClick={() => navigate('/dj-table')}
          >
            Configure
          </Button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          HERO - Shot #1: 3/4 view, dark room, emerald edge glow
          ═══════════════════════════════════════════════════════ */}
      <section className="min-h-screen pt-20 flex flex-col justify-center relative overflow-hidden">
        {/* Layered dark background - not flat black */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.03)_0%,_transparent_70%)]" />
        
        {/* Emerald underglow - engineered diffusion */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center bottom, rgba(16,185,129,0.4) 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Product Visualization */}
            <div className="relative aspect-[4/3] flex items-center justify-center">
              {/* The console - 3/4 angle */}
              <div 
                className="relative"
                style={{
                  transform: 'perspective(1200px) rotateX(12deg) rotateY(-18deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Main deck */}
                <div 
                  className="relative w-96 h-56 rounded-sm shadow-2xl"
                  style={{ 
                    background: finishes[activeFinish].bg,
                    boxShadow: `0 40px 80px -20px rgba(0,0,0,0.8), 0 0 60px -10px ${finishes[activeFinish].accent}`
                  }}
                >
                  {/* Edge LED strips - emerald glow */}
                  <div 
                    className="absolute inset-x-0 top-0 h-[2px]"
                    style={{ 
                      background: 'linear-gradient(90deg, transparent 0%, #10b981 20%, #10b981 80%, transparent 100%)',
                      boxShadow: '0 0 20px 2px rgba(16,185,129,0.6), 0 0 40px 4px rgba(16,185,129,0.3)'
                    }}
                  />
                  <div 
                    className="absolute inset-x-0 bottom-0 h-[2px]"
                    style={{ 
                      background: 'linear-gradient(90deg, transparent 0%, #10b981 20%, #10b981 80%, transparent 100%)',
                      boxShadow: '0 0 20px 2px rgba(16,185,129,0.6), 0 0 40px 4px rgba(16,185,129,0.3)'
                    }}
                  />
                  
                  {/* Turntable mounts */}
                  <div className="absolute top-8 left-8 w-24 h-24 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-zinc-700" />
                    </div>
                  </div>
                  <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-zinc-700" />
                    </div>
                  </div>
                  
                  {/* Center console with STRATA displays */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-3">
                    <StrataDisplay variant="dial" />
                    {/* Mixer section */}
                    <div className="w-28 h-20 bg-zinc-950 rounded border border-zinc-800 flex items-end justify-center gap-1.5 pb-2 px-2">
                      {[8, 12, 6, 14, 9, 11, 7].map((h, i) => (
                        <div 
                          key={i}
                          className="w-1.5 rounded-full"
                          style={{ 
                            height: `${h * 4}px`,
                            background: `linear-gradient(to top, #10b981, rgba(16,185,129,0.2))`,
                            boxShadow: '0 0 4px rgba(16,185,129,0.4)'
                          }}
                        />
                      ))}
                    </div>
                    <StrataDisplay variant="status" />
                  </div>
                </div>
                
                {/* Legs */}
                <div 
                  className="absolute -bottom-16 left-6 w-3 h-16 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded"
                  style={{ transform: 'translateZ(-20px)' }}
                />
                <div 
                  className="absolute -bottom-16 right-6 w-3 h-16 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded"
                  style={{ transform: 'translateZ(-20px)' }}
                />
              </div>
            </div>

            {/* Copy */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] tracking-[0.4em] text-zinc-600 uppercase">Performance Series</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] tracking-widest text-emerald-400 uppercase">STRATA Live</span>
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-extralight tracking-tight">
                  APEX<span className="text-zinc-600">-1</span>
                </h1>
                <p className="text-lg text-zinc-500 font-light leading-relaxed max-w-md">
                  The definitive professional DJ console. Engineered for precision. Built for permanence. With integrated weather intelligence.
                </p>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-light">$47,500</span>
                <span className="text-sm text-zinc-600">USD</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="px-8 py-6 bg-zinc-100 text-zinc-950 hover:bg-white text-sm tracking-widest uppercase"
                  onClick={() => navigate('/dj-table')}
                >
                  Configure Your Unit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  className="px-8 py-6 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 text-sm tracking-widest uppercase"
                >
                  View Specs
                </Button>
              </div>

              <p className="text-xs text-zinc-600">
                12-16 week lead time • $1,800 refundable deposit • Limited to 50 units annually
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600">
          <span className="text-[10px] tracking-widest uppercase">Explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STRATA INTELLIGENCE - Operational command center
          ═══════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/30 to-zinc-950" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
              <Eye className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] tracking-widest text-emerald-400 uppercase">Weather Intelligence</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight mb-4">STRATA Integration</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              Real-time atmospheric monitoring for outdoor performances. Know your operational window before you drop the first beat.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* GIG GO/HOLD Card */}
            <div className="p-8 bg-zinc-900/50 border border-zinc-800/50 rounded-sm backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-3 h-3 rounded-full bg-emerald-500"
                  style={{ boxShadow: '0 0 12px rgba(16,185,129,0.8)' }}
                />
                <span className="text-sm font-mono tracking-widest text-emerald-400">GIG GO</span>
              </div>
              <p className="text-sm text-zinc-500 mb-4">
                All atmospheric conditions within safe operating parameters. Wind gusts under threshold, no precipitation risk.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-600">
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Wind &lt;25kt</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Precip 0%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Humidity &lt;70%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Lightning Clear</span>
                </div>
              </div>
            </div>

            {/* Metrics Card */}
            <div className="p-8 bg-zinc-900/50 border border-zinc-800/50 rounded-sm backdrop-blur-sm">
              <h3 className="text-xs tracking-widest text-zinc-500 uppercase mb-6">Live Metrics</h3>
              <div className="space-y-4">
                {[
                  { icon: Wind, label: 'Wind Speed', value: '12 kt', threshold: '25 kt', pct: 48 },
                  { icon: Droplets, label: 'Humidity', value: '45%', threshold: '70%', pct: 64 },
                  { icon: Gauge, label: 'Pressure', value: '1013 mb', threshold: 'Stable', pct: 100 },
                  { icon: Thermometer, label: 'Temperature', value: '72°F', threshold: 'Optimal', pct: 85 },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <m.icon className="w-3 h-3" />
                        <span>{m.label}</span>
                      </div>
                      <span className="text-emerald-400 font-mono">{m.value}</span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                        style={{ width: `${m.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Forecast Card */}
            <div className="p-8 bg-zinc-900/50 border border-zinc-800/50 rounded-sm backdrop-blur-sm">
              <h3 className="text-xs tracking-widest text-zinc-500 uppercase mb-6">Set Window Forecast</h3>
              <div className="space-y-3">
                {['6PM', '7PM', '8PM', '9PM', '10PM', '11PM'].map((time, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-zinc-600 w-10">{time}</span>
                    <div className="flex-1 h-4 bg-zinc-800/50 rounded-sm flex items-center px-1">
                      <div 
                        className={`h-2 rounded-sm ${i < 5 ? 'bg-emerald-500/60' : 'bg-amber-500/60'}`}
                        style={{ 
                          width: i < 5 ? '100%' : '60%',
                          boxShadow: i < 5 ? '0 0 4px rgba(16,185,129,0.4)' : '0 0 4px rgba(245,158,11,0.4)'
                        }}
                      />
                    </div>
                    <span className={`text-[10px] font-mono ${i < 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {i < 5 ? 'GO' : 'HOLD'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MATERIALS LIBRARY - Tactile contrast showcase
          ═══════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full mb-6">
              <Layers className="w-3 h-3 text-zinc-400" />
              <span className="text-[10px] tracking-widest text-zinc-400 uppercase">Materials Library</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight mb-4">Tactile Precision</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Hero finishes meet sustainable accents. Matte against polished. Soft-touch against glass.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <MaterialSwatch 
              name="Matte Carbon Fiber"
              description="Aerospace-grade, main deck"
              gradient="linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)"
              isHero
            />
            <MaterialSwatch 
              name="Brushed Titanium"
              description="Edges, trims, bezels"
              gradient="linear-gradient(135deg, #6b7280 0%, #4b5563 50%, #6b7280 100%)"
            />
            <MaterialSwatch 
              name="Italian Marble"
              description="Inlay strips, accent plates"
              gradient="linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 30%, #f8f8f8 100%)"
            />
            <MaterialSwatch 
              name="Recycled Rubber Terrazzo"
              description="Hand-rest zones, cable covers"
              gradient="linear-gradient(135deg, #374151 0%, #1f2937 30%, #374151 50%, #10b981 51%, #374151 52%, #1f2937 100%)"
            />
            <MaterialSwatch 
              name="Anodized Aluminum"
              description="Control bezels, hardware"
              gradient="linear-gradient(135deg, #9ca3af 0%, #6b7280 50%, #9ca3af 100%)"
            />
            <MaterialSwatch 
              name="Black Walnut"
              description="Optional warm accent"
              gradient="linear-gradient(135deg, #78350f 0%, #451a03 50%, #78350f 100%)"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CONFIGURATOR PREVIEW - Finish swap demo
          ═══════════════════════════════════════════════════════ */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight mb-4">Your Configuration</h2>
            <p className="text-zinc-500">Switch finishes to preview. Same lighting, different character.</p>
          </div>

          {/* Finish selector */}
          <div className="flex justify-center gap-4 mb-12">
            {(['carbon', 'marble', 'titanium'] as const).map((finish) => (
              <button
                key={finish}
                onClick={() => setActiveFinish(finish)}
                className={`px-6 py-3 text-xs tracking-widest uppercase transition-all rounded-sm ${
                  activeFinish === finish 
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400' 
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {finishes[finish].name}
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="relative aspect-[16/9] max-w-3xl mx-auto rounded-sm overflow-hidden border border-zinc-800">
            <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center">
              {/* Underglow */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2"
                style={{
                  background: `radial-gradient(ellipse at center bottom, ${finishes[activeFinish].accent} 0%, transparent 70%)`,
                  filter: 'blur(40px)',
                  opacity: 0.5
                }}
              />
              
              {/* Simplified deck preview */}
              <div 
                className="relative w-80 h-16 rounded-sm transition-all duration-500"
                style={{ 
                  background: finishes[activeFinish].bg,
                  boxShadow: `0 20px 40px -10px rgba(0,0,0,0.8), 0 0 40px -5px ${finishes[activeFinish].accent}`
                }}
              >
                <div 
                  className="absolute inset-x-0 bottom-0 h-[2px]"
                  style={{ 
                    background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
                    boxShadow: '0 0 12px rgba(16,185,129,0.6)'
                  }}
                />
              </div>
            </div>
            
            {/* Label */}
            <div className="absolute bottom-4 left-4 text-xs text-zinc-600">
              {finishes[activeFinish].name} • Same lighting conditions
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ENGINEERING - Non-negotiables
          ═══════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 bg-zinc-900/30 border-y border-zinc-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extralight tracking-tight mb-4">Engineering Excellence</h2>
            <p className="text-zinc-500">Instrument-grade precision. Heirloom durability.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Military-Spec Durability', desc: 'MIL-STD-810G tested. ATA-rated touring optional. 15-minute modular assembly.' },
              { icon: Zap, title: 'Clean Power Delivery', desc: 'Isolated power rails, surge protection, hidden cable management throughout.' },
              { icon: Gauge, title: 'Active Thermal Management', desc: 'Maintains optimal equipment temperature during extended 12-hour sets.' },
            ].map((f, i) => (
              <div key={i} className="p-8 border border-zinc-800/50 rounded-sm group hover:border-emerald-500/30 transition-colors">
                <f.icon className="w-8 h-8 text-zinc-600 group-hover:text-emerald-400 transition-colors mb-6" />
                <h3 className="text-lg font-light mb-3">{f.title}</h3>
                <p className="text-sm text-zinc-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA - Reserve
          ═══════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/20 to-zinc-950" />
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
        
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.5em] text-zinc-600 uppercase mb-6">Limited Production</p>
          <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-6">
            Claim Your Position
          </h2>
          <p className="text-zinc-500 mb-10">
            50 units per year. $1,800 refundable deposit secures your slot. 12-16 week lead time.
          </p>
          <Button 
            className="px-12 py-6 bg-zinc-100 text-zinc-950 hover:bg-white text-sm tracking-widest uppercase"
            onClick={() => navigate('/allocation-checkout?type=deposit')}
          >
            Reserve Now — $1,800 Deposit
          </Button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════ */}
      <footer className="py-12 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-[0.3em] text-zinc-700 uppercase">
            LAVANDAR Tech • Performance Division • STRATA Integrated
          </p>
          <div className="flex gap-6 text-[10px] text-zinc-600">
            <Link to="/dj-table" className="hover:text-zinc-400 transition-colors">Full Specs</Link>
            <Link to="/allocation-checkout?type=deposit" className="hover:text-zinc-400 transition-colors">Reserve</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Apex1Landing;