import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Droplets, Wind, Shield, Loader2, Zap, Map, Clock, Activity, Anchor, Snowflake, Sun, Building2, ChevronLeft, ChevronRight, Infinity, Users, Gift, Thermometer, AlertTriangle, ArrowRight, Lock, X, Fingerprint, Package, Sparkles, Ruler, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeatherData } from "@/hooks/useWeatherData";
import { HUDGlitchOverlay } from "@/components/shop/HUDGlitchOverlay";
import { BondVaultReveal } from "@/components/shop/BondVaultReveal";
import { AcquisitionRitual } from "@/components/shop/AcquisitionRitual";
import { AddToCartPrompt } from "@/components/shop/AddToCartPrompt";
import { LearnMoreSection } from "@/components/navigation/LearnMoreSection";
import { SizingTool } from "@/components/shop/SizingTool";
import { InFeedAd, AD_SLOTS } from "@/components/ads";
import { ThermalWeatherWidget } from "@/components/shop/ThermalWeatherWidget";
import { MiniCart } from "@/components/shop/MiniCart";

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
    strataZoneKey: 'zone.default',
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
    strataZoneKey: 'zone.pacificMarine',
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
    strataZoneKey: 'zone.tromsoArctic',
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
    strataZoneKey: 'zone.saharaInterior',
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
    strataZoneKey: 'zone.tokyoMetropolis',
    coordinates: { lat: 35.6762, lon: 139.6503 },
    image: strataShellUrban,
    color: 'violet-400',
    icon: Building2,
    climate: 'urban',
  },
];

// Strata Ownership - 100 Year Legacy Program (Level 1: $176/yr)
const STRATA_OWNERSHIP = {
  name: 'STRATA OWNERSHIP',
  subtitle: 'Century Protocol — 100 Years of Ownership',
  price: 176,
  interval: 'year',
  description: 'Vulcanized hydrophobic shell with embedded chronometer display and terrain-mapped HUD. This is not a limited run — it is the beginning of a 100-year ownership lineage.',
  tagline: 'A Century of Ownership. Generational Access.',
  legacyYears: 100,
};

// STRATA Bond - Upfront generational payment (Level 2: $12,500)
const STRATA_BOND = {
  name: 'STRATA BOND',
  subtitle: 'Generational Prepaid Access',
  price: 12500,
  description: 'Secure 100 years of STRATA ownership upfront. Transfer to children, heirs, or designees. One payment. One century.',
  savings: 'Save $5,100 vs annual',
  yearsIncluded: 100,
};

// TACTICAL PROVISION - Physical Pre-Order (Level 3: $18,000 with $1,800 deposit)
const TACTICAL_PROVISION = {
  name: 'TACTICAL PROVISION',
  subtitle: 'Physical Rain Shell — Manufacturing Allocation',
  fullPrice: 18000,
  depositPrice: 1800,
  depositPercent: 10,
  description: 'Secure your physical STRATA shell. $1,800 deposit (10%) locks your manufacturing slot. Balance due upon fabrication completion.',
  status: 'Allocated / Manufacturing Pending',
  leadTime: '8-12 weeks',
};

// Technical specifications keys for translation
const EQUIPMENT_SPECS_KEYS = [
  { key: 'membrane', labelKey: 'spec.membrane', valueKey: 'spec.membrane.value', descKey: 'spec.membrane.desc' },
  { key: 'hydrostatic', labelKey: 'spec.hydrostatic', valueKey: 'spec.hydrostatic.value', descKey: 'spec.hydrostatic.desc' },
  { key: 'hud', labelKey: 'spec.hud', valueKey: 'spec.hud.value', descKey: 'spec.hud.desc' },
  { key: 'weight', labelKey: 'spec.weight', valueKey: 'spec.weight.value', descKey: 'spec.weight.desc' },
];

// Payment mode types - sorted by commitment level

// Payment mode types - sorted by commitment level
type PaymentMode = 'annual' | 'bond' | 'tactical';

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
    strataZone: t(variant.strataZoneKey),
  }));
  
  const [selectedTerrainId, setSelectedTerrainId] = useState(TERRAIN_VARIANTS_BASE[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [systemStatus, setSystemStatus] = useState('NOMINAL');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'tactical'>('tactical'); // Only presale now
  const [isTerrainTransitioning, setIsTerrainTransitioning] = useState(false);
  const [isBondHovered, setIsBondHovered] = useState(false);
  const [isRitualOpen, setIsRitualOpen] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [dimmedBackground, setDimmedBackground] = useState(false);
  const [isSizingOpen, setIsSizingOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [cartItem, setCartItem] = useState<{
    id: string;
    name: string;
    variant: string;
    price: number;
    priceLabel: string;
    image?: string;
  } | null>(null);
  
  // Get the selected terrain with translations
  const selectedTerrain = TERRAIN_VARIANTS.find(v => v.id === selectedTerrainId) || TERRAIN_VARIANTS[0];
  
  // Handle terrain change with glitch effect
  const handleTerrainChange = (newTerrainId: string) => {
    if (newTerrainId !== selectedTerrainId) {
      setIsTerrainTransitioning(true);
      setTimeout(() => {
        setSelectedTerrainId(newTerrainId);
        setTimeout(() => setIsTerrainTransitioning(false), 400);
      }, 100);
    }
  };
  
  // Dim lights when tactical is selected (presale mode)
  useEffect(() => {
    setDimmedBackground(selectedPaymentMode === 'tactical');
  }, [selectedPaymentMode]);
  
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
    handleTerrainChange(TERRAIN_VARIANTS[nextIdx].id);
  };
  
  const prevTerrain = () => {
    const prevIdx = (currentIndex - 1 + TERRAIN_VARIANTS.length) % TERRAIN_VARIANTS.length;
    handleTerrainChange(TERRAIN_VARIANTS[prevIdx].id);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      toast.success('Presale allocation secured!', {
        description: 'Your manufacturing slot has been reserved.',
        duration: 8000,
      });
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
      // Only tactical/presale mode now
      const { data, error } = await supabase.functions.invoke('create-shop-checkout', {
        body: { 
          mode: 'payment',
          priceType: 'tactical_provision',
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

  // Calculate price for AcquisitionRitual - only tactical now
  const getCurrentPrice = () => TACTICAL_PROVISION.fullPrice;

  const TerrainIcon = selectedTerrain.icon;

  // Get product name for prompt
  const getProductName = () => TACTICAL_PROVISION.name;

  // Handle soft add-to-cart flow - now shows mini cart first
  const handleInitiateAcquisition = useCallback(() => {
    // Add to cart and show mini cart
    const newCartItem = {
      id: `${selectedTerrain.id}-${selectedPaymentMode}-${Date.now()}`,
      name: TACTICAL_PROVISION.name,
      variant: selectedTerrain.name,
      price: TACTICAL_PROVISION.depositPrice,
      priceLabel: `$${TACTICAL_PROVISION.depositPrice.toLocaleString()} deposit`,
      image: selectedTerrain.image,
    };
    setCartItem(newCartItem);
    setIsMiniCartOpen(true);
  }, [selectedTerrain, selectedPaymentMode]);

  const handleMiniCartClose = useCallback(() => {
    setIsMiniCartOpen(false);
  }, []);

  const handleMiniCartCheckout = useCallback(() => {
    setIsMiniCartOpen(false);
    setIsPromptOpen(true);
  }, []);

  const handlePromptConfirm = () => {
    setIsPromptOpen(false);
    setIsRitualOpen(true);
  };

  const handlePromptCancel = () => {
    setIsPromptOpen(false);
  };

    return (
    <div className={`min-h-screen bg-strata-black overflow-hidden transition-all duration-500 ${dimmedBackground ? 'brightness-75' : ''}`}>
      {/* Sizing Tool */}
      <SizingTool
        open={isSizingOpen}
        onOpenChange={setIsSizingOpen}
        onSizeSelected={(size) => {
          setSelectedSize(size);
          toast.success(`Size ${size} selected for your order`);
        }}
      />
      {/* Soft Add-to-Cart Prompt */}
      <AddToCartPrompt
        isOpen={isPromptOpen}
        productName={getProductName()}
        terrainName={selectedTerrain.name}
        paymentMode={selectedPaymentMode}
        price={getCurrentPrice()}
        depositPrice={selectedPaymentMode === 'tactical' ? TACTICAL_PROVISION.depositPrice : undefined}
        onConfirm={handlePromptConfirm}
        onCancel={handlePromptCancel}
      />

      {/* Mini Cart with 3-second auto-dismiss */}
      <MiniCart
        isOpen={isMiniCartOpen}
        item={cartItem}
        onClose={handleMiniCartClose}
        onCheckout={handleMiniCartCheckout}
        autoDismissMs={3000}
      />

      <AcquisitionRitual
        isOpen={isRitualOpen}
        onClose={() => setIsRitualOpen(false)}
        onExecute={handleSubscribe}
        isProcessing={isProcessing}
        selectedTerrain={{
          name: selectedTerrain.name,
          strataZone: selectedTerrain.strataZone,
          color: selectedTerrain.color,
        }}
        paymentMode={selectedPaymentMode}
        price={getCurrentPrice()}
        depositPrice={selectedPaymentMode === 'tactical' ? TACTICAL_PROVISION.depositPrice : undefined}
        isDeposit={selectedPaymentMode === 'tactical'}
      />
      
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
              <div className="relative">
                <HUDGlitchOverlay isActive={isTerrainTransitioning} terrainColor={selectedTerrain.color} />
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
              </div>
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
                        onClick={() => handleTerrainChange(variant.id)}
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

              {/* Thermal Weather Widget */}
              <ThermalWeatherWidget 
                terrainCoordinates={selectedTerrain.coordinates}
                terrainName={selectedTerrain.name}
                compact
              />

              {/* Presale Product Card - Clear CTA */}
              <div className="border-2 border-strata-orange bg-strata-orange/5 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-strata-orange" />
                    <span className="font-mono text-sm uppercase tracking-wider text-strata-orange font-bold">
                      Presale — Physical Shell
                    </span>
                  </div>
                  <Badge className="bg-strata-orange/20 text-strata-orange border-strata-orange/30 font-mono text-[9px] px-2 py-0.5 animate-pulse">
                    OPEN
                  </Badge>
                </div>
                
                {/* Price Display */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-mono font-bold text-strata-white">
                      ${TACTICAL_PROVISION.fullPrice.toLocaleString()}
                    </span>
                    <span className="text-strata-silver/60 font-mono text-sm">total</span>
                  </div>
                  <p className="font-mono text-xs text-strata-silver/60 mt-1">
                    STRATA Shell — {selectedTerrain.name} Edition
                  </p>
                </div>
                
                {/* Deposit Highlight */}
                <div className="p-4 bg-strata-black/50 border border-strata-orange/30 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-strata-orange uppercase tracking-widest">
                        Reserve Today
                      </span>
                      <p className="font-mono text-2xl font-bold text-strata-white mt-1">
                        ${TACTICAL_PROVISION.depositPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[10px] text-strata-silver/50 uppercase">
                        {TACTICAL_PROVISION.depositPercent}% Deposit
                      </span>
                      <p className="font-mono text-[9px] text-strata-silver/40 mt-1">
                        Balance due on fabrication
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Lead Time */}
                <div className="flex items-center gap-2 text-strata-silver/60">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono text-xs">
                    Lead Time: {TACTICAL_PROVISION.leadTime}
                  </span>
                </div>
              </div>

              {/* Labs link removed from public view */}

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
                
                {EQUIPMENT_SPECS_KEYS.map((spec) => (
                  <div 
                    key={spec.key}
                    className="flex items-center justify-between p-3 bg-strata-charcoal/30 border border-strata-steel/20 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-strata-orange/60" />
                      <span className="font-mono text-[10px] text-strata-silver/60 uppercase tracking-wider">
                        {t(spec.labelKey)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm text-strata-white">{t(spec.valueKey)}</span>
                      <p className="font-mono text-[9px] text-strata-silver/40">{t(spec.descKey)}</p>
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

              {/* Sizing Tool Button */}
              <Button
                variant="outline"
                onClick={() => setIsSizingOpen(true)}
                className="w-full border-strata-cyan/30 text-strata-cyan hover:bg-strata-cyan/10"
              >
                <Ruler className="w-4 h-4 mr-2" />
                Find Your Size
                {selectedSize && (
                  <Badge className="ml-2 bg-strata-lume/20 text-strata-lume border-0">
                    {selectedSize}
                  </Badge>
                )}
              </Button>

              {/* PRESALE CTA - Clear and focused */}
              <div className="space-y-4">
                <motion.button
                  onClick={handleInitiateAcquisition}
                  className="w-full relative overflow-hidden group rounded-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {/* Safety Orange background */}
                  <div className="absolute inset-0 bg-strata-orange rounded-xl" />
                  
                  {/* Content */}
                  <div className="relative py-5 px-6 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5 text-black" />
                      <span className="text-lg font-mono font-black uppercase tracking-wider text-black">
                        Reserve Presale — ${TACTICAL_PROVISION.depositPrice.toLocaleString()}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-black/70 uppercase tracking-widest">
                      10% Deposit • Secure Manufacturing Slot
                    </span>
                  </div>
                  
                  {/* Hover effect - glow */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded-xl" />
                </motion.button>
              </div>

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

        {/* Junior Collection Banner */}
        <motion.div 
          className="mt-16 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link 
            to="/kids-collection"
            className="block bg-gradient-to-r from-lavender-500/10 via-lavender-400/5 to-lavender-500/10 border border-lavender-400/30 rounded-xl p-6 hover:border-lavender-400/60 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-lavender-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-lavender-400" />
                </div>
                <div>
                  <p className="font-mono text-[10px] text-lavender-400 uppercase tracking-widest mb-1">
                    Junior Collection
                  </p>
                  <h3 className="text-xl font-instrument text-strata-white">
                    STRATA Kids — Full Collection
                  </h3>
                  <p className="text-strata-silver/60 text-sm mt-1">
                    Ages 2+ • Shell, Cashmere Interiors, Pants & Boots • From $88/year
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-lavender-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>

        {/* Learn More Section */}
        <div className="mt-16">
          <LearnMoreSection 
            title="Continue Exploring"
            variant="compact"
            links={[
              { label: "About LAVANDAR", href: "/about", description: "Our mission and values" },
              { label: "All Features", href: "/features", description: "Platform capabilities" },
              { label: "Back to Home", href: "/", description: "Return to homepage" },
            ]}
          />
        </div>

        {/* Footer */}
        <motion.footer 
          className="mt-8 text-center"
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
