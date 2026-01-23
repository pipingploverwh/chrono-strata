import { useState, useEffect } from "react";
import { useMeetingSessions, MeetingSession, MeetingTranscript, MeetingPrompt } from "@/hooks/useMeetingSessions";
import { RecordingHub } from "@/components/meetingflow/RecordingHub";
import { SessionView } from "@/components/meetingflow/SessionView";

type View = "hub" | "session";

export default function MeetingFlow() {
  const [currentView, setCurrentView] = useState<View>("hub");
  const [selectedSession, setSelectedSession] = useState<MeetingSession | null>(null);
  const [sessionTranscript, setSessionTranscript] = useState<MeetingTranscript | null>(null);
  const [sessionPrompts, setSessionPrompts] = useState<MeetingPrompt[]>([]);

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

  if (currentView === "session" && selectedSession) {
    return (
      <SessionView
        session={selectedSession}
        transcript={sessionTranscript}
        prompts={sessionPrompts}
        onBack={handleBack}
        onUpdateSession={updateSession}
        onSavePrompts={savePrompts}
        onSaveTranscript={saveTranscript}
      />
    );
  }

  return (
    <RecordingHub
      sessions={sessions}
      onSessionCreate={createSession}
      onSessionSelect={handleSessionSelect}
      onSessionDelete={deleteSession}
      onRecordingComplete={handleRecordingComplete}
    />
  );
}
