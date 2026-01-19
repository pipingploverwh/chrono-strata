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

// Bose Psychoacoustic Engineering: Spatial Soundstage Positioning
function calculateSpatialSoundstage(lowFreq: number, midFreq: number, highFreq: number, energy: number) {
  const totalEnergy = lowFreq + midFreq + highFreq + 0.001;
  
  // Verticality: Map frequency bands to spatial height in the mix
  const subBassFoundation = lowFreq / totalEnergy; // 20Hz-60Hz felt presence
  const midPresence = midFreq / totalEnergy; // 200Hz-2kHz vocal clarity
  const airFrequencies = highFreq / totalEnergy; // 10kHz+ atmospheric shimmer
  
  // Width: Energy determines stereo field spread
  const stereoWidth = energy > 0.7 ? 'wide immersive stereo separation' : 
                      energy > 0.4 ? 'moderate stereo width with centered focus' : 
                      'intimate mono-compatible centered presence';
  
  // Depth: Calculate front-to-back positioning
  const depthPlacement = subBassFoundation > 0.4 ? 'deep rear-field sub-bass foundation' :
                         airFrequencies > 0.4 ? 'forward presence with airy top-end' :
                         'mid-field balanced positioning';
  
  return {
    verticality: {
      subBass: subBassFoundation,
      midRange: midPresence,
      airBand: airFrequencies
    },
    stereoWidth,
    depthPlacement,
    spatialDescriptor: `${stereoWidth}, ${depthPlacement}`
  };
}

// Bose Psychoacoustic Engineering: Temperature as Timbre
function calculateTemperatureTimbre(temperature: number) {
  // Normalize temperature to 0-1 scale (assuming -20°C to 80°C range)
  const normalizedTemp = Math.min(1, Math.max(0, (temperature + 20) / 100));
  
  if (normalizedTemp > 0.7) {
    // HEAT: Odd-order harmonic saturation (tube warmth)
    return {
      timbre: 'hot',
      saturation: 'dense analog tube saturation with odd-order harmonics',
      texture: 'thick, warm, harmonically rich with subtle compression',
      eqProfile: 'gentle high-shelf roll-off above 8kHz, boosted 2-4kHz presence',
      psychoacoustic: 'The sound feels dense and enveloping, like summer heat radiating from asphalt'
    };
  } else if (normalizedTemp > 0.4) {
    // WARM: Balanced harmonic content
    return {
      timbre: 'warm',
      saturation: 'gentle even-order harmonic enhancement',
      texture: 'smooth, inviting, naturally compressed dynamics',
      eqProfile: 'subtle smile curve with lifted lows and highs',
      psychoacoustic: 'Comfortable sonic warmth like afternoon sunlight through glass'
    };
  } else if (normalizedTemp > 0.15) {
    // COOL: Transient clarity emerging
    return {
      timbre: 'cool',
      saturation: 'minimal saturation, preserved transient attacks',
      texture: 'clean, articulate, precise dynamic response',
      eqProfile: 'flat response with enhanced transient definition',
      psychoacoustic: 'Crisp air that carries sound with crystalline precision'
    };
  } else {
    // COLD: Digital clarity and transient crispness
    return {
      timbre: 'cold',
      saturation: 'pristine digital clarity, zero harmonic distortion',
      texture: 'glassy, brittle, hyper-defined transients',
      eqProfile: 'boosted presence range 4-8kHz, surgical precision',
      psychoacoustic: 'The sound shatters like ice crystals, each transient a frozen needle'
    };
  }
}

// Bose Psychoacoustic Engineering: Dynamic Transient Response
function calculateDynamicResponse(energy: number, bpm: number, lowFreq: number) {
  // Transient preservation based on energy peaks
  const transientAttack = energy > 0.8 ? 'explosive attack with preserved peak dynamics' :
                          energy > 0.5 ? 'punchy attack with controlled compression' :
                          energy > 0.25 ? 'gentle attack with soft knee compression' :
                          'pillowy attack with heavily smoothed transients';
  
  // Decay characteristics based on tempo
  const decayResponse = bpm > 140 ? 'rapid decay for rhythmic clarity' :
                        bpm > 100 ? 'moderate decay with sustain tail' :
                        bpm > 60 ? 'extended decay with reverberant sustain' :
                        'infinite sustain with drone-like persistence';
  
  // Noise floor management (Bose ANC philosophy)
  const noiseFloor = energy < 0.1 ? 'velvet black silence with micro-texture detail' :
                     energy < 0.3 ? 'intimate close-mic presence, minimal room tone' :
                     'natural room ambience with controlled reflections';
  
  // Dynamic range based on bass energy (preserves kick drum impact)
  const dynamicRange = lowFreq > 0.5 ? 'wide dynamic range preserving sub-bass impact' :
                       'controlled dynamics with gentle limiting';
  
  return {
    transientAttack,
    decayResponse,
    noiseFloor,
    dynamicRange,
    dynamicDescriptor: `${transientAttack}, ${decayResponse}`
  };
}

// Bose Psychoacoustic Engineering: Reverb/Diffusion from "Humidity"
function calculateAcousticDiffusion(midFreq: number, energy: number) {
  // Treat mid-frequency energy as "humidity" - diffusion characteristic
  const humidity = midFreq;
  
  if (humidity > 0.6) {
    return {
      reverb: 'long decay dense reverb with high diffusion',
      character: 'humid atmospheric wash, sound molecules suspended in thick air',
      tailDensity: 'maximum reflection density, seamless decay',
      earlyReflections: 'diffuse early reflections simulating large humid space'
    };
  } else if (humidity > 0.35) {
    return {
      reverb: 'medium room reverb with natural diffusion',
      character: 'comfortable acoustic space with balanced reflections',
      tailDensity: 'moderate reflection density, natural decay curve',
      earlyReflections: 'realistic room early reflections'
    };
  } else {
    return {
      reverb: 'minimal reverb, dry intimate presence',
      character: 'close-mic intimacy, anechoic precision',
      tailDensity: 'sparse reflections, immediate decay',
      earlyReflections: 'near-field monitoring with minimal room interaction'
    };
  }
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

    // === BOSE PSYCHOACOUSTIC ANALYSIS ===
    
    // 1. Spatial Soundstage Positioning
    const soundstage = calculateSpatialSoundstage(lowFreq, midFreq, highFreq, energy);
    
    // 2. Temperature as Timbre
    const timbre = calculateTemperatureTimbre(temperature);
    
    // 3. Dynamic Transient Response
    const dynamics = calculateDynamicResponse(energy, bpm, lowFreq);
    
    // 4. Acoustic Diffusion (Humidity metaphor)
    const diffusion = calculateAcousticDiffusion(midFreq, energy);
    
    // Calculate thermal intensity for mood classification
    const thermalIntensity = Math.min(1, Math.max(0, (temperature + 15) / 100));
    
    // Determine mood with Bose-informed vocabulary
    let mood: string;
    if (thermalIntensity < 0.25) {
      mood = 'crystalline-ambient';
    } else if (thermalIntensity < 0.45) {
      mood = 'warm-presence';
    } else if (thermalIntensity < 0.7) {
      mood = 'saturated-energy';
    } else {
      mood = 'thermal-intensity';
    }

    // === CONSTRUCT BOSE-ENGINEERED PROMPT ===
    const prompt = `PSYCHOACOUSTIC THERMAL COMPOSITION

SOUNDSTAGE ARCHITECTURE:
- Spatial positioning: ${soundstage.spatialDescriptor}
- Vertical frequency mapping: Sub-bass foundation (${(soundstage.verticality.subBass * 100).toFixed(0)}%), Mid presence (${(soundstage.verticality.midRange * 100).toFixed(0)}%), Air frequencies (${(soundstage.verticality.airBand * 100).toFixed(0)}%)
- Depth: ${soundstage.depthPlacement}

THERMAL TIMBRE (${temperature.toFixed(1)}°C):
- Character: ${timbre.timbre} - ${timbre.saturation}
- Texture: ${timbre.texture}
- EQ Profile: ${timbre.eqProfile}
- Psychoacoustic feel: ${timbre.psychoacoustic}

DYNAMIC RESPONSE:
- Attack: ${dynamics.transientAttack}
- Decay: ${dynamics.decayResponse}
- Noise floor: ${dynamics.noiseFloor}
- Dynamic range: ${dynamics.dynamicRange}

ACOUSTIC DIFFUSION:
- Reverb: ${diffusion.reverb}
- Space character: ${diffusion.character}
- Tail density: ${diffusion.tailDensity}

TEMPO: ${bpm > 0 ? `${bpm} BPM` : 'Freeform'}
ENERGY: ${(energy * 100).toFixed(0)}%

Create a ${mood} ambient layer with lifelike acoustic physics. The sound must feel real—reflections, absorption, and diffraction mimicking how sound moves through thermal gradients. Prioritize intelligibility and ear comfort over volume.

Source: ${fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')}`;

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

    // Determine frequency profile from soundstage analysis
    const frequencyProfile = soundstage.verticality.subBass > 0.4 ? 'bass-heavy' : 
                             soundstage.verticality.airBand > 0.4 ? 'treble-heavy' : 'balanced';

    return new Response(
      JSON.stringify({ 
        success: true, 
        audioContent: base64Audio,
        mood,
        analysis: {
          thermalIntensity: thermalIntensity.toFixed(2),
          frequencyProfile,
          tempoFeel: dynamics.decayResponse,
          emotionalTone: timbre.psychoacoustic,
          // Bose psychoacoustic metadata
          boseEngineering: {
            soundstage: {
              stereoWidth: soundstage.stereoWidth,
              depthPlacement: soundstage.depthPlacement,
              verticality: soundstage.verticality
            },
            timbre: {
              character: timbre.timbre,
              saturation: timbre.saturation,
              texture: timbre.texture
            },
            dynamics: {
              attack: dynamics.transientAttack,
              decay: dynamics.decayResponse,
              noiseFloor: dynamics.noiseFloor
            },
            diffusion: {
              reverb: diffusion.reverb,
              spaceCharacter: diffusion.character
            }
          }
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
