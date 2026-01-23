import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Check, Wand2, Loader2, Edit2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MeetingSession, MeetingPrompt, MeetingTranscript } from "@/hooks/useMeetingSessions";
import { PromptSettings } from "@/components/meetingflow/SettingsPanel";

interface SessionViewProps {
  session: MeetingSession;
  transcript: MeetingTranscript | null;
  prompts: MeetingPrompt[];
  onBack: () => void;
  onUpdateSession: (id: string, updates: Partial<MeetingSession>) => Promise<MeetingSession | null>;
  onSavePrompts: (sessionId: string, prompts: { title: string; content: string }[]) => Promise<MeetingPrompt[] | null>;
  onSaveTranscript: (sessionId: string, content: string) => Promise<MeetingTranscript | null>;
  promptSettings?: PromptSettings;
}

export function SessionView({
  session,
  transcript,
  prompts: initialPrompts,
  onBack,
  onUpdateSession,
  onSavePrompts,
  onSaveTranscript,
  promptSettings,
}: SessionViewProps) {
  const [title, setTitle] = useState(session.title);
  const [transcriptContent, setTranscriptContent] = useState(transcript?.content || "");
  const [prompts, setPrompts] = useState(initialPrompts);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEditingTranscript, setIsEditingTranscript] = useState(!transcript);
  
  const { toast } = useToast();

  useEffect(() => {
    if (transcript) {
      setTranscriptContent(transcript.content);
    }
  }, [transcript]);

  const handleTitleBlur = async () => {
    if (title !== session.title) {
      await onUpdateSession(session.id, { title });
    }
  };

  const handleTranscriptSave = async () => {
    if (transcriptContent.trim()) {
      await onSaveTranscript(session.id, transcriptContent);
      setIsEditingTranscript(false);
      toast({ title: "Transcript saved" });
    }
  };

  const generatePrompts = async () => {
    if (!transcriptContent.trim()) {
      toast({
        title: "No transcript",
        description: "Add a transcript first before generating prompts",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-prompts", {
        body: { transcript: transcriptContent },
      });

      if (error) throw error;

      if (data?.data?.prompts) {
        const newPrompts = data.data.prompts;
        const saved = await onSavePrompts(session.id, newPrompts);
        if (saved) {
          setPrompts(saved);
          await onUpdateSession(session.id, { status: "complete" });
          toast({ title: "Prompts generated!", description: `Created ${saved.length} prompts` });
        }
      }
    } catch (error) {
      console.error("Error generating prompts:", error);
      toast({
        title: "Generation failed",
        description: "Could not generate prompts. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (promptId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(promptId);
      setTimeout(() => setCopiedId(null), 2000);
      toast({ title: "Copied to clipboard" });
    } catch (error) {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="text-xl font-semibold border-none bg-transparent px-0 focus-visible:ring-0"
          />
        </div>

        {/* Transcript Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              📝 Transcript
            </CardTitle>
            {!isEditingTranscript && transcriptContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingTranscript(true)}
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditingTranscript ? (
              <div className="space-y-3">
                <Textarea
                  placeholder="Paste or type your meeting transcript here..."
                  value={transcriptContent}
                  onChange={(e) => setTranscriptContent(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
                <div className="flex justify-end gap-2">
                  {transcript && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTranscriptContent(transcript.content);
                        setIsEditingTranscript(false);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button onClick={handleTranscriptSave}>Save Transcript</Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto">
                {transcriptContent || "No transcript yet. Record or paste content above."}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={generatePrompts}
            disabled={isGenerating || !transcriptContent.trim()}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : prompts.length > 0 ? (
              <>
                <RefreshCw className="h-5 w-5" />
                Regenerate Prompts
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" />
                Generate Lovable Prompts
              </>
            )}
          </Button>
        </div>

        {/* Prompts Section */}
        {prompts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              🪄 Generated Prompts ({prompts.length})
            </h2>
            <div className="space-y-3">
              {prompts.map((prompt, index) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">
                              {index + 1}
                            </span>
                            <h3 className="font-medium">{prompt.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {prompt.content}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={() => copyToClipboard(prompt.id, prompt.content)}
                        >
                          {copiedId === prompt.id ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
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
