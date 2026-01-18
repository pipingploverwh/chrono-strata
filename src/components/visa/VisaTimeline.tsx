import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";
import { format, addMonths } from "date-fns";

interface VisaMilestone {
  id: string;
  milestone_type: string;
  title: string;
  target_date: string | null;
  completed_date: string | null;
  status: string;
  description: string | null;
}

interface VisaTimelineProps {
  milestones: VisaMilestone[];
  applicationDate?: string | null;
  onUpdateMilestone?: (id: string, status: string) => void;
}

const defaultMilestones = [
  { type: 'preparation', title: 'Document Preparation', description: 'Gather all required documents for application', monthOffset: -1 },
  { type: 'submit', title: 'Application Submission', description: 'Submit application to Shibuya Ward Office', monthOffset: 0 },
  { type: 'initial_interview', title: 'Initial Interview', description: 'First interview with Business Support Division', monthOffset: 1 },
  { type: 'review_1', title: 'Month 2 Review', description: 'Progress check on business activities', monthOffset: 2 },
  { type: 'review_2', title: 'Month 3 Review', description: 'Continued business development review', monthOffset: 3 },
  { type: 'initial_decision', title: '4-Month Confirmation', description: 'Initial 4-month period confirmation', monthOffset: 4 },
  { type: 'extension_start', title: 'Extension Period Begins', description: '6-month extension period starts', monthOffset: 5 },
  { type: 'quarterly_1', title: 'Quarter 2 Review', description: 'Business milestone evaluation', monthOffset: 7 },
  { type: 'extension_end', title: 'Extension Complete', description: '10-month total period complete', monthOffset: 10 },
  { type: 'residence_apply', title: 'Apply for Status of Residence', description: 'Submit for full business manager visa', monthOffset: 11 },
  { type: 'residence_review', title: 'Immigration Review', description: 'Application under review by immigration', monthOffset: 14 },
  { type: 'confirmed', title: 'Visa Confirmed', description: 'Full Status of Residence granted', monthOffset: 18 },
];

export function VisaTimeline({ milestones, applicationDate, onUpdateMilestone }: VisaTimelineProps) {
  const baseDate = applicationDate ? new Date(applicationDate) : new Date();
  
  const getMilestoneStatus = (type: string) => {
    const milestone = milestones.find(m => m.milestone_type === type);
    return milestone?.status || 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-strata-lume" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-lavender animate-pulse" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground/50" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-strata-lume/20 text-strata-lume border-strata-lume/30">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-lavender/20 text-lavender border-lavender/30">In Progress</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Upcoming</Badge>;
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-lavender" />
          2-Year Visa Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline spine */}
          <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-lavender via-strata-lume/50 to-muted" />
          
          <div className="space-y-6">
            {defaultMilestones.map((milestone, index) => {
              const status = getMilestoneStatus(milestone.type);
              const targetDate = addMonths(baseDate, milestone.monthOffset);
              
              return (
                <div 
                  key={milestone.type}
                  className="relative pl-10 group"
                >
                  {/* Timeline node */}
                  <div className={`absolute left-0 top-1 p-0.5 rounded-full bg-background ${
                    status === 'in_progress' ? 'ring-2 ring-lavender ring-offset-2 ring-offset-background' : ''
                  }`}>
                    {getStatusIcon(status)}
                  </div>
                  
                  {/* Content */}
                  <div className={`p-4 rounded-lg border transition-all ${
                    status === 'completed' 
                      ? 'bg-strata-lume/5 border-strata-lume/20' 
                      : status === 'in_progress'
                        ? 'bg-lavender/5 border-lavender/30 shadow-sm'
                        : 'bg-background/50 border-border/50 hover:border-border'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className={`font-medium ${
                            status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                          }`}>
                            {milestone.title}
                          </h4>
                          {getStatusBadge(status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {milestone.description}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium text-foreground">
                          {format(targetDate, 'MMM yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Month {milestone.monthOffset >= 0 ? milestone.monthOffset : 'Pre-launch'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
