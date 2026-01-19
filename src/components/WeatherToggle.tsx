import { motion } from "framer-motion";
import { Cloud, Navigation, Loader2, Anchor, AlertTriangle } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useMarineForecast } from "@/hooks/useMarineForecast";

interface WeatherToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

const WeatherToggle = ({ isActive, onToggle }: WeatherToggleProps) => {
  const { hasLocation, loading, locationName, latitude, longitude } = useGeolocation();
  const { isNearWater, forecast } = useMarineForecast(
    latitude ?? undefined,
    longitude ?? undefined
  );

  const hasMarineWarnings = isNearWater && forecast?.warnings && forecast.warnings.length > 0;

  return (
    <motion.button
      onClick={onToggle}
      className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 shadow-lg backdrop-blur-sm ${
        hasMarineWarnings
          ? "bg-amber-500/20 border-amber-500/60 text-amber-400 hover:bg-amber-500/30"
          : isActive
            ? "bg-strata-orange/20 border-strata-orange/60 text-strata-orange hover:bg-strata-orange/30"
            : isNearWater
              ? "bg-strata-cyan/10 border-strata-cyan/30 text-strata-cyan hover:bg-strata-cyan/20"
              : "bg-strata-charcoal/90 border-strata-steel/30 text-strata-silver hover:bg-strata-charcoal hover:border-strata-steel/50"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* AAL corner accent when active */}
      {isActive && (
        <>
          <motion.div 
            className="absolute -top-px -left-px w-4 h-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r ${hasMarineWarnings ? 'from-amber-500' : isNearWater ? 'from-strata-cyan' : 'from-strata-orange'} to-transparent`} />
            <div className={`absolute top-0 left-0 w-px h-full bg-gradient-to-b ${hasMarineWarnings ? 'from-amber-500' : isNearWater ? 'from-strata-cyan' : 'from-strata-orange'} to-transparent`} />
          </motion.div>
          <motion.div 
            className="absolute -bottom-px -right-px w-4 h-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={`absolute bottom-0 right-0 w-full h-px bg-gradient-to-l ${hasMarineWarnings ? 'from-amber-500' : isNearWater ? 'from-strata-cyan' : 'from-strata-orange'} to-transparent`} />
            <div className={`absolute bottom-0 right-0 w-px h-full bg-gradient-to-t ${hasMarineWarnings ? 'from-amber-500' : isNearWater ? 'from-strata-cyan' : 'from-strata-orange'} to-transparent`} />
          </motion.div>
        </>
      )}

      {/* Warning indicator */}
      {hasMarineWarnings && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center"
        >
          <AlertTriangle className="w-2.5 h-2.5 text-amber-900" />
        </motion.div>
      )}

      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isNearWater ? (
        <Anchor className="w-4 h-4" />
      ) : hasLocation ? (
        <Navigation className="w-4 h-4" />
      ) : (
        <Cloud className="w-4 h-4" />
      )}
      
      <div className="flex flex-col items-start">
        <span className="text-xs font-mono uppercase tracking-wider leading-tight">
          {isNearWater ? 'Marine' : 'Weather'}
        </span>
        {hasLocation && locationName && (
          <span className="text-[9px] font-mono opacity-60 leading-tight max-w-[100px] truncate">
            {locationName.split(',')[0]}
          </span>
        )}
      </div>
      
      <div
        className={`w-2 h-2 rounded-full transition-colors ${
          hasMarineWarnings
            ? "bg-amber-400 animate-pulse"
            : isActive 
              ? "bg-strata-lume animate-pulse" 
              : isNearWater
                ? "bg-strata-cyan"
                : hasLocation 
                  ? "bg-strata-cyan" 
                  : "bg-strata-steel"
        }`}
      />
    </motion.button>
  );
};

export default WeatherToggle;
