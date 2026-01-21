import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Shield, Droplets, Cloud, Star, Sparkles, MapPin, CheckCircle2, ArrowRight, ShoppingCart, Loader2, Shirt, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeatherData } from "@/hooks/useWeatherData";
import { Link } from "react-router-dom";

// Import product images
import kidsShellImage from "@/assets/kids-strata-shell-white.jpg";
import kidsCashmereImage from "@/assets/kids-cashmere-interior.jpg";
import kidsPantsImage from "@/assets/kids-explorer-pants.jpg";
import kidsBootsImage from "@/assets/kids-pathfinder-boots.jpg";

// Kids product configurations
const KIDS_PRODUCTS = {
  shell: {
    id: 'kids_shell',
    name: 'STRATA SHELL — POLAR JUNIOR',
    category: 'Outerwear',
    subtitle: 'Adventure-Ready Protection',
    price: 148,
    interval: 'year',
    description: 'White vulcanized rubber shell with embedded lavender emblem. Designed for explorers ages 4-12.',
    ageRange: 'Ages 4-12',
    features: [
      { icon: Shield, label: 'Hydrophobic membrane' },
      { icon: Droplets, label: 'Rain-ready protection' },
      { icon: Heart, label: 'Soft-touch interior' },
      { icon: Star, label: 'Reflective safety elements' },
    ],
    sizes: ['XS (4-5)', 'S (6-7)', 'M (8-9)', 'L (10-12)'],
    image: kidsShellImage,
    link: '/kids',
  },
  cashmere: {
    id: 'kids_cashmere',
    name: 'CASHMERE INTERIOR — CLOUD LAYER',
    category: 'Base Layer',
    subtitle: 'Ultra-Soft Warmth',
    price: 98,
    interval: 'year',
    description: 'Premium cashmere-blend interior layer. Hypoallergenic, breathable, and impossibly soft against young skin.',
    ageRange: 'Ages 2+',
    features: [
      { icon: Heart, label: '100% cashmere blend' },
      { icon: Cloud, label: 'Featherlight comfort' },
      { icon: Star, label: 'Hypoallergenic' },
      { icon: Shield, label: 'Temperature regulating' },
    ],
    sizes: ['2T', '3T', '4T', 'XS (4-5)', 'S (6-7)', 'M (8-9)', 'L (10-12)'],
    image: kidsCashmereImage,
    link: '/kids/cashmere',
  },
  pants: {
    id: 'kids_pants',
    name: 'STRATA PANTS — EXPLORER',
    category: 'Bottoms',
    subtitle: 'All-Terrain Mobility',
    price: 88,
    interval: 'year',
    description: 'Reinforced knee panels, water-resistant fabric, and stretch waistband. Built for playground adventures and beyond.',
    ageRange: 'Ages 2+',
    features: [
      { icon: Shield, label: 'Reinforced knees' },
      { icon: Droplets, label: 'Water-resistant' },
      { icon: Star, label: 'Stretch waistband' },
      { icon: Heart, label: 'Ultra-durable fabric' },
    ],
    sizes: ['2T', '3T', '4T', 'XS (4-5)', 'S (6-7)', 'M (8-9)', 'L (10-12)'],
    image: kidsPantsImage,
    link: '/kids/pants',
  },
  boots: {
    id: 'kids_boots',
    name: 'STRATA BOOTS — PATHFINDER',
    category: 'Footwear',
    subtitle: 'Grip & Go Confidence',
    price: 128,
    interval: 'year',
    description: 'Anti-slip treads, waterproof membrane, and easy-pull loops. Designed for puddle-jumpers and trail-blazers alike.',
    ageRange: 'Ages 2+',
    features: [
      { icon: Footprints, label: 'Anti-slip treads' },
      { icon: Droplets, label: 'Waterproof membrane' },
      { icon: Star, label: 'Easy-pull loops' },
      { icon: Shield, label: 'Ankle support' },
    ],
    sizes: ['5C', '6C', '7C', '8C', '9C', '10C', '11C', '12C', '13C', '1Y', '2Y', '3Y'],
    image: kidsBootsImage,
    link: '/kids/boots',
  },
};

// Product type
type ProductKey = keyof typeof KIDS_PRODUCTS;

// Lavender emblem animation
const LavenderEmblem = () => (
  <motion.div 
    className="relative w-16 h-16"
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
    <div className="absolute inset-0 rounded-full border-2 border-lavender-400/60" />
    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-lavender-300 via-lavender-400 to-lavender-500 opacity-90" />
    <motion.div
      className="absolute inset-4 rounded-full bg-white/20"
      animate={{ opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <Sparkles className="w-6 h-6 text-white drop-shadow-lg" />
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

// Product card component
const ProductCard = ({ 
  product, 
  index,
  onQuickBuy,
  isProcessing,
  processingId,
}: { 
  product: typeof KIDS_PRODUCTS[ProductKey];
  index: number;
  onQuickBuy: (productId: string, size: string) => void;
  isProcessing: boolean;
  processingId: string | null;
}) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[Math.min(2, product.sizes.length - 1)]);
  const [showSizes, setShowSizes] = useState(false);

  const getCategoryIcon = () => {
    switch (product.category) {
      case 'Outerwear': return Shield;
      case 'Base Layer': return Heart;
      case 'Bottoms': return Shirt;
      case 'Footwear': return Footprints;
      default: return Star;
    }
  };

  const CategoryIcon = getCategoryIcon();

  return (
    <motion.div
      className="relative bg-white rounded-3xl shadow-xl shadow-lavender-200/50 border border-lavender-100 overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1 }}
    >
      {/* Category badge */}
      <div className="absolute top-4 left-4 z-10">
        <Badge className="bg-lavender-100 text-lavender-600 border-lavender-200 font-mono text-[10px]">
          {product.category}
        </Badge>
      </div>

      {/* Age badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge variant="outline" className="bg-white/90 text-muted-foreground border-lavender-200 font-mono text-[10px]">
          {product.ageRange}
        </Badge>
      </div>

      {/* Image / Placeholder */}
      <div className="aspect-square bg-gradient-to-br from-lavender-50 to-lavender-100 relative overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <CategoryIcon className="w-20 h-20 text-lavender-300 mb-4" />
            <span className="font-mono text-[10px] text-lavender-400 uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-instrument text-lg text-foreground mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-lavender-600 text-sm font-medium mb-3">
          {product.subtitle}
        </p>
        <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.features.slice(0, 2).map((feature) => (
            <div key={feature.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <feature.icon className="w-3 h-3 text-lavender-400" />
              <span>{feature.label}</span>
            </div>
          ))}
        </div>

        {/* Size selector toggle */}
        <button
          onClick={() => setShowSizes(!showSizes)}
          className="w-full text-left text-xs font-mono text-lavender-500 hover:text-lavender-600 mb-3"
        >
          Size: {selectedSize} ▾
        </button>

        {/* Expanded sizes */}
        {showSizes && (
          <motion.div 
            className="flex flex-wrap gap-1.5 mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  setShowSizes(false);
                }}
                className={`
                  px-2 py-1 rounded-lg font-mono text-[10px] transition-all
                  ${selectedSize === size 
                    ? 'bg-lavender-500 text-white' 
                    : 'bg-lavender-50 text-foreground hover:bg-lavender-100'
                  }
                `}
              >
                {size}
              </button>
            ))}
          </motion.div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-2xl font-bold text-foreground">${product.price}</span>
            <span className="text-muted-foreground text-sm">/{product.interval}</span>
          </div>
          
          <Button
            onClick={() => onQuickBuy(product.id, selectedSize)}
            disabled={isProcessing && processingId === product.id}
            size="sm"
            className="bg-lavender-500 hover:bg-lavender-600 text-white rounded-xl"
          >
            {isProcessing && processingId === product.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                Buy
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const KidsCollection = () => {
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
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

  const handleQuickBuy = async (productId: string, size: string) => {
    setIsProcessing(true);
    setProcessingId(productId);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-shop-checkout', {
        body: { 
          mode: 'subscription',
          priceType: productId,
          terrainVariant: 'polar_junior',
          strataZone: 'Junior Explorer',
          size: size,
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Unable to start checkout. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingId(null);
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

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.header 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <LavenderEmblem />
              <div>
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest block">
                  Junior Collection
                </span>
                <span className="text-lavender-500 font-medium text-sm">Ages 2 & Up</span>
              </div>
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
            <h1 className="text-4xl md:text-5xl font-instrument text-foreground mb-3">
              Junior Explorer Collection
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Premium adventure gear scaled for young explorers. Same technology, 
              same protection—designed with extra softness and safety for ages 2 and up.
            </p>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {['All', 'Outerwear', 'Base Layer', 'Bottoms', 'Footwear'].map((cat) => (
              <button
                key={cat}
                className={`
                  px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all
                  ${cat === 'All' 
                    ? 'bg-lavender-500 text-white' 
                    : 'bg-lavender-50 text-foreground hover:bg-lavender-100'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.header>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {Object.values(KIDS_PRODUCTS).map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onQuickBuy={handleQuickBuy}
              isProcessing={isProcessing}
              processingId={processingId}
            />
          ))}
        </div>

        {/* Bundle CTA */}
        <motion.div 
          className="bg-gradient-to-br from-lavender-500 to-lavender-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Badge className="bg-white/20 text-white border-white/30 mb-4">
            Bundle & Save
          </Badge>
          <h2 className="text-3xl md:text-4xl font-instrument mb-3">
            Complete Explorer Kit
          </h2>
          <p className="text-lavender-100 max-w-xl mx-auto mb-6">
            Get the full collection—Shell, Cashmere Interior, Pants & Boots—for $399/year. 
            Save $63 compared to individual items.
          </p>
          <Button
            size="lg"
            className="bg-white text-lavender-600 hover:bg-lavender-50 font-semibold rounded-xl shadow-lg"
          >
            Get the Bundle
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Back to Shop */}
        <div className="mt-12 text-center">
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span className="font-mono text-sm">Back to Adult Collection</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KidsCollection;
