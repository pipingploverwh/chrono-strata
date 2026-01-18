import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Plus,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { format, isFuture, isPast, isToday } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VisaInterview {
  id: string;
  scheduled_date: string | null;
  interview_type: string;
  location: string;
  status: string;
  agenda: string | null;
  notes: string | null;
  outcome: string | null;
  next_actions: string[] | null;
}

interface InterviewSchedulerProps {
  interviews: VisaInterview[];
  applicationId?: string;
  onAddInterview?: (interview: Partial<VisaInterview>) => void;
  onUpdateInterview?: (id: string, updates: Partial<VisaInterview>) => void;
}

const interviewTypes = [
  { value: 'monthly', label: 'Monthly Check-in', color: 'bg-lavender/20 text-lavender' },
  { value: 'quarterly_review', label: 'Quarterly Review', color: 'bg-strata-orange/20 text-strata-orange' },
  { value: 'extension_review', label: 'Extension Review', color: 'bg-strata-lume/20 text-strata-lume' },
  { value: 'final_confirmation', label: 'Final Confirmation', color: 'bg-strata-lume/20 text-strata-lume' },
];

const statusConfig = {
  scheduled: { icon: Clock, color: 'text-lavender', bg: 'bg-lavender/10' },
  completed: { icon: CheckCircle2, color: 'text-strata-lume', bg: 'bg-strata-lume/10' },
  cancelled: { icon: AlertCircle, color: 'text-muted-foreground', bg: 'bg-muted' },
  rescheduled: { icon: CalendarDays, color: 'text-strata-orange', bg: 'bg-strata-orange/10' },
};

export function InterviewScheduler({ 
  interviews, 
  applicationId,
  onAddInterview, 
  onUpdateInterview 
}: InterviewSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInterview, setNewInterview] = useState({
    interview_type: 'monthly',
    location: 'Shibuya Ward Office, Business Support Division',
    agenda: '',
  });

  const upcomingInterviews = interviews
    .filter(i => i.scheduled_date && isFuture(new Date(i.scheduled_date)))
    .sort((a, b) => new Date(a.scheduled_date!).getTime() - new Date(b.scheduled_date!).getTime());

  const pastInterviews = interviews
    .filter(i => i.scheduled_date && isPast(new Date(i.scheduled_date)) && !isToday(new Date(i.scheduled_date)))
    .sort((a, b) => new Date(b.scheduled_date!).getTime() - new Date(a.scheduled_date!).getTime());

  const handleAddInterview = () => {
    if (selectedDate && onAddInterview) {
      onAddInterview({
        scheduled_date: selectedDate.toISOString(),
        ...newInterview,
        status: 'scheduled',
      });
      setIsDialogOpen(false);
      setNewInterview({
        interview_type: 'monthly',
        location: 'Shibuya Ward Office, Business Support Division',
        agenda: '',
      });
    }
  };

  const getTypeConfig = (type: string) => 
    interviewTypes.find(t => t.value === type) || interviewTypes[0];

  const interviewDates = interviews
    .filter(i => i.scheduled_date)
    .map(i => new Date(i.scheduled_date!));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="w-5 h-5 text-lavender" />
            Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border-0"
            modifiers={{
              interview: interviewDates,
            }}
            modifiersStyles={{
              interview: { 
                backgroundColor: 'hsl(var(--lavender))', 
                color: 'white',
                borderRadius: '50%',
              }
            }}
          />
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full mt-4" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Interview</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Interview Type</label>
                  <Select 
                    value={newInterview.interview_type}
                    onValueChange={(value) => setNewInterview(prev => ({ ...prev, interview_type: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {interviewTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input 
                    value={newInterview.location}
                    onChange={(e) => setNewInterview(prev => ({ ...prev, location: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Agenda / Topics</label>
                  <Textarea 
                    value={newInterview.agenda}
                    onChange={(e) => setNewInterview(prev => ({ ...prev, agenda: e.target.value }))}
                    placeholder="Topics to discuss..."
                    className="mt-1"
                  />
                </div>
                
                <Button onClick={handleAddInterview} className="w-full">
                  Schedule Interview
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Interview List */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-lavender" />
            Interviews
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upcoming */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Upcoming</h4>
            {upcomingInterviews.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No upcoming interviews scheduled</p>
            ) : (
              <div className="space-y-3">
                {upcomingInterviews.map((interview) => {
                  const typeConfig = getTypeConfig(interview.interview_type);
                  const StatusIcon = statusConfig[interview.status as keyof typeof statusConfig]?.icon || Clock;
                  
                  return (
                    <div 
                      key={interview.id}
                      className="p-4 rounded-lg border border-lavender/30 bg-lavender/5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={typeConfig.color}>
                              {typeConfig.label}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {interview.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              {format(new Date(interview.scheduled_date!), 'MMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {format(new Date(interview.scheduled_date!), 'h:mm a')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4" />
                            {interview.location}
                          </div>
                          {interview.agenda && (
                            <p className="text-sm text-foreground mt-2 bg-background/50 p-2 rounded">
                              {interview.agenda}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Interviews */}
          {pastInterviews.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Past Interviews</h4>
              <div className="space-y-2">
                {pastInterviews.slice(0, 3).map((interview) => {
                  const typeConfig = getTypeConfig(interview.interview_type);
                  
                  return (
                    <div 
                      key={interview.id}
                      className="p-3 rounded-lg border border-border/50 bg-background/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-strata-lume" />
                          <span className="text-sm font-medium">{typeConfig.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(interview.scheduled_date!), 'MMM d, yyyy')}
                          </span>
                        </div>
                        {interview.outcome && (
                          <Badge variant="outline" className="text-xs">
                            {interview.outcome}
                          </Badge>
                        )}
                      </div>
                      {interview.notes && (
                        <p className="text-xs text-muted-foreground mt-2 pl-7">
                          {interview.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
