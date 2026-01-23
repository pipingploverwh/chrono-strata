import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Upload, Clock, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MeetingSession } from "@/hooks/useMeetingSessions";

interface RecordingHubProps {
  sessions: MeetingSession[];
  onSessionCreate: (title: string) => Promise<MeetingSession | null>;
  onSessionSelect: (session: MeetingSession) => void;
  onSessionDelete: (id: string) => void;
  onRecordingComplete: (session: MeetingSession, transcript: string) => void;
}

export function RecordingHub({
  sessions,
  onSessionCreate,
  onSessionSelect,
  onSessionDelete,
  onRecordingComplete,
}: RecordingHubProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [activeSession, setActiveSession] = useState<MeetingSession | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create session
      const session = await onSessionCreate("New Recording");
      if (!session) return;
      setActiveSession(session);

      // Start MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      // Start Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let finalTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + " ";
            }
          }
          if (finalTranscript) {
            setCurrentTranscript((prev) => prev + finalTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      }

      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      setIsRecording(true);
      toast({ title: "Recording started", description: "Speak clearly into your microphone" });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setIsRecording(false);

    if (activeSession && currentTranscript.trim()) {
      onRecordingComplete(activeSession, currentTranscript);
      toast({ title: "Recording saved", description: "Processing transcript..." });
    }

    setCurrentTranscript("");
    setActiveSession(null);
    setRecordingTime(0);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast({
      title: "File uploaded",
      description: "Audio file processing is coming soon. Use live recording for now.",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">MeetingFlow</h1>
          <p className="text-muted-foreground">Record meetings → Generate Lovable prompts</p>
        </div>

        {/* Recording Section */}
        <Card className="border-2 border-dashed">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-6">
              {/* Recording Button */}
              <motion.div
                animate={isRecording ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Button
                  size="lg"
                  variant={isRecording ? "destructive" : "default"}
                  className="h-24 w-24 rounded-full"
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? (
                    <Square className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
              </motion.div>

              {/* Timer */}
              <div className="text-2xl font-mono tabular-nums">
                {formatTime(recordingTime)}
              </div>

              {/* Status */}
              <p className="text-sm text-muted-foreground">
                {isRecording ? "Recording... Click to stop" : "Click to start recording"}
              </p>

              {/* Live Transcript Preview */}
              <AnimatePresence>
                {isRecording && currentTranscript && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full"
                  >
                    <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground max-h-32 overflow-y-auto">
                      {currentTranscript}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* File Upload */}
              {!isRecording && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>or</span>
                  <label className="cursor-pointer hover:text-foreground transition-colors">
                    <span className="flex items-center gap-1">
                      <Upload className="h-4 w-4" />
                      upload audio file
                    </span>
                    <Input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Recent Sessions
            </h2>
            <div className="space-y-2">
              {sessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <Card
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onSessionSelect(session)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mic className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{session.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatRelativeTime(session.created_at)}</span>
                            {session.duration_seconds > 0 && (
                              <>
                                <span>•</span>
                                <span>{formatTime(session.duration_seconds)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSessionDelete(session.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
