import { useState, useEffect, useMemo } from "react";
import { Globe, Layers, Mountain, Cloud, Plane, Rocket, Satellite, Activity } from "lucide-react";

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

const layersData: LayerData[] = [
  { 
    id: "surface", 
    label: "Surface", 
    icon: Mountain, 
    altitude: "0km",
    color: "hsl(25, 85%, 55%)", // copper/orange
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

  // Pulse animation
  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isAnimating]);

  // Generate particles for each layer
  const particles = useMemo(() => {
    const allParticles: Particle[] = [];
    let id = 0;

    layersData.forEach((layer, layerIndex) => {
      const yStart = (layerIndex / layersData.length) * 100;
      const yEnd = ((layerIndex + 1) / layersData.length) * 100;
      
      // Create cluster in center with scatter at edges (inspired by copper sphere image)
      for (let i = 0; i < layer.particleCount; i++) {
        // Gaussian-like distribution for clustering
        const u1 = Math.random();
        const u2 = Math.random();
        const gaussian = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        
        // Center cluster with variance
        const xCenter = 50 + gaussian * 15;
        const x = Math.max(5, Math.min(95, xCenter + (Math.random() - 0.5) * 40));
        
        // Distribute vertically within layer band
        const yBase = yStart + (Math.random() * (yEnd - yStart));
        const y = Math.max(yStart + 2, Math.min(yEnd - 2, yBase));
        
        // Size variation - denser at center
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
  }, []);

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
              Atmospheric Density Visualization
            </p>
          </div>
        </div>
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

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Particle Visualization */}
        <div className="relative h-[400px] bg-neutral-950 rounded-lg overflow-hidden border border-strata-steel/20">
          {/* Background texture - inspired by speckled dark surface */}
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
                {/* Layer label */}
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

          {/* Copper particles - main visualization */}
          {particles.map((particle) => {
            const isActiveLayer = particle.layer === activeLayer;
            const layerIndex = layersData.findIndex(l => l.id === particle.layer);
            const layer = layersData[layerIndex];
            
            // Pulse effect for active layer
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
            <div className="text-lg font-mono text-cyan-400">LIVE</div>
            <div className="text-[8px] font-mono text-strata-silver/50 uppercase tracking-wider">Data Status</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtlasLayers;
