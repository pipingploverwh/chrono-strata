import { motion } from "framer-motion";
import { Cloud, Navigation, Loader2 } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";

interface WeatherToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

const WeatherToggle = ({ isActive, onToggle }: WeatherToggleProps) => {
  const { hasLocation, loading, locationName } = useGeolocation();

  return (
    <motion.button
      onClick={onToggle}
      className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 shadow-lg backdrop-blur-sm ${
        isActive
          ? "bg-strata-orange/20 border-strata-orange/60 text-strata-orange hover:bg-strata-orange/30"
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
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-strata-orange to-transparent" />
            <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-strata-orange to-transparent" />
          </motion.div>
          <motion.div 
            className="absolute -bottom-px -right-px w-4 h-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-strata-orange to-transparent" />
            <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-strata-orange to-transparent" />
          </motion.div>
        </>
      )}

      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : hasLocation ? (
        <Navigation className={`w-4 h-4 ${isActive ? "text-strata-orange" : "text-strata-silver"}`} />
      ) : (
        <Cloud className={`w-4 h-4 ${isActive ? "text-strata-orange" : "text-strata-silver"}`} />
      )}
      
      <div className="flex flex-col items-start">
        <span className="text-xs font-mono uppercase tracking-wider leading-tight">
          Weather
        </span>
        {hasLocation && locationName && (
          <span className="text-[9px] font-mono text-strata-silver/60 leading-tight max-w-[100px] truncate">
            {locationName.split(',')[0]}
          </span>
        )}
      </div>
      
      <div
        className={`w-2 h-2 rounded-full transition-colors ${
          isActive 
            ? "bg-strata-lume animate-pulse" 
            : hasLocation 
              ? "bg-strata-cyan" 
              : "bg-strata-steel"
        }`}
      />
    </motion.button>
  );
};

export default WeatherToggle;
