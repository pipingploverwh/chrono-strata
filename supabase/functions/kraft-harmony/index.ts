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
  venue?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, requirements, messages, context, venue } = await req.json() as HarmonyRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const kraftContext = `
KRAFT GROUP ENTERPRISE CONTEXT:
- Properties: Gillette Stadium, Patriot Place, Kraft Sports + Entertainment
- Teams: New England Patriots (NFL), New England Revolution (MLS)
- Capacity: 65,878 (Gillette Stadium)
- Annual Events: 100+ major events including NFL games, concerts, soccer matches
- Technology Focus: Fan experience, operational efficiency, weather-responsive operations
- Key Systems: STRATA weather intelligence, crowd management, concession optimization
`;

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "analyze") {
      systemPrompt = `You are Kraft AI Harmony, an intelligent development orchestrator specialized for the Kraft Group's venue and sports operations. Your role is to analyze requirements and break them into actionable development tasks optimized for professional sports venues.

${kraftContext}

KRAFT-SPECIFIC CAPABILITIES:
- Game day operations optimization
- Fan experience enhancement systems
- Weather-responsive venue management (STRATA integration)
- Concession and retail analytics
- Parking and traffic flow optimization
- Security and crowd management
- Multi-property analytics (Gillette + Patriot Place)
- Real-time event monitoring dashboards
- Player and team performance integration
- Sponsorship activation tracking

OUTPUT FORMAT:
Return a JSON object with this structure:
{
  "summary": "Brief summary focused on Kraft Group impact",
  "complexity": "low" | "medium" | "high" | "critical",
  "estimatedHours": number,
  "venueImpact": {
    "operations": "How this affects venue operations",
    "fanExperience": "Impact on fan experience",
    "revenue": "Potential revenue implications"
  },
  "tasks": [
    {
      "id": number,
      "title": "Task title",
      "description": "Detailed description with Kraft-specific considerations",
      "type": "frontend" | "backend" | "database" | "integration" | "design" | "operations",
      "priority": "high" | "medium" | "low",
      "estimatedHours": number,
      "dependencies": [task ids],
      "venueSystem": "Which Kraft system this integrates with"
    }
  ],
  "risks": ["potential risks specific to venue operations"],
  "recommendations": ["recommendations considering Kraft Group infrastructure"],
  "strataIntegration": "How this connects with STRATA weather intelligence"
}`;
      userPrompt = `Analyze this requirement for Kraft Group venue/sports operations:\n\n${requirements}\n\nVenue context: ${venue || 'Gillette Stadium'}`;
    } else if (type === "specs") {
      systemPrompt = `You are Kraft AI Harmony, a technical architect specialized for Kraft Group's venue and sports technology infrastructure. Generate detailed technical specifications optimized for professional sports venue operations.

${kraftContext}

KRAFT TECH STACK:
- Frontend: React 18, TypeScript, Tailwind CSS, shadcn/ui
- Backend: Supabase Edge Functions (Deno)
- Database: PostgreSQL with RLS
- AI: Lovable AI Gateway
- Weather: STRATA platform integration
- Real-time: Supabase Realtime for live game day data
- Analytics: Recharts, custom dashboards

VENUE-SPECIFIC INTEGRATIONS:
- Ticketing systems (Ticketmaster integration)
- POS systems for concessions
- Parking management systems
- Digital signage networks
- Mobile app (Patriots/Revolution apps)
- Stadium Wi-Fi analytics
- Broadcast integration

OUTPUT FORMAT:
Return a JSON object with:
{
  "architecture": {
    "overview": "High-level architecture with Kraft systems context",
    "components": [
      {
        "name": "Component name",
        "path": "src/components/kraft/...",
        "purpose": "What it does for venue operations",
        "props": [{ "name": "propName", "type": "string", "required": true }],
        "hooks": ["useHook1", "useHook2"],
        "venueIntegration": "Which Kraft system this connects to"
      }
    ],
    "dataFlow": "Description of data flow including venue systems"
  },
  "database": {
    "tables": [
      {
        "name": "table_name",
        "columns": [{ "name": "col", "type": "text", "nullable": false }],
        "rlsPolicies": ["policy descriptions"],
        "venueDataType": "What kind of venue data this stores"
      }
    ]
  },
  "edgeFunctions": [
    {
      "name": "function-name",
      "purpose": "What it does for Kraft operations",
      "endpoints": ["POST /function-name"],
      "authentication": "required" | "optional" | "none",
      "venueIntegration": "External venue system it connects to"
    }
  ],
  "integrations": ["Kraft-specific external services"],
  "implementationOrder": ["step 1", "step 2", "..."],
  "gameDayConsiderations": ["Special considerations for game day operations"],
  "strataIntegration": {
    "weatherTriggers": ["Weather conditions that affect this feature"],
    "automatedResponses": ["Automated actions based on weather"]
  }
}`;
      userPrompt = `Generate technical specifications for Kraft Group:\n\n${requirements}\n\nContext: ${context || 'Gillette Stadium operations'}`;
    } else {
      systemPrompt = `You are Kraft AI Harmony, an intelligent operations assistant for the Kraft Group's venue and sports technology. You help refine requirements, answer technical questions, and guide implementation for professional sports venue systems.

${kraftContext}

CONVERSATION CONTEXT:
- Focus on practical venue operations
- Consider game day vs non-game day scenarios
- Account for weather impacts (STRATA integration)
- Prioritize fan safety and experience
- Consider multi-property implications
- Think about scalability for large events (65,000+ attendees)

EXPERTISE AREAS:
- Stadium operations technology
- Fan engagement platforms
- Weather-responsive systems
- Real-time crowd analytics
- Concession optimization
- Parking and transit management
- Security integration
- Digital experience design

Be conversational, helpful, and always frame answers in terms of Kraft Group's specific needs. Reference real venue capabilities and suggest practical improvements.`;
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

    let parsed = null;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      parsed = JSON.parse(jsonStr.trim());
    } catch {
      parsed = { rawContent: content };
    }

    return new Response(JSON.stringify({ success: true, data: parsed, raw: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Kraft Harmony error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
