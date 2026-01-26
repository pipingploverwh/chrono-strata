import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// News topics to search for - configurable
const NEWS_TOPICS = [
  'artificial intelligence business news',
  'technology startup funding',
  'enterprise software market',
  'fintech regulation updates',
  'climate technology innovation',
];

interface NewsResult {
  title: string;
  url: string;
  description: string;
  markdown?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body = await req.json().catch(() => ({}));
    const topics = body.topics || NEWS_TOPICS;
    const maxPerTopic = body.maxPerTopic || 3;

    console.log(`Starting news indexer for ${topics.length} topics`);

    let totalIndexed = 0;
    let totalSkipped = 0;
    const errors: string[] = [];

    for (const topic of topics) {
      console.log(`Searching news for: ${topic}`);

      try {
        // Fetch news using Firecrawl search
        let newsResults: NewsResult[] = [];

        if (FIRECRAWL_API_KEY) {
          const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: topic,
              limit: maxPerTopic,
              tbs: 'qdr:d', // Last 24 hours
              scrapeOptions: {
                formats: ['markdown'],
              },
            }),
          });

          if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            newsResults = (searchData.data || []).map((item: any) => ({
              title: item.title || 'Untitled',
              url: item.url,
              description: item.description || '',
              markdown: item.markdown,
            }));
          } else {
            console.warn(`Firecrawl search failed for "${topic}":`, await searchResponse.text());
          }
        } else {
          console.log('FIRECRAWL_API_KEY not configured, skipping external news fetch');
        }

        // Process each news result
        for (const news of newsResults) {
          try {
            // Check if already indexed (by URL)
            const { data: existing } = await supabase
              .from('intelligence_documents')
              .select('id')
              .eq('source_url', news.url)
              .maybeSingle();

            if (existing) {
              console.log(`Skipping duplicate: ${news.url}`);
              totalSkipped++;
              continue;
            }

            // Prepare content
            const content = news.markdown || news.description || '';
            if (!content || content.length < 100) {
              console.log(`Skipping low-content article: ${news.title}`);
              totalSkipped++;
              continue;
            }

            // Insert document
            const { data: docData, error: insertError } = await supabase
              .from('intelligence_documents')
              .insert({
                title: news.title.slice(0, 255),
                processed_text: content.slice(0, 50000), // Limit content size
                raw_content: content,
                content_type: 'news',
                entity: 'general',
                authority: 'informational',
                source_name: new URL(news.url).hostname,
                source_url: news.url,
                document_date: new Date().toISOString().split('T')[0],
              })
              .select()
              .single();

            if (insertError) {
              console.error(`Insert error for ${news.title}:`, insertError);
              errors.push(`Insert: ${news.title}`);
              continue;
            }

            // Generate embedding
            if (LOVABLE_API_KEY && docData?.id) {
              try {
                const embeddingResponse = await fetch('https://ai.gateway.lovable.dev/v1/embeddings', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${LOVABLE_API_KEY}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    model: 'text-embedding-3-small',
                    input: content.slice(0, 30000),
                  }),
                });

                if (embeddingResponse.ok) {
                  const embeddingData = await embeddingResponse.json();
                  const embedding = embeddingData.data?.[0]?.embedding;

                  if (embedding) {
                    const embeddingStr = `[${embedding.join(',')}]`;
                    await supabase
                      .from('intelligence_documents')
                      .update({ embedding: embeddingStr })
                      .eq('id', docData.id);
                    
                    console.log(`Indexed: ${news.title}`);
                    totalIndexed++;
                  }
                } else {
                  console.warn(`Embedding failed for ${news.title}`);
                  errors.push(`Embedding: ${news.title}`);
                }
              } catch (embedErr) {
                console.error(`Embedding error:`, embedErr);
                errors.push(`Embedding: ${news.title}`);
              }
            } else {
              totalIndexed++;
              console.log(`Inserted without embedding: ${news.title}`);
            }
          } catch (newsErr) {
            console.error(`Error processing news item:`, newsErr);
            errors.push(`Process: ${news.title}`);
          }
        }
      } catch (topicErr) {
        console.error(`Error fetching topic "${topic}":`, topicErr);
        errors.push(`Topic: ${topic}`);
      }
    }

    const summary = {
      success: true,
      indexed: totalIndexed,
      skipped: totalSkipped,
      errors: errors.length,
      errorDetails: errors.slice(0, 10),
      timestamp: new Date().toISOString(),
    };

    console.log('News indexer complete:', summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('News indexer error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
