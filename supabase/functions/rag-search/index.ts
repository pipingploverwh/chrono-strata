import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SearchRequest {
  query: string;
  matchThreshold?: number;
  matchCount?: number;
  filterEntity?: string;
  filterType?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Required environment variables not configured");
    }

    const {
      query,
      matchThreshold = 0.5,
      matchCount = 5,
      filterEntity,
      filterType,
    }: SearchRequest = await req.json();

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`RAG search for: "${query.substring(0, 50)}..."`);

    // Step 1: Generate query embedding
    const embeddingResponse = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: query.slice(0, 8000), // Limit query length
      }),
    });

    if (!embeddingResponse.ok) {
      if (embeddingResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded", documents: [] }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (embeddingResponse.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "Payment required", documents: [] }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("Failed to generate query embedding");
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data?.[0]?.embedding;

    if (!queryEmbedding) {
      throw new Error("Invalid embedding response");
    }

    // Step 2: Search documents using pgvector
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: documents, error: searchError } = await supabase.rpc("search_documents", {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
      filter_entity: filterEntity || null,
      filter_type: filterType || null,
    });

    if (searchError) {
      console.error("Document search error:", searchError);
      throw new Error("Failed to search documents");
    }

    console.log(`Found ${documents?.length || 0} relevant documents`);

    return new Response(
      JSON.stringify({
        success: true,
        documents: documents || [],
        query,
        matchCount: documents?.length || 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("RAG search error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        documents: [],
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
