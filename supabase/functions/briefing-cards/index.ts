import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
  sourceUrl?: string;
  timestamp: string;
  actionItems?: string[];
  relatedTopics?: string[];
  ragContext?: boolean; // Flag if RAG-grounded
}

interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
}

interface RagDocument {
  id: string;
  title: string;
  processed_text: string;
  document_date: string;
  entity: string;
  authority: string;
  source_name: string;
  similarity: number;
}

// Fetch real news from multiple topics using Firecrawl
async function fetchRealNews(apiKey: string): Promise<NewsItem[]> {
  const topics = [
    "breaking news today headlines",
    "stock market business news today",
    "US economic policy news",
    "tech industry layoffs earnings",
    "crypto bitcoin market news"
  ];

  const allNews: NewsItem[] = [];

  // Fetch news for each topic in parallel
  const results = await Promise.allSettled(
    topics.map(async (topic) => {
      try {
        const response = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: topic,
            limit: 3,
            tbs: "qdr:d", // Last 24 hours for fresh news
          }),
        });

        if (!response.ok) {
          console.error(`Firecrawl error for "${topic}":`, response.status);
          return [];
        }

        const data = await response.json();
        return (data.data || []).map((item: any) => ({
          title: item.title || "Untitled",
          description: item.description || "",
          url: item.url || "",
          source: item.url ? new URL(item.url).hostname.replace("www.", "") : "Unknown",
        }));
      } catch (err) {
        console.error(`Error fetching news for "${topic}":`, err);
        return [];
      }
    })
  );

  // Collect successful results
  for (const result of results) {
    if (result.status === 'fulfilled') {
      allNews.push(...result.value);
    }
  }

  console.log(`Fetched ${allNews.length} real news items`);
  return allNews;
}

// RAG: Fetch relevant documents for context grounding
// Supports both semantic search (with embeddings) and keyword fallback
async function fetchRagContext(
  query: string, 
  lovableApiKey: string, 
  supabaseUrl: string, 
  supabaseKey: string
): Promise<RagDocument[]> {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('Fetching RAG context for briefing...');
    
    // Try semantic search first with embeddings
    const embeddingResponse = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: query.slice(0, 8000),
      }),
    });

    if (embeddingResponse.ok) {
      const embeddingData = await embeddingResponse.json();
      const queryEmbedding = embeddingData.data?.[0]?.embedding;

      if (queryEmbedding) {
        const { data: documents, error } = await supabase.rpc("search_documents", {
          query_embedding: queryEmbedding,
          match_threshold: 0.4,
          match_count: 8,
          filter_entity: null,
          filter_type: null,
        });

        if (!error && documents?.length > 0) {
          console.log(`RAG (semantic): Found ${documents.length} relevant documents`);
          return documents;
        }
      }
    } else {
      console.log('Embedding API unavailable, falling back to keyword search');
    }
    
    // Fallback: Fetch recent documents directly (keyword/recency-based)
    console.log('Using recency-based document retrieval...');
    const { data: recentDocs, error: recentError } = await supabase
      .from('intelligence_documents')
      .select('id, title, processed_text, document_date, entity, authority, source_name, source_url')
      .not('processed_text', 'is', null)
      .order('document_date', { ascending: false })
      .limit(10);

    if (recentError) {
      console.error('Recent docs fetch error:', recentError);
      return [];
    }

    // Filter for relevant content (simple keyword matching)
    const keywords = ['market', 'policy', 'tech', 'ai', 'economy', 'funding', 'fintech', 'startup', 'business'];
    const relevantDocs = (recentDocs || [])
      .filter(doc => {
        const text = (doc.processed_text || '').toLowerCase();
        const title = (doc.title || '').toLowerCase();
        return keywords.some(kw => text.includes(kw) || title.includes(kw));
      })
      .slice(0, 6)
      .map(doc => ({
        ...doc,
        similarity: 0.6, // Placeholder for keyword matches
      }));

    console.log(`RAG (keyword): Found ${relevantDocs.length} relevant documents`);
    return relevantDocs as RagDocument[];
  } catch (err) {
    console.error('RAG context error:', err);
    return []; // Graceful degradation
  }
}

// Format RAG documents for AI context
function formatRagContext(documents: RagDocument[]): string {
  if (documents.length === 0) {
    return "";
  }

  const formatted = documents
    .map((doc, i) => `
[Document ${i + 1}] (Relevance: ${(doc.similarity * 100).toFixed(1)}%)
Title: ${doc.title}
Date: ${doc.document_date}
Authority: ${doc.authority}
Source: ${doc.source_name || 'Internal'}
Content: ${doc.processed_text?.slice(0, 1500) || 'No content'}
---`)
    .join('\n');

  return `\n=== INTELLIGENCE DOCUMENT CONTEXT ===
${formatted}
=== END DOCUMENT CONTEXT ===\n`;
}

// Format news items for the AI prompt
function formatNewsContext(newsItems: NewsItem[]): string {
  if (newsItems.length === 0) {
    return "No live news data available. Generate cards based on current knowledge.";
  }

  const formatted = newsItems
    .slice(0, 15) // Limit to prevent token overflow
    .map((item, i) => `${i + 1}. [${item.source}] ${item.title}\n   ${item.description}`)
    .join('\n\n');

  return `LIVE NEWS FEED (use these as primary sources):\n\n${formatted}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location } = await req.json();
    
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // Fetch real news if Firecrawl is configured
    let newsItems: NewsItem[] = [];
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    
    if (FIRECRAWL_API_KEY) {
      console.log('Fetching live news via Firecrawl...');
      newsItems = await fetchRealNews(FIRECRAWL_API_KEY);
    } else {
      console.log('FIRECRAWL_API_KEY not configured, skipping live news');
    }

    // RAG: Fetch relevant intelligence documents for context grounding
    let ragDocuments: RagDocument[] = [];
    if (LOVABLE_API_KEY && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      ragDocuments = await fetchRagContext(
        "current events, market analysis, policy developments, economic trends",
        LOVABLE_API_KEY,
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY
      );
    }

    const newsContext = formatNewsContext(newsItems);
    const ragContext = formatRagContext(ragDocuments);

    const systemPrompt = `You are a presidential briefing assistant creating Morning Brew-style intelligence cards. Today is ${today}. User location: ${location || 'United States'}.

${newsContext}
${ragContext}

STYLE GUIDE (Morning Brew inspired):
- Write like you're texting a smart friend who's short on time
- Lead with the "so what" - why should they care?
- Use conversational language, not corporate speak
- Include a dash of wit when appropriate
- Keep it scannable with bullet points
- Always cite the actual source from the news feed or document context
- If using INTELLIGENCE DOCUMENT CONTEXT, set "ragContext": true on that card

Generate exactly 8 briefing cards in this JSON format:
{
  "cards": [
    {
      "id": "unique-id",
      "category": "current_events|business|weather|question|policy",
      "title": "2-3 word punchy title",
      "headline": "One zingy sentence (max 12 words)",
      "summary": "2-3 sentences explaining why this matters. Be specific, cite sources.",
      "details": ["Key point 1", "Key point 2", "Key point 3"],
      "sentiment": "positive|neutral|negative|mixed",
      "importance": "high|medium|low",
      "source": "Publication name from news feed or document",
      "sourceUrl": "URL from news feed if available",
      "ragContext": false,
      "actionItems": ["What to watch", "What to do"],
      "relatedTopics": ["Related topic 1", "Related topic 2"]
    }
  ]
}

REQUIRED CARDS (generate from the LIVE NEWS FEED and INTELLIGENCE DOCUMENTS above):
1. TOP STORY: The single most important story from the news feed
2. MARKET PULSE: Stock market and financial news from the feed
3. TECH & BUSINESS: Major tech or corporate news from the feed
4. POLICY WATCH: Government or regulatory developments
5. ECONOMY: Jobs, inflation, consumer trends
6. WILD CARD: Something unexpected or interesting from the feed
7. CRYPTO/FINTECH: Digital assets or financial technology news
8. EDITOR'S PICK: A story that deserves attention but might be missed

IMPORTANT: Base your cards on the ACTUAL news items and documents provided above. Do not invent stories. If a category has no news, note that briefly.`;

    if (!LOVABLE_API_KEY) {
      console.log('No Lovable API key configured, using fallback cards');
      return new Response(
        JSON.stringify({ 
          success: true, 
          cards: generateFallbackCards(today),
          generatedAt: new Date().toISOString(),
          newsItemsUsed: newsItems.length,
          ragDocsUsed: ragDocuments.length,
          source: 'fallback',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate today's executive briefing cards based on the live news feed. Make it Morning Brew style - punchy, informative, with personality.` }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI API error:', error);
      
      // Generate cards from real data when AI is unavailable
      const realDataCards = generateCardsFromRealData(newsItems, ragDocuments, today);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          cards: realDataCards.length > 0 ? realDataCards : generateFallbackCards(today),
          generatedAt: new Date().toISOString(),
          newsItemsUsed: newsItems.length,
          ragDocsUsed: ragDocuments.length,
          source: realDataCards.length > 0 ? 'real-data-fallback' : 'static-fallback',
          note: 'AI temporarily unavailable - using indexed data',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
      cards = generateFallbackCards(today);
    }

    // Add timestamps and IDs if missing
    cards = cards.map((card, index) => ({
      ...card,
      id: card.id || `card-${Date.now()}-${index}`,
      timestamp: card.timestamp || new Date().toISOString(),
    }));

    console.log(`Generated ${cards.length} briefing cards from ${newsItems.length} news items + ${ragDocuments.length} RAG docs`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        cards,
        generatedAt: new Date().toISOString(),
        newsItemsUsed: newsItems.length,
        ragDocsUsed: ragDocuments.length,
        source: newsItems.length > 0 ? 'live' : ragDocuments.length > 0 ? 'rag-grounded' : 'ai-generated',
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

// Generate cards from real indexed data when AI is unavailable
function generateCardsFromRealData(
  newsItems: NewsItem[], 
  ragDocuments: RagDocument[], 
  date: string
): BriefingCard[] {
  const cards: BriefingCard[] = [];
  const now = new Date().toISOString();
  
  // Categorize news items by keyword matching
  const categoryKeywords = {
    business: ['stock', 'market', 'earnings', 'ceo', 'company', 'revenue', 'profit', 'startup', 'funding'],
    policy: ['policy', 'regulation', 'government', 'fed', 'congress', 'tariff', 'tax', 'law'],
    current_events: ['breaking', 'crisis', 'election', 'war', 'disaster', 'climate'],
    question: ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'defi', 'nft'],
  };

  function categorize(text: string): BriefingCard['category'] {
    const lowerText = text.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(kw => lowerText.includes(kw))) {
        return category as BriefingCard['category'];
      }
    }
    return 'current_events';
  }

  function extractSentiment(text: string): BriefingCard['sentiment'] {
    const lowerText = text.toLowerCase();
    const positiveWords = ['surge', 'rally', 'growth', 'record', 'success', 'boost', 'gain'];
    const negativeWords = ['crash', 'decline', 'fall', 'crisis', 'risk', 'concern', 'drop'];
    
    const hasPositive = positiveWords.some(w => lowerText.includes(w));
    const hasNegative = negativeWords.some(w => lowerText.includes(w));
    
    if (hasPositive && hasNegative) return 'mixed';
    if (hasPositive) return 'positive';
    if (hasNegative) return 'negative';
    return 'neutral';
  }

  // Create cards from news items
  const usedUrls = new Set<string>();
  for (const news of newsItems.slice(0, 5)) {
    if (usedUrls.has(news.url)) continue;
    usedUrls.add(news.url);
    
    const title = news.title.length > 40 ? news.title.slice(0, 40) + '...' : news.title;
    const cleanTitle = news.title.split(' ').slice(0, 3).join(' ');
    
    cards.push({
      id: `news-${cards.length}-${Date.now()}`,
      category: categorize(news.title + ' ' + news.description),
      title: cleanTitle,
      headline: title,
      summary: news.description || `Breaking news from ${news.source}. Click through for full coverage.`,
      details: [
        `Source: ${news.source}`,
        `Today's top story in this category`,
        'Real-time intelligence'
      ],
      sentiment: extractSentiment(news.title + ' ' + news.description),
      importance: cards.length < 2 ? 'high' : 'medium',
      source: news.source,
      sourceUrl: news.url,
      timestamp: now,
      ragContext: false,
    });
  }

  // Create cards from RAG documents
  for (const doc of ragDocuments.slice(0, 3)) {
    if (!doc.processed_text || doc.processed_text.length < 100) continue;
    
    // Clean the text - remove markdown links, images, and other artifacts
    const cleanText = (doc.processed_text || '')
      .replace(/\[.*?\]\(.*?\)/g, '') // Remove markdown links
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
      .replace(/\n+/g, ' ') // Normalize newlines
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
    
    // Extract first meaningful sentence (min 50 chars, doesn't start with common noise)
    const sentences = cleanText
      .split(/[.!?]/)
      .map(s => s.trim())
      .filter(s => s.length > 50 && !s.toLowerCase().startsWith('skip to') && !s.toLowerCase().startsWith('we use'))
      .slice(0, 3);
    
    if (sentences.length === 0) continue;
    
    const summary = sentences[0] || doc.title;
    const details = sentences.slice(1, 3).filter(Boolean);
    
    cards.push({
      id: `rag-${cards.length}-${Date.now()}`,
      category: categorize(doc.title + ' ' + cleanText.slice(0, 500)),
      title: doc.title.split(' ').slice(0, 3).join(' '),
      headline: doc.title.length > 60 ? doc.title.slice(0, 60) + '...' : doc.title,
      summary: summary.slice(0, 250),
      details: details.length > 0 ? details.map(d => d.slice(0, 120)) : [
        `From: ${doc.source_name || 'Intelligence Archive'}`,
        `Authority: ${doc.authority || 'Informational'}`,
        `Date: ${doc.document_date || 'Recent'}`
      ],
      sentiment: extractSentiment(doc.title + ' ' + summary),
      importance: (doc.similarity || 0.6) > 0.7 ? 'high' : 'medium',
      source: doc.source_name || 'Intelligence Archive',
      timestamp: now,
      ragContext: true,
    });
  }

  console.log(`Generated ${cards.length} cards from ${newsItems.length} news + ${ragDocuments.length} RAG docs`);
  return cards;
}

function generateFallbackCards(date: string): BriefingCard[] {
  return [
    {
      id: 'fallback-1',
      category: 'current_events',
      title: 'Markets Rally',
      headline: 'S&P 500 continues upward momentum',
      summary: 'U.S. equity markets are showing strength with the S&P 500 trading near all-time highs. Tech stocks are leading gains.',
      details: ['S&P 500 up 0.3% in early trading', 'NASDAQ outperforming with 0.5% gain', 'VIX remains low indicating calm markets'],
      sentiment: 'positive',
      importance: 'high',
      source: 'Market Data',
      timestamp: new Date().toISOString(),
      actionItems: ['Monitor tech sector earnings', 'Watch for Fed commentary'],
    },
    {
      id: 'fallback-2',
      category: 'business',
      title: 'Tech Earnings',
      headline: 'Major tech companies report this week',
      summary: 'Several large-cap technology companies are scheduled to report quarterly earnings, which could move markets significantly.',
      details: ['Earnings season in full swing', 'AI-related revenue in focus', 'Guidance for next quarter key'],
      sentiment: 'neutral',
      importance: 'high',
      source: 'Corporate Calendar',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'fallback-3',
      category: 'policy',
      title: 'Fed Watch',
      headline: 'Interest rate decision looms',
      summary: 'The Federal Reserve is expected to maintain current rates. Markets are pricing in potential cuts later this year.',
      details: ['Current rate at 5.25-5.50%', 'Inflation trending toward 2% target', 'Labor market remains resilient'],
      sentiment: 'neutral',
      importance: 'medium',
      source: 'Federal Reserve',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'fallback-4',
      category: 'weather',
      title: 'Weather Clear',
      headline: 'No major disruptions expected',
      summary: 'Weather conditions across major business corridors are favorable. No significant travel disruptions anticipated.',
      details: ['East Coast clear and mild', 'West Coast dry conditions', 'Midwest experiencing normal winter'],
      sentiment: 'positive',
      importance: 'low',
      source: 'NOAA',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'fallback-5',
      category: 'question',
      title: 'Bitcoin Update',
      headline: 'Crypto markets stable around $100K',
      summary: 'Bitcoin is trading near $100,000 with institutional interest remaining strong following ETF approvals.',
      details: ['BTC holding above key support levels', 'ETF inflows continue', 'Regulatory clarity improving'],
      sentiment: 'positive',
      importance: 'medium',
      source: 'Crypto Markets',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'fallback-6',
      category: 'business',
      title: 'AI Investment',
      headline: 'Tech giants double down on AI',
      summary: 'Major technology companies continue massive investments in AI infrastructure and model development.',
      details: ['Data center buildout accelerating', 'Chip demand remains elevated', 'Enterprise AI adoption growing'],
      sentiment: 'positive',
      importance: 'high',
      source: 'Industry Analysis',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'fallback-7',
      category: 'current_events',
      title: 'Global Trade',
      headline: 'Tariff discussions intensify',
      summary: 'Trade policy remains a key focus as major economies negotiate new agreements and tariff structures.',
      details: ['US-China talks ongoing', 'EU trade relations evolving', 'Supply chain diversification continues'],
      sentiment: 'mixed',
      importance: 'high',
      source: 'Trade Policy',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'fallback-8',
      category: 'policy',
      title: "Editor's Pick",
      headline: 'Infrastructure spending accelerates',
      summary: 'Federal infrastructure investments are flowing to states, boosting construction and manufacturing sectors.',
      details: ['Bridge and highway projects surge', 'Clean energy investments growing', 'Job creation in focus'],
      sentiment: 'positive',
      importance: 'medium',
      source: 'Government Data',
      timestamp: new Date().toISOString(),
    },
  ];
}
