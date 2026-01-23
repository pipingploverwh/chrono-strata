import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTour, TourStep } from '@/hooks/useTour';
import { useLocation } from 'react-router-dom';

interface TooltipPosition {
  top: number;
  left: number;
  arrowPosition: 'top' | 'bottom' | 'left' | 'right';
}

export function QuickTourProvider({ children }: { children: React.ReactNode }) {
  const tour = useTour();
  const location = useLocation();
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Calculate position when step changes
  useEffect(() => {
    if (!tour.isActive || !tour.currentStep) {
      setTooltipPos(null);
      setTargetRect(null);
      return;
    }

    const updatePosition = () => {
      const target = document.querySelector(tour.currentStep!.target);
      if (!target) {
        // If target not found on current page, try next step
        if (tour.currentStep?.page && tour.currentStep.page !== location.pathname) {
          return;
        }
        return;
      }

      const rect = target.getBoundingClientRect();
      setTargetRect(rect);

      const placement = tour.currentStep!.placement || 'bottom';
      const padding = 16;
      const tooltipWidth = 320;
      const tooltipHeight = 180;

      let top = 0;
      let left = 0;
      let arrowPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

      switch (placement) {
        case 'top':
          top = rect.top - tooltipHeight - padding;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          arrowPosition = 'bottom';
          break;
        case 'bottom':
          top = rect.bottom + padding;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          arrowPosition = 'top';
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - padding;
          arrowPosition = 'right';
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + padding;
          arrowPosition = 'left';
          break;
      }

      // Keep tooltip within viewport
      left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
      top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));

      setTooltipPos({ top, left, arrowPosition });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [tour.isActive, tour.currentStep, location.pathname]);

  return (
    <>
      {children}
      
      <AnimatePresence>
        {tour.isActive && tooltipPos && targetRect && (
          <>
            {/* Backdrop with spotlight */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent 0px, transparent ${Math.max(targetRect.width, targetRect.height) / 2 + 20}px, rgba(0,0,0,0.7) ${Math.max(targetRect.width, targetRect.height) / 2 + 80}px)`
              }}
            />

            {/* Target highlight ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed z-[9999] pointer-events-none rounded-lg"
              style={{
                top: targetRect.top - 4,
                left: targetRect.left - 4,
                width: targetRect.width + 8,
                height: targetRect.height + 8,
                boxShadow: '0 0 0 2px hsl(var(--primary)), 0 0 20px hsl(var(--primary) / 0.5)',
              }}
            />

            {/* Tooltip */}
            <motion.div
              ref={tooltipRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed z-[10000] w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
              style={{
                top: tooltipPos.top,
                left: tooltipPos.left,
              }}
            >
              {/* Arrow */}
              <div
                className={`absolute w-3 h-3 bg-card border-border rotate-45 ${
                  tooltipPos.arrowPosition === 'top' ? '-top-1.5 left-1/2 -translate-x-1/2 border-t border-l' :
                  tooltipPos.arrowPosition === 'bottom' ? '-bottom-1.5 left-1/2 -translate-x-1/2 border-b border-r' :
                  tooltipPos.arrowPosition === 'left' ? '-left-1.5 top-1/2 -translate-y-1/2 border-l border-b' :
                  '-right-1.5 top-1/2 -translate-y-1/2 border-r border-t'
                }`}
              />

              {/* Header */}
              <div className="bg-primary/10 px-4 py-3 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Quick Tour • {tour.currentStepIndex + 1} of {tour.totalSteps}
                  </span>
                </div>
                <button
                  onClick={tour.endTour}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {tour.currentStep?.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tour.currentStep?.content}
                </p>
              </div>

              {/* Progress & Navigation */}
              <div className="px-4 pb-4">
                {/* Progress dots */}
                <div className="flex justify-center gap-1.5 mb-3">
                  {tour.steps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === tour.currentStepIndex
                          ? 'bg-primary'
                          : idx < tour.currentStepIndex
                          ? 'bg-primary/40'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={tour.prevStep}
                    disabled={tour.currentStepIndex === 0}
                    className="text-xs"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  
                  {tour.currentStepIndex === tour.totalSteps - 1 ? (
                    <Button
                      size="sm"
                      onClick={tour.endTour}
                      className="text-xs bg-primary hover:bg-primary/90"
                    >
                      Finish Tour
                      <Sparkles className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={tour.nextStep}
                      className="text-xs bg-primary hover:bg-primary/90"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Trigger button component
export function QuickTourTrigger({ className }: { className?: string }) {
  const tour = useTour();

  return (
    <Button
      onClick={tour.startTour}
      variant="outline"
      size="sm"
      className={`gap-2 ${className}`}
    >
      <Sparkles className="w-4 h-4" />
      Quick Tour
    </Button>
  );
}

// Badge to show tour is available
export function TourBadge() {
  const tour = useTour();
  
  if (tour.completedSteps.length >= tour.totalSteps) {
    return null;
  }

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
    />
  );
}
