import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Disc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WaveformVisualization from '@/components/strata/WaveformVisualization';
import StrataEmbeddedDisplay from '@/components/strata/StrataEmbeddedDisplay';
import NeonKanjiOverlay from '@/components/thermal/NeonKanjiOverlay';
import KatakanaRain from '@/components/thermal/KatakanaRain';
import KatakanaMarquee from '@/components/thermal/KatakanaMarquee';

interface ThermalZone {
  id: string;
  temperature: number;
}

interface SpectralData {
  low: number;
  mid: number;
  high: number;
  energy: number;
}

interface ImmersiveModeProps {
  onExit: () => void;
  onTogglePlayback: () => void;
  isPlaying: boolean;
  hasAudio: boolean;
  globalTemp: number;
  thermalZones: ThermalZone[];
  spectralData: SpectralData;
  waveformData: Uint8Array | number[];
  bpm: number | null;
  getThermalColor: (temp: number) => string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// KENGO KUMA × ARIELLE ASSOULINE-LICHTEN IMMERSIVE MODE
// Layered transparency, vertical slat rhythms, geometric precision
// ═══════════════════════════════════════════════════════════════════════════════

// AAL precision corner accent component
const CornerAccent = ({ position, color }: { position: 'tl' | 'tr' | 'bl' | 'br'; color: string }) => {
  const baseClasses = "absolute w-8 h-8 pointer-events-none";
  const positionClasses = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  };
  
  return (
    <div className={`${baseClasses} ${positionClasses[position]}`}>
      <svg viewBox="0 0 32 32" className="w-full h-full" style={{ color }}>
        {position === 'tl' && <path d="M0 0h12v1H1v11H0z" fill="currentColor" />}
        {position === 'tr' && <path d="M32 0H20v1h11v11h1z" fill="currentColor" />}
        {position === 'bl' && <path d="M0 32h12v-1H1V20H0z" fill="currentColor" />}
        {position === 'br' && <path d="M32 32H20v-1h11V20h1z" fill="currentColor" />}
      </svg>
    </div>
  );
};

// Kuma vertical slat component
const VerticalSlats = ({ count, opacity, color }: { count: number; opacity: number; color: string }) => (
  <div className="absolute inset-0 flex justify-between pointer-events-none overflow-hidden">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="w-px h-full"
        style={{ background: color, opacity }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: i * 0.02 }}
      />
    ))}
  </div>
);

// Kuma glass panel component
const GlassPanel = ({ 
  children, 
  className = "",
  thermalColor,
  intensity = 0.5
}: { 
  children: React.ReactNode; 
  className?: string;
  thermalColor: string;
  intensity?: number;
}) => (
  <motion.div
    className={`relative backdrop-blur-xl border overflow-hidden ${className}`}
    style={{
      background: `linear-gradient(135deg, hsl(270 25% 8% / ${0.7 + intensity * 0.2}) 0%, hsl(280 20% 6% / ${0.85 + intensity * 0.1}) 100%)`,
      borderColor: `${thermalColor}30`,
      boxShadow: `
        inset 0 1px 0 0 hsl(300 40% 80% / 0.05),
        0 4px 24px -4px ${thermalColor}20,
        0 0 0 1px hsl(280 30% 15% / 0.5)
      `,
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </motion.div>
);

// Ruled surface line decoration (AAL)
const RuledSurface = ({ segments, color }: { segments: number; color: string }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {Array.from({ length: segments }).map((_, i) => {
      const angle = (i / segments) * 15;
      return (
        <div
          key={i}
          className="absolute h-px w-[200%] left-[-50%]"
          style={{
            top: `${(i / segments) * 100}%`,
            background: `linear-gradient(90deg, transparent 0%, ${color}10 30%, ${color}20 50%, ${color}10 70%, transparent 100%)`,
            transform: `rotate(${angle}deg)`,
          }}
        />
      );
    })}
  </div>
);

const ImmersiveMode = ({
  onExit,
  onTogglePlayback,
  isPlaying,
  hasAudio,
  globalTemp,
  thermalZones,
  spectralData,
  waveformData,
  bpm,
  getThermalColor,
}: ImmersiveModeProps) => {
  const thermalColor = getThermalColor(globalTemp);
  
  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{ background: 'hsl(270 30% 4%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* ═══ KUMA LAYERED TRANSPARENCY BACKDROP ═══ */}
      <div className="absolute inset-0">
        {/* Deep thermal gradient base */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(ellipse 120% 80% at 30% 40%, ${thermalColor}15 0%, transparent 60%)`,
              `radial-gradient(ellipse 120% 80% at 70% 60%, ${thermalColor}15 0%, transparent 60%)`,
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse' }}
        />
        
        {/* Vertical slat rhythm overlay */}
        <VerticalSlats count={48} opacity={0.03} color="hsl(300 40% 80%)" />
        
        {/* Ruled surface decorative lines */}
        <RuledSurface segments={24} color={thermalColor} />
        
        {/* Waveform visualization layer */}
        <div className="absolute inset-0 opacity-60">
          <WaveformVisualization
            waveformData={Array.isArray(waveformData) ? waveformData : Array.from(waveformData)}
            temperature={globalTemp}
            isPlaying={isPlaying}
            getThermalColor={getThermalColor}
          />
        </div>
        
        {/* Katakana Rain Effect - Beat-synced falling characters */}
        <KatakanaRain
          spectralData={{
            bass: spectralData.low / 100,
            lowMid: spectralData.mid / 100,
            mid: spectralData.mid / 100,
            highMid: spectralData.high / 100,
            treble: spectralData.high / 100
          }}
          isPlaying={isPlaying}
          getThermalColor={getThermalColor}
        />
        
        {/* Neon Kanji Overlay - Tokyo nightclub atmosphere */}
        <NeonKanjiOverlay
          spectralData={spectralData}
          isPlaying={isPlaying}
          getThermalColor={getThermalColor}
          temperature={globalTemp}
        />
        
        {/* Ambient thermal particles with glass blur */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-sm"
              style={{
                left: `${10 + (i * 5.5) % 80}%`,
                top: `${15 + (i * 7) % 70}%`,
                width: `${4 + spectralData.energy * 12}px`,
                height: `${4 + spectralData.energy * 12}px`,
                background: getThermalColor(globalTemp + (i % 8) - 4),
                boxShadow: `0 0 ${20 + spectralData.energy * 25}px ${thermalColor}`,
                opacity: 0.2 + spectralData.energy * 0.4,
              }}
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>

      {/* ═══ TOP CONTROL BAR - AAL GEOMETRIC PRECISION ═══ */}
      <GlassPanel 
        className="relative z-50 mx-4 mt-4 rounded-xl"
        thermalColor={thermalColor}
        intensity={0.7}
      >
        <CornerAccent position="tl" color={`${thermalColor}60`} />
        <CornerAccent position="tr" color={`${thermalColor}60`} />
        
        <div className="relative px-6 py-4 flex items-center justify-between">
          {/* Left: Exit + Brand */}
          <div className="flex items-center gap-4">
            <Button
              onClick={onExit}
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-lg border transition-all hover:scale-105"
              style={{ 
                background: 'hsl(280 25% 10% / 0.8)', 
                borderColor: `${thermalColor}40`,
              }}
            >
              <X className="w-5 h-5" style={{ color: thermalColor }} />
            </Button>
            <div className="hidden sm:flex flex-col">
              <span 
                className="text-xs tracking-[0.4em] font-light"
                style={{ color: `${thermalColor}90` }}
              >
                THERMAL RESONANCE
              </span>
              <span 
                className="text-[10px] tracking-[0.2em] mt-0.5"
                style={{ color: 'hsl(280 20% 45%)' }}
              >
                IMMERSIVE MODE
              </span>
            </div>
          </div>
          
          {/* Center: Keyboard hints */}
          <div className="hidden md:flex items-center gap-4 text-xs" style={{ color: 'hsl(280 20% 50%)' }}>
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 rounded border text-[10px]" style={{ 
                background: 'hsl(280 25% 12%)', 
                borderColor: 'hsl(280 30% 25%)',
                color: 'hsl(300 30% 70%)'
              }}>ESC</kbd>
              exit
            </span>
            <span className="w-px h-4" style={{ background: 'hsl(280 30% 25%)' }} />
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 rounded border text-[10px]" style={{ 
                background: 'hsl(280 25% 12%)', 
                borderColor: 'hsl(280 30% 25%)',
                color: 'hsl(300 30% 70%)'
              }}>SPACE</kbd>
              play/pause
            </span>
          </div>
          
          {/* Right: Play + Temperature */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onTogglePlayback}
              disabled={!hasAudio}
              className="w-12 h-12 rounded-xl disabled:opacity-40 transition-all hover:scale-105"
              style={{ 
                background: `linear-gradient(135deg, hsl(280 50% 40%) 0%, ${thermalColor} 100%)`,
                boxShadow: `0 0 24px ${thermalColor}50`,
              }}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>
            
            <div 
              className="relative px-5 py-3 rounded-xl border overflow-hidden"
              style={{ 
                background: 'hsl(280 25% 8% / 0.9)', 
                borderColor: `${thermalColor}50`,
              }}
            >
              <VerticalSlats count={8} opacity={0.1} color={thermalColor} />
              <span 
                className="relative z-10 font-mono text-xl font-bold tabular-nums"
                style={{ color: thermalColor }}
              >
                {globalTemp.toFixed(1)}°
              </span>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* ═══ MAIN VISUALIZATION AREA ═══ */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8">
        {/* Portrait Layout */}
        <div className="portrait:flex portrait:flex-col portrait:gap-4 portrait:w-full portrait:max-w-lg portrait:h-full portrait:max-h-[80vh] portrait:justify-center landscape:hidden">
          {/* STRATA Displays Row */}
          <div className="flex gap-3 justify-center">
            {(['left', 'center', 'right'] as const).map((displayId, idx) => (
              <GlassPanel
                key={displayId}
                className="flex-1 max-w-[120px] rounded-xl p-2"
                thermalColor={thermalColor}
                intensity={0.4}
              >
                <StrataEmbeddedDisplay
                  temperature={thermalZones[idx]?.temperature || globalTemp}
                  spectralEnergy={spectralData.energy}
                  bpm={bpm}
                  isPlaying={isPlaying}
                  displayId={displayId}
                />
              </GlassPanel>
            ))}
          </div>
          
          {/* Central Thermal Console */}
          <GlassPanel 
            className="flex-1 min-h-[180px] rounded-2xl"
            thermalColor={thermalColor}
            intensity={0.6}
          >
            <CornerAccent position="tl" color={thermalColor} />
            <CornerAccent position="tr" color={thermalColor} />
            <CornerAccent position="bl" color={thermalColor} />
            <CornerAccent position="br" color={thermalColor} />
            
            <VerticalSlats count={24} opacity={0.04} color={thermalColor} />
            
            <div className="absolute inset-3 flex flex-col gap-2">
              {thermalZones.slice(0, 3).map((zone, idx) => (
                <motion.div 
                  key={zone.id}
                  className="flex-1 rounded-xl flex items-center justify-center overflow-hidden relative"
                  style={{
                    background: `linear-gradient(135deg, ${getThermalColor(zone.temperature)}40 0%, ${getThermalColor(zone.temperature)}20 100%)`,
                    boxShadow: `inset 0 0 30px ${getThermalColor(zone.temperature)}20`,
                    borderWidth: 1,
                    borderColor: `${getThermalColor(zone.temperature)}30`,
                  }}
                  animate={{
                    boxShadow: isPlaying 
                      ? [`inset 0 0 30px ${getThermalColor(zone.temperature)}20`, `inset 0 0 50px ${getThermalColor(zone.temperature)}40`]
                      : `inset 0 0 30px ${getThermalColor(zone.temperature)}20`,
                  }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                >
                  {zone.id.includes('deck') ? (
                    <Disc 
                      className="w-10 h-10" 
                      style={{ 
                        color: getThermalColor(zone.temperature),
                        animation: isPlaying ? 'spin 1.5s linear infinite' : 'none',
                        filter: `drop-shadow(0 0 12px ${getThermalColor(zone.temperature)})`,
                      }} 
                    />
                  ) : (
                    <span 
                      className="font-mono text-xs tracking-[0.3em]"
                      style={{ color: getThermalColor(zone.temperature) }}
                    >
                      MIXER
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </GlassPanel>
          
          {/* Spectral Bars */}
          <GlassPanel 
            className="h-16 rounded-xl"
            thermalColor={thermalColor}
            intensity={0.3}
          >
            <div className="h-full flex items-end justify-center gap-0.5 px-4 pb-2">
              {Array.from({ length: 32 }).map((_, i) => {
                const segment = i < 10 ? 'low' : i < 22 ? 'mid' : 'high';
                const value = segment === 'low' ? spectralData.low : segment === 'mid' ? spectralData.mid : spectralData.high;
                const height = Math.max(10, value * 0.85);
                return (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full"
                    style={{
                      height: `${height}%`,
                      background: `linear-gradient(to top, ${getThermalColor(globalTemp - 15 + (i / 32) * 35)}80, ${getThermalColor(globalTemp + 5)})`,
                      boxShadow: `0 0 4px ${thermalColor}40`,
                    }}
                    animate={{
                      height: `${height}%`,
                    }}
                    transition={{ duration: 0.075 }}
                  />
                );
              })}
            </div>
          </GlassPanel>
        </div>

        {/* Landscape Layout */}
        <div className="hidden landscape:block relative w-full max-w-6xl">
          {/* Console Container */}
          <GlassPanel 
            className="aspect-[2.8/1] rounded-3xl overflow-hidden"
            thermalColor={thermalColor}
            intensity={0.6}
          >
            <CornerAccent position="tl" color={thermalColor} />
            <CornerAccent position="tr" color={thermalColor} />
            <CornerAccent position="bl" color={thermalColor} />
            <CornerAccent position="br" color={thermalColor} />
            
            <VerticalSlats count={64} opacity={0.03} color={thermalColor} />
            <RuledSurface segments={12} color={thermalColor} />
            
            {/* Top STRATA displays */}
            <div className="absolute top-4 left-4 right-4 flex justify-between gap-4">
              {(['left', 'center', 'right'] as const).map((displayId, idx) => (
                <GlassPanel
                  key={displayId}
                  className="flex-1 max-w-[30%] rounded-xl p-2"
                  thermalColor={thermalColor}
                  intensity={0.4}
                >
                  <StrataEmbeddedDisplay
                    temperature={thermalZones[idx]?.temperature || globalTemp}
                    spectralEnergy={spectralData.energy}
                    bpm={bpm}
                    isPlaying={isPlaying}
                    displayId={displayId}
                  />
                </GlassPanel>
              ))}
            </div>
            
            {/* Thermal zones - horizontal */}
            <div className="absolute bottom-[15%] left-4 right-4 flex gap-4 h-[40%]">
              {thermalZones.slice(0, 3).map((zone, idx) => (
                <motion.div
                  key={zone.id}
                  className="flex-1 rounded-2xl flex items-center justify-center relative overflow-hidden border"
                  style={{
                    background: `linear-gradient(180deg, ${getThermalColor(zone.temperature)}30 0%, ${getThermalColor(zone.temperature)}15 100%)`,
                    borderColor: `${getThermalColor(zone.temperature)}40`,
                    boxShadow: `
                      inset 0 0 40px ${getThermalColor(zone.temperature)}20,
                      0 0 ${20 + zone.temperature / 4}px ${getThermalColor(zone.temperature)}30
                    `,
                  }}
                  animate={{
                    boxShadow: isPlaying 
                      ? [
                          `inset 0 0 40px ${getThermalColor(zone.temperature)}20, 0 0 ${20 + zone.temperature / 4}px ${getThermalColor(zone.temperature)}30`,
                          `inset 0 0 60px ${getThermalColor(zone.temperature)}40, 0 0 ${30 + zone.temperature / 3}px ${getThermalColor(zone.temperature)}50`
                        ]
                      : `inset 0 0 40px ${getThermalColor(zone.temperature)}20, 0 0 ${20 + zone.temperature / 4}px ${getThermalColor(zone.temperature)}30`,
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                >
                  <VerticalSlats count={16} opacity={0.05} color={getThermalColor(zone.temperature)} />
                  
                  {zone.id.includes('deck') ? (
                    <Disc 
                      className="w-16 h-16" 
                      style={{ 
                        color: getThermalColor(zone.temperature),
                        animation: isPlaying ? 'spin 1.5s linear infinite' : 'none',
                        filter: `drop-shadow(0 0 16px ${getThermalColor(zone.temperature)})`,
                      }} 
                    />
                  ) : (
                    <span 
                      className="font-mono text-sm tracking-[0.4em]"
                      style={{ color: getThermalColor(zone.temperature) }}
                    >
                      MIXER
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* ═══ BOTTOM METRICS BAR ═══ */}
      <GlassPanel 
        className="relative z-50 mx-4 mb-4 rounded-xl"
        thermalColor={thermalColor}
        intensity={0.5}
      >
        <CornerAccent position="bl" color={`${thermalColor}40`} />
        <CornerAccent position="br" color={`${thermalColor}40`} />
        
        {/* Landscape: Wide spectral analyzer */}
        <div className="hidden sm:flex items-end justify-center gap-1 h-20 px-6 pt-4 pb-2">
          {Array.from({ length: 56 }).map((_, i) => {
            const segment = i < 18 ? 'low' : i < 40 ? 'mid' : 'high';
            const value = segment === 'low' ? spectralData.low : segment === 'mid' ? spectralData.mid : spectralData.high;
            const height = Math.max(6, value * (0.85 + Math.sin(i * 0.25) * 0.15));
            return (
              <motion.div
                key={i}
                className="w-1.5 rounded-full"
                style={{
                  height: `${height}%`,
                  background: `linear-gradient(to top, ${getThermalColor(globalTemp - 12 + (i / 56) * 30)}90, ${getThermalColor(globalTemp + 8)})`,
                  boxShadow: `0 0 6px ${thermalColor}30`,
                }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.075 }}
              />
            );
          })}
        </div>
        
        {/* Metrics row */}
        <div className="flex items-center justify-between px-6 py-4 text-xs sm:text-sm font-mono border-t" style={{ borderColor: `${thermalColor}15` }}>
          {/* Left metrics */}
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex flex-col">
              <span style={{ color: 'hsl(280 25% 50%)' }} className="text-[10px] tracking-wider">BPM</span>
              <span className="text-lg font-bold" style={{ color: thermalColor }}>{bpm || '—'}</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span style={{ color: 'hsl(280 25% 50%)' }} className="text-[10px] tracking-wider">ENERGY</span>
              <span className="text-lg font-bold" style={{ color: thermalColor }}>{(spectralData.energy * 100).toFixed(0)}%</span>
            </div>
          </div>
          
          {/* Right: Spectral breakdown */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex flex-col items-center">
              <span style={{ color: 'hsl(280 25% 50%)' }} className="text-[10px] tracking-wider">LOW</span>
              <span className="font-bold" style={{ color: 'hsl(270 60% 65%)' }}>{spectralData.low.toFixed(0)}%</span>
            </div>
            <div className="flex flex-col items-center">
              <span style={{ color: 'hsl(280 25% 50%)' }} className="text-[10px] tracking-wider">MID</span>
              <span className="font-bold" style={{ color: 'hsl(300 60% 70%)' }}>{spectralData.mid.toFixed(0)}%</span>
            </div>
            <div className="flex flex-col items-center">
              <span style={{ color: 'hsl(280 25% 50%)' }} className="text-[10px] tracking-wider">HIGH</span>
              <span className="font-bold" style={{ color: 'hsl(320 60% 80%)' }}>{spectralData.high.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </GlassPanel>
      
      {/* BPM-synced Katakana Marquee */}
      <KatakanaMarquee
        bpm={bpm}
        spectralEnergy={spectralData.energy}
        isPlaying={isPlaying}
        getThermalColor={getThermalColor}
        temperature={globalTemp}
      />
    </motion.div>
  );
};

export default ImmersiveMode;
