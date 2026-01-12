import { useState, useEffect, useMemo, useCallback } from "react";
import { Globe, Mountain, Cloud, Plane, Rocket, Satellite, Activity, Wind, Waves, AlertTriangle, RefreshCw, MapPin, Volume2, VolumeX, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  layer: string;
  delay: number;
}

interface LayerData {
  id: string;
  label: string;
  icon: typeof Mountain;
  altitude: string;
  color: string;
  particleCount: number;
  density: number;
  description: string;
}

interface MarineForecast {
  zone: string;
  location: string;
  issuedAt: string;
  warnings: string[];
  periods: {
    name: string;
    wind: string;
    seas: string;
    conditions: string;
  }[];
}

interface NOAAResponse {
  success: boolean;
  data?: MarineForecast;
  fetchedAt?: string;
  error?: string;
}

interface ZoneInfo {
  id: string;
  name: string;
  description: string;
}

const layersData: LayerData[] = [
  { 
    id: "surface", 
    label: "Surface", 
    icon: Mountain, 
    altitude: "0km",
    color: "hsl(25, 85%, 55%)",
    particleCount: 180,
    density: 0.95,
    description: "Ground-level observations"
  },
  { 
    id: "troposphere", 
    label: "Troposphere", 
    icon: Cloud, 
    altitude: "0-12km",
    color: "hsl(30, 80%, 60%)",
    particleCount: 140,
    density: 0.75,
    description: "Weather phenomena layer"
  },
  { 
    id: "stratosphere", 
    label: "Stratosphere", 
    icon: Plane, 
    altitude: "12-50km",
    color: "hsl(35, 75%, 65%)",
    particleCount: 80,
    density: 0.45,
    description: "Ozone concentration zone"
  },
  { 
    id: "mesosphere", 
    label: "Mesosphere", 
    icon: Rocket, 
    altitude: "50-85km",
    color: "hsl(40, 70%, 70%)",
    particleCount: 45,
    density: 0.25,
    description: "Meteor ablation region"
  },
  { 
    id: "thermosphere", 
    label: "Thermosphere", 
    icon: Satellite, 
    altitude: "85-450km",
    color: "hsl(45, 65%, 75%)",
    particleCount: 20,
    density: 0.08,
    description: "Ionospheric dynamics"
  },
];

const AtlasLayers = () => {
  const [activeLayer, setActiveLayer] = useState("surface");
  const [isAnimating, setIsAnimating] = useState(true);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [noaaData, setNoaaData] = useState<MarineForecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Zone selection state
  const [selectedZone, setSelectedZone] = useState("anz233");
  const [availableZones, setAvailableZones] = useState<ZoneInfo[]>([
    { id: 'anz233', name: 'Vineyard Sound', description: 'Including Woods Hole and Martha\'s Vineyard' },
    { id: 'anz230', name: 'Cape Cod Bay', description: 'Plymouth to Provincetown' },
    { id: 'anz232', name: 'Nantucket Sound', description: 'South of Cape Cod to Nantucket' },
    { id: 'anz231', name: 'Buzzards Bay', description: 'New Bedford to the Elizabeth Islands' },
    { id: 'anz234', name: 'Block Island Sound', description: 'Rhode Island to Block Island' },
    { id: 'anz235', name: 'Long Island Sound (East)', description: 'New London to Orient Point' },
  ]);
  
  // Sound state
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Generate weather-appropriate sound prompt
  const generateSoundPrompt = useCallback(() => {
    if (!noaaData) return null;
    
    const conditions = noaaData.periods[0]?.conditions?.toLowerCase() || '';
    const warnings = noaaData.warnings || [];
    const wind = noaaData.periods[0]?.wind?.toLowerCase() || '';
    
    let prompt = "Ambient ocean waves and ";
    
    if (warnings.some(w => w.includes('GALE') || w.includes('STORM'))) {
      prompt += "strong howling wind with heavy rain, stormy marine atmosphere";
    } else if (wind.includes('15') || wind.includes('20') || wind.includes('25')) {
      prompt += "moderate coastal wind, seagulls in distance, choppy water sounds";
    } else if (conditions.includes('rain') || conditions.includes('shower')) {
      prompt += "light rain falling on water, gentle maritime atmosphere";
    } else if (conditions.includes('fog') || conditions.includes('mist')) {
      prompt += "foghorn in distance, calm misty harbor ambiance";
    } else {
      prompt += "gentle breeze, calm harbor with buoy bells, peaceful marina sounds";
    }
    
    return prompt;
  }, [noaaData]);

  // Play weather sound using ElevenLabs
  const playWeatherSound = useCallback(async () => {
    if (!isSoundEnabled || isPlayingSound) return;
    
    const prompt = generateSoundPrompt();
    if (!prompt) return;
    
    setIsPlayingSound(true);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-sfx`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt, duration: 10 }),
        }
      );

      if (!response.ok) {
        throw new Error(`SFX request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.loop = true;
      audio.volume = 0.4;
      
      setCurrentAudio(audio);
      await audio.play();
    } catch (err) {
      console.error('Sound playback error:', err);
    } finally {
      setIsPlayingSound(false);
    }
  }, [isSoundEnabled, isPlayingSound, generateSoundPrompt]);

  // Toggle sound
  const toggleSound = useCallback(() => {
    if (isSoundEnabled && currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      setCurrentAudio(null);
    }
    setIsSoundEnabled(!isSoundEnabled);
  }, [isSoundEnabled, currentAudio]);

  // Play sound when enabled and data available
  useEffect(() => {
    if (isSoundEnabled && noaaData && !currentAudio) {
      playWeatherSound();
    }
  }, [isSoundEnabled, noaaData, currentAudio, playWeatherSound]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, [currentAudio]);

  // Fetch NOAA data
  const fetchNOAAData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke<NOAAResponse>('noaa-marine', {
        body: { zone: selectedZone }
      });
      
      if (fnError) throw fnError;
      if (data?.success && data.data) {
        setNoaaData(data.data);
        setLastFetched(data.fetchedAt || new Date().toISOString());
      } else {
        throw new Error(data?.error || 'Failed to fetch NOAA data');
      }
    } catch (err) {
      console.error('NOAA fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [selectedZone]);

  // Fetch on zone change and auto-refresh every 5 minutes
  useEffect(() => {
    fetchNOAAData();
    const interval = setInterval(fetchNOAAData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNOAAData]);

  // Pulse animation
  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isAnimating]);

  // Parse wind speed from NOAA data for visualization
  const windSpeed = useMemo(() => {
    if (!noaaData?.periods?.[0]?.wind) return null;
    const match = noaaData.periods[0].wind.match(/(\d+)\s+to\s+(\d+)/);
    if (match) {
      return { min: parseInt(match[1]), max: parseInt(match[2]) };
    }
    return null;
  }, [noaaData]);

  // Parse sea height from NOAA data
  const seaHeight = useMemo(() => {
    if (!noaaData?.periods?.[0]?.seas) return null;
    const match = noaaData.periods[0].seas.match(/(\d+)\s+to\s+(\d+)/);
    if (match) {
      return { min: parseInt(match[1]), max: parseInt(match[2]) };
    }
    return null;
  }, [noaaData]);

  // Generate particles for each layer
  const particles = useMemo(() => {
    const allParticles: Particle[] = [];
    let id = 0;

    layersData.forEach((layer, layerIndex) => {
      const yStart = (layerIndex / layersData.length) * 100;
      const yEnd = ((layerIndex + 1) / layersData.length) * 100;
      
      // Adjust particle count based on wind for surface layer
      let particleCount = layer.particleCount;
      if (layer.id === 'surface' && windSpeed) {
        particleCount = Math.round(layer.particleCount * (1 + windSpeed.max / 50));
      }
      
      for (let i = 0; i < particleCount; i++) {
        const u1 = Math.random();
        const u2 = Math.random();
        const gaussian = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        
        const xCenter = 50 + gaussian * 15;
        const x = Math.max(5, Math.min(95, xCenter + (Math.random() - 0.5) * 40));
        
        const yBase = yStart + (Math.random() * (yEnd - yStart));
        const y = Math.max(yStart + 2, Math.min(yEnd - 2, yBase));
        
        const distFromCenter = Math.abs(x - 50);
        const sizeMultiplier = 1 - (distFromCenter / 100);
        const size = 3 + Math.random() * 4 * sizeMultiplier * layer.density;
        
        allParticles.push({
          id: id++,
          x,
          y,
          size,
          opacity: 0.4 + Math.random() * 0.6 * layer.density,
          layer: layer.id,
          delay: Math.random() * 2,
        });
      }
    });

    return allParticles;
  }, [windSpeed]);

  const currentLayer = layersData.find(l => l.id === activeLayer);
  const activeIndex = layersData.findIndex(l => l.id === activeLayer);

  return (
    <div className="bg-strata-charcoal/30 rounded-lg border border-strata-steel/20 p-6 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-strata-orange/10 border border-strata-orange/20">
            <Globe className="w-5 h-5 text-strata-orange" />
          </div>
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-strata-white">
              Atlas Layers
            </h3>
            <p className="text-[10px] font-mono text-strata-silver/60 uppercase tracking-wider">
              Live NOAA Marine Data Integration
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Zone Selector */}
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-[180px] h-9 bg-strata-charcoal/50 border-strata-steel/30 text-strata-white text-xs font-mono">
              <MapPin className="w-3 h-3 mr-2 text-cyan-400" />
              <SelectValue placeholder="Select Zone" />
            </SelectTrigger>
            <SelectContent className="bg-strata-charcoal border-strata-steel/30">
              {availableZones.map((zone) => (
                <SelectItem 
                  key={zone.id} 
                  value={zone.id}
                  className="text-strata-white text-xs font-mono hover:bg-strata-steel/20 focus:bg-strata-steel/20"
                >
                  <div className="flex flex-col">
                    <span>{zone.name}</span>
                    <span className="text-[10px] text-strata-silver/50">{zone.id.toUpperCase()}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            disabled={isPlayingSound}
            className={`p-2 rounded border transition-all ${
              isSoundEnabled 
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' 
                : 'bg-strata-steel/10 border-strata-steel/30 text-strata-silver/60 hover:text-strata-silver'
            } ${isPlayingSound ? 'animate-pulse' : ''}`}
            title={isSoundEnabled ? 'Disable ambient sound' : 'Enable ambient sound'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <button
            onClick={fetchNOAAData}
            disabled={isLoading}
            className={`p-2 rounded border transition-all ${
              isLoading 
                ? 'bg-strata-steel/10 border-strata-steel/20 text-strata-silver/40 cursor-wait' 
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className={`p-2 rounded border transition-all ${
              isAnimating 
                ? 'bg-strata-orange/10 border-strata-orange/30 text-strata-orange' 
                : 'bg-strata-steel/20 border-strata-steel/30 text-strata-silver/60'
            }`}
          >
            <Activity className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Current Date/Time Sync Display */}
      <div className="mb-4 flex items-center justify-between px-3 py-2 bg-strata-charcoal/40 rounded border border-strata-steel/20">
        <div className="flex items-center gap-3">
          <div className="text-[10px] font-mono text-strata-silver/50 uppercase">Forecast Time</div>
          <div className="text-sm font-mono text-strata-white">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          <div className="text-sm font-mono text-cyan-400">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
          </div>
        </div>
        {isSoundEnabled && (
          <div className="flex items-center gap-2 text-purple-400">
            <div className="flex gap-0.5">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-0.5 bg-purple-400 rounded-full animate-pulse"
                  style={{ 
                    height: `${8 + Math.random() * 8}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono uppercase">Audio Synced</span>
          </div>
        )}
      </div>

      {/* NOAA Live Data Strip */}
      {noaaData && (
        <div className="mb-6 p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Live: {noaaData.location} ({noaaData.zone})
            </span>
            {lastFetched && (
              <span className="text-[10px] font-mono text-strata-silver/50 ml-auto">
                Updated: {new Date(lastFetched).toLocaleTimeString()}
              </span>
            )}
          </div>
          
          {/* Warnings */}
          {noaaData.warnings.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {noaaData.warnings.map((warning, i) => (
                <div key={i} className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 rounded text-amber-400 text-[10px] font-mono uppercase">
                  <AlertTriangle className="w-3 h-3" />
                  {warning}
                </div>
              ))}
            </div>
          )}
          
          {/* Current Conditions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {windSpeed && (
              <div className="bg-strata-charcoal/50 rounded p-3 border border-strata-steel/20">
                <div className="flex items-center gap-2 mb-1">
                  <Wind className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] font-mono text-strata-silver/60 uppercase">Wind</span>
                </div>
                <div className="text-lg font-mono text-strata-white">
                  {windSpeed.min}-{windSpeed.max} <span className="text-xs text-strata-silver/60">kt</span>
                </div>
              </div>
            )}
            {seaHeight && (
              <div className="bg-strata-charcoal/50 rounded p-3 border border-strata-steel/20">
                <div className="flex items-center gap-2 mb-1">
                  <Waves className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] font-mono text-strata-silver/60 uppercase">Seas</span>
                </div>
                <div className="text-lg font-mono text-strata-white">
                  {seaHeight.min}-{seaHeight.max} <span className="text-xs text-strata-silver/60">ft</span>
                </div>
              </div>
            )}
            {noaaData.periods[0] && (
              <>
                <div className="bg-strata-charcoal/50 rounded p-3 border border-strata-steel/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Cloud className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-mono text-strata-silver/60 uppercase">Period</span>
                  </div>
                  <div className="text-sm font-mono text-strata-white truncate">
                    {noaaData.periods[0].name}
                  </div>
                </div>
                <div className="bg-strata-charcoal/50 rounded p-3 border border-strata-steel/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-mono text-strata-silver/60 uppercase">Status</span>
                  </div>
                  <div className="text-sm font-mono text-emerald-400">
                    CONNECTED
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-mono">{error}</span>
            <button 
              onClick={fetchNOAAData}
              className="ml-auto text-xs underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !noaaData && (
        <div className="mb-6 p-4 bg-strata-charcoal/30 rounded-lg border border-strata-steel/20 animate-pulse">
          <div className="flex items-center gap-2 text-strata-silver/60 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="font-mono">Connecting to NOAA...</span>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Particle Visualization */}
        <div className="relative h-[400px] bg-neutral-950 rounded-lg overflow-hidden border border-strata-steel/20">
          {/* Background texture */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(100)].map((_, i) => (
              <div
                key={`speck-${i}`}
                className="absolute w-px h-px bg-strata-silver/40"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Layer bands */}
          {layersData.map((layer, index) => {
            const yStart = (index / layersData.length) * 100;
            const height = 100 / layersData.length;
            const isActive = layer.id === activeLayer;
            
            return (
              <div
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`absolute inset-x-0 cursor-pointer transition-all duration-300 ${
                  isActive ? 'z-10' : 'z-0 hover:opacity-80'
                }`}
                style={{
                  top: `${yStart}%`,
                  height: `${height}%`,
                  background: isActive 
                    ? `linear-gradient(90deg, transparent, ${layer.color}10, transparent)`
                    : 'transparent',
                }}
              >
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-40'
                }`}>
                  <span className="text-[8px] font-mono uppercase tracking-wider text-strata-silver">
                    {layer.altitude}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Copper particles */}
          {particles.map((particle) => {
            const isActiveLayer = particle.layer === activeLayer;
            
            const pulseOffset = isActiveLayer && isAnimating
              ? Math.sin((pulsePhase + particle.delay * 180) * Math.PI / 180) * 0.2
              : 0;
            
            return (
              <div
                key={particle.id}
                className="absolute rounded-full transition-all duration-500"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size * (isActiveLayer ? 1.3 : 0.8)}px`,
                  height: `${particle.size * (isActiveLayer ? 1.3 : 0.8)}px`,
                  background: `radial-gradient(circle at 30% 30%, 
                    hsl(25, 80%, ${70 + pulseOffset * 20}%), 
                    hsl(20, 75%, ${45 + pulseOffset * 10}%), 
                    hsl(15, 70%, 30%))`,
                  opacity: isActiveLayer 
                    ? particle.opacity * (1 + pulseOffset)
                    : particle.opacity * 0.3,
                  boxShadow: isActiveLayer 
                    ? `0 0 ${4 + pulseOffset * 6}px hsl(25, 85%, 55%, ${0.4 + pulseOffset})` 
                    : 'none',
                  transform: `translate(-50%, -50%) scale(${1 + pulseOffset * 0.15})`,
                  transition: 'all 0.3s ease-out',
                }}
              />
            );
          })}

          {/* Active layer highlight line */}
          <div
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-strata-orange to-transparent transition-all duration-500"
            style={{
              top: `${((activeIndex + 0.5) / layersData.length) * 100}%`,
              opacity: 0.6,
            }}
          />

          {/* Density scale */}
          <div className="absolute right-3 top-3 bottom-3 w-8 bg-strata-charcoal/50 rounded border border-strata-steel/20 flex flex-col justify-between py-2 px-1">
            <span className="text-[7px] font-mono text-strata-silver/60 text-center">HIGH</span>
            <div className="flex-1 mx-auto w-1 my-2 rounded-full bg-gradient-to-b from-strata-silver/10 via-strata-orange/50 to-strata-orange" />
            <span className="text-[7px] font-mono text-strata-silver/60 text-center">LOW</span>
          </div>

          {/* NOAA Data Overlay for Surface */}
          {activeLayer === 'surface' && windSpeed && (
            <div className="absolute bottom-3 left-3 bg-strata-charcoal/80 rounded p-2 border border-cyan-500/30">
              <div className="text-[8px] font-mono text-cyan-400 uppercase mb-1">NOAA Surface</div>
              <div className="flex items-center gap-2">
                <Wind className="w-3 h-3 text-cyan-400" />
                <span className="text-xs font-mono text-strata-white">{windSpeed.min}-{windSpeed.max}kt</span>
              </div>
            </div>
          )}
        </div>

        {/* Layer Details Panel */}
        <div className="space-y-3">
          {layersData.map((layer) => {
            const Icon = layer.icon;
            const isActive = layer.id === activeLayer;
            
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`w-full p-3 rounded-lg border text-left transition-all duration-300 ${
                  isActive
                    ? 'bg-strata-orange/10 border-strata-orange/40'
                    : 'bg-strata-charcoal/30 border-strata-steel/20 hover:border-strata-steel/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded transition-colors ${
                    isActive ? 'bg-strata-orange/20' : 'bg-strata-steel/20'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      isActive ? 'text-strata-orange' : 'text-strata-silver/60'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono uppercase tracking-wider ${
                        isActive ? 'text-strata-white' : 'text-strata-silver/80'
                      }`}>
                        {layer.label}
                      </span>
                      <span className={`text-[10px] font-mono ${
                        isActive ? 'text-strata-orange' : 'text-strata-silver/50'
                      }`}>
                        {layer.altitude}
                      </span>
                    </div>
                    <p className="text-[9px] text-strata-silver/50 mt-0.5 truncate">
                      {layer.description}
                    </p>
                  </div>
                </div>
                
                {/* Density bar */}
                <div className="mt-2 h-1 bg-strata-steel/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isActive ? 'bg-strata-orange' : 'bg-strata-silver/30'
                    }`}
                    style={{ width: `${layer.density * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[8px] font-mono text-strata-silver/40">
                    Density: {Math.round(layer.density * 100)}%
                  </span>
                  <span className="text-[8px] font-mono text-strata-silver/40">
                    {layer.particleCount} sensors
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Layer Stats */}
      {currentLayer && (
        <div className="mt-6 grid grid-cols-4 gap-3">
          <div className="bg-strata-charcoal/30 rounded p-3 border border-strata-steel/20 text-center">
            <div className="text-lg font-mono text-strata-orange">{currentLayer.altitude}</div>
            <div className="text-[8px] font-mono text-strata-silver/50 uppercase tracking-wider">Altitude Range</div>
          </div>
          <div className="bg-strata-charcoal/30 rounded p-3 border border-strata-steel/20 text-center">
            <div className="text-lg font-mono text-strata-lume">{Math.round(currentLayer.density * 100)}%</div>
            <div className="text-[8px] font-mono text-strata-silver/50 uppercase tracking-wider">Particle Density</div>
          </div>
          <div className="bg-strata-charcoal/30 rounded p-3 border border-strata-steel/20 text-center">
            <div className="text-lg font-mono text-strata-white">{currentLayer.particleCount}</div>
            <div className="text-[8px] font-mono text-strata-silver/50 uppercase tracking-wider">Active Sensors</div>
          </div>
          <div className="bg-strata-charcoal/30 rounded p-3 border border-strata-steel/20 text-center">
            <div className={`text-lg font-mono ${noaaData ? 'text-emerald-400' : 'text-amber-400'}`}>
              {noaaData ? 'LIVE' : 'OFFLINE'}
            </div>
            <div className="text-[8px] font-mono text-strata-silver/50 uppercase tracking-wider">NOAA Status</div>
          </div>
        </div>
      )}

      {/* Forecast Periods */}
      {noaaData && noaaData.periods.length > 1 && (
        <div className="mt-6">
          <div className="text-xs font-mono text-strata-silver/60 uppercase tracking-wider mb-3">
            Upcoming Forecast Periods
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {noaaData.periods.slice(1, 6).map((period, i) => (
              <div key={i} className="bg-strata-charcoal/30 rounded p-2 border border-strata-steel/20">
                <div className="text-[9px] font-mono text-cyan-400 uppercase mb-1">{period.name}</div>
                <div className="text-[8px] font-mono text-strata-silver/60 truncate" title={period.wind}>
                  {period.wind || 'Variable'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AtlasLayers;