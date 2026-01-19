import { motion } from 'framer-motion';

interface PsychoacousticProps {
  spectralData: {
    low: number;
    mid: number;
    high: number;
    energy: number;
    spectralFlux: number;
    harmonicComplexity: number;
    transientSharpness: number;
    crestFactor: number;
    zeroCrossingRate: number;
  };
  temperature: number;
  isPlaying: boolean;
  getThermalColor: (temp: number) => string;
}

// Bose Psychoacoustic Engineering: Real-time visualization of audio intelligence
const PsychoacousticVisualization = ({ 
  spectralData, 
  temperature, 
  isPlaying,
  getThermalColor 
}: PsychoacousticProps) => {
  // Calculate Bose soundstage metrics
  const totalEnergy = spectralData.low + spectralData.mid + spectralData.high + 0.01;
  const subBassRatio = (spectralData.low / totalEnergy) * 100;
  const midRatio = (spectralData.mid / totalEnergy) * 100;
  const airRatio = (spectralData.high / totalEnergy) * 100;
  
  // Stereo width based on energy and spectral flux
  const stereoWidth = Math.min(100, spectralData.energy * 80 + spectralData.spectralFlux * 40);
  
  // Temperature timbre classification
  const normalizedTemp = Math.min(1, Math.max(0, (temperature + 20) / 100));
  const timbreClass = normalizedTemp > 0.7 ? 'HOT' : normalizedTemp > 0.4 ? 'WARM' : normalizedTemp > 0.15 ? 'COOL' : 'COLD';
  const timbreColor = normalizedTemp > 0.7 ? 'hsl(0 80% 50%)' : normalizedTemp > 0.4 ? 'hsl(24 100% 50%)' : normalizedTemp > 0.15 ? 'hsl(200 60% 50%)' : 'hsl(210 80% 60%)';
  
  // Dynamic response metrics
  const attackIntensity = spectralData.transientSharpness * 100;
  const decayResponse = (1 - spectralData.crestFactor) * 100;
  const noiseFloor = Math.max(0, (1 - spectralData.energy) * 100);

  return (
    <motion.div 
      className="rounded-xl border overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ 
        background: 'hsl(20 25% 6% / 0.95)', 
        borderColor: 'hsl(30 30% 15%)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: 'hsl(30 30% 15%)' }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: isPlaying ? 'hsl(120 60% 50%)' : 'hsl(30 30% 40%)' }}
          />
          <span 
            className="text-xs font-medium tracking-[0.15em] uppercase"
            style={{ color: 'hsl(24 100% 55%)' }}
          >
            Bose Psychoacoustic Engine
          </span>
        </div>
        <span 
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{ color: 'hsl(30 20% 50%)' }}
        >
          Real-Time Analysis
        </span>
      </div>

      <div className="p-4 space-y-5">
        {/* === SOUNDSTAGE ARCHITECTURE === */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full" style={{ background: 'hsl(24 100% 50%)' }} />
            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'hsl(40 30% 70%)' }}>
              Soundstage Architecture
            </span>
          </div>

          {/* Stereo Field Visualization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-wider" style={{ color: 'hsl(30 20% 50%)' }}>
                Stereo Width
              </span>
              <span className="text-[10px] font-mono" style={{ color: 'hsl(40 30% 75%)' }}>
                {stereoWidth.toFixed(0)}%
              </span>
            </div>
            <div className="relative h-8 rounded-lg overflow-hidden" style={{ background: 'hsl(20 25% 8%)' }}>
              {/* Center line */}
              <div className="absolute inset-y-0 left-1/2 w-px" style={{ background: 'hsl(30 30% 20%)' }} />
              
              {/* Stereo field indicator */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-y-1/2 h-4 rounded-full"
                animate={{ 
                  width: `${stereoWidth}%`,
                  x: `-50%`,
                }}
                transition={{ duration: 0.1 }}
                style={{ 
                  background: `linear-gradient(90deg, transparent 0%, ${getThermalColor(temperature)} 50%, transparent 100%)`,
                  boxShadow: `0 0 20px ${getThermalColor(temperature)}`,
                }}
              />
              
              {/* L/R labels */}
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] font-bold" style={{ color: 'hsl(30 20% 40%)' }}>L</span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-bold" style={{ color: 'hsl(30 20% 40%)' }}>R</span>
            </div>
          </div>

          {/* Frequency Verticality - Stacked Bars */}
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-wider" style={{ color: 'hsl(30 20% 50%)' }}>
              Frequency Verticality
            </span>
            <div className="flex gap-2">
              {/* Sub-Bass Foundation */}
              <div className="flex-1 space-y-1">
                <div className="h-16 rounded-lg overflow-hidden relative" style={{ background: 'hsl(20 25% 8%)' }}>
                  <motion.div 
                    className="absolute bottom-0 inset-x-0 rounded-t-lg"
                    animate={{ height: `${subBassRatio}%` }}
                    transition={{ duration: 0.1 }}
                    style={{ 
                      background: 'linear-gradient(to top, hsl(0 70% 35%), hsl(15 80% 45%))',
                      boxShadow: '0 0 15px hsl(0 70% 40%)',
                    }}
                  />
                  <div className="absolute inset-0 flex items-end justify-center pb-1">
                    <span className="text-[10px] font-mono font-bold text-white/90">{subBassRatio.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-[8px] uppercase tracking-wider block" style={{ color: 'hsl(30 20% 45%)' }}>Sub-Bass</span>
                  <span className="text-[7px]" style={{ color: 'hsl(30 20% 35%)' }}>20-60Hz</span>
                </div>
              </div>

              {/* Mid Presence */}
              <div className="flex-1 space-y-1">
                <div className="h-16 rounded-lg overflow-hidden relative" style={{ background: 'hsl(20 25% 8%)' }}>
                  <motion.div 
                    className="absolute bottom-0 inset-x-0 rounded-t-lg"
                    animate={{ height: `${midRatio}%` }}
                    transition={{ duration: 0.1 }}
                    style={{ 
                      background: 'linear-gradient(to top, hsl(24 100% 40%), hsl(35 100% 55%))',
                      boxShadow: '0 0 15px hsl(24 100% 45%)',
                    }}
                  />
                  <div className="absolute inset-0 flex items-end justify-center pb-1">
                    <span className="text-[10px] font-mono font-bold text-white/90">{midRatio.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-[8px] uppercase tracking-wider block" style={{ color: 'hsl(30 20% 45%)' }}>Mid Range</span>
                  <span className="text-[7px]" style={{ color: 'hsl(30 20% 35%)' }}>250Hz-4kHz</span>
                </div>
              </div>

              {/* Air Frequencies */}
              <div className="flex-1 space-y-1">
                <div className="h-16 rounded-lg overflow-hidden relative" style={{ background: 'hsl(20 25% 8%)' }}>
                  <motion.div 
                    className="absolute bottom-0 inset-x-0 rounded-t-lg"
                    animate={{ height: `${airRatio}%` }}
                    transition={{ duration: 0.1 }}
                    style={{ 
                      background: 'linear-gradient(to top, hsl(45 100% 50%), hsl(55 100% 70%))',
                      boxShadow: '0 0 15px hsl(45 100% 55%)',
                    }}
                  />
                  <div className="absolute inset-0 flex items-end justify-center pb-1">
                    <span className="text-[10px] font-mono font-bold text-white/90">{airRatio.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-[8px] uppercase tracking-wider block" style={{ color: 'hsl(30 20% 45%)' }}>Air Band</span>
                  <span className="text-[7px]" style={{ color: 'hsl(30 20% 35%)' }}>10kHz+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === THERMAL TIMBRE === */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full" style={{ background: timbreColor }} />
            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'hsl(40 30% 70%)' }}>
              Temperature Timbre
            </span>
          </div>

          <div 
            className="rounded-lg p-3 border"
            style={{ 
              background: 'hsl(20 25% 8%)',
              borderColor: `${timbreColor}40`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span 
                className="text-lg font-bold tracking-wider"
                style={{ color: timbreColor }}
              >
                {timbreClass}
              </span>
              <span 
                className="text-2xl font-mono font-bold"
                style={{ color: getThermalColor(temperature) }}
              >
                {temperature.toFixed(1)}°C
              </span>
            </div>
            
            {/* Temperature bar */}
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'hsl(20 25% 12%)' }}>
              <motion.div 
                className="h-full rounded-full"
                animate={{ width: `${normalizedTemp * 100}%` }}
                transition={{ duration: 0.15 }}
                style={{ 
                  background: `linear-gradient(90deg, hsl(210 80% 60%), hsl(200 60% 50%), hsl(24 100% 50%), hsl(0 80% 50%))`,
                }}
              />
            </div>
            
            <p className="text-[9px] mt-2 leading-relaxed" style={{ color: 'hsl(30 20% 50%)' }}>
              {normalizedTemp > 0.7 
                ? 'Dense analog tube saturation with odd-order harmonics. The sound feels thick and enveloping.'
                : normalizedTemp > 0.4 
                ? 'Gentle even-order harmonic enhancement. Smooth, inviting, naturally compressed dynamics.'
                : normalizedTemp > 0.15 
                ? 'Minimal saturation with preserved transient attacks. Clean and articulate.'
                : 'Pristine digital clarity with hyper-defined transients. Glassy and precise.'}
            </p>
          </div>
        </div>

        {/* === DYNAMIC RESPONSE === */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full" style={{ background: 'hsl(120 50% 45%)' }} />
            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'hsl(40 30% 70%)' }}>
              Dynamic Response
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Attack */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[8px] uppercase tracking-wider" style={{ color: 'hsl(30 20% 45%)' }}>Attack</span>
                <span className="text-[9px] font-mono" style={{ color: 'hsl(40 30% 75%)' }}>{attackIntensity.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(20 25% 12%)' }}>
                <motion.div 
                  className="h-full rounded-full"
                  animate={{ width: `${attackIntensity}%` }}
                  transition={{ duration: 0.05 }}
                  style={{ background: 'hsl(0 70% 50%)' }}
                />
              </div>
            </div>

            {/* Decay */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[8px] uppercase tracking-wider" style={{ color: 'hsl(30 20% 45%)' }}>Decay</span>
                <span className="text-[9px] font-mono" style={{ color: 'hsl(40 30% 75%)' }}>{decayResponse.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(20 25% 12%)' }}>
                <motion.div 
                  className="h-full rounded-full"
                  animate={{ width: `${decayResponse}%` }}
                  transition={{ duration: 0.1 }}
                  style={{ background: 'hsl(24 100% 50%)' }}
                />
              </div>
            </div>

            {/* Noise Floor */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[8px] uppercase tracking-wider" style={{ color: 'hsl(30 20% 45%)' }}>Floor</span>
                <span className="text-[9px] font-mono" style={{ color: 'hsl(40 30% 75%)' }}>{noiseFloor.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(20 25% 12%)' }}>
                <motion.div 
                  className="h-full rounded-full"
                  animate={{ width: `${noiseFloor}%` }}
                  transition={{ duration: 0.2 }}
                  style={{ background: 'hsl(220 40% 50%)' }}
                />
              </div>
            </div>
          </div>

          {/* Harmonic Complexity & Spectral Flux */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div 
              className="rounded-lg p-2 text-center"
              style={{ background: 'hsl(20 25% 8%)' }}
            >
              <span className="text-[8px] uppercase tracking-wider block mb-1" style={{ color: 'hsl(30 20% 45%)' }}>
                Harmonic Complexity
              </span>
              <span className="text-lg font-mono font-bold" style={{ color: 'hsl(45 100% 60%)' }}>
                {(spectralData.harmonicComplexity * 100).toFixed(0)}%
              </span>
            </div>
            <div 
              className="rounded-lg p-2 text-center"
              style={{ background: 'hsl(20 25% 8%)' }}
            >
              <span className="text-[8px] uppercase tracking-wider block mb-1" style={{ color: 'hsl(30 20% 45%)' }}>
                Spectral Flux
              </span>
              <span className="text-lg font-mono font-bold" style={{ color: 'hsl(180 60% 50%)' }}>
                {(spectralData.spectralFlux * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Bose signature */}
        <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: 'hsl(30 30% 12%)' }}>
          <span className="text-[8px] tracking-[0.15em] uppercase" style={{ color: 'hsl(30 20% 35%)' }}>
            Psychoacoustic Intelligence
          </span>
          <span className="text-[8px] font-mono" style={{ color: 'hsl(30 20% 40%)' }}>
            {isPlaying ? 'ACTIVE' : 'STANDBY'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PsychoacousticVisualization;
