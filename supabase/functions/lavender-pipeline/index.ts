import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `# Role
You are the Chief Sourcing Officer for **Lavender AI Org**, a premium brand dedicated to selling the world's finest lavender products on the "Lovable Shopping" platform.

# Objective
Analyze scraped web content to identify high-quality lavender products, compare pricing to market averages, and identify arbitrage opportunities.

# Target Categories
* Lavender Essential Oil (100% Pure)
* Dried Lavender Bundles (French & English varieties)
* Lavender-infused Soaps, Balms, and Body Products
* Lavender Seeds and Plants
* Lavender Home & Aromatherapy Products

# Analysis Criteria
1. Extract clear unit pricing (per kg/oz/lb/unit)
2. Check for stock availability
3. Calculate the "Lovable Margin": Apply 2.5x markup for standard items, 4x for luxury/organic
4. Only recommend products where Gross Margin > 60%
5. Prioritize organic, pure, and high-quality products

# Output Format
Return ONLY a valid JSON object (no markdown, no explanations):
{
  "products": [
    {
      "product_name": "Lovable [Descriptive Product Name]",
      "cost_price": [numeric],
      "suggested_retail_price": [numeric with markup],
      "description": "[2-sentence calming, luxurious description]",
      "tags": ["lavender", "organic", etc],
      "category": "[Essential Oil | Dried Bundles | Soaps & Balms | Seeds & Plants | Home & Aromatherapy | Other]",
      "supplier_rating": [1-5 or null],
      "gross_margin": [calculated percentage],
      "sourcing_confidence": [0-100],
      "stock_status": "[in_stock | out_of_stock | limited | unknown]",
      "supplier_name": "[extracted supplier/brand name or null]"
    }
  ],
  "analysis_summary": "[Brief findings summary]",
  "total_products_found": [number],
  "viable_products": [number meeting criteria]
}

# Constraints
- Skip products with ratings below 4.0/5.0
- Reject "fragrance oils" - must be real lavender products
- Flag suspicious pricing
- Use warm, premium "Lovable" brand voice`;

interface PipelineRequest {
  domain: string;
  mode: "full_pipeline" | "map_only" | "analyze_urls";
  urlLimit?: number;
  urlFilter?: string;
  urls?: string[];
  autoSave?: boolean;
}

interface PipelineProgress {
  stage: string;
  current: number;
  total: number;
  message: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!FIRECRAWL_API_KEY) throw new Error("FIRECRAWL_API_KEY is not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { 
      domain, 
      mode = "full_pipeline", 
      urlLimit = 10, 
      urlFilter = "lavender",
      urls = [],
      autoSave = false 
    }: PipelineRequest = await req.json();

    if (!domain && mode !== "analyze_urls") {
      throw new Error("domain is required for map and full_pipeline modes");
    }

    const crawlSessionId = crypto.randomUUID();
    const results: any = {
      session_id: crawlSessionId,
      domain,
      mode,
      stages: [],
      discovered_urls: [],
      filtered_urls: [],
      scraped_pages: [],
      analyzed_products: [],
      saved_products: [],
      errors: [],
      stats: {
        urls_discovered: 0,
        urls_filtered: 0,
        pages_scraped: 0,
        products_found: 0,
        products_saved: 0
      }
    };

    // Helper: Log stage progress
    const logStage = (stage: string, message: string, data?: any) => {
      console.log(`[${stage}] ${message}`, data ? JSON.stringify(data).substring(0, 200) : "");
      results.stages.push({ stage, message, timestamp: new Date().toISOString(), data });
    };

    // STAGE 1: Map the domain to discover URLs
    if (mode === "full_pipeline" || mode === "map_only") {
      logStage("MAP", `Mapping domain: ${domain}`);

      let formattedUrl = domain.trim();
      if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
        formattedUrl = `https://${formattedUrl}`;
      }

      try {
        const mapResponse = await fetch("https://api.firecrawl.dev/v1/map", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: formattedUrl,
            search: urlFilter,
            limit: Math.min(urlLimit * 5, 100), // Get more than needed for filtering
            includeSubdomains: false,
          }),
        });

        const mapData = await mapResponse.json();
        
        if (!mapResponse.ok) {
          throw new Error(mapData.error || `Map failed: ${mapResponse.status}`);
        }

        results.discovered_urls = mapData.links || [];
        results.stats.urls_discovered = results.discovered_urls.length;
        logStage("MAP", `Discovered ${results.discovered_urls.length} URLs`);

        // Filter URLs for lavender-related content
        const filterTerms = urlFilter.toLowerCase().split(",").map(t => t.trim());
        results.filtered_urls = results.discovered_urls
          .filter((url: string) => {
            const lowerUrl = url.toLowerCase();
            return filterTerms.some(term => lowerUrl.includes(term)) ||
              lowerUrl.includes("product") ||
              lowerUrl.includes("shop") ||
              lowerUrl.includes("essential") ||
              lowerUrl.includes("oil");
          })
          .slice(0, urlLimit);

        results.stats.urls_filtered = results.filtered_urls.length;
        logStage("FILTER", `Filtered to ${results.filtered_urls.length} relevant URLs`);

      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown map error";
        results.errors.push({ stage: "MAP", error: message });
        logStage("MAP_ERROR", message);
      }
    }

    // Use provided URLs for analyze_urls mode
    if (mode === "analyze_urls" && urls.length > 0) {
      results.filtered_urls = urls.slice(0, urlLimit);
      results.stats.urls_filtered = results.filtered_urls.length;
    }

    if (mode === "map_only") {
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // STAGE 2: Scrape each filtered URL
    logStage("SCRAPE", `Starting scrape of ${results.filtered_urls.length} URLs`);

    for (let i = 0; i < results.filtered_urls.length; i++) {
      const url = results.filtered_urls[i];
      logStage("SCRAPE", `Scraping ${i + 1}/${results.filtered_urls.length}: ${url}`);

      try {
        const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            formats: ["markdown"],
            onlyMainContent: true,
            waitFor: 1000,
          }),
        });

        const scrapeData = await scrapeResponse.json();

        if (!scrapeResponse.ok) {
          throw new Error(scrapeData.error || `Scrape failed: ${scrapeResponse.status}`);
        }

        const markdown = scrapeData.data?.markdown || scrapeData.markdown || "";
        
        if (markdown && markdown.length > 100) {
          results.scraped_pages.push({
            url,
            content: markdown,
            metadata: scrapeData.data?.metadata || scrapeData.metadata || {},
          });
          results.stats.pages_scraped++;
        }

        // Rate limiting - brief pause between requests
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown scrape error";
        results.errors.push({ stage: "SCRAPE", url, error: message });
        logStage("SCRAPE_ERROR", `Failed to scrape ${url}: ${message}`);
      }
    }

    logStage("SCRAPE", `Successfully scraped ${results.stats.pages_scraped} pages`);

    // STAGE 3: Analyze scraped content with AI
    logStage("ANALYZE", `Analyzing ${results.scraped_pages.length} pages with AI`);

    for (let i = 0; i < results.scraped_pages.length; i++) {
      const page = results.scraped_pages[i];
      logStage("ANALYZE", `Analyzing ${i + 1}/${results.scraped_pages.length}: ${page.url}`);

      try {
        const userPrompt = `Analyze this scraped content from ${page.url} and identify lavender products suitable for Lovable Shopping.

SCRAPED CONTENT:
${page.content.substring(0, 15000)}

Return ONLY valid JSON with the products array. If no valid lavender products found, return {"products": [], "analysis_summary": "No products found", "total_products_found": 0, "viable_products": 0}`;

        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userPrompt },
            ],
          }),
        });

        if (!aiResponse.ok) {
          if (aiResponse.status === 429) {
            logStage("ANALYZE_RATE_LIMIT", "Rate limited, waiting 5 seconds...");
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue;
          }
          throw new Error(`AI API error: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content || "";

        // Parse JSON from response
        let parsed;
        try {
          const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
          const jsonString = jsonMatch ? jsonMatch[1].trim() : content.trim();
          parsed = JSON.parse(jsonString);
        } catch {
          logStage("PARSE_ERROR", `Failed to parse AI response for ${page.url}`);
          continue;
        }

        if (parsed.products && Array.isArray(parsed.products)) {
          for (const product of parsed.products) {
            results.analyzed_products.push({
              ...product,
              original_source_url: page.url,
              crawl_session_id: crawlSessionId,
            });
          }
          results.stats.products_found += parsed.products.length;
        }

        // Rate limiting between AI calls
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown analyze error";
        results.errors.push({ stage: "ANALYZE", url: page.url, error: message });
        logStage("ANALYZE_ERROR", `Failed to analyze ${page.url}: ${message}`);
      }
    }

    logStage("ANALYZE", `Found ${results.stats.products_found} products total`);

    // STAGE 4: Save products to database (if autoSave enabled)
    if (autoSave && results.analyzed_products.length > 0) {
      logStage("SAVE", `Auto-saving ${results.analyzed_products.length} products`);

      for (const product of results.analyzed_products) {
        try {
          const insertData = {
            product_name: product.product_name || "Unknown Product",
            original_source_url: product.original_source_url || domain,
            cost_price: product.cost_price || 0,
            suggested_retail_price: product.suggested_retail_price || 0,
            description: product.description || "",
            tags: product.tags || ["lavender"],
            category: product.category || "Other",
            supplier_rating: product.supplier_rating,
            gross_margin: product.gross_margin,
            sourcing_confidence: product.sourcing_confidence || 50,
            stock_status: product.stock_status || "unknown",
            supplier_name: product.supplier_name,
            crawl_session_id: crawlSessionId,
            scraped_at: new Date().toISOString(),
            status: "pending",
            approved_for_listing: false,
          };

          const { error } = await supabase.from("sourced_products").insert(insertData);

          if (error) {
            throw error;
          }

          results.saved_products.push(product.product_name);
          results.stats.products_saved++;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown save error";
          results.errors.push({ stage: "SAVE", product: product.product_name, error: message });
        }
      }

      logStage("SAVE", `Saved ${results.stats.products_saved} products to database`);
    }

    // Final summary
    logStage("COMPLETE", "Pipeline finished", results.stats);

    return new Response(JSON.stringify({
      success: true,
      ...results,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Pipeline error:", message);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
