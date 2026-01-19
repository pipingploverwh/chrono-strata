import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Upload, Thermometer, Volume2, Activity, Disc, ArrowLeft, Monitor, Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import StrataEmbeddedDisplay from '@/components/strata/StrataEmbeddedDisplay';
import WaveformVisualization from '@/components/strata/WaveformVisualization';

// Proprietary Thermal Mapping Algorithm
// Based on psychoacoustic energy density and spectral flux
const THERMAL_CONSTANTS = {
  BASE_TEMP: 20, // Celsius - neutral state
  MAX_TEMP: 85, // Max thermal response
  MIN_TEMP: -15, // Cryogenic response for minimal energy
  ENERGY_COEFFICIENT: 0.0847, // Proprietary energy-to-thermal conversion
  SPECTRAL_WEIGHT_LOW: 1.4, // Bass emphasis factor
  SPECTRAL_WEIGHT_MID: 1.0, // Mid frequency factor
  SPECTRAL_WEIGHT_HIGH: 0.7, // High frequency factor
  THERMAL_INERTIA: 0.15, // Material thermal response lag
  HYSTERESIS_FACTOR: 0.92, // Prevents rapid oscillation
};

interface ThermalZone {
  id: string;
  name: string;
  temperature: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SpectralBand {
  low: number;
  mid: number;
  high: number;
  energy: number;
}

const ThermalMusicVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [globalTemp, setGlobalTemp] = useState(THERMAL_CONSTANTS.BASE_TEMP);
  const [spectralData, setSpectralData] = useState<SpectralBand>({ low: 0, mid: 0, high: 0, energy: 0 });
  const [thermalZones, setThermalZones] = useState<ThermalZone[]>([
    { id: 'left-deck', name: 'Left Turntable', temperature: 20, x: 10, y: 30, width: 25, height: 40 },
    { id: 'mixer', name: 'Mixer Core', temperature: 20, x: 37.5, y: 25, width: 25, height: 50 },
    { id: 'right-deck', name: 'Right Turntable', temperature: 20, x: 65, y: 30, width: 25, height: 40 },
    { id: 'vinyl-left', name: 'Left Vinyl Bay', temperature: 20, x: 5, y: 75, width: 20, height: 20 },
    { id: 'vinyl-right', name: 'Right Vinyl Bay', temperature: 20, x: 75, y: 75, width: 20, height: 20 },
  ]);
  const [bpm, setBpm] = useState(0);
  const [peakEnergy, setPeakEnergy] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>(new Array(128).fill(128));

  // Fullscreen keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
      if (e.key === ' ' && audioFile) {
        e.preventDefault();
        togglePlayback();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioFile]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number>(0);
  const prevTempRef = useRef(THERMAL_CONSTANTS.BASE_TEMP);

  // Proprietary thermal calculation algorithm
  const calculateThermalResponse = useCallback((frequencyData: Uint8Array): SpectralBand => {
    const bufferLength = frequencyData.length;
    const lowEnd = Math.floor(bufferLength * 0.1);
    const midEnd = Math.floor(bufferLength * 0.5);

    let lowSum = 0, midSum = 0, highSum = 0;

    for (let i = 0; i < bufferLength; i++) {
      const normalized = frequencyData[i] / 255;
      if (i < lowEnd) {
        lowSum += normalized * THERMAL_CONSTANTS.SPECTRAL_WEIGHT_LOW;
      } else if (i < midEnd) {
        midSum += normalized * THERMAL_CONSTANTS.SPECTRAL_WEIGHT_MID;
      } else {
        highSum += normalized * THERMAL_CONSTANTS.SPECTRAL_WEIGHT_HIGH;
      }
    }

    const low = (lowSum / lowEnd) * 100;
    const mid = (midSum / (midEnd - lowEnd)) * 100;
    const high = (highSum / (bufferLength - midEnd)) * 100;

    // Proprietary energy density formula
    const energy = Math.sqrt(
      Math.pow(low * 0.5, 2) + 
      Math.pow(mid * 0.35, 2) + 
      Math.pow(high * 0.15, 2)
    ) * THERMAL_CONSTANTS.ENERGY_COEFFICIENT;

    return { low, mid, high, energy };
  }, []);

  // Convert energy to temperature with thermal inertia
  const energyToTemperature = useCallback((energy: number, prevTemp: number): number => {
    const targetTemp = THERMAL_CONSTANTS.MIN_TEMP + 
      (energy * (THERMAL_CONSTANTS.MAX_TEMP - THERMAL_CONSTANTS.MIN_TEMP));
    
    // Apply thermal inertia (material doesn't change instantly)
    const newTemp = prevTemp * THERMAL_CONSTANTS.HYSTERESIS_FACTOR + 
      targetTemp * (1 - THERMAL_CONSTANTS.HYSTERESIS_FACTOR);
    
    return Math.max(THERMAL_CONSTANTS.MIN_TEMP, 
      Math.min(THERMAL_CONSTANTS.MAX_TEMP, newTemp));
  }, []);

  // Zone-specific thermal response based on frequency content
  const calculateZoneThermals = useCallback((spectral: SpectralBand, baseTemp: number): ThermalZone[] => {
    return thermalZones.map(zone => {
      let zoneModifier = 1;
      
      switch (zone.id) {
        case 'left-deck':
        case 'right-deck':
          // Turntables respond more to low frequencies (bass)
          zoneModifier = 0.8 + (spectral.low / 100) * 0.4;
          break;
        case 'mixer':
          // Mixer responds to full spectrum
          zoneModifier = 0.9 + (spectral.energy / 100) * 0.3;
          break;
        case 'vinyl-left':
        case 'vinyl-right':
          // Vinyl bays respond slowly (high thermal mass)
          zoneModifier = 0.6 + (spectral.mid / 100) * 0.2;
          break;
      }

      return {
        ...zone,
        temperature: baseTemp * zoneModifier,
      };
    });
  }, [thermalZones]);

  // Get color based on temperature - Warm Molten Lava palette
  const getThermalColor = (temp: number): string => {
    const normalized = (temp - THERMAL_CONSTANTS.MIN_TEMP) / 
      (THERMAL_CONSTANTS.MAX_TEMP - THERMAL_CONSTANTS.MIN_TEMP);
    
    if (normalized < 0.2) {
      // Deep ember - smoldering low heat
      return `hsl(15, 60%, ${15 + normalized * 80}%)`;
    } else if (normalized < 0.4) {
      // Warm crimson - building heat
      return `hsl(${5 + (normalized - 0.2) * 50}, 70%, ${35 + (normalized - 0.2) * 40}%)`;
    } else if (normalized < 0.6) {
      // Vermilion to orange - active heat
      return `hsl(${15 + (normalized - 0.4) * 50}, 85%, ${50 + (normalized - 0.4) * 20}%)`;
    } else if (normalized < 0.8) {
      // Amber to gold - intense heat
      return `hsl(${30 + (normalized - 0.6) * 30}, 95%, ${55 + (normalized - 0.6) * 20}%)`;
    } else {
      // White-hot - maximum intensity
      return `hsl(${45 - (normalized - 0.8) * 20}, 100%, ${70 + (normalized - 0.8) * 80}%)`;
    }
  };

  // BPM detection (simplified beat detection)
  const detectBPM = useCallback((frequencyData: Uint8Array) => {
    const bassEnergy = frequencyData.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
    if (bassEnergy > 180) {
      setPeakEnergy(prev => Math.max(prev * 0.95, bassEnergy / 255));
    }
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    if (!analyserRef.current) return;

    const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(frequencyData);

    // Capture time-domain waveform data
    const timeDomainData = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(timeDomainData);
    
    // Sample 128 points from the waveform for visualization
    const sampledWaveform: number[] = [];
    const sampleRate = Math.floor(timeDomainData.length / 128);
    for (let i = 0; i < 128; i++) {
      sampledWaveform.push(timeDomainData[i * sampleRate]);
    }
    setWaveformData(sampledWaveform);

    const spectral = calculateThermalResponse(frequencyData);
    setSpectralData(spectral);

    const newTemp = energyToTemperature(spectral.energy, prevTempRef.current);
    prevTempRef.current = newTemp;
    setGlobalTemp(newTemp);

    const zones = calculateZoneThermals(spectral, newTemp);
    setThermalZones(zones);

    detectBPM(frequencyData);

    // Estimate BPM from energy patterns
    if (spectral.energy > 0.5) {
      setBpm(prev => Math.round(prev * 0.95 + (80 + spectral.low * 0.8) * 0.05));
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [calculateThermalResponse, energyToTemperature, calculateZoneThermals, detectBPM]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(file);
      }
    }
  };

  // Toggle playback
  const togglePlayback = async () => {
    if (!audioRef.current || !audioFile) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }

    if (isPlaying) {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      await audioRef.current.play();
      animate();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className={`min-h-screen text-white overflow-hidden transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[100]' : ''}`} style={{ background: 'hsl(15 30% 6%)' }}>
      <audio ref={audioRef} />
      
      {/* Fullscreen Immersive Mode */}
      {isFullscreen ? (
        <div className="relative w-full h-full flex flex-col overflow-hidden">
          {/* Minimal floating controls - responsive */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50 flex items-center justify-between">
            {/* Left controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={() => setIsFullscreen(false)}
                variant="ghost"
                size="icon"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full backdrop-blur-xl border hover:opacity-80"
                style={{ background: 'hsl(20 25% 8% / 0.9)', borderColor: 'hsl(30 30% 25%)' }}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'hsl(40 30% 85%)' }} />
              </Button>
              <span className="hidden sm:block text-xs sm:text-sm font-light tracking-[0.2em] sm:tracking-[0.3em] opacity-80" style={{ color: 'hsl(24 100% 50%)' }}>
                THERMAL RESONANCE
              </span>
            </div>
            
            {/* Right controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={togglePlayback}
                disabled={!audioFile}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full disabled:opacity-50"
                style={{ 
                  background: 'linear-gradient(135deg, hsl(0 70% 45%) 0%, hsl(24 100% 50%) 100%)',
                  boxShadow: '0 0 20px hsl(24 100% 50% / 0.4)'
                }}
              >
                {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />}
              </Button>
              <div 
                className="px-2 sm:px-4 py-1.5 sm:py-2 backdrop-blur-xl rounded-lg font-mono text-sm sm:text-lg font-bold"
                style={{ 
                  background: 'hsl(20 25% 8% / 0.9)', 
                  borderWidth: '1px',
                  borderColor: 'hsl(30 30% 25%)',
                  color: getThermalColor(globalTemp) 
                }}
              >
                {globalTemp.toFixed(1)}°C
              </div>
            </div>
          </div>

          {/* Immersive Thermal Visualization */}
          <div 
            className="flex-1 relative"
            style={{
              background: `radial-gradient(ellipse at center, ${getThermalColor(globalTemp)} 0%, ${getThermalColor(globalTemp - 20)} 50%, hsl(15, 30%, 6%) 100%)`,
              transition: 'background 0.15s ease-out',
            }}
          >
            {/* Fullscreen Waveform Visualization */}
            <WaveformVisualization
              waveformData={waveformData}
              temperature={globalTemp}
              isPlaying={isPlaying}
              getThermalColor={getThermalColor}
            />
            {/* Ambient thermal particles - reduced on mobile */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full animate-pulse"
                  style={{
                    left: `${10 + (i * 4) % 80}%`,
                    top: `${15 + (i * 8) % 70}%`,
                    width: `${3 + spectralData.energy * 15}px`,
                    height: `${3 + spectralData.energy * 15}px`,
                    background: getThermalColor(globalTemp + (i % 10) - 5),
                    boxShadow: `0 0 ${15 + spectralData.energy * 20}px ${getThermalColor(globalTemp)}`,
                    opacity: 0.3 + spectralData.energy * 0.5,
                    animationDelay: `${i * 100}ms`,
                    animationDuration: `${1500 + i * 50}ms`,
                  }}
                />
              ))}
            </div>

            {/* Central console visualization - Portrait vs Landscape responsive */}
            <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 md:p-8">
              {/* Portrait mode: vertical stack */}
              <div className="portrait:flex portrait:flex-col portrait:gap-3 portrait:w-full portrait:max-w-md portrait:h-full portrait:max-h-[85vh] portrait:justify-center
                            landscape:hidden">
                {/* Portrait: Stacked STRATA displays */}
                <div className="flex gap-2 justify-center">
                  <div className="flex-1 max-w-[140px]">
                    <StrataEmbeddedDisplay
                      temperature={thermalZones.find(z => z.id === 'left-deck')?.temperature || globalTemp}
                      spectralEnergy={spectralData.energy}
                      bpm={bpm}
                      isPlaying={isPlaying}
                      displayId="left"
                    />
                  </div>
                  <div className="flex-1 max-w-[140px]">
                    <StrataEmbeddedDisplay
                      temperature={thermalZones.find(z => z.id === 'mixer')?.temperature || globalTemp}
                      spectralEnergy={spectralData.energy}
                      bpm={bpm}
                      isPlaying={isPlaying}
                      displayId="center"
                    />
                  </div>
                  <div className="flex-1 max-w-[140px]">
                    <StrataEmbeddedDisplay
                      temperature={thermalZones.find(z => z.id === 'right-deck')?.temperature || globalTemp}
                      spectralEnergy={spectralData.energy}
                      bpm={bpm}
                      isPlaying={isPlaying}
                      displayId="right"
                    />
                  </div>
                </div>

                {/* Portrait: Vertical thermal zones */}
                <div 
                  className="relative flex-1 min-h-[200px] rounded-2xl border-2 overflow-hidden mx-auto w-full max-w-sm"
                  style={{
                    background: `linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%)`,
                    borderColor: `${getThermalColor(globalTemp)}60`,
                    boxShadow: `0 0 40px ${getThermalColor(globalTemp)}40`,
                  }}
                >
                  {/* Portrait thermal zones - vertical layout */}
                  <div className="absolute inset-2 flex flex-col gap-2">
                    <div 
                      className="flex-1 rounded-xl flex items-center justify-center"
                      style={{
                        background: getThermalColor(thermalZones[0]?.temperature || globalTemp),
                        boxShadow: `0 0 20px ${getThermalColor(globalTemp)}`,
                      }}
                    >
                      <Disc 
                        className="w-10 h-10 text-white/80" 
                        style={{ animation: isPlaying ? 'spin 1.5s linear infinite' : 'none' }} 
                      />
                    </div>
                    <div 
                      className="flex-1 rounded-xl flex items-center justify-center"
                      style={{
                        background: getThermalColor(thermalZones[1]?.temperature || globalTemp),
                        boxShadow: `0 0 20px ${getThermalColor(globalTemp)}`,
                      }}
                    >
                      <span className="text-white/80 font-mono text-xs">MIXER</span>
                    </div>
                    <div 
                      className="flex-1 rounded-xl flex items-center justify-center"
                      style={{
                        background: getThermalColor(thermalZones[2]?.temperature || globalTemp),
                        boxShadow: `0 0 20px ${getThermalColor(globalTemp)}`,
                      }}
                    >
                      <Disc 
                        className="w-10 h-10 text-white/80" 
                        style={{ animation: isPlaying ? 'spin 1.5s linear infinite' : 'none' }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Portrait: Compact spectral bars */}
                <div className="flex items-end justify-center gap-0.5 h-12">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const segment = i < 10 ? 'low' : i < 22 ? 'mid' : 'high';
                    const value = segment === 'low' ? spectralData.low : segment === 'mid' ? spectralData.mid : spectralData.high;
                    const height = Math.max(8, value * 0.8);
                    return (
                      <div
                        key={i}
                        className="w-1 rounded-full transition-all duration-75"
                        style={{
                          height: `${height}%`,
                          background: getThermalColor(globalTemp - 10 + (i / 32) * 30),
                          boxShadow: `0 0 4px ${getThermalColor(globalTemp)}`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Landscape mode: horizontal console */}
              <div className="hidden landscape:block relative w-full max-w-6xl mx-4 sm:mx-8">
                <div className="aspect-[2.5/1] sm:aspect-[3/1] md:aspect-[2.5/1]">
                  {/* Console glow backdrop */}
                  <div 
                    className="absolute inset-0 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl opacity-50"
                    style={{ background: getThermalColor(globalTemp) }}
                  />
                  
                  {/* Console body */}
                  <div 
                    className="relative h-full rounded-2xl sm:rounded-3xl border-2 overflow-hidden"
                    style={{
                      background: `linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%)`,
                      borderColor: `${getThermalColor(globalTemp)}60`,
                      boxShadow: `0 0 40px sm:0 0 60px ${getThermalColor(globalTemp)}40, inset 0 0 60px sm:inset 0 0 100px rgba(0,0,0,0.8)`,
                    }}
                  >
                    {/* Thermal zones - responsive sizes */}
                    {thermalZones.slice(0, 3).map((zone, idx) => (
                      <div
                        key={zone.id}
                        className="absolute rounded-lg sm:rounded-xl transition-all duration-150 flex items-center justify-center"
                        style={{
                          left: `${5 + idx * 32}%`,
                          top: '35%',
                          width: '28%',
                          height: '50%',
                          background: `linear-gradient(135deg, ${getThermalColor(zone.temperature)} 0%, ${getThermalColor(zone.temperature - 10)} 100%)`,
                          boxShadow: `0 0 ${20 + zone.temperature / 3}px ${getThermalColor(zone.temperature)}`,
                        }}
                      >
                        {zone.id.includes('deck') && (
                          <Disc 
                            className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white/80" 
                            style={{ 
                              animation: isPlaying ? 'spin 1.5s linear infinite' : 'none',
                              filter: `drop-shadow(0 0 8px ${getThermalColor(zone.temperature)})`,
                            }} 
                          />
                        )}
                        {zone.id === 'mixer' && (
                          <span className="text-white/60 font-mono text-[10px] sm:text-xs">MIXER</span>
                        )}
                      </div>
                    ))}

                    {/* Embedded STRATA Displays - Landscape responsive */}
                    <div className="absolute top-[2%] left-[2%] w-[30%] sm:w-[28%]">
                      <StrataEmbeddedDisplay
                        temperature={thermalZones.find(z => z.id === 'left-deck')?.temperature || globalTemp}
                        spectralEnergy={spectralData.energy}
                        bpm={bpm}
                        isPlaying={isPlaying}
                        displayId="left"
                      />
                    </div>
                    <div className="absolute top-[2%] left-[35%] w-[30%] sm:w-[28%]">
                      <StrataEmbeddedDisplay
                        temperature={thermalZones.find(z => z.id === 'mixer')?.temperature || globalTemp}
                        spectralEnergy={spectralData.energy}
                        bpm={bpm}
                        isPlaying={isPlaying}
                        displayId="center"
                      />
                    </div>
                    <div className="absolute top-[2%] right-[2%] w-[30%] sm:w-[28%]">
                      <StrataEmbeddedDisplay
                        temperature={thermalZones.find(z => z.id === 'right-deck')?.temperature || globalTemp}
                        spectralEnergy={spectralData.energy}
                        bpm={bpm}
                        isPlaying={isPlaying}
                        displayId="right"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom metrics bar - responsive */}
            <div className="absolute bottom-0 left-0 right-0 pt-8 sm:pt-16 pb-3 sm:pb-6 px-3 sm:px-8" style={{ background: 'linear-gradient(to top, hsl(15 30% 6%) 0%, hsl(15 30% 6% / 0.8) 50%, transparent 100%)' }}>
              <div className="max-w-6xl mx-auto">
                {/* Spectral bars - responsive count and size */}
                <div className="hidden sm:flex items-end justify-center gap-0.5 sm:gap-1 h-16 sm:h-24 mb-2 sm:mb-4">
                  {Array.from({ length: 48 }).map((_, i) => {
                    const segment = i < 15 ? 'low' : i < 35 ? 'mid' : 'high';
                    const value = segment === 'low' ? spectralData.low : segment === 'mid' ? spectralData.mid : spectralData.high;
                    const height = Math.max(4, value * (0.8 + Math.sin(i * 0.3 + Date.now() * 0.005) * 0.2));
                    return (
                      <div
                        key={i}
                        className="w-1 sm:w-1.5 rounded-full transition-all duration-75"
                        style={{
                          height: `${height}%`,
                          background: getThermalColor(globalTemp - 10 + (i / 48) * 30),
                          boxShadow: `0 0 6px ${getThermalColor(globalTemp)}`,
                        }}
                      />
                    );
                  })}
                </div>
                
                {/* Metrics row - responsive layout */}
                <div className="flex items-center justify-between text-xs sm:text-sm font-mono" style={{ color: 'hsl(40 30% 85%)' }}>
                  {/* Left metrics */}
                  <div className="flex items-center gap-3 sm:gap-8">
                    <div>
                      <span style={{ color: 'hsl(30 20% 50%)' }} className="text-[10px] sm:text-sm">BPM</span>
                      <span className="ml-1 sm:ml-2 text-sm sm:text-lg font-bold" style={{ color: getThermalColor(globalTemp) }}>{bpm || '---'}</span>
                    </div>
                    <div className="hidden sm:block">
                      <span style={{ color: 'hsl(30 20% 50%)' }}>ENERGY</span>
                      <span className="ml-2 text-lg font-bold" style={{ color: getThermalColor(globalTemp) }}>{(spectralData.energy * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  
                  {/* Center hint - desktop only */}
                  <div className="hidden md:block text-xs" style={{ color: 'hsl(30 15% 40%)' }}>
                    <kbd className="px-1.5 py-0.5 rounded mx-1" style={{ background: 'hsl(20 25% 15%)' }}>ESC</kbd> exit
                    <span className="mx-2">•</span>
                    <kbd className="px-1.5 py-0.5 rounded mx-1" style={{ background: 'hsl(20 25% 15%)' }}>SPACE</kbd> play
                  </div>
                  
                  {/* Right metrics */}
                  <div className="flex items-center gap-2 sm:gap-8">
                    <div>
                      <span style={{ color: 'hsl(30 20% 50%)' }} className="text-[10px] sm:text-sm">LOW</span>
                      <span className="ml-1 sm:ml-2 text-sm sm:text-lg font-bold" style={{ color: 'hsl(0 70% 55%)' }}>{spectralData.low.toFixed(0)}%</span>
                    </div>
                    <div className="hidden xs:block">
                      <span style={{ color: 'hsl(30 20% 50%)' }} className="text-[10px] sm:text-sm">MID</span>
                      <span className="ml-1 sm:ml-2 text-sm sm:text-lg font-bold" style={{ color: 'hsl(40 100% 50%)' }}>{spectralData.mid.toFixed(0)}%</span>
                    </div>
                    <div>
                      <span style={{ color: 'hsl(30 20% 50%)' }} className="text-[10px] sm:text-sm">HIGH</span>
                      <span className="ml-1 sm:ml-2 text-sm sm:text-lg font-bold" style={{ color: 'hsl(45 100% 85%)' }}>{spectralData.high.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ background: 'hsl(15 30% 6% / 0.9)', borderBottom: '1px solid hsl(30 30% 15% / 0.5)' }}>
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2 transition-colors hover:opacity-80" style={{ color: 'hsl(40 30% 65%)' }}>
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back</span>
                </Link>
                <div className="h-4 w-px" style={{ background: 'hsl(30 30% 25%)' }} />
                <span className="text-sm font-light tracking-[0.3em]" style={{ color: 'hsl(24 100% 50%)' }}>THERMAL RESONANCE</span>
              </div>
              <div className="flex items-center gap-6 text-sm" style={{ color: 'hsl(40 30% 65%)' }}>
                <Button
                  onClick={() => setIsFullscreen(true)}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 hover:opacity-80"
                  style={{ color: 'hsl(45 70% 55%)' }}
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Immersive Mode</span>
                </Button>
                <span className="font-mono">PATENT PENDING: TRS-2024</span>
              </div>
            </div>
          </header>

          <main className="pt-24 px-6 pb-12">
            <div className="max-w-7xl mx-auto">
              {/* Title Section */}
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-extralight tracking-wide mb-4" style={{ color: 'hsl(40 30% 85%)' }}>
                  Music <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, hsl(0 70% 45%), hsl(24 100% 50%), hsl(45 100% 85%))' }}>Temperature</span> Visualizer
                </h1>
                <p className="max-w-2xl mx-auto" style={{ color: 'hsl(30 20% 55%)' }}>
                  Proprietary thermal mapping algorithm converts audio spectral energy into 
                  real-time material temperature response. Watch the console ignite from simmering 
                  embers to blazing white-hot intensity based on your music's energy.
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-6 mb-12">
                <div className="flex items-center gap-4">
                  <label 
                    className="flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer transition-all hover:opacity-90"
                    style={{ 
                      background: 'hsl(15 40% 12%)', 
                      border: '1px solid hsl(30 30% 25%)',
                    }}
                  >
                    <Upload className="w-5 h-5" style={{ color: 'hsl(24 100% 50%)' }} />
                    <span style={{ color: 'hsl(40 30% 75%)' }}>{audioFile ? audioFile.name : 'Upload Audio File'}</span>
                    <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <Button
                    onClick={togglePlayback}
                    disabled={!audioFile}
                    className="w-14 h-14 rounded-full disabled:opacity-50"
                    style={{ 
                      background: 'linear-gradient(135deg, hsl(0 70% 45%) 0%, hsl(24 100% 50%) 100%)',
                      boxShadow: '0 0 25px hsl(24 100% 50% / 0.4)'
                    }}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </Button>
                  <Button
                    onClick={() => setIsFullscreen(true)}
                    variant="outline"
                    className="flex items-center gap-2 hover:opacity-90"
                    style={{ 
                      borderColor: 'hsl(45 70% 45% / 0.5)', 
                      color: 'hsl(45 70% 55%)',
                      background: 'transparent'
                    }}
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Immersive Mode</span>
                  </Button>
                </div>
                <p className="text-xs" style={{ color: 'hsl(30 15% 40%)' }}>Press <kbd className="px-1.5 py-0.5 rounded" style={{ background: 'hsl(20 25% 15%)', color: 'hsl(40 30% 65%)' }}>F</kbd> for fullscreen</p>
              </div>

          {/* Main Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* DJ Console Thermal View */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl p-6 backdrop-blur-xl" style={{ background: 'hsl(20 25% 8% / 0.5)', border: '1px solid hsl(30 30% 20%)' }}>
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: 'hsl(40 30% 65%)' }}>
                  <Thermometer className="w-4 h-4" style={{ color: 'hsl(24 100% 50%)' }} />
                  THERMAL MATERIAL RESPONSE
                </h3>
                
                {/* Console Visualization */}
                <div 
                  className="relative aspect-[2/1] rounded-xl overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${getThermalColor(globalTemp - 10)} 0%, ${getThermalColor(globalTemp)} 50%, ${getThermalColor(globalTemp + 10)} 100%)`,
                    transition: 'background 0.1s ease-out',
                  }}
                >
                  {/* Waveform Visualization - Behind thermal zones */}
                  <WaveformVisualization
                    waveformData={waveformData}
                    temperature={globalTemp}
                    isPlaying={isPlaying}
                    getThermalColor={getThermalColor}
                  />
                  
                  {/* Console body outline */}
                  <div className="absolute inset-4 rounded-2xl border-2 backdrop-blur-sm" style={{ borderColor: 'hsl(40 30% 85% / 0.2)', background: 'hsl(15 30% 6% / 0.3)' }}>
                    {/* Thermal zones */}
                    {thermalZones.map(zone => (
                      <div
                        key={zone.id}
                        className="absolute rounded-lg transition-all duration-150 flex items-center justify-center"
                        style={{
                          left: `${zone.x}%`,
                          top: `${zone.y}%`,
                          width: `${zone.width}%`,
                          height: `${zone.height}%`,
                          background: getThermalColor(zone.temperature),
                          boxShadow: `0 0 ${20 + zone.temperature / 2}px ${getThermalColor(zone.temperature)}`,
                        }}
                      >
                        {zone.id.includes('deck') && (
                          <Disc 
                            className="w-12 h-12 text-white/80" 
                            style={{ 
                              animation: isPlaying ? 'spin 2s linear infinite' : 'none',
                            }} 
                          />
                        )}
                      </div>
                    ))}

                    {/* Embedded STRATA Displays */}
                    <div className="absolute top-[5%] left-[5%] w-[22%]">
                      <StrataEmbeddedDisplay
                        temperature={thermalZones.find(z => z.id === 'left-deck')?.temperature || globalTemp}
                        spectralEnergy={spectralData.energy}
                        bpm={bpm}
                        isPlaying={isPlaying}
                        displayId="left"
                      />
                    </div>
                    <div className="absolute top-[5%] left-[39%] w-[22%]">
                      <StrataEmbeddedDisplay
                        temperature={thermalZones.find(z => z.id === 'mixer')?.temperature || globalTemp}
                        spectralEnergy={spectralData.energy}
                        bpm={bpm}
                        isPlaying={isPlaying}
                        displayId="center"
                      />
                    </div>
                    <div className="absolute top-[5%] right-[5%] w-[22%]">
                      <StrataEmbeddedDisplay
                        temperature={thermalZones.find(z => z.id === 'right-deck')?.temperature || globalTemp}
                        spectralEnergy={spectralData.energy}
                        bpm={bpm}
                        isPlaying={isPlaying}
                        displayId="right"
                      />
                    </div>
                  </div>

                  {/* Temperature overlay */}
                  <div className="absolute top-4 right-4 backdrop-blur-xl rounded-lg px-4 py-2" style={{ background: 'hsl(15 30% 6% / 0.8)', border: '1px solid hsl(30 30% 25%)' }}>
                    <div className="flex items-center gap-3">
                      <Thermometer className="w-5 h-5" style={{ color: 'hsl(24 100% 50%)' }} />
                      <span 
                        className="text-2xl font-mono font-bold"
                        style={{ color: getThermalColor(globalTemp) }}
                      >
                        {globalTemp.toFixed(1)}°C
                      </span>
                    </div>
                  </div>

                  {/* Zone legend */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-around">
                    {thermalZones.slice(0, 3).map(zone => (
                      <div key={zone.id} className="text-center">
                        <div className="text-xs mb-1" style={{ color: 'hsl(40 30% 85% / 0.6)' }}>{zone.name}</div>
                        <div 
                          className="text-sm font-mono font-bold"
                          style={{ color: getThermalColor(zone.temperature) }}
                        >
                          {zone.temperature.toFixed(1)}°C
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STRATA Display Section */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: 'hsl(40 30% 65%)' }}>
                    <Monitor className="w-4 h-4" style={{ color: 'hsl(24 100% 50%)' }} />
                    STRATA EMBEDDED DISPLAYS — Live Thermal Response
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <StrataEmbeddedDisplay
                      temperature={thermalZones.find(z => z.id === 'left-deck')?.temperature || globalTemp}
                      spectralEnergy={spectralData.energy}
                      bpm={bpm}
                      isPlaying={isPlaying}
                      displayId="left"
                    />
                    <StrataEmbeddedDisplay
                      temperature={thermalZones.find(z => z.id === 'mixer')?.temperature || globalTemp}
                      spectralEnergy={spectralData.energy}
                      bpm={bpm}
                      isPlaying={isPlaying}
                      displayId="center"
                    />
                    <StrataEmbeddedDisplay
                      temperature={thermalZones.find(z => z.id === 'right-deck')?.temperature || globalTemp}
                      spectralEnergy={spectralData.energy}
                      bpm={bpm}
                      isPlaying={isPlaying}
                      displayId="right"
                    />
                  </div>
                  <p className="text-xs mt-3 text-center" style={{ color: 'hsl(30 20% 45%)' }}>
                    STRATA displays adapt color temperature and glow intensity based on real-time audio spectral analysis
                  </p>
                </div>

                {/* Temperature Scale - Updated to warm palette */}
                <div className="mt-4 relative h-6">
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `linear-gradient(to right, 
                        hsl(15, 60%, 20%) 0%, 
                        hsl(5, 70%, 40%) 25%, 
                        hsl(18, 85%, 50%) 50%, 
                        hsl(35, 95%, 55%) 75%, 
                        hsl(45, 100%, 85%) 100%)`
                    }}
                  />
                  <div className="absolute inset-0 flex justify-between items-center px-4 text-xs font-mono">
                    <span style={{ color: 'hsl(15 40% 70%)' }}>{THERMAL_CONSTANTS.MIN_TEMP}°C</span>
                    <span style={{ color: 'hsl(5 60% 70%)' }}>5°C</span>
                    <span style={{ color: 'hsl(15 80% 80%)' }}>25°C</span>
                    <span style={{ color: 'hsl(30 90% 70%)' }}>45°C</span>
                    <span style={{ color: 'hsl(40 100% 75%)' }}>65°C</span>
                    <span style={{ color: 'hsl(45 100% 90%)' }}>{THERMAL_CONSTANTS.MAX_TEMP}°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Panel */}
            <div className="space-y-6">
              {/* Spectral Analysis */}
              <div className="rounded-2xl p-6 backdrop-blur-xl" style={{ background: 'hsl(20 25% 8% / 0.5)', border: '1px solid hsl(30 30% 20%)' }}>
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: 'hsl(40 30% 65%)' }}>
                  <Activity className="w-4 h-4" style={{ color: 'hsl(24 100% 50%)' }} />
                  SPECTRAL ENERGY ANALYSIS
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'hsl(30 20% 50%)' }}>LOW (Bass)</span>
                      <span style={{ color: 'hsl(40 30% 65%)' }}>{spectralData.low.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden" style={{ background: 'hsl(20 25% 15%)' }}>
                      <div 
                        className="h-full transition-all duration-75"
                        style={{ width: `${spectralData.low}%`, background: 'linear-gradient(to right, hsl(0 70% 45%), hsl(24 100% 50%))' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'hsl(30 20% 50%)' }}>MID (Vocals)</span>
                      <span style={{ color: 'hsl(40 30% 65%)' }}>{spectralData.mid.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden" style={{ background: 'hsl(20 25% 15%)' }}>
                      <div 
                        className="h-full transition-all duration-75"
                        style={{ width: `${spectralData.mid}%`, background: 'linear-gradient(to right, hsl(24 100% 50%), hsl(40 100% 50%))' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'hsl(30 20% 50%)' }}>HIGH (Treble)</span>
                      <span style={{ color: 'hsl(40 30% 65%)' }}>{spectralData.high.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden" style={{ background: 'hsl(20 25% 15%)' }}>
                      <div 
                        className="h-full transition-all duration-75"
                        style={{ width: `${spectralData.high}%`, background: 'linear-gradient(to right, hsl(40 100% 50%), hsl(45 100% 85%))' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Energy Metrics */}
              <div className="rounded-2xl p-6 backdrop-blur-xl" style={{ background: 'hsl(20 25% 8% / 0.5)', border: '1px solid hsl(30 30% 20%)' }}>
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: 'hsl(40 30% 65%)' }}>
                  <Volume2 className="w-4 h-4" style={{ color: 'hsl(24 100% 50%)' }} />
                  PROPRIETARY METRICS
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg p-4 text-center" style={{ background: 'hsl(20 25% 12% / 0.5)' }}>
                    <div className="text-xs mb-1" style={{ color: 'hsl(30 20% 50%)' }}>Energy Density</div>
                    <div className="text-2xl font-mono font-bold" style={{ color: 'hsl(24 100% 50%)' }}>
                      {(spectralData.energy * 100).toFixed(1)}
                    </div>
                  </div>
                  <div className="rounded-lg p-4 text-center" style={{ background: 'hsl(20 25% 12% / 0.5)' }}>
                    <div className="text-xs mb-1" style={{ color: 'hsl(30 20% 50%)' }}>Est. BPM</div>
                    <div className="text-2xl font-mono font-bold" style={{ color: 'hsl(40 100% 50%)' }}>
                      {bpm || '---'}
                    </div>
                  </div>
                  <div className="rounded-lg p-4 text-center" style={{ background: 'hsl(20 25% 12% / 0.5)' }}>
                    <div className="text-xs mb-1" style={{ color: 'hsl(30 20% 50%)' }}>Peak Energy</div>
                    <div className="text-2xl font-mono font-bold" style={{ color: 'hsl(45 100% 75%)' }}>
                      {(peakEnergy * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="rounded-lg p-4 text-center" style={{ background: 'hsl(20 25% 12% / 0.5)' }}>
                    <div className="text-xs mb-1" style={{ color: 'hsl(30 20% 50%)' }}>Thermal Δ</div>
                    <div className="text-2xl font-mono font-bold" style={{ color: getThermalColor(globalTemp) }}>
                      {(globalTemp - THERMAL_CONSTANTS.BASE_TEMP) > 0 ? '+' : ''}{(globalTemp - THERMAL_CONSTANTS.BASE_TEMP).toFixed(1)}°
                    </div>
                  </div>
                </div>
              </div>

              {/* Algorithm Info */}
              <div className="rounded-2xl p-6 backdrop-blur-xl" style={{ background: 'hsl(20 25% 8% / 0.5)', border: '1px solid hsl(30 30% 20%)' }}>
                <h3 className="text-sm font-medium mb-4" style={{ color: 'hsl(40 30% 65%)' }}>THERMAL RESONANCE SYSTEM™</h3>
                <div className="space-y-3 text-xs" style={{ color: 'hsl(30 20% 50%)' }}>
                  <div className="flex justify-between">
                    <span>Energy Coefficient</span>
                    <span className="font-mono" style={{ color: 'hsl(40 30% 65%)' }}>{THERMAL_CONSTANTS.ENERGY_COEFFICIENT}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thermal Inertia</span>
                    <span className="font-mono" style={{ color: 'hsl(40 30% 65%)' }}>{THERMAL_CONSTANTS.THERMAL_INERTIA}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hysteresis Factor</span>
                    <span className="font-mono" style={{ color: 'hsl(40 30% 65%)' }}>{THERMAL_CONSTANTS.HYSTERESIS_FACTOR}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bass Weight</span>
                    <span className="font-mono" style={{ color: 'hsl(40 30% 65%)' }}>{THERMAL_CONSTANTS.SPECTRAL_WEIGHT_LOW}x</span>
                  </div>
                </div>
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid hsl(30 30% 20%)' }}>
                  <p className="text-xs italic" style={{ color: 'hsl(30 15% 40%)' }}>
                    Material thermal response simulates phase-change alloy behavior 
                    in future STRATA-equipped consoles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
        </>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ThermalMusicVisualizer;
