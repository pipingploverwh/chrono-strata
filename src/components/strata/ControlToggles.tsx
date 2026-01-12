import { Switch } from "@/components/ui/switch";
import { Moon } from "lucide-react";

interface ControlTogglesProps {
  bezelActive: boolean;
  onBezelToggle: (active: boolean) => void;
  lumeMode: boolean;
  onLumeModeToggle: (active: boolean) => void;
  mode: "USA" | "ISR";
  onModeChange: (mode: "USA" | "ISR") => void;
}

const ControlToggles = ({ 
  bezelActive, 
  onBezelToggle, 
  lumeMode, 
  onLumeModeToggle, 
  mode, 
  onModeChange 
}: ControlTogglesProps) => {
  return (
    <div className="flex items-center gap-3">
      {/* Lume Mode Toggle */}
      <button
        onClick={() => onLumeModeToggle(!lumeMode)}
        className={`flex items-center gap-2 px-3 py-2 rounded border transition-all duration-300 ${
          lumeMode 
            ? 'bg-strata-lume/20 border-strata-lume/50 text-strata-lume shadow-[0_0_15px_hsla(120,100%,62%,0.3)]' 
            : 'bg-strata-charcoal/50 border-strata-steel/20 text-strata-silver hover:bg-strata-steel/50'
        }`}
      >
        <Moon className={`w-3.5 h-3.5 ${lumeMode ? 'fill-strata-lume' : ''}`} />
        <span className="text-[9px] font-mono uppercase tracking-wider">
          Lume
        </span>
      </button>

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

      {/* Mode Toggle */}
      <div className={`flex items-center gap-2 rounded px-3 py-2 border transition-all duration-300 ${
        lumeMode 
          ? 'bg-strata-charcoal/50 border-strata-lume/20' 
          : 'bg-strata-charcoal/50 border-strata-steel/20'
      }`}>
        <span className={`text-[9px] font-mono uppercase tracking-wider ${
          lumeMode ? 'text-strata-lume/60' : 'text-strata-silver/70'
        }`}>
          Mode
        </span>
        <div className={`flex rounded overflow-hidden border ${
          lumeMode ? 'border-strata-lume/30' : 'border-strata-steel/30'
        }`}>
          <button
            onClick={() => onModeChange("USA")}
            className={`px-2 py-1 text-[9px] font-mono font-semibold transition-colors ${
              mode === "USA" 
                ? lumeMode 
                  ? 'bg-strata-lume text-strata-black' 
                  : 'bg-strata-orange text-white'
                : lumeMode
                  ? 'bg-strata-steel/30 text-strata-lume/60 hover:bg-strata-lume/10'
                  : 'bg-strata-steel/30 text-strata-silver hover:bg-strata-steel/50'
            }`}
          >
            USA
          </button>
          <button
            onClick={() => onModeChange("ISR")}
            className={`px-2 py-1 text-[9px] font-mono font-semibold transition-colors ${
              mode === "ISR" 
                ? lumeMode 
                  ? 'bg-strata-lume text-strata-black' 
                  : 'bg-strata-orange text-white'
                : lumeMode
                  ? 'bg-strata-steel/30 text-strata-lume/60 hover:bg-strata-lume/10'
                  : 'bg-strata-steel/30 text-strata-silver hover:bg-strata-steel/50'
            }`}
          >
            ישראל
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlToggles;
