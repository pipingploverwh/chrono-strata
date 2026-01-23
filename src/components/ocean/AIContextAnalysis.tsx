import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, AlertCircle, ExternalLink, Newspaper, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIContextAnalysisProps {
  policyPosition: number;
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
}

const AIContextAnalysis = ({ policyPosition }: AIContextAnalysisProps) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // News feed state
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

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

  const fetchNews = async () => {
    setIsLoadingNews(true);
    setNewsError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("ocean-news-feed", {
        body: {
          topic: "critical minerals deep sea mining US policy 2026",
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setNewsItems(data.items || []);
    } catch (err) {
      console.error("News feed error:", err);
      setNewsError(err instanceof Error ? err.message : "Failed to fetch news");
    } finally {
      setIsLoadingNews(false);
    }
  };

  // Auto-fetch news on mount
  useEffect(() => {
    fetchNews();
  }, []);

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

      {/* News Feed Section */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
              Live News Feed
            </span>
          </div>
          <Button
            onClick={fetchNews}
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[9px]"
            disabled={isLoadingNews}
          >
            {isLoadingNews ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          </Button>
        </div>

        {isLoadingNews && newsItems.length === 0 && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span className="ml-2 text-[10px] text-muted-foreground">Fetching headlines...</span>
          </div>
        )}

        {newsError && (
          <div className="text-[10px] text-amber-400 py-2">
            News unavailable: {newsError}
          </div>
        )}

        {newsItems.length > 0 && (
          <div className="space-y-2">
            {newsItems.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 bg-surface-2/50 hover:bg-surface-2 rounded border border-border/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-foreground font-medium line-clamp-2 group-hover:text-lavender transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">
                      {item.source}
                    </p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        )}

        {!isLoadingNews && newsItems.length === 0 && !newsError && (
          <p className="text-[10px] text-muted-foreground text-center py-3">
            No recent headlines found
          </p>
        )}
      </div>

      {/* Analysis Content */}
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
