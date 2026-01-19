import { useEffect, useState } from 'react';
import { Thermometer, Activity, Zap, Wind, Timer } from 'lucide-react';

interface StrataEmbeddedDisplayProps {
  temperature: number;
  spectralEnergy: number;
  bpm: number;
  isPlaying: boolean;
  displayId: 'left' | 'center' | 'right';
}

// Temperature to color gradient for STRATA displays
const getThermalGlow = (temp: number): { primary: string; glow: string; intensity: number } => {
  const normalized = (temp + 15) / 100; // -15 to 85 range
  
  if (normalized < 0.3) {
    return {
      primary: 'hsl(200, 90%, 50%)',
      glow: 'hsla(200, 90%, 50%, 0.6)',
      intensity: 0.3 + normalized,
    };
  } else if (normalized < 0.5) {
    return {
      primary: 'hsl(160, 85%, 45%)',
      glow: 'hsla(160, 85%, 45%, 0.6)',
      intensity: 0.5 + normalized * 0.3,
    };
  } else if (normalized < 0.7) {
    return {
      primary: 'hsl(45, 90%, 50%)',
      glow: 'hsla(45, 90%, 50%, 0.6)',
      intensity: 0.6 + normalized * 0.3,
    };
  } else {
    return {
      primary: 'hsl(15, 95%, 50%)',
      glow: 'hsla(15, 95%, 50%, 0.7)',
      intensity: 0.8 + normalized * 0.2,
    };
  }
};

const StrataEmbeddedDisplay = ({ 
  temperature, 
  spectralEnergy, 
  bpm, 
  isPlaying,
  displayId 
}: StrataEmbeddedDisplayProps) => {
  const [time, setTime] = useState(new Date());
  const [pulsePhase, setPulsePhase] = useState(0);
  
  const thermal = getThermalGlow(temperature);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const pulse = setInterval(() => {
        setPulsePhase(p => (p + 1) % 360);
      }, 50);
      return () => clearInterval(pulse);
    }
  }, [isPlaying]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const renderLeftDisplay = () => (
    <div className="h-full flex flex-col justify-between p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-mono tracking-wider opacity-60">STRATA-L</span>
        <div 
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ 
            backgroundColor: thermal.primary,
            boxShadow: `0 0 8px ${thermal.glow}`,
          }}
        />
      </div>
      
      {/* Time */}
      <div className="text-center">
        <div 
          className="text-xl font-mono font-bold tracking-wider"
          style={{ 
            color: thermal.primary,
            textShadow: `0 0 20px ${thermal.glow}`,
          }}
        >
          {formatTime(time)}
        </div>
        <div className="text-[8px] font-mono opacity-50 mt-1">LOCAL TIME</div>
      </div>

      {/* Thermal bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[7px] font-mono opacity-60">
          <span>DECK TEMP</span>
          <span style={{ color: thermal.primary }}>{temperature.toFixed(1)}°C</span>
        </div>
        <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-150"
            style={{ 
              width: `${Math.max(0, Math.min(100, (temperature + 15) / 100 * 100))}%`,
              background: `linear-gradient(90deg, hsl(200, 90%, 50%), ${thermal.primary})`,
              boxShadow: `0 0 10px ${thermal.glow}`,
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderCenterDisplay = () => (
    <div className="h-full flex flex-col justify-between p-3">
      {/* Header with status */}
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-mono tracking-wider opacity-60">STRATA-CORE</span>
        <div className="flex items-center gap-1">
          <span 
            className="text-[8px] font-mono font-bold"
            style={{ color: thermal.primary }}
          >
            {isPlaying ? 'ACTIVE' : 'STANDBY'}
          </span>
        </div>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center">
          <div className="text-[7px] font-mono opacity-50 mb-1">BPM</div>
          <div 
            className="text-2xl font-mono font-bold"
            style={{ 
              color: thermal.primary,
              textShadow: `0 0 15px ${thermal.glow}`,
            }}
          >
            {bpm || '---'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[7px] font-mono opacity-50 mb-1">ENERGY</div>
          <div 
            className="text-2xl font-mono font-bold"
            style={{ 
              color: thermal.primary,
              textShadow: `0 0 15px ${thermal.glow}`,
            }}
          >
            {(spectralEnergy * 100).toFixed(0)}
          </div>
        </div>
      </div>

      {/* Waveform visualization */}
      <div className="h-6 flex items-end justify-center gap-0.5">
        {Array.from({ length: 16 }).map((_, i) => {
          const height = isPlaying 
            ? 20 + Math.sin((pulsePhase + i * 20) * Math.PI / 180) * 60 + spectralEnergy * 20
            : 10;
          return (
            <div
              key={i}
              className="w-1 rounded-full transition-all duration-75"
              style={{
                height: `${Math.max(4, height)}%`,
                backgroundColor: thermal.primary,
                boxShadow: `0 0 4px ${thermal.glow}`,
                opacity: 0.6 + (height / 100) * 0.4,
              }}
            />
          );
        })}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between text-[7px] font-mono">
        <span className="opacity-50">THERMAL</span>
        <div className="flex items-center gap-2">
          <Thermometer 
            className="w-3 h-3" 
            style={{ color: thermal.primary }}
          />
          <span style={{ color: thermal.primary }}>{temperature.toFixed(1)}°C</span>
        </div>
      </div>
    </div>
  );

  const renderRightDisplay = () => (
    <div className="h-full flex flex-col justify-between p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-mono tracking-wider opacity-60">STRATA-R</span>
        <div className="flex items-center gap-1">
          <Zap 
            className="w-3 h-3" 
            style={{ 
              color: thermal.primary,
              filter: isPlaying ? `drop-shadow(0 0 4px ${thermal.glow})` : 'none',
            }}
          />
        </div>
      </div>

      {/* Circular gauge */}
      <div className="relative w-16 h-16 mx-auto">
        <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
          {/* Background arc */}
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
            strokeDasharray="176"
            strokeDashoffset="44"
          />
          {/* Value arc */}
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke={thermal.primary}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="176"
            strokeDashoffset={176 - (132 * Math.min(1, (temperature + 15) / 100))}
            style={{
              filter: `drop-shadow(0 0 6px ${thermal.glow})`,
              transition: 'stroke-dashoffset 0.15s ease-out',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className="text-sm font-mono font-bold"
            style={{ color: thermal.primary }}
          >
            {temperature.toFixed(0)}°
          </span>
        </div>
      </div>

      {/* Material state */}
      <div className="text-center">
        <div className="text-[7px] font-mono opacity-50 mb-1">MATERIAL STATE</div>
        <div 
          className="text-[10px] font-mono font-bold uppercase"
          style={{ 
            color: thermal.primary,
            textShadow: `0 0 8px ${thermal.glow}`,
          }}
        >
          {temperature < 5 ? 'CRYOGENIC' : 
           temperature < 25 ? 'NOMINAL' : 
           temperature < 50 ? 'ELEVATED' : 
           temperature < 70 ? 'HIGH THERMAL' : 'CRITICAL'}
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="relative rounded-lg overflow-hidden border transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.95) 100%)',
        borderColor: `${thermal.primary}40`,
        boxShadow: `
          0 0 20px ${thermal.glow},
          inset 0 0 30px rgba(0,0,0,0.8),
          inset 0 1px 0 rgba(255,255,255,0.05)
        `,
      }}
    >
      {/* Bezel effect */}
      <div 
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)`,
        }}
      />
      
      {/* Emerald halo glow */}
      <div 
        className="absolute -inset-1 rounded-xl pointer-events-none opacity-50 blur-md transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at center, ${thermal.glow} 0%, transparent 70%)`,
          opacity: isPlaying ? thermal.intensity * 0.6 : 0.2,
        }}
      />

      {/* Display content */}
      <div className="relative z-10 h-32 text-white">
        {displayId === 'left' && renderLeftDisplay()}
        {displayId === 'center' && renderCenterDisplay()}
        {displayId === 'right' && renderRightDisplay()}
      </div>

      {/* Scan line effect */}
      {isPlaying && (
        <div 
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.1) 2px,
              rgba(0,0,0,0.1) 4px
            )`,
          }}
        />
      )}
    </div>
  );
};

export default StrataEmbeddedDisplay;
