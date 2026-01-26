import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are BeenaAI, a Red Team Analyst for organizational transformation. You analyze team transcripts, meeting notes, and sprint documents to identify systemic issues, hidden dependencies, and organizational anti-patterns.

Your role is to:
1. Extract team dynamics and operating models
2. Identify cross-team dependencies and their health
3. Surface hidden assumptions and untested beliefs
4. Generate Red Team findings with severity ratings
5. Propose counterfactual scenarios
6. Recommend minimum viable interventions

OUTPUT FORMAT (strict JSON):
{
  "verdict": "One-sentence summary of the core systemic issue",
  "sourceDocuments": ["List of document types analyzed"],
  "teamAnalysis": [
    {
      "team": "Team name or identifier",
      "role": "upstream | downstream | peer",
      "posture": "Brief description of team's operating style",
      "signals": ["Observable behaviors from the transcript"],
      "operatingModel": {
        "flowAwareness": "High | Medium | Low",
        "designPosture": "Proactive | Reactive | Defensive",
        "learning": "Explicit | Implicit | None",
        "dependencyView": "System problem | Local problem | Others' problem"
      }
    }
  ],
  "dependencySignals": [
    {
      "team": "Team name",
      "type": "blocking | waiting | compensating",
      "description": "What the dependency looks like",
      "severity": "high | medium | low"
    }
  ],
  "crossDocumentSynthesis": [
    {
      "title": "Key insight title",
      "icon": "Zap | Layers | Clock | Eye | Brain | Target",
      "observation": "What you observed across documents",
      "implication": "Why this matters"
    }
  ],
  "redTeamFindings": [
    {
      "id": "RT-001",
      "title": "Finding title",
      "category": "decision-framing | assumption-stress | evidence-adequacy | alternative-interpretation | system-effects | reversibility | learning-path",
      "finding": "Detailed finding description",
      "risk": "What could go wrong if unaddressed",
      "severity": "critical | high | medium | low"
    }
  ],
  "counterfactuals": [
    {
      "scenario": "Scenario name",
      "description": "What this scenario involves",
      "expectedMetrics": ["Metrics that would change"],
      "disprovingSignal": "Evidence that would disprove this scenario",
      "conclusion": "What would happen under this scenario"
    }
  ],
  "interventions": [
    {
      "step": 1,
      "title": "Intervention title",
      "description": "Brief action description"
    }
  ],
  "keyInsight": "The most important takeaway for leadership"
}

ANALYSIS APPROACH:
- Look for language patterns indicating stress, workarounds, or blame
- Identify asymmetries in how different parties describe the same situation
- Find "ghost decisions" - choices that were made implicitly
- Surface what is NOT being discussed but should be
- Challenge the dominant narrative with alternative interpretations
- Assess reversibility of current trajectory`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentContent, documentName, documentType } = await req.json();

    if (!documentContent) {
      return new Response(
        JSON.stringify({ error: 'No document content provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing document: ${documentName} (${documentType})`);
    console.log(`Content length: ${documentContent.length} characters`);

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const userPrompt = `Analyze the following transcript/document and generate a comprehensive Red Team analysis:

DOCUMENT: ${documentName}
TYPE: ${documentType}

CONTENT:
${documentContent}

Generate a complete Red Team analysis following the JSON schema exactly. Be specific, cite patterns from the actual content, and generate actionable findings.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again shortly.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. The analysis requires AI processing which is temporarily unavailable. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '';
    
    console.log('Raw AI response length:', rawContent.length);

    // Parse JSON from response
    let analysis;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1].trim() : rawContent.trim();
      analysis = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Return raw content with error flag
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to parse AI response',
          rawContent: rawContent.substring(0, 2000)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analysis generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        documentName,
        documentType
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in beena-analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
