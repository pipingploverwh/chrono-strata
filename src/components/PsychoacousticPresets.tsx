import { motion } from 'framer-motion';
import { Sparkles, ThermometerSun, Waves, Headphones, Zap } from 'lucide-react';

export interface PsychoacousticPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  // Temperature bias (-1 to 1, where -1 = cold, 1 = hot)
  temperatureBias: number;
  // Frequency band weights
  bandWeights: {
    subBass: number;
    bass: number;
    lowMid: number;
    mid: number;
    highMid: number;
    presence: number;
    brilliance: number;
  };
  // Stereo width multiplier
  stereoWidthMultiplier: number;
  // Dynamics settings
  transientPreservation: number; // 0-1, how much to preserve transients
  harmonicEnhancement: number;   // 0-1, harmonic saturation
  // Diffusion/reverb tendency
  spatialDiffusion: number;      // 0-1
  // Display color (HSL)
  accentColor: string;
}

export const PSYCHOACOUSTIC_PRESETS: PsychoacousticPreset[] = [
  {
    id: 'neutral',
    name: 'Neutral',
    description: 'Flat response with no bias',
    icon: <Waves className="w-4 h-4" />,
    temperatureBias: 0,
    bandWeights: {
      subBass: 1.0, bass: 1.0, lowMid: 1.0, mid: 1.0,
      highMid: 1.0, presence: 1.0, brilliance: 1.0
    },
    stereoWidthMultiplier: 1.0,
    transientPreservation: 0.5,
    harmonicEnhancement: 0.3,
    spatialDiffusion: 0.4,
    accentColor: 'hsl(280 50% 60%)'
  },
  {
    id: 'warm-analog',
    name: 'Warm Analog',
    description: 'Tube saturation, vinyl warmth, rich harmonics',
    icon: <ThermometerSun className="w-4 h-4" />,
    temperatureBias: 0.4,
    bandWeights: {
      subBass: 1.3, bass: 1.4, lowMid: 1.2, mid: 0.95,
      highMid: 0.8, presence: 0.7, brilliance: 0.5
    },
    stereoWidthMultiplier: 0.85,
    transientPreservation: 0.3,
    harmonicEnhancement: 0.8,
    spatialDiffusion: 0.55,
    accentColor: 'hsl(24 100% 55%)'
  },
  {
    id: 'crystalline-digital',
    name: 'Crystalline Digital',
    description: 'Pristine clarity, hyper-defined transients',
    icon: <Sparkles className="w-4 h-4" />,
    temperatureBias: -0.5,
    bandWeights: {
      subBass: 0.7, bass: 0.8, lowMid: 0.9, mid: 1.1,
      highMid: 1.3, presence: 1.4, brilliance: 1.5
    },
    stereoWidthMultiplier: 1.2,
    transientPreservation: 0.9,
    harmonicEnhancement: 0.1,
    spatialDiffusion: 0.2,
    accentColor: 'hsl(200 80% 60%)'
  },
  {
    id: 'immersive-spatial',
    name: 'Immersive Spatial',
    description: 'Wide soundstage, deep diffusion, 3D presence',
    icon: <Headphones className="w-4 h-4" />,
    temperatureBias: 0.1,
    bandWeights: {
      subBass: 1.1, bass: 1.0, lowMid: 1.0, mid: 1.0,
      highMid: 1.1, presence: 1.2, brilliance: 1.1
    },
    stereoWidthMultiplier: 1.5,
    transientPreservation: 0.5,
    harmonicEnhancement: 0.4,
    spatialDiffusion: 0.85,
    accentColor: 'hsl(260 70% 60%)'
  },
  {
    id: 'punchy-dynamic',
    name: 'Punchy Dynamic',
    description: 'Explosive transients, controlled lows, cutting presence',
    icon: <Zap className="w-4 h-4" />,
    temperatureBias: 0.2,
    bandWeights: {
      subBass: 0.9, bass: 1.2, lowMid: 0.9, mid: 1.0,
      highMid: 1.3, presence: 1.2, brilliance: 0.8
    },
    stereoWidthMultiplier: 1.1,
    transientPreservation: 0.95,
    harmonicEnhancement: 0.5,
    spatialDiffusion: 0.25,
    accentColor: 'hsl(340 80% 55%)'
  }
];

interface PresetSelectorProps {
  activePreset: string;
  onPresetChange: (presetId: string) => void;
}

const PsychoacousticPresetSelector = ({ activePreset, onPresetChange }: PresetSelectorProps) => {
  const currentPreset = PSYCHOACOUSTIC_PRESETS.find(p => p.id === activePreset) || PSYCHOACOUSTIC_PRESETS[0];

  return (
    <motion.div 
      className="rounded-xl border overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{ 
        background: 'hsl(280 25% 6% / 0.95)', 
        borderColor: 'hsl(280 30% 20%)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: 'hsl(280 30% 20%)' }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ background: currentPreset.accentColor }}
          />
          <span 
            className="text-xs font-medium tracking-[0.15em] uppercase"
            style={{ color: 'hsl(300 60% 70%)' }}
          >
            Psychoacoustic Profile
          </span>
        </div>
        <span 
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{ color: 'hsl(280 30% 50%)' }}
        >
          Audio Character
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Preset Grid */}
        <div className="grid grid-cols-5 gap-2">
          {PSYCHOACOUSTIC_PRESETS.map((preset) => (
            <motion.button
              key={preset.id}
              onClick={() => onPresetChange(preset.id)}
              className="relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all"
              style={{
                background: activePreset === preset.id 
                  ? `${preset.accentColor.replace(')', ' / 0.2)')}` 
                  : 'hsl(280 25% 10%)',
                border: activePreset === preset.id 
                  ? `1px solid ${preset.accentColor}` 
                  : '1px solid hsl(280 20% 18%)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span style={{ color: activePreset === preset.id ? preset.accentColor : 'hsl(280 30% 50%)' }}>
                {preset.icon}
              </span>
              <span 
                className="text-[8px] uppercase tracking-wider text-center leading-tight"
                style={{ 
                  color: activePreset === preset.id ? preset.accentColor : 'hsl(280 30% 55%)'
                }}
              >
                {preset.name.split(' ')[0]}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Active Preset Details */}
        <motion.div
          key={currentPreset.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="rounded-lg p-3 space-y-3"
          style={{ 
            background: 'hsl(280 25% 8%)',
            border: `1px solid ${currentPreset.accentColor}40`
          }}
        >
          <div className="flex items-center justify-between">
            <span 
              className="text-sm font-medium"
              style={{ color: currentPreset.accentColor }}
            >
              {currentPreset.name}
            </span>
            <span 
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ 
                background: `${currentPreset.accentColor}20`,
                color: currentPreset.accentColor
              }}
            >
              {currentPreset.temperatureBias > 0 ? 'Warm' : currentPreset.temperatureBias < 0 ? 'Cool' : 'Neutral'}
            </span>
          </div>
          
          <p className="text-[10px] leading-relaxed" style={{ color: 'hsl(280 30% 55%)' }}>
            {currentPreset.description}
          </p>

          {/* Parameter Visualizations */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {/* Stereo Width */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[8px] uppercase tracking-wider" style={{ color: 'hsl(280 25% 45%)' }}>
                  Stereo Width
                </span>
                <span className="text-[9px] font-mono" style={{ color: currentPreset.accentColor }}>
                  {(currentPreset.stereoWidthMultiplier * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsl(280 25% 15%)' }}>
                <motion.div 
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, currentPreset.stereoWidthMultiplier * 66)}%` }}
                  transition={{ duration: 0.3 }}
                  style={{ background: currentPreset.accentColor }}
                />
              </div>
            </div>

            {/* Harmonics */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[8px] uppercase tracking-wider" style={{ color: 'hsl(280 25% 45%)' }}>
                  Harmonics
                </span>
                <span className="text-[9px] font-mono" style={{ color: currentPreset.accentColor }}>
                  {(currentPreset.harmonicEnhancement * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsl(280 25% 15%)' }}>
                <motion.div 
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentPreset.harmonicEnhancement * 100}%` }}
                  transition={{ duration: 0.3 }}
                  style={{ background: currentPreset.accentColor }}
                />
              </div>
            </div>

            {/* Transients */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[8px] uppercase tracking-wider" style={{ color: 'hsl(280 25% 45%)' }}>
                  Transients
                </span>
                <span className="text-[9px] font-mono" style={{ color: currentPreset.accentColor }}>
                  {(currentPreset.transientPreservation * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsl(280 25% 15%)' }}>
                <motion.div 
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentPreset.transientPreservation * 100}%` }}
                  transition={{ duration: 0.3 }}
                  style={{ background: currentPreset.accentColor }}
                />
              </div>
            </div>

            {/* Diffusion */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[8px] uppercase tracking-wider" style={{ color: 'hsl(280 25% 45%)' }}>
                  Diffusion
                </span>
                <span className="text-[9px] font-mono" style={{ color: currentPreset.accentColor }}>
                  {(currentPreset.spatialDiffusion * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsl(280 25% 15%)' }}>
                <motion.div 
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentPreset.spatialDiffusion * 100}%` }}
                  transition={{ duration: 0.3 }}
                  style={{ background: currentPreset.accentColor }}
                />
              </div>
            </div>
          </div>

          {/* Frequency Band Visualization */}
          <div className="pt-2 border-t" style={{ borderColor: 'hsl(280 20% 15%)' }}>
            <span className="text-[8px] uppercase tracking-wider block mb-2" style={{ color: 'hsl(280 25% 45%)' }}>
              Frequency Weighting
            </span>
            <div className="flex items-end gap-1 h-8">
              {Object.entries(currentPreset.bandWeights).map(([band, weight], i) => (
                <motion.div
                  key={band}
                  className="flex-1 rounded-t-sm"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.min(100, weight * 65)}%` }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  style={{ 
                    background: `linear-gradient(to top, ${currentPreset.accentColor}80, ${currentPreset.accentColor})`,
                    opacity: 0.4 + weight * 0.4
                  }}
                  title={`${band}: ${weight.toFixed(1)}x`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[6px]" style={{ color: 'hsl(280 20% 35%)' }}>20Hz</span>
              <span className="text-[6px]" style={{ color: 'hsl(280 20% 35%)' }}>20kHz</span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: 'hsl(280 20% 15%)' }}>
          <span className="text-[8px] tracking-[0.15em] uppercase" style={{ color: 'hsl(280 20% 40%)' }}>
            Psychoacoustic Intelligence
          </span>
          <span className="text-[8px] font-mono" style={{ color: 'hsl(280 25% 50%)' }}>
            LAVANDAR™
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PsychoacousticPresetSelector;
