import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Droplets, Wind, Shield, Loader2, Zap, Map, Clock, Activity, Anchor, Snowflake, Sun, Building2, ChevronLeft, ChevronRight, Infinity, Users, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Import terrain-specific jacket renders
import strataShellHUD from "@/assets/strata-shell-hud-jacket.jpg";
import strataShellMarine from "@/assets/strata-shell-marine.jpg";
import strataShellPolar from "@/assets/strata-shell-polar.jpg";
import strataShellDesert from "@/assets/strata-shell-desert.jpg";
import strataShellUrban from "@/assets/strata-shell-urban.jpg";

// Strata-coordinate mapped terrain variants
const TERRAIN_VARIANTS = [
  {
    id: 'standard',
    name: 'CHRONO-TOPO',
    strataZone: 'Default',
    coordinates: { lat: 0, lon: 0 },
    description: 'Standard chronometer + topographic HUD',
    image: strataShellHUD,
    color: 'strata-orange',
    icon: Map,
    climate: 'temperate',
  },
  {
    id: 'marine',
    name: 'BATHYMETRIC',
    strataZone: 'Pacific Marine',
    coordinates: { lat: -36.8485, lon: 174.7633 },
    description: 'Oceanic depth contours — Auckland Basin',
    image: strataShellMarine,
    color: 'cyan-400',
    icon: Anchor,
    climate: 'maritime',
  },
  {
    id: 'polar',
    name: 'GLACIAL',
    strataZone: 'Tromsø Arctic',
    coordinates: { lat: 69.6496, lon: 18.9560 },
    description: 'Ice sheet elevation — Arctic Circle',
    image: strataShellPolar,
    color: 'blue-300',
    icon: Snowflake,
    climate: 'polar',
  },
  {
    id: 'desert',
    name: 'GEOLOGICAL',
    strataZone: 'Sahara Interior',
    coordinates: { lat: 33.8869, lon: 9.5375 },
    description: 'Dune elevation patterns — Saharan terrain',
    image: strataShellDesert,
    color: 'orange-500',
    icon: Sun,
    climate: 'desert',
  },
  {
    id: 'urban',
    name: 'METROPOLITAN',
    strataZone: 'Tokyo Metropolis',
    coordinates: { lat: 35.6762, lon: 139.6503 },
    description: 'Urban density grid — Tokyo infrastructure',
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

const Shop = () => {
  const { t } = useLanguage();
  const [selectedTerrain, setSelectedTerrain] = useState(TERRAIN_VARIANTS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [systemStatus, setSystemStatus] = useState('NOMINAL');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'annual' | 'bond'>('annual');

  const currentIndex = TERRAIN_VARIANTS.findIndex(t => t.id === selectedTerrain.id);
  
  const nextTerrain = () => {
    const nextIdx = (currentIndex + 1) % TERRAIN_VARIANTS.length;
    setSelectedTerrain(TERRAIN_VARIANTS[nextIdx]);
  };
  
  const prevTerrain = () => {
    const prevIdx = (currentIndex - 1 + TERRAIN_VARIANTS.length) % TERRAIN_VARIANTS.length;
    setSelectedTerrain(TERRAIN_VARIANTS[prevIdx]);
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-strata-lume animate-pulse" />
              <span className="font-mono text-[10px] text-strata-silver/60 uppercase tracking-[0.3em]">
                Equipment Lab / Store Protocol
              </span>
            </div>
            <div className="flex items-center gap-4">
              <TechReadout label="SYS" value={systemStatus} pulse={systemStatus !== 'NOMINAL'} />
              <LiveClock />
            </div>
          </div>
          
          <div className="border border-strata-steel/20 rounded-lg p-6 bg-strata-charcoal/30 backdrop-blur">
            <Badge className="mb-4 bg-strata-cyan/10 text-strata-cyan border-strata-cyan/30 font-mono text-[10px] uppercase tracking-wider">
              Terrain-Mapped Protocol
            </Badge>
            <h1 className="text-3xl md:text-5xl font-instrument text-strata-white mb-2">
              {STRATA_OWNERSHIP.name}
            </h1>
            <p className="text-strata-orange font-mono text-sm uppercase tracking-[0.2em]">
              {STRATA_OWNERSHIP.subtitle}
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
                  Select Strata Terrain
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
                        onClick={() => setSelectedTerrain(variant)}
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
                {STRATA_OWNERSHIP.tagline}
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
                    Century Protocol
                  </span>
                </div>
                <p className="text-strata-silver/80 text-xs font-mono">
                  This is not a limited run. This is the start of <span className="text-strata-white">100 years</span> of ownership.
                </p>
              </div>

              {/* Payment Mode Toggle */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-strata-silver/60 uppercase tracking-[0.2em]">
                  Select Ownership Mode
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
                        Annual
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
                    <span className="text-strata-silver/60 font-mono text-xs">/year</span>
                  </div>
                  <p className="text-strata-silver/50 font-mono text-[9px] mt-1">Post-first-year billing</p>
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
                        STRATA Bond
                      </span>
                      <Badge className="bg-strata-lume/20 text-strata-lume border-strata-lume/30 font-mono text-[8px] px-1.5 py-0">
                        LEGACY
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
                    <span className="text-strata-silver/60 font-mono text-xs">one-time</span>
                  </div>
                  <p className="text-strata-silver/50 font-mono text-[9px] mt-1">{STRATA_BOND.savings} • 100 years prepaid</p>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-strata-steel/20">
                    <Users className={`w-3 h-3 ${selectedPaymentMode === 'bond' ? 'text-strata-lume/80' : 'text-strata-silver/40'}`} />
                    <span className={`font-mono text-[9px] ${selectedPaymentMode === 'bond' ? 'text-strata-lume/80' : 'text-strata-silver/40'}`}>
                      Transferable to children & heirs
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
                      Selected Terrain Map
                    </p>
                    <p className={`text-${selectedTerrain.color} font-semibold`}>
                      {selectedTerrain.name} — {selectedTerrain.strataZone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-strata-silver/80 text-sm leading-relaxed border-l-2 border-strata-cyan/30 pl-4">
                {STRATA_OWNERSHIP.description}
              </p>

              {/* Equipment Specs */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-1 bg-strata-cyan" />
                  <span className="font-mono text-[10px] text-strata-cyan uppercase tracking-[0.2em]">
                    Technical Specifications
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
                    Initiating Protocol...
                  </>
                ) : selectedPaymentMode === 'bond' ? (
                  <>
                    <Gift className="w-4 h-4 mr-3" />
                    Secure STRATA Bond — ${STRATA_BOND.price.toLocaleString()}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 mr-3" />
                    Activate {selectedTerrain.name} — ${STRATA_OWNERSHIP.price}/yr
                  </>
                )}
              </Button>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 text-strata-silver/40 text-[9px] font-mono uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Secure
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Infinity className="w-3 h-3" />
                  100-Year Legacy
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Generational
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
            <span>Equipment Lab</span>
            <span>•</span>
            <span>Protocol v2.1</span>
            <div className="w-1.5 h-1.5 rotate-45 border border-strata-cyan/30" />
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Shop;
