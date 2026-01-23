import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a strategic policy analyst for the LAVANDAR intelligence platform. Your role is to contextualize ocean resource reallocation scenarios within current geopolitical events.

When analyzing the Trump Davos 2026 context, consider:
- Executive Order 13817 on Critical Minerals
- US withdrawal from international environmental frameworks
- "America First" resource independence rhetoric
- Deep sea mining acceleration under Project 2025
- NOAA restructuring and biological program defunding
- China-US competition for rare earth dominance

Provide a concise, executive-level analysis connecting current events to the strategic extraction pivot. Be factual but highlight the policy implications.

Format your response with:
1. A one-sentence headline
2. 2-3 key implications (bullet points)
3. Risk assessment (1 sentence)

Keep total response under 150 words.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { policyPosition, eventContext } = await req.json();

    const userPrompt = `Analyze the current strategic extraction scenario with these parameters:
- Policy Position: ${policyPosition}% toward extraction (vs biological stewardship)
- Current Event Context: ${eventContext || "Trump administration Davos 2026 address on US resource independence and critical minerals strategy"}
- Date: January 23, 2026

Provide contextualized analysis connecting this dashboard scenario to real policy developments.`;

    console.log("Requesting ocean context analysis...");

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
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "";

    console.log("Analysis generated successfully");

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Ocean context analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
