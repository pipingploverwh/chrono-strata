import { useState, useEffect, useCallback } from "react";
import { useMeetingSessions, MeetingSession, MeetingTranscript, MeetingPrompt } from "@/hooks/useMeetingSessions";
import { RecordingHub } from "@/components/meetingflow/RecordingHub";
import { SessionView } from "@/components/meetingflow/SessionView";
import { SettingsPanel, PromptSettings } from "@/components/meetingflow/SettingsPanel";
import { OperationsDashboard } from "@/components/meetingflow/OperationsDashboard";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useToast } from "@/hooks/use-toast";
import { Settings, PanelRightOpen, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";

type View = "hub" | "session";

const DEFAULT_SETTINGS: PromptSettings = {
  verbosity: "concise",
  style: "technical",
  focus: "feature",
};

export default function MeetingFlow() {
  const [currentView, setCurrentView] = useState<View>("hub");
  const [selectedSession, setSelectedSession] = useState<MeetingSession | null>(null);
  const [sessionTranscript, setSessionTranscript] = useState<MeetingTranscript | null>(null);
  const [sessionPrompts, setSessionPrompts] = useState<MeetingPrompt[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOpsOpen, setIsOpsOpen] = useState(true);
  const [promptSettings, setPromptSettings] = useState<PromptSettings>(() => {
    const stored = localStorage.getItem("meetingflow_settings");
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });
  const [isRecording, setIsRecording] = useState(false);

  const { toast } = useToast();

  const {
    sessions,
    isLoading,
    createSession,
    updateSession,
    deleteSession,
    saveTranscript,
    getTranscript,
    savePrompts,
    getPrompts,
  } = useMeetingSessions();

  // Persist settings
  useEffect(() => {
    localStorage.setItem("meetingflow_settings", JSON.stringify(promptSettings));
  }, [promptSettings]);

  // Keyboard shortcuts
  const handleToggleRecording = useCallback(() => {
    // Trigger recording toggle in hub
    if (currentView === "hub") {
      setIsRecording((prev) => !prev);
      toast({
        title: isRecording ? "Recording stopped" : "Recording shortcut",
        description: isRecording ? "Use Cmd+R to start again" : "Press button to start",
      });
    }
  }, [currentView, isRecording, toast]);

  const handleCopyFirstPrompt = useCallback(() => {
    if (sessionPrompts.length > 0) {
      navigator.clipboard.writeText(sessionPrompts[0].content);
      toast({ title: "Copied to clipboard", description: sessionPrompts[0].title });
    }
  }, [sessionPrompts, toast]);

  const handleToggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  const handleEscape = useCallback(() => {
    if (isSettingsOpen) {
      setIsSettingsOpen(false);
    } else if (currentView === "session") {
      setCurrentView("hub");
      setSelectedSession(null);
      setSessionTranscript(null);
      setSessionPrompts([]);
    }
  }, [isSettingsOpen, currentView]);

  useKeyboardShortcuts([
    { key: "r", metaKey: true, callback: handleToggleRecording },
    { key: "c", metaKey: true, callback: handleCopyFirstPrompt, enabled: sessionPrompts.length > 0 },
    { key: "s", metaKey: true, callback: handleToggleSettings },
    { key: "Escape", callback: handleEscape },
  ]);

  const handleSessionSelect = async (session: MeetingSession) => {
    setSelectedSession(session);
    
    // Load transcript and prompts
    const [transcript, prompts] = await Promise.all([
      getTranscript(session.id),
      getPrompts(session.id),
    ]);
    
    setSessionTranscript(transcript);
    setSessionPrompts(prompts);
    setCurrentView("session");
  };

  const handleRecordingComplete = async (session: MeetingSession, transcript: string) => {
    // Save transcript
    const savedTranscript = await saveTranscript(session.id, transcript);
    
    if (savedTranscript) {
      await updateSession(session.id, { status: "transcribing" });
      setSelectedSession(session);
      setSessionTranscript(savedTranscript);
      setSessionPrompts([]);
      setCurrentView("session");
    }
  };

  const handleBack = () => {
    setCurrentView("hub");
    setSelectedSession(null);
    setSessionTranscript(null);
    setSessionPrompts([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isOpsOpen ? "mr-0 lg:mr-[400px]" : ""}`}>
        {/* Floating Toolbar */}
        <div className="fixed top-4 right-4 z-30 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsOpsOpen(!isOpsOpen)}
            className="bg-background/80 backdrop-blur-sm"
          >
            {isOpsOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className="bg-background/80 backdrop-blur-sm"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {currentView === "session" && selectedSession ? (
          <SessionView
            session={selectedSession}
            transcript={sessionTranscript}
            prompts={sessionPrompts}
            onBack={handleBack}
            onUpdateSession={updateSession}
            onSavePrompts={savePrompts}
            onSaveTranscript={saveTranscript}
            promptSettings={promptSettings}
          />
        ) : (
          <RecordingHub
            sessions={sessions}
            onSessionCreate={createSession}
            onSessionSelect={handleSessionSelect}
            onSessionDelete={deleteSession}
            onRecordingComplete={handleRecordingComplete}
            externalRecordingTrigger={isRecording}
            onRecordingStateChange={setIsRecording}
          />
        )}
      </div>

      {/* Operations Dashboard Side Panel */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full lg:w-[400px] bg-background border-l border-border/50 overflow-y-auto transition-transform duration-300 z-20 ${
          isOpsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 pt-16">
          <OperationsDashboard />
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={promptSettings}
        onSettingsChange={setPromptSettings}
      />
    </div>
  );
}
