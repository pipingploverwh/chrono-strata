import { useEffect, useState } from "react";

interface WatchDialProps {
  bezelActive: boolean;
  lumeMode: boolean;
  lumeIntensity?: number;
}

const WatchDial = ({ bezelActive, lumeMode, lumeIntensity = 70 }: WatchDialProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = hours * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6;

  // Hour markers
  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const isCardinal = i % 3 === 0;
    const innerRadius = isCardinal ? 72 : 76;
    const outerRadius = 82;
    
    return {
      x1: 100 + Math.cos(angle) * innerRadius,
      y1: 100 + Math.sin(angle) * innerRadius,
      x2: 100 + Math.cos(angle) * outerRadius,
      y2: 100 + Math.sin(angle) * outerRadius,
      isCardinal,
    };
  });

  // Minute markers
  const minuteMarkers = Array.from({ length: 60 }, (_, i) => {
    if (i % 5 === 0) return null;
    const angle = (i * 6 - 90) * (Math.PI / 180);
    return {
      x1: 100 + Math.cos(angle) * 80,
      y1: 100 + Math.sin(angle) * 80,
      x2: 100 + Math.cos(angle) * 82,
      y2: 100 + Math.sin(angle) * 82,
    };
  }).filter(Boolean);

  // Bezel markings (depth/time decompression)
  const bezelMarks = [
    { depth: 60, time: 60, angle: 0 },
    { depth: 80, time: 40, angle: 30 },
    { depth: 100, time: 25, angle: 60 },
    { depth: 120, time: 15, angle: 90 },
    { depth: 130, time: 10, angle: 120 },
    { depth: 150, time: 5, angle: 150 },
    { depth: 190, time: 0, angle: 180 },
  ];

  // Calculate glow intensity based on slider (20-100 maps to 0.2-1.0)
  const glowMultiplier = lumeIntensity / 100;
  const glowOpacity = (base: number) => (base * glowMultiplier).toFixed(2);
  const glowSize = (base: number) => Math.round(base * glowMultiplier);

  // Lume marker colors for night mode
  const getMarkerColor = (isCardinal: boolean) => {
    if (lumeMode) {
      return "hsl(var(--strata-lume))";
    }
    return isCardinal ? "hsl(var(--strata-white))" : "hsl(var(--strata-silver))";
  };

  const getMarkerFilter = (isCardinal: boolean) => {
    if (lumeMode && isCardinal) {
      return `drop-shadow(0 0 ${glowSize(6)}px hsla(120, 100%, 62%, ${glowOpacity(0.8)}))`;
    }
    return "none";
  };

  // Dynamic bezel glow based on intensity
  const bezelGlow = lumeMode 
    ? `0 0 ${glowSize(20)}px hsla(120, 100%, 62%, ${glowOpacity(0.6)}), 0 0 ${glowSize(40)}px hsla(120, 100%, 62%, ${glowOpacity(0.3)}), inset 0 0 ${glowSize(15)}px hsla(120, 100%, 62%, ${glowOpacity(0.2)})` 
    : `0 0 ${glowSize(15)}px hsla(120, 100%, 62%, ${glowOpacity(0.4)}), 0 0 ${glowSize(30)}px hsla(120, 100%, 62%, ${glowOpacity(0.2)})`;

  return (
    <div className="relative">
      {/* Outer bezel ring with lume glow */}
      <div 
        className={`absolute -inset-4 rounded-full strata-bezel transition-all duration-300 ${bezelActive ? 'opacity-100' : 'opacity-40'}`}
        style={{ boxShadow: bezelGlow }}
      >
        <svg viewBox="0 0 240 240" className="w-full h-full">
          {/* Bezel outer ring with lume glow */}
          <circle 
            cx="120" 
            cy="120" 
            r="115" 
            fill="none" 
            stroke="hsl(var(--strata-gunmetal))" 
            strokeWidth="8"
            style={{ filter: `drop-shadow(0 0 ${glowSize(8)}px hsla(120, 100%, 62%, ${glowOpacity(0.5)}))` }}
          />
          <circle 
            cx="120" 
            cy="120" 
            r="118" 
            fill="none" 
            stroke={`hsla(120, 100%, 62%, ${glowOpacity(0.3)})`}
            strokeWidth="1"
            style={{ filter: `drop-shadow(0 0 ${glowSize(6)}px hsla(120, 100%, 62%, ${glowOpacity(0.8)}))` }}
          />
          <circle cx="120" cy="120" r="108" fill="none" stroke="hsl(var(--strata-steel))" strokeWidth="2" />
          
          {bezelActive && bezelMarks.map((mark, i) => {
            const rad = (mark.angle - 90) * (Math.PI / 180);
            const x = 120 + Math.cos(rad) * 103;
            const y = 120 + Math.sin(rad) * 103;
            return (
              <g key={i}>
                <text
                  x={x}
                  y={y - 6}
                  textAnchor="middle"
                  className={`text-[8px] font-instrument font-bold ${lumeMode ? 'fill-strata-lume' : 'fill-strata-orange'}`}
                  style={lumeMode ? { filter: `drop-shadow(0 0 ${glowSize(4)}px hsla(120, 100%, 62%, ${glowOpacity(0.8)}))` } : {}}
                >
                  {mark.depth}'
                </text>
                <text
                  x={x}
                  y={y + 6}
                  textAnchor="middle"
                  className={`text-[6px] font-mono ${lumeMode ? 'fill-strata-lume/60' : 'fill-strata-silver'}`}
                >
                  {mark.time}m
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Main dial */}
      <div className={`relative w-[200px] h-[200px] rounded-full transition-all duration-500 ${
        lumeMode 
          ? 'bg-gradient-radial from-strata-charcoal/50 to-strata-black shadow-[0_0_80px_rgba(0,0,0,0.95),inset_0_0_50px_rgba(0,0,0,0.8)]' 
          : 'strata-dial'
      }`}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Crosshair pattern */}
          <line x1="100" y1="20" x2="100" y2="50" stroke={lumeMode ? "hsl(var(--strata-lume))" : "hsl(var(--strata-orange))"} strokeWidth="1" opacity={lumeMode ? "0.4" : "0.6"} />
          <line x1="100" y1="150" x2="100" y2="180" stroke={lumeMode ? "hsl(var(--strata-lume))" : "hsl(var(--strata-orange))"} strokeWidth="1" opacity={lumeMode ? "0.4" : "0.6"} />
          <line x1="20" y1="100" x2="50" y2="100" stroke={lumeMode ? "hsl(var(--strata-lume))" : "hsl(var(--strata-orange))"} strokeWidth="1" opacity={lumeMode ? "0.4" : "0.6"} />
          <line x1="150" y1="100" x2="180" y2="100" stroke={lumeMode ? "hsl(var(--strata-lume))" : "hsl(var(--strata-orange))"} strokeWidth="1" opacity={lumeMode ? "0.4" : "0.6"} />
          
          {/* Hour markers */}
          {hourMarkers.map((marker, i) => (
            <line
              key={`hour-${i}`}
              x1={marker.x1}
              y1={marker.y1}
              x2={marker.x2}
              y2={marker.y2}
              stroke={getMarkerColor(marker.isCardinal)}
              strokeWidth={marker.isCardinal ? 3 : 2}
              strokeLinecap="round"
              style={{ filter: getMarkerFilter(marker.isCardinal) }}
            />
          ))}
          
          {/* Minute markers */}
          {minuteMarkers.map((marker, i) => (
            marker && (
              <line
                key={`minute-${i}`}
                x1={marker.x1}
                y1={marker.y1}
                x2={marker.x2}
                y2={marker.y2}
                stroke={lumeMode ? "hsla(120, 100%, 62%, 0.2)" : "hsl(var(--strata-gunmetal))"}
                strokeWidth="1"
              />
            )
          ))}

          {/* STRATA branding */}
          <text 
            x="100" 
            y="58" 
            textAnchor="middle" 
            className={`text-[14px] font-instrument font-bold tracking-widest ${lumeMode ? 'fill-strata-lume' : 'fill-strata-white'}`}
            style={lumeMode ? { filter: `drop-shadow(0 0 ${glowSize(8)}px hsla(120, 100%, 62%, ${glowOpacity(0.8)}))` } : {}}
          >
            STRATA
          </text>
          <text 
            x="100" 
            y="70" 
            textAnchor="middle" 
            className={`text-[7px] font-mono tracking-wider ${lumeMode ? 'fill-strata-lume/50' : 'fill-strata-silver'}`}
          >
            automatic
          </text>

          {/* Date window */}
          <rect 
            x="148" 
            y="93" 
            width="22" 
            height="14" 
            rx="2" 
            fill={lumeMode ? "hsl(0, 0%, 3%)" : "hsl(var(--strata-charcoal))"} 
            stroke={lumeMode ? "hsla(120, 100%, 62%, 0.3)" : "hsl(var(--strata-gunmetal))"} 
          />
          <text 
            x="159" 
            y="103" 
            textAnchor="middle" 
            className={`text-[9px] font-mono font-bold ${lumeMode ? 'fill-strata-lume' : 'fill-strata-white'}`}
            style={lumeMode ? { filter: `drop-shadow(0 0 ${glowSize(4)}px hsla(120, 100%, 62%, ${glowOpacity(0.8)}))` } : {}}
          >
            11
          </text>

          {/* SUB 200T label */}
          <text 
            x="100" 
            y="140" 
            textAnchor="middle" 
            className={`text-[8px] font-instrument font-semibold tracking-wide ${lumeMode ? 'fill-strata-lume/60' : 'fill-strata-silver'}`}
          >
            SUB 200T
          </text>
          
          {/* Location */}
          <text 
            x="100" 
            y="152" 
            textAnchor="middle" 
            className={`text-[9px] font-mono font-medium animate-lume-pulse ${lumeMode ? 'fill-strata-lume' : 'strata-lume'}`}
            style={lumeMode ? { filter: `drop-shadow(0 0 ${glowSize(10)}px hsla(120, 100%, 62%, ${glowOpacity(0.9)}))` } : {}}
          >
            Falmouth
          </text>

          {/* Hour hand */}
          <g style={{ transform: `rotate(${hourDeg}deg)`, transformOrigin: '100px 100px' }}>
            <rect 
              x="96" 
              y="55" 
              width="8" 
              height="50" 
              rx="2" 
              className={lumeMode ? '' : 'strata-hand-hour'} 
              fill={lumeMode ? "hsl(var(--strata-lume))" : undefined}
              style={lumeMode ? { filter: `drop-shadow(0 0 ${glowSize(8)}px hsla(120, 100%, 62%, ${glowOpacity(0.9)}))` } : {}}
            />
            <circle cx="100" cy="100" r="6" className="fill-strata-charcoal" />
          </g>

          {/* Minute hand */}
          <g style={{ transform: `rotate(${minuteDeg}deg)`, transformOrigin: '100px 100px' }}>
            <rect 
              x="97" 
              y="28" 
              width="6" 
              height="75" 
              rx="1" 
              className={lumeMode ? '' : 'strata-hand-minute'} 
              fill={lumeMode ? "hsl(var(--strata-lume))" : undefined}
              style={lumeMode ? { filter: `drop-shadow(0 0 ${glowSize(6)}px hsla(120, 100%, 62%, ${glowOpacity(0.8)}))` } : {}}
            />
          </g>

          {/* Second hand */}
          <g style={{ transform: `rotate(${secondDeg}deg)`, transformOrigin: '100px 100px' }}>
            <line x1="100" y1="115" x2="100" y2="30" stroke="hsl(var(--strata-lume))" strokeWidth="1.5" style={{ filter: `drop-shadow(0 0 ${glowSize(6)}px hsla(120, 100%, 62%, ${glowOpacity(0.8)}))` }} />
            <circle cx="100" cy="30" r="3" className="fill-strata-lume" style={{ filter: `drop-shadow(0 0 ${glowSize(8)}px hsla(120, 100%, 62%, ${glowOpacity(0.9)}))` }} />
            <circle cx="100" cy="100" r="4" className="fill-strata-lume" />
          </g>

          {/* Center pinion */}
          <circle 
            cx="100" 
            cy="100" 
            r="3" 
            fill="hsl(var(--strata-charcoal))" 
            stroke={lumeMode ? "hsl(var(--strata-lume))" : "hsl(var(--strata-orange))"} 
            strokeWidth="1" 
          />
        </svg>
      </div>
    </div>
  );
};

export default WatchDial;
