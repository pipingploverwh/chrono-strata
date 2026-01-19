import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RenderRequest {
  ledColor: string;
  surfaceFinish: string;
  accessories: string[];
  stage: 'led' | 'surface' | 'accessories' | 'final';
}

const LED_COLORS: Record<string, string> = {
  emerald: "emerald green glowing LED strips",
  amber: "warm amber gold LED lighting",
  arctic: "cool arctic blue LED illumination",
  royal: "deep royal purple LED accents",
  white: "pure white clinical LED lighting",
  rgb: "rainbow RGB cycling LED effects",
};

const SURFACE_FINISHES: Record<string, string> = {
  carbon: "matte black carbon fiber weave texture",
  aluminum: "brushed silver aluminum industrial finish",
  walnut: "rich dark black walnut wood veneer grain",
  marble: "white Italian Calacatta marble with emerald veining",
  titanium: "grade 5 titanium composite metallic surface",
  rubber: "recycled rubber terrazzo with emerald flecks",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const { ledColor, surfaceFinish, accessories, stage }: RenderRequest = await req.json();

    // Build descriptive prompt based on configuration
    const ledDesc = LED_COLORS[ledColor] || "emerald green LED";
    const surfaceDesc = SURFACE_FINISHES[surfaceFinish] || "carbon fiber";
    
    const accessoryList = accessories.length > 0 
      ? accessories.map(a => {
          switch(a) {
            case 'strata-pro': return 'high-end OLED weather displays';
            case 'vinyl-rack': return 'integrated vinyl record storage';
            case 'cable-management': return 'premium gold cable routing';
            case 'road-case': return 'professional flight case';
            case 'brass-accents': return 'polished brass trim details';
            case 'rgb-underglow': return 'ambient underglow base lighting';
            default: return '';
          }
        }).filter(Boolean).join(', ')
      : 'standard equipment';

    let prompt = '';
    switch(stage) {
      case 'led':
        prompt = `Professional product render of a luxury DJ console with ${ledDesc}, dramatic studio lighting, dark moody background, 16:9 aspect ratio, ultra high resolution, photorealistic 3D render, the LED accents glowing brilliantly against dark surfaces`;
        break;
      case 'surface':
        prompt = `Professional product render of a luxury DJ console featuring ${surfaceDesc} top surface, ${ledDesc} accents, premium materials showcase, dark studio environment, 16:9 aspect ratio, ultra high resolution, photorealistic detail on material textures`;
        break;
      case 'accessories':
        prompt = `Professional product render of a fully equipped luxury DJ console with ${accessoryList}, ${surfaceDesc} surface, ${ledDesc}, showing all premium accessories, dark elegant studio, 16:9 aspect ratio, ultra high resolution`;
        break;
      case 'final':
        prompt = `Cinematic hero shot of the ultimate luxury DJ console: ${surfaceDesc} top, ${ledDesc} illumination, equipped with ${accessoryList}. Premium product photography, dramatic rim lighting, dark moody studio, smoke effects, 16:9 aspect ratio, ultra high resolution, magazine-quality render`;
        break;
    }

    console.log(`Generating ${stage} render with prompt:`, prompt);

    // Call Lovable AI to generate image
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      throw new Error(`AI generation failed: ${response.status}`);
    }

    const data = await response.json();
    const imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageData) {
      throw new Error("No image generated");
    }

    // Upload to Supabase storage for caching
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Convert base64 to blob
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const fileName = `renders/${Date.now()}-${stage}-${ledColor}-${surfaceFinish}.png`;
    
    const { error: uploadError } = await supabase.storage
      .from('configuration-assets')
      .upload(fileName, imageBytes, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      // Return base64 as fallback
      return new Response(JSON.stringify({ 
        imageUrl: imageData,
        cached: false,
        stage 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('configuration-assets')
      .getPublicUrl(fileName);

    return new Response(JSON.stringify({ 
      imageUrl: publicUrl,
      cached: true,
      stage,
      fileName
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Render generation error:", error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
