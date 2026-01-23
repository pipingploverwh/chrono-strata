import { useState } from "react";
import { Sparkles, RefreshCw, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIContextAnalysisProps {
  policyPosition: number;
}

const AIContextAnalysis = ({ policyPosition }: AIContextAnalysisProps) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("ocean-context-analysis", {
        body: {
          policyPosition,
          eventContext: "Trump administration Davos 2026 address emphasizing US energy dominance, critical minerals independence, and withdrawal from Paris Climate commitments",
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        if (data.error.includes("Rate limit")) {
          toast.error("AI rate limit reached. Please wait a moment.");
        } else if (data.error.includes("Payment")) {
          toast.error("AI credits exhausted. Contact admin.");
        }
        throw new Error(data.error);
      }

      setAnalysis(data.analysis);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate analysis");
      toast.error("Failed to generate analysis");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface-1 border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-lavender/10 to-surface-1 border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-lavender" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-lavender">
              AI Context Analysis
            </span>
          </div>
          <Badge variant="outline" className="text-[8px] font-mono">
            Davos 2026
          </Badge>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          Real-time policy contextualization using Lovable AI
        </p>
      </div>

      {/* Content */}
      <div className="p-4">
        {!analysis && !isLoading && !error && (
          <div className="text-center py-6">
            <p className="text-xs text-muted-foreground mb-4">
              Generate AI analysis connecting this scenario to Trump's Davos 2026 address on US resource independence
            </p>
            <Button
              onClick={fetchAnalysis}
              size="sm"
              className="gap-2"
            >
              <Sparkles className="w-3 h-3" />
              Analyze Current Events
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-5 h-5 animate-spin text-lavender" />
            <span className="ml-2 text-xs text-muted-foreground">Analyzing policy context...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
            <Button
              onClick={fetchAnalysis}
              variant="ghost"
              size="sm"
              className="ml-auto text-[10px]"
            >
              Retry
            </Button>
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            <div className="prose prose-sm prose-invert max-w-none">
              <div className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[8px] font-mono">
                  Policy: {policyPosition}% Extraction
                </Badge>
                <a
                  href="https://www.weforum.org/events/world-economic-forum-annual-meeting-2025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] text-lavender hover:underline flex items-center gap-1"
                >
                  Davos 2026 <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <Button
                onClick={fetchAnalysis}
                variant="ghost"
                size="sm"
                className="text-[10px] gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIContextAnalysis;
