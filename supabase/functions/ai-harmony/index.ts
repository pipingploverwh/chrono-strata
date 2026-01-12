import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HarmonyRequest {
  type: "analyze" | "chat" | "specs";
  requirements?: string;
  messages?: { role: string; content: string }[];
  context?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, requirements, messages, context } = await req.json() as HarmonyRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "analyze") {
      systemPrompt = `You are Lavandar AI Harmony, an intelligent development orchestrator for the Lavandar platform. Your role is to analyze requirements and break them into actionable development tasks.

CAPABILITIES:
- Weather intelligence systems (STRATA platform)
- Fan experience optimization
- Predictive personalization
- Real-time data processing
- Enterprise integrations
- Marine/Aviation/Construction/Events industry solutions

OUTPUT FORMAT:
Return a JSON object with this structure:
{
  "summary": "Brief summary of the requirement",
  "complexity": "low" | "medium" | "high" | "critical",
  "estimatedHours": number,
  "tasks": [
    {
      "id": number,
      "title": "Task title",
      "description": "Detailed description",
      "type": "frontend" | "backend" | "database" | "integration" | "design",
      "priority": "high" | "medium" | "low",
      "estimatedHours": number,
      "dependencies": [task ids]
    }
  ],
  "risks": ["potential risks"],
  "recommendations": ["architectural recommendations"]
}`;
      userPrompt = `Analyze this requirement and create development tasks:\n\n${requirements}`;
    } else if (type === "specs") {
      systemPrompt = `You are Lavandar AI Harmony, a technical architect for the Lavandar platform. Generate detailed technical specifications for implementation.

TECH STACK:
- Frontend: React 18, TypeScript, Tailwind CSS, shadcn/ui
- Backend: Supabase Edge Functions (Deno)
- Database: PostgreSQL with RLS
- AI: Lovable AI Gateway
- State: React Query, React Context

OUTPUT FORMAT:
Return a JSON object with:
{
  "architecture": {
    "overview": "High-level architecture description",
    "components": [
      {
        "name": "Component name",
        "path": "src/components/...",
        "purpose": "What it does",
        "props": [{ "name": "propName", "type": "string", "required": true }],
        "hooks": ["useHook1", "useHook2"]
      }
    ],
    "dataFlow": "Description of data flow"
  },
  "database": {
    "tables": [
      {
        "name": "table_name",
        "columns": [{ "name": "col", "type": "text", "nullable": false }],
        "rlsPolicies": ["policy descriptions"]
      }
    ]
  },
  "edgeFunctions": [
    {
      "name": "function-name",
      "purpose": "What it does",
      "endpoints": ["POST /function-name"],
      "authentication": "required" | "optional" | "none"
    }
  ],
  "integrations": ["external services needed"],
  "implementationOrder": ["step 1", "step 2", "..."]
}`;
      userPrompt = `Generate technical specifications for:\n\n${requirements}\n\nContext: ${context || 'Lavandar enterprise weather intelligence platform'}`;
    } else {
      systemPrompt = `You are Lavandar AI Harmony, an intelligent development assistant for the Lavandar platform. You help refine requirements, answer technical questions, and guide implementation.

PLATFORM CONTEXT:
- STRATA: Weather intelligence instrument panel
- Fan Experience: Frictionless monetization, predictive personalization, crowd sentiment
- Industries: Maritime, Aviation, Construction, Events
- Enterprise features: Real-time data, ML predictions, multi-property analytics

Be conversational, helpful, and technically precise. Suggest improvements and best practices.`;
      userPrompt = messages?.map(m => `${m.role}: ${m.content}`).join('\n') || requirements || '';
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
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        stream: type === "chat",
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    if (type === "chat") {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Try to parse JSON from the response
    let parsed = null;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      parsed = JSON.parse(jsonStr.trim());
    } catch {
      // If parsing fails, return raw content
      parsed = { rawContent: content };
    }

    return new Response(JSON.stringify({ success: true, data: parsed, raw: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Harmony error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});