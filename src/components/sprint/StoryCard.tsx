import { motion } from 'framer-motion';
import { 
  Clock, 
  User, 
  Tag, 
  Code2, 
  CheckCircle2,
  Circle,
  AlertTriangle,
  XCircle,
  Rocket,
  Pause,
  Ban,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { UserStory, Priority, StoryStatus } from './types';

interface StoryCardProps {
  story: UserStory;
  onDragStart?: (e: React.DragEvent, story: UserStory) => void;
  onClick?: (story: UserStory) => void;
}

const STATUS_CONFIG: Record<StoryStatus, { icon: typeof Circle; color: string; label: string }> = {
  'backlog': { icon: Circle, color: 'text-muted-foreground', label: 'Backlog' },
  'design': { icon: Clock, color: 'text-purple-500', label: 'Design' },
  'ready': { icon: CheckCircle2, color: 'text-blue-500', label: 'Ready' },
  'in-progress': { icon: AlertTriangle, color: 'text-amber-500', label: 'In Progress' },
  'qa': { icon: Code2, color: 'text-cyan-500', label: 'QA' },
  'done': { icon: CheckCircle2, color: 'text-emerald-500', label: 'Done' },
};

const PRIORITY_CONFIG: Record<Priority, { icon: typeof Rocket; color: string; bg: string; label: string }> = {
  'ship': { icon: Rocket, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30', label: 'SHIP' },
  'defer': { icon: Pause, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30', label: 'DEFER' },
  'descope': { icon: Ban, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/30', label: 'DESCOPE' },
};

export function StoryCard({ story, onDragStart, onClick }: StoryCardProps) {
  const StatusIcon = STATUS_CONFIG[story.status].icon;
  const PriorityIcon = PRIORITY_CONFIG[story.priority].icon;
  const priorityConfig = PRIORITY_CONFIG[story.priority];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`cursor-pointer border ${priorityConfig.bg} hover:shadow-lg transition-shadow`}
        draggable
        onDragStart={(e) => onDragStart?.(e, story)}
        onClick={() => onClick?.(story)}
      >
        <CardHeader className="pb-2 pt-3 px-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm leading-tight line-clamp-2">
              {story.title}
            </h4>
            <Tooltip>
              <TooltipTrigger>
                <Badge 
                  variant="outline" 
                  className={`${priorityConfig.bg} ${priorityConfig.color} text-[10px] font-bold shrink-0`}
                >
                  <PriorityIcon className="w-3 h-3 mr-1" />
                  {priorityConfig.label}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                Priority: {priorityConfig.label}
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        
        <CardContent className="px-3 pb-3">
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {story.description}
          </p>
          
          {/* Acceptance Criteria Preview */}
          {story.acceptanceCriteria.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{story.acceptanceCriteria.length} acceptance criteria</span>
              </div>
            </div>
          )}
          
          {/* API Contract Badge */}
          {story.apiContract && (
            <Badge variant="outline" className="text-[10px] mb-2 bg-cyan-500/10 text-cyan-500 border-cyan-500/30">
              <Code2 className="w-3 h-3 mr-1" />
              {story.apiContract.method} {story.apiContract.endpoint}
            </Badge>
          )}
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger>
                  <StatusIcon className={`w-4 h-4 ${STATUS_CONFIG[story.status].color}`} />
                </TooltipTrigger>
                <TooltipContent>{STATUS_CONFIG[story.status].label}</TooltipContent>
              </Tooltip>
              
              {story.assignee && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span className="truncate max-w-[60px]">{story.assignee}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{story.assignee}</TooltipContent>
                </Tooltip>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {story.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[9px] px-1 py-0">
                  {tag}
                </Badge>
              ))}
              
              <Badge variant="outline" className="text-[10px] font-mono">
                {story.points}pt
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
