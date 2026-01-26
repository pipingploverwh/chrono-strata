import { motion } from 'framer-motion';
import { Circle, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelinePhase {
  id: string;
  label: string;
  description: string;
  status: 'completed' | 'active' | 'planned';
}

interface RoadmapTimelineProps {
  phases: TimelinePhase[];
  accentColor?: string;
}

export function RoadmapTimeline({ phases, accentColor = 'emerald' }: RoadmapTimelineProps) {
  const getStatusIcon = (status: TimelinePhase['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'active':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Circle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: TimelinePhase['status']) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
      case 'active':
        return 'text-strata-orange bg-strata-orange/10 border-strata-orange/30 animate-pulse';
      default:
        return 'text-muted-foreground bg-muted/30 border-muted';
    }
  };

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/50 via-strata-orange/30 to-muted" />

      <div className="space-y-6">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-start gap-4 pl-2"
          >
            {/* Status Indicator */}
            <div
              className={cn(
                'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 backdrop-blur-sm',
                getStatusColor(phase.status)
              )}
            >
              {getStatusIcon(phase.status)}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-mono text-sm font-semibold uppercase tracking-wider text-foreground">
                  {phase.label}
                </h4>
                {phase.status === 'active' && (
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-strata-orange/20 text-strata-orange rounded-full">
                    Current
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{phase.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
