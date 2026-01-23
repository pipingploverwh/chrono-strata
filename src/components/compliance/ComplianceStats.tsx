import { Package, FileCheck, AlertTriangle, DollarSign } from "lucide-react";
import { useComplianceStats } from "@/hooks/useComplianceData";

export function ComplianceStats() {
  const { data: stats, isLoading } = useComplianceStats();

  const cards = [
    {
      label: "Active Shipments",
      value: stats?.activeShipments || 0,
      icon: Package,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10"
    },
    {
      label: "Pipeline Value",
      value: stats?.totalValue ? `$${(stats.totalValue / 1000).toFixed(0)}K` : "$0",
      icon: DollarSign,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10"
    },
    {
      label: "Pending Permits",
      value: stats?.pendingPermits || 0,
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    },
    {
      label: "Permit Approval Rate",
      value: `${stats?.permitApprovalRate || 0}%`,
      icon: FileCheck,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-mono">
                {card.label}
              </p>
              <p className={`text-2xl font-bold mt-1 ${card.color}`}>
                {isLoading ? "..." : card.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
