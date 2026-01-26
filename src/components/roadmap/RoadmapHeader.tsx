import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LucideIcon, ArrowLeft, Beaker, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RoadmapHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badge: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  accentColor?: string;
}

export function RoadmapHeader({
  title,
  subtitle,
  icon: Icon,
  badge,
  badgeVariant = 'secondary',
  accentColor = 'emerald',
}: RoadmapHeaderProps) {
  return (
    <div className="relative">
      {/* Labs Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-3 rounded-lg border border-strata-orange/30 bg-strata-orange/5 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Beaker className="w-4 h-4 text-strata-orange" />
            <span className="text-xs font-mono text-strata-orange uppercase tracking-wider">
              R&D Preview — Roadmap visualization in active development
            </span>
          </div>
          <Link to="/labs">
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5">
              <span>View Labs</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Header Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-6"
      >
        {/* Icon */}
        <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
          <Icon className="w-8 h-8 text-primary" />
        </div>

        {/* Text */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
            <Badge variant={badgeVariant} className="font-mono text-[10px] uppercase">
              {badge}
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">{subtitle}</p>
        </div>
      </motion.div>

      {/* Decorative Line */}
      <div className="mt-6 h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />
    </div>
  );
}
