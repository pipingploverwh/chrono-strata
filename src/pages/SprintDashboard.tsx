import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SprintBoard, 
  SprintHeader, 
  DesignThinkingWizard, 
  BurndownChart,
  CURRENT_SPRINT,
} from '@/components/sprint';
import type { UserStory, StoryStatus } from '@/components/sprint/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  KanbanSquare, 
  Brain, 
  TrendingDown, 
  FileCode2,
  CheckCircle2,
  Code2,
} from 'lucide-react';

export default function SprintDashboard() {
  const [stories, setStories] = useState<UserStory[]>(CURRENT_SPRINT.stories);
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleStoryMove = (storyId: string, newStatus: StoryStatus) => {
    setStories(prev => prev.map(story => 
      story.id === storyId ? { ...story, status: newStatus } : story
    ));
  };

  const handleStoryClick = (story: UserStory) => {
    setSelectedStory(story);
    setIsSheetOpen(true);
  };

  // Calculate stats
  const totalPoints = stories.reduce((sum, s) => sum + s.points, 0);
  const completedPoints = stories
    .filter(s => s.status === 'done')
    .reduce((sum, s) => sum + s.points, 0);
  const shipCount = stories.filter(s => s.priority === 'ship').length;
  const deferCount = stories.filter(s => s.priority === 'defer').length;
  const descopeCount = stories.filter(s => s.priority === 'descope').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <SprintHeader 
          sprint={CURRENT_SPRINT}
          totalPoints={totalPoints}
          completedPoints={completedPoints}
          shipCount={shipCount}
          deferCount={deferCount}
          descopeCount={descopeCount}
        />

        {/* Main Content Tabs */}
        <Tabs defaultValue="board" className="mt-8">
          <TabsList className="grid w-full grid-cols-4 max-w-lg">
            <TabsTrigger value="board" className="gap-2">
              <KanbanSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Board</span>
            </TabsTrigger>
            <TabsTrigger value="design" className="gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Design</span>
            </TabsTrigger>
            <TabsTrigger value="burndown" className="gap-2">
              <TrendingDown className="w-4 h-4" />
              <span className="hidden sm:inline">Burndown</span>
            </TabsTrigger>
            <TabsTrigger value="stories" className="gap-2">
              <FileCode2 className="w-4 h-4" />
              <span className="hidden sm:inline">Stories</span>
            </TabsTrigger>
          </TabsList>

          {/* Sprint Board */}
          <TabsContent value="board" className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <SprintBoard 
                stories={stories}
                onStoryMove={handleStoryMove}
                onStoryClick={handleStoryClick}
              />
            </motion.div>
          </TabsContent>

          {/* Design Thinking Workflow */}
          <TabsContent value="design" className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="max-w-3xl mx-auto"
            >
              <DesignThinkingWizard />
            </motion.div>
          </TabsContent>

          {/* Burndown Chart */}
          <TabsContent value="burndown" className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="max-w-4xl mx-auto"
            >
              <BurndownChart 
                data={CURRENT_SPRINT.burndownData}
                sprintName={CURRENT_SPRINT.name}
                startDate={CURRENT_SPRINT.startDate}
                endDate={CURRENT_SPRINT.endDate}
              />
            </motion.div>
          </TabsContent>

          {/* Stories List */}
          <TabsContent value="stories" className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              {stories.map(story => (
                <div 
                  key={story.id}
                  onClick={() => handleStoryClick(story)}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{story.title}</h3>
                        <Badge variant={story.priority === 'ship' ? 'default' : 'outline'} className="text-[10px]">
                          {story.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{story.description}</p>
                    </div>
                    <Badge variant="outline" className="font-mono shrink-0">
                      {story.points}pt
                    </Badge>
                  </div>
                </div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Story Detail Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-lg">
            {selectedStory && (
              <>
                <SheetHeader>
                  <SheetTitle>{selectedStory.title}</SheetTitle>
                  <SheetDescription>{selectedStory.epic}</SheetDescription>
                </SheetHeader>
                
                <ScrollArea className="h-[calc(100vh-150px)] mt-6">
                  <div className="space-y-6 pr-4">
                    {/* Status & Priority */}
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{selectedStory.status}</Badge>
                      <Badge variant={selectedStory.priority === 'ship' ? 'default' : 'secondary'}>
                        {selectedStory.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="font-mono">
                        {selectedStory.points}pt
                      </Badge>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{selectedStory.description}</p>
                    </div>

                    {/* Acceptance Criteria */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Acceptance Criteria
                      </h4>
                      <ul className="space-y-2">
                        {selectedStory.acceptanceCriteria.map((criteria, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-muted-foreground">•</span>
                            <span>{criteria}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* API Contract */}
                    {selectedStory.apiContract && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Code2 className="w-4 h-4" />
                          API Contract
                        </h4>
                        <div className="p-3 rounded-lg bg-muted/50 font-mono text-xs">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{selectedStory.apiContract.method}</Badge>
                            <span>{selectedStory.apiContract.endpoint}</span>
                          </div>
                          {selectedStory.apiContract.request && (
                            <div className="mt-2">
                              <span className="text-muted-foreground">Request:</span>
                              <pre className="mt-1 text-[10px]">
                                {JSON.stringify(selectedStory.apiContract.request, null, 2)}
                              </pre>
                            </div>
                          )}
                          {selectedStory.apiContract.response && (
                            <div className="mt-2">
                              <span className="text-muted-foreground">Response:</span>
                              <pre className="mt-1 text-[10px]">
                                {JSON.stringify(selectedStory.apiContract.response, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedStory.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Assignee */}
                    {selectedStory.assignee && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Assignee</h4>
                        <p className="text-sm">{selectedStory.assignee}</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t text-center">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Slash Studio Methodology • Agile Development Framework
          </p>
        </footer>
      </div>
    </div>
  );
}
