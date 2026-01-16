import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, Search, ExternalLink, Save } from "lucide-react";

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
  const [stage, setStage] = useState<"idle" | "scraping" | "analyzing">("idle");
  const [result, setResult] = useState<AgentResponse | null>(null);
  const [rawContent, setRawContent] = useState<string>("");
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "summary" | "raw">("products");

  const getStageMessage = () => {
    switch (stage) {
      case "scraping":
        return "Extracting page content";
      case "analyzing":
        return "Identifying viable products";
      default:
        return "";
    }
  };

  const handleScrapeAndAnalyze = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setLoading(true);
    setStage("scraping");
    setResult(null);
    setRawContent("");

    try {
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
      setStage("analyzing");

      const analyzeResponse = await supabase.functions.invoke("lavender-sourcing-agent", {
        body: { scrapedContent, sourceUrl: url, mode: "analyze" },
      });

      if (analyzeResponse.error) {
        throw new Error(analyzeResponse.error.message);
      }

      const agentData = analyzeResponse.data?.data;
      if (agentData?.parse_error) {
        console.log("Raw AI response:", agentData.raw_response);
      }

      setResult(agentData);
      toast.success(`Found ${agentData?.viable_products || 0} viable products`);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      setLoading(false);
      setStage("idle");
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
      toast.success(`Saved "${product.product_name}"`);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save product");
    } finally {
      setSaving(null);
    }
  };

  const getMarginClass = (margin: number) => {
    if (margin >= 70) return "badge-margin-high";
    if (margin >= 50) return "badge-margin-medium";
    return "badge-margin-low";
  };

  const getConfidenceClass = (confidence: number) => {
    if (confidence >= 80) return "text-confidence-high";
    if (confidence >= 60) return "text-confidence-medium";
    return "text-confidence-low";
  };

  return (
    <div className="space-y-8">
      {/* Header - Calm, single purpose */}
      <div className="lavender-card p-8">
        <h1 className="text-xl font-medium text-foreground mb-2">
          Single URL Scanner
        </h1>
        <p className="text-secondary text-sm mb-6">
          Analyze a supplier page for viable lavender products
        </p>

        <div className="flex gap-4">
          <input
            type="url"
            placeholder="Enter supplier URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-calm flex-1"
            disabled={loading}
          />
          <button
            onClick={handleScrapeAndAnalyze}
            disabled={loading}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{getStageMessage()}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>

        {/* Process indicator - calm, informative */}
        {loading && (
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
            <div className={`flex items-center gap-2 text-sm ${stage === "scraping" ? "text-lavender" : "text-muted"}`}>
              <div className={`w-2 h-2 rounded-full ${stage === "scraping" ? "bg-lavender animate-pulse" : "bg-muted"}`} />
              Scraping
            </div>
            <div className={`flex items-center gap-2 text-sm ${stage === "analyzing" ? "text-lavender" : "text-muted"}`}>
              <div className={`w-2 h-2 rounded-full ${stage === "analyzing" ? "bg-lavender animate-pulse" : "bg-muted"}`} />
              Analysis
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Tab navigation - minimal */}
          <div className="flex gap-1 p-1 bg-surface-2 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                activeTab === "products"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              Products ({result.viable_products || 0})
            </button>
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                activeTab === "summary"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab("raw")}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                activeTab === "raw"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              Raw
            </button>
          </div>

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="grid gap-4 md:grid-cols-2">
              {result.products?.map((product, idx) => (
                <div key={idx} className="product-card">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="font-medium text-foreground leading-tight">
                      {product.product_name}
                    </h3>
                    <span className={`${getMarginClass(product.gross_margin)} shrink-0`}>
                      {product.gross_margin?.toFixed(0)}%
                    </span>
                  </div>

                  {/* Category */}
                  <span className="inline-block px-2 py-1 text-xs bg-surface-2 text-secondary rounded mb-4">
                    {product.category}
                  </span>

                  {/* Description - 2 lines max */}
                  <p className="text-sm text-secondary line-clamp-2 mb-4">
                    {product.description}
                  </p>

                  {/* Pricing row - dominant metric */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-muted mb-1">Cost</div>
                      <div className="text-sm text-foreground">${product.cost_price?.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted mb-1">Retail</div>
                      <div className="text-sm text-foreground">${product.suggested_retail_price?.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.tags.slice(0, 4).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-surface-1 text-muted rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer - tertiary info + action */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-xs text-muted">
                      <span className={getConfidenceClass(product.sourcing_confidence)}>
                        {product.sourcing_confidence}% confidence
                      </span>
                      <span className="mx-2">·</span>
                      <span>{product.stock_status}</span>
                    </div>
                    <button
                      onClick={() => handleSaveProduct(product)}
                      disabled={saving === product.product_name}
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      {saving === product.product_name ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-3 h-3 mr-1.5" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {(!result.products || result.products.length === 0) && (
                <div className="empty-state col-span-2">
                  <p>No products met Lovable's margin and quality standards.</p>
                </div>
              )}
            </div>
          )}

          {/* Summary Tab */}
          {activeTab === "summary" && (
            <div className="lavender-card p-8">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="metric-dominant text-lavender">
                    {result.total_products_found || 0}
                  </div>
                  <div className="text-sm text-secondary">Products Found</div>
                </div>
                <div>
                  <div className="metric-dominant text-margin-high">
                    {result.viable_products || 0}
                  </div>
                  <div className="text-sm text-secondary">Viable for Resale</div>
                </div>
              </div>
              <p className="text-secondary leading-relaxed">
                {result.analysis_summary || "No summary available."}
              </p>
            </div>
          )}

          {/* Raw Content Tab */}
          {activeTab === "raw" && (
            <div className="lavender-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">Scraped Content</h3>
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-lavender hover:underline flex items-center gap-1"
                  >
                    View source <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <ScrollArea className="h-96">
                <pre className="log-entry text-xs whitespace-pre-wrap">
                  {rawContent || "No content scraped"}
                </pre>
              </ScrollArea>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LavenderSourcingAgent;
