import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmbeddingRequest {
  documentId?: string;
  text: string;
  metadata?: {
    title?: string;
    contentType?: string;
    entity?: string;
    authority?: string;
    sourceUrl?: string;
    sourceName?: string;
  };
  storeInDb?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { documentId, text, metadata, storeInDb = false }: EmbeddingRequest = await req.json();

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Text is required for embedding generation" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Truncate text to prevent token overflow (roughly 8000 tokens max for embedding)
    const truncatedText = text.slice(0, 30000);
    
    console.log(`Generating embedding for ${truncatedText.length} characters...`);

    // Generate embedding via Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: truncatedText,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "Payment required. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Embedding API error:", response.status, errorText);
      throw new Error(`Embedding API error: ${response.status}`);
    }

    const data = await response.json();
    const embedding = data.data?.[0]?.embedding;

    if (!embedding || !Array.isArray(embedding)) {
      throw new Error("Invalid embedding response");
    }

    console.log(`Generated embedding with ${embedding.length} dimensions`);

    // Optionally store in database
    if (storeInDb && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      const documentData = {
        id: documentId,
        title: metadata?.title || "Untitled Document",
        content_type: metadata?.contentType || "briefing",
        entity: metadata?.entity || "general",
        authority: metadata?.authority || "informational",
        processed_text: truncatedText,
        source_url: metadata?.sourceUrl,
        source_name: metadata?.sourceName,
        embedding: embedding,
        updated_at: new Date().toISOString(),
      };

      const { data: upsertData, error: upsertError } = await supabase
        .from("intelligence_documents")
        .upsert(documentData, { onConflict: "id" })
        .select("id")
        .single();

      if (upsertError) {
        console.error("Database upsert error:", upsertError);
        // Continue - we still return the embedding even if DB storage fails
      } else {
        console.log("Document stored with ID:", upsertData?.id);
      }

      return new Response(
        JSON.stringify({
          success: true,
          embedding,
          dimensions: embedding.length,
          documentId: upsertData?.id || documentId,
          stored: !upsertError,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        embedding,
        dimensions: embedding.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Embedding generation error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
