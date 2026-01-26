import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, CheckCircle2, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface MetricCard {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
}

interface RoadmapDashboardProps {
  metrics: MetricCard[];
  completionPercentage: number;
  activeInitiatives: number;
  upcomingMilestones: Array<{ label: string; date: string }>;
}

export function RoadmapDashboard({
  metrics,
  completionPercentage,
  activeInitiatives,
  upcomingMilestones,
}: RoadmapDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metrics */}
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <metric.icon className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{metric.value}</span>
                {metric.change && (
                <span
                    className={cn(
                      'text-xs font-mono',
                      metric.trend === 'up' && 'text-primary',
                      metric.trend === 'down' && 'text-destructive',
                      metric.trend === 'neutral' && 'text-muted-foreground'
                    )}
                  >
                    {metric.change}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="md:col-span-2"
      >
        <Card className="bg-card/50 border-border/50 h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Roadmap Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Overall Completion</span>
                <span className="text-sm font-mono font-semibold">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-strata-orange" />
                <span className="text-muted-foreground">{activeInitiatives} Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-muted-foreground">
                  {Math.round((completionPercentage / 100) * (activeInitiatives + 10))} Shipped
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="md:col-span-2"
      >
        <Card className="bg-card/50 border-border/50 h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Upcoming Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingMilestones.map((milestone, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                >
                  <span className="text-sm">{milestone.label}</span>
                  <span className="text-xs font-mono text-muted-foreground">{milestone.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
