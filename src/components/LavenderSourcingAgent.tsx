import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, Search, Sparkles, Package, DollarSign, TrendingUp, Save } from "lucide-react";

interface SourcedProduct {
  product_name: string;
  original_source_url: string;
  cost_price: number;
  suggested_retail_price: number;
  description: string;
  tags: string[];
  category: string;
  supplier_rating: number | null;
  gross_margin: number;
  sourcing_confidence: number;
  stock_status: string;
}

interface AgentResponse {
  products: SourcedProduct[];
  analysis_summary: string;
  total_products_found: number;
  viable_products: number;
}

const LavenderSourcingAgent = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AgentResponse | null>(null);
  const [rawContent, setRawContent] = useState<string>("");
  const [saving, setSaving] = useState<string | null>(null);

  const handleScrapeAndAnalyze = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setLoading(true);
    setScraping(true);
    setResult(null);
    setRawContent("");

    try {
      // Step 1: Scrape the URL
      toast.info("🔍 Scraping website...");
      const scrapeResponse = await supabase.functions.invoke("firecrawl-scrape", {
        body: { url, mode: "scrape", formats: ["markdown"] },
      });

      if (scrapeResponse.error) {
        throw new Error(scrapeResponse.error.message);
      }

      const scrapedContent = scrapeResponse.data?.data?.markdown || scrapeResponse.data?.markdown || "";
      if (!scrapedContent) {
        throw new Error("No content scraped from the URL");
      }

      setRawContent(scrapedContent);
      setScraping(false);
      setAnalyzing(true);

      // Step 2: Analyze with AI
      toast.info("🧠 Analyzing with Lavender AI...");
      const analyzeResponse = await supabase.functions.invoke("lavender-sourcing-agent", {
        body: { scrapedContent, sourceUrl: url, mode: "analyze" },
      });

      if (analyzeResponse.error) {
        throw new Error(analyzeResponse.error.message);
      }

      const agentData = analyzeResponse.data?.data;
      if (agentData?.parse_error) {
        toast.warning("AI returned non-standard format. Check raw response.");
        console.log("Raw AI response:", agentData.raw_response);
      }

      setResult(agentData);
      toast.success(`Found ${agentData?.viable_products || 0} viable products!`);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze");
    } finally {
      setLoading(false);
      setScraping(false);
      setAnalyzing(false);
    }
  };

  const handleSaveProduct = async (product: SourcedProduct) => {
    setSaving(product.product_name);
    try {
      const { error } = await supabase.from("sourced_products").insert({
        product_name: product.product_name,
        original_source_url: product.original_source_url,
        cost_price: product.cost_price,
        suggested_retail_price: product.suggested_retail_price,
        description: product.description,
        tags: product.tags,
        category: product.category,
        supplier_rating: product.supplier_rating,
        gross_margin: product.gross_margin,
        sourcing_confidence: product.sourcing_confidence,
        stock_status: product.stock_status,
        scraped_raw_content: rawContent.substring(0, 5000),
        status: "pending",
      });

      if (error) throw error;
      toast.success(`Saved "${product.product_name}" to database`);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save product. Ensure you have admin permissions.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-lavender-50 to-violet-100 dark:from-purple-950 dark:via-violet-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-purple-200 dark:border-purple-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Lavender AI Sourcing Agent
              </CardTitle>
            </div>
            <CardDescription className="text-lg">
              Discover premium lavender products with AI-powered market analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                type="url"
                placeholder="Enter supplier URL (e.g., wholesale lavender site)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 border-purple-200 focus:border-purple-400"
                disabled={loading}
              />
              <Button
                onClick={handleScrapeAndAnalyze}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {scraping ? "Scraping..." : "Analyzing..."}
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Discover Products
                  </>
                )}
              </Button>
            </div>

            {/* Status indicators */}
            {loading && (
              <div className="flex items-center gap-4 mt-4 text-sm">
                <Badge variant={scraping ? "default" : "secondary"} className="gap-1">
                  {scraping && <Loader2 className="w-3 h-3 animate-spin" />}
                  1. Scraping
                </Badge>
                <Badge variant={analyzing ? "default" : "secondary"} className="gap-1">
                  {analyzing && <Loader2 className="w-3 h-3 animate-spin" />}
                  2. AI Analysis
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Tabs defaultValue="products" className="space-y-4">
            <TabsList className="bg-purple-100 dark:bg-purple-900">
              <TabsTrigger value="products">
                <Package className="w-4 h-4 mr-2" />
                Products ({result.viable_products || 0})
              </TabsTrigger>
              <TabsTrigger value="summary">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="raw">Raw Content</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <div className="grid gap-4 md:grid-cols-2">
                {result.products?.map((product, idx) => (
                  <Card key={idx} className="border-purple-200 dark:border-purple-800 overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg text-purple-900 dark:text-purple-100">
                          {product.product_name}
                        </CardTitle>
                        <Badge 
                          variant={product.gross_margin >= 60 ? "default" : "secondary"}
                          className={product.gross_margin >= 60 ? "bg-green-500" : ""}
                        >
                          {product.gross_margin?.toFixed(1)}% margin
                        </Badge>
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {product.category}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-red-500" />
                          <span>Cost: ${product.cost_price?.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span>Sell: ${product.suggested_retail_price?.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {product.tags?.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-xs text-muted-foreground">
                          Confidence: {product.sourcing_confidence}% | 
                          Stock: {product.stock_status}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSaveProduct(product)}
                          disabled={saving === product.product_name}
                          className="border-purple-300 hover:bg-purple-50"
                        >
                          {saving === product.product_name ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {(!result.products || result.products.length === 0) && (
                  <Card className="col-span-2 p-8 text-center text-muted-foreground">
                    No lavender products found matching criteria. Try a different supplier URL.
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="summary">
              <Card className="border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle>Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30">
                      <div className="text-2xl font-bold text-purple-600">
                        {result.total_products_found || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Products Found</div>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30">
                      <div className="text-2xl font-bold text-green-600">
                        {result.viable_products || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Viable for Resale</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{result.analysis_summary}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="raw">
              <Card className="border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle>Scraped Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <pre className="text-xs whitespace-pre-wrap font-mono bg-muted p-4 rounded-lg">
                      {rawContent || "No content scraped"}
                    </pre>
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

export default LavenderSourcingAgent;
