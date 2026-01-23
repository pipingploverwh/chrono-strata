import { Pickaxe, TrendingUp, Battery, DollarSign, Zap, Ship, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const StrategicExtractionPanel = () => {
  const metrics = [
    { label: "Manganese Mapped", value: "2.4M", unit: "tons", change: "+∞", status: "accelerating" },
    { label: "Supply Chain Independence", value: "34", unit: "%", change: "+34%", status: "growing" },
    { label: "Projected Revenue", value: "$847B", unit: "", change: "+∞", status: "projected" },
    { label: "Active Zones", value: "12", unit: "", change: "+12", status: "new" },
  ];

  const minerals = [
    { name: "Cobalt", mapped: 78, strategic: "EV Batteries" },
    { name: "Manganese", mapped: 92, strategic: "Steel/Defense" },
    { name: "Nickel", mapped: 65, strategic: "Energy Storage" },
    { name: "Rare Earths", mapped: 41, strategic: "Electronics" },
  ];

  const zones = [
    { name: "Pacific EEZ Alpha", status: "Surveying", vessels: 3 },
    { name: "Gulf Stream Beta", status: "Mapping", vessels: 2 },
    { name: "Atlantic Ridge Gamma", status: "Assessment", vessels: 1 },
  ];

  return (
    <div className="h-full bg-surface-1 border border-amber-500/20 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950/50 to-surface-1 border-b border-amber-500/20 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Pickaxe className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400">
              New Direction
            </span>
          </div>
          <Badge className="bg-status-approved/20 text-status-approved border-status-approved/30 text-[9px] font-mono">
            <Zap className="w-3 h-3 mr-1" />
            ACCELERATING
          </Badge>
        </div>
        <h2 className="text-xl font-medium text-foreground">Strategic Extraction</h2>
        <p className="text-[10px] text-muted-foreground mt-1">
          Deep Sea Mining Initiative • EO-13817 Mandate
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 p-4">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="bg-surface-2 border border-amber-500/10 rounded p-3"
          >
            <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
              {metric.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-mono font-bold text-foreground">
                {metric.value}
              </span>
              <span className="text-[10px] text-muted-foreground">{metric.unit}</span>
            </div>
            <div className="text-[8px] font-mono text-status-approved">
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      {/* Mineral Deposits */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
          <Battery className="w-3 h-3" />
          Critical Mineral Mapping
        </div>
        <div className="space-y-3">
          {minerals.map((mineral, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground">{mineral.name}</span>
                <span className="text-[9px] font-mono text-muted-foreground">
                  {mineral.strategic}
                </span>
              </div>
              <Progress value={mineral.mapped} className="h-1.5" />
              <div className="text-right text-[8px] font-mono text-status-approved">
                {mineral.mapped}% mapped
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Zones */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
          <Ship className="w-3 h-3" />
          Active Extraction Zones
        </div>
        <div className="space-y-2">
          {zones.map((zone, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 bg-amber-950/20 border border-amber-500/20 rounded"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-status-approved" />
                <span className="text-xs text-foreground">{zone.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[8px] border-amber-500/30 text-amber-400">
                  {zone.status}
                </Badge>
                <span className="text-[8px] font-mono text-muted-foreground">
                  {zone.vessels} vessels
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Projection */}
      <div className="mx-4 mb-4 p-3 bg-status-approved/10 border border-status-approved/20 rounded">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-status-approved" />
            <span className="text-[10px] font-mono text-status-approved">
              10-Year Revenue Projection
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-status-approved" />
            <span className="text-sm font-mono font-bold text-status-approved">
              $1.2T
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicExtractionPanel;
