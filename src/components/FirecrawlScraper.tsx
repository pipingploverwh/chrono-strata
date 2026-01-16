import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Globe, 
  FileJson, 
  FileText, 
  Loader2, 
  Copy, 
  Map, 
  Network,
  Zap
} from "lucide-react";

interface ScrapeResult {
  success: boolean;
  data?: {
    markdown?: string;
    html?: string;
    metadata?: {
      title?: string;
      description?: string;
      language?: string;
      sourceURL?: string;
    };
    links?: string[];
  };
  error?: string;
}

type ScrapeMode = "scrape" | "crawl" | "map";

const FirecrawlScraper = () => {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<ScrapeMode>("scrape");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);

  const handleScrape = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("firecrawl-scrape", {
        body: { url, mode, formats: ["markdown", "html"] },
      });

      if (error) throw error;

      setResult(data);
      toast.success(`${mode.charAt(0).toUpperCase() + mode.slice(1)} completed`);
    } catch (error: any) {
      console.error("Scrape error:", error);
      toast.error(error.message || "Failed to scrape URL");
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const modeConfig = {
    scrape: { icon: FileText, label: "Scrape", desc: "Extract clean content from a single page" },
    crawl: { icon: Network, label: "Crawl", desc: "Scrape multiple pages from a domain" },
    map: { icon: Map, label: "Map", desc: "Discover all URLs on a website" },
  };

  return (
    <div className="min-h-screen bg-strata-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Zap className="w-8 h-8 text-strata-orange" />
            <h1 className="font-instrument text-4xl text-strata-white tracking-wide">
              Web Scraper
            </h1>
          </div>
          <p className="text-strata-silver/70 font-mono text-sm">
            Powered by Firecrawl • Rubin Rubin & Golin Technology
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-3 gap-4">
          {(Object.entries(modeConfig) as [ScrapeMode, typeof modeConfig.scrape][]).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`p-4 rounded-lg border transition-all ${
                  mode === key
                    ? "bg-strata-steel border-strata-orange text-strata-white"
                    : "bg-strata-charcoal border-strata-steel/50 text-strata-silver hover:border-strata-orange/50"
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${mode === key ? "text-strata-orange" : ""}`} />
                <div className="font-instrument text-lg">{config.label}</div>
                <div className="text-xs opacity-60 mt-1">{config.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Input Card */}
        <Card className="bg-strata-charcoal border-strata-steel/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-instrument text-strata-white">
              <Globe className="w-5 h-5 text-strata-cyan" />
              Enter URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-strata-black border-strata-steel/50 text-strata-white placeholder:text-strata-silver/40"
                onKeyDown={(e) => e.key === "Enter" && handleScrape()}
              />
              <Button
                onClick={handleScrape}
                disabled={loading}
                className="bg-strata-orange hover:bg-strata-orange/80 text-white px-6"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  modeConfig[mode].label
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="bg-strata-charcoal border-strata-steel/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 font-instrument text-strata-white">
                  <FileJson className="w-5 h-5 text-strata-lume" />
                  Results
                </CardTitle>
                <Badge variant={result.success ? "default" : "destructive"}>
                  {result.success ? "Success" : "Failed"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {result.error ? (
                <div className="text-strata-red font-mono text-sm p-4 bg-strata-red/10 rounded-lg">
                  {result.error}
                </div>
              ) : (
                <Tabs defaultValue="markdown" className="w-full">
                  <TabsList className="bg-strata-steel/30 border border-strata-steel/50">
                    <TabsTrigger value="markdown" className="data-[state=active]:bg-strata-orange">
                      Markdown
                    </TabsTrigger>
                    <TabsTrigger value="html" className="data-[state=active]:bg-strata-orange">
                      HTML
                    </TabsTrigger>
                    <TabsTrigger value="metadata" className="data-[state=active]:bg-strata-orange">
                      Metadata
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="markdown" className="mt-4">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-2 top-2 text-strata-silver hover:text-strata-white"
                        onClick={() => copyToClipboard(result.data?.markdown || "", "Markdown")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <ScrollArea className="h-96 rounded-lg bg-strata-black p-4 border border-strata-steel/30">
                        <pre className="text-sm text-strata-silver font-mono whitespace-pre-wrap">
                          {result.data?.markdown || "No markdown content"}
                        </pre>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="html" className="mt-4">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-2 top-2 text-strata-silver hover:text-strata-white"
                        onClick={() => copyToClipboard(result.data?.html || "", "HTML")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <ScrollArea className="h-96 rounded-lg bg-strata-black p-4 border border-strata-steel/30">
                        <pre className="text-sm text-strata-silver font-mono whitespace-pre-wrap">
                          {result.data?.html || "No HTML content"}
                        </pre>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="metadata" className="mt-4">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-2 top-2 text-strata-silver hover:text-strata-white"
                        onClick={() => copyToClipboard(JSON.stringify(result.data?.metadata, null, 2), "Metadata")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <ScrollArea className="h-96 rounded-lg bg-strata-black p-4 border border-strata-steel/30">
                        <pre className="text-sm text-strata-lume font-mono">
                          {JSON.stringify(result.data?.metadata, null, 2) || "No metadata"}
                        </pre>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FirecrawlScraper;
