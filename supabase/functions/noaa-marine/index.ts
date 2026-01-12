const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarineForecast {
  zone: string;
  location: string;
  issuedAt: string;
  warnings: string[];
  periods: {
    name: string;
    wind: string;
    seas: string;
    conditions: string;
  }[];
  rawText: string;
}

function parseNOAAForecast(text: string): MarineForecast {
  const lines = text.split('\n').filter(line => line.trim());
  
  // Extract zone and location
  const zoneMatch = text.match(/ANZ\d+/);
  const zone = zoneMatch ? zoneMatch[0] : 'Unknown';
  
  // Find location name (usually after the zone code)
  const locationMatch = text.match(/Vineyard Sound|Buzzards Bay|Nantucket Sound|Cape Cod Bay/i);
  const location = locationMatch ? locationMatch[0] : 'Massachusetts Coastal Waters';
  
  // Extract issued time
  const issuedMatch = text.match(/\d+\s+(?:AM|PM)\s+\w+\s+\w+\s+\w+\s+\d+\s+\d+/);
  const issuedAt = issuedMatch ? issuedMatch[0] : '';
  
  // Extract warnings
  const warnings: string[] = [];
  if (text.includes('GALE WARNING')) warnings.push('GALE WARNING');
  if (text.includes('STORM WARNING')) warnings.push('STORM WARNING');
  if (text.includes('SMALL CRAFT ADVISORY')) warnings.push('SMALL CRAFT ADVISORY');
  if (text.includes('HAZARDOUS SEAS')) warnings.push('HAZARDOUS SEAS');
  
  // Parse forecast periods
  const periods: MarineForecast['periods'] = [];
  const periodPatterns = [
    /\.OVERNIGHT\.\.\.(.+?)(?=\.|$)/s,
    /\.MON\.\.\.(.+?)(?=\.MON NIGHT|$)/s,
    /\.MON NIGHT\.\.\.(.+?)(?=\.TUE|$)/s,
    /\.TUE\.\.\.(.+?)(?=\.TUE NIGHT|$)/s,
    /\.TUE NIGHT AND WED\.\.\.(.+?)(?=\.WED NIGHT|$)/s,
    /\.WED NIGHT\.\.\.(.+?)(?=\.THU|$)/s,
    /\.THU\.\.\.(.+?)(?=\.THU NIGHT|$)/s,
    /\.THU NIGHT\.\.\.(.+?)(?=\.FRI|$)/s,
    /\.FRI\.\.\.(.+?)(?=\.FRI NIGHT|$)/s,
    /\.FRI NIGHT\.\.\.(.+?)(?=\$\$|Seas are|$)/s,
  ];
  
  const periodNames = [
    'OVERNIGHT', 'MONDAY', 'MON NIGHT', 'TUESDAY', 
    'TUE NIGHT/WED', 'WED NIGHT', 'THURSDAY', 
    'THU NIGHT', 'FRIDAY', 'FRI NIGHT'
  ];
  
  periodPatterns.forEach((pattern, index) => {
    const match = text.match(pattern);
    if (match) {
      const content = match[1].replace(/\s+/g, ' ').trim();
      
      // Extract wind info
      const windMatch = content.match(/([NSEW]+\s+winds?\s+\d+\s+to\s+\d+\s+kt(?:\s+with\s+gusts\s+up\s+to\s+\d+\s+kt)?)/i);
      const wind = windMatch ? windMatch[1] : '';
      
      // Extract seas info
      const seasMatch = content.match(/Seas?\s+(\d+\s+to\s+\d+\s+ft(?:[^.]*)?)/i);
      const seas = seasMatch ? `Seas ${seasMatch[1]}` : '';
      
      // Get any additional conditions
      const conditions = content
        .replace(windMatch?.[0] || '', '')
        .replace(seasMatch?.[0] || '', '')
        .replace(/Wave Detail:[^.]+\./g, '')
        .replace(/,\s*,/g, ',')
        .trim();
      
      periods.push({
        name: periodNames[index],
        wind: wind || 'Variable',
        seas: seas || 'Light',
        conditions: conditions || 'Fair'
      });
    }
  });
  
  return {
    zone,
    location,
    issuedAt,
    warnings,
    periods,
    rawText: text
  };
}

// Zone metadata for supported regions
const ZONE_METADATA: Record<string, { name: string; description: string }> = {
  'anz233': { name: 'Vineyard Sound', description: 'Including Woods Hole and Martha\'s Vineyard' },
  'anz230': { name: 'Cape Cod Bay', description: 'Plymouth to Provincetown' },
  'anz232': { name: 'Nantucket Sound', description: 'South of Cape Cod to Nantucket' },
  'anz231': { name: 'Buzzards Bay', description: 'New Bedford to the Elizabeth Islands' },
  'anz234': { name: 'Block Island Sound', description: 'Rhode Island to Block Island' },
  'anz235': { name: 'Long Island Sound (East)', description: 'New London to Orient Point' },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zone = 'anz233', listZones } = await req.json().catch(() => ({}));
    
    // Return list of supported zones if requested
    if (listZones) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          zones: Object.entries(ZONE_METADATA).map(([id, meta]) => ({
            id,
            ...meta
          }))
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // NOAA marine forecast URL
    const url = `https://tgftp.nws.noaa.gov/data/forecasts/marine/coastal/an/${zone.toLowerCase()}.txt`;
    
    console.log('Fetching NOAA marine forecast:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'STRATA Weather Intelligence/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`NOAA API returned ${response.status}`);
    }
    
    const rawText = await response.text();
    const forecast = parseNOAAForecast(rawText);
    
    console.log('NOAA forecast parsed successfully for zone:', forecast.zone);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: forecast,
        fetchedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching NOAA data:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch NOAA data' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
