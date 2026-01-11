import { Switch } from "@/components/ui/switch";

interface ControlTogglesProps {
  bezelActive: boolean;
  onBezelToggle: (active: boolean) => void;
  mode: "USA" | "ISR";
  onModeChange: (mode: "USA" | "ISR") => void;
}

const ControlToggles = ({ bezelActive, onBezelToggle, mode, onModeChange }: ControlTogglesProps) => {
  return (
    <div className="flex items-center gap-4">
      {/* Bezel Toggle */}
      <div className="flex items-center gap-2 bg-strata-charcoal/50 rounded px-3 py-2 border border-strata-steel/20">
        <span className="text-[9px] font-mono uppercase tracking-wider text-strata-silver/70">
          Bezel
        </span>
        <Switch
          checked={bezelActive}
          onCheckedChange={onBezelToggle}
          className="data-[state=checked]:bg-strata-orange data-[state=unchecked]:bg-strata-steel"
        />
        <span className={`text-[9px] font-mono font-semibold ${bezelActive ? 'text-strata-orange' : 'text-strata-silver/50'}`}>
          {bezelActive ? 'ON' : 'OFF'}
        </span>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-2 bg-strata-charcoal/50 rounded px-3 py-2 border border-strata-steel/20">
        <span className="text-[9px] font-mono uppercase tracking-wider text-strata-silver/70">
          Mode
        </span>
        <div className="flex rounded overflow-hidden border border-strata-steel/30">
          <button
            onClick={() => onModeChange("USA")}
            className={`px-2 py-1 text-[9px] font-mono font-semibold transition-colors ${
              mode === "USA" 
                ? 'bg-strata-orange text-white' 
                : 'bg-strata-steel/30 text-strata-silver hover:bg-strata-steel/50'
            }`}
          >
            USA
          </button>
          <button
            onClick={() => onModeChange("ISR")}
            className={`px-2 py-1 text-[9px] font-mono font-semibold transition-colors ${
              mode === "ISR" 
                ? 'bg-strata-orange text-white' 
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
