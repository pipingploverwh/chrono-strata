import { useTemperatureUnit } from '@/hooks/useTemperatureUnit';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TemperatureUnitToggleProps {
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'default' | 'minimal' | 'pill';
}

const TemperatureUnitToggle = ({ 
  className, 
  size = 'sm',
  variant = 'default' 
}: TemperatureUnitToggleProps) => {
  const { unit, toggleUnit } = useTemperatureUnit();

  const sizeClasses = {
    sm: 'text-[10px] gap-0.5',
    md: 'text-xs gap-1'
  };

  const buttonSizes = {
    sm: 'px-1.5 py-0.5',
    md: 'px-2 py-1'
  };

  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleUnit}
        className={cn(
          "font-mono text-slate-400 hover:text-white transition-colors",
          sizeClasses[size],
          className
        )}
        title={`Switch to °${unit === 'F' ? 'C' : 'F'}`}
      >
        °{unit}
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <div className={cn(
        "inline-flex items-center rounded-full bg-zinc-800/60 border border-zinc-700/50 p-0.5",
        className
      )}>
        <button
          onClick={() => unit !== 'F' && toggleUnit()}
          className={cn(
            "relative rounded-full font-mono transition-all",
            buttonSizes[size],
            unit === 'F' 
              ? "text-white" 
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {unit === 'F' && (
            <motion.div
              layoutId="temp-toggle-pill"
              className="absolute inset-0 bg-zinc-600/80 rounded-full"
              transition={{ type: "spring", duration: 0.3 }}
            />
          )}
          <span className="relative z-10">°F</span>
        </button>
        <button
          onClick={() => unit !== 'C' && toggleUnit()}
          className={cn(
            "relative rounded-full font-mono transition-all",
            buttonSizes[size],
            unit === 'C' 
              ? "text-white" 
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {unit === 'C' && (
            <motion.div
              layoutId="temp-toggle-pill"
              className="absolute inset-0 bg-zinc-600/80 rounded-full"
              transition={{ type: "spring", duration: 0.3 }}
            />
          )}
          <span className="relative z-10">°C</span>
        </button>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn(
      "inline-flex items-center rounded-md bg-zinc-900/50 border border-zinc-800 p-0.5",
      sizeClasses[size],
      className
    )}>
      <button
        onClick={() => unit !== 'F' && toggleUnit()}
        className={cn(
          "rounded font-mono transition-all",
          buttonSizes[size],
          unit === 'F' 
            ? "bg-zinc-700 text-white shadow-sm" 
            : "text-zinc-500 hover:text-zinc-300"
        )}
      >
        °F
      </button>
      <button
        onClick={() => unit !== 'C' && toggleUnit()}
        className={cn(
          "rounded font-mono transition-all",
          buttonSizes[size],
          unit === 'C' 
            ? "bg-zinc-700 text-white shadow-sm" 
            : "text-zinc-500 hover:text-zinc-300"
        )}
      >
        °C
      </button>
    </div>
  );
};

export default TemperatureUnitToggle;
