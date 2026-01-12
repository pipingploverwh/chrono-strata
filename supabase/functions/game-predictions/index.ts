import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GameState {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  quarter: number;
  timeRemaining: string;
  weather?: {
    windSpeed: number;
    windDirection: string;
    temp: number;
    precipitation: number;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { gameState } = await req.json() as { gameState: GameState };
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an elite sports analytics AI specializing in NFL game prediction. 
You analyze game state, weather conditions, and situational factors to generate precise predictions.
Your predictions must include confidence intervals and risk-adjusted metrics suitable for institutional investors.
Always provide actionable insights with clear reasoning.
Format your response as JSON with the following structure:
{
  "winProbability": { "home": number, "away": number },
  "nextDriveOutcome": { "prediction": string, "confidence": number },
  "weatherImpact": { "factor": string, "adjustment": number },
  "playTypeDistribution": { "run": number, "shortPass": number, "deepPass": number },
  "keyInsight": string,
  "riskAssessment": { "level": "low" | "medium" | "high", "factors": string[] }
}`;

    const userPrompt = `Analyze this live NFL game state and provide predictions:

GAME STATE:
- ${gameState.awayTeam} ${gameState.awayScore} @ ${gameState.homeTeam} ${gameState.homeScore}
- Quarter: Q${gameState.quarter}, Time: ${gameState.timeRemaining}
${gameState.weather ? `
WEATHER CONDITIONS:
- Wind: ${gameState.weather.windSpeed} mph ${gameState.weather.windDirection}
- Temperature: ${gameState.weather.temp}°F
- Precipitation: ${gameState.weather.precipitation > 0 ? `${gameState.weather.precipitation}%` : 'None'}
` : ''}

Provide institutional-grade predictions with confidence intervals.`;

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
        temperature: 0.3,
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
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse JSON from the response
    let predictions;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      predictions = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", content);
      predictions = {
        winProbability: { home: 50, away: 50 },
        nextDriveOutcome: { prediction: "Unable to analyze", confidence: 0 },
        weatherImpact: { factor: "Unknown", adjustment: 0 },
        playTypeDistribution: { run: 33, shortPass: 34, deepPass: 33 },
        keyInsight: "Analysis temporarily unavailable",
        riskAssessment: { level: "medium", factors: ["Data parsing error"] }
      };
    }

    return new Response(JSON.stringify({
      predictions,
      timestamp: new Date().toISOString(),
      gameState,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Prediction error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
