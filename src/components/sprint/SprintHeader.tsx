import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  Zap,
  Rocket,
  Pause,
  Ban,
  BarChart3,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Sprint, SprintPhase } from './types';

interface SprintHeaderProps {
  sprint: Sprint;
  totalPoints: number;
  completedPoints: number;
  shipCount: number;
  deferCount: number;
  descopeCount: number;
}

const PHASE_CONFIG: Record<SprintPhase, { label: string; color: string }> = {
  'design': { label: 'Design Sprint', color: 'bg-purple-500/10 text-purple-500' },
  'build': { label: 'Build Sprint', color: 'bg-amber-500/10 text-amber-500' },
  'review': { label: 'Sprint Review', color: 'bg-emerald-500/10 text-emerald-500' },
};

export function SprintHeader({ 
  sprint, 
  totalPoints, 
  completedPoints,
  shipCount,
  deferCount,
  descopeCount,
}: SprintHeaderProps) {
  const phaseConfig = PHASE_CONFIG[sprint.phase];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Back Link & Phase */}
      <div className="flex items-center justify-between">
        <Link 
          to="/roadmap/b2c" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roadmap</span>
        </Link>
        
        <Badge className={phaseConfig.color}>
          {phaseConfig.label}
        </Badge>
      </div>

      {/* Title */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{sprint.name}</h1>
          <p className="text-muted-foreground mt-1">
            Slash Studio Design Sprint • Agile Methodology
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Daily Standup
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {/* Timeline */}
        <div className="p-3 rounded-lg bg-muted/30 border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Timeline</span>
          </div>
          <p className="font-mono text-sm">
            {sprint.startDate.split('-').slice(1).join('/')} → {sprint.endDate.split('-').slice(1).join('/')}
          </p>
        </div>

        {/* Points */}
        <div className="p-3 rounded-lg bg-muted/30 border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Points</span>
          </div>
          <p className="font-mono text-sm">
            {completedPoints} / {totalPoints}
          </p>
        </div>

        {/* Ship */}
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <Rocket className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Ship</span>
          </div>
          <p className="font-mono text-sm text-emerald-500 font-bold">
            {shipCount} stories
          </p>
        </div>

        {/* Defer */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <Pause className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Defer</span>
          </div>
          <p className="font-mono text-sm text-amber-500 font-bold">
            {deferCount} stories
          </p>
        </div>

        {/* Descope */}
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-2 text-red-500 mb-1">
            <Ban className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Descope</span>
          </div>
          <p className="font-mono text-sm text-red-500 font-bold">
            {descopeCount} stories
          </p>
        </div>

        {/* Days Left */}
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Days Left</span>
          </div>
          <p className="font-mono text-sm text-primary font-bold">
            5 days
          </p>
        </div>
      </div>

      {/* Sprint Goals */}
      <div className="p-4 rounded-lg bg-muted/20 border">
        <h3 className="font-semibold text-sm mb-2">Sprint Goals</h3>
        <div className="grid md:grid-cols-2 gap-2">
          {sprint.goals.map((goal, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Target className="w-3 h-3 text-emerald-500" />
              <span>{goal}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
