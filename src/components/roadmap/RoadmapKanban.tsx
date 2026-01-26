import { motion } from 'framer-motion';
import { LucideIcon, Circle, Play, CheckCircle2, Archive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface KanbanItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  tags?: string[];
}

export interface KanbanColumn {
  id: 'planned' | 'in-progress' | 'shipped' | 'archived';
  label: string;
  icon: LucideIcon;
  items: KanbanItem[];
}

interface RoadmapKanbanProps {
  columns: KanbanColumn[];
}

const columnStyles: Record<KanbanColumn['id'], string> = {
  planned: 'border-muted-foreground/30',
  'in-progress': 'border-strata-orange/50',
  shipped: 'border-emerald-500/50',
  archived: 'border-zinc-600/30',
};

const priorityStyles: Record<KanbanItem['priority'], string> = {
  high: 'bg-red-500/10 text-red-400 border-red-500/30',
  medium: 'bg-strata-orange/10 text-strata-orange border-strata-orange/30',
  low: 'bg-muted text-muted-foreground border-muted',
};

export function RoadmapKanban({ columns }: RoadmapKanbanProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((column, colIndex) => (
        <motion.div
          key={column.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: colIndex * 0.1 }}
          className="space-y-3"
        >
          {/* Column Header */}
          <div className={cn(
            'flex items-center gap-2 p-3 rounded-lg border bg-card/50 backdrop-blur-sm',
            columnStyles[column.id]
          )}>
            <column.icon className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider">
              {column.label}
            </span>
            <Badge variant="secondary" className="ml-auto text-[10px]">
              {column.items.length}
            </Badge>
          </div>

          {/* Items */}
          <div className="space-y-2">
            {column.items.map((item, itemIndex) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: colIndex * 0.1 + itemIndex * 0.05 }}
              >
                <Card className="bg-card/30 border-border/50 hover:border-primary/30 transition-colors">
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-medium leading-tight">
                        {item.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={cn('text-[10px] shrink-0', priorityStyles[item.priority])}
                      >
                        {item.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-muted/50 text-muted-foreground rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export const defaultColumns: KanbanColumn[] = [
  { id: 'planned', label: 'Planned', icon: Circle, items: [] },
  { id: 'in-progress', label: 'In Progress', icon: Play, items: [] },
  { id: 'shipped', label: 'Shipped', icon: CheckCircle2, items: [] },
  { id: 'archived', label: 'Archived', icon: Archive, items: [] },
];
