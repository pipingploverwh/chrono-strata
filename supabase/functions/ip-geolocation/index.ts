import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Try to get IP from request headers (Supabase provides this)
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfConnectingIp = req.headers.get('cf-connecting-ip');
    
    const clientIp = cfConnectingIp || realIp || forwardedFor?.split(',')[0]?.trim();
    
    console.log("Detecting location for IP hint:", clientIp ? clientIp.substring(0, 8) + "..." : "unknown");

    // Use ip-api.com (free, no API key needed, 45 req/min limit)
    // For production, consider ipinfo.io or maxmind
    const ipToLookup = clientIp && clientIp !== '127.0.0.1' && !clientIp.startsWith('192.168') 
      ? clientIp 
      : ''; // Empty string = their IP detection
    
    const response = await fetch(
      `http://ip-api.com/json/${ipToLookup}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp`,
      { headers: { 'User-Agent': 'LavandarAI/1.0' } }
    );

    if (!response.ok) {
      throw new Error('IP geolocation service unavailable');
    }

    const data = await response.json();
    
    if (data.status === 'fail') {
      // Fallback to default location (Washington DC for White House context)
      return new Response(JSON.stringify({
        success: true,
        location: {
          city: 'Washington',
          region: 'District of Columbia',
          regionCode: 'DC',
          country: 'United States',
          countryCode: 'US',
          latitude: 38.8977,
          longitude: -77.0365,
          timezone: 'America/New_York',
          displayName: 'Washington, DC',
          isFallback: true,
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const location = {
      city: data.city,
      region: data.regionName,
      regionCode: data.region,
      country: data.country,
      countryCode: data.countryCode,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone,
      isp: data.isp,
      displayName: `${data.city}, ${data.region}`,
      isFallback: false,
    };

    console.log("Location detected:", location.displayName);

    return new Response(JSON.stringify({ success: true, location }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('IP geolocation error:', error);
    
    // Return fallback location on error
    return new Response(JSON.stringify({
      success: true,
      location: {
        city: 'Washington',
        region: 'District of Columbia',
        regionCode: 'DC',
        country: 'United States',
        countryCode: 'US',
        latitude: 38.8977,
        longitude: -77.0365,
        timezone: 'America/New_York',
        displayName: 'Washington, DC',
        isFallback: true,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});