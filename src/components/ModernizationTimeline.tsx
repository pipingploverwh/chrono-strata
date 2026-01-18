import { useState, useEffect, useRef } from "react";
import { 
  Circle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Users,
  Building2,
  Trophy,
  Globe,
  Network,
  Ticket
} from "lucide-react";

interface Milestone {
  id: string;
  year: string;
  quarter: string;
  title: string;
  description: string;
  category: "foundation" | "integration" | "expansion" | "optimization";
  status: "completed" | "active" | "planned";
  metrics?: string[];
  icon: React.ReactNode;
}

const milestones: Milestone[] = [
  {
    id: "q1-2026",
    year: "2026",
    quarter: "Q1",
    title: "Foundation Layer",
    description: "Core AI infrastructure deployment with weather intelligence integration",
    category: "foundation",
    status: "completed",
    metrics: ["Weather API integration", "Real-time data pipeline", "Staff training protocols"],
    icon: <Zap className="w-4 h-4" />
  },
  {
    id: "q2-2026",
    year: "2026",
    quarter: "Q2",
    title: "KAGR Data Unification",
    description: "Cross-property analytics consolidation across Patriots, Revolution, Patriot Place",
    category: "integration",
    status: "active",
    metrics: ["CRM unification", "Unified fan profiles", "Cross-sell intelligence"],
    icon: <Network className="w-4 h-4" />
  },
  {
    id: "q3-2026",
    year: "2026",
    quarter: "Q3",
    title: "Football Operations AI",
    description: "Predictive play-calling and scouting synthesis deployment",
    category: "integration",
    status: "planned",
    metrics: ["Play pattern analysis", "Draft evaluation scoring", "Training optimization"],
    icon: <Trophy className="w-4 h-4" />
  },
  {
    id: "q4-2026",
    year: "2026",
    quarter: "Q4",
    title: "Fan Experience Platform",
    description: "Gillette Stadium AI-native venue transformation",
    category: "expansion",
    status: "planned",
    metrics: ["Ticketless entry", "Predictive concessions", "Dynamic wayfinding"],
    icon: <Ticket className="w-4 h-4" />
  },
  {
    id: "q2-2027",
    year: "2027",
    quarter: "Q2",
    title: "World Cup Readiness",
    description: "Full-scale FIFA World Cup venue operations deployment",
    category: "expansion",
    status: "planned",
    metrics: ["Multi-language NLP", "Global fan personas", "Peak load scaling"],
    icon: <Globe className="w-4 h-4" />
  },
  {
    id: "q4-2027",
    year: "2027",
    quarter: "Q4",
    title: "Enterprise Expansion",
    description: "IFP supply chain intelligence and Kraft portfolio optimization",
    category: "optimization",
    status: "planned",
    metrics: ["Supply chain NLP", "Portfolio analytics", "Executive dashboards"],
    icon: <Building2 className="w-4 h-4" />
  },
  {
    id: "2028",
    year: "2028",
    quarter: "",
    title: "Continuous Learning",
    description: "Self-optimizing systems with accumulated operational data",
    category: "optimization",
    status: "planned",
    metrics: ["Model refinement", "Autonomous optimization", "Predictive maintenance"],
    icon: <Users className="w-4 h-4" />
  }
];

const categoryColors = {
  foundation: { bg: "bg-strata-steel/30", border: "border-strata-silver/20", accent: "text-strata-silver" },
  integration: { bg: "bg-strata-cyan/10", border: "border-strata-cyan/30", accent: "text-strata-cyan" },
  expansion: { bg: "bg-strata-orange/10", border: "border-strata-orange/30", accent: "text-strata-orange" },
  optimization: { bg: "bg-strata-lume/10", border: "border-strata-lume/30", accent: "text-strata-lume" }
};

const statusIcons = {
  completed: <CheckCircle2 className="w-4 h-4 text-strata-lume" />,
  active: <Clock className="w-4 h-4 text-strata-orange animate-pulse" />,
  planned: <Circle className="w-4 h-4 text-strata-silver/40" />
};

export const ModernizationTimeline = () => {
  const [hoveredMilestone, setHoveredMilestone] = useState<string | null>(null);
  const [visibleMilestones, setVisibleMilestones] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-milestone-id");
            if (id) {
              setVisibleMilestones((prev) => new Set([...prev, id]));
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = containerRef.current?.querySelectorAll("[data-milestone-id]");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Subtle section header - no sales language */}
      <div className="mb-8">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-strata-silver/40">
          Deployment Schedule
        </span>
      </div>

      {/* The timeline spine - architectural, honest */}
      <div className="absolute left-6 top-20 bottom-8 w-px bg-gradient-to-b from-strata-steel/50 via-strata-steel/30 to-transparent" />

      <div className="space-y-1">
        {milestones.map((milestone, index) => {
          const colors = categoryColors[milestone.category];
          const isVisible = visibleMilestones.has(milestone.id);
          const isHovered = hoveredMilestone === milestone.id;

          return (
            <div
              key={milestone.id}
              data-milestone-id={milestone.id}
              className={`relative pl-14 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
              onMouseEnter={() => setHoveredMilestone(milestone.id)}
              onMouseLeave={() => setHoveredMilestone(null)}
            >
              {/* Timeline node */}
              <div className={`absolute left-4 top-4 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                milestone.status === "completed" 
                  ? "bg-strata-lume/20 border-strata-lume" 
                  : milestone.status === "active"
                  ? "bg-strata-orange/20 border-strata-orange"
                  : "bg-strata-steel/20 border-strata-steel/50"
              } ${isHovered ? "scale-125" : ""}`}>
                {milestone.status === "active" && (
                  <div className="absolute inset-0 rounded-full bg-strata-orange/40 animate-ping" />
                )}
              </div>

              {/* Year marker - only show when year changes */}
              {(index === 0 || milestones[index - 1].year !== milestone.year) && (
                <div className="absolute left-0 -top-6 text-xs font-mono text-strata-silver/60">
                  {milestone.year}
                </div>
              )}

              {/* Content card - restrained, material */}
              <div className={`p-4 rounded border transition-all duration-300 ${colors.bg} ${colors.border} ${
                isHovered ? "border-opacity-100 shadow-lg" : "border-opacity-50"
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {milestone.quarter && (
                        <span className="text-[9px] font-mono uppercase tracking-wider text-strata-silver/50">
                          {milestone.quarter}
                        </span>
                      )}
                      {statusIcons[milestone.status]}
                    </div>
                    
                    <h4 className="font-instrument text-base text-strata-white mb-1">
                      {milestone.title}
                    </h4>
                    
                    <p className="text-xs text-strata-silver/60 leading-relaxed">
                      {milestone.description}
                    </p>

                    {/* Metrics - only show on hover for discovery */}
                    {milestone.metrics && (
                      <div className={`mt-3 overflow-hidden transition-all duration-300 ${
                        isHovered ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                      }`}>
                        <div className="flex flex-wrap gap-1.5">
                          {milestone.metrics.map((metric, idx) => (
                            <span
                              key={idx}
                              className={`text-[9px] font-mono px-2 py-0.5 rounded ${colors.bg} ${colors.accent}`}
                            >
                              {metric}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`p-2 rounded ${colors.bg} ${colors.accent}`}>
                    {milestone.icon}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle continuation indicator */}
      <div className="mt-8 pl-14 flex items-center gap-2 text-strata-silver/30">
        <ArrowRight className="w-4 h-4" />
        <span className="text-[10px] font-mono uppercase tracking-wider">
          Continuous optimization beyond 2030
        </span>
      </div>
    </div>
  );
};

export default ModernizationTimeline;
