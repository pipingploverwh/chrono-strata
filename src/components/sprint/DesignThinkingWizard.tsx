import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Target, 
  Lightbulb, 
  Layers, 
  FlaskConical,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { DesignThinkingStep, DesignThinkingStage } from './types';
import { DESIGN_THINKING_STEPS } from './types';

interface DesignThinkingWizardProps {
  steps?: DesignThinkingStep[];
  onStepComplete?: (stage: DesignThinkingStage) => void;
}

const STAGE_ICONS: Record<DesignThinkingStage, typeof Heart> = {
  'empathize': Heart,
  'define': Target,
  'ideate': Lightbulb,
  'prototype': Layers,
  'test': FlaskConical,
};

const STAGE_COLORS: Record<DesignThinkingStage, string> = {
  'empathize': 'bg-pink-500/10 text-pink-500 border-pink-500/30',
  'define': 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  'ideate': 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  'prototype': 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  'test': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
};

export function DesignThinkingWizard({ 
  steps = DESIGN_THINKING_STEPS,
  onStepComplete 
}: DesignThinkingWizardProps) {
  const [activeStage, setActiveStage] = useState<DesignThinkingStage>('prototype');
  const [checkedActivities, setCheckedActivities] = useState<Record<string, boolean>>({});
  
  const activeStep = steps.find(s => s.stage === activeStage)!;
  const activeIndex = steps.findIndex(s => s.stage === activeStage);
  const completedCount = steps.filter(s => s.isComplete).length;
  const progress = (completedCount / steps.length) * 100;

  const toggleActivity = (activity: string) => {
    setCheckedActivities(prev => ({
      ...prev,
      [`${activeStage}-${activity}`]: !prev[`${activeStage}-${activity}`]
    }));
  };

  const getActivityChecked = (activity: string) => 
    checkedActivities[`${activeStage}-${activity}`] || false;

  const goToNext = () => {
    if (activeIndex < steps.length - 1) {
      setActiveStage(steps[activeIndex + 1].stage);
    }
  };

  const goToPrev = () => {
    if (activeIndex > 0) {
      setActiveStage(steps[activeIndex - 1].stage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Design Thinking Progress</span>
          <span className="font-mono">{completedCount}/{steps.length} stages</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Stage Selector */}
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const Icon = STAGE_ICONS[step.stage];
          const isActive = step.stage === activeStage;
          const isComplete = step.isComplete;
          
          return (
            <button
              key={step.stage}
              onClick={() => setActiveStage(step.stage)}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                isActive 
                  ? STAGE_COLORS[step.stage] + ' border-current' 
                  : isComplete
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-muted/30 border-transparent hover:border-border'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {isComplete && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 absolute -top-1 -right-1" />
                )}
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Stage Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className={STAGE_COLORS[activeStage]}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = STAGE_ICONS[activeStage];
                    return <Icon className="w-6 h-6" />;
                  })()}
                  <div>
                    <CardTitle className="text-lg">{activeStep.title}</CardTitle>
                    <CardDescription className="text-current/70">
                      {activeStep.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={activeStep.isComplete ? 'default' : 'outline'} className="shrink-0">
                  {activeStep.isComplete ? 'Complete' : 'In Progress'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Activities Checklist */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Activities</h4>
                <div className="space-y-2">
                  {activeStep.activities.map((activity) => (
                    <div 
                      key={activity}
                      className="flex items-center gap-3 p-2 rounded-lg bg-background/50 hover:bg-background transition-colors"
                    >
                      <Checkbox 
                        checked={getActivityChecked(activity)}
                        onCheckedChange={() => toggleActivity(activity)}
                        id={`activity-${activity}`}
                      />
                      <label 
                        htmlFor={`activity-${activity}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {activity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Deliverables</h4>
                <div className="flex flex-wrap gap-2">
                  {activeStep.deliverables.map((deliverable) => (
                    <Badge key={deliverable} variant="secondary" className="text-xs">
                      {deliverable}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={goToPrev}
                  disabled={activeIndex === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={goToNext}
                  disabled={activeIndex === steps.length - 1}
                >
                  Next Stage
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Slash Studio Principle */}
      <div className="text-center p-4 bg-muted/30 rounded-lg border border-dashed">
        <p className="text-xs text-muted-foreground italic">
          "Design sprints run 4 weeks ahead of build sprints — buffer for discussions without risking delivery"
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">— Slash Projects Studio Methodology</p>
      </div>
    </div>
  );
}
