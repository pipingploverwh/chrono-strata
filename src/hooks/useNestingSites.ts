import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface NestingSite {
  id: string;
  site_id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: "active" | "fledged" | "abandoned";
  eggs: number;
  chicks: number;
  threat_level: "low" | "medium" | "high";
  last_check: string;
  observer_notes: string | null;
  created_at: string;
  updated_at: string;
}

// Transform DB record to component-friendly format
export interface NestingSiteDisplay {
  id: string;
  zone: string;
  status: "active" | "fledged" | "abandoned" | "monitoring";
  eggs: number;
  chicks: number;
  lastCheck: string;
  threats: string[];
  coordinates: { lat: number; lon: number };
  observerNotes: string | null;
  threatLevel: "low" | "medium" | "high";
}

function transformSite(site: NestingSite): NestingSiteDisplay {
  return {
    id: site.site_id,
    zone: site.name,
    status: site.status,
    eggs: site.eggs,
    chicks: site.chicks,
    lastCheck: site.last_check,
    threats: site.threat_level === "high" ? ["high_risk"] : 
             site.threat_level === "medium" ? ["moderate_risk"] : [],
    coordinates: { lat: site.latitude, lon: site.longitude },
    observerNotes: site.observer_notes,
    threatLevel: site.threat_level,
  };
}

export function useNestingSites() {
  const [sites, setSites] = useState<NestingSiteDisplay[]>([]);
  const [rawSites, setRawSites] = useState<NestingSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch sites
  const fetchSites = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("nesting_sites")
        .select("*")
        .order("site_id", { ascending: true });

      if (fetchError) throw fetchError;

      const typedData = data as NestingSite[];
      setRawSites(typedData);
      setSites(typedData.map(transformSite));
      setError(null);
    } catch (err: any) {
      console.error("Error fetching nesting sites:", err);
      setError(err.message);
      toast({
        title: "Error loading sites",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Log a field check
  const logCheck = useCallback(async (siteId: string, notes?: string) => {
    try {
      const site = rawSites.find(s => s.site_id === siteId);
      if (!site) throw new Error("Site not found");

      const { error: updateError } = await supabase
        .from("nesting_sites")
        .update({
          last_check: new Date().toISOString(),
          observer_notes: notes || site.observer_notes,
          updated_at: new Date().toISOString(),
        })
        .eq("site_id", siteId);

      if (updateError) throw updateError;

      toast({
        title: "Check logged",
        description: `Field check recorded for ${site.name}`,
      });
    } catch (err: any) {
      console.error("Error logging check:", err);
      toast({
        title: "Error logging check",
        description: err.message,
        variant: "destructive",
      });
    }
  }, [rawSites, toast]);

  // Update site data
  const updateSite = useCallback(async (siteId: string, updates: Partial<{
    eggs: number;
    chicks: number;
    status: "active" | "fledged" | "abandoned";
    threat_level: "low" | "medium" | "high";
    observer_notes: string;
  }>) => {
    try {
      const { error: updateError } = await supabase
        .from("nesting_sites")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("site_id", siteId);

      if (updateError) throw updateError;

      toast({
        title: "Site updated",
        description: "Nesting site data has been updated",
      });
    } catch (err: any) {
      console.error("Error updating site:", err);
      toast({
        title: "Error updating site",
        description: err.message,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Create new site
  const createSite = useCallback(async (newSite: {
    site_id: string;
    name: string;
    latitude: number;
    longitude: number;
    status?: "active" | "fledged" | "abandoned";
    eggs?: number;
    chicks?: number;
    threat_level?: "low" | "medium" | "high";
    observer_notes?: string;
  }) => {
    try {
      const { error: insertError } = await supabase
        .from("nesting_sites")
        .insert({
          site_id: newSite.site_id,
          name: newSite.name,
          latitude: newSite.latitude,
          longitude: newSite.longitude,
          status: newSite.status || "active",
          eggs: newSite.eggs || 0,
          chicks: newSite.chicks || 0,
          threat_level: newSite.threat_level || "low",
          observer_notes: newSite.observer_notes,
        });

      if (insertError) throw insertError;

      toast({
        title: "Site created",
        description: `New nesting site "${newSite.name}" has been added`,
      });
    } catch (err: any) {
      console.error("Error creating site:", err);
      toast({
        title: "Error creating site",
        description: err.message,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Delete site
  const deleteSite = useCallback(async (siteId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("nesting_sites")
        .delete()
        .eq("site_id", siteId);

      if (deleteError) throw deleteError;

      toast({
        title: "Site deleted",
        description: "Nesting site has been removed",
      });
    } catch (err: any) {
      console.error("Error deleting site:", err);
      toast({
        title: "Error deleting site",
        description: err.message,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("nesting_sites_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "nesting_sites",
        },
        (payload) => {
          console.log("Realtime update:", payload);
          
          if (payload.eventType === "INSERT") {
            const newSite = payload.new as NestingSite;
            setRawSites(prev => [...prev, newSite]);
            setSites(prev => [...prev, transformSite(newSite)]);
            toast({
              title: "New site added",
              description: `${newSite.name} is now being monitored`,
            });
          } else if (payload.eventType === "UPDATE") {
            const updatedSite = payload.new as NestingSite;
            setRawSites(prev => 
              prev.map(s => s.site_id === updatedSite.site_id ? updatedSite : s)
            );
            setSites(prev =>
              prev.map(s => s.id === updatedSite.site_id ? transformSite(updatedSite) : s)
            );
          } else if (payload.eventType === "DELETE") {
            const deletedSite = payload.old as NestingSite;
            setRawSites(prev => prev.filter(s => s.site_id !== deletedSite.site_id));
            setSites(prev => prev.filter(s => s.id !== deletedSite.site_id));
            toast({
              title: "Site removed",
              description: "A nesting site has been removed from monitoring",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return {
    sites,
    rawSites,
    loading,
    error,
    refetch: fetchSites,
    logCheck,
    updateSite,
    createSite,
    deleteSite,
  };
}
