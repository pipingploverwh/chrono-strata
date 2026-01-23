import { Fish, AlertTriangle, Users, Globe, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BiologicalStewardshipPanel = () => {
  const metrics = [
    { label: "Species Tracked", value: "347", change: "-100%", status: "terminated" },
    { label: "Safety Alerts Issued", value: "12,847", change: "Historical", status: "archived" },
    { label: "International Partners", value: "23", change: "-100%", status: "terminated" },
    { label: "Research Publications", value: "89", change: "Frozen", status: "archived" },
  ];

  const trackedSpecies = [
    { name: "Great White Shark", status: "No Data", lastTracked: "Dec 2025" },
    { name: "Tiger Shark", status: "No Data", lastTracked: "Dec 2025" },
    { name: "Bull Shark", status: "No Data", lastTracked: "Dec 2025" },
    { name: "Hammerhead", status: "No Data", lastTracked: "Dec 2025" },
  ];

  return (
    <div className="h-full bg-surface-1 border border-cyan-500/20 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-950/50 to-surface-1 border-b border-cyan-500/20 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Fish className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-400">
              Legacy Program
            </span>
          </div>
          <Badge variant="destructive" className="text-[9px] font-mono">
            <XCircle className="w-3 h-3 mr-1" />
            TERMINATED
          </Badge>
        </div>
        <h2 className="text-xl font-medium text-foreground">Biological Stewardship</h2>
        <p className="text-[10px] text-muted-foreground mt-1">
          Shark Autonomy Network • Defunded Jan 2026
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 p-4">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="bg-surface-2 border border-border rounded p-3 opacity-60"
          >
            <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
              {metric.label}
            </div>
            <div className="text-lg font-mono font-bold text-foreground line-through decoration-destructive/50">
              {metric.value}
            </div>
            <div className="text-[8px] font-mono text-destructive">
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      {/* Species Tracking (Defunct) */}
      <div className="px-4 pb-4">
        <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
          Former Tracking Targets
        </div>
        <div className="space-y-2">
          {trackedSpecies.map((species, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 bg-surface-2 border border-border rounded opacity-50"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="text-xs text-muted-foreground line-through">
                  {species.name}
                </span>
              </div>
              <div className="text-[8px] font-mono text-muted-foreground">
                Last: {species.lastTracked}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Banner */}
      <div className="mx-4 mb-4 p-3 bg-amber-950/30 border border-amber-500/30 rounded flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="text-[10px] font-mono font-bold text-amber-400 mb-1">
            DATA LOSS WARNING
          </div>
          <p className="text-[9px] text-amber-300/80">
            15 years of migration pattern data at risk. No preservation mandate issued.
          </p>
        </div>
      </div>

      {/* Partners Section */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
          <Globe className="w-3 h-3" />
          Former International Partners
        </div>
        <div className="flex flex-wrap gap-1">
          {["NOAA", "EU-MARE", "AU-CSIRO", "JP-JAMSTEC", "NATO-CMRE"].map((partner) => (
            <Badge key={partner} variant="outline" className="text-[8px] opacity-50 line-through">
              {partner}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BiologicalStewardshipPanel;
