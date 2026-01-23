import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ThreatLog {
  id: string;
  site_id: string;
  site_name: string;
  threat_level: string;
  latitude: number;
  longitude: number;
  eggs: number | null;
  chicks: number | null;
  observer_notes: string | null;
  alert_sent: boolean;
  alert_sent_at: string | null;
  created_at: string;
}

export function useThreatLogs() {
  const [logs, setLogs] = useState<ThreatLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("threat_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      setLogs(data as ThreatLog[]);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching threat logs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Real-time subscription for new threat alerts
  useEffect(() => {
    const channel = supabase
      .channel("threat_logs_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "threat_logs",
        },
        (payload) => {
          console.log("New threat alert:", payload);
          const newLog = payload.new as ThreatLog;
          setLogs((prev) => [newLog, ...prev]);
          
          toast({
            title: "🚨 High Threat Detected",
            description: `${newLog.site_name} requires immediate attention`,
            variant: "destructive",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs,
  };
}
