import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BriefingCard {
  id: string;
  category: 'current_events' | 'business' | 'weather' | 'question' | 'policy';
  title: string;
  headline: string;
  summary: string;
  details: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  importance: 'high' | 'medium' | 'low';
  source?: string;
  timestamp: string;
  actionItems?: string[];
  relatedTopics?: string[];
}

// Common questions people ask
const COMMON_QUESTIONS = [
  "What's the stock market doing today?",
  "Is inflation going up or down?",
  "What's happening with interest rates?",
  "Any major company layoffs?",
  "What's the price of gas?",
  "How's the housing market?",
  "What's Bitcoin doing?",
  "Any new tariff news?",
  "What's unemployment at?",
  "Any supply chain issues?",
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, categories } = await req.json();
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!apiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Pick 2-3 random questions for this briefing
    const shuffled = [...COMMON_QUESTIONS].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 3);

    const systemPrompt = `You are a presidential briefing assistant creating concise, actionable intelligence cards for an executive. Today is ${today}. The user is located in ${location || 'the United States'}.

Your job is to generate briefing cards that are:
- SIMPLE: Use plain language a busy executive can scan in 5 seconds
- ACTIONABLE: What does this mean? What should they watch?
- CURRENT: Reference the current date and recent developments
- HONEST: Include both positive and negative developments

Generate exactly 8 briefing cards in this JSON format:
{
  "cards": [
    {
      "id": "unique-id",
      "category": "current_events|business|weather|question|policy",
      "title": "Short 2-3 word title",
      "headline": "One punchy sentence (max 10 words)",
      "summary": "2-3 sentence plain-English summary",
      "details": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "sentiment": "positive|neutral|negative|mixed",
      "importance": "high|medium|low",
      "source": "Where this info comes from",
      "actionItems": ["What to watch", "What to do"],
      "relatedTopics": ["Related topic 1", "Related topic 2"]
    }
  ]
}

REQUIRED CARDS (generate one of each):
1. TOP STORY: The single most important news item today
2. MARKET PULSE: Stock market and financial overview
3. ECONOMIC INDICATOR: One key economic metric (jobs, inflation, GDP, etc.)
4. WEATHER ALERT: Notable weather affecting business or travel
5. POLICY WATCH: Government policy or regulatory development
6. BUSINESS MOVE: Major corporate news (M&A, earnings, layoffs, launches)

PLUS answer these specific questions as cards:
${selectedQuestions.map((q, i) => `${i + 7}. Q&A: "${q}"`).join('\n')}

Be specific with numbers, dates, and names. If something is uncertain, say so. Never make up statistics.`;

    const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate today's executive briefing cards. Include real-world context for ${today}.` }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Lovable API error:', error);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse JSON from response
    let cards: BriefingCard[] = [];
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        cards = parsed.cards || [];
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Generate fallback cards
      cards = generateFallbackCards(today);
    }

    // Add timestamps and IDs if missing
    cards = cards.map((card, index) => ({
      ...card,
      id: card.id || `card-${Date.now()}-${index}`,
      timestamp: card.timestamp || new Date().toISOString(),
    }));

    return new Response(
      JSON.stringify({ 
        success: true, 
        cards,
        generatedAt: new Date().toISOString(),
        questionsAnswered: selectedQuestions,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Briefing cards error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate briefing';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        cards: generateFallbackCards(new Date().toLocaleDateString()),
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateFallbackCards(date: string): BriefingCard[] {
  return [
    {
      id: 'fallback-1',
      category: 'current_events',
      title: 'Daily Brief',
      headline: 'Your briefing is loading',
      summary: 'We\'re gathering the latest intelligence for your review. Check back shortly for updated cards.',
      details: ['AI analysis in progress', 'Multiple sources being verified', 'Cards will refresh automatically'],
      sentiment: 'neutral',
      importance: 'medium',
      source: 'System',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'fallback-2',
      category: 'business',
      title: 'Markets',
      headline: 'Markets data loading',
      summary: 'Financial data is being compiled from multiple sources.',
      details: ['Stock indices updating', 'Currency rates syncing', 'Commodity prices loading'],
      sentiment: 'neutral',
      importance: 'medium',
      source: 'Financial APIs',
      timestamp: new Date().toISOString(),
    },
  ];
}
