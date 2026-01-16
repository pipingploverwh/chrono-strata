import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  Loader2, 
  Rocket, 
  Globe, 
  Search, 
  Sparkles, 
  Package, 
  Database, 
  CheckCircle,
  AlertCircle,
  Map,
  Scan,
  Brain,
  Save,
  ExternalLink,
  Clock
} from "lucide-react";

interface PipelineStats {
  urls_discovered: number;
  urls_filtered: number;
  pages_scraped: number;
  products_found: number;
  products_saved: number;
}

interface PipelineStage {
  stage: string;
  message: string;
  timestamp: string;
}

interface AnalyzedProduct {
  product_name: string;
  original_source_url: string;
  cost_price: number;
  suggested_retail_price: number;
  description: string;
  tags: string[];
  category: string;
  gross_margin: number;
  sourcing_confidence: number;
  stock_status: string;
  supplier_name?: string;
}

interface PipelineResult {
  success: boolean;
  session_id: string;
  domain: string;
  mode: string;
  stages: PipelineStage[];
  discovered_urls: string[];
  filtered_urls: string[];
  analyzed_products: AnalyzedProduct[];
  saved_products: string[];
  errors: Array<{ stage: string; error: string; url?: string }>;
  stats: PipelineStats;
  error?: string;
}

const LavenderPipelineRunner = () => {
  const [domain, setDomain] = useState("");
  const [urlFilter, setUrlFilter] = useState("lavender");
  const [urlLimit, setUrlLimit] = useState(5);
  const [autoSave, setAutoSave] = useState(false);
  const [running, setRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState("");
  const [result, setResult] = useState<PipelineResult | null>(null);

  const runPipeline = async () => {
    if (!domain.trim()) {
      toast.error("Please enter a domain to scan");
      return;
    }

    setRunning(true);
    setResult(null);
    setCurrentStage("Initializing pipeline...");

    try {
      toast.info("🚀 Starting Lavender Sourcing Pipeline...");

      const response = await supabase.functions.invoke("lavender-pipeline", {
        body: {
          domain,
          mode: "full_pipeline",
          urlLimit,
          urlFilter,
          autoSave,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const data = response.data as PipelineResult;
      setResult(data);

      if (data.success) {
        toast.success(
          `Pipeline complete! Found ${data.stats.products_found} products` +
          (autoSave ? `, saved ${data.stats.products_saved}` : "")
        );
      } else {
        toast.error(data.error || "Pipeline failed");
      }
    } catch (error) {
      console.error("Pipeline error:", error);
      toast.error(error instanceof Error ? error.message : "Pipeline failed");
    } finally {
      setRunning(false);
      setCurrentStage("");
    }
  };

  const saveProduct = async (product: AnalyzedProduct) => {
    try {
      const { error } = await supabase.from("sourced_products").insert({
        product_name: product.product_name,
        original_source_url: product.original_source_url,
        cost_price: product.cost_price,
        suggested_retail_price: product.suggested_retail_price,
        description: product.description,
        tags: product.tags,
        category: product.category,
        gross_margin: product.gross_margin,
        sourcing_confidence: product.sourcing_confidence,
        stock_status: product.stock_status,
        supplier_name: product.supplier_name,
        status: "pending",
        approved_for_listing: false,
      });

      if (error) throw error;
      toast.success(`Saved: ${product.product_name}`);
    } catch (error) {
      toast.error("Failed to save product. Check admin permissions.");
    }
  };

  const getStageIcon = (stage: string) => {
    if (stage.includes("MAP")) return <Map className="h-4 w-4" />;
    if (stage.includes("FILTER")) return <Search className="h-4 w-4" />;
    if (stage.includes("SCRAPE")) return <Scan className="h-4 w-4" />;
    if (stage.includes("ANALYZE")) return <Brain className="h-4 w-4" />;
    if (stage.includes("SAVE")) return <Save className="h-4 w-4" />;
    if (stage.includes("COMPLETE")) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (stage.includes("ERROR")) return <AlertCircle className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gray-800/50 border-purple-500/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">
                  Automated Sourcing Pipeline
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Map → Scrape → Analyze → Save • Full automation for Lavender AI Org
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Configuration */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Target Domain</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="e.g., bulkapothecary.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="bg-gray-900/50 border-gray-600"
                      disabled={running}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">URL Filter Keywords</Label>
                  <Input
                    placeholder="lavender,essential,oil"
                    value={urlFilter}
                    onChange={(e) => setUrlFilter(e.target.value)}
                    className="bg-gray-900/50 border-gray-600 mt-1"
                    disabled={running}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Comma-separated terms to filter discovered URLs
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">
                    URL Limit: {urlLimit} pages
                  </Label>
                  <Slider
                    value={[urlLimit]}
                    onValueChange={(v) => setUrlLimit(v[0])}
                    min={1}
                    max={20}
                    step={1}
                    className="mt-2"
                    disabled={running}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum number of product pages to analyze
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <div>
                    <Label className="text-gray-300">Auto-Save Products</Label>
                    <p className="text-xs text-gray-500">
                      Automatically save found products to database
                    </p>
                  </div>
                  <Switch
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                    disabled={running}
                  />
                </div>
              </div>
            </div>

            {/* Run Button */}
            <Button
              onClick={runPipeline}
              disabled={running || !domain.trim()}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
            >
              {running ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  {currentStage || "Running Pipeline..."}
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Launch Sourcing Pipeline
                </>
              )}
            </Button>

            {/* Pipeline Stages Indicator */}
            {running && (
              <div className="flex items-center justify-between text-sm">
                {["Map", "Filter", "Scrape", "Analyze", "Save"].map((stage, i) => (
                  <div key={stage} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i === 0 ? "bg-purple-600 animate-pulse" : "bg-gray-700"
                    }`}>
                      {i + 1}
                    </div>
                    <span className="text-gray-400 hidden md:inline">{stage}</span>
                    {i < 4 && <div className="w-8 h-0.5 bg-gray-700 hidden md:block" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Tabs defaultValue="products" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList className="bg-gray-800/50">
                <TabsTrigger value="products" className="gap-2">
                  <Package className="h-4 w-4" />
                  Products ({result.stats.products_found})
                </TabsTrigger>
                <TabsTrigger value="urls" className="gap-2">
                  <Globe className="h-4 w-4" />
                  URLs ({result.stats.urls_filtered})
                </TabsTrigger>
                <TabsTrigger value="logs" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Logs
                </TabsTrigger>
              </TabsList>

              {/* Stats Summary */}
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-purple-500/20 text-purple-400">
                  {result.stats.urls_discovered} discovered
                </Badge>
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400">
                  {result.stats.pages_scraped} scraped
                </Badge>
                <Badge variant="outline" className="bg-green-500/20 text-green-400">
                  {result.stats.products_saved} saved
                </Badge>
              </div>
            </div>

            <TabsContent value="products">
              {result.analyzed_products.length === 0 ? (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="py-12 text-center">
                    <Package className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400">No products found. Try a different domain or filter.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {result.analyzed_products.map((product, idx) => (
                    <Card key={idx} className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg text-white line-clamp-2">
                            {product.product_name}
                          </CardTitle>
                          <Badge className={`shrink-0 ${
                            product.gross_margin >= 70 
                              ? "bg-green-500/20 text-green-400" 
                              : product.gross_margin >= 50 
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}>
                            {product.gross_margin?.toFixed(1)}% margin
                          </Badge>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline">{product.category}</Badge>
                          <Badge variant="secondary" className="text-xs">
                            {product.sourcing_confidence}% confidence
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-900/50 p-2 rounded">
                            <p className="text-xs text-gray-500">Cost</p>
                            <p className="text-lg font-semibold text-white">${product.cost_price?.toFixed(2)}</p>
                          </div>
                          <div className="bg-gray-900/50 p-2 rounded">
                            <p className="text-xs text-gray-500">Retail</p>
                            <p className="text-lg font-semibold text-emerald-400">${product.suggested_retail_price?.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {product.tags?.slice(0, 4).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                          <a
                            href={product.original_source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-purple-400 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Source
                          </a>
                          {!autoSave && !result.saved_products.includes(product.product_name) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => saveProduct(product)}
                              className="border-purple-500/50 hover:bg-purple-600/20"
                            >
                              <Database className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                          )}
                          {result.saved_products.includes(product.product_name) && (
                            <Badge className="bg-green-500/20 text-green-400">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Saved
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="urls">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Discovered & Filtered URLs</CardTitle>
                  <CardDescription>
                    {result.stats.urls_discovered} discovered → {result.stats.urls_filtered} filtered
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {result.filtered_urls.map((url, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-gray-900/50 rounded">
                          <Badge variant="outline" className="shrink-0">{idx + 1}</Badge>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-400 hover:underline truncate"
                          >
                            {url}
                          </a>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg">Pipeline Execution Log</CardTitle>
                  <CardDescription>Session: {result.session_id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2 font-mono text-sm">
                      {result.stages.map((stage, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                          <div className="shrink-0 mt-0.5">
                            {getStageIcon(stage.stage)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {stage.stage}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(stage.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-gray-300 mt-1">{stage.message}</p>
                          </div>
                        </div>
                      ))}

                      {result.errors.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-red-500/30">
                          <p className="text-red-400 font-semibold mb-2">Errors:</p>
                          {result.errors.map((err, idx) => (
                            <div key={idx} className="p-2 bg-red-900/20 rounded mb-2">
                              <Badge variant="destructive" className="text-xs">{err.stage}</Badge>
                              <p className="text-red-300 text-sm mt-1">{err.error}</p>
                              {err.url && <p className="text-xs text-gray-500">{err.url}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default LavenderPipelineRunner;
