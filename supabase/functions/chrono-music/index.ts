import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mood = 'energetic' } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not configured');
    }

    // Generate disco house Japanese-inspired music
    const prompts: Record<string, string> = {
      energetic: 'Upbeat Japanese city pop disco house music with funky bassline, bright synthesizers, and groovy drums. Inspired by Tokyo nightlife, 120 BPM, energetic and danceable.',
      chill: 'Smooth Japanese jazz house fusion with mellow piano chords, soft disco strings, and relaxed groove. Tokyo sunset vibes, 105 BPM, warm and sophisticated.',
      deep: 'Deep house with Japanese koto samples, hypnotic bassline, and subtle disco influences. Underground Tokyo club atmosphere, 118 BPM, minimal and atmospheric.',
      vintage: 'Retro 80s Japanese disco with analog synths, funky slap bass, and vintage drum machines. Shibuya style, 115 BPM, nostalgic and groovy.',
    };

    const prompt = prompts[mood] || prompts.energetic;
    console.log(`Generating music with mood: ${mood}`);
    console.log(`Prompt: ${prompt}`);

    const response = await fetch('https://api.elevenlabs.io/v1/music', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        duration_seconds: 30,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = base64Encode(audioBuffer);
    
    console.log('Music generated successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        audioContent: base64Audio,
        mood,
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error generating music:', errorMessage);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
