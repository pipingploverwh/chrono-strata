import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  Loader2, 
  Globe, 
  Package, 
  Database, 
  CheckCircle,
  ExternalLink,
  ArrowRight
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
  const [activeTab, setActiveTab] = useState<"products" | "urls" | "logs">("products");

  const runPipeline = async () => {
    if (!domain.trim()) {
      toast.error("Enter a domain to begin");
      return;
    }

    setRunning(true);
    setResult(null);
    setCurrentStage("Mapping domain structure");

    try {
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
          `Complete. ${data.stats.products_found} products found` +
          (autoSave ? `, ${data.stats.products_saved} saved` : "")
        );
      } else {
        toast.error(data.error || "Pipeline did not complete");
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
      toast.error("Failed to save product");
    }
  };

  const getMarginClass = (margin: number) => {
    if (margin >= 70) return "badge-margin-high";
    if (margin >= 50) return "badge-margin-medium";
    return "badge-margin-low";
  };

  const getStageMessage = () => {
    if (!running) return null;
    const stages = [
      "Mapping domain structure",
      "Filtering relevant URLs", 
      "Scraping product pages",
      "Analyzing for viable products",
      "Saving to inventory"
    ];
    return currentStage || stages[0];
  };

  return (
    <div className="min-h-screen surface-0 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header: One dominant title */}
        <header className="section-header">
          <h1 className="text-2xl font-medium text-dominant tracking-tight">
            Sourcing Pipeline
          </h1>
          <p className="section-subtitle">
            Automated discovery and analysis
          </p>
        </header>

        {/* Configuration: Calm, focused inputs */}
        <div className="lavender-card p-6 mb-8">
          <div className="space-y-6">
            
            {/* Domain Input */}
            <div>
              <Label className="text-subordinate text-sm mb-2 block">Target Domain</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-whisper" />
                <Input
                  placeholder="bulkapothecary.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="input-calm pl-10"
                  disabled={running}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* URL Filter */}
              <div>
                <Label className="text-subordinate text-sm mb-2 block">Filter Keywords</Label>
                <Input
                  placeholder="lavender, essential, oil"
                  value={urlFilter}
                  onChange={(e) => setUrlFilter(e.target.value)}
                  className="input-calm"
                  disabled={running}
                />
                <p className="text-whisper text-xs mt-1.5">
                  Comma-separated terms
                </p>
              </div>

              {/* URL Limit */}
              <div>
                <Label className="text-subordinate text-sm mb-2 block">
                  Page Limit: {urlLimit}
                </Label>
                <Slider
                  value={[urlLimit]}
                  onValueChange={(v) => setUrlLimit(v[0])}
                  min={1}
                  max={20}
                  step={1}
                  className="mt-3"
                  disabled={running}
                />
                <p className="text-whisper text-xs mt-1.5">
                  Maximum pages to analyze
                </p>
              </div>
            </div>

            <div className="divider-light" />

            {/* Auto-save toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-subordinate text-sm">Auto-save to inventory</Label>
                <p className="text-whisper text-xs mt-0.5">
                  Automatically save viable products
                </p>
              </div>
              <Switch
                checked={autoSave}
                onCheckedChange={setAutoSave}
                disabled={running}
              />
            </div>

            <div className="divider-light" />

            {/* Primary Action: One deliberate button */}
            <Button
              onClick={runPipeline}
              disabled={running || !domain.trim()}
              className="w-full h-12 btn-primary text-sm font-medium"
            >
              {running ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{getStageMessage()}</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Begin Analysis</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            {/* Loading Progress: Inevitable, not anxious */}
            {running && (
              <div className="loading-progress">
                <div 
                  className="loading-progress-bar" 
                  style={{ width: "60%" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="animate-fade">
            
            {/* Stats Row: Quiet summary */}
            <div className="flex items-center gap-6 mb-8 text-sm">
              <span className="text-subordinate">
                <span className="text-dominant font-medium">{result.stats.urls_discovered}</span> discovered
              </span>
              <span className="text-whisper">→</span>
              <span className="text-subordinate">
                <span className="text-dominant font-medium">{result.stats.urls_filtered}</span> filtered
              </span>
              <span className="text-whisper">→</span>
              <span className="text-subordinate">
                <span className="text-dominant font-medium">{result.stats.products_found}</span> products
              </span>
              {autoSave && (
                <>
                  <span className="text-whisper">→</span>
                  <span className="text-margin-high">
                    {result.stats.products_saved} saved
                  </span>
                </>
              )}
            </div>

            {/* Tab Navigation: Minimal */}
            <div className="flex gap-6 mb-6 border-b border-border">
              {[
                { id: "products", label: "Products", count: result.stats.products_found },
                { id: "urls", label: "URLs", count: result.stats.urls_filtered },
                { id: "logs", label: "Logs", count: result.stages.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`pb-3 text-sm transition-colors ${
                    activeTab === tab.id
                      ? "text-dominant border-b-2 border-lavender"
                      : "text-tertiary hover:text-subordinate"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 text-xs text-whisper">{tab.count}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Products Tab */}
            {activeTab === "products" && (
              <div>
                {result.analyzed_products.length === 0 ? (
                  <div className="empty-state">
                    <Package className="empty-state-icon" />
                    <p className="empty-state-message">
                      No products met Lovable's margin and quality standards.
                    </p>
                    <p className="empty-state-suggestion">
                      Try a different domain or adjust filter keywords.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {result.analyzed_products.map((product, idx) => (
                      <article 
                        key={idx} 
                        className="product-card"
                      >
                        {/* Header: Name + Margin (dominant metric) */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-base font-medium text-dominant leading-snug">
                            {product.product_name}
                          </h3>
                          <span className={getMarginClass(product.gross_margin)}>
                            {product.gross_margin?.toFixed(0)}%
                          </span>
                        </div>

                        {/* Description: Subordinate */}
                        <p className="text-sm text-subordinate line-clamp-2 mb-4">
                          {product.description}
                        </p>

                        {/* Metrics Row */}
                        <div className="flex items-center gap-6 text-sm mb-4">
                          <div>
                            <span className="text-whisper">Cost </span>
                            <span className="text-dominant">${product.cost_price?.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-whisper">Retail </span>
                            <span className="text-margin-high font-medium">${product.suggested_retail_price?.toFixed(2)}</span>
                          </div>
                          <div className="badge-confidence">
                            {product.sourcing_confidence}% confidence
                          </div>
                          {product.category && (
                            <div className="badge-category">
                              {product.category}
                            </div>
                          )}
                        </div>

                        {/* Tags: Tertiary */}
                        {product.tags && product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {product.tags.slice(0, 4).map((tag, i) => (
                              <span 
                                key={i} 
                                className="px-2 py-0.5 text-xs rounded surface-2 text-tertiary"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Actions: Quiet, deliberate */}
                        <div className="divider-light" />
                        <div className="flex items-center justify-between pt-2">
                          <a
                            href={product.original_source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-tertiary hover:text-subordinate flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Source
                          </a>
                          {!autoSave && !result.saved_products.includes(product.product_name) && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => saveProduct(product)}
                              className="text-xs text-subordinate hover:text-dominant"
                            >
                              <Database className="h-3 w-3 mr-1.5" />
                              Save
                            </Button>
                          )}
                          {result.saved_products.includes(product.product_name) && (
                            <span className="text-xs text-margin-high flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Saved
                            </span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* URLs Tab */}
            {activeTab === "urls" && (
              <div className="space-y-1">
                {result.filtered_urls.map((url, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 py-2 px-3 surface-1 rounded text-sm"
                  >
                    <span className="text-whisper text-xs w-6">{idx + 1}</span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-subordinate hover:text-dominant truncate transition-colors"
                    >
                      {url}
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Logs Tab: Lab notes, not alerts */}
            {activeTab === "logs" && (
              <div className="space-y-1">
                {result.stages.map((stage, idx) => (
                  <div key={idx} className="log-entry">
                    <span className="log-entry-stage">{stage.stage}</span>
                    <span className="mx-2 text-border">·</span>
                    <span>{stage.message}</span>
                  </div>
                ))}
                {result.errors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-tertiary mb-2">Errors encountered:</p>
                    {result.errors.map((err, idx) => (
                      <div key={idx} className="log-entry border-l-margin-low">
                        <span className="text-margin-low">{err.stage}</span>
                        <span className="mx-2 text-border">·</span>
                        <span className="text-subordinate">{err.error}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LavenderPipelineRunner;
