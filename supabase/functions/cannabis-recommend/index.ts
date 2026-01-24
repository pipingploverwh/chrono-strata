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

// Consumption methods with onset times and duration
const CONSUMPTION_METHODS = {
  inhalation: {
    name: "Inhalation",
    description: "Smoking dried flower or vaporization at lower temperatures without combustion. The safest and healthiest way to consume cannabis with minimal onset time. Common forms include dried flower and concentrated cannabis.",
    onsetTime: "0-15 minutes",
    duration: "2-4 hours",
    bioavailability: "High (10-35%)",
    bestFor: ["Immediate relief", "Precise dosing", "Acute symptoms"],
    considerations: ["Respiratory sensitivity", "Odor", "Short duration"],
  },
  ingestion: {
    name: "Ingestion (Edibles)",
    description: "Cannabis-infused products produce stronger physical and psychoactive effects. After breakdown in the gastrointestinal tract and passing through the liver, active cannabinoids enter the bloodstream.",
    onsetTime: "1-2 hours",
    duration: "4-8 hours",
    bioavailability: "Low (4-12%)",
    bestFor: ["Long-lasting relief", "Chronic conditions", "Discrete consumption"],
    considerations: ["Delayed onset", "Difficult to dose", "Stronger effects"],
  },
  sublingual: {
    name: "Sublingual",
    description: "Cannabis products like tinctures, infused liquids, and soluble tablets placed under the tongue. Patients can avoid intestinal absorption with faster onset than most edibles.",
    onsetTime: "30-60 minutes",
    duration: "4-8 hours",
    bioavailability: "Medium (12-25%)",
    bestFor: ["Moderate onset", "Precise dosing", "Discrete use"],
    considerations: ["Taste", "Must hold under tongue", "Alcohol-based tinctures may burn"],
  },
  topical: {
    name: "Topical",
    description: "Infused products including creams, lotions, ointments, and patches. Targeted for physical relief like inflammation, skin irritation, and localized pain. Most topicals only affect the applied area.",
    onsetTime: "15-20 minutes",
    duration: "Up to 12 hours",
    bioavailability: "Local only (transdermal patches systemic)",
    bestFor: ["Localized pain", "Skin conditions", "Inflammation", "Non-psychoactive relief"],
    considerations: ["No psychoactive effects", "Limited to application site", "May stain clothing"],
  },
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
    
    const systemPrompt = `You are a knowledgeable medical cannabis consultant and budtender. You provide evidence-based recommendations for cannabis strains based on medical conditions, terpene profiles, cannabinoid content, and optimal consumption methods.

TERPENE DATABASE:
${JSON.stringify(TERPENE_DATA, null, 2)}

CANNABINOID DATABASE:
${JSON.stringify(CANNABINOID_DATA, null, 2)}

CONSUMPTION METHODS DATABASE:
${JSON.stringify(CONSUMPTION_METHODS, null, 2)}

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
- recommendedConsumption: object with { method: string, onsetTime: string, duration: string, reasoning: string } - recommend the best consumption method for this strain and condition

Also include a "consumptionGuidance" object at the root level with:
- primaryMethod: The most appropriate consumption method for the condition
- alternativeMethod: A secondary option
- reasoning: Why this method is recommended for the condition (2 sentences)
- doseGuidance: General dosing advice for new patients

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
            recommendedConsumption: { method: "Inhalation", onsetTime: "0-15 minutes", duration: "2-4 hours", reasoning: "Fast onset for breakthrough pain relief with controllable dosing." },
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
            recommendedConsumption: { method: "Ingestion", onsetTime: "1-2 hours", duration: "4-8 hours", reasoning: "Extended duration for full-night sleep support without re-dosing." },
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
            recommendedConsumption: { method: "Sublingual", onsetTime: "30-60 minutes", duration: "4-8 hours", reasoning: "Balanced onset for sustained anxiety management without cognitive impairment." },
          },
        ],
        consumptionGuidance: {
          primaryMethod: "Inhalation",
          alternativeMethod: "Sublingual",
          reasoning: "Inhalation provides rapid symptom relief ideal for acute episodes. Sublingual offers a middle-ground with moderate onset and duration for maintenance dosing.",
          doseGuidance: "Start with 2.5-5mg THC equivalent for new patients. Wait 2 hours before re-dosing with edibles, 15 minutes with inhalation.",
        },
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
      consumptionMethods: CONSUMPTION_METHODS,
      consumptionGuidance: recommendations.consumptionGuidance || {
        primaryMethod: "Inhalation",
        alternativeMethod: "Sublingual",
        reasoning: "Inhalation provides rapid symptom relief. Sublingual offers moderate onset with longer duration.",
        doseGuidance: "Start low (2.5-5mg THC) and go slow. Wait appropriate time based on consumption method before re-dosing.",
      },
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
