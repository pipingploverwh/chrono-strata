import { LucideIcon } from "lucide-react";

interface MetricPodProps {
  label: string;
  value: string;
  unit?: string;
  status?: string;
  Icon: LucideIcon;
  highlighted?: boolean;
}

const MetricPod = ({ label, value, unit, status, Icon, highlighted = false }: MetricPodProps) => {
  return (
    <div className={`strata-pod rounded-sm p-3 border transition-all duration-300 ${
      highlighted 
        ? 'border-strata-orange/50 shadow-[0_0_15px_rgba(255,140,0,0.15)]' 
        : 'border-strata-steel/30'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-mono uppercase tracking-wider text-strata-silver/70 block mb-1">
            {label}
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`text-lg font-instrument font-semibold ${
              highlighted ? 'text-strata-orange' : 'text-strata-white'
            }`}>
              {value}
            </span>
            {unit && (
              <span className="text-[10px] font-mono text-strata-silver">
                {unit}
              </span>
            )}
          </div>
          {status && (
            <span className={`text-[8px] font-mono uppercase tracking-wide ${
              status === 'Good' || status === 'Low' 
                ? 'text-strata-lume' 
                : status === 'Moderate' 
                ? 'text-strata-orange' 
                : 'text-strata-red'
            }`}>
              {status}
            </span>
          )}
        </div>
        <div className={`p-1.5 rounded ${highlighted ? 'bg-strata-orange/10' : 'bg-strata-steel/30'}`}>
          <Icon className={`w-4 h-4 ${highlighted ? 'text-strata-orange' : 'text-strata-silver/60'}`} />
        </div>
      </div>
    </div>
  );
};

export default MetricPod;
