import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Clock, 
  Calendar,
  CheckCircle2,
  Bell,
  ArrowRight
} from "lucide-react";
import { format, differenceInDays, addDays, addMonths, isBefore, isAfter } from "date-fns";

interface Deadline {
  id: string;
  title: string;
  date: Date;
  type: 'document' | 'interview' | 'milestone' | 'extension';
  status: 'upcoming' | 'due_soon' | 'overdue' | 'completed';
  description?: string;
}

interface DeadlineTrackerProps {
  applicationDate?: string | null;
  documents: Array<{ document_type: string; document_name: string; due_date: string | null; status: string }>;
  interviews: Array<{ scheduled_date: string | null; interview_type: string; status: string }>;
  milestones: Array<{ title: string; target_date: string | null; status: string }>;
}

export function DeadlineTracker({ applicationDate, documents, interviews, milestones }: DeadlineTrackerProps) {
  const baseDate = applicationDate ? new Date(applicationDate) : new Date();
  
  // Build deadlines from various sources
  const buildDeadlines = (): Deadline[] => {
    const deadlines: Deadline[] = [];
    
    // Key visa milestones
    const visaMilestones = [
      { title: 'Application Submission', monthOffset: 0, type: 'milestone' as const },
      { title: '4-Month Confirmation Review', monthOffset: 4, type: 'milestone' as const },
      { title: 'Extension Application', monthOffset: 5, type: 'extension' as const },
      { title: '10-Month Review', monthOffset: 10, type: 'milestone' as const },
      { title: 'Status of Residence Application', monthOffset: 11, type: 'extension' as const },
      { title: 'Final Visa Confirmation', monthOffset: 18, type: 'milestone' as const },
    ];
    
    visaMilestones.forEach((m, idx) => {
      const date = addMonths(baseDate, m.monthOffset);
      const daysUntil = differenceInDays(date, new Date());
      deadlines.push({
        id: `milestone-${idx}`,
        title: m.title,
        date,
        type: m.type,
        status: daysUntil < 0 ? 'completed' : daysUntil <= 7 ? 'due_soon' : 'upcoming',
        description: `Month ${m.monthOffset} of visa timeline`,
      });
    });
    
    // Document deadlines
    documents.forEach((doc, idx) => {
      if (doc.due_date) {
        const date = new Date(doc.due_date);
        const daysUntil = differenceInDays(date, new Date());
        deadlines.push({
          id: `doc-${idx}`,
          title: doc.document_name,
          date,
          type: 'document',
          status: doc.status === 'approved' || doc.status === 'submitted' 
            ? 'completed' 
            : daysUntil < 0 
              ? 'overdue' 
              : daysUntil <= 7 
                ? 'due_soon' 
                : 'upcoming',
        });
      }
    });
    
    // Interview deadlines
    interviews.forEach((interview, idx) => {
      if (interview.scheduled_date) {
        const date = new Date(interview.scheduled_date);
        const daysUntil = differenceInDays(date, new Date());
        deadlines.push({
          id: `interview-${idx}`,
          title: `${interview.interview_type.replace('_', ' ')} Interview`,
          date,
          type: 'interview',
          status: interview.status === 'completed' 
            ? 'completed' 
            : daysUntil < 0 
              ? 'overdue' 
              : daysUntil <= 3 
                ? 'due_soon' 
                : 'upcoming',
        });
      }
    });
    
    return deadlines.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const deadlines = buildDeadlines();
  
  const urgentDeadlines = deadlines.filter(d => d.status === 'due_soon' || d.status === 'overdue');
  const upcomingDeadlines = deadlines.filter(d => d.status === 'upcoming' && differenceInDays(d.date, new Date()) <= 30);
  const completedDeadlines = deadlines.filter(d => d.status === 'completed');

  const getUrgencyStyle = (status: string, daysUntil: number) => {
    if (status === 'completed') return { bg: 'bg-strata-lume/10', border: 'border-strata-lume/30', text: 'text-strata-lume' };
    if (status === 'overdue') return { bg: 'bg-destructive/10', border: 'border-destructive/30', text: 'text-destructive' };
    if (daysUntil <= 3) return { bg: 'bg-destructive/10', border: 'border-destructive/30', text: 'text-destructive' };
    if (daysUntil <= 7) return { bg: 'bg-strata-orange/10', border: 'border-strata-orange/30', text: 'text-strata-orange' };
    if (daysUntil <= 30) return { bg: 'bg-lavender/10', border: 'border-lavender/30', text: 'text-lavender' };
    return { bg: 'bg-muted/50', border: 'border-border/50', text: 'text-muted-foreground' };
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return '📄';
      case 'interview': return '💬';
      case 'milestone': return '🎯';
      case 'extension': return '📋';
      default: return '📌';
    }
  };

  return (
    <div className="space-y-6">
      {/* Urgent Section */}
      {urgentDeadlines.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Urgent Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentDeadlines.map((deadline) => {
                const daysUntil = differenceInDays(deadline.date, new Date());
                const style = getUrgencyStyle(deadline.status, daysUntil);
                
                return (
                  <div 
                    key={deadline.id}
                    className={`p-4 rounded-lg border ${style.border} ${style.bg}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getTypeIcon(deadline.type)}</span>
                        <div>
                          <p className="font-medium text-foreground">{deadline.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(deadline.date, 'EEEE, MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className={`text-right ${style.text}`}>
                        <p className="text-2xl font-bold">
                          {daysUntil < 0 ? Math.abs(daysUntil) : daysUntil}
                        </p>
                        <p className="text-xs uppercase">
                          {daysUntil < 0 ? 'days overdue' : 'days left'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming 30 Days */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-lavender" />
            Next 30 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingDeadlines.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No deadlines in the next 30 days
            </p>
          ) : (
            <div className="space-y-2">
              {upcomingDeadlines.map((deadline) => {
                const daysUntil = differenceInDays(deadline.date, new Date());
                const style = getUrgencyStyle(deadline.status, daysUntil);
                
                return (
                  <div 
                    key={deadline.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${style.border} ${style.bg} transition-colors hover:border-border`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{getTypeIcon(deadline.type)}</span>
                      <div>
                        <p className="font-medium text-sm text-foreground">{deadline.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(deadline.date, 'MMM d')} • {deadline.description}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${style.bg} ${style.text} border ${style.border}`}>
                      {daysUntil}d
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline Overview */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-lavender" />
            Key Milestones Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-lavender via-strata-orange to-strata-lume" />
            
            <div className="space-y-4">
              {deadlines
                .filter(d => d.type === 'milestone' || d.type === 'extension')
                .map((deadline, idx) => {
                  const daysUntil = differenceInDays(deadline.date, new Date());
                  const isComplete = deadline.status === 'completed';
                  
                  return (
                    <div key={deadline.id} className="relative pl-10">
                      <div className={`absolute left-2 top-1 w-4 h-4 rounded-full border-2 ${
                        isComplete 
                          ? 'bg-strata-lume border-strata-lume' 
                          : daysUntil <= 30 
                            ? 'bg-lavender border-lavender' 
                            : 'bg-background border-muted-foreground/30'
                      }`}>
                        {isComplete && (
                          <CheckCircle2 className="w-3 h-3 text-white absolute -top-0.5 -left-0.5" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium text-sm ${isComplete ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {deadline.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(deadline.date, 'MMMM yyyy')}
                          </p>
                        </div>
                        {!isComplete && (
                          <span className={`text-xs ${
                            daysUntil <= 30 ? 'text-lavender' : 'text-muted-foreground'
                          }`}>
                            {daysUntil > 0 ? `${daysUntil} days` : 'Today'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
