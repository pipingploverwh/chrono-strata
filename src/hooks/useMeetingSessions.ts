import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MeetingSession {
  id: string;
  title: string;
  duration_seconds: number;
  status: "draft" | "recording" | "transcribing" | "complete";
  created_at: string;
  updated_at: string;
}

export interface MeetingTranscript {
  id: string;
  session_id: string;
  content: string;
  created_at: string;
}

export interface MeetingPrompt {
  id: string;
  session_id: string;
  title: string;
  content: string;
  sort_order: number;
  created_at: string;
}

export function useMeetingSessions() {
  const [sessions, setSessions] = useState<MeetingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from("meeting_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSessions(data as MeetingSession[]);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast({
        title: "Error",
        description: "Failed to load sessions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createSession = async (title: string = "Untitled Meeting") => {
    try {
      const { data, error } = await supabase
        .from("meeting_sessions")
        .insert({ title, status: "draft" })
        .select()
        .single();

      if (error) throw error;
      setSessions((prev) => [data as MeetingSession, ...prev]);
      return data as MeetingSession;
    } catch (error) {
      console.error("Error creating session:", error);
      toast({
        title: "Error",
        description: "Failed to create session",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateSession = async (id: string, updates: Partial<MeetingSession>) => {
    try {
      const { data, error } = await supabase
        .from("meeting_sessions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? (data as MeetingSession) : s))
      );
      return data as MeetingSession;
    } catch (error) {
      console.error("Error updating session:", error);
      toast({
        title: "Error",
        description: "Failed to update session",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from("meeting_sessions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast({
        title: "Deleted",
        description: "Session removed",
      });
    } catch (error) {
      console.error("Error deleting session:", error);
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      });
    }
  };

  const saveTranscript = async (sessionId: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from("meeting_transcripts")
        .insert({ session_id: sessionId, content })
        .select()
        .single();

      if (error) throw error;
      return data as MeetingTranscript;
    } catch (error) {
      console.error("Error saving transcript:", error);
      toast({
        title: "Error",
        description: "Failed to save transcript",
        variant: "destructive",
      });
      return null;
    }
  };

  const getTranscript = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from("meeting_transcripts")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as MeetingTranscript | null;
    } catch (error) {
      console.error("Error fetching transcript:", error);
      return null;
    }
  };

  const savePrompts = async (sessionId: string, prompts: { title: string; content: string }[]) => {
    try {
      // Delete existing prompts first
      await supabase
        .from("meeting_prompts")
        .delete()
        .eq("session_id", sessionId);

      // Insert new prompts
      const promptsToInsert = prompts.map((p, index) => ({
        session_id: sessionId,
        title: p.title,
        content: p.content,
        sort_order: index,
      }));

      const { data, error } = await supabase
        .from("meeting_prompts")
        .insert(promptsToInsert)
        .select();

      if (error) throw error;
      return data as MeetingPrompt[];
    } catch (error) {
      console.error("Error saving prompts:", error);
      toast({
        title: "Error",
        description: "Failed to save prompts",
        variant: "destructive",
      });
      return null;
    }
  };

  const getPrompts = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from("meeting_prompts")
        .select("*")
        .eq("session_id", sessionId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as MeetingPrompt[];
    } catch (error) {
      console.error("Error fetching prompts:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return {
    sessions,
    isLoading,
    createSession,
    updateSession,
    deleteSession,
    saveTranscript,
    getTranscript,
    savePrompts,
    getPrompts,
    refetch: fetchSessions,
  };
}
