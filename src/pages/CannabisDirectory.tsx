import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf, MapPin, Navigation, Search, Clock, Star, Phone, ExternalLink,
  ChevronRight, Activity, Sparkles, Shield, Heart, Brain, Moon, Zap,
  ThermometerSun, Droplets, Eye, AlertCircle, Check, Loader2,
  Cannabis, Compass, Layers, Signal, BarChart3, Info, Car
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useGeolocation } from "@/hooks/useGeolocation";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURAL ELEMENTS - AAL Precision & Kengo Kuma Layering
// ═══════════════════════════════════════════════════════════════════════════════

const KumaSlats = ({ count = 12 }: { count?: number }) => (
  <div className="absolute inset-0 flex justify-between pointer-events-none overflow-hidden opacity-20">
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        className="w-px bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ delay: i * 0.02, duration: 0.8 }}
      />
    ))}
  </div>
);

const RuledSurface = ({ lines = 8 }: { lines?: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(lines)].map((_, i) => (
      <div
        key={i}
        className="absolute h-px bg-gradient-to-r from-transparent via-emerald-600/10 to-transparent"
        style={{ top: `${12 + i * 12}%`, left: 0, right: 0 }}
      />
    ))}
  </div>
);

const PrecisionCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const positions = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0 rotate-90',
    bl: 'bottom-0 left-0 -rotate-90',
    br: 'bottom-0 right-0 rotate-180'
  };
  
  return (
    <div className={`absolute w-6 h-6 ${positions[position]} pointer-events-none`}>
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M0 0 L24 0 L24 3 L3 3 L3 24 L0 24 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-emerald-500/40" />
        <circle cx="1.5" cy="1.5" r="1" className="fill-emerald-500/60" />
      </svg>
    </div>
  );
};

const GlassPanel = ({ children, className = "", variant = "default" }: { 
  children: React.ReactNode; 
  className?: string;
  variant?: "default" | "elevated" | "accent";
}) => {
  const variants = {
    default: "bg-zinc-900/60 backdrop-blur-xl border-zinc-700/30",
    elevated: "bg-zinc-800/70 backdrop-blur-2xl border-emerald-500/20 shadow-xl shadow-emerald-500/5",
    accent: "bg-emerald-950/40 backdrop-blur-xl border-emerald-500/30",
  };
  
  return (
    <motion.div 
      className={`relative border rounded-lg ${variants[variant]} ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <PrecisionCorner position="tl" />
      <PrecisionCorner position="tr" />
      <PrecisionCorner position="bl" />
      <PrecisionCorner position="br" />
      {children}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATA TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Strain {
  name: string;
  type: string;
  thcPercent: number;
  cbdPercent: number;
  dominantTerpenes: string[];
  benefits: string[];
  description: string;
  bestFor: string;
  potentialSideEffects: string[];
}

interface Dispensary {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  distance: number;
  hours: { open: string; close: string; isOpen: boolean };
  coordinates: { lat: number; lng: number };
  features: string[];
  directionsUrl: string;
  website: string;
  products: { id: string; name: string; type: string; thc: number; cbd: number; price: number; unit: string }[];
}

interface TerpeneInfo {
  name: string;
  aroma: string;
  benefits: string[];
}

interface RecommendationResult {
  condition: string;
  profile: {
    recommendedTerpenes: TerpeneInfo[];
    recommendedCannabinoids: { name: string; type: string; benefits: string[] }[];
    strainType: string;
  };
  recommendations: Strain[];
}

// Medical conditions with icons
const CONDITIONS = [
  { id: "pain", label: "Chronic Pain", icon: Heart, color: "text-rose-400" },
  { id: "anxiety", label: "Anxiety", icon: Brain, color: "text-violet-400" },
  { id: "insomnia", label: "Insomnia", icon: Moon, color: "text-indigo-400" },
  { id: "depression", label: "Depression", icon: Activity, color: "text-amber-400" },
  { id: "inflammation", label: "Inflammation", icon: ThermometerSun, color: "text-orange-400" },
  { id: "nausea", label: "Nausea", icon: Droplets, color: "text-teal-400" },
  { id: "focus", label: "Focus & Energy", icon: Zap, color: "text-yellow-400" },
  { id: "migraine", label: "Migraines", icon: AlertCircle, color: "text-red-400" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="font-mono text-sm tracking-widest">
      <span className="text-emerald-400">
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
      </span>
      <span className="text-zinc-500 ml-2">LOCAL</span>
    </div>
  );
};

const ConditionCard = ({ condition, isSelected, onSelect }: {
  condition: typeof CONDITIONS[0];
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onSelect}
    className={`relative p-4 rounded-lg border transition-all duration-300 text-left ${
      isSelected 
        ? "bg-emerald-950/60 border-emerald-500/50" 
        : "bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700/50"
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-500/20' : 'bg-zinc-800/60'}`}>
        <condition.icon className={`w-5 h-5 ${isSelected ? 'text-emerald-400' : condition.color}`} />
      </div>
      <span className={`text-sm font-light ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
        {condition.label}
      </span>
    </div>
    {isSelected && (
      <motion.div
        layoutId="condition-indicator"
        className="absolute top-2 right-2"
        initial={false}
      >
        <Check className="w-4 h-4 text-emerald-400" />
      </motion.div>
    )}
  </motion.button>
);

const StrainCard = ({ strain, index }: { strain: Strain; index: number }) => {
  const typeColors: Record<string, string> = {
    indica: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    sativa: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    hybrid: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassPanel variant="elevated" className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-light text-white tracking-wide">{strain.name}</h3>
            <Badge className={`mt-1 text-[10px] uppercase tracking-wider border ${typeColors[strain.type.toLowerCase()] || typeColors.hybrid}`}>
              {strain.type}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-500 uppercase tracking-wider">THC</div>
            <div className="text-xl font-light text-white">{strain.thcPercent}%</div>
          </div>
        </div>

        {/* Cannabinoid Bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-zinc-800/50 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              style={{ width: `${Math.min(strain.thcPercent * 3, 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-zinc-500">CBD {strain.cbdPercent}%</span>
        </div>

        {/* Terpenes */}
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Dominant Terpenes</div>
          <div className="flex flex-wrap gap-1">
            {strain.dominantTerpenes.map((terpene) => (
              <Badge key={terpene} variant="outline" className="text-[9px] bg-zinc-800/40 border-zinc-700/50 text-zinc-300">
                {terpene}
              </Badge>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Medical Benefits</div>
          <div className="flex flex-wrap gap-1">
            {strain.benefits.map((benefit) => (
              <Badge key={benefit} className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                {benefit}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 leading-relaxed mb-3">{strain.description}</p>

        {/* Best For & Side Effects */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] text-zinc-400">Best for: {strain.bestFor}</span>
          </div>
          {strain.potentialSideEffects?.length > 0 && (
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3 text-amber-400/60" />
              <span className="text-[9px] text-zinc-500">{strain.potentialSideEffects.join(", ")}</span>
            </div>
          )}
        </div>
      </GlassPanel>
    </motion.div>
  );
};

const DispensaryCard = ({ dispensary, index }: { dispensary: Dispensary; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.08 }}
  >
    <GlassPanel className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-light text-white">{dispensary.name}</h3>
            {dispensary.hours.isOpen && (
              <Badge className="text-[8px] bg-emerald-500/20 border-emerald-500/30 text-emerald-300">OPEN</Badge>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">{dispensary.type}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-sm text-white">{dispensary.rating}</span>
          </div>
          <p className="text-[10px] text-zinc-500">{dispensary.reviewCount} reviews</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
        <MapPin className="w-3 h-3" />
        <span>{dispensary.address}</span>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Navigation className="w-3 h-3 text-emerald-400" />
          <span>{dispensary.distance} mi</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Clock className="w-3 h-3" />
          <span>{dispensary.hours.open} - {dispensary.hours.close}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Phone className="w-3 h-3" />
          <span>{dispensary.phone}</span>
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-1 mb-4">
        {dispensary.features.slice(0, 3).map((feature) => (
          <Badge key={feature} variant="outline" className="text-[8px] bg-zinc-800/40 border-zinc-700/50 text-zinc-400">
            {feature}
          </Badge>
        ))}
      </div>

      {/* Products Preview */}
      {dispensary.products?.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-zinc-800/30 border border-zinc-800/50">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Available Products</div>
          <div className="space-y-1.5">
            {dispensary.products.slice(0, 2).map((product) => (
              <div key={product.id} className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">{product.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">${product.price}</span>
                  <span className="text-zinc-600">/{product.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={dispensary.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs">
            <Car className="w-3 h-3 mr-1" />
            Directions
          </Button>
        </a>
        <a href={dispensary.website} target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs">
            <ExternalLink className="w-3 h-3" />
          </Button>
        </a>
      </div>
    </GlassPanel>
  </motion.div>
);

const TerpeneInfoCard = ({ terpenes }: { terpenes: TerpeneInfo[] }) => (
  <GlassPanel variant="accent" className="p-4 mt-4">
    <div className="flex items-center gap-2 mb-3">
      <Leaf className="w-4 h-4 text-emerald-400" />
      <span className="text-xs uppercase tracking-wider text-emerald-300">Recommended Terpene Profile</span>
    </div>
    <div className="grid gap-2">
      {terpenes.slice(0, 3).map((terpene) => (
        <div key={terpene.name} className="p-2 rounded bg-zinc-900/40 border border-zinc-800/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-white capitalize">{terpene.name}</span>
            <span className="text-[10px] text-zinc-500">{terpene.aroma}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {terpene.benefits.slice(0, 3).map((benefit) => (
              <span key={benefit} className="text-[9px] text-emerald-400/80">{benefit}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </GlassPanel>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const CannabisDirectory = () => {
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [dispensaries, setDispensaries] = useState<Dispensary[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [isLoadingDisp, setIsLoadingDisp] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10);
  
  const { latitude, longitude, loading: geoLoading, error: geoError } = useGeolocation();

  // Fetch dispensaries when location available
  useEffect(() => {
    if (latitude && longitude && ageVerified) {
      fetchDispensaries();
    }
  }, [latitude, longitude, ageVerified, searchRadius]);

  const fetchDispensaries = async () => {
    if (!latitude || !longitude) return;
    
    setIsLoadingDisp(true);
    try {
      const { data, error } = await supabase.functions.invoke('dispensary-search', {
        body: { lat: latitude, lng: longitude, radius: searchRadius }
      });
      
      if (error) throw error;
      setDispensaries(data.dispensaries || []);
    } catch (err) {
      console.error('Dispensary search error:', err);
      toast.error('Failed to find nearby dispensaries');
    }
    setIsLoadingDisp(false);
  };

  const fetchRecommendations = async () => {
    if (!selectedCondition) {
      toast.error('Please select a medical condition');
      return;
    }

    setIsLoadingRecs(true);
    try {
      const { data, error } = await supabase.functions.invoke('cannabis-recommend', {
        body: { 
          condition: selectedCondition,
          location: latitude && longitude ? `${latitude},${longitude}` : 'Massachusetts'
        }
      });
      
      if (error) throw error;
      setRecommendations(data);
      toast.success('Recommendations generated');
    } catch (err: any) {
      console.error('Recommendation error:', err);
      if (err.message?.includes('429')) {
        toast.error('Rate limit reached. Please try again shortly.');
      } else {
        toast.error('Failed to generate recommendations');
      }
    }
    setIsLoadingRecs(false);
  };

  // Age verification gate
  if (!ageVerified) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black" />
          <RuledSurface lines={12} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05),transparent_60%)]" />
        </div>
        
        <GlassPanel variant="elevated" className="max-w-md w-full p-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
            >
              <Shield className="w-10 h-10 text-emerald-400" />
            </motion.div>
            
            <h1 className="text-2xl font-extralight text-white tracking-wide mb-2">Age Verification</h1>
            <p className="text-sm text-zinc-400 mb-6">
              This platform contains medical cannabis information for adults 21+ or medical patients 18+ with valid authorization.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => setAgeVerified(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                I am 21+ or a Medical Patient
              </Button>
              <Link to="/">
                <Button variant="ghost" className="w-full text-zinc-400 hover:text-white">
                  Exit
                </Button>
              </Link>
            </div>
            
            <p className="text-[10px] text-zinc-600 mt-6">
              By entering, you confirm you are of legal age in your jurisdiction.
            </p>
          </div>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Architectural Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black" />
        <div className="absolute inset-0 flex justify-between px-8 opacity-[0.03]">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-px h-full bg-white" />
          ))}
        </div>
        <RuledSurface lines={15} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.04),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassPanel variant="elevated" className="p-5 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                >
                  <Leaf className="w-6 h-6 text-emerald-400" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-extralight text-white tracking-wide">
                    Medical Cannabis Directory
                  </h1>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                    AI-Powered Strain Recommendations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Signal className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-zinc-500">
                    {latitude && longitude ? 'LOCATION ACTIVE' : 'NO LOCATION'}
                  </span>
                </div>
                <LiveClock />
              </div>
            </div>
            
            {/* Location Status */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-zinc-400">
                    {geoLoading ? 'Detecting...' : geoError ? 'Location unavailable' : `${latitude?.toFixed(4)}, ${longitude?.toFixed(4)}`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-zinc-400">{dispensaries.length} dispensaries found</span>
                </div>
              </div>
              <Link to="/northeast" className="text-[10px] text-emerald-400/70 hover:text-emerald-400 uppercase tracking-wider">
                Weather Intel
              </Link>
            </div>
          </GlassPanel>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Recommendations */}
          <div className="space-y-6">
            {/* Condition Selection */}
            <GlassPanel className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-light text-white">Select Your Condition</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {CONDITIONS.map((condition) => (
                  <ConditionCard
                    key={condition.id}
                    condition={condition}
                    isSelected={selectedCondition === condition.id}
                    onSelect={() => setSelectedCondition(condition.id)}
                  />
                ))}
              </div>

              <Button
                onClick={fetchRecommendations}
                disabled={!selectedCondition || isLoadingRecs}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
              >
                {isLoadingRecs ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Recommendations
                  </>
                )}
              </Button>
            </GlassPanel>

            {/* Recommendations Results */}
            <AnimatePresence>
              {recommendations && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Terpene Profile */}
                  {recommendations.profile?.recommendedTerpenes && (
                    <TerpeneInfoCard terpenes={recommendations.profile.recommendedTerpenes} />
                  )}
                  
                  {/* Strain Cards */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-light text-white">Recommended Strains</span>
                    </div>
                    {recommendations.recommendations.map((strain, index) => (
                      <StrainCard key={strain.name} strain={strain} index={index} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Dispensaries */}
          <div className="space-y-4">
            <GlassPanel className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-light text-white">Dispensaries Near You</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500">Radius:</span>
                  <select
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(Number(e.target.value))}
                    className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
                  >
                    <option value={5}>5 mi</option>
                    <option value={10}>10 mi</option>
                    <option value={25}>25 mi</option>
                    <option value={50}>50 mi</option>
                  </select>
                </div>
              </div>

              {isLoadingDisp ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                </div>
              ) : dispensaries.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {dispensaries.map((dispensary, index) => (
                    <DispensaryCard key={dispensary.id} dispensary={dispensary} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-500">No dispensaries found in your area</p>
                  <p className="text-xs text-zinc-600 mt-1">Try increasing the search radius</p>
                </div>
              )}
            </GlassPanel>

            {/* Legal Disclaimer */}
            <GlassPanel className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    <span className="text-amber-400">Medical Disclaimer:</span> This information is for educational purposes only and not medical advice. Consult a healthcare provider before using cannabis. Cannabis laws vary by jurisdiction. Always verify legal status in your area.
                  </p>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-zinc-700" />
            <Leaf className="w-3 h-3 text-zinc-600" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-zinc-700" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
            Strata Medical Intelligence
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CannabisDirectory;
