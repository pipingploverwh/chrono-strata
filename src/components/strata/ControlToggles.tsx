import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Moon, Sun } from "lucide-react";

interface ControlTogglesProps {
  bezelActive: boolean;
  onBezelToggle: (active: boolean) => void;
  lumeMode: boolean;
  onLumeModeToggle: (active: boolean) => void;
  lumeIntensity: number;
  onLumeIntensityChange: (intensity: number) => void;
}

const ControlToggles = ({ 
  bezelActive, 
  onBezelToggle, 
  lumeMode, 
  onLumeModeToggle,
  lumeIntensity,
  onLumeIntensityChange
}: ControlTogglesProps) => {
  return (
    <div className="flex items-center gap-3">
      {/* Lume Mode Toggle with Intensity Slider */}
      <div className={`flex items-center gap-3 px-3 py-2 rounded border transition-all duration-300 ${
        lumeMode 
          ? 'bg-strata-lume/20 border-strata-lume/50 shadow-[0_0_15px_hsla(120,100%,62%,0.3)]' 
          : 'bg-strata-charcoal/50 border-strata-steel/20'
      }`}>
        <button
          onClick={() => onLumeModeToggle(!lumeMode)}
          className={`flex items-center gap-2 transition-all duration-300 ${
            lumeMode ? 'text-strata-lume' : 'text-strata-silver hover:text-strata-white'
          }`}
        >
          <Moon className={`w-3.5 h-3.5 ${lumeMode ? 'fill-strata-lume' : ''}`} />
          <span className="text-[9px] font-mono uppercase tracking-wider">
            Lume
          </span>
        </button>
        
        {/* Intensity Slider */}
        <div className="flex items-center gap-2 ml-1">
          <Sun className={`w-3 h-3 ${lumeMode ? 'text-strata-lume/40' : 'text-strata-silver/40'}`} />
          <Slider
            value={[lumeIntensity]}
            onValueChange={(value) => onLumeIntensityChange(value[0])}
            min={20}
            max={100}
            step={5}
            className="w-16"
            disabled={!lumeMode}
          />
          <span className={`text-[8px] font-mono w-6 ${
            lumeMode ? 'text-strata-lume' : 'text-strata-silver/50'
          }`}>
            {lumeIntensity}%
          </span>
        </div>
      </div>

      {/* Bezel Toggle */}
      <div className={`flex items-center gap-2 rounded px-3 py-2 border transition-all duration-300 ${
        lumeMode 
          ? 'bg-strata-charcoal/50 border-strata-lume/20' 
          : 'bg-strata-charcoal/50 border-strata-steel/20'
      }`}>
        <span className={`text-[9px] font-mono uppercase tracking-wider ${
          lumeMode ? 'text-strata-lume/60' : 'text-strata-silver/70'
        }`}>
          Bezel
        </span>
        <Switch
          checked={bezelActive}
          onCheckedChange={onBezelToggle}
          className={`${
            lumeMode 
              ? 'data-[state=checked]:bg-strata-lume data-[state=unchecked]:bg-strata-steel' 
              : 'data-[state=checked]:bg-strata-orange data-[state=unchecked]:bg-strata-steel'
          }`}
        />
        <span className={`text-[9px] font-mono font-semibold ${
          lumeMode
            ? bezelActive ? 'text-strata-lume' : 'text-strata-lume/40'
            : bezelActive ? 'text-strata-orange' : 'text-strata-silver/50'
        }`}>
          {bezelActive ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>
  );
};

export default ControlToggles;
