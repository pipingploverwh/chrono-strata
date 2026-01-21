import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  Sparkles, 
  Heart, 
  Shield, 
  Footprints, 
  Shirt,
  Cloud,
  Sun,
  Check,
  ArrowRight,
  PartyPopper,
  Gift,
  Clock,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import confetti from 'canvas-confetti';

// Import product images
import kidsShellImage from "@/assets/kids-strata-shell-white.jpg";
import kidsCashmereImage from "@/assets/kids-cashmere-interior.jpg";
import kidsPantsImage from "@/assets/kids-explorer-pants.jpg";
import kidsBootsImage from "@/assets/kids-pathfinder-boots.jpg";

const BUNDLE_ITEMS = [
  {
    name: "STRATA Shell — Polar Junior",
    category: "Outerwear",
    icon: Shield,
    image: kidsShellImage,
    price: 148,
    color: "from-blue-400 to-blue-500",
  },
  {
    name: "Cashmere Interior — Cloud Layer",
    category: "Base Layer",
    icon: Heart,
    image: kidsCashmereImage,
    price: 98,
    color: "from-pink-400 to-pink-500",
  },
  {
    name: "Explorer Pants",
    category: "Bottoms",
    icon: Shirt,
    image: kidsPantsImage,
    price: 88,
    color: "from-green-400 to-green-500",
  },
  {
    name: "Pathfinder Boots",
    category: "Footwear",
    icon: Footprints,
    image: kidsBootsImage,
    price: 128,
    color: "from-amber-400 to-amber-500",
  },
];

// Confetti effect hook
const useConfetti = () => {
  useEffect(() => {
    // Fire confetti on mount
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#a78bfa', '#c4b5fd', '#fbbf24', '#f472b6', '#34d399'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#a78bfa', '#c4b5fd', '#fbbf24', '#f472b6', '#34d399'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);
};

// Floating sparkles component
const FloatingSparkles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        initial={{ 
          x: `${Math.random() * 100}%`, 
          y: '110%',
          opacity: 0,
          scale: 0.5 + Math.random() * 0.5,
        }}
        animate={{ 
          y: '-10%',
          opacity: [0, 0.8, 0],
          rotate: 360,
        }}
        transition={{ 
          duration: 6 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: "linear",
        }}
      >
        {i % 3 === 0 ? (
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        ) : i % 3 === 1 ? (
          <Sparkles className="w-3 h-3 text-lavender-400" />
        ) : (
          <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
        )}
      </motion.div>
    ))}
  </div>
);

// Product reveal card
const ProductRevealCard = ({ 
  item, 
  index, 
  isRevealed 
}: { 
  item: typeof BUNDLE_ITEMS[0]; 
  index: number; 
  isRevealed: boolean;
}) => {
  const Icon = item.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateY: -90 }}
      animate={isRevealed ? { 
        opacity: 1, 
        y: 0, 
        rotateY: 0,
        transition: { 
          delay: 0.5 + index * 0.3,
          duration: 0.6,
          type: "spring",
          bounce: 0.4
        }
      } : {}}
      className="relative"
    >
      <motion.div
        className="bg-white rounded-2xl shadow-lg shadow-lavender-200/50 border border-lavender-100 overflow-hidden"
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Image */}
        <div className="aspect-square bg-gradient-to-br from-lavender-50 to-lavender-100 relative overflow-hidden">
          <motion.img 
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={isRevealed ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.8 + index * 0.3, duration: 0.5 }}
          />
          
          {/* Checkmark overlay */}
          <motion.div
            className="absolute top-3 right-3"
            initial={{ scale: 0 }}
            animate={isRevealed ? { scale: 1 } : {}}
            transition={{ delay: 1.2 + index * 0.3, type: "spring", bounce: 0.6 }}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
              <Check className="w-5 h-5 text-white" />
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          <Badge className="bg-lavender-100 text-lavender-600 border-lavender-200 text-[10px] mb-2">
            {item.category}
          </Badge>
          <h3 className="font-semibold text-foreground text-sm line-clamp-1">
            {item.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-muted-foreground text-xs line-through">${item.price}/yr</span>
            <span className="text-emerald-600 text-xs font-medium">Included!</span>
          </div>
        </div>

        {/* Glow effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 rounded-2xl`}
          animate={isRevealed ? { 
            opacity: [0, 0.3, 0],
          } : {}}
          transition={{ delay: 1 + index * 0.3, duration: 0.8 }}
        />
      </motion.div>
    </motion.div>
  );
};

const KidsBundleSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showItems, setShowItems] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'celebration' | 'reveal' | 'summary'>('celebration');
  
  const selectedSize = searchParams.get('size') || 'M';
  const sessionId = searchParams.get('session_id');
  
  const [orderId] = useState(() => 
    `EXP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`
  );

  // Trigger confetti
  useConfetti();

  // Phase progression
  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentPhase('reveal'), 2000);
    const timer2 = setTimeout(() => setShowItems(true), 2500);
    const timer3 = setTimeout(() => setCurrentPhase('summary'), 6000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const totalOriginal = BUNDLE_ITEMS.reduce((sum, item) => sum + item.price, 0);
  const bundlePrice = 399;
  const savings = totalOriginal - bundlePrice;

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender-50 via-white to-lavender-50 relative overflow-hidden">
      <FloatingSparkles />
      
      {/* Decorative clouds */}
      <motion.div 
        className="absolute top-20 left-10 text-lavender-200"
        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud className="w-20 h-20 opacity-30" />
      </motion.div>
      <motion.div 
        className="absolute top-40 right-16 text-amber-200"
        animate={{ rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sun className="w-16 h-16 opacity-50" />
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Celebration Header */}
        <AnimatePresence mode="wait">
          {currentPhase === 'celebration' && (
            <motion.div 
              key="celebration"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 1, repeat: 2 }}
                className="inline-block mb-6"
              >
                <PartyPopper className="w-24 h-24 text-lavender-500" />
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-bold text-lavender-600 mb-4">
                🎉 Hooray! 🎉
              </h1>
              <p className="text-xl text-lavender-500">
                Your Complete Explorer Kit is confirmed!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reveal Phase */}
        {(currentPhase === 'reveal' || currentPhase === 'summary') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-lavender-400 to-lavender-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-lavender-300/50"
              >
                <Gift className="w-10 h-10 text-white" />
              </motion.div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-lavender-600 mb-2">
                Complete Explorer Kit
              </h1>
              <p className="text-lavender-500 mb-4">
                All 4 pieces for your young adventurer!
              </p>
              
              {/* Savings badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-medium"
              >
                <Sparkles className="w-4 h-4" />
                You saved ${savings}!
              </motion.div>
            </motion.div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {BUNDLE_ITEMS.map((item, index) => (
                <ProductRevealCard
                  key={item.name}
                  item={item}
                  index={index}
                  isRevealed={showItems}
                />
              ))}
            </div>

            {/* Summary Section */}
            <AnimatePresence>
              {currentPhase === 'summary' && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Order summary card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg shadow-lavender-100/50 border border-lavender-100 p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Bundle Summary</h3>
                        <p className="text-sm text-muted-foreground">Order ID: {orderId}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">${bundlePrice}/year</div>
                        <div className="text-sm text-muted-foreground line-through">${totalOriginal}/year</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="px-3 py-2 bg-lavender-50 rounded-xl text-center">
                        <div className="text-[10px] text-lavender-400 uppercase tracking-wide">Size</div>
                        <div className="text-sm font-semibold text-lavender-600">{selectedSize}</div>
                      </div>
                      <div className="px-3 py-2 bg-lavender-50 rounded-xl text-center">
                        <div className="text-[10px] text-lavender-400 uppercase tracking-wide">Items</div>
                        <div className="text-sm font-semibold text-lavender-600">4 Pieces</div>
                      </div>
                      <div className="px-3 py-2 bg-lavender-50 rounded-xl text-center">
                        <div className="text-[10px] text-lavender-400 uppercase tracking-wide">Plan</div>
                        <div className="text-sm font-semibold text-lavender-600">Annual</div>
                      </div>
                      <div className="px-3 py-2 bg-emerald-50 rounded-xl text-center">
                        <div className="text-[10px] text-emerald-500 uppercase tracking-wide">Status</div>
                        <div className="text-sm font-semibold text-emerald-600">Confirmed ✓</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* What's next */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-lg shadow-lavender-100/50 border border-lavender-100 p-6"
                  >
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-lavender-500" />
                      What Happens Next?
                    </h3>
                    <div className="space-y-3">
                      {[
                        { icon: "📧", text: "Confirmation email with tracking details" },
                        { icon: "📦", text: "Your kit ships within 5-7 business days" },
                        { icon: "🎁", text: "All 4 items arrive in one special package" },
                        { icon: "🌈", text: "Adventures await!" },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-lavender-50 rounded-xl"
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-foreground">{item.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <Button 
                      onClick={() => navigate('/kids-collection')}
                      variant="outline"
                      className="border-lavender-300 text-lavender-600 hover:bg-lavender-50 rounded-xl px-6 py-3"
                    >
                      Back to Collection
                    </Button>
                    <Button 
                      onClick={() => navigate('/shop')}
                      className="bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white rounded-xl px-6 py-3 shadow-lg shadow-lavender-300/50"
                    >
                      Explore Adult Shells
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default KidsBundleSuccess;
