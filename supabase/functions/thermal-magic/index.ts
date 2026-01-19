import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MagicRequest {
  temperature: number;
  energy: number;
  lowFreq: number;
  midFreq: number;
  highFreq: number;
  bpm: number;
  fileName: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { temperature, energy, lowFreq, midFreq, highFreq, bpm, fileName }: MagicRequest = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not configured');
    }

    // Analyze thermal data to determine music characteristics
    const thermalIntensity = Math.min(1, Math.max(0, (temperature + 15) / 100));
    const isBassHeavy = lowFreq > midFreq && lowFreq > highFreq;
    const isTrebleHeavy = highFreq > midFreq && highFreq > lowFreq;
    const isBalanced = !isBassHeavy && !isTrebleHeavy;
    
    // Determine mood based on thermal analysis
    let mood: string;
    let emotionalTone: string;
    
    if (thermalIntensity < 0.3) {
      mood = 'ambient';
      emotionalTone = 'ethereal, floating, crystalline cold';
    } else if (thermalIntensity < 0.5) {
      mood = 'warm';
      emotionalTone = 'comfortable warmth, gentle glow, soft radiance';
    } else if (thermalIntensity < 0.7) {
      mood = 'energetic';
      emotionalTone = 'pulsing heat, vibrant energy, dancing flames';
    } else {
      mood = 'intense';
      emotionalTone = 'blazing intensity, white-hot passion, volcanic power';
    }

    // Build frequency characteristics
    let frequencyCharacter: string;
    if (isBassHeavy) {
      frequencyCharacter = 'deep rumbling bass, subterranean vibrations, powerful low-end';
    } else if (isTrebleHeavy) {
      frequencyCharacter = 'shimmering highs, sparkling overtones, crystalline textures';
    } else {
      frequencyCharacter = 'balanced harmonic spectrum, rich mid-range, full-bodied';
    }

    // Determine tempo feel
    let tempoFeel: string;
    if (bpm < 80) {
      tempoFeel = 'slow, meditative, breathing';
    } else if (bpm < 110) {
      tempoFeel = 'moderate groove, walking pace, relaxed';
    } else if (bpm < 140) {
      tempoFeel = 'energetic, driving, danceable';
    } else {
      tempoFeel = 'fast, intense, racing';
    }

    // Construct the AI prompt
    const prompt = `Thermal resonance music: ${emotionalTone}. 
${frequencyCharacter}. 
Tempo: ${bpm > 0 ? `${bpm} BPM, ${tempoFeel}` : tempoFeel}. 
Temperature-reactive soundscape that captures the essence of ${temperature.toFixed(0)}°C thermal energy. 
Energy level: ${(energy * 100).toFixed(0)}%.
Inspired by: ${fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')}.
Create a complementary ambient layer that breathes with the original track's thermal signature.`;

    console.log(`Generating thermal magic with temperature: ${temperature.toFixed(1)}°C, energy: ${(energy * 100).toFixed(0)}%`);
    console.log(`Mood: ${mood}`);
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
    
    console.log('Thermal magic generated successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        audioContent: base64Audio,
        mood,
        analysis: {
          thermalIntensity: thermalIntensity.toFixed(2),
          frequencyProfile: isBassHeavy ? 'bass-heavy' : isTrebleHeavy ? 'treble-heavy' : 'balanced',
          tempoFeel,
          emotionalTone,
        },
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
    console.error('Error generating thermal magic:', errorMessage);
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
