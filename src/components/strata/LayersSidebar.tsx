import { Mountain, Cloud, Plane, Rocket, Satellite } from "lucide-react";
import { useState } from "react";

const layers = [
  { id: "surface", label: "Surface", icon: Mountain, altitude: "0km" },
  { id: "troposphere", label: "Troposphere", icon: Cloud, altitude: "12km" },
  { id: "stratosphere", label: "Stratosphere", icon: Plane, altitude: "50km" },
  { id: "mesosphere", label: "Mesosphere", icon: Rocket, altitude: "85km" },
  { id: "thermosphere", label: "Thermosphere", icon: Satellite, altitude: "450km" },
];

interface LayersSidebarProps {
  activeLayer: string;
  onLayerChange: (layer: string) => void;
}

const LayersSidebar = ({ activeLayer, onLayerChange }: LayersSidebarProps) => {
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  
  const activeIndex = layers.findIndex(l => l.id === activeLayer);
  const altitudePercent = ((layers.length - 1 - activeIndex) / (layers.length - 1)) * 100;

  return (
    <div className="flex gap-3">
      {/* Layer navigation */}
      <div className="flex flex-col gap-1 bg-strata-charcoal/50 rounded p-2 border border-strata-steel/20">
        <span className="text-[8px] font-mono uppercase tracking-widest text-strata-silver/50 text-center mb-2">
          Layers
        </span>
        {layers.map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          const isHovered = hoveredLayer === layer.id;
          
          return (
            <button
              key={layer.id}
              onClick={() => onLayerChange(layer.id)}
              onMouseEnter={() => setHoveredLayer(layer.id)}
              onMouseLeave={() => setHoveredLayer(null)}
              className={`relative p-2 rounded transition-all duration-200 group ${
                isActive 
                  ? 'bg-strata-orange/20 border border-strata-orange/40' 
                  : 'hover:bg-strata-steel/40 border border-transparent'
              }`}
              title={layer.label}
            >
              <Icon className={`w-4 h-4 transition-colors ${
                isActive ? 'text-strata-orange' : 'text-strata-silver/60 group-hover:text-strata-silver'
              }`} />
              
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-strata-charcoal border border-strata-steel/40 rounded px-2 py-1 whitespace-nowrap z-10">
                  <span className="text-[9px] font-mono text-strata-silver">{layer.label}</span>
                  <span className="text-[8px] font-mono text-strata-orange ml-2">{layer.altitude}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Altitude gauge */}
      <div className="flex flex-col items-center gap-2 bg-strata-charcoal/30 rounded p-2 border border-strata-steel/20">
        <span className="text-[7px] font-mono uppercase tracking-widest text-strata-silver/50 -rotate-90 origin-center whitespace-nowrap" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          Altitude
        </span>
        
        <div className="relative w-3 flex-1 bg-strata-steel/30 rounded-full overflow-hidden min-h-[120px]">
          {/* Scale markers */}
          <div className="absolute inset-x-0 top-0 h-px bg-strata-silver/30" />
          <div className="absolute inset-x-0 top-1/4 h-px bg-strata-steel/40" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-strata-steel/40" />
          <div className="absolute inset-x-0 top-3/4 h-px bg-strata-steel/40" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-strata-silver/30" />
          
          {/* Active level */}
          <div 
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-strata-lume to-strata-lume-dim transition-all duration-500 rounded-full"
            style={{ height: `${100 - altitudePercent}%` }}
          />
          
          {/* Current position indicator */}
          <div 
            className="absolute inset-x-0 h-1 bg-strata-lume rounded-full shadow-[0_0_8px_rgba(57,255,20,0.6)] transition-all duration-500"
            style={{ top: `${altitudePercent}%` }}
          />
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono text-strata-lume font-semibold">
            {layers.find(l => l.id === activeLayer)?.altitude}
          </span>
          <span className="text-[7px] font-mono text-strata-silver/50">450km</span>
        </div>
      </div>
    </div>
  );
};

export default LayersSidebar;
