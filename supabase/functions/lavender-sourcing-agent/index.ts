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
Analyze scraped web content to identify high-quality lavender products, compare pricing to market averages, and identify arbitrage opportunities where we can source low and sell high while maintaining quality.

# Target Categories
* Lavender Essential Oil (100% Pure)
* Dried Lavender Bundles (French & English varieties)
* Lavender-infused Soaps and Balms

# Analysis Criteria
1. Look for suppliers with clear unit pricing (per kg/oz/lb)
2. Check for "In Stock" status
3. Calculate the "Lovable Margin": Extract Source Price, compare against Target Retail Price (2.5x markup for standard items, 4x for luxury)
4. Only select products where the Gross Margin is > 60%

# Output Requirements
For each valid product found, output a JSON object with this exact structure:
{
  "products": [
    {
      "product_name": "Lovable [Product Name]",
      "original_source_url": "[URL from context]",
      "cost_price": [numeric price],
      "suggested_retail_price": [price with markup applied],
      "description": "[2-sentence calming, luxurious description emphasizing relaxation and purity]",
      "tags": ["organic", "lavender", "sleep", "wellness"],
      "category": "[Essential Oil | Dried Bundles | Soaps & Balms | Other]",
      "supplier_rating": [0-5 if found, null otherwise],
      "gross_margin": [calculated margin percentage],
      "sourcing_confidence": [0-100 score based on supplier reputation and data quality],
      "stock_status": "[in_stock | out_of_stock | unknown]"
    }
  ],
  "analysis_summary": "[Brief summary of findings]",
  "total_products_found": [number],
  "viable_products": [number meeting margin criteria]
}

# Constraints
- Do not recommend products with average ratings below 4.0/5.0
- Avoid "fragrance oils" (must be "essential oils")
- Flag any suspicious pricing or low-quality indicators
- Use the "Lovable" voice: calming, luxurious, warm, premium`;

interface AgentRequest {
  scrapedContent: string;
  sourceUrl: string;
  mode: "analyze" | "generate_listing";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { scrapedContent, sourceUrl, mode = "analyze" }: AgentRequest = await req.json();

    if (!scrapedContent) {
      throw new Error("scrapedContent is required");
    }

    console.log(`Lavender Sourcing Agent: Processing ${mode} for ${sourceUrl}`);

    const userPrompt = mode === "analyze" 
      ? `Analyze the following scraped content from ${sourceUrl} and identify any lavender products suitable for resale on our Lovable Shopping platform. Apply the margin calculations and quality filters.

SCRAPED CONTENT:
${scrapedContent}

Return the analysis as a valid JSON object following the output requirements.`
      : `Generate optimized product listings for the lavender products found in this content from ${sourceUrl}. Focus on creating compelling "Lovable" brand descriptions.

SCRAPED CONTENT:
${scrapedContent}

Return the listings as a valid JSON object following the output requirements.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Try to parse the JSON from the AI response
    let parsedResponse;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1].trim() : aiResponse.trim();
      parsedResponse = JSON.parse(jsonString);
    } catch {
      // If parsing fails, return the raw response
      parsedResponse = { raw_response: aiResponse, parse_error: true };
    }

    console.log(`Lavender Sourcing Agent: Analysis complete`);

    return new Response(
      JSON.stringify({
        success: true,
        data: parsedResponse,
        source_url: sourceUrl,
        mode,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in lavender-sourcing-agent:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
