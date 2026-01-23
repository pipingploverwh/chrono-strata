import { ChevronRight, MapPin, Calendar, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  ComplianceShipment, 
  PHASE_LABELS, 
  PHASE_ORDER 
} from "@/hooks/useComplianceData";
import { format } from "date-fns";

interface ShipmentCardProps {
  shipment: ComplianceShipment;
  onClick: () => void;
}

const USE_CASE_LABELS: Record<string, string> = {
  clinical_trial: "Clinical Trial",
  named_patient: "Named Patient",
  commercial: "Commercial"
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  planning: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  completed: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30",
  blocked: "bg-red-500/20 text-red-400 border-red-500/30"
};

export function ShipmentCard({ shipment, onClick }: ShipmentCardProps) {
  const currentPhaseIndex = PHASE_ORDER.indexOf(shipment.current_phase);
  const progressPercent = ((currentPhaseIndex + 1) / PHASE_ORDER.length) * 100;

  return (
    <div
      onClick={onClick}
      className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 hover:border-cyan-500/50 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-neutral-500">
              {shipment.shipment_reference}
            </span>
            <Badge className={STATUS_COLORS[shipment.status] || STATUS_COLORS.planning}>
              {shipment.status}
            </Badge>
          </div>
          <h3 className="font-semibold text-white text-sm line-clamp-1">
            {shipment.description || `${shipment.origin_state} → ${shipment.destination_country}`}
          </h3>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-cyan-400 transition-colors" />
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
        <MapPin className="w-3 h-3" />
        <span>{shipment.origin_state}, USA</span>
        <span className="text-neutral-600">→</span>
        <span>{shipment.destination_country}</span>
        {shipment.destination_entity && (
          <span className="text-neutral-600">• {shipment.destination_entity}</span>
        )}
      </div>

      {/* Details Row */}
      <div className="flex items-center gap-4 text-xs mb-3">
        <div className="flex items-center gap-1.5">
          <FlaskConical className="w-3 h-3 text-purple-400" />
          <span className="text-neutral-400 capitalize">{shipment.product_type}</span>
          {shipment.thc_concentration && (
            <span className="text-purple-400 font-mono">{shipment.thc_concentration}% THC</span>
          )}
        </div>
        <Badge variant="outline" className="text-xs font-normal">
          {USE_CASE_LABELS[shipment.use_case] || shipment.use_case}
        </Badge>
      </div>

      {/* Phase Progress */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-neutral-500">Current Phase</span>
          <span className="text-cyan-400 font-medium">
            {PHASE_LABELS[shipment.current_phase]}
          </span>
        </div>
        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-800/50">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>
            Target: {shipment.target_ship_date 
              ? format(new Date(shipment.target_ship_date), "MMM d, yyyy")
              : "TBD"
            }
          </span>
        </div>
        {shipment.estimated_value && (
          <span className="text-amber-400 font-mono">
            ${(shipment.estimated_value / 1000).toFixed(0)}K
          </span>
        )}
      </div>
    </div>
  );
}
