import { Cloud } from "lucide-react";

interface WeatherToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

const WeatherToggle = ({ isActive, onToggle }: WeatherToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 shadow-lg ${
        isActive
          ? "bg-strata-orange/20 border-strata-orange/60 text-strata-orange hover:bg-strata-orange/30"
          : "bg-strata-charcoal/90 border-strata-steel/30 text-strata-silver hover:bg-strata-charcoal hover:border-strata-steel/50"
      }`}
    >
      <Cloud className={`w-4 h-4 ${isActive ? "text-strata-orange" : "text-strata-silver"}`} />
      <span className="text-xs font-mono uppercase tracking-wider">
        Weather
      </span>
      <div
        className={`w-2 h-2 rounded-full transition-colors ${
          isActive ? "bg-strata-lume animate-pulse" : "bg-strata-steel"
        }`}
      />
    </button>
  );
};

export default WeatherToggle;
