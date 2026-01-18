import { Badge } from "@/components/ui/badge";
import { differenceInDays, format } from "date-fns";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface VisaPhaseIndicatorProps {
  currentPhase: string;
  applicationDate?: string | null;
  status: string;
}

const phases = [
  { id: 'preparation', label: 'Preparation', order: 0 },
  { id: 'submitted', label: 'Application Submitted', order: 1 },
  { id: 'initial_review', label: 'Initial 4-Month Review', order: 2 },
  { id: 'extension', label: '6-Month Extension', order: 3 },
  { id: 'residence', label: 'Status of Residence', order: 4 },
  { id: 'confirmed', label: 'Visa Confirmed', order: 5 },
];

export function VisaPhaseIndicator({ currentPhase, applicationDate, status }: VisaPhaseIndicatorProps) {
  const currentPhaseData = phases.find(p => p.id === currentPhase) || phases[0];
  const progress = ((currentPhaseData.order + 1) / phases.length) * 100;
  
  const daysRemaining = applicationDate 
    ? 730 - differenceInDays(new Date(), new Date(applicationDate))
    : null;
  
  const getStatusColor = () => {
    if (status === 'confirmed') return 'bg-strata-lume text-strata-lume-foreground';
    if (status === 'rejected') return 'bg-destructive text-destructive-foreground';
    return 'bg-lavender text-white';
  };

  const getUrgencyColor = () => {
    if (!daysRemaining) return 'text-muted-foreground';
    if (daysRemaining > 180) return 'text-strata-lume';
    if (daysRemaining > 60) return 'text-strata-orange';
    return 'text-destructive';
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Current Phase */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor()}>
              {status === 'active' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            <h2 className="text-xl font-semibold text-foreground">
              {currentPhaseData.label}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Shibuya Ward Startup Visa Program • 2-Year Timeline
          </p>
        </div>

        {/* Days Counter */}
        <div className="flex items-center gap-6">
          {applicationDate && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Started</p>
              <p className="text-sm font-medium text-foreground">
                {format(new Date(applicationDate), 'MMM d, yyyy')}
              </p>
            </div>
          )}
          
          {daysRemaining !== null && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 border border-border/50">
              <Clock className={`w-5 h-5 ${getUrgencyColor()}`} />
              <div className="text-right">
                <p className={`text-2xl font-bold ${getUrgencyColor()}`}>
                  {Math.max(0, daysRemaining)}
                </p>
                <p className="text-xs text-muted-foreground">days remaining</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          {phases.map((phase, idx) => (
            <div 
              key={phase.id}
              className={`flex-1 text-center ${
                phase.order < currentPhaseData.order 
                  ? 'text-strata-lume' 
                  : phase.order === currentPhaseData.order 
                    ? 'text-lavender font-medium' 
                    : ''
              }`}
            >
              {idx === 0 || idx === phases.length - 1 ? phase.label.split(' ')[0] : ''}
            </div>
          ))}
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-lavender to-strata-lume transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {phases.map((phase) => (
            <div 
              key={phase.id}
              className={`w-3 h-3 rounded-full border-2 transition-colors ${
                phase.order < currentPhaseData.order 
                  ? 'bg-strata-lume border-strata-lume' 
                  : phase.order === currentPhaseData.order 
                    ? 'bg-lavender border-lavender animate-pulse' 
                    : 'bg-background border-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
