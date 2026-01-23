import { motion } from "framer-motion";
import { FileText, Landmark, Ship, Pickaxe, Shield, TrendingUp } from "lucide-react";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: "stewardship" | "transition" | "extraction";
  icon: React.ReactNode;
  source?: string;
}

const events: TimelineEvent[] = [
  {
    date: "2017",
    title: "EO 13817 - Critical Minerals Strategy",
    description: "Federal strategy to reduce dependence on foreign critical mineral sources, laying groundwork for domestic extraction priorities.",
    type: "transition",
    icon: <FileText className="w-4 h-4" />,
    source: "Executive Order 13817"
  },
  {
    date: "2020",
    title: "NOAA Shark Research Programs",
    description: "Peak funding for biological stewardship programs including shark tracking, marine sanctuary protections, and ecosystem monitoring.",
    type: "stewardship",
    icon: <Shield className="w-4 h-4" />,
    source: "NOAA Budget FY2020"
  },
  {
    date: "2023",
    title: "Deep Sea Mining Permits Accelerated",
    description: "ISA expedites environmental review timelines for polymetallic nodule extraction in the Clarion-Clipperton Zone.",
    type: "extraction",
    icon: <Pickaxe className="w-4 h-4" />,
    source: "ISA Council Decision"
  },
  {
    date: "2024",
    title: "Project 2025 Framework Released",
    description: "Heritage Foundation blueprint proposes restructuring NOAA to prioritize economic maritime activities over conservation research.",
    type: "transition",
    icon: <Landmark className="w-4 h-4" />,
    source: "Project 2025 Ch. 21"
  },
  {
    date: "2025",
    title: "Critical Minerals Act Expansion",
    description: "Congressional action extends critical mineral definitions to include seabed resources, enabling federal extraction incentives.",
    type: "extraction",
    icon: <TrendingUp className="w-4 h-4" />,
    source: "H.R. 4521"
  },
  {
    date: "2026",
    title: "Davos Minerals Summit",
    description: "Global alignment on critical mineral supply chains with explicit pivot from marine conservation to strategic resource security.",
    type: "extraction",
    icon: <Ship className="w-4 h-4" />,
    source: "WEF Davos 2026"
  }
];

const PolicyTimeline = () => {
  const getTypeStyles = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "stewardship":
        return "bg-emerald-500/20 border-emerald-500/50 text-emerald-400";
      case "transition":
        return "bg-amber-500/20 border-amber-500/50 text-amber-400";
      case "extraction":
        return "bg-red-500/20 border-red-500/50 text-red-400";
    }
  };

  const getTypeLabel = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "stewardship":
        return "Biological Stewardship";
      case "transition":
        return "Policy Transition";
      case "extraction":
        return "Strategic Extraction";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Policy Evolution Timeline</h3>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Stewardship
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Transition
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Extraction
          </span>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500 via-amber-500 to-red-500" />

        <div className="space-y-4">
          {events.map((event, index) => (
            <motion.div
              key={event.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-10"
            >
              {/* Timeline dot */}
              <div 
                className={`absolute left-2 top-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${getTypeStyles(event.type)}`}
              >
                {event.icon}
              </div>

              <div className={`p-4 rounded-lg border ${getTypeStyles(event.type)} bg-card/50`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{event.date}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeStyles(event.type)}`}>
                        {getTypeLabel(event.type)}
                      </span>
                    </div>
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                </div>
                {event.source && (
                  <p className="text-xs text-muted-foreground/60 mt-2 font-mono">
                    Source: {event.source}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PolicyTimeline;
