import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Droplets, Wind, Shield, Loader2, Zap, Map, Clock, Activity, Anchor, Snowflake, Sun, Building2, ChevronLeft, ChevronRight, Infinity, Users, Gift, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeatherData } from "@/hooks/useWeatherData";

// Import terrain-specific jacket renders
import strataShellHUD from "@/assets/strata-shell-hud-jacket.jpg";
import strataShellMarine from "@/assets/strata-shell-marine.jpg";
import strataShellPolar from "@/assets/strata-shell-polar.jpg";
import strataShellDesert from "@/assets/strata-shell-desert.jpg";
import strataShellUrban from "@/assets/strata-shell-urban.jpg";

// Strata-coordinate mapped terrain variants (base data - translations applied in component)
const TERRAIN_VARIANTS_BASE = [
  {
    id: 'standard',
    nameKey: 'terrain.chronoTopo.name',
    descriptionKey: 'terrain.chronoTopo.description',
    strataZone: 'Default',
    coordinates: { lat: 0, lon: 0 },
    image: strataShellHUD,
    color: 'strata-orange',
    icon: Map,
    climate: 'temperate',
  },
  {
    id: 'marine',
    nameKey: 'terrain.bathymetric.name',
    descriptionKey: 'terrain.bathymetric.description',
    strataZone: 'Pacific Marine',
    coordinates: { lat: -36.8485, lon: 174.7633 },
    image: strataShellMarine,
    color: 'cyan-400',
    icon: Anchor,
    climate: 'maritime',
  },
  {
    id: 'polar',
    nameKey: 'terrain.glacial.name',
    descriptionKey: 'terrain.glacial.description',
    strataZone: 'Tromsø Arctic',
    coordinates: { lat: 69.6496, lon: 18.9560 },
    image: strataShellPolar,
    color: 'blue-300',
    icon: Snowflake,
    climate: 'polar',
  },
  {
    id: 'desert',
    nameKey: 'terrain.geological.name',
    descriptionKey: 'terrain.geological.description',
    strataZone: 'Sahara Interior',
    coordinates: { lat: 33.8869, lon: 9.5375 },
    image: strataShellDesert,
    color: 'orange-500',
    icon: Sun,
    climate: 'desert',
  },
  {
    id: 'urban',
    nameKey: 'terrain.metropolitan.name',
    descriptionKey: 'terrain.metropolitan.description',
    strataZone: 'Tokyo Metropolis',
    coordinates: { lat: 35.6762, lon: 139.6503 },
    image: strataShellUrban,
    color: 'violet-400',
    icon: Building2,
    climate: 'urban',
  },
];

// Strata Ownership - 100 Year Legacy Program
const STRATA_OWNERSHIP = {
  name: 'STRATA OWNERSHIP',
  subtitle: 'Century Protocol — 100 Years of Ownership',
  price: 176,
  interval: 'year',
  description: 'Vulcanized hydrophobic shell with embedded chronometer display and terrain-mapped HUD. This is not a limited run — it is the beginning of a 100-year ownership lineage.',
  tagline: 'A Century of Ownership. Generational Access.',
  legacyYears: 100,
};

// STRATA Bond - Upfront generational payment
const STRATA_BOND = {
  name: 'STRATA BOND',
  subtitle: 'Generational Prepaid Access',
  price: 12500,
  description: 'Secure 100 years of STRATA ownership upfront. Transfer to children, heirs, or designees. One payment. One century.',
  savings: 'Save $5,100 vs annual',
  yearsIncluded: 100,
};

// Technical specifications
const EQUIPMENT_SPECS = {
  membrane: { label: 'MEMBRANE', value: 'PU/TPU Hybrid', description: 'Vulcanized barrier film' },
  hydrostatic: { label: 'HYDROSTATIC', value: '15,000mm', description: 'Heat-sealed seams' },
  hud: { label: 'HUD DISPLAY', value: 'Active', description: 'Chronometer + Terrain' },
  weight: { label: 'UNIT WEIGHT', value: '420g', description: 'Mission-ready' },
};

// Live clock component
const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="font-mono text-strata-cyan text-xs tracking-[0.3em]">
      {time.toLocaleTimeString('en-US', { hour12: false })}
    </div>
  );
};

// Crosshair component
const Crosshair = ({ color = "strata-cyan" }: { color?: string }) => (
  <div className="relative w-8 h-8">
    <div className={`absolute top-1/2 left-0 w-full h-px bg-${color}/60`} />
    <div className={`absolute top-0 left-1/2 w-px h-full bg-${color}/60`} />
    <div className={`absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 border border-${color}/80 rotate-45`} />
  </div>
);

// Technical readout
const TechReadout = ({ label, value, unit, pulse = false }: { label: string; value: string | number; unit?: string; pulse?: boolean }) => (
  <div className="flex items-center gap-2">
    <div className={`w-1.5 h-1.5 rounded-full ${pulse ? 'bg-strata-lume animate-pulse' : 'bg-strata-orange'}`} />
    <span className="text-strata-silver/60 font-mono text-[10px] uppercase tracking-wider">{label}:</span>
    <span className="text-strata-white font-mono text-xs">{value}</span>
    {unit && <span className="text-strata-silver/40 font-mono text-[9px]">{unit}</span>}
  </div>
);

// Get clothing recommendation based on weather - returns translation key
const getClothingAdviceKey = (tempF: number, condition: string): string => {
  const isRainy = condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle');
  const isWindy = condition.toLowerCase().includes('wind');
  const isSnowy = condition.toLowerCase().includes('snow');
  
  if (tempF < 32) return isSnowy ? 'weather.advice.snowLayers' : 'weather.advice.coldFull';
  if (tempF < 50) return isRainy ? 'weather.advice.coldRain' : 'weather.advice.coldMidLayers';
  if (tempF < 65) return isRainy ? 'weather.advice.perfectWeather' : isWindy ? 'weather.advice.lightWind' : 'weather.advice.optional';
  if (tempF < 75) return isRainy ? 'weather.advice.lightRain' : 'weather.advice.carryShell';
  return isRainy ? 'weather.advice.suddenShowers' : 'weather.advice.stowed';
};

const Shop = () => {
  const { t } = useLanguage();
  
  // Build translated terrain variants
  const TERRAIN_VARIANTS = TERRAIN_VARIANTS_BASE.map(variant => ({
    ...variant,
    name: t(variant.nameKey),
    description: t(variant.descriptionKey),
  }));
  
  const [selectedTerrainId, setSelectedTerrainId] = useState(TERRAIN_VARIANTS_BASE[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [systemStatus, setSystemStatus] = useState('NOMINAL');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'annual' | 'bond'>('annual');
  
  // Get the selected terrain with translations
  const selectedTerrain = TERRAIN_VARIANTS.find(v => v.id === selectedTerrainId) || TERRAIN_VARIANTS[0];
  
  // Weather and temperature
  const { unit, toggleUnit, formatTemp } = useTemperatureUnit();
  const { latitude, longitude, requestLocation, hasLocation } = useGeolocation();
  const { weather, loading: weatherLoading } = useWeatherData(
    latitude ?? undefined,
    longitude ?? undefined
  );
  
  // Auto-request location on mount
  useEffect(() => {
    if (!hasLocation) {
      requestLocation();
    }
  }, [hasLocation, requestLocation]);

  const currentIndex = TERRAIN_VARIANTS.findIndex(v => v.id === selectedTerrainId);
  
  const nextTerrain = () => {
    const nextIdx = (currentIndex + 1) % TERRAIN_VARIANTS.length;
    setSelectedTerrainId(TERRAIN_VARIANTS[nextIdx].id);
  };
  
  const prevTerrain = () => {
    const prevIdx = (currentIndex - 1 + TERRAIN_VARIANTS.length) % TERRAIN_VARIANTS.length;
    setSelectedTerrainId(TERRAIN_VARIANTS[prevIdx].id);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      const isBond = params.get('bond') === 'true';
      if (isBond) {
        toast.success('STRATA Bond secured. Welcome to 100 years of ownership.', {
          description: 'Your generational access has been activated.',
          duration: 8000,
        });
      } else {
        toast.success('Strata Ownership activated. Welcome to the Century Protocol.');
      }
      window.history.replaceState({}, '', '/shop');
    }
    if (params.get('canceled') === 'true') {
      toast.info('Checkout canceled.');
      window.history.replaceState({}, '', '/shop');
    }
  }, []);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    setSystemStatus('INITIATING');
    
    try {
      const { data, error } = await supabase.functions.invoke('create-shop-checkout', {
        body: { 
          mode: selectedPaymentMode === 'bond' ? 'payment' : 'subscription',
          priceType: selectedPaymentMode === 'bond' ? 'strata_bond' : 'strata_ownership',
          terrainVariant: selectedTerrain.id,
          strataZone: selectedTerrain.strataZone,
          coordinates: selectedTerrain.coordinates,
          legacyYears: STRATA_OWNERSHIP.legacyYears,
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        setSystemStatus('REDIRECTING');
        window.open(data.url, '_blank');
        toast.success("Checkout opened in new tab");
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setSystemStatus('ERROR');
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setSystemStatus('NOMINAL'), 2000);
    }
  };

  const TerrainIcon = selectedTerrain.icon;

  return (
    <div className="min-h-screen bg-strata-black overflow-hidden">
      {/* CAD Grid overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--strata-steel)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--strata-steel)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 left-1/2 w-px h-full bg-strata-cyan/5" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-strata-cyan/5" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* System Header */}
        <motion.header 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Top bar with language, weather, and system status */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-strata-lume animate-pulse" />
              <span className="font-mono text-[10px] text-strata-silver/60 uppercase tracking-[0.3em]">
                {t('shop.labHeader')}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Language Toggle */}
              <LanguageToggle variant="compact" />
              
              {/* Temperature with C/F toggle */}
              {weather && !weatherLoading && (
                <button 
                  onClick={toggleUnit}
                  className="flex items-center gap-2 px-3 py-1.5 bg-strata-steel/20 hover:bg-strata-steel/30 border border-strata-steel/30 rounded transition-colors"
                  aria-label={`Toggle temperature unit. Currently ${unit}`}
                >
                  <Thermometer className="w-3 h-3 text-strata-cyan" />
                  <span className="font-mono text-xs text-strata-white">
                    {formatTemp(weather.current.temp)}
                  </span>
                  <span className="font-mono text-[9px] text-strata-silver/50">
                    {unit === 'F' ? '→ C' : '→ F'}
                  </span>
                </button>
              )}
              
              <TechReadout label="SYS" value={systemStatus} pulse={systemStatus !== 'NOMINAL'} />
              <LiveClock />
            </div>
          </div>
          
          {/* Weather clothing recommendation */}
          {weather && !weatherLoading && (
            <motion.div 
              className="mb-6 px-4 py-2 bg-strata-cyan/5 border border-strata-cyan/20 rounded flex items-center gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Shield className="w-4 h-4 text-strata-cyan flex-shrink-0" />
              <span className="font-mono text-xs text-strata-silver">
                {t(getClothingAdviceKey(weather.current.temp, weather.current.condition))}
              </span>
              <span className="font-mono text-[9px] text-strata-silver/40 hidden sm:inline">
                — {weather.current.condition}
              </span>
            </motion.div>
          )}
          
          <div className="border border-strata-steel/20 rounded-lg p-6 bg-strata-charcoal/30 backdrop-blur">
            <Badge className="mb-4 bg-strata-cyan/10 text-strata-cyan border-strata-cyan/30 font-mono text-[10px] uppercase tracking-wider">
              {t('shop.terrainMapped')}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-instrument text-strata-white mb-2">
              {t('shop.ownership')}
            </h1>
            <p className="text-strata-orange font-mono text-sm uppercase tracking-[0.2em]">
              {t('shop.centuryProtocol')}
            </p>
          </div>
        </motion.header>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Equipment Render - 3 columns */}
          <motion.div 
            className="lg:col-span-3 relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative border border-strata-steel/30 rounded-lg overflow-hidden bg-strata-charcoal/20">
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-6 h-6 border-l border-t border-strata-cyan/40 z-10" />
              <div className="absolute top-2 right-2 w-6 h-6 border-r border-t border-strata-cyan/40 z-10" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-l border-b border-strata-cyan/40 z-10" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r border-b border-strata-cyan/40 z-10" />
              
              {/* HUD overlay */}
              <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-3 h-3 text-strata-lume" />
                  <span className="font-mono text-[9px] text-strata-lume uppercase tracking-wider">Live Render</span>
                </div>
                <div className={`text-${selectedTerrain.color} font-mono text-[10px] opacity-80`}>
                  {selectedTerrain.name}-HUD-01
                </div>
              </div>
              
              <div className="absolute top-4 right-4 z-10">
                <Crosshair color={selectedTerrain.color} />
              </div>

              {/* Strata Zone indicator */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="flex items-center gap-2 px-3 py-1 bg-strata-black/60 rounded border border-strata-steel/30">
                  <TerrainIcon className={`w-3 h-3 text-${selectedTerrain.color}`} />
                  <span className="font-mono text-[9px] text-strata-silver uppercase tracking-wider">
                    {selectedTerrain.strataZone}
                  </span>
                </div>
              </div>
              
              {/* Terrain image with transition */}
              <AnimatePresence mode="wait">
                <motion.img 
                  key={selectedTerrain.id}
                  src={selectedTerrain.image} 
                  alt={`STRATA Shell - ${selectedTerrain.name} terrain`}
                  className="w-full h-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              
              {/* Bottom HUD strip */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-strata-black/90 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <TechReadout label="LAT" value={selectedTerrain.coordinates.lat.toFixed(4)} />
                    <TechReadout label="LON" value={selectedTerrain.coordinates.lon.toFixed(4)} />
                    <TechReadout label="CLIMATE" value={selectedTerrain.climate.toUpperCase()} pulse />
                  </div>
                  <div className="flex items-center gap-2">
                    <Map className="w-4 h-4 text-strata-orange/60" />
                    <Clock className="w-4 h-4 text-strata-cyan/60" />
                    <Shield className="w-4 h-4 text-strata-lume/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* Terrain Selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-strata-silver/60 uppercase tracking-[0.2em]">
                  {t('shop.selectTerrain')}
                </span>
                <span className="font-mono text-[9px] text-strata-silver/40">
                  {currentIndex + 1} / {TERRAIN_VARIANTS.length}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={prevTerrain}
                  className="p-2 rounded-full bg-strata-steel/20 hover:bg-strata-steel/40 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-strata-silver" />
                </button>
                
                <div className="flex-1 grid grid-cols-5 gap-2">
                  {TERRAIN_VARIANTS.map((variant) => {
                    const Icon = variant.icon;
                    const isSelected = selectedTerrain.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedTerrainId(variant.id)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          isSelected 
                            ? `border-${variant.color} shadow-lg` 
                            : 'border-strata-steel/30 hover:border-strata-steel/60'
                        }`}
                      >
                        <img 
                          src={variant.image} 
                          alt={variant.name}
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute inset-0 flex items-center justify-center ${isSelected ? 'bg-black/40' : 'bg-black/60 hover:bg-black/40'} transition-colors`}>
                          <Icon className={`w-5 h-5 ${isSelected ? `text-${variant.color}` : 'text-strata-silver/60'}`} />
                        </div>
                        {isSelected && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                            <div className={`w-1 h-1 rounded-full bg-${variant.color}`} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={nextTerrain}
                  className="p-2 rounded-full bg-strata-steel/20 hover:bg-strata-steel/40 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-strata-silver" />
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <p className={`font-mono text-sm text-${selectedTerrain.color} mb-1`}>
                  {selectedTerrain.name}
                </p>
                <p className="text-strata-silver/60 text-xs">
                  {selectedTerrain.description}
                </p>
              </div>
            </div>

            {/* Tagline */}
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="font-mono text-strata-silver/40 text-xs uppercase tracking-[0.4em]">
                {t('shop.tagline')}
              </p>
            </motion.div>
          </motion.div>

          {/* Specifications & Purchase - 2 columns */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-6">
              {/* Century Protocol Header */}
              <div className="border border-strata-cyan/30 rounded-lg p-4 bg-strata-cyan/5">
                <div className="flex items-center gap-3 mb-2">
                  <Infinity className="w-5 h-5 text-strata-cyan" />
                  <span className="font-mono text-xs text-strata-cyan uppercase tracking-wider">
                    {t('shop.centuryHeader')}
                  </span>
                </div>
                <p className="text-strata-silver/80 text-xs font-mono">
                  {t('shop.notLimitedRun')} <span className="text-strata-white">{t('shop.yearsOwnership')}</span> {t('shop.ofOwnership')}
                </p>
              </div>

              {/* Payment Mode Toggle */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-strata-silver/60 uppercase tracking-[0.2em]">
                  {t('shop.selectOwnershipMode')}
                </span>
                
                {/* Annual Option */}
                <button
                  onClick={() => setSelectedPaymentMode('annual')}
                  className={`w-full text-left border rounded-lg p-4 transition-all ${
                    selectedPaymentMode === 'annual'
                      ? 'border-strata-orange bg-strata-orange/10'
                      : 'border-strata-steel/30 bg-strata-charcoal/20 hover:border-strata-steel/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${selectedPaymentMode === 'annual' ? 'text-strata-orange' : 'text-strata-silver/60'}`} />
                      <span className={`font-mono text-sm uppercase tracking-wider ${selectedPaymentMode === 'annual' ? 'text-strata-orange' : 'text-strata-silver'}`}>
                        {t('shop.annual')}
                      </span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedPaymentMode === 'annual' ? 'border-strata-orange' : 'border-strata-steel/50'
                    }`}>
                      {selectedPaymentMode === 'annual' && <div className="w-2 h-2 rounded-full bg-strata-orange" />}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-mono ${selectedPaymentMode === 'annual' ? 'text-strata-white' : 'text-strata-silver'}`}>
                      ${STRATA_OWNERSHIP.price}
                    </span>
                    <span className="text-strata-silver/60 font-mono text-xs">{t('shop.perYear')}</span>
                  </div>
                  <p className="text-strata-silver/50 font-mono text-[9px] mt-1">{t('shop.postFirstYear')}</p>
                </button>
                
                {/* Bond Option */}
                <button
                  onClick={() => setSelectedPaymentMode('bond')}
                  className={`w-full text-left border rounded-lg p-4 transition-all ${
                    selectedPaymentMode === 'bond'
                      ? 'border-strata-lume bg-strata-lume/10'
                      : 'border-strata-steel/30 bg-strata-charcoal/20 hover:border-strata-steel/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Gift className={`w-4 h-4 ${selectedPaymentMode === 'bond' ? 'text-strata-lume' : 'text-strata-silver/60'}`} />
                      <span className={`font-mono text-sm uppercase tracking-wider ${selectedPaymentMode === 'bond' ? 'text-strata-lume' : 'text-strata-silver'}`}>
                        {t('shop.strataBond')}
                      </span>
                      <Badge className="bg-strata-lume/20 text-strata-lume border-strata-lume/30 font-mono text-[8px] px-1.5 py-0">
                        {t('shop.legacy')}
                      </Badge>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedPaymentMode === 'bond' ? 'border-strata-lume' : 'border-strata-steel/50'
                    }`}>
                      {selectedPaymentMode === 'bond' && <div className="w-2 h-2 rounded-full bg-strata-lume" />}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-mono ${selectedPaymentMode === 'bond' ? 'text-strata-white' : 'text-strata-silver'}`}>
                      ${STRATA_BOND.price.toLocaleString()}
                    </span>
                    <span className="text-strata-silver/60 font-mono text-xs">{t('shop.oneTime')}</span>
                  </div>
                  <p className="text-strata-silver/50 font-mono text-[9px] mt-1">{t('shop.savingsVsAnnual')}</p>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-strata-steel/20">
                    <Users className={`w-3 h-3 ${selectedPaymentMode === 'bond' ? 'text-strata-lume/80' : 'text-strata-silver/40'}`} />
                    <span className={`font-mono text-[9px] ${selectedPaymentMode === 'bond' ? 'text-strata-lume/80' : 'text-strata-silver/40'}`}>
                      {t('shop.transferable')}
                    </span>
                  </div>
                </button>
              </div>

              {/* Selected Terrain */}
              <div className={`p-4 rounded-lg bg-${selectedTerrain.color}/10 border border-${selectedTerrain.color}/30`}>
                <div className="flex items-center gap-3">
                  <TerrainIcon className={`w-5 h-5 text-${selectedTerrain.color}`} />
                  <div>
                    <p className="text-strata-silver/60 font-mono text-[10px] uppercase tracking-wider">
                      {t('shop.selectedTerrainMap')}
                    </p>
                    <p className={`text-${selectedTerrain.color} font-semibold`}>
                      {selectedTerrain.name} — {selectedTerrain.strataZone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-strata-silver/80 text-sm leading-relaxed border-l-2 border-strata-cyan/30 pl-4">
                {t('shop.description')}
              </p>

              {/* Equipment Specs */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-1 bg-strata-cyan" />
                  <span className="font-mono text-[10px] text-strata-cyan uppercase tracking-[0.2em]">
                    {t('shop.techSpecs')}
                  </span>
                </div>
                
                {Object.entries(EQUIPMENT_SPECS).map(([key, spec]) => (
                  <div 
                    key={key}
                    className="flex items-center justify-between p-3 bg-strata-charcoal/30 border border-strata-steel/20 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-strata-orange/60" />
                      <span className="font-mono text-[10px] text-strata-silver/60 uppercase tracking-wider">
                        {spec.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm text-strata-white">{spec.value}</span>
                      <p className="font-mono text-[9px] text-strata-silver/40">{spec.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="space-y-2 py-4 border-y border-strata-steel/20">
                {[
                  { icon: Droplets, text: 'Vulcanized hydrophobic membrane' },
                  { icon: Shield, text: 'Heat-sealed seam construction' },
                  { icon: Clock, text: 'Embedded chronometer HUD display' },
                  { icon: Map, text: 'Strata-coordinate terrain mapping' },
                  { icon: Wind, text: 'All-weather operations rated' },
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <div className="w-6 h-6 rounded bg-strata-cyan/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-3 h-3 text-strata-cyan" />
                    </div>
                    <span className="text-strata-silver text-xs font-mono">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Subscribe Button */}
              <Button
                onClick={handleSubscribe}
                disabled={isProcessing}
                size="lg"
                className={`w-full py-6 text-sm font-mono uppercase tracking-[0.2em] transition-all ${
                  selectedPaymentMode === 'bond' 
                    ? 'bg-strata-lume hover:bg-strata-lume/90 text-strata-black' 
                    : 'bg-strata-orange hover:bg-strata-orange/90 text-strata-black'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                    {t('shop.initiating')}
                  </>
                ) : selectedPaymentMode === 'bond' ? (
                  <>
                    <Gift className="w-4 h-4 mr-3" />
                    {t('shop.secureBond')} — ${STRATA_BOND.price.toLocaleString()}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 mr-3" />
                    {t('shop.activateTerrain')} {selectedTerrain.name} — ${STRATA_OWNERSHIP.price}{t('shop.perYear')}
                  </>
                )}
              </Button>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 text-strata-silver/40 text-[9px] font-mono uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {t('shop.secure')}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Infinity className="w-3 h-3" />
                  {t('shop.100YearLegacy')}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {t('shop.generational')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 text-[9px] font-mono text-strata-silver/30 uppercase tracking-[0.3em]">
            <div className="w-1.5 h-1.5 rotate-45 border border-strata-cyan/30" />
            <span>{t('shop.equipmentLab')}</span>
            <span>•</span>
            <span>{t('shop.protocolVersion')}</span>
            <div className="w-1.5 h-1.5 rotate-45 border border-strata-cyan/30" />
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Shop;
