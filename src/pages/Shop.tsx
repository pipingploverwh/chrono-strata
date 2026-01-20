import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Droplets, Wind, Thermometer, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Time Strata design variants
const DESIGN_VARIANTS = [
  {
    id: 'temporal-flux',
    name: 'Temporal Flux',
    description: 'Dynamic weather gradients with precision time markers',
    gradient: 'from-strata-charcoal via-strata-steel to-strata-orange/30',
    accentColor: 'strata-orange',
  },
  {
    id: 'midnight-strata',
    name: 'Midnight Strata',
    description: 'Deep atmospheric layers with cyan chronograph accents',
    gradient: 'from-strata-black via-strata-charcoal to-strata-cyan/20',
    accentColor: 'strata-cyan',
  },
  {
    id: 'storm-protocol',
    name: 'Storm Protocol',
    description: 'High-contrast weather system visualization',
    gradient: 'from-zinc-900 via-slate-800 to-emerald-900/30',
    accentColor: 'strata-lume',
  },
];

const PRODUCT = {
  name: 'STRATA Rain Shell',
  brand: 'Charles River Apparel × LAVANDAR',
  price: 3600,
  currency: 'USD',
  description: 'Premium waterproof shell featuring AI-rendered Time Strata design. Engineered for operations professionals who demand precision performance in any weather condition.',
  features: [
    'Waterproof 3-layer construction',
    'Seam-sealed for complete weather protection',
    'AI-generated Time Strata pattern',
    'Reflective precision accents',
    'Articulated fit for mobility',
    'Hidden hood in collar',
  ],
  specs: {
    material: '100% Polyester with TPU membrane',
    weight: '380g',
    waterproof: '10,000mm',
    breathability: '8,000g/m²/24h',
  },
};

const PrecisionCornerAccent = ({ position, color = "strata-orange" }: { position: 'tl' | 'tr' | 'bl' | 'br'; color?: string }) => {
  const positionClasses = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0',
    bl: 'bottom-0 left-0',
    br: 'bottom-0 right-0'
  };
  
  return (
    <div className={`absolute ${positionClasses[position]} w-4 h-4 pointer-events-none`}>
      <div className={`absolute ${position.includes('t') ? 'top-0' : 'bottom-0'} ${position.includes('l') ? 'left-0' : 'right-0'} w-full h-px bg-gradient-to-r from-${color}/60 to-transparent`} />
      <div className={`absolute ${position.includes('t') ? 'top-0' : 'bottom-0'} ${position.includes('l') ? 'left-0' : 'right-0'} w-px h-full bg-gradient-to-b from-${color}/60 to-transparent`} />
    </div>
  );
};

const Shop = () => {
  const { t } = useLanguage();
  const [selectedDesign, setSelectedDesign] = useState(DESIGN_VARIANTS[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePreOrder = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-shop-checkout', {
        body: { 
          designVariant: selectedDesign.id,
          productName: PRODUCT.name,
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
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentDesignIndex = DESIGN_VARIANTS.findIndex(d => d.id === selectedDesign.id);
  
  const nextDesign = () => {
    const nextIndex = (currentDesignIndex + 1) % DESIGN_VARIANTS.length;
    setSelectedDesign(DESIGN_VARIANTS[nextIndex]);
  };
  
  const prevDesign = () => {
    const prevIndex = (currentDesignIndex - 1 + DESIGN_VARIANTS.length) % DESIGN_VARIANTS.length;
    setSelectedDesign(DESIGN_VARIANTS[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-strata-black via-strata-charcoal to-strata-black">
      {/* Kuma slat overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="absolute top-0 bottom-0 w-px bg-white" 
            style={{ left: `${(i + 1) * 3.33}%` }} 
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.header 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4 bg-strata-orange/20 text-strata-orange border-strata-orange/30">
            {t('shop.limitedEdition')}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-instrument text-strata-white mb-4 tracking-tight">
            {t('shop.title')}
          </h1>
          <p className="text-strata-silver font-mono text-sm uppercase tracking-[0.3em]">
            {t('shop.subtitle')}
          </p>
        </motion.header>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Product Visualization */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* AI-rendered jacket preview */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-strata-steel/30">
              <PrecisionCornerAccent position="tl" color={selectedDesign.accentColor} />
              <PrecisionCornerAccent position="br" color={selectedDesign.accentColor} />
              
              {/* Dynamic gradient background representing the design */}
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedDesign.gradient}`} />
              
              {/* Jacket silhouette overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-3/4 h-3/4">
                  {/* Stylized jacket representation */}
                  <svg viewBox="0 0 200 250" className="w-full h-full">
                    {/* Jacket body */}
                    <path 
                      d="M40 80 L60 40 L100 30 L140 40 L160 80 L170 200 L30 200 Z" 
                      fill="hsl(var(--strata-charcoal))"
                      stroke={`hsl(var(--${selectedDesign.accentColor}))`}
                      strokeWidth="1"
                      opacity="0.9"
                    />
                    {/* Hood */}
                    <path 
                      d="M60 40 L100 20 L140 40 L100 30 Z" 
                      fill="hsl(var(--strata-steel))"
                      stroke={`hsl(var(--${selectedDesign.accentColor}))`}
                      strokeWidth="0.5"
                      opacity="0.7"
                    />
                    {/* Left sleeve */}
                    <path 
                      d="M40 80 L10 100 L20 180 L45 180 L50 100 Z" 
                      fill="hsl(var(--strata-charcoal))"
                      stroke={`hsl(var(--${selectedDesign.accentColor}))`}
                      strokeWidth="0.5"
                      opacity="0.85"
                    />
                    {/* Right sleeve */}
                    <path 
                      d="M160 80 L190 100 L180 180 L155 180 L150 100 Z" 
                      fill="hsl(var(--strata-charcoal))"
                      stroke={`hsl(var(--${selectedDesign.accentColor}))`}
                      strokeWidth="0.5"
                      opacity="0.85"
                    />
                    {/* Strata pattern lines */}
                    {[...Array(5)].map((_, i) => (
                      <motion.line
                        key={i}
                        x1="50"
                        y1={100 + i * 20}
                        x2="150"
                        y2={100 + i * 20}
                        stroke={`hsl(var(--${selectedDesign.accentColor}))`}
                        strokeWidth="0.5"
                        opacity={0.3 + i * 0.1}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    ))}
                    {/* Time markers */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                      const rad = (angle * Math.PI) / 180;
                      const x = 100 + Math.cos(rad) * 40;
                      const y = 120 + Math.sin(rad) * 40;
                      return (
                        <motion.circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="1.5"
                          fill={`hsl(var(--${selectedDesign.accentColor}))`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                        />
                      );
                    })}
                  </svg>
                  
                  {/* Floating design name */}
                  <motion.div 
                    className="absolute bottom-4 left-0 right-0 text-center"
                    key={selectedDesign.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className={`text-${selectedDesign.accentColor} font-mono text-xs uppercase tracking-widest`}>
                      {selectedDesign.name}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Weather icon overlays */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <div className={`w-8 h-8 rounded-full bg-${selectedDesign.accentColor}/20 flex items-center justify-center`}>
                  <Droplets className={`w-4 h-4 text-${selectedDesign.accentColor}`} />
                </div>
                <div className={`w-8 h-8 rounded-full bg-${selectedDesign.accentColor}/20 flex items-center justify-center`}>
                  <Wind className={`w-4 h-4 text-${selectedDesign.accentColor}`} />
                </div>
                <div className={`w-8 h-8 rounded-full bg-${selectedDesign.accentColor}/20 flex items-center justify-center`}>
                  <Thermometer className={`w-4 h-4 text-${selectedDesign.accentColor}`} />
                </div>
              </div>
            </div>

            {/* Design variant selector */}
            <div className="mt-6">
              <p className="text-strata-silver font-mono text-xs uppercase tracking-wider mb-4 text-center">
                {t('shop.selectDesign')}
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={prevDesign}
                  className="p-2 rounded-full bg-strata-steel/20 hover:bg-strata-steel/40 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-strata-silver" />
                </button>
                
                <div className="flex gap-3">
                  {DESIGN_VARIANTS.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedDesign(variant)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedDesign.id === variant.id 
                          ? `border-${variant.accentColor} shadow-lg shadow-${variant.accentColor}/20` 
                          : 'border-strata-steel/30 hover:border-strata-steel/60'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${variant.gradient}`} />
                      {selectedDesign.id === variant.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={nextDesign}
                  className="p-2 rounded-full bg-strata-steel/20 hover:bg-strata-steel/40 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-strata-silver" />
                </button>
              </div>
              <p className="text-center mt-3 text-strata-silver/60 text-sm">
                {selectedDesign.description}
              </p>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-6">
              {/* Brand */}
              <p className="text-strata-silver font-mono text-xs uppercase tracking-[0.2em]">
                {PRODUCT.brand}
              </p>

              {/* Product Name */}
              <h2 className="text-3xl md:text-4xl font-instrument text-strata-white">
                {PRODUCT.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-mono text-strata-orange">
                  ${PRODUCT.price.toLocaleString()}
                </span>
                <span className="text-strata-silver font-mono text-sm">USD</span>
              </div>

              {/* Description */}
              <p className="text-strata-silver/80 leading-relaxed">
                {PRODUCT.description}
              </p>

              {/* Features */}
              <div className="space-y-3 py-6 border-y border-strata-steel/20">
                {PRODUCT.features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <div className={`w-5 h-5 rounded-full bg-${selectedDesign.accentColor}/20 flex items-center justify-center flex-shrink-0`}>
                      <Check className={`w-3 h-3 text-${selectedDesign.accentColor}`} />
                    </div>
                    <span className="text-strata-silver text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(PRODUCT.specs).map(([key, value]) => (
                  <div key={key} className="bg-strata-steel/10 rounded-lg p-3 border border-strata-steel/20">
                    <p className="text-strata-silver/60 font-mono text-[10px] uppercase tracking-wider mb-1">
                      {key}
                    </p>
                    <p className="text-strata-white font-mono text-sm">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Selected Design Display */}
              <div className={`p-4 rounded-lg bg-${selectedDesign.accentColor}/10 border border-${selectedDesign.accentColor}/30`}>
                <p className="text-strata-silver/60 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Selected Design
                </p>
                <p className={`text-${selectedDesign.accentColor} font-semibold`}>
                  {selectedDesign.name}
                </p>
              </div>

              {/* Pre-Order Button */}
              <Button
                onClick={handlePreOrder}
                disabled={isProcessing}
                size="lg"
                className={`w-full py-6 text-lg font-mono uppercase tracking-wider bg-gradient-to-r from-${selectedDesign.accentColor} to-${selectedDesign.accentColor}/80 hover:opacity-90 transition-opacity`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    {t('shop.preOrder')} — ${PRODUCT.price.toLocaleString()}
                  </>
                )}
              </Button>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-6 text-strata-silver/50 text-xs font-mono">
                <span>Secure Checkout</span>
                <span>•</span>
                <span>Limited Production</span>
                <span>•</span>
                <span>Free Shipping</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer 
          className="mt-24 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 text-[9px] font-mono text-strata-silver/40 uppercase tracking-[0.3em]">
            <div className="w-1.5 h-1.5 rotate-45 border border-strata-orange/40" />
            <span>STRATA COLLECTION</span>
            <div className="w-1.5 h-1.5 rotate-45 border border-strata-orange/40" />
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Shop;
