import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const today = new Date();
    const days = Array.from({ length: 5 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    });

const systemPrompt = `You are an economic analyst providing a 5-day market outlook. Today is ${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.

Current market context (January 2026):
- Trump administration in office, focusing on tariffs, deregulation, energy dominance
- S&P 500 volatile amid trade policy announcements
- AI enthusiasm driving tech valuations but policy uncertainty creates swings
- Federal Reserve navigating inflation vs growth balance
- Trade tensions with China, new tariff announcements expected
- Energy sector benefiting from "drill baby drill" policies
- Labor market adjusting to immigration policy changes
- Crypto markets responding to pro-Bitcoin administration stance

Weather and environmental context for economic signals:
- Northeast: Winter storms affecting supply chains and retail
- Gulf Coast: Mild conditions supporting oil production
- Midwest: Agricultural commodity prices shifting with weather forecasts
- West Coast: Drought conditions impacting water-dependent industries

Generate a JSON response with 5-day predictions AND Trump policy analysis. Be specific but accessible.
Return ONLY valid JSON matching this structure:
{
  "headline": "One catchy 5-8 word headline for the week",
  "sentiment": "bullish" | "bearish" | "mixed",
  "confidenceScore": 65-85,
  "days": [
    {
      "date": "${days[0]}",
      "emoji": "📈 or 📉 or ➡️",
      "prediction": "One sentence prediction",
      "sp500Change": "+0.3%" format,
      "keyEvent": "Key thing to watch",
      "mood": "optimistic" | "cautious" | "nervous"
    }
  ],
  "sectors": {
    "tech": { "outlook": "bullish/bearish/neutral", "reason": "10 words max" },
    "finance": { "outlook": "bullish/bearish/neutral", "reason": "10 words max" },
    "energy": { "outlook": "bullish/bearish/neutral", "reason": "10 words max" },
    "healthcare": { "outlook": "bullish/bearish/neutral", "reason": "10 words max" }
  },
  "aiInsight": "2-3 sentences of actionable advice for everyday investors in plain English",
  "riskFactors": ["risk 1", "risk 2", "risk 3"],
  "trumpWillLike": [
    {
      "idea": "Short punchy policy/economic idea Trump would champion",
      "reason": "Why it aligns with his agenda",
      "marketImpact": "bullish/bearish/neutral",
      "weatherLink": "How weather or environmental conditions support this"
    }
  ],
  "trumpWillNotLike": [
    {
      "idea": "Short punchy policy/economic idea Trump would oppose",
      "reason": "Why it conflicts with his agenda", 
      "marketImpact": "bullish/bearish/neutral",
      "newsSource": "Type of news that would report this"
    }
  ]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate the 5-day economic forecast based on current market conditions." }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to parse forecast");
    
    const forecast = JSON.parse(jsonMatch[0]);
    forecast.generatedAt = new Date().toISOString();

    return new Response(JSON.stringify(forecast), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Economic forecast error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Failed to generate forecast" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
