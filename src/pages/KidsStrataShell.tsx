import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Shield, Droplets, Cloud, Star, Sparkles, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeatherData } from "@/hooks/useWeatherData";

// Kids product configuration
const KIDS_SHELL = {
  name: 'STRATA SHELL — POLAR JUNIOR',
  subtitle: 'Adventure-Ready Protection',
  price: 148,
  interval: 'year',
  description: 'White vulcanized rubber shell with embedded lavender emblem. Designed for explorers ages 4-12.',
  features: [
    { icon: Shield, label: 'Hydrophobic membrane' },
    { icon: Droplets, label: 'Rain-ready protection' },
    { icon: Heart, label: 'Soft-touch interior' },
    { icon: Star, label: 'Reflective safety elements' },
  ],
  sizes: ['XS (4-5)', 'S (6-7)', 'M (8-9)', 'L (10-12)'],
};

// Lavender emblem animation
const LavenderEmblem = () => (
  <motion.div 
    className="relative w-24 h-24"
    animate={{ 
      rotate: [0, 5, -5, 0],
      scale: [1, 1.02, 0.98, 1],
    }}
    transition={{ 
      duration: 8, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
  >
    {/* Outer ring */}
    <div className="absolute inset-0 rounded-full border-2 border-lavender-400/60" />
    
    {/* Inner gradient */}
    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-lavender-300 via-lavender-400 to-lavender-500 opacity-90" />
    
    {/* Sparkle overlay */}
    <motion.div
      className="absolute inset-4 rounded-full bg-white/20"
      animate={{ opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    
    {/* Center icon */}
    <div className="absolute inset-0 flex items-center justify-center">
      <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
    </div>
  </motion.div>
);

// Floating clouds decoration
const FloatingClouds = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          top: `${15 + i * 15}%`,
          left: `${-10 + i * 20}%`,
        }}
        animate={{
          x: [0, 100, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 20 + i * 5,
          repeat: Infinity,
          delay: i * 2,
          ease: "linear",
        }}
      >
        <Cloud className="w-16 h-16 text-lavender-200/30" />
      </motion.div>
    ))}
  </div>
);

// Live clock component
const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="font-mono text-lavender-400 text-xs tracking-[0.2em]">
      {time.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })}
    </div>
  );
};

const KidsStrataShell = () => {
  const { t } = useLanguage();
  const [selectedSize, setSelectedSize] = useState(KIDS_SHELL.sizes[1]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { formatTemp } = useTemperatureUnit();
  const { latitude, longitude, hasLocation, requestLocation } = useGeolocation();
  const { weather, loading: weatherLoading } = useWeatherData(
    latitude ?? undefined,
    longitude ?? undefined
  );

  useEffect(() => {
    if (!hasLocation) {
      requestLocation();
    }
  }, [hasLocation, requestLocation]);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-shop-checkout', {
        body: { 
          mode: 'subscription',
          priceType: 'kids_shell',
          terrainVariant: 'polar_junior',
          strataZone: 'Junior Explorer',
          size: selectedSize,
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success("Checkout opened in new tab");
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout coming soon! Product in development.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-lavender-50/30 to-white overflow-hidden">
      {/* Floating clouds background */}
      <FloatingClouds />
      
      {/* Soft grid overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--lavender-300)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--lavender-300)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.header 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-3 h-3 rounded-full bg-lavender-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                Junior Collection
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <LanguageToggle variant="compact" />
              {weather && !weatherLoading && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-lavender-100/50 rounded-full">
                  <Cloud className="w-4 h-4 text-lavender-500" />
                  <span className="font-mono text-sm text-foreground">
                    {formatTemp(weather.current.temp)}
                  </span>
                </div>
              )}
              <LiveClock />
            </div>
          </div>

          <div className="text-center mb-8">
            <Badge className="mb-4 bg-lavender-100 text-lavender-600 border-lavender-200 font-mono text-xs">
              Ages 4-12
            </Badge>
            <h1 className="text-4xl md:text-5xl font-instrument text-foreground mb-3">
              {KIDS_SHELL.name}
            </h1>
            <p className="text-lavender-600 font-medium text-lg">
              {KIDS_SHELL.subtitle}
            </p>
          </div>
        </motion.header>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Product Visual */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Main product card */}
            <div className="relative bg-white rounded-3xl shadow-xl shadow-lavender-200/50 border border-lavender-100 p-8 overflow-hidden">
              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-lavender-300/50 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-lavender-300/50 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-lavender-300/50 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-lavender-300/50 rounded-br-lg" />
              
              {/* Product render placeholder */}
              <div className="aspect-[4/5] bg-gradient-to-br from-muted/30 via-white to-lavender-50 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                {/* White shell silhouette */}
                <motion.div 
                  className="relative"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {/* Shell body representation */}
                  <div className="w-64 h-80 bg-gradient-to-b from-white via-muted/20 to-muted/40 rounded-t-[80px] rounded-b-3xl shadow-2xl shadow-muted/30 relative">
                    {/* Surface texture lines */}
                    <div className="absolute inset-0 rounded-t-[80px] rounded-b-3xl opacity-20">
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i} 
                          className="absolute w-full h-px bg-muted-foreground/30"
                          style={{ top: `${15 + i * 10}%` }}
                        />
                      ))}
                    </div>
                    
                    {/* Collar */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-12 bg-gradient-to-b from-muted/30 to-white rounded-b-[40px] border-b border-border" />
                    
                    {/* Lavender emblem placement */}
                    <div className="absolute top-16 left-1/2 -translate-x-1/2">
                      <LavenderEmblem />
                    </div>
                    
                    {/* Zipper line */}
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-1 h-48 bg-gradient-to-b from-lavender-300 to-lavender-400 rounded-full opacity-60" />
                    
                    {/* Pocket detail */}
                    <div className="absolute bottom-20 left-6 w-16 h-10 border border-border rounded-lg bg-white/50" />
                    <div className="absolute bottom-20 right-6 w-16 h-10 border border-border rounded-lg bg-white/50" />
                    
                    {/* Reflective safety strip */}
                    <motion.div 
                      className="absolute bottom-8 left-4 right-4 h-2 bg-gradient-to-r from-lavender-200 via-white to-lavender-200 rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  
                  {/* Sleeve hints */}
                  <div className="absolute top-24 -left-8 w-12 h-32 bg-gradient-to-r from-muted/30 to-white rounded-l-full transform -rotate-12" />
                  <div className="absolute top-24 -right-8 w-12 h-32 bg-gradient-to-l from-muted/30 to-white rounded-r-full transform rotate-12" />
                </motion.div>
                
                {/* Floating sparkles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${10 + Math.random() * 80}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-lavender-400" />
                  </motion.div>
                ))}
              </div>
              
              {/* Product label */}
              <div className="mt-6 text-center">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  White Vulcanized Rubber
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-border shadow-inner" />
                  <span className="text-xs text-muted-foreground">Arctic White</span>
                  <span className="text-xs text-muted-foreground/50 mx-2">×</span>
                  <div className="w-4 h-4 rounded-full bg-lavender-400" />
                  <span className="text-xs text-muted-foreground">Lavender Emblem</span>
                </div>
              </div>
            </div>
            
            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {KIDS_SHELL.features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-lavender-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <feature.icon className="w-4 h-4 text-lavender-500" />
                  <span className="text-xs text-foreground">{feature.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Product Details & Purchase */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-lavender-100/50 border border-lavender-100">
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Designed for Young Explorers
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {KIDS_SHELL.description} Features the same hydrophobic membrane technology 
                as our adult collection, scaled and softened for growing adventurers.
              </p>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-lavender-50 rounded-xl">
                  <Shield className="w-5 h-5 text-lavender-500" />
                  <span className="text-sm text-foreground">Child-safe materials</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-lavender-50 rounded-xl">
                  <Star className="w-5 h-5 text-lavender-500" />
                  <span className="text-sm text-foreground">Reflective safety</span>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-lavender-100/50 border border-lavender-100">
              <h3 className="font-medium text-foreground mb-4">Select Size</h3>
              <div className="grid grid-cols-2 gap-3">
                {KIDS_SHELL.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      py-3 px-4 rounded-xl font-mono text-sm transition-all
                      ${selectedSize === size 
                        ? 'bg-lavender-500 text-white shadow-lg shadow-lavender-300/50' 
                        : 'bg-lavender-50 text-foreground hover:bg-lavender-100'
                      }
                    `}
                  >
                    {size}
                    {selectedSize === size && (
                      <CheckCircle2 className="w-4 h-4 inline-block ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing & CTA */}
            <div className="bg-gradient-to-br from-lavender-500 to-lavender-600 rounded-2xl p-6 text-white shadow-xl shadow-lavender-300/50">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold">${KIDS_SHELL.price}</span>
                <span className="text-lavender-200">/{KIDS_SHELL.interval}</span>
              </div>
              <p className="text-lavender-100 text-sm mb-6">
                Annual protection program • Cancel anytime
              </p>
              
              <Button
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full bg-white text-lavender-600 hover:bg-lavender-50 font-semibold py-6 text-lg rounded-xl shadow-lg"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    Begin Adventure
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
              
              <p className="text-center text-lavender-200 text-xs mt-4">
                Secure checkout • 30-day satisfaction guarantee
              </p>
            </div>

            {/* Weather recommendation */}
            {weather && !weatherLoading && (
              <motion.div 
                className="bg-white rounded-2xl p-5 shadow-lg shadow-lavender-100/50 border border-lavender-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-lavender-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-lavender-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Current conditions: {weather.current.condition}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {weather.current.temp < 60 
                        ? "Perfect weather for the STRATA Shell!"
                        : "Great for unexpected rain adventures"
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Footer note */}
        <motion.footer 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-muted-foreground text-sm">
            Part of the STRATA Collection • <span className="text-lavender-500">Junior Edition</span>
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default KidsStrataShell;
