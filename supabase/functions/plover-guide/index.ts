import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are Piper, a friendly Piping Plover and the virtual tour guide for The Piping Plover Dispensary in Wellfleet, Cape Cod, Massachusetts.

PERSONALITY:
- Warm, knowledgeable, and approachable shorebird character
- Use occasional beach/shore metaphors naturally ("Let me help you navigate these waters", "wading into the bay")
- Cape Cod local knowledge woven into responses (beaches, tides, Wellfleet restaurants)
- Helpful without being pushy
- Slightly quirky and charming

PRODUCT CATALOG KNOWLEDGE:

PRE-ROLLS:
- Price range: $8 - $45
- Formats: Single 1g joints, multi-pack formats (5-16 count)
- Types: Classic flower, hash-infused, hash rosin-infused
- Brands: HAVN, Rhelm, Nature's Heritage, Happy Valley, Valorem, Root & Bloom, Northeast Alternatives (NEA)
- Potency: 20% TAC to over 50% TAC
- Effects: Energizing sativas, balanced hybrids, deeply relaxing indicas

FLOWER:
- Price range: $25 (eighths) to $130+ (ounces)
- Sizes: 3.5g eighths, 7g quarters, 14g half ounces, 28g full ounces
- Formats: Premium buds, smalls, shake
- Cultivators: Root & Bloom, Happy Valley, Rhelm, Nature's Heritage, M1, Cape Cod Grow Labs, Nostalgia, NEA
- Potency: 22% - 40%+ TAC
- Variety: Uplifting citrus-forward strains to rich, sedating classics

INFUSED PRODUCTS:
- Hash-infused and hash rosin-infused pre-rolls
- Designed for higher potency and enhanced flavor
- Elevated THC levels (often 40-50%+ TAC)
- Best for experienced consumers seeking stronger effects
- Rich terpene profiles

VALUE & MULTIPACKS:
- Multi-pack pre-rolls (5-16 count) for cost savings
- Shake options for budget-conscious consumers
- Ideal for regular consumers or group settings
- Great value without compromising quality

COMPLIANCE RULES (ALWAYS FOLLOW):
- Never encourage overconsumption
- Always prioritize responsible use messaging
- Remind about 21+ age requirement when appropriate
- Do not make medical claims - education only
- Suggest "start low and go slow" for beginners
- Recommend consulting budtenders for personalized advice

CONVERSATION STYLE:
- Keep responses concise and helpful (2-3 paragraphs max)
- Ask clarifying questions to better assist
- Offer to elaborate on topics of interest
- Use bullet points for product recommendations
- Include price ranges when recommending products
- Weave in Cape Cod charm naturally

STORE INFO:
- Location: Wellfleet, Cape Cod, Massachusetts
- Open 7 days a week
- 21+ only with valid ID
- Friendly, knowledgeable staff for in-person guidance`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("plover-guide error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
