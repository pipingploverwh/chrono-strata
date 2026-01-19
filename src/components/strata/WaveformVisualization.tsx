import { useMemo } from 'react';

interface WaveformVisualizationProps {
  waveformData: number[];
  temperature: number;
  isPlaying: boolean;
  getThermalColor: (temp: number) => string;
}

const WaveformVisualization = ({ 
  waveformData, 
  temperature, 
  isPlaying,
  getThermalColor 
}: WaveformVisualizationProps) => {
  
  // Generate SVG path from waveform data
  const waveformPath = useMemo(() => {
    if (!waveformData.length) return '';
    
    const width = 100;
    const height = 100;
    const centerY = height / 2;
    const amplitude = height * 0.4;
    
    let path = `M 0 ${centerY}`;
    
    waveformData.forEach((value, index) => {
      const x = (index / waveformData.length) * width;
      // Convert 0-255 range to -1 to 1, then scale by amplitude
      const normalizedValue = (value - 128) / 128;
      const y = centerY - (normalizedValue * amplitude);
      path += ` L ${x} ${y}`;
    });
    
    return path;
  }, [waveformData]);

  // Generate mirrored path for reflection effect
  const mirroredPath = useMemo(() => {
    if (!waveformData.length) return '';
    
    const width = 100;
    const height = 100;
    const centerY = height / 2;
    const amplitude = height * 0.3; // Slightly smaller for reflection
    
    let path = `M 0 ${centerY}`;
    
    waveformData.forEach((value, index) => {
      const x = (index / waveformData.length) * width;
      const normalizedValue = (value - 128) / 128;
      // Invert the wave for reflection
      const y = centerY + (normalizedValue * amplitude);
      path += ` L ${x} ${y}`;
    });
    
    return path;
  }, [waveformData]);

  const primaryColor = getThermalColor(temperature);
  const glowColor = getThermalColor(temperature + 10);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Main waveform SVG */}
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        style={{ opacity: isPlaying ? 0.6 : 0.2 }}
      >
        {/* Glow filter */}
        <defs>
          <filter id="waveGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getThermalColor(temperature - 15)} />
            <stop offset="50%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={getThermalColor(temperature + 15)} />
          </linearGradient>
        </defs>
        
        {/* Background glow layer */}
        <path
          d={waveformPath}
          fill="none"
          stroke={glowColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#waveGlow)"
          style={{ 
            opacity: 0.4,
            transition: 'all 0.05s ease-out',
          }}
        />
        
        {/* Primary waveform */}
        <path
          d={waveformPath}
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ 
            transition: 'all 0.05s ease-out',
          }}
        />
        
        {/* Mirrored reflection with fade */}
        <path
          d={mirroredPath}
          fill="none"
          stroke={primaryColor}
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ 
            opacity: 0.2,
            transition: 'all 0.05s ease-out',
          }}
        />
      </svg>

      {/* Vertical indicator lines - oscilloscope style */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-full h-px opacity-20"
          style={{ background: primaryColor }}
        />
      </div>
      
      {/* Edge glow effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, ${primaryColor}10 100%)`,
          transition: 'all 0.15s ease-out',
        }}
      />
    </div>
  );
};

export default WaveformVisualization;
