import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, differenceInDays, addDays, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";
import { 
  Egg, 
  Baby, 
  Bird, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NestingSiteDisplay } from "@/hooks/useNestingSites";

interface NestingTimelineProps {
  sites: NestingSiteDisplay[];
  onSelectSite?: (siteId: string) => void;
}

// Piping Plover breeding cycle constants
const INCUBATION_DAYS = 28;
const FLEDGING_DAYS = 30;

// Milestone phases
type MilestonePhase = "egg_laying" | "incubation" | "hatching" | "fledging" | "complete";

interface SiteMilestone {
  site: NestingSiteDisplay;
  eggLayingDate: Date;
  hatchingDate: Date;
  fledgingDate: Date;
  currentPhase: MilestonePhase;
  daysUntilNextMilestone: number;
  progress: number;
}

// Generate milestone data for each site based on last check and status
function calculateMilestones(site: NestingSiteDisplay): SiteMilestone {
  const now = new Date();
  
  // Estimate egg laying date based on last check and status
  // If site has eggs but no chicks, it's in incubation
  // If site has chicks, estimate hatching date as 28 days before now
  let eggLayingDate: Date;
  
  if (site.status === "fledged") {
    // Backtrack from now
    eggLayingDate = addDays(now, -(INCUBATION_DAYS + FLEDGING_DAYS + 10));
  } else if (site.chicks > 0) {
    // Has chicks - hatching already happened
    const daysSinceHatch = Math.min(site.chicks * 5, FLEDGING_DAYS - 5); // Rough estimate
    eggLayingDate = addDays(now, -(INCUBATION_DAYS + daysSinceHatch));
  } else if (site.eggs > 0) {
    // Has eggs - in incubation
    const lastCheck = new Date(site.lastCheck);
    const daysSinceLastCheck = differenceInDays(now, lastCheck);
    eggLayingDate = addDays(lastCheck, -Math.max(0, 14 - daysSinceLastCheck));
  } else {
    // No eggs or chicks yet
    eggLayingDate = addDays(now, 7);
  }
  
  const hatchingDate = addDays(eggLayingDate, INCUBATION_DAYS);
  const fledgingDate = addDays(hatchingDate, FLEDGING_DAYS);
  
  // Determine current phase
  let currentPhase: MilestonePhase;
  let daysUntilNextMilestone: number;
  let progress: number;
  
  if (site.status === "fledged") {
    currentPhase = "complete";
    daysUntilNextMilestone = 0;
    progress = 100;
  } else if (now < eggLayingDate) {
    currentPhase = "egg_laying";
    daysUntilNextMilestone = differenceInDays(eggLayingDate, now);
    progress = 5;
  } else if (now < hatchingDate) {
    currentPhase = "incubation";
    daysUntilNextMilestone = differenceInDays(hatchingDate, now);
    const totalIncubation = INCUBATION_DAYS;
    const daysIntoIncubation = differenceInDays(now, eggLayingDate);
    progress = 10 + (daysIntoIncubation / totalIncubation) * 35;
  } else if (now < fledgingDate) {
    currentPhase = "fledging";
    daysUntilNextMilestone = differenceInDays(fledgingDate, now);
    const daysIntoFledging = differenceInDays(now, hatchingDate);
    progress = 50 + (daysIntoFledging / FLEDGING_DAYS) * 45;
  } else {
    currentPhase = "hatching";
    daysUntilNextMilestone = 0;
    progress = 95;
  }
  
  return {
    site,
    eggLayingDate,
    hatchingDate,
    fledgingDate,
    currentPhase,
    daysUntilNextMilestone,
    progress,
  };
}

const phaseConfig = {
  egg_laying: { label: "Egg Laying", icon: Egg, color: "text-amber-400", bg: "bg-amber-500/20" },
  incubation: { label: "Incubation", icon: Egg, color: "text-cyan-400", bg: "bg-cyan-500/20" },
  hatching: { label: "Hatching", icon: Baby, color: "text-emerald-400", bg: "bg-emerald-500/20" },
  fledging: { label: "Fledging", icon: Bird, color: "text-purple-400", bg: "bg-purple-500/20" },
  complete: { label: "Complete", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/20" },
};

export default function NestingTimeline({ sites, onSelectSite }: NestingTimelineProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [expandedSite, setExpandedSite] = useState<string | null>(null);
  
  // Calculate milestones for all active sites
  const milestones = useMemo(() => {
    return sites
      .filter(s => s.status !== "abandoned")
      .map(calculateMilestones)
      .sort((a, b) => a.progress - b.progress);
  }, [sites]);
  
  // Get month boundaries for timeline
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const daysInMonth = differenceInDays(monthEnd, monthStart) + 1;
  
  // Breeding season months (April - August for Piping Plovers)
  const breedingMonths = [
    new Date(2026, 3, 1), // April
    new Date(2026, 4, 1), // May
    new Date(2026, 5, 1), // June
    new Date(2026, 6, 1), // July
    new Date(2026, 7, 1), // August
  ];
  
  const navigateMonth = (direction: number) => {
    setSelectedMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
  };
  
  // Check if a date falls within the current month view
  const isDateInMonth = (date: Date) => {
    return isWithinInterval(date, { start: monthStart, end: monthEnd });
  };
  
  // Calculate position on timeline (0-100%)
  const getDatePosition = (date: Date) => {
    if (date < monthStart) return 0;
    if (date > monthEnd) return 100;
    const dayOfMonth = differenceInDays(date, monthStart);
    return (dayOfMonth / daysInMonth) * 100;
  };
  
  // Generate day markers for the timeline
  const dayMarkers = Array.from({ length: Math.ceil(daysInMonth / 7) + 1 }, (_, i) => {
    const day = i * 7;
    return day <= daysInMonth ? addDays(monthStart, day) : null;
  }).filter(Boolean) as Date[];
  
  return (
    <Card className="bg-black/60 backdrop-blur-xl border-cyan-500/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-mono text-lg font-semibold text-white">Breeding Season Timeline</h3>
            <p className="text-xs text-neutral-400">Track nesting milestones across all active sites</p>
          </div>
        </div>
        
        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-400 hover:text-white"
            onClick={() => navigateMonth(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-mono text-sm text-white min-w-[100px] text-center">
            {format(selectedMonth, "MMMM yyyy")}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-400 hover:text-white"
            onClick={() => navigateMonth(1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Quick Month Selector */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {breedingMonths.map((month) => (
          <Button
            key={month.toISOString()}
            variant="ghost"
            size="sm"
            className={`text-xs font-mono whitespace-nowrap ${
              format(selectedMonth, "MMM yyyy") === format(month, "MMM yyyy")
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                : "text-neutral-400 hover:text-white"
            }`}
            onClick={() => setSelectedMonth(month)}
          >
            {format(month, "MMM")}
          </Button>
        ))}
      </div>
      
      {/* Phase Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {Object.entries(phaseConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${config.bg} border ${config.color.replace("text-", "border-")}`} />
            <span className="text-[10px] font-mono text-neutral-400">{config.label}</span>
          </div>
        ))}
      </div>
      
      {/* Timeline Header (Day markers) */}
      <div className="relative h-8 mb-2 border-b border-neutral-800">
        {dayMarkers.map((date) => (
          <div
            key={date.toISOString()}
            className="absolute top-0 h-full flex flex-col items-center"
            style={{ left: `${getDatePosition(date)}%` }}
          >
            <div className="w-px h-3 bg-neutral-700" />
            <span className="text-[9px] font-mono text-neutral-500 mt-1">
              {format(date, "d")}
            </span>
          </div>
        ))}
        {/* Today marker */}
        <div
          className="absolute top-0 h-full"
          style={{ left: `${getDatePosition(new Date())}%` }}
        >
          <div className="w-0.5 h-6 bg-cyan-400 rounded-full" />
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-cyan-400 whitespace-nowrap">
            Today
          </div>
        </div>
      </div>
      
      {/* Site Timelines */}
      <ScrollArea className="h-[400px]">
        <div className="space-y-3 pr-4">
          {milestones.map((milestone, index) => {
            const { site, eggLayingDate, hatchingDate, fledgingDate, currentPhase, daysUntilNextMilestone, progress } = milestone;
            const config = phaseConfig[currentPhase];
            const PhaseIcon = config.icon;
            const isExpanded = expandedSite === site.id;
            
            return (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className={`rounded-lg border transition-all cursor-pointer ${
                    isExpanded
                      ? "bg-neutral-900/80 border-cyan-500/50"
                      : "bg-neutral-900/40 border-neutral-800 hover:border-neutral-700"
                  }`}
                  onClick={() => {
                    setExpandedSite(isExpanded ? null : site.id);
                    onSelectSite?.(site.id);
                  }}
                >
                  {/* Site Header */}
                  <div className="flex items-center gap-3 p-3">
                    <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                      <PhaseIcon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-white truncate">{site.zone}</span>
                        <Badge variant="outline" className={`text-[9px] ${config.color} border-current`}>
                          {config.label}
                        </Badge>
                        {site.threatLevel === "high" && (
                          <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-neutral-400 mt-0.5">
                        <span>🥚 {site.eggs}</span>
                        <span>🐣 {site.chicks}</span>
                        {daysUntilNextMilestone > 0 && (
                          <span className={config.color}>
                            {daysUntilNextMilestone}d to next milestone
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress Ring */}
                    <div className="relative w-10 h-10">
                      <svg className="w-10 h-10 -rotate-90">
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-neutral-800"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={`${progress} 100`}
                          strokeLinecap="round"
                          className={config.color}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-white">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Timeline Bar */}
                  <div className="relative h-8 mx-3 mb-3 bg-neutral-800/50 rounded-full overflow-hidden">
                    {/* Incubation period */}
                    {isDateInMonth(eggLayingDate) || isDateInMonth(hatchingDate) ? (
                      <div
                        className="absolute h-full bg-cyan-500/30 rounded-full"
                        style={{
                          left: `${Math.max(0, getDatePosition(eggLayingDate))}%`,
                          width: `${Math.min(100, getDatePosition(hatchingDate)) - Math.max(0, getDatePosition(eggLayingDate))}%`,
                        }}
                      />
                    ) : null}
                    
                    {/* Fledging period */}
                    {isDateInMonth(hatchingDate) || isDateInMonth(fledgingDate) ? (
                      <div
                        className="absolute h-full bg-purple-500/30 rounded-full"
                        style={{
                          left: `${Math.max(0, getDatePosition(hatchingDate))}%`,
                          width: `${Math.min(100, getDatePosition(fledgingDate)) - Math.max(0, getDatePosition(hatchingDate))}%`,
                        }}
                      />
                    ) : null}
                    
                    {/* Milestone markers */}
                    {isDateInMonth(eggLayingDate) && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full border-2 border-black"
                        style={{ left: `${getDatePosition(eggLayingDate)}%` }}
                        title={`Egg Laying: ${format(eggLayingDate, "MMM d")}`}
                      />
                    )}
                    {isDateInMonth(hatchingDate) && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black"
                        style={{ left: `${getDatePosition(hatchingDate)}%` }}
                        title={`Hatching: ${format(hatchingDate, "MMM d")}`}
                      />
                    )}
                    {isDateInMonth(fledgingDate) && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full border-2 border-black"
                        style={{ left: `${getDatePosition(fledgingDate)}%` }}
                        title={`Fledging: ${format(fledgingDate, "MMM d")}`}
                      />
                    )}
                  </div>
                  
                  {/* Expanded Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-neutral-800 p-3"
                    >
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="space-y-1">
                          <div className="flex items-center justify-center gap-1">
                            <Egg className="w-3 h-3 text-amber-400" />
                            <span className="text-[10px] font-mono text-neutral-400">Egg Laying</span>
                          </div>
                          <span className="text-xs font-mono text-white">
                            {format(eggLayingDate, "MMM d")}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-center gap-1">
                            <Baby className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] font-mono text-neutral-400">Hatching</span>
                          </div>
                          <span className="text-xs font-mono text-white">
                            {format(hatchingDate, "MMM d")}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-center gap-1">
                            <Bird className="w-3 h-3 text-purple-400" />
                            <span className="text-[10px] font-mono text-neutral-400">Fledging</span>
                          </div>
                          <span className="text-xs font-mono text-white">
                            {format(fledgingDate, "MMM d")}
                          </span>
                        </div>
                      </div>
                      
                      {site.observerNotes && (
                        <div className="mt-3 p-2 bg-neutral-800/50 rounded text-[10px] text-neutral-400">
                          <span className="text-neutral-500">Notes: </span>
                          {site.observerNotes}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
          
          {milestones.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
              <Bird className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-sm font-mono">No active nesting sites</span>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3 mt-6 pt-4 border-t border-neutral-800">
        {[
          { label: "In Incubation", count: milestones.filter(m => m.currentPhase === "incubation").length, color: "text-cyan-400" },
          { label: "Hatching Soon", count: milestones.filter(m => m.currentPhase === "incubation" && m.daysUntilNextMilestone <= 7).length, color: "text-emerald-400" },
          { label: "Fledging", count: milestones.filter(m => m.currentPhase === "fledging").length, color: "text-purple-400" },
          { label: "Complete", count: milestones.filter(m => m.currentPhase === "complete").length, color: "text-green-400" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`text-xl font-mono font-bold ${stat.color}`}>{stat.count}</div>
            <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
