import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { lat, lon } = await req.json();
    
    // Default to Gillette Stadium (Foxborough, MA)
    const latitude = lat || 42.0909;
    const longitude = lon || -71.2643;

    // Fetch current weather from Open-Meteo
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America/New_York&forecast_days=1`
    );

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();
    
    // Extract current conditions
    const current = data.current;
    const hourly = data.hourly;
    
    // Get wind direction as compass bearing
    const windDir = current.wind_direction_10m;
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const windDirection = directions[Math.round(windDir / 22.5) % 16];

    // Weather code to condition
    const weatherCodes: Record<number, string> = {
      0: 'Clear',
      1: 'Mainly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Freezing Fog',
      51: 'Light Drizzle',
      53: 'Moderate Drizzle',
      55: 'Dense Drizzle',
      61: 'Light Rain',
      63: 'Moderate Rain',
      65: 'Heavy Rain',
      71: 'Light Snow',
      73: 'Moderate Snow',
      75: 'Heavy Snow',
      77: 'Snow Grains',
      80: 'Light Showers',
      81: 'Moderate Showers',
      82: 'Heavy Showers',
      85: 'Light Snow Showers',
      86: 'Heavy Snow Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm w/ Hail',
      99: 'Severe Thunderstorm',
    };

    const condition = weatherCodes[current.weather_code] || 'Unknown';
    
    // Determine field condition based on temp and precipitation
    let fieldCondition = 'Good';
    if (current.temperature_2m < 32) {
      fieldCondition = 'Frozen Turf';
    } else if (current.precipitation > 0.1) {
      fieldCondition = 'Wet';
    } else if (current.temperature_2m > 85) {
      fieldCondition = 'Hot Surface';
    }

    // Calculate route adjustments based on weather
    const windSpeed = current.wind_speed_10m;
    const temp = current.temperature_2m;
    
    // Short route bonus/penalty based on conditions
    const shortRouteAdjustment = Math.round((windSpeed > 15 ? 12 : windSpeed > 10 ? 6 : 0) + (temp < 40 ? 5 : 0));
    const deepRouteAdjustment = -Math.round((windSpeed > 15 ? 8 : windSpeed > 10 ? 4 : 0) + (temp < 40 ? 4 : 0));

    // Hourly forecast for game timeline (next 4 hours)
    const currentHour = new Date().getHours();
    const forecast = [];
    for (let i = 0; i < 4; i++) {
      const idx = Math.min(currentHour + i, hourly.time.length - 1);
      forecast.push({
        time: hourly.time[idx],
        temp: Math.round(hourly.temperature_2m[idx]),
        precipProb: hourly.precipitation_probability[idx],
        wind: Math.round(hourly.wind_speed_10m[idx]),
      });
    }

    const weatherData = {
      current: {
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        wind: Math.round(current.wind_speed_10m),
        windGusts: Math.round(current.wind_gusts_10m),
        windDirection,
        condition,
        precipitation: current.precipitation,
        fieldCondition,
      },
      adjustments: {
        shortRoutes: shortRouteAdjustment,
        deepRoutes: deepRouteAdjustment,
      },
      forecast,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(weatherData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
