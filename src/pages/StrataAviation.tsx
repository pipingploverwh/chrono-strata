import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plane, Cloud, Wind, Eye, Gauge, Thermometer, AlertTriangle, Navigation, ArrowUp, ChevronRight, TrendingUp, DollarSign, Clock, ShieldCheck, Radio, RefreshCw, Volume2, MapPin, Zap } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useWeatherData } from "@/hooks/useWeatherData";
import RoleSelector from "@/components/RoleSelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AltitudeLayer {
  name: string;
  altitude: string;
  turbulence: "None" | "Light" | "Moderate" | "Severe";
  temp: string;
  wind: { speed: string; direction: string };
  icing: "None" | "Light" | "Moderate" | "Severe";
}

interface AirportData {
  icao: string;
  name: string;
  lat: number;
  lon: number;
  metar?: string;
  conditions?: {
    flightRules: "VFR" | "MVFR" | "IFR" | "LIFR";
    visibility: string;
    ceiling: string;
    wind: { speed: number; direction: string; gusts?: number };
    temp: number;
    dewpoint: number;
    altimeter: string;
  };
}

// Airport database
const AIRPORTS: AirportData[] = [
  { icao: "KBOS", name: "Boston Logan", lat: 42.3656, lon: -71.0096 },
  { icao: "KJFK", name: "JFK International", lat: 40.6413, lon: -73.7781 },
  { icao: "KLAX", name: "Los Angeles Intl", lat: 33.9416, lon: -118.4085 },
  { icao: "KORD", name: "Chicago O'Hare", lat: 41.9742, lon: -87.9073 },
  { icao: "KMIA", name: "Miami International", lat: 25.7959, lon: -80.2870 },
  { icao: "KSFO", name: "San Francisco Intl", lat: 37.6213, lon: -122.3790 },
];

// Business Outcomes for Executive View (real-time simulated)
const generateOutcomes = () => ({
  delaysAvoided: Math.floor(8 + Math.random() * 8),
  fuelSaved: `${(2000 + Math.random() * 500).toFixed(0)} gal`,
  costSavings: `$${(15000 + Math.random() * 5000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
  safetyScore: (97 + Math.random() * 2.5).toFixed(1),
});

const StrataAviation = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLayer, setSelectedLayer] = useState(1);
  const [selectedAirport, setSelectedAirport] = useState<AirportData>(AIRPORTS[0]);
  const [outcomes, setOutcomes] = useState(generateOutcomes());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { role, config, isExecutive, isOperator, isTechnical } = useUserRole();
  
  // Fetch real weather data for selected airport
  const { weather, loading: weatherLoading } = useWeatherData(selectedAirport.lat, selectedAirport.lon);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update outcomes every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setOutcomes(generateOutcomes());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setOutcomes(generateOutcomes());
    setIsRefreshing(false);
    toast.success("Weather briefing updated");
  }, []);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);

  // Runway conditions - defined early for use in briefing text
  const runwayConditions = {
    runway: "RWY 33L",
    surface: weather?.current?.condition?.includes("Rain") ? "Wet" : "Dry",
    braking: weather?.current?.condition?.includes("Rain") ? "Medium" : "Good",
    crosswind: `${Math.floor((weather?.current?.wind || 0) * 0.7)} kts`,
    visibility: weather?.current?.condition?.includes("Fog") ? "1 SM" : "10+ SM",
    ceiling: weather?.current?.condition?.includes("Clear") ? "CLR" : "BKN 4500",
  };

  // Calculate flight rules from weather
  const getFlightRules = useCallback((): "VFR" | "MVFR" | "IFR" | "LIFR" => {
    if (!weather?.current) return "VFR";
    const vis = weather.current.condition?.includes("Fog") ? 1 : 10;
    if (vis < 1) return "LIFR";
    if (vis < 3) return "IFR";
    if (vis < 5) return "MVFR";
    return "VFR";
  }, [weather]);

  // Generate voice briefing text from weather data
  const generateBriefingText = useCallback(() => {
    const rules = getFlightRules();
    const temp = weather?.current?.temp || 0;
    const wind = weather?.current?.wind || 0;
    const windDir = weather?.current?.windDirection || 'calm';
    const condition = weather?.current?.condition || 'clear';
    
    return `Aviation weather briefing for ${selectedAirport.name}. ` +
      `Current conditions: ${rules} flight rules. ` +
      `Temperature ${temp} degrees Celsius. ` +
      `Winds from ${windDir} at ${wind} knots. ` +
      `Sky condition ${condition}. ` +
      `Runway ${runwayConditions.runway.replace('RWY ', '')} is ${runwayConditions.surface} with ${runwayConditions.braking} braking action. ` +
      `Visibility ${runwayConditions.visibility}. Ceiling ${runwayConditions.ceiling}. ` +
      `Altimeter setting 30.12. ` +
      `End of briefing.`;
  }, [weather, selectedAirport, runwayConditions, getFlightRules]);

  const handleVoiceBriefing = useCallback(async () => {
    // If already playing, stop
    if (isSpeaking && audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsSpeaking(false);
      return;
    }

    setTtsLoading(true);
    const briefingText = generateBriefingText();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/aviation-briefing-tts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: briefingText }),
        }
      );

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        toast.error("Audio playback failed");
      };

      setAudioElement(audio);
      await audio.play();
      toast.success("Voice briefing started", { description: `${selectedAirport.icao} weather briefing` });
    } catch (error) {
      console.error('TTS error:', error);
      // Fallback to Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(briefingText);
        utterance.rate = 0.95;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        toast.info("Using browser voice (fallback)", { description: "ElevenLabs unavailable" });
      } else {
        toast.error("Voice briefing failed");
      }
    } finally {
      setTtsLoading(false);
    }
  }, [isSpeaking, audioElement, generateBriefingText, selectedAirport.icao]);

  // Generate METAR from real weather data
  const generateMetar = useCallback(() => {
    if (!weather?.current) return `${selectedAirport.icao} AUTO NIL`;
    
    const day = currentTime.getUTCDate().toString().padStart(2, '0');
    const hour = currentTime.getUTCHours().toString().padStart(2, '0');
    const min = currentTime.getUTCMinutes().toString().padStart(2, '0');
    const windDir = weather.current.windDirection?.substring(0, 2).padStart(3, '0') || '000';
    const windSpd = (weather.current.wind || 0).toString().padStart(2, '0');
    const vis = weather.current.condition?.includes("Fog") ? "1/4SM FG" : "10SM";
    const tempC = weather.current.temp || 0;
    const dewpoint = Math.round(tempC - 5);
    
    return `${selectedAirport.icao} ${day}${hour}${min}Z ${windDir}${windSpd}KT ${vis} FEW045 BKN250 ${tempC > 0 ? '' : 'M'}${Math.abs(tempC).toString().padStart(2, '0')}/${dewpoint > 0 ? '' : 'M'}${Math.abs(dewpoint).toString().padStart(2, '0')} A3012 RMK AO2`;
  }, [weather, selectedAirport.icao, currentTime]);

  // Altitude layers with real-time simulation
  const altitudeLayers: AltitudeLayer[] = [
    { name: "Surface", altitude: "0 ft", turbulence: weather?.current?.wind && weather.current.wind > 15 ? "Light" : "None", temp: `${weather?.current?.temp || 0}°C`, wind: { speed: `${weather?.current?.wind || 0}`, direction: weather?.current?.windDirection || "N" }, icing: "None" },
    { name: "FL100", altitude: "10,000 ft", turbulence: "None", temp: `${(weather?.current?.temp || 0) - 15}°C`, wind: { speed: "25", direction: "285°" }, icing: "Light" },
    { name: "FL180", altitude: "18,000 ft", turbulence: weather?.current?.wind && weather.current.wind > 20 ? "Moderate" : "Light", temp: `${(weather?.current?.temp || 0) - 28}°C`, wind: { speed: "45", direction: "290°" }, icing: "Moderate" },
    { name: "FL240", altitude: "24,000 ft", turbulence: "Light", temp: "-42°C", wind: { speed: "65", direction: "295°" }, icing: "None" },
    { name: "FL350", altitude: "35,000 ft", turbulence: "None", temp: "-56°C", wind: { speed: "95", direction: "300°" }, icing: "None" },
  ];

  const getTurbulenceColor = (level: string) => {
    switch (level) {
      case "None": return "text-strata-lume";
      case "Light": return "text-strata-cyan";
      case "Moderate": return "text-strata-orange";
      case "Severe": return "text-strata-red";
      default: return "text-strata-silver";
    }
  };

  const getFlightRulesColor = (rules: string) => {
    switch (rules) {
      case "VFR": return "bg-strata-lume/20 text-strata-lume";
      case "MVFR": return "bg-strata-cyan/20 text-strata-cyan";
      case "IFR": return "bg-strata-orange/20 text-strata-orange";
      case "LIFR": return "bg-strata-red/20 text-strata-red";
      default: return "bg-strata-silver/20 text-strata-silver";
    }
  };

  const flightRules = getFlightRules();
  const metar = generateMetar();

  return (
    <div className="min-h-screen bg-[hsl(220,30%,8%)] text-white">
      {/* Header */}
      <header className="border-b border-sky-900/30 bg-[hsl(220,40%,6%)]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sky-400 hover:text-sky-300 text-sm font-mono">← Home</Link>
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-sky-400" />
              <h1 className="font-instrument text-2xl tracking-wider text-white">STRATA</h1>
              <span className="text-[10px] font-mono text-sky-400/60 uppercase tracking-widest">Aviation</span>
              <Badge className="bg-strata-cyan/20 text-strata-cyan text-[9px] border-0 ml-2">
                BEACHHEAD
              </Badge>
              <Badge className="bg-emerald-600/20 text-emerald-400 border-0 text-[9px] ml-1">
                <Zap className="w-3 h-3 mr-1" />
                100%
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-mono">
            <RoleSelector variant="compact" />
            <span className="text-sky-400">{formatTime(currentTime)} UTC</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-sky-500/10 border border-sky-500/30">
              <div className="w-2 h-2 rounded-full bg-strata-lume animate-pulse" />
              <span className="text-strata-lume text-xs">LIVE BRIEFING</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Airport Selector - All roles */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {AIRPORTS.slice(0, 4).map(airport => (
              <button
                key={airport.icao}
                onClick={() => setSelectedAirport(airport)}
                className={`px-3 py-2 rounded-lg font-mono text-xs transition-all ${
                  selectedAirport.icao === airport.icao
                    ? 'bg-sky-600 text-white'
                    : 'bg-sky-950/50 text-sky-400 hover:bg-sky-900/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  {airport.icao}
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleVoiceBriefing}
              disabled={ttsLoading}
              className={`border-sky-800 hover:bg-sky-900/30 ${isSpeaking ? 'text-strata-lume border-strata-lume/50' : 'text-sky-400'}`}
            >
              <Volume2 className={`w-4 h-4 mr-1 ${isSpeaking ? 'animate-pulse' : ''} ${ttsLoading ? 'animate-spin' : ''}`} />
              {ttsLoading ? 'Loading...' : isSpeaking ? 'Stop Briefing' : 'Voice Briefing'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-sky-800 text-sky-400 hover:bg-sky-900/30"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <span className="text-[10px] text-sky-600 font-mono">
              Updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Executive Outcomes Strip - Only for Executive Role */}
        {isExecutive && (
          <div className="mb-6 grid grid-cols-4 gap-4">
            <OutcomeCard icon={<Clock className="w-5 h-5" />} label="Delays Avoided Today" value={outcomes.delaysAvoided.toString()} color="strata-lume" />
            <OutcomeCard icon={<Gauge className="w-5 h-5" />} label="Fuel Saved" value={outcomes.fuelSaved} color="strata-cyan" />
            <OutcomeCard icon={<DollarSign className="w-5 h-5" />} label="Cost Savings" value={outcomes.costSavings} color="strata-orange" />
            <OutcomeCard icon={<ShieldCheck className="w-5 h-5" />} label="Safety Score" value={`${outcomes.safetyScore}%`} color="strata-lume" />
          </div>
        )}

        {/* Flight Rules Banner */}
        <div className="mb-6 p-4 bg-sky-950/50 border border-sky-900/30 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge className={`text-sm font-bold px-3 py-1 ${getFlightRulesColor(flightRules)}`}>
              {flightRules}
            </Badge>
            <div className="text-sky-300 font-mono text-sm">
              {selectedAirport.icao} — {selectedAirport.name}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-sky-500">
            <span>VIS: {runwayConditions.visibility}</span>
            <span>•</span>
            <span>CEIL: {runwayConditions.ceiling}</span>
            <span>•</span>
            <span>WIND: {weather?.current?.windDirection || 'CALM'} @ {weather?.current?.wind || 0} kts</span>
          </div>
        </div>

        {/* METAR Strip - Only for Technical/Operator */}
        {(isTechnical || isOperator) && (
          <div className="mb-6 p-3 bg-sky-950/50 border border-sky-900/30 rounded font-mono text-xs text-sky-300 overflow-x-auto">
            <span className="text-sky-500">METAR:</span> {metar}
            {weatherLoading && <span className="ml-2 text-sky-600">(updating...)</span>}
          </div>
        )}

        {/* Operator/Technical View - Full Dashboard */}
        {!isExecutive && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Altitude Layers Panel */}
            <div className="lg:col-span-2 bg-[hsl(220,35%,10%)] border border-sky-900/30 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-sky-950/50 border-b border-sky-900/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-4 h-4 text-sky-400" />
                  <span className="text-sm font-mono uppercase tracking-wider text-sky-300">Altitude Profile</span>
                </div>
                <span className="text-xs font-mono text-sky-400/60">{selectedAirport.icao} → Vertical Section</span>
              </div>
              
              <div className="p-4">
                {/* Altitude visualization */}
                <div className="flex gap-4">
                  {/* Altitude bar */}
                  <div className="w-24 flex flex-col-reverse">
                    {altitudeLayers.map((layer, idx) => (
                      <button
                        key={layer.name}
                        onClick={() => setSelectedLayer(idx)}
                        className={`py-4 px-2 border-l-2 transition-all ${
                          selectedLayer === idx 
                            ? "border-sky-400 bg-sky-500/10" 
                            : "border-sky-900/30 hover:border-sky-700/50"
                        }`}
                      >
                        <div className={`text-xs font-mono ${selectedLayer === idx ? "text-sky-300" : "text-sky-500"}`}>
                          {layer.name}
                        </div>
                        <div className="text-[10px] text-sky-600">{layer.altitude}</div>
                      </button>
                    ))}
                  </div>

                  {/* Selected layer details */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MetricCard
                      icon={<AlertTriangle className="w-4 h-4" />}
                      label="Turbulence"
                      value={altitudeLayers[selectedLayer].turbulence}
                      valueColor={getTurbulenceColor(altitudeLayers[selectedLayer].turbulence)}
                    />
                    <MetricCard
                      icon={<Thermometer className="w-4 h-4 text-sky-400" />}
                      label="Temperature"
                      value={altitudeLayers[selectedLayer].temp}
                    />
                    <MetricCard
                      icon={<Wind className="w-4 h-4 text-sky-400" />}
                      label="Wind"
                      value={`${altitudeLayers[selectedLayer].wind.speed} kts`}
                      subvalue={altitudeLayers[selectedLayer].wind.direction}
                    />
                    <MetricCard
                      icon={<Cloud className="w-4 h-4" />}
                      label="Icing"
                      value={altitudeLayers[selectedLayer].icing}
                      valueColor={getTurbulenceColor(altitudeLayers[selectedLayer].icing)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Runway Conditions */}
            <div className="bg-[hsl(220,35%,10%)] border border-sky-900/30 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-sky-950/50 border-b border-sky-900/30 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-sky-400" />
                <span className="text-sm font-mono uppercase tracking-wider text-sky-300">Runway Status</span>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="text-center py-4 bg-sky-950/30 rounded border border-sky-900/20">
                  <div className="font-instrument text-3xl text-sky-300">{runwayConditions.runway}</div>
                  <div className={`text-xs font-mono mt-1 ${runwayConditions.surface === 'Dry' ? 'text-strata-lume' : 'text-strata-orange'}`}>
                    {runwayConditions.surface}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-sky-950/20 rounded">
                    <div className="text-[10px] font-mono text-sky-500 uppercase">Braking</div>
                    <div className={`font-mono ${runwayConditions.braking === 'Good' ? 'text-strata-lume' : 'text-strata-orange'}`}>
                      {runwayConditions.braking}
                    </div>
                  </div>
                  <div className="p-2 bg-sky-950/20 rounded">
                    <div className="text-[10px] font-mono text-sky-500 uppercase">Crosswind</div>
                    <div className="font-mono text-sky-300">{runwayConditions.crosswind}</div>
                  </div>
                  <div className="p-2 bg-sky-950/20 rounded">
                    <div className="text-[10px] font-mono text-sky-500 uppercase">Visibility</div>
                    <div className={`font-mono ${runwayConditions.visibility.includes('10') ? 'text-strata-lume' : 'text-strata-orange'}`}>
                      {runwayConditions.visibility}
                    </div>
                  </div>
                  <div className="p-2 bg-sky-950/20 rounded">
                    <div className="text-[10px] font-mono text-sky-500 uppercase">Ceiling</div>
                    <div className="font-mono text-sky-300">{runwayConditions.ceiling}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Executive View - Simplified Outcomes */}
        {isExecutive && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Status Summary */}
            <div className="bg-[hsl(220,35%,10%)] border border-sky-900/30 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-sky-300 mb-4">Operations Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-strata-lume/10 border border-strata-lume/30 rounded-lg">
                  <span className="text-strata-lume font-semibold">All Systems Operational</span>
                  <ShieldCheck className="w-5 h-5 text-strata-lume" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-sky-950/30 rounded">
                    <div className="text-[10px] font-mono text-sky-500 uppercase">Active Flights</div>
                    <div className="font-instrument text-2xl text-white">{24 + Math.floor(Math.random() * 10)}</div>
                  </div>
                  <div className="p-3 bg-sky-950/30 rounded">
                    <div className="text-[10px] font-mono text-sky-500 uppercase">On-Time Rate</div>
                    <div className="font-instrument text-2xl text-strata-lume">{(92 + Math.random() * 6).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Summary */}
            <div className="bg-[hsl(220,35%,10%)] border border-sky-900/30 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-sky-300 mb-4">Risk Assessment</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-sky-950/30 rounded">
                  <span className="text-sm text-strata-silver">Weather Impact</span>
                  <Badge className={`border-0 ${weather?.current?.condition?.includes('Clear') ? 'bg-strata-lume/20 text-strata-lume' : 'bg-strata-orange/20 text-strata-orange'}`}>
                    {weather?.current?.condition?.includes('Clear') ? 'LOW' : 'MODERATE'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-sky-950/30 rounded">
                  <span className="text-sm text-strata-silver">Turbulence Risk</span>
                  <Badge className={`border-0 ${(weather?.current?.wind || 0) > 15 ? 'bg-strata-orange/20 text-strata-orange' : 'bg-strata-lume/20 text-strata-lume'}`}>
                    {(weather?.current?.wind || 0) > 15 ? 'MODERATE' : 'LOW'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-sky-950/30 rounded">
                  <span className="text-sm text-strata-silver">Icing Potential</span>
                  <Badge className={`border-0 ${(weather?.current?.temp || 20) < 5 ? 'bg-strata-orange/20 text-strata-orange' : 'bg-strata-lume/20 text-strata-lume'}`}>
                    {(weather?.current?.temp || 20) < 5 ? 'MODERATE' : 'LOW'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Flight Conditions Summary - All Roles (Progressive Disclosure) */}
        <div className={`mt-6 grid ${isExecutive ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-5'} gap-3`}>
          <SummaryCard label="Flight Category" value={flightRules} status={flightRules === 'VFR' ? 'good' : flightRules === 'MVFR' ? 'caution' : 'warning'} />
          {!isExecutive && <SummaryCard label="Density Altitude" value={`${800 + Math.floor(Math.random() * 200)} ft`} />}
          <SummaryCard label="Altimeter" value="30.12 inHg" />
          {!isExecutive && <SummaryCard label="Freezing Level" value={`${2000 + Math.floor(Math.random() * 1000)} ft`} status={(weather?.current?.temp || 20) < 10 ? "caution" : undefined} />}
          {isTechnical && <SummaryCard label="Pressure Alt" value={`${900 + Math.floor(Math.random() * 100)} ft`} />}
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-sky-900/20 flex items-center justify-between text-[10px] font-mono text-sky-600 uppercase tracking-wider">
          <span>{selectedAirport.icao} • {selectedAirport.name}</span>
          <span className="text-strata-cyan">View: {config.label} | Real-Time Briefing: ON</span>
          <span>Valid: {currentTime.toLocaleDateString()}</span>
        </footer>
      </main>
    </div>
  );
};

// Outcome Card for Executive View
const OutcomeCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) => (
  <div className={`p-4 bg-${color}/10 border border-${color}/30 rounded-lg`}>
    <div className={`flex items-center gap-2 mb-2 text-${color}`}>
      {icon}
      <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
    </div>
    <div className={`font-instrument text-2xl text-${color}`}>{value}</div>
  </div>
);

const MetricCard = ({ 
  icon, 
  label, 
  value, 
  subvalue, 
  valueColor = "text-white" 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  subvalue?: string;
  valueColor?: string;
}) => (
  <div className="p-3 bg-sky-950/30 border border-sky-900/20 rounded">
    <div className="flex items-center gap-2 mb-2 text-sky-500">
      {icon}
      <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
    </div>
    <div className={`font-instrument text-xl ${valueColor}`}>{value}</div>
    {subvalue && <div className="text-xs font-mono text-sky-500">{subvalue}</div>}
  </div>
);

const SummaryCard = ({ 
  label, 
  value, 
  status 
}: { 
  label: string; 
  value: string; 
  status?: "good" | "caution" | "warning";
}) => {
  const statusColors = {
    good: "text-strata-lume border-strata-lume/30",
    caution: "text-strata-orange border-strata-orange/30",
    warning: "text-strata-red border-strata-red/30",
  };

  return (
    <div className={`p-3 bg-sky-950/30 border rounded ${status ? statusColors[status] : "border-sky-900/20"}`}>
      <div className="text-[10px] font-mono text-sky-500 uppercase tracking-wider mb-1">{label}</div>
      <div className={`font-instrument text-lg ${status ? statusColors[status].split(" ")[0] : "text-white"}`}>
        {value}
      </div>
    </div>
  );
};

export default StrataAviation;
