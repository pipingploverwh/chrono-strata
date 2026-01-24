import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Terpene and cannabinoid knowledge base
const TERPENE_DATA = {
  myrcene: { aroma: "Earthy, Herbal", benefits: ["Pain Relief", "Sedative", "Muscle Relaxation", "Anti-inflammatory"] },
  limonene: { aroma: "Citrus", benefits: ["Anti-anxiety", "Anti-depressant", "Anti-bacterial", "Mood Elevation"] },
  pinene: { aroma: "Pine", benefits: ["Alertness", "Memory Retention", "Anti-inflammatory", "Bronchodilator"] },
  linalool: { aroma: "Lavender, Floral", benefits: ["Anti-anxiety", "Sedative", "Anti-epileptic", "Pain Relief"] },
  caryophyllene: { aroma: "Black Pepper, Spicy", benefits: ["Anti-anxiety", "Anti-inflammatory", "Pain Relief", "Gastroprotection"] },
  humulene: { aroma: "Woody, Earthy", benefits: ["Anti-inflammatory", "Appetite Suppressant", "Anti-bacterial"] },
  terpinolene: { aroma: "Pine, Floral, Herbal", benefits: ["Sedative", "Anti-fungal", "Anti-bacterial", "Antioxidant"] },
  ocimene: { aroma: "Sweet, Herbal", benefits: ["Anti-viral", "Anti-fungal", "Decongestant", "Anti-inflammatory"] },
};

const CANNABINOID_DATA = {
  THC: { type: "Psychoactive", benefits: ["Pain Relief", "Appetite Stimulation", "Anti-nausea", "Sleep Aid"] },
  CBD: { type: "Non-psychoactive", benefits: ["Anti-anxiety", "Anti-inflammatory", "Anti-seizure", "Neuroprotective"] },
  CBN: { type: "Mildly Psychoactive", benefits: ["Sedative", "Appetite Stimulation", "Pain Relief", "Anti-bacterial"] },
  CBG: { type: "Non-psychoactive", benefits: ["Anti-inflammatory", "Neuroprotective", "Antibacterial", "Appetite Stimulation"] },
  THCV: { type: "Psychoactive (low doses)", benefits: ["Appetite Suppression", "Energy", "Focus", "Bone Health"] },
};

// Condition-to-strain-profile mapping
const CONDITION_PROFILES: Record<string, { terpenes: string[]; cannabinoids: string[]; strainType: string }> = {
  pain: { terpenes: ["myrcene", "caryophyllene", "linalool"], cannabinoids: ["THC", "CBD"], strainType: "indica" },
  anxiety: { terpenes: ["linalool", "limonene", "caryophyllene"], cannabinoids: ["CBD", "THC"], strainType: "hybrid" },
  insomnia: { terpenes: ["myrcene", "linalool", "terpinolene"], cannabinoids: ["THC", "CBN"], strainType: "indica" },
  depression: { terpenes: ["limonene", "pinene", "caryophyllene"], cannabinoids: ["THC", "CBD"], strainType: "sativa" },
  nausea: { terpenes: ["limonene", "humulene"], cannabinoids: ["THC", "CBD"], strainType: "hybrid" },
  inflammation: { terpenes: ["caryophyllene", "myrcene", "pinene"], cannabinoids: ["CBD", "CBG"], strainType: "hybrid" },
  appetite: { terpenes: ["myrcene", "humulene"], cannabinoids: ["THC", "CBN"], strainType: "indica" },
  focus: { terpenes: ["pinene", "limonene", "terpinolene"], cannabinoids: ["THCV", "CBD"], strainType: "sativa" },
  migraine: { terpenes: ["myrcene", "caryophyllene", "linalool"], cannabinoids: ["THC", "CBD"], strainType: "indica" },
  ptsd: { terpenes: ["linalool", "limonene", "caryophyllene"], cannabinoids: ["THC", "CBD"], strainType: "hybrid" },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { condition, preferences, location } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const profile = CONDITION_PROFILES[condition?.toLowerCase()] || CONDITION_PROFILES.pain;
    
    const systemPrompt = `You are a knowledgeable medical cannabis consultant and budtender. You provide evidence-based recommendations for cannabis strains based on medical conditions, terpene profiles, and cannabinoid content.

TERPENE DATABASE:
${JSON.stringify(TERPENE_DATA, null, 2)}

CANNABINOID DATABASE:
${JSON.stringify(CANNABINOID_DATA, null, 2)}

CONDITION PROFILE FOR "${condition}":
- Recommended Terpenes: ${profile.terpenes.join(", ")}
- Recommended Cannabinoids: ${profile.cannabinoids.join(", ")}
- Strain Type: ${profile.strainType}

You must respond with a valid JSON object containing exactly 3 strain recommendations. Each strain should include:
- name: Strain name
- type: indica/sativa/hybrid
- thcPercent: number (0-35)
- cbdPercent: number (0-25)
- dominantTerpenes: array of 2-3 terpenes
- benefits: array of 3-4 medical benefits
- description: 2-sentence description of effects
- bestFor: Primary use case
- potentialSideEffects: array of 1-2 common side effects

Respond ONLY with valid JSON, no markdown or explanation.`;

    const userPrompt = `Recommend 3 cannabis strains for someone with ${condition}. ${preferences ? `User preferences: ${preferences}` : ""} Consider their location in ${location || "a legal state"} for product availability.`;

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
          { role: "user", content: userPrompt },
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
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    
    // Parse AI response
    let recommendations;
    try {
      // Clean JSON from potential markdown
      const cleanJson = content.replace(/```json\n?|\n?```/g, "").trim();
      recommendations = JSON.parse(cleanJson);
    } catch {
      // Fallback recommendations if parsing fails
      recommendations = {
        strains: [
          {
            name: "Blue Dream",
            type: "hybrid",
            thcPercent: 21,
            cbdPercent: 0.5,
            dominantTerpenes: ["myrcene", "pinene", "caryophyllene"],
            benefits: ["Pain Relief", "Relaxation", "Mood Elevation", "Creativity"],
            description: "A balanced hybrid known for full-body relaxation with gentle cerebral invigoration. Popular for daytime use with manageable effects.",
            bestFor: "Chronic Pain & Stress",
            potentialSideEffects: ["Dry Mouth", "Dry Eyes"],
          },
          {
            name: "Granddaddy Purple",
            type: "indica",
            thcPercent: 23,
            cbdPercent: 0.3,
            dominantTerpenes: ["myrcene", "linalool", "caryophyllene"],
            benefits: ["Sleep Aid", "Pain Relief", "Muscle Relaxation", "Stress Relief"],
            description: "A potent indica with deep relaxation effects ideal for evening use. Known for its grape and berry aroma profile.",
            bestFor: "Insomnia & Chronic Pain",
            potentialSideEffects: ["Drowsiness", "Dry Mouth"],
          },
          {
            name: "Harlequin",
            type: "sativa",
            thcPercent: 7,
            cbdPercent: 15,
            dominantTerpenes: ["myrcene", "pinene", "caryophyllene"],
            benefits: ["Clear-headed Relief", "Anti-inflammatory", "Focus", "Anxiety Relief"],
            description: "A high-CBD strain offering relief without intense psychoactive effects. Excellent for daytime therapeutic use.",
            bestFor: "Anxiety & Inflammation",
            potentialSideEffects: ["Mild Relaxation"],
          },
        ],
      };
    }

    return new Response(JSON.stringify({
      condition,
      profile: {
        recommendedTerpenes: profile.terpenes.map(t => ({ name: t, ...TERPENE_DATA[t as keyof typeof TERPENE_DATA] })),
        recommendedCannabinoids: profile.cannabinoids.map(c => ({ name: c, ...CANNABINOID_DATA[c as keyof typeof CANNABINOID_DATA] })),
        strainType: profile.strainType,
      },
      recommendations: recommendations.strains || recommendations,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Cannabis recommendation error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Failed to generate recommendations" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
