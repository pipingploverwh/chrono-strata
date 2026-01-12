import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, Square, Clock, FileText, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TranscriptRecord {
  id: string;
  text: string;
  duration: number;
  createdAt: string;
}

const RECORDING_DURATION = 180; // 180 seconds default

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(RECORDING_DURATION);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptRecord[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load transcripts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("voice_transcripts");
    if (stored) {
      setTranscripts(JSON.parse(stored));
    }
  }, []);

  // Save transcripts to localStorage when updated
  const saveTranscript = useCallback((text: string, duration: number) => {
    if (!text.trim()) return;
    
    const record: TranscriptRecord = {
      id: crypto.randomUUID(),
      text: text.trim(),
      duration,
      createdAt: new Date().toISOString(),
    };
    
    const updated = [record, ...transcripts];
    setTranscripts(updated);
    localStorage.setItem("voice_transcripts", JSON.stringify(updated));
    toast.success("Transcript saved to local storage");
  }, [transcripts]);

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setHasPermission(true);
      toast.success("Microphone access granted");
      return stream;
    } catch (err) {
      setHasPermission(false);
      toast.error("Microphone access denied. Please enable it in your browser settings.");
      return null;
    }
  };

  const startRecording = async () => {
    let stream = streamRef.current;
    
    if (!stream) {
      stream = await requestPermission();
      if (!stream) return;
    }

    // Reset state
    setCurrentTranscript("");
    audioChunksRef.current = [];
    setTimeRemaining(RECORDING_DURATION);
    
    // Setup MediaRecorder
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.start(1000); // Collect data every second
    
    // Setup Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      
      let finalTranscript = "";
      
      recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }
        setCurrentTranscript(finalTranscript + interimTranscript);
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };
      
      recognition.start();
      recognitionRef.current = recognition;
    }
    
    setIsRecording(true);
    
    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    toast.info("Recording started - 180 seconds");
  };

  const stopRecording = useCallback(() => {
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    // Calculate duration
    const recordedDuration = RECORDING_DURATION - timeRemaining;
    
    // Save transcript
    if (currentTranscript.trim()) {
      saveTranscript(currentTranscript, recordedDuration);
    } else {
      toast.warning("No speech detected in recording");
    }
    
    setIsRecording(false);
    setTimeRemaining(RECORDING_DURATION);
  }, [currentTranscript, timeRemaining, saveTranscript]);

  const deleteTranscript = (id: string) => {
    const updated = transcripts.filter((t) => t.id !== id);
    setTranscripts(updated);
    localStorage.setItem("voice_transcripts", JSON.stringify(updated));
    toast.success("Transcript deleted");
  };

  const downloadTranscript = (record: TranscriptRecord) => {
    const content = `Voice Transcript\nDate: ${new Date(record.createdAt).toLocaleString()}\nDuration: ${record.duration} seconds\n\n${record.text}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${record.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="strata-pod rounded-lg p-6 border border-strata-steel/30 mb-6">
      {/* Main CTA */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="mb-4">
          <Mic className={`w-12 h-12 ${isRecording ? "text-red-500 animate-pulse" : "text-strata-lume"}`} />
        </div>
        
        <h2 className="font-instrument text-xl font-bold text-strata-white mb-2">
          Voice Recorder
        </h2>
        <p className="text-[10px] font-mono uppercase tracking-wider text-strata-silver/60 mb-4">
          {isRecording ? "Recording & Transcribing..." : "Record 180 seconds • Auto-transcribe • Save locally"}
        </p>

        {/* Timer Display */}
        {isRecording && (
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-red-500" />
            <span className="text-2xl font-mono text-red-500 font-bold">
              {formatTime(timeRemaining)}
            </span>
            <span className="text-xs text-strata-silver/60">remaining</span>
          </div>
        )}

        {/* Live Transcript Preview */}
        {isRecording && currentTranscript && (
          <div className="w-full max-w-lg bg-strata-charcoal/50 rounded p-3 mb-4 max-h-24 overflow-y-auto">
            <p className="text-xs text-strata-white text-left">{currentTranscript}</p>
          </div>
        )}

        {/* Recording Button */}
        {!isRecording ? (
          <Button
            onClick={startRecording}
            size="lg"
            className="bg-strata-lume hover:bg-strata-lume/80 text-strata-black font-bold text-sm uppercase tracking-wider px-8"
          >
            <Mic className="w-5 h-5 mr-2" />
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            size="lg"
            variant="destructive"
            className="font-bold text-sm uppercase tracking-wider px-8"
          >
            <Square className="w-5 h-5 mr-2" />
            Stop Recording
          </Button>
        )}

        {hasPermission === false && (
          <p className="text-xs text-red-400 mt-2">
            Microphone access required. Please enable it in your browser settings.
          </p>
        )}
      </div>

      {/* Saved Transcripts */}
      {transcripts.length > 0 && (
        <div className="border-t border-strata-steel/30 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-strata-silver" />
            <span className="text-xs font-mono uppercase text-strata-silver">
              Saved Transcripts ({transcripts.length})
            </span>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {transcripts.map((record) => (
              <div
                key={record.id}
                className="bg-strata-charcoal/30 rounded p-3 border border-strata-steel/20"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-strata-cyan">
                      {formatDate(record.createdAt)}
                    </span>
                    <span className="text-[9px] font-mono text-strata-silver/60">
                      {record.duration}s
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadTranscript(record)}
                      className="h-6 w-6 p-0 text-strata-silver hover:text-strata-lume"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTranscript(record.id)}
                      className="h-6 w-6 p-0 text-strata-silver hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-strata-white line-clamp-2">{record.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
