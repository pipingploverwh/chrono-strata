import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Clock, 
  FileText, 
  CalendarDays, 
  AlertTriangle,
  ArrowLeft,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

import { VisaPhaseIndicator } from "@/components/visa/VisaPhaseIndicator";
import { VisaTimeline } from "@/components/visa/VisaTimeline";
import { DocumentChecklist } from "@/components/visa/DocumentChecklist";
import { InterviewScheduler } from "@/components/visa/InterviewScheduler";
import { DeadlineTracker } from "@/components/visa/DeadlineTracker";
import { useVisaApplication } from "@/hooks/useVisaApplication";

export default function StartupVisa() {
  const [activeTab, setActiveTab] = useState("timeline");
  const { 
    application, 
    documents, 
    interviews, 
    milestones, 
    isLoading,
    updateDocument,
    addInterview,
    updateInterview,
  } = useVisaApplication();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-lavender/5">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-lavender/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                🇯🇵 Shibuya Startup Visa Tracker
              </h1>
              <p className="text-sm text-muted-foreground">
                LAVANDAR Intelligence Platform • Business Manager Visa
              </p>
            </div>
          </div>
          <Badge className="bg-lavender/20 text-lavender border-lavender/30">
            Information Technologies
          </Badge>
        </div>

        {/* Phase Indicator */}
        <VisaPhaseIndicator 
          currentPhase={application?.current_phase || 'preparation'}
          applicationDate={application?.application_date}
          status={application?.status || 'active'}
        />

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
            <TabsTrigger 
              value="timeline" 
              className="flex items-center gap-2 data-[state=active]:bg-background"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger 
              value="documents"
              className="flex items-center gap-2 data-[state=active]:bg-background"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Documents</span>
              {documents.filter(d => d.status === 'pending').length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center text-xs">
                  {documents.filter(d => d.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="interviews"
              className="flex items-center gap-2 data-[state=active]:bg-background"
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Interviews</span>
            </TabsTrigger>
            <TabsTrigger 
              value="deadlines"
              className="flex items-center gap-2 data-[state=active]:bg-background"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Deadlines</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="timeline" className="mt-0">
              <VisaTimeline 
                milestones={milestones}
                applicationDate={application?.application_date}
              />
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <DocumentChecklist 
                documents={documents}
                onUpdateDocument={updateDocument}
              />
            </TabsContent>

            <TabsContent value="interviews" className="mt-0">
              <InterviewScheduler 
                interviews={interviews}
                applicationId={application?.id}
                onAddInterview={addInterview}
                onUpdateInterview={updateInterview}
              />
            </TabsContent>

            <TabsContent value="deadlines" className="mt-0">
              <DeadlineTracker 
                applicationDate={application?.application_date}
                documents={documents}
                interviews={interviews}
                milestones={milestones}
              />
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer info */}
        <div className="mt-12 p-4 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📋</span>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">About Shibuya Startup Visa</p>
              <p>
                The Shibuya Ward Startup Visa program allows foreign entrepreneurs to establish 
                and develop businesses in Japan. Initial 4-month period, extendable to 10 months, 
                with pathway to full Status of Residence for Business Manager visa.
              </p>
              <p className="mt-2">
                <strong>Target Field:</strong> Information Technologies • 
                <strong> Processing:</strong> Shibuya Ward Office, Business Support Division
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
