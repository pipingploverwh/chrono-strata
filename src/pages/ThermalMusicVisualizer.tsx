import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Upload, Thermometer, Volume2, Activity, Disc, ArrowLeft, Monitor, Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import StrataEmbeddedDisplay from '@/components/strata/StrataEmbeddedDisplay';

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

  // Get color based on temperature
  const getThermalColor = (temp: number): string => {
    const normalized = (temp - THERMAL_CONSTANTS.MIN_TEMP) / 
      (THERMAL_CONSTANTS.MAX_TEMP - THERMAL_CONSTANTS.MIN_TEMP);
    
    if (normalized < 0.2) {
      // Cryogenic blue
      return `hsl(210, 90%, ${30 + normalized * 100}%)`;
    } else if (normalized < 0.4) {
      // Cool cyan
      return `hsl(${180 + (normalized - 0.2) * 100}, 80%, 50%)`;
    } else if (normalized < 0.6) {
      // Neutral to warm
      return `hsl(${60 - (normalized - 0.4) * 200}, 70%, 50%)`;
    } else if (normalized < 0.8) {
      // Orange/hot
      return `hsl(${30 - (normalized - 0.6) * 100}, 85%, 50%)`;
    } else {
      // Red hot
      return `hsl(${0 - (normalized - 0.8) * 50}, 90%, ${45 + (normalized - 0.8) * 50}%)`;
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
    <div className={`min-h-screen bg-zinc-950 text-white overflow-hidden transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[100]' : ''}`}>
      <audio ref={audioRef} />
      
      {/* Fullscreen Immersive Mode */}
      {isFullscreen ? (
        <div className="relative w-full h-full flex flex-col">
          {/* Minimal floating controls */}
          <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsFullscreen(false)}
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </Button>
              <span className="text-sm font-light tracking-[0.3em] text-emerald-400 opacity-60">THERMAL RESONANCE</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={togglePlayback}
                disabled={!audioFile}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </Button>
              <div 
                className="px-4 py-2 bg-zinc-900/80 backdrop-blur-xl rounded-lg border border-zinc-700 font-mono text-lg font-bold"
                style={{ color: getThermalColor(globalTemp) }}
              >
                {globalTemp.toFixed(1)}°C
              </div>
            </div>
          </div>

          {/* Immersive Thermal Visualization */}
          <div 
            className="flex-1 relative"
            style={{
              background: `radial-gradient(ellipse at center, ${getThermalColor(globalTemp)} 0%, ${getThermalColor(globalTemp - 20)} 50%, hsl(0, 0%, 5%) 100%)`,
              transition: 'background 0.15s ease-out',
            }}
          >
            {/* Ambient thermal particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full animate-pulse"
                  style={{
                    left: `${10 + (i * 3) % 80}%`,
                    top: `${15 + (i * 7) % 70}%`,
                    width: `${4 + spectralData.energy * 20}px`,
                    height: `${4 + spectralData.energy * 20}px`,
                    background: getThermalColor(globalTemp + (i % 10) - 5),
                    boxShadow: `0 0 ${20 + spectralData.energy * 30}px ${getThermalColor(globalTemp)}`,
                    opacity: 0.3 + spectralData.energy * 0.5,
                    animationDelay: `${i * 100}ms`,
                    animationDuration: `${1500 + i * 50}ms`,
                  }}
                />
              ))}
            </div>

            {/* Central console visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-6xl aspect-[2.5/1] mx-8">
                {/* Console glow backdrop */}
                <div 
                  className="absolute inset-0 rounded-3xl blur-3xl opacity-50"
                  style={{ background: getThermalColor(globalTemp) }}
                />
                
                {/* Console body */}
                <div 
                  className="relative h-full rounded-3xl border-2 overflow-hidden"
                  style={{
                    background: `linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%)`,
                    borderColor: `${getThermalColor(globalTemp)}60`,
                    boxShadow: `
                      0 0 60px ${getThermalColor(globalTemp)}40,
                      inset 0 0 100px rgba(0,0,0,0.8)
                    `,
                  }}
                >
                  {/* Thermal zones */}
                  {thermalZones.map(zone => (
                    <div
                      key={zone.id}
                      className="absolute rounded-xl transition-all duration-150 flex items-center justify-center"
                      style={{
                        left: `${zone.x}%`,
                        top: `${zone.y}%`,
                        width: `${zone.width}%`,
                        height: `${zone.height}%`,
                        background: `linear-gradient(135deg, ${getThermalColor(zone.temperature)} 0%, ${getThermalColor(zone.temperature - 10)} 100%)`,
                        boxShadow: `0 0 ${30 + zone.temperature / 2}px ${getThermalColor(zone.temperature)}`,
                      }}
                    >
                      {zone.id.includes('deck') && (
                        <Disc 
                          className="w-16 h-16 text-white/80" 
                          style={{ 
                            animation: isPlaying ? 'spin 1.5s linear infinite' : 'none',
                            filter: `drop-shadow(0 0 10px ${getThermalColor(zone.temperature)})`,
                          }} 
                        />
                      )}
                    </div>
                  ))}

                  {/* Embedded STRATA Displays - Larger in fullscreen */}
                  <div className="absolute top-[3%] left-[3%] w-[28%]">
                    <StrataEmbeddedDisplay
                      temperature={thermalZones.find(z => z.id === 'left-deck')?.temperature || globalTemp}
                      spectralEnergy={spectralData.energy}
                      bpm={bpm}
                      isPlaying={isPlaying}
                      displayId="left"
                    />
                  </div>
                  <div className="absolute top-[3%] left-[36%] w-[28%]">
                    <StrataEmbeddedDisplay
                      temperature={thermalZones.find(z => z.id === 'mixer')?.temperature || globalTemp}
                      spectralEnergy={spectralData.energy}
                      bpm={bpm}
                      isPlaying={isPlaying}
                      displayId="center"
                    />
                  </div>
                  <div className="absolute top-[3%] right-[3%] w-[28%]">
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

            {/* Bottom metrics bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pt-16 pb-6 px-8">
              <div className="max-w-6xl mx-auto">
                {/* Spectral bars */}
                <div className="flex items-end justify-center gap-1 h-24 mb-4">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const segment = i < 20 ? 'low' : i < 45 ? 'mid' : 'high';
                    const value = segment === 'low' ? spectralData.low : segment === 'mid' ? spectralData.mid : spectralData.high;
                    const height = Math.max(4, value * (0.8 + Math.sin(i * 0.3 + Date.now() * 0.005) * 0.2));
                    return (
                      <div
                        key={i}
                        className="w-1.5 rounded-full transition-all duration-75"
                        style={{
                          height: `${height}%`,
                          background: getThermalColor(globalTemp - 10 + (i / 64) * 30),
                          boxShadow: `0 0 8px ${getThermalColor(globalTemp)}`,
                        }}
                      />
                    );
                  })}
                </div>
                
                {/* Metrics row */}
                <div className="flex items-center justify-between text-sm font-mono">
                  <div className="flex items-center gap-8">
                    <div>
                      <span className="text-zinc-500">BPM</span>
                      <span className="ml-2 text-lg font-bold" style={{ color: getThermalColor(globalTemp) }}>{bpm || '---'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">ENERGY</span>
                      <span className="ml-2 text-lg font-bold" style={{ color: getThermalColor(globalTemp) }}>{(spectralData.energy * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="text-zinc-600 text-xs">
                    Press <kbd className="px-2 py-0.5 bg-zinc-800 rounded mx-1">ESC</kbd> to exit • <kbd className="px-2 py-0.5 bg-zinc-800 rounded mx-1">SPACE</kbd> to play/pause
                  </div>
                  <div className="flex items-center gap-8">
                    <div>
                      <span className="text-zinc-500">LOW</span>
                      <span className="ml-2 text-lg font-bold text-red-400">{spectralData.low.toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">MID</span>
                      <span className="ml-2 text-lg font-bold text-yellow-400">{spectralData.mid.toFixed(0)}%</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">HIGH</span>
                      <span className="ml-2 text-lg font-bold text-cyan-400">{spectralData.high.toFixed(0)}%</span>
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
          <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/50">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back</span>
                </Link>
                <div className="h-4 w-px bg-zinc-700" />
                <span className="text-sm font-light tracking-[0.3em] text-emerald-400">THERMAL RESONANCE</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-zinc-400">
                <Button
                  onClick={() => setIsFullscreen(true)}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 hover:text-emerald-400"
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
                <h1 className="text-5xl md:text-6xl font-extralight tracking-wide mb-4">
                  Music <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-orange-500">Temperature</span> Visualizer
                </h1>
                <p className="text-zinc-400 max-w-2xl mx-auto">
                  Proprietary thermal mapping algorithm converts audio spectral energy into 
                  real-time material temperature response. Watch the console adapt from cryogenic 
                  blues to incandescent oranges based on your music's energy.
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-6 mb-12">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-6 py-3 bg-zinc-900/80 border border-zinc-700 rounded-lg cursor-pointer hover:border-emerald-500/50 transition-colors">
                    <Upload className="w-5 h-5 text-emerald-400" />
                    <span>{audioFile ? audioFile.name : 'Upload Audio File'}</span>
                    <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <Button
                    onClick={togglePlayback}
                    disabled={!audioFile}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </Button>
                  <Button
                    onClick={() => setIsFullscreen(true)}
                    variant="outline"
                    className="flex items-center gap-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Immersive Mode</span>
                  </Button>
                </div>
                <p className="text-xs text-zinc-500">Press <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">F</kbd> for fullscreen</p>
              </div>

          {/* Main Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* DJ Console Thermal View */}
            <div className="lg:col-span-2">
              <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 backdrop-blur-xl">
                <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
                  <Thermometer className="w-4 h-4" />
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
                  {/* Console body outline */}
                  <div className="absolute inset-4 rounded-2xl border-2 border-white/20 backdrop-blur-sm bg-zinc-950/30">
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
                  <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-xl rounded-lg px-4 py-2 border border-zinc-700">
                    <div className="flex items-center gap-3">
                      <Thermometer className="w-5 h-5 text-emerald-400" />
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
                        <div className="text-xs text-white/60 mb-1">{zone.name}</div>
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
                  <h4 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
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
                  <p className="text-xs text-zinc-500 mt-3 text-center">
                    STRATA displays adapt color temperature and glow intensity based on real-time audio spectral analysis
                  </p>
                </div>

                {/* Temperature Scale */}
                <div className="mt-4 relative h-6">
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `linear-gradient(to right, 
                        hsl(210, 90%, 40%) 0%, 
                        hsl(180, 80%, 50%) 25%, 
                        hsl(60, 70%, 50%) 50%, 
                        hsl(30, 85%, 50%) 75%, 
                        hsl(0, 90%, 50%) 100%)`
                    }}
                  />
                  <div className="absolute inset-0 flex justify-between items-center px-4 text-xs font-mono">
                    <span className="text-blue-300">{THERMAL_CONSTANTS.MIN_TEMP}°C</span>
                    <span className="text-cyan-300">5°C</span>
                    <span className="text-green-300">25°C</span>
                    <span className="text-yellow-300">45°C</span>
                    <span className="text-orange-300">65°C</span>
                    <span className="text-red-300">{THERMAL_CONSTANTS.MAX_TEMP}°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Panel */}
            <div className="space-y-6">
              {/* Spectral Analysis */}
              <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 backdrop-blur-xl">
                <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  SPECTRAL ENERGY ANALYSIS
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-500">LOW (Bass)</span>
                      <span className="text-zinc-400">{spectralData.low.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-75"
                        style={{ width: `${spectralData.low}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-500">MID (Vocals)</span>
                      <span className="text-zinc-400">{spectralData.mid.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-500 to-green-500 transition-all duration-75"
                        style={{ width: `${spectralData.mid}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-500">HIGH (Treble)</span>
                      <span className="text-zinc-400">{spectralData.high.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-75"
                        style={{ width: `${spectralData.high}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Energy Metrics */}
              <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 backdrop-blur-xl">
                <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  PROPRIETARY METRICS
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                    <div className="text-xs text-zinc-500 mb-1">Energy Density</div>
                    <div className="text-2xl font-mono font-bold text-emerald-400">
                      {(spectralData.energy * 100).toFixed(1)}
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                    <div className="text-xs text-zinc-500 mb-1">Est. BPM</div>
                    <div className="text-2xl font-mono font-bold text-orange-400">
                      {bpm || '---'}
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                    <div className="text-xs text-zinc-500 mb-1">Peak Energy</div>
                    <div className="text-2xl font-mono font-bold text-cyan-400">
                      {(peakEnergy * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
                    <div className="text-xs text-zinc-500 mb-1">Thermal Δ</div>
                    <div className="text-2xl font-mono font-bold" style={{ color: getThermalColor(globalTemp) }}>
                      {(globalTemp - THERMAL_CONSTANTS.BASE_TEMP) > 0 ? '+' : ''}{(globalTemp - THERMAL_CONSTANTS.BASE_TEMP).toFixed(1)}°
                    </div>
                  </div>
                </div>
              </div>

              {/* Algorithm Info */}
              <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 backdrop-blur-xl">
                <h3 className="text-sm font-medium text-zinc-400 mb-4">THERMAL RESONANCE SYSTEM™</h3>
                <div className="space-y-3 text-xs text-zinc-500">
                  <div className="flex justify-between">
                    <span>Energy Coefficient</span>
                    <span className="font-mono text-zinc-400">{THERMAL_CONSTANTS.ENERGY_COEFFICIENT}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thermal Inertia</span>
                    <span className="font-mono text-zinc-400">{THERMAL_CONSTANTS.THERMAL_INERTIA}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hysteresis Factor</span>
                    <span className="font-mono text-zinc-400">{THERMAL_CONSTANTS.HYSTERESIS_FACTOR}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bass Weight</span>
                    <span className="font-mono text-zinc-400">{THERMAL_CONSTANTS.SPECTRAL_WEIGHT_LOW}x</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-xs text-zinc-600 italic">
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
