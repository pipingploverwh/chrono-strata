import { useState } from 'react';
import { motion } from 'framer-motion';
import { StoryCard } from './StoryCard';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { UserStory, StoryStatus } from './types';

interface SprintBoardProps {
  stories: UserStory[];
  onStoryClick?: (story: UserStory) => void;
  onStoryMove?: (storyId: string, newStatus: StoryStatus) => void;
}

const COLUMNS: { status: StoryStatus; title: string; color: string }[] = [
  { status: 'backlog', title: 'Backlog', color: 'border-muted-foreground/30' },
  { status: 'design', title: 'Design Sprint', color: 'border-purple-500/50' },
  { status: 'ready', title: 'Ready to Build', color: 'border-blue-500/50' },
  { status: 'in-progress', title: 'In Progress', color: 'border-amber-500/50' },
  { status: 'qa', title: 'QA/Testing', color: 'border-cyan-500/50' },
  { status: 'done', title: 'Done', color: 'border-emerald-500/50' },
];

export function SprintBoard({ stories, onStoryClick, onStoryMove }: SprintBoardProps) {
  const [draggedStory, setDraggedStory] = useState<UserStory | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<StoryStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, story: UserStory) => {
    setDraggedStory(story);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: StoryStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDrop = (e: React.DragEvent, status: StoryStatus) => {
    e.preventDefault();
    if (draggedStory && draggedStory.status !== status) {
      onStoryMove?.(draggedStory.id, status);
    }
    setDraggedStory(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedStory(null);
    setDragOverColumn(null);
  };

  const getStoriesForColumn = (status: StoryStatus) => 
    stories.filter(s => s.status === status);

  const getColumnPoints = (status: StoryStatus) => 
    getStoriesForColumn(status).reduce((sum, s) => sum + s.points, 0);

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 p-4 min-w-max">
        {COLUMNS.map((column) => {
          const columnStories = getStoriesForColumn(column.status);
          const columnPoints = getColumnPoints(column.status);
          const isDropTarget = dragOverColumn === column.status;
          
          return (
            <motion.div
              key={column.status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`w-72 shrink-0 rounded-lg border-2 ${column.color} ${
                isDropTarget ? 'bg-primary/5 border-primary' : 'bg-muted/20'
              } transition-colors`}
              onDragOver={(e) => handleDragOver(e, column.status)}
              onDrop={(e) => handleDrop(e, column.status)}
              onDragLeave={() => setDragOverColumn(null)}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{column.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {columnStories.length}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {columnPoints}pt
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Column Content */}
              <ScrollArea className="h-[500px]">
                <div className="p-2 space-y-2" onDragEnd={handleDragEnd}>
                  {columnStories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onDragStart={handleDragStart}
                      onClick={onStoryClick}
                    />
                  ))}
                  
                  {columnStories.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground text-xs border-2 border-dashed rounded-lg">
                      Drop stories here
                    </div>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
