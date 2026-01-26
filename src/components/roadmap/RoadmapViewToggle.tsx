import { motion } from 'framer-motion';
import { LayoutGrid, Calendar, Table2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type RoadmapView = 'timeline' | 'kanban' | 'matrix' | 'dashboard';

interface RoadmapViewToggleProps {
  activeView: RoadmapView;
  onViewChange: (view: RoadmapView) => void;
}

const views: Array<{ id: RoadmapView; label: string; icon: typeof LayoutGrid }> = [
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
  { id: 'matrix', label: 'Matrix', icon: Table2 },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
];

export function RoadmapViewToggle({ activeView, onViewChange }: RoadmapViewToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border/50">
      {views.map((view) => {
        const isActive = activeView === view.id;
        return (
          <Button
            key={view.id}
            variant="ghost"
            size="sm"
            onClick={() => onViewChange(view.id)}
            className={cn(
              'relative h-8 gap-1.5 text-xs font-mono uppercase tracking-wider transition-colors',
              isActive
                ? 'text-primary hover:text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="roadmap-view-indicator"
                className="absolute inset-0 bg-background rounded-md border border-border shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <view.icon className="relative z-10 w-3.5 h-3.5" />
            <span className="relative z-10 hidden sm:inline">{view.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
