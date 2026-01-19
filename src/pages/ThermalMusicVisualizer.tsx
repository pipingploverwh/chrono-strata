import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Upload, Thermometer, Volume2, Activity, Disc, ArrowLeft, Monitor, Maximize2, Minimize2, X, Sparkles, Loader2, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import StrataEmbeddedDisplay from '@/components/strata/StrataEmbeddedDisplay';
import WaveformVisualization from '@/components/strata/WaveformVisualization';
import PsychoacousticVisualization from '@/components/PsychoacousticVisualization';
import PsychoacousticPresetSelector, { PSYCHOACOUSTIC_PRESETS, type PsychoacousticPreset } from '@/components/PsychoacousticPresets';
import AudioIngestHub from '@/components/AudioIngestHub';
import LavandarBackground from '@/components/LavandarBackground';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VINYL_COLLECTION } from '@/components/SpatialAudioCAD';
// ═══════════════════════════════════════════════════════════════════════════
// REIMAGINED THERMAL ALGORITHM v2.0
// First-Principles Audio-Thermal Physics Engine
// ═══════════════════════════════════════════════════════════════════════════

// Physical constants derived from thermodynamics and psychoacoustics
const PHYSICS = {
  // Thermal properties (based on copper-aluminum hybrid material)
  SPECIFIC_HEAT: 0.385,      // J/(g·K) - thermal capacity
  THERMAL_CONDUCTIVITY: 205, // W/(m·K) - heat transfer rate
  AMBIENT_TEMP: 20,          // °C - equilibrium temperature
  TEMP_RANGE: [-25, 95],     // °C - operational range
  
  // Acoustic energy conversion (based on SPL physics)
  REFERENCE_SPL: 20e-6,      // Pa - threshold of hearing
  MAX_SPL: 130,              // dB - pain threshold
  ENERGY_TO_HEAT: 0.0012,    // Conversion efficiency (J/dB)
  
  // Psychoacoustic weights (ISO 226:2003 equal-loudness contours)
  BARK_BANDS: 24,            // Critical bands of human hearing
  FLETCHER_MUNSON: [
    0.2, 0.4, 0.6, 0.8, 0.95, 1.0, 1.0, 0.95, // Low-mid emphasis
    0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, // Mid rolloff
    0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15  // High attenuation
  ],
  
  // Material response characteristics
  INERTIA_MASS: 0.85,        // Thermal mass factor
  DIFFUSION_RATE: 0.12,      // Heat spread coefficient
  EMISSIVITY: 0.78,          // Radiative cooling factor
};

// Spectral analysis configuration
const SPECTRAL = {
  // Frequency band boundaries (Hz) - based on octave bands
  BANDS: {
    SUB_BASS: [20, 60],      // Sub-bass: physical pressure
    BASS: [60, 250],         // Bass: warmth, body
    LOW_MID: [250, 500],     // Low-mid: fullness
    MID: [500, 2000],        // Mid: presence, clarity
    HIGH_MID: [2000, 4000],  // High-mid: edge, bite
    PRESENCE: [4000, 6000],  // Presence: brilliance
    BRILLIANCE: [6000, 20000] // Brilliance: air, sparkle
  },
  
  // Band-specific thermal coefficients (energy-to-heat)
  THERMAL_WEIGHTS: {
    SUB_BASS: 1.8,    // Heavy thermal impact
    BASS: 1.5,        // Strong thermal response
    LOW_MID: 1.2,     // Moderate warmth
    MID: 1.0,         // Reference
    HIGH_MID: 0.7,    // Reduced thermal
    PRESENCE: 0.4,    // Light contribution
    BRILLIANCE: 0.2   // Minimal heat
  }
};

// Advanced algorithm state
interface AlgorithmState {
  prevSpectrum: Float32Array;
  spectralFlux: number;
  transientBuffer: number[];
  harmonicHistory: number[];
  thermalMomentum: number;
  phaseCoherence: number;
}

interface ThermalZone {
  id: string;
  name: string;
  temperature: number;
  thermalMass: number;      // Zone-specific thermal capacity
  heatTransfer: number;     // Zone heat exchange rate
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
  // Advanced metrics
  spectralFlux: number;        // Rate of spectral change
  harmonicComplexity: number;  // Harmonic richness (0-1)
  transientSharpness: number;  // Attack detection (0-1)
  crestFactor: number;         // Peak-to-RMS ratio
  zeroCrossingRate: number;    // Brightness indicator
}

const ThermalMusicVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [globalTemp, setGlobalTemp] = useState(PHYSICS.AMBIENT_TEMP);
  const [spectralData, setSpectralData] = useState<SpectralBand>({ 
    low: 0, mid: 0, high: 0, energy: 0,
    spectralFlux: 0, harmonicComplexity: 0, transientSharpness: 0,
    crestFactor: 0, zeroCrossingRate: 0
  });
  const [thermalZones, setThermalZones] = useState<ThermalZone[]>([
    { id: 'left-deck', name: 'Left Turntable', temperature: 20, thermalMass: 0.88, heatTransfer: 0.04, x: 10, y: 30, width: 25, height: 40 },
    { id: 'mixer', name: 'Mixer Core', temperature: 20, thermalMass: 0.75, heatTransfer: 0.08, x: 37.5, y: 25, width: 25, height: 50 },
    { id: 'right-deck', name: 'Right Turntable', temperature: 20, thermalMass: 0.88, heatTransfer: 0.04, x: 65, y: 30, width: 25, height: 40 },
    { id: 'vinyl-left', name: 'Left Vinyl Bay', temperature: 20, thermalMass: 0.92, heatTransfer: 0.03, x: 5, y: 75, width: 20, height: 20 },
    { id: 'vinyl-right', name: 'Right Vinyl Bay', temperature: 20, thermalMass: 0.92, heatTransfer: 0.03, x: 75, y: 75, width: 20, height: 20 },
  ]);
  const [bpm, setBpm] = useState(0);
  const [peakEnergy, setPeakEnergy] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>(new Array(128).fill(128));
  
  // Magic generation state
  const [isGeneratingMagic, setIsGeneratingMagic] = useState(false);
  const [magicAudio, setMagicAudio] = useState<HTMLAudioElement | null>(null);
  const [magicAudioBase64, setMagicAudioBase64] = useState<string | null>(null);
  const [isMagicPlaying, setIsMagicPlaying] = useState(false);
  const [magicAnalysis, setMagicAnalysis] = useState<{
    mood: string;
    thermalIntensity: string;
    frequencyProfile: string;
    tempoFeel: string;
    emotionalTone: string;
    psychoacousticProfile?: {
      soundstage: {
        stereoWidth: string;
        depthPlacement: string;
        verticality: {
          subBass: number;
          midRange: number;
          airBand: number;
        };
      };
      timbre: {
        character: string;
        saturation: string;
        texture: string;
      };
      dynamics: {
        attack: string;
        decay: string;
        noiseFloor: string;
      };
      diffusion: {
        reverb: string;
        spaceCharacter: string;
      };
    };
  } | null>(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  // Psychoacoustic preset state
  const [activePreset, setActivePreset] = useState<string>('neutral');

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
  const prevTempRef = useRef(PHYSICS.AMBIENT_TEMP);

  // ═══════════════════════════════════════════════════════════════════════
  // FIRST-PRINCIPLES THERMAL PHYSICS ENGINE
  // ═══════════════════════════════════════════════════════════════════════

  // Algorithm state for temporal analysis
  const algorithmStateRef = useRef<AlgorithmState>({
    prevSpectrum: new Float32Array(1024),
    spectralFlux: 0,
    transientBuffer: new Array(8).fill(0),
    harmonicHistory: new Array(16).fill(0),
    thermalMomentum: 0,
    phaseCoherence: 0,
  });

  // Calculate acoustic pressure level (SPL) from frequency data
  const calculateSPL = useCallback((frequencyData: Uint8Array): number => {
    let sumSquares = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      const amplitude = frequencyData[i] / 255;
      sumSquares += amplitude * amplitude;
    }
    const rms = Math.sqrt(sumSquares / frequencyData.length);
    // Convert to dB scale (20 * log10(rms / reference))
    const db = rms > 0 ? 20 * Math.log10(rms + 0.0001) + 80 : 0;
    return Math.max(0, Math.min(db, PHYSICS.MAX_SPL));
  }, []);

  // Calculate spectral flux (rate of spectral change)
  const calculateSpectralFlux = useCallback((currentSpectrum: Float32Array): number => {
    const state = algorithmStateRef.current;
    let flux = 0;
    
    for (let i = 0; i < currentSpectrum.length; i++) {
      const diff = currentSpectrum[i] - state.prevSpectrum[i];
      // Only count positive changes (onset detection)
      if (diff > 0) {
        flux += diff * diff;
      }
    }
    
    // Update previous spectrum
    state.prevSpectrum.set(currentSpectrum);
    
    return Math.sqrt(flux / currentSpectrum.length);
  }, []);

  // Calculate harmonic complexity using autocorrelation
  const calculateHarmonicComplexity = useCallback((frequencyData: Uint8Array): number => {
    // Find peaks in spectrum
    const peaks: number[] = [];
    for (let i = 2; i < frequencyData.length - 2; i++) {
      if (frequencyData[i] > frequencyData[i-1] && 
          frequencyData[i] > frequencyData[i+1] &&
          frequencyData[i] > 40) { // Threshold
        peaks.push(i);
      }
    }
    
    // More peaks = more harmonic complexity
    const complexity = Math.min(1, peaks.length / 20);
    
    // Smooth with history
    const state = algorithmStateRef.current;
    state.harmonicHistory.shift();
    state.harmonicHistory.push(complexity);
    
    return state.harmonicHistory.reduce((a, b) => a + b) / state.harmonicHistory.length;
  }, []);

  // Calculate transient sharpness (attack detection)
  const calculateTransientSharpness = useCallback((spectralFlux: number): number => {
    const state = algorithmStateRef.current;
    
    // Add current flux to buffer
    state.transientBuffer.shift();
    state.transientBuffer.push(spectralFlux);
    
    // Calculate variance - high variance = transients
    const mean = state.transientBuffer.reduce((a, b) => a + b) / state.transientBuffer.length;
    const variance = state.transientBuffer.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / state.transientBuffer.length;
    
    return Math.min(1, Math.sqrt(variance) * 5);
  }, []);

  // Calculate crest factor (peak to RMS ratio)
  const calculateCrestFactor = useCallback((frequencyData: Uint8Array): number => {
    let peak = 0;
    let sumSquares = 0;
    
    for (let i = 0; i < frequencyData.length; i++) {
      const val = frequencyData[i] / 255;
      if (val > peak) peak = val;
      sumSquares += val * val;
    }
    
    const rms = Math.sqrt(sumSquares / frequencyData.length);
    return rms > 0 ? Math.min(1, (peak / rms - 1) / 3) : 0;
  }, []);

  // Calculate zero-crossing rate from time domain (brightness indicator)
  const calculateZeroCrossingRate = useCallback((timeDomainData: Uint8Array): number => {
    let crossings = 0;
    const midpoint = 128;
    
    for (let i = 1; i < timeDomainData.length; i++) {
      if ((timeDomainData[i-1] < midpoint && timeDomainData[i] >= midpoint) ||
          (timeDomainData[i-1] >= midpoint && timeDomainData[i] < midpoint)) {
        crossings++;
      }
    }
    
    return Math.min(1, crossings / (timeDomainData.length * 0.1));
  }, []);

  // Multi-band spectral analysis with psychoacoustic weighting
  // NOW APPLIES ACTIVE PRESET BAND WEIGHTS
  const analyzeSpectralBands = useCallback((
    frequencyData: Uint8Array, 
    sampleRate: number = 44100
  ): { bands: Record<string, number>; weightedEnergy: number } => {
    const binCount = frequencyData.length;
    const binWidth = sampleRate / (binCount * 2);
    const bands: Record<string, number> = {};
    let totalWeightedEnergy = 0;
    let totalWeight = 0;
    
    // Get active preset for band weight modulation
    const preset = PSYCHOACOUSTIC_PRESETS.find(p => p.id === activePreset) || PSYCHOACOUSTIC_PRESETS[0];
    const presetWeights = preset.bandWeights;
    
    Object.entries(SPECTRAL.BANDS).forEach(([name, [lowHz, highHz]]) => {
      const lowBin = Math.floor(lowHz / binWidth);
      const highBin = Math.min(Math.ceil(highHz / binWidth), binCount - 1);
      
      let bandEnergy = 0;
      for (let i = lowBin; i <= highBin; i++) {
        bandEnergy += frequencyData[i] / 255;
      }
      
      const normalizedEnergy = bandEnergy / (highBin - lowBin + 1);
      const baseWeight = SPECTRAL.THERMAL_WEIGHTS[name as keyof typeof SPECTRAL.THERMAL_WEIGHTS];
      
      // Apply preset band weight modifier
      let presetModifier = 1.0;
      switch (name) {
        case 'SUB_BASS': presetModifier = presetWeights.subBass; break;
        case 'BASS': presetModifier = presetWeights.bass; break;
        case 'LOW_MID': presetModifier = presetWeights.lowMid; break;
        case 'MID': presetModifier = presetWeights.mid; break;
        case 'HIGH_MID': presetModifier = presetWeights.highMid; break;
        case 'PRESENCE': presetModifier = presetWeights.presence; break;
        case 'BRILLIANCE': presetModifier = presetWeights.brilliance; break;
      }
      
      const modifiedWeight = baseWeight * presetModifier;
      bands[name] = normalizedEnergy * presetModifier; // Apply preset to band value
      totalWeightedEnergy += normalizedEnergy * modifiedWeight;
      totalWeight += modifiedWeight;
    });
    
    return { 
      bands, 
      weightedEnergy: totalWeight > 0 ? totalWeightedEnergy / totalWeight : 0 
    };
  }, [activePreset]);

  // MAIN THERMAL RESPONSE ALGORITHM
  // NOW INTEGRATES PRESET EFFECTS FOR REAL-TIME MODULATION
  const calculateThermalResponse = useCallback((
    frequencyData: Uint8Array,
    timeDomainData: Uint8Array
  ): SpectralBand => {
    // Get active preset for thermal modulation
    const preset = PSYCHOACOUSTIC_PRESETS.find(p => p.id === activePreset) || PSYCHOACOUSTIC_PRESETS[0];
    
    // 1. Calculate acoustic pressure level
    const spl = calculateSPL(frequencyData);
    
    // 2. Convert to float spectrum for flux calculation
    const floatSpectrum = new Float32Array(frequencyData.length);
    for (let i = 0; i < frequencyData.length; i++) {
      floatSpectrum[i] = frequencyData[i] / 255;
    }
    
    // 3. Calculate spectral flux (rate of change)
    let spectralFlux = calculateSpectralFlux(floatSpectrum);
    
    // 4. Analyze frequency bands with psychoacoustic weighting (now preset-aware)
    const { bands, weightedEnergy } = analyzeSpectralBands(frequencyData);
    
    // 5. Calculate harmonic complexity - modulated by preset
    let harmonicComplexity = calculateHarmonicComplexity(frequencyData);
    harmonicComplexity *= (0.7 + preset.harmonicEnhancement * 0.6); // Preset harmonic boost
    
    // 6. Detect transients - modulated by preset
    let transientSharpness = calculateTransientSharpness(spectralFlux);
    transientSharpness *= preset.transientPreservation; // Preset transient control
    
    // 7. Calculate crest factor
    const crestFactor = calculateCrestFactor(frequencyData);
    
    // 8. Calculate zero-crossing rate
    const zeroCrossingRate = calculateZeroCrossingRate(timeDomainData);
    
    // 9. Combine into simplified bands for display (preset-weighted)
    const low = ((bands.SUB_BASS || 0) * 0.4 + (bands.BASS || 0) * 0.6) * 100;
    const mid = ((bands.LOW_MID || 0) * 0.3 + (bands.MID || 0) * 0.5 + (bands.HIGH_MID || 0) * 0.2) * 100;
    const high = ((bands.PRESENCE || 0) * 0.5 + (bands.BRILLIANCE || 0) * 0.5) * 100;
    
    // 10. Calculate composite thermal energy with PRESET TEMPERATURE BIAS
    // Formula: E = (SPL/MAX_SPL) × (1 + flux) × (1 + transient×0.5) × harmonicMod
    const normalizedSPL = spl / PHYSICS.MAX_SPL;
    
    // Apply spatial diffusion from preset (affects flux perception)
    const diffusedFlux = spectralFlux * (1 - preset.spatialDiffusion * 0.3);
    const fluxBoost = 1 + diffusedFlux * 2;
    
    const transientBoost = 1 + transientSharpness * 0.5;
    const harmonicMod = 0.7 + harmonicComplexity * 0.6;
    
    const rawEnergy = normalizedSPL * fluxBoost * transientBoost * harmonicMod;
    
    // Apply temperature bias from preset (-1 to 1 range)
    // Positive bias = warmer response, negative = cooler
    const tempBiasMultiplier = 1 + (preset.temperatureBias * 0.25);
    const biasedEnergy = Math.min(1, rawEnergy * PHYSICS.ENERGY_TO_HEAT * 1000 * tempBiasMultiplier);
    
    return {
      low: Math.min(100, low),
      mid: Math.min(100, mid),
      high: Math.min(100, high),
      energy: biasedEnergy,
      spectralFlux: diffusedFlux,
      harmonicComplexity,
      transientSharpness,
      crestFactor,
      zeroCrossingRate,
    };
  }, [activePreset, calculateSPL, calculateSpectralFlux, analyzeSpectralBands, calculateHarmonicComplexity, calculateTransientSharpness, calculateCrestFactor, calculateZeroCrossingRate]);

  // THERMAL DIFFUSION MODEL
  // Based on Newton's law of cooling with thermal mass
  const energyToTemperature = useCallback((
    spectral: SpectralBand, 
    prevTemp: number
  ): number => {
    const state = algorithmStateRef.current;
    
    // Calculate target temperature from energy
    const [minTemp, maxTemp] = PHYSICS.TEMP_RANGE;
    const energyTemp = minTemp + (spectral.energy * (maxTemp - minTemp));
    
    // Add transient spikes (percussion creates heat bursts)
    const transientHeat = spectral.transientSharpness * 15;
    
    // Harmonic richness adds sustained warmth
    const harmonicWarmth = spectral.harmonicComplexity * 8;
    
    // Spectral flux adds volatility
    const fluxHeat = spectral.spectralFlux * 10;
    
    const targetTemp = energyTemp + transientHeat + harmonicWarmth + fluxHeat;
    
    // Apply thermal diffusion (Newton's law of cooling)
    // dT/dt = -k(T - T_ambient) + Q_input
    const coolingRate = PHYSICS.DIFFUSION_RATE * PHYSICS.EMISSIVITY;
    const heatingRate = 1 - PHYSICS.INERTIA_MASS;
    
    // Thermal momentum (prevents jitter)
    const momentum = state.thermalMomentum * 0.7;
    const newMomentum = (targetTemp - prevTemp) * 0.3;
    state.thermalMomentum = momentum + newMomentum;
    
    // Calculate new temperature with physics-based smoothing
    const ambientPull = (PHYSICS.AMBIENT_TEMP - prevTemp) * coolingRate * 0.1;
    const targetPull = (targetTemp - prevTemp) * heatingRate;
    
    let newTemp = prevTemp + targetPull + ambientPull + state.thermalMomentum * 0.1;
    
    // Clamp to operational range
    newTemp = Math.max(minTemp, Math.min(maxTemp, newTemp));
    
    return newTemp;
  }, []);

  // Zone-specific thermal response with heat transfer physics
  const calculateZoneThermals = useCallback((
    spectral: SpectralBand, 
    baseTemp: number,
    prevZones: ThermalZone[]
  ): ThermalZone[] => {
    return prevZones.map(zone => {
      // Zone-specific frequency sensitivity
      let frequencyResponse = 0;
      let transientSensitivity = 0;
      
      switch (zone.id) {
        case 'left-deck':
        case 'right-deck':
          // Turntables: bass-heavy, transient responsive
          frequencyResponse = (spectral.low * 0.7 + spectral.mid * 0.3) / 100;
          transientSensitivity = 0.8;
          break;
        case 'mixer':
          // Mixer: full spectrum, flux sensitive
          frequencyResponse = spectral.energy;
          transientSensitivity = 0.5;
          break;
        case 'vinyl-left':
        case 'vinyl-right':
          // Vinyl bays: high thermal mass, slow response
          frequencyResponse = (spectral.low * 0.5 + spectral.mid * 0.5) / 100;
          transientSensitivity = 0.2;
          break;
        default:
          frequencyResponse = spectral.energy;
          transientSensitivity = 0.5;
      }
      
      // Calculate zone target temperature
      const transientBoost = spectral.transientSharpness * transientSensitivity * 10;
      const harmonicBoost = spectral.harmonicComplexity * 5;
      const targetTemp = baseTemp * (0.8 + frequencyResponse * 0.4) + transientBoost + harmonicBoost;
      
      // Apply zone-specific thermal inertia
      const thermalMass = zone.thermalMass || 0.85;
      const prevTemp = zone.temperature;
      const newTemp = prevTemp * thermalMass + targetTemp * (1 - thermalMass);
      
      // Heat transfer between adjacent zones
      const heatTransfer = zone.heatTransfer || 0.05;
      const neighborInfluence = (baseTemp - newTemp) * heatTransfer;
      
      return {
        ...zone,
        temperature: Math.max(PHYSICS.TEMP_RANGE[0], 
          Math.min(PHYSICS.TEMP_RANGE[1], newTemp + neighborInfluence)),
      };
    });
  }, []);

  // Get color based on temperature - Lavandar palette (purple/violet hues)
  // Matches the landing page aesthetic
  const getThermalColor = (temp: number): string => {
    const [minTemp, maxTemp] = PHYSICS.TEMP_RANGE;
    const normalized = (temp - minTemp) / (maxTemp - minTemp);
    
    // Lavandar color stages (cool purples to warm magentas)
    if (normalized < 0.15) {
      // Cold - Deep violet/purple
      const l = 15 + normalized * 40;
      return `hsl(270, 50%, ${l}%)`;
    } else if (normalized < 0.25) {
      // Warming - Richer purple
      const progress = (normalized - 0.15) / 0.1;
      const h = 270 + progress * 10;
      return `hsl(${h}, ${50 + progress * 15}%, ${20 + progress * 15}%)`;
    } else if (normalized < 0.4) {
      // Purple to violet
      const progress = (normalized - 0.25) / 0.15;
      return `hsl(${280 + progress * 10}, ${65 + progress * 10}%, ${35 + progress * 15}%)`;
    } else if (normalized < 0.55) {
      // Violet to magenta
      const progress = (normalized - 0.4) / 0.15;
      return `hsl(${290 + progress * 15}, 75%, ${50 + progress * 10}%)`;
    } else if (normalized < 0.7) {
      // Magenta to pink-magenta
      const progress = (normalized - 0.55) / 0.15;
      return `hsl(${305 + progress * 10}, ${75 + progress * 10}%, ${60 + progress * 10}%)`;
    } else if (normalized < 0.85) {
      // Pink-magenta to bright pink
      const progress = (normalized - 0.7) / 0.15;
      return `hsl(${315 + progress * 5}, ${85 - progress * 10}%, ${70 + progress * 10}%)`;
    } else {
      // Bright pink to luminous white-pink
      const progress = (normalized - 0.85) / 0.15;
      return `hsl(${320 - progress * 10}, ${75 - progress * 30}%, ${80 + progress * 15}%)`;
    }
  };

  // BPM detection (simplified beat detection)
  const detectBPM = useCallback((frequencyData: Uint8Array) => {
    const bassEnergy = frequencyData.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
    if (bassEnergy > 180) {
      setPeakEnergy(prev => Math.max(prev * 0.95, bassEnergy / 255));
    }
  }, []);

  // Animation loop - reimagined with physics-based processing
  const animate = useCallback(() => {
    if (!analyserRef.current) return;

    const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(frequencyData);

    // Capture time-domain waveform data for zero-crossing and visualization
    const timeDomainData = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(timeDomainData);
    
    // Sample 128 points from the waveform for visualization
    const sampledWaveform: number[] = [];
    const sampleRate = Math.floor(timeDomainData.length / 128);
    for (let i = 0; i < 128; i++) {
      sampledWaveform.push(timeDomainData[i * sampleRate]);
    }
    setWaveformData(sampledWaveform);

    // Calculate spectral response with advanced metrics
    const spectral = calculateThermalResponse(frequencyData, timeDomainData);
    setSpectralData(spectral);

    // Apply thermal diffusion model
    const newTemp = energyToTemperature(spectral, prevTempRef.current);
    prevTempRef.current = newTemp;
    setGlobalTemp(newTemp);

    // Calculate zone-specific temperatures with heat transfer
    setThermalZones(prevZones => calculateZoneThermals(spectral, newTemp, prevZones));

    detectBPM(frequencyData);

    // Advanced BPM estimation using transient detection
    if (spectral.transientSharpness > 0.3) {
      setBpm(prev => Math.round(prev * 0.92 + (60 + spectral.low * 1.2 + spectral.transientSharpness * 40) * 0.08));
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
      // Reset magic state when new file is uploaded
      setMagicAudio(null);
      setMagicAnalysis(null);
      setIsMagicPlaying(false);
    }
  };

  // Handle demo track selection
  const handleDemoTrackSelect = async (audioUrl: string, title: string) => {
    // Stop any current playback
    if (isPlaying) {
      togglePlayback();
    }
    
    // Create a synthetic file for display purposes
    const syntheticFile = new File([], `${title}.mp3`, { type: 'audio/mpeg' });
    setAudioFile(syntheticFile);
    
    // Set up audio element with demo URL
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    audioRef.current.src = audioUrl;
    audioRef.current.crossOrigin = 'anonymous';
    
    // Reset magic state
    setMagicAudio(null);
    setMagicAnalysis(null);
    setIsMagicPlaying(false);
    
    toast.success(`Loaded: ${title}`);
  };

  // Demo tracks for quick start (derived from VINYL_COLLECTION)
  const demoTracks = VINYL_COLLECTION.map(v => ({
    id: v.id,
    title: v.title,
    artist: v.artist,
    audioUrl: v.audioUrl,
  }));

  // Generate magic based on thermal analysis
  const generateMagic = async () => {
    if (!audioFile) {
      toast.error('Please upload an audio file first');
      return;
    }

    setIsGeneratingMagic(true);
    toast.info('Analyzing thermal signature...', { duration: 2000 });

    try {
      const response = await supabase.functions.invoke('thermal-magic', {
        body: {
          temperature: globalTemp,
          energy: spectralData.energy,
          lowFreq: spectralData.low,
          midFreq: spectralData.mid,
          highFreq: spectralData.high,
          bpm: bpm,
          fileName: audioFile.name,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const data = response.data;
      
      if (!data.success || !data.audioContent) {
        throw new Error(data.error || 'Failed to generate magic');
      }

      // Create audio element from base64
      const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      const audio = new Audio(audioUrl);
      audio.loop = true;
      
      setMagicAudio(audio);
      setMagicAudioBase64(data.audioContent);
      setMagicAnalysis(data.analysis);
      
      toast.success(`✨ Thermal magic generated! Mood: ${data.mood}`, { duration: 4000 });
    } catch (error) {
      console.error('Error generating magic:', error);
      toast.error('Failed to generate magic. Please try again.');
    } finally {
      setIsGeneratingMagic(false);
    }
  };

  // Toggle magic audio playback
  const toggleMagicPlayback = () => {
    if (!magicAudio) return;
    
    if (isMagicPlaying) {
      magicAudio.pause();
    } else {
      magicAudio.play();
    }
    setIsMagicPlaying(!isMagicPlaying);
  };

  // Download magic audio as MP3
  const downloadMagicAudio = () => {
    if (!magicAudioBase64) {
      toast.error('No magic audio to download');
      return;
    }

    // Convert base64 to blob
    const byteCharacters = atob(magicAudioBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/mpeg' });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename from original audio file and mood
    const baseName = audioFile?.name.replace(/\.[^/.]+$/, '') || 'audio';
    const mood = magicAnalysis?.mood || 'magic';
    link.download = `${baseName}-thermal-magic-${mood}.mp3`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Magic audio downloaded!');
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
    <div className={`min-h-screen text-white overflow-hidden transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[100]' : ''}`} style={{ background: 'hsl(270 30% 6%)' }}>
      <LavandarBackground variant="dark" showWaves={true} showPolygons={true} intensity={0.7} />
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
                style={{ background: 'hsl(280 25% 12% / 0.9)', borderColor: 'hsl(280 30% 30%)' }}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'hsl(300 40% 85%)' }} />
              </Button>
              <span className="hidden sm:block text-xs sm:text-sm font-light tracking-[0.2em] sm:tracking-[0.3em] opacity-80" style={{ color: 'hsl(300 70% 70%)' }}>
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
                  background: 'linear-gradient(135deg, hsl(280 60% 45%) 0%, hsl(320 70% 55%) 100%)',
                  boxShadow: '0 0 20px hsl(300 70% 50% / 0.4)'
                }}
              >
                {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />}
              </Button>
              <div 
                className="px-2 sm:px-4 py-1.5 sm:py-2 backdrop-blur-xl rounded-lg font-mono text-sm sm:text-lg font-bold"
                style={{ 
                  background: 'hsl(280 25% 12% / 0.9)', 
                  borderWidth: '1px',
                  borderColor: 'hsl(280 30% 30%)',
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
            <div className="absolute bottom-0 left-0 right-0 pt-8 sm:pt-16 pb-3 sm:pb-6 px-3 sm:px-8" style={{ background: 'linear-gradient(to top, hsl(270 30% 6%) 0%, hsl(270 30% 6% / 0.8) 50%, transparent 100%)' }}>
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
                <div className="flex items-center justify-between text-xs sm:text-sm font-mono" style={{ color: 'hsl(300 40% 85%)' }}>
                  {/* Left metrics */}
                  <div className="flex items-center gap-3 sm:gap-8">
                    <div>
                      <span style={{ color: 'hsl(280 30% 55%)' }} className="text-[10px] sm:text-sm">BPM</span>
                      <span className="ml-1 sm:ml-2 text-sm sm:text-lg font-bold" style={{ color: getThermalColor(globalTemp) }}>{bpm || '---'}</span>
                    </div>
                    <div className="hidden sm:block">
                      <span style={{ color: 'hsl(280 30% 55%)' }}>ENERGY</span>
                      <span className="ml-2 text-lg font-bold" style={{ color: getThermalColor(globalTemp) }}>{(spectralData.energy * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  
                  {/* Center hint - desktop only */}
                  <div className="hidden md:block text-xs" style={{ color: 'hsl(280 20% 45%)' }}>
                    <kbd className="px-1.5 py-0.5 rounded mx-1" style={{ background: 'hsl(280 25% 18%)' }}>ESC</kbd> exit
                    <span className="mx-2">•</span>
                    <kbd className="px-1.5 py-0.5 rounded mx-1" style={{ background: 'hsl(280 25% 18%)' }}>SPACE</kbd> play
                  </div>
                  
                  {/* Right metrics */}
                  <div className="flex items-center gap-2 sm:gap-8">
                    <div>
                      <span style={{ color: 'hsl(280 30% 55%)' }} className="text-[10px] sm:text-sm">LOW</span>
                      <span className="ml-1 sm:ml-2 text-sm sm:text-lg font-bold" style={{ color: 'hsl(270 70% 60%)' }}>{spectralData.low.toFixed(0)}%</span>
                    </div>
                    <div className="hidden xs:block">
                      <span style={{ color: 'hsl(280 30% 55%)' }} className="text-[10px] sm:text-sm">MID</span>
                      <span className="ml-1 sm:ml-2 text-sm sm:text-lg font-bold" style={{ color: 'hsl(300 70% 65%)' }}>{spectralData.mid.toFixed(0)}%</span>
                    </div>
                    <div>
                      <span style={{ color: 'hsl(280 30% 55%)' }} className="text-[10px] sm:text-sm">HIGH</span>
                      <span className="ml-1 sm:ml-2 text-sm sm:text-lg font-bold" style={{ color: 'hsl(320 70% 80%)' }}>{spectralData.high.toFixed(0)}%</span>
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
          <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ background: 'hsl(270 30% 8% / 0.9)', borderBottom: '1px solid hsl(280 30% 20% / 0.5)' }}>
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2 transition-colors hover:opacity-80" style={{ color: 'hsl(300 30% 70%)' }}>
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back</span>
                </Link>
                <div className="h-4 w-px" style={{ background: 'hsl(280 30% 30%)' }} />
                <span className="text-sm font-light tracking-[0.3em]" style={{ color: 'hsl(300 70% 70%)' }}>THERMAL RESONANCE</span>
              </div>
              <div className="flex items-center gap-6 text-sm" style={{ color: 'hsl(300 30% 70%)' }}>
                <Button
                  onClick={() => setIsFullscreen(true)}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 hover:opacity-80"
                  style={{ color: 'hsl(320 70% 65%)' }}
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
                <h1 className="text-5xl md:text-6xl font-extralight tracking-wide mb-4" style={{ color: 'hsl(300 40% 90%)' }}>
                  Music <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, hsl(280 60% 55%), hsl(300 70% 70%), hsl(320 70% 85%))' }}>Temperature</span> Visualizer
                </h1>
                <p className="max-w-2xl mx-auto" style={{ color: 'hsl(280 25% 60%)' }}>
                  Proprietary thermal mapping algorithm converts audio spectral energy into 
                  real-time material temperature response. Watch the console shift from deep 
                  violet to luminous magenta based on your music's energy.
                </p>
              </div>

              {/* Audio Ingest Hub - Redesigned CTA */}
              <AudioIngestHub
                audioFile={audioFile}
                onFileUpload={handleFileUpload}
                isPlaying={isPlaying}
                onTogglePlayback={togglePlayback}
                onEnterImmersive={() => setIsFullscreen(true)}
                onGenerateMagic={generateMagic}
                isGeneratingMagic={isGeneratingMagic}
                magicAudio={magicAudio}
                isMagicPlaying={isMagicPlaying}
                onToggleMagic={toggleMagicPlayback}
                onDownloadMagic={downloadMagicAudio}
                magicAnalysis={magicAnalysis ? {
                  emotionalTone: magicAnalysis.emotionalTone,
                  frequencyProfile: magicAnalysis.frequencyProfile,
                } : null}
                demoTracks={demoTracks}
                onDemoTrackSelect={handleDemoTrackSelect}
              />

              <div className="mb-12" />

              {/* Main Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* DJ Console Thermal View */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl p-6 backdrop-blur-xl" style={{ background: 'hsl(280 25% 10% / 0.5)', border: '1px solid hsl(280 30% 25%)' }}>
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: 'hsl(300 40% 70%)' }}>
                  <Thermometer className="w-4 h-4" style={{ color: 'hsl(300 70% 70%)' }} />
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
                  <div className="absolute inset-4 rounded-2xl border-2 backdrop-blur-sm" style={{ borderColor: 'hsl(300 40% 85% / 0.2)', background: 'hsl(270 30% 8% / 0.3)' }}>
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
                  <div className="absolute top-4 right-4 backdrop-blur-xl rounded-lg px-4 py-2" style={{ background: 'hsl(280 30% 10% / 0.8)', border: '1px solid hsl(280 30% 30%)' }}>
                    <div className="flex items-center gap-3">
                      <Thermometer className="w-5 h-5" style={{ color: 'hsl(300 70% 70%)' }} />
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
                        <div className="text-xs mb-1" style={{ color: 'hsl(300 40% 85% / 0.6)' }}>{zone.name}</div>
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
                  <h4 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: 'hsl(300 40% 70%)' }}>
                    <Monitor className="w-4 h-4" style={{ color: 'hsl(300 70% 70%)' }} />
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
                  <p className="text-xs mt-3 text-center" style={{ color: 'hsl(280 25% 50%)' }}>
                    STRATA displays adapt color temperature and glow intensity based on real-time audio spectral analysis
                  </p>
                </div>

                {/* Temperature Scale - Updated to Lavandar palette */}
                <div className="mt-4 relative h-6">
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `linear-gradient(to right, 
                        hsl(270, 50%, 20%) 0%, 
                        hsl(280, 60%, 40%) 25%, 
                        hsl(295, 70%, 55%) 50%, 
                        hsl(310, 75%, 65%) 75%, 
                        hsl(320, 70%, 85%) 100%)`
                    }}
                  />
                  <div className="absolute inset-0 flex justify-between items-center px-4 text-xs font-mono">
                    <span style={{ color: 'hsl(270 50% 70%)' }}>{PHYSICS.TEMP_RANGE[0]}°C</span>
                    <span style={{ color: 'hsl(280 60% 70%)' }}>5°C</span>
                    <span style={{ color: 'hsl(295 70% 80%)' }}>25°C</span>
                    <span style={{ color: 'hsl(310 70% 75%)' }}>45°C</span>
                    <span style={{ color: 'hsl(315 70% 80%)' }}>65°C</span>
                    <span style={{ color: 'hsl(320 70% 90%)' }}>{PHYSICS.TEMP_RANGE[1]}°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Panel */}
            <div className="space-y-6">
              {/* Psychoacoustic Preset Selector */}
              <PsychoacousticPresetSelector
                activePreset={activePreset}
                onPresetChange={setActivePreset}
              />
              
              {/* Psychoacoustic Visualization */}
              <PsychoacousticVisualization
                spectralData={spectralData}
                temperature={globalTemp}
                isPlaying={isPlaying}
                getThermalColor={getThermalColor}
              />

              {/* Energy Metrics */}
              <div className="rounded-2xl p-6 backdrop-blur-xl" style={{ background: 'hsl(280 25% 10% / 0.5)', border: '1px solid hsl(280 30% 25%)' }}>
                <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: 'hsl(300 40% 70%)' }}>
                  <Volume2 className="w-4 h-4" style={{ color: 'hsl(300 70% 70%)' }} />
                  PROPRIETARY METRICS
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg p-4 text-center" style={{ background: 'hsl(280 25% 15% / 0.5)' }}>
                    <div className="text-xs mb-1" style={{ color: 'hsl(280 30% 55%)' }}>Energy Density</div>
                    <div className="text-2xl font-mono font-bold" style={{ color: 'hsl(300 70% 70%)' }}>
                      {(spectralData.energy * 100).toFixed(1)}
                    </div>
                  </div>
                  <div className="rounded-lg p-4 text-center" style={{ background: 'hsl(280 25% 15% / 0.5)' }}>
                    <div className="text-xs mb-1" style={{ color: 'hsl(280 30% 55%)' }}>Est. BPM</div>
                    <div className="text-2xl font-mono font-bold" style={{ color: 'hsl(310 70% 65%)' }}>
                      {bpm || '---'}
                    </div>
                  </div>
                  <div className="rounded-lg p-4 text-center" style={{ background: 'hsl(280 25% 15% / 0.5)' }}>
                    <div className="text-xs mb-1" style={{ color: 'hsl(280 30% 55%)' }}>Peak Energy</div>
                    <div className="text-2xl font-mono font-bold" style={{ color: 'hsl(320 70% 80%)' }}>
                      {(peakEnergy * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="rounded-lg p-4 text-center" style={{ background: 'hsl(280 25% 15% / 0.5)' }}>
                    <div className="text-xs mb-1" style={{ color: 'hsl(280 30% 55%)' }}>Thermal Δ</div>
                    <div className="text-2xl font-mono font-bold" style={{ color: getThermalColor(globalTemp) }}>
                      {(globalTemp - PHYSICS.AMBIENT_TEMP) > 0 ? '+' : ''}{(globalTemp - PHYSICS.AMBIENT_TEMP).toFixed(1)}°
                    </div>
                  </div>
                </div>
              </div>

              {/* Magic Analysis Panel */}
              {magicAnalysis && (
                <div className="rounded-2xl p-6 backdrop-blur-xl" style={{ 
                  background: 'linear-gradient(135deg, hsl(280 30% 10% / 0.6) 0%, hsl(320 30% 10% / 0.6) 100%)', 
                  border: '1px solid hsl(300 40% 30% / 0.5)' 
                }}>
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: 'hsl(300 50% 75%)' }}>
                    <Sparkles className="w-4 h-4" style={{ color: 'hsl(320 80% 60%)' }} />
                    THERMAL MAGIC ANALYSIS
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: 'hsl(300 30% 55%)' }}>Thermal Intensity</span>
                      <span className="font-mono" style={{ color: 'hsl(300 50% 75%)' }}>{(parseFloat(magicAnalysis.thermalIntensity) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'hsl(300 30% 55%)' }}>Frequency Profile</span>
                      <span className="font-mono capitalize" style={{ color: 'hsl(300 50% 75%)' }}>{magicAnalysis.frequencyProfile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'hsl(300 30% 55%)' }}>Tempo Feel</span>
                      <span className="font-mono capitalize" style={{ color: 'hsl(300 50% 75%)' }}>{magicAnalysis.tempoFeel}</span>
                    </div>
                    <div className="pt-3 mt-3" style={{ borderTop: '1px solid hsl(300 30% 25%)' }}>
                      <p className="text-xs italic" style={{ color: 'hsl(300 40% 50%)' }}>
                        "{magicAnalysis.emotionalTone}"
                      </p>
                    </div>
                  </div>

                  {/* Collapsible Advanced Psychoacoustic Metrics */}
                  {magicAnalysis.psychoacousticProfile && (
                    <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen} className="mt-4">
                      <CollapsibleTrigger asChild>
                        <button 
                          className="w-full flex items-center justify-between py-2 px-3 rounded-lg transition-colors hover:bg-white/5"
                          style={{ border: '1px solid hsl(300 30% 25%)' }}
                        >
                          <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: 'hsl(300 40% 60%)' }}>
                            Advanced Psychoacoustic Analysis
                          </span>
                          {isAdvancedOpen ? (
                            <ChevronUp className="w-4 h-4" style={{ color: 'hsl(300 40% 60%)' }} />
                          ) : (
                            <ChevronDown className="w-4 h-4" style={{ color: 'hsl(300 40% 60%)' }} />
                          )}
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3 space-y-4">
                        {/* Soundstage Section */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-3 rounded-full" style={{ background: 'hsl(280 60% 50%)' }} />
                            <span className="text-[9px] tracking-[0.15em] uppercase" style={{ color: 'hsl(280 50% 70%)' }}>
                              Soundstage Architecture
                            </span>
                          </div>
                          <div className="rounded-lg p-3 space-y-2" style={{ background: 'hsl(280 30% 12% / 0.5)' }}>
                            <div className="flex justify-between text-[10px]">
                              <span style={{ color: 'hsl(280 30% 50%)' }}>Stereo Width</span>
                              <span className="font-mono text-right max-w-[60%] truncate" style={{ color: 'hsl(280 50% 75%)' }}>
                                {magicAnalysis.psychoacousticProfile.soundstage.stereoWidth}
                              </span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                              <span style={{ color: 'hsl(280 30% 50%)' }}>Depth Placement</span>
                              <span className="font-mono text-right max-w-[60%] truncate" style={{ color: 'hsl(280 50% 75%)' }}>
                                {magicAnalysis.psychoacousticProfile.soundstage.depthPlacement}
                              </span>
                            </div>
                            <div className="pt-2 grid grid-cols-3 gap-1">
                              <div className="text-center p-1 rounded" style={{ background: 'hsl(280 70% 35% / 0.3)' }}>
                                <div className="text-[8px] uppercase" style={{ color: 'hsl(280 50% 60%)' }}>Sub-Bass</div>
                                <div className="text-xs font-mono font-bold" style={{ color: 'hsl(280 70% 65%)' }}>
                                  {(magicAnalysis.psychoacousticProfile.soundstage.verticality.subBass * 100).toFixed(0)}%
                                </div>
                              </div>
                              <div className="text-center p-1 rounded" style={{ background: 'hsl(300 80% 40% / 0.3)' }}>
                                <div className="text-[8px] uppercase" style={{ color: 'hsl(300 60% 65%)' }}>Mid</div>
                                <div className="text-xs font-mono font-bold" style={{ color: 'hsl(300 80% 65%)' }}>
                                  {(magicAnalysis.psychoacousticProfile.soundstage.verticality.midRange * 100).toFixed(0)}%
                                </div>
                              </div>
                              <div className="text-center p-1 rounded" style={{ background: 'hsl(320 80% 45% / 0.3)' }}>
                                <div className="text-[8px] uppercase" style={{ color: 'hsl(320 60% 65%)' }}>Air</div>
                                <div className="text-xs font-mono font-bold" style={{ color: 'hsl(320 80% 70%)' }}>
                                  {(magicAnalysis.psychoacousticProfile.soundstage.verticality.airBand * 100).toFixed(0)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Timbre Section */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-3 rounded-full" style={{ background: 'hsl(320 60% 50%)' }} />
                            <span className="text-[9px] tracking-[0.15em] uppercase" style={{ color: 'hsl(320 50% 70%)' }}>
                              Temperature Timbre
                            </span>
                          </div>
                          <div className="rounded-lg p-3 space-y-2" style={{ background: 'hsl(320 30% 12% / 0.5)' }}>
                            <div className="flex justify-between text-[10px]">
                              <span style={{ color: 'hsl(320 30% 50%)' }}>Character</span>
                              <span className="font-mono uppercase font-bold" style={{ color: 'hsl(320 60% 70%)' }}>
                                {magicAnalysis.psychoacousticProfile.timbre.character}
                              </span>
                            </div>
                            <div className="text-[10px]">
                              <span style={{ color: 'hsl(320 30% 50%)' }}>Saturation:</span>
                              <p className="mt-1 leading-relaxed" style={{ color: 'hsl(320 40% 65%)' }}>
                                {magicAnalysis.psychoacousticProfile.timbre.saturation}
                              </p>
                            </div>
                            <div className="text-[10px]">
                              <span style={{ color: 'hsl(320 30% 50%)' }}>Texture:</span>
                              <p className="mt-1 leading-relaxed" style={{ color: 'hsl(320 40% 65%)' }}>
                                {magicAnalysis.psychoacousticProfile.timbre.texture}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Dynamics Section */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-3 rounded-full" style={{ background: 'hsl(260 50% 50%)' }} />
                            <span className="text-[9px] tracking-[0.15em] uppercase" style={{ color: 'hsl(260 40% 70%)' }}>
                              Dynamic Response
                            </span>
                          </div>
                          <div className="rounded-lg p-3 space-y-2" style={{ background: 'hsl(260 20% 12% / 0.5)' }}>
                            <div className="text-[10px]">
                              <span style={{ color: 'hsl(260 30% 50%)' }}>Attack:</span>
                              <p className="mt-1 leading-relaxed" style={{ color: 'hsl(260 40% 65%)' }}>
                                {magicAnalysis.psychoacousticProfile.dynamics.attack}
                              </p>
                            </div>
                            <div className="text-[10px]">
                              <span style={{ color: 'hsl(260 30% 50%)' }}>Decay:</span>
                              <p className="mt-1 leading-relaxed" style={{ color: 'hsl(260 40% 65%)' }}>
                                {magicAnalysis.psychoacousticProfile.dynamics.decay}
                              </p>
                            </div>
                            <div className="text-[10px]">
                              <span style={{ color: 'hsl(260 30% 50%)' }}>Noise Floor:</span>
                              <p className="mt-1 leading-relaxed" style={{ color: 'hsl(260 40% 65%)' }}>
                                {magicAnalysis.psychoacousticProfile.dynamics.noiseFloor}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Diffusion Section */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-3 rounded-full" style={{ background: 'hsl(240 60% 55%)' }} />
                            <span className="text-[9px] tracking-[0.15em] uppercase" style={{ color: 'hsl(240 50% 70%)' }}>
                              Acoustic Diffusion
                            </span>
                          </div>
                          <div className="rounded-lg p-3 space-y-2" style={{ background: 'hsl(240 30% 12% / 0.5)' }}>
                            <div className="text-[10px]">
                              <span style={{ color: 'hsl(240 30% 50%)' }}>Reverb:</span>
                              <p className="mt-1 leading-relaxed" style={{ color: 'hsl(240 40% 65%)' }}>
                                {magicAnalysis.psychoacousticProfile.diffusion.reverb}
                              </p>
                            </div>
                            <div className="text-[10px]">
                              <span style={{ color: 'hsl(240 30% 50%)' }}>Space Character:</span>
                              <p className="mt-1 leading-relaxed" style={{ color: 'hsl(240 40% 65%)' }}>
                                {magicAnalysis.psychoacousticProfile.diffusion.spaceCharacter}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Lavandar Signature */}
                        <div className="pt-2 border-t flex items-center justify-center gap-2" style={{ borderColor: 'hsl(280 30% 20%)' }}>
                          <span className="text-[8px] tracking-[0.2em] uppercase" style={{ color: 'hsl(280 30% 50%)' }}>
                            Lavandar Psychoacoustic Intelligence
                          </span>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              )}

              {/* Algorithm Info */}
              <div className="rounded-2xl p-6 backdrop-blur-xl" style={{ background: 'hsl(280 25% 10% / 0.5)', border: '1px solid hsl(280 30% 25%)' }}>
                <h3 className="text-sm font-medium mb-4" style={{ color: 'hsl(300 40% 70%)' }}>THERMAL RESONANCE SYSTEM™</h3>
                <div className="space-y-3 text-xs" style={{ color: 'hsl(280 30% 55%)' }}>
                  <div className="flex justify-between">
                    <span>Energy Conversion</span>
                    <span className="font-mono" style={{ color: 'hsl(300 40% 70%)' }}>{PHYSICS.ENERGY_TO_HEAT}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thermal Inertia</span>
                    <span className="font-mono" style={{ color: 'hsl(300 40% 70%)' }}>{PHYSICS.INERTIA_MASS}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diffusion Rate</span>
                    <span className="font-mono" style={{ color: 'hsl(300 40% 70%)' }}>{PHYSICS.DIFFUSION_RATE}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sub-Bass Weight</span>
                    <span className="font-mono" style={{ color: 'hsl(300 40% 70%)' }}>{SPECTRAL.THERMAL_WEIGHTS.SUB_BASS}x</span>
                  </div>
                </div>
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid hsl(280 30% 25%)' }}>
                  <p className="text-xs italic" style={{ color: 'hsl(280 25% 45%)' }}>
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
