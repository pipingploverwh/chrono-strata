import { useState, useEffect, useCallback } from 'react';

export interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  page?: string; // route path this step applies to
}

interface TourState {
  isActive: boolean;
  currentStepIndex: number;
  completedSteps: string[];
}

const TOUR_STORAGE_KEY = 'moran-quick-tour';

const defaultTourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: '[data-tour="welcome"]',
    title: 'Welcome to LAVANDAR',
    content: 'This is your personal command center. Let me show you around the key features.',
    placement: 'bottom',
    page: '/for-moran'
  },
  {
    id: 'private-notes',
    target: '[data-tour="private-notes"]',
    title: 'Private Notes',
    content: 'Leave feedback on any feature. Your notes are encrypted and only visible to you.',
    placement: 'left',
    page: '/for-moran'
  },
  {
    id: 'navigation',
    target: '[data-tour="navigation"]',
    title: 'Global Navigation',
    content: 'Access any part of the platform instantly. Routes are organized by industry vertical.',
    placement: 'left'
  },
  {
    id: 'weather-intel',
    target: '[data-tour="weather-intel"]',
    title: 'Weather Intelligence',
    content: 'Real-time atmospheric data powering enterprise decisions across aviation, marine, and events.',
    placement: 'bottom',
    page: '/for-moran'
  },
  {
    id: 'technical-advisory',
    target: '[data-tour="technical-advisory"]',
    title: 'Technical Advisory',
    content: 'Documentation of technical contributions from pipingploverwh GitHub and advisory services.',
    placement: 'top',
    page: '/for-moran'
  }
];

export function useTour(customSteps?: TourStep[]) {
  const steps = customSteps || defaultTourSteps;
  
  const [state, setState] = useState<TourState>(() => {
    try {
      const stored = localStorage.getItem(TOUR_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return {
      isActive: false,
      currentStepIndex: 0,
      completedSteps: []
    };
  });

  useEffect(() => {
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const currentStep = steps[state.currentStepIndex] || null;

  const startTour = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: true,
      currentStepIndex: 0
    }));
  }, []);

  const endTour = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => {
      const newIndex = prev.currentStepIndex + 1;
      if (newIndex >= steps.length) {
        return {
          ...prev,
          isActive: false,
          completedSteps: [...new Set([...prev.completedSteps, steps[prev.currentStepIndex]?.id])]
        };
      }
      return {
        ...prev,
        currentStepIndex: newIndex,
        completedSteps: [...new Set([...prev.completedSteps, steps[prev.currentStepIndex]?.id])]
      };
    });
  }, [steps]);

  const prevStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStepIndex: Math.max(0, prev.currentStepIndex - 1)
    }));
  }, []);

  const goToStep = useCallback((stepId: string) => {
    const index = steps.findIndex(s => s.id === stepId);
    if (index >= 0) {
      setState(prev => ({
        ...prev,
        currentStepIndex: index,
        isActive: true
      }));
    }
  }, [steps]);

  const resetTour = useCallback(() => {
    setState({
      isActive: false,
      currentStepIndex: 0,
      completedSteps: []
    });
  }, []);

  return {
    isActive: state.isActive,
    currentStep,
    currentStepIndex: state.currentStepIndex,
    totalSteps: steps.length,
    completedSteps: state.completedSteps,
    startTour,
    endTour,
    nextStep,
    prevStep,
    goToStep,
    resetTour,
    steps
  };
}
