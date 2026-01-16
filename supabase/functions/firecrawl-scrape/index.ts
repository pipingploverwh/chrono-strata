import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScrapeRequest {
  url: string;
  mode: "scrape" | "crawl" | "map";
  formats?: string[];
  limit?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!apiKey) {
      throw new Error("FIRECRAWL_API_KEY not configured");
    }

    const { url, mode = "scrape", formats = ["markdown", "html"], limit = 10 }: ScrapeRequest = await req.json();

    if (!url) {
      throw new Error("URL is required");
    }

    let endpoint: string;
    let body: Record<string, unknown>;

    switch (mode) {
      case "crawl":
        endpoint = "https://api.firecrawl.dev/v1/crawl";
        body = {
          url,
          limit,
          scrapeOptions: { formats },
        };
        break;
      case "map":
        endpoint = "https://api.firecrawl.dev/v1/map";
        body = { url };
        break;
      default: // scrape
        endpoint = "https://api.firecrawl.dev/v1/scrape";
        body = {
          url,
          formats,
          onlyMainContent: true,
        };
    }

    console.log(`Firecrawl ${mode} request for: ${url}`);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Firecrawl API error:", errorText);
      throw new Error(`Firecrawl API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Firecrawl ${mode} successful`);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in firecrawl-scrape:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
