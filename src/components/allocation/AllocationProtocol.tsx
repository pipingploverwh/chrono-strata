import { ShieldCheck, Clock, CheckCircle, Wallet, Package, ArrowRight } from "lucide-react";

interface AllocationStageProps {
  letter: string;
  name: string;
  description: string;
  avgDuration: string;
  successRate: number;
  status: "active" | "pending" | "complete";
}

const allocationStages: AllocationStageProps[] = [
  {
    letter: "S",
    name: "Submitted",
    description: "Application received and queued for review",
    avgDuration: "Instant",
    successRate: 100,
    status: "complete",
  },
  {
    letter: "H",
    name: "Hold",
    description: "Under compliance and identity verification",
    avgDuration: "24-48h",
    successRate: 92,
    status: "active",
  },
  {
    letter: "O",
    name: "Onboarded",
    description: "Buyer verified and approved for allocation",
    avgDuration: "1-2h",
    successRate: 87,
    status: "pending",
  },
  {
    letter: "W",
    name: "Waiting",
    description: "Payment authorization pending",
    avgDuration: "Variable",
    successRate: 95,
    status: "pending",
  },
  {
    letter: "S",
    name: "Secured",
    description: "Transaction complete, unit serialized",
    avgDuration: "Instant",
    successRate: 99,
    status: "pending",
  },
];

const statusColors = {
  complete: {
    bg: "bg-status-approved/20",
    text: "text-status-approved",
    dot: "bg-status-approved",
  },
  active: {
    bg: "bg-lavender/20",
    text: "text-lavender",
    dot: "bg-lavender",
  },
  pending: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

const AllocationProtocol = () => {
  return (
    <div className="bg-surface-1 border border-border rounded-md p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-md bg-lavender/20 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-lavender" />
        </div>
        <div>
          <h2 className="text-xl font-medium text-foreground tracking-tight">
            The S.H.O.W.S. Protocol
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">
            Secure High-value Order Workflow System
          </p>
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-3">
        {allocationStages.map((stage, index) => {
          const colors = statusColors[stage.status];
          return (
            <div
              key={index}
              className="flex items-center gap-4 bg-surface-2 rounded-md border border-border/50 p-4 hover:bg-surface-3 transition-colors"
            >
              {/* Letter badge */}
              <div className={`w-10 h-10 rounded-md ${colors.bg} flex items-center justify-center shrink-0`}>
                <span className={`text-lg font-medium ${colors.text}`}>
                  {stage.letter}
                </span>
              </div>

              {/* Stage info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-foreground">
                    {stage.name}
                  </h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${colors.bg} ${colors.text} uppercase tracking-wider`}>
                    {stage.successRate}% Success
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {stage.description}
                </p>
              </div>

              {/* Duration */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {stage.avgDuration}
                </span>
              </div>

              {/* Status dot */}
              <div className={`w-2 h-2 rounded-full ${colors.dot} shrink-0`} />
            </div>
          );
        })}
      </div>

      {/* Protocol Purpose */}
      <div className="mt-6 p-4 rounded-md border border-lavender/30 bg-lavender/5">
        <p className="text-sm">
          <span className="text-lavender font-medium">Protocol Purpose:</span>
          <span className="text-muted-foreground ml-2">
            A secure, sequential workflow ensuring verified buyers, controlled allocation, and full audit trail for every high-value transaction.
          </span>
        </p>
      </div>

      {/* Pipeline Metrics */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Package className="w-4 h-4 text-lavender" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Pipeline Metrics
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-lg font-medium text-foreground">47</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Today</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-status-approved">94.2%</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Approval</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-foreground">36h</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Time</div>
            </div>
          </div>
        </div>

        {/* Distribution bar */}
        <div className="h-2 rounded-full bg-surface-3 overflow-hidden flex">
          <div className="h-full bg-status-approved" style={{ width: "32%" }} title="Secured" />
          <div className="h-full bg-lavender" style={{ width: "18%" }} title="Active" />
          <div className="h-full bg-status-pending" style={{ width: "25%" }} title="Waiting" />
          <div className="h-full bg-muted-foreground/30" style={{ width: "25%" }} title="Pending" />
        </div>

        <div className="mt-2 flex justify-between text-[9px] text-muted-foreground uppercase tracking-wider">
          <span>Secured 32%</span>
          <span>Verifying 18%</span>
          <span>Waiting 25%</span>
          <span>Pending 25%</span>
        </div>
      </div>
    </div>
  );
};

export default AllocationProtocol;
