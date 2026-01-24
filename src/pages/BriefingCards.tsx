import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from "framer-motion";
import {
  Newspaper, TrendingUp, Cloud, HelpCircle, Landmark, Building2,
  ChevronLeft, ChevronRight, RefreshCw, Star, Clock, Zap, ArrowUp, ArrowDown,
  Minus, Shuffle, Volume2, VolumeX, Pause, Play, TrendingDown, Activity,
  Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface BriefingCard {
  id: string;
  category: 'current_events' | 'business' | 'weather' | 'question' | 'policy';
  title: string;
  headline: string;
  summary: string;
  details: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  importance: 'high' | 'medium' | 'low';
  source?: string;
  timestamp: string;
  actionItems?: string[];
  relatedTopics?: string[];
}

interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SMOOTH SPRING CONFIGS - AAL Motion Language
// ═══════════════════════════════════════════════════════════════════════════════

const springConfig = {
  gentle: { type: "spring" as const, stiffness: 120, damping: 20 },
  smooth: { type: "spring" as const, stiffness: 200, damping: 25 },
  snappy: { type: "spring" as const, stiffness: 300, damping: 30 },
  float: { type: "spring" as const, stiffness: 80, damping: 15 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHITECTURAL ELEMENTS - AAL Glass & Precision
// ═══════════════════════════════════════════════════════════════════════════════

const GlassPanel = ({ 
  children, 
  className = "",
  intensity = 1 
}: { 
  children: React.ReactNode; 
  className?: string;
  intensity?: 1 | 2 | 3;
}) => (
  <div className={`
    relative overflow-hidden rounded-2xl
    bg-[hsl(var(--kuma-glass-${intensity}))]
    backdrop-blur-[12px]
    border border-white/[0.06]
    shadow-[0_8px_32px_-8px_hsl(0_0%_0%/0.3)]
    ${className}
  `}>
    {/* Shimmer effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />
    {children}
  </div>
);

const GeometricAccent = ({ position = "top-left" }: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) => {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  };
  
  return (
    <div className={`absolute ${positionClasses[position]} w-8 h-8 pointer-events-none`}>
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <path 
          d="M0 0 L32 0 L32 4 L4 4 L4 32 L0 32 Z" 
          fill="currentColor" 
          className="text-emerald-500/20"
        />
      </svg>
    </div>
  );
};

const VerticalSlats = ({ count = 12 }: { count?: number }) => (
  <div className="absolute inset-0 flex justify-between pointer-events-none overflow-hidden">
    {[...Array(count)].map((_, i) => (
      <motion.div 
        key={i} 
        className="w-px bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent"
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: i * 0.03, duration: 0.8, ease: "easeOut" }}
      />
    ))}
  </div>
);

const RuledLines = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
    {[...Array(8)].map((_, i) => (
      <div 
        key={i} 
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-500/10 to-transparent"
        style={{ top: `${(i + 1) * 12}%` }}
      />
    ))}
  </div>
);

const LumeGlow = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-gradient-to-b from-emerald-500/8 to-transparent blur-3xl" />
    <div className="absolute bottom-0 right-1/4 w-1/2 h-24 bg-gradient-to-t from-emerald-500/5 to-transparent blur-2xl" />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MARKET TICKER COMPONENT - Smooth AAL Style
// ═══════════════════════════════════════════════════════════════════════════════

const MarketTicker = ({ indices, isLoading }: { indices: MarketIndex[]; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {[1, 2, 3, 4].map((i) => (
          <motion.div 
            key={i} 
            className="flex-shrink-0 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          >
            <div className="w-14 h-2.5 bg-zinc-700/50 rounded-full mb-2" />
            <div className="w-10 h-3.5 bg-zinc-700/50 rounded-full" />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={springConfig.smooth}
    >
      {indices.map((index, i) => {
        const isPositive = index.change >= 0;
        return (
          <motion.div
            key={index.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig.gentle, delay: i * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="flex-shrink-0 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/20 transition-colors duration-300"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">{index.name}</span>
              <motion.div
                animate={{ rotate: isPositive ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-rose-400" />
                )}
              </motion.div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-light text-white tracking-wide font-mono">
                {index.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-[10px] font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY & SENTIMENT CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const categoryConfig = {
  current_events: { icon: Newspaper, gradient: 'from-blue-500/20 to-blue-600/10', accent: 'text-blue-400', ring: 'ring-blue-500/20' },
  business: { icon: Building2, gradient: 'from-emerald-500/20 to-emerald-600/10', accent: 'text-emerald-400', ring: 'ring-emerald-500/20' },
  weather: { icon: Cloud, gradient: 'from-sky-500/20 to-sky-600/10', accent: 'text-sky-400', ring: 'ring-sky-500/20' },
  question: { icon: HelpCircle, gradient: 'from-violet-500/20 to-violet-600/10', accent: 'text-violet-400', ring: 'ring-violet-500/20' },
  policy: { icon: Landmark, gradient: 'from-amber-500/20 to-amber-600/10', accent: 'text-amber-400', ring: 'ring-amber-500/20' },
};

const sentimentConfig = {
  positive: { icon: ArrowUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10 ring-1 ring-emerald-500/20' },
  neutral: { icon: Minus, color: 'text-zinc-400', bg: 'bg-zinc-500/10 ring-1 ring-zinc-500/20' },
  negative: { icon: ArrowDown, color: 'text-rose-400', bg: 'bg-rose-500/10 ring-1 ring-rose-500/20' },
  mixed: { icon: Shuffle, color: 'text-amber-400', bg: 'bg-amber-500/10 ring-1 ring-amber-500/20' },
};

const importanceConfig = {
  high: { label: 'PRIORITY', color: 'bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20' },
  medium: { label: 'NOTABLE', color: 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20' },
  low: { label: 'FYI', color: 'bg-zinc-500/10 text-zinc-300 ring-1 ring-zinc-500/20' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// BRIEFING CARD COMPONENT - Smooth Glass AAL
// ═══════════════════════════════════════════════════════════════════════════════

const BriefingCardComponent = ({ 
  card, 
  isActive,
  onSwipeLeft,
  onSwipeRight,
  onSpeak,
  isSpeaking,
}: { 
  card: BriefingCard; 
  isActive: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSpeak: () => void;
  isSpeaking: boolean;
}) => {
  const config = categoryConfig[card.category] || categoryConfig.current_events;
  const sentiment = sentimentConfig[card.sentiment] || sentimentConfig.neutral;
  const importance = importanceConfig[card.importance] || importanceConfig.medium;
  const CategoryIcon = config.icon;
  const SentimentIcon = sentiment.icon;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 0.8, 1, 0.8, 0.5]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipeRight();
    } else if (info.offset.x < -100) {
      onSwipeLeft();
    }
  };

  return (
    <motion.div
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.15}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity: isActive ? opacity : 0.3 }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      initial={{ scale: 0.92, opacity: 0, y: 20 }}
      animate={{ 
        scale: isActive ? 1 : 0.92, 
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : 20 
      }}
      exit={{ scale: 0.88, opacity: 0, y: -20, transition: { duration: 0.2 } }}
      transition={springConfig.smooth}
    >
      <GlassPanel className="h-full" intensity={2}>
        {/* Geometric Accents */}
        <GeometricAccent position="top-left" />
        <GeometricAccent position="bottom-right" />
        
        {/* Category Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} pointer-events-none`} />
        
        {/* Ruled Surface Lines */}
        <RuledLines />
        
        {/* Content */}
        <div className="relative h-full p-6 flex flex-col">
          {/* Header */}
          <motion.div 
            className="flex items-start justify-between mb-5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig.gentle, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className={`p-3 rounded-xl bg-white/[0.04] backdrop-blur-sm ring-1 ${config.ring}`}
                whileHover={{ scale: 1.05 }}
                transition={springConfig.snappy}
              >
                <CategoryIcon className={`w-5 h-5 ${config.accent}`} />
              </motion.div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-0.5">
                  {card.category.replace('_', ' ')}
                </div>
                <h3 className="text-base font-medium text-white/90">{card.title}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`text-[8px] tracking-wider px-2 py-0.5 border-0 ${importance.color}`}>
                {importance.label}
              </Badge>
              <motion.div 
                className={`p-1.5 rounded-lg ${sentiment.bg}`}
                animate={isSpeaking ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
              >
                <SentimentIcon className={`w-3.5 h-3.5 ${sentiment.color}`} />
              </motion.div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...springConfig.gentle, delay: 0.15 }}
          >
            <h2 className="text-xl font-light text-white leading-relaxed tracking-wide">
              {card.headline}
            </h2>
          </motion.div>

          {/* Summary */}
          <motion.p 
            className="text-sm text-zinc-400 leading-relaxed mb-5 flex-shrink-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...springConfig.gentle, delay: 0.2 }}
          >
            {card.summary}
          </motion.p>

          {/* Details */}
          <div className="flex-1 overflow-hidden">
            <motion.div 
              className="space-y-2.5 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...springConfig.gentle, delay: 0.25 }}
            >
              {card.details?.slice(0, 4).map((detail, idx) => (
                <motion.div 
                  key={idx} 
                  className="flex items-start gap-2.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...springConfig.gentle, delay: 0.3 + idx * 0.05 }}
                >
                  <div className="w-1 h-1 rounded-full bg-emerald-400/60 mt-2 flex-shrink-0" />
                  <span className="text-sm text-zinc-400/90">{detail}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Items */}
            {card.actionItems && card.actionItems.length > 0 && (
              <motion.div 
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springConfig.gentle, delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span className="text-[9px] uppercase tracking-[0.15em] text-emerald-400/80">Action Items</span>
                </div>
                {card.actionItems.slice(0, 2).map((action, idx) => (
                  <div key={idx} className="text-sm text-zinc-300/80 mb-1 last:mb-0">
                    {action}
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <motion.div 
            className="flex items-center justify-between pt-4 border-t border-white/[0.04] mt-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...springConfig.gentle, delay: 0.45 }}
          >
            <div className="flex items-center gap-2 text-[10px] text-zinc-600">
              <Clock className="w-3 h-3" />
              <span className="tracking-wide">{card.source || 'Intelligence Brief'}</span>
            </div>
            <motion.button 
              onClick={(e) => {
                e.stopPropagation();
                onSpeak();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={springConfig.snappy}
              className={`p-2 rounded-lg transition-colors ${
                isSpeaking 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-white/[0.02] text-zinc-500 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </motion.button>
          </motion.div>
        </div>
      </GlassPanel>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const BriefingCards = () => {
  const [cards, setCards] = useState<BriefingCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Market data state
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([]);
  const [isMarketLoading, setIsMarketLoading] = useState(true);
  
  // TTS state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingCardId, setSpeakingCardId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Auto-read mode state
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);
  const autoReadRef = useRef(false);
  
  // Continuous auto-advance mode state
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(false);
  const autoAdvanceRef = useRef(false);

  const fetchBriefing = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('briefing-cards', {
        body: { location: 'United States' }
      });

      if (error) throw error;
      
      if (data.cards && data.cards.length > 0) {
        setCards(data.cards);
        setCurrentIndex(0);
        toast.success(`${data.cards.length} briefing cards loaded`);
      }
    } catch (err) {
      console.error('Briefing fetch error:', err);
      toast.error('Failed to load briefing');
    }
    setIsLoading(false);
  }, []);

  const fetchMarketData = useCallback(async () => {
    setIsMarketLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('market-data');
      
      if (error) throw error;
      
      if (data.indices && data.indices.length > 0) {
        setMarketIndices(data.indices);
      }
    } catch (err) {
      console.error('Market data fetch error:', err);
    }
    setIsMarketLoading(false);
  }, []);

  // Text-to-speech function with auto-read support
  const speakCard = useCallback(async (card: BriefingCard, isAutoRead = false): Promise<void> => {
    if (speakingCardId === card.id && isSpeaking && !isAutoRead) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsSpeaking(false);
      setSpeakingCardId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const textToSpeak = `
      ${card.category.replace('_', ' ')} briefing. ${card.importance} priority.
      ${card.title}. ${card.headline}.
      ${card.summary}
      ${card.details?.slice(0, 3).join('. ')}.
      ${card.actionItems && card.actionItems.length > 0 ? `Action items: ${card.actionItems.slice(0, 2).join('. ')}` : ''}
    `.trim();

    setIsSpeaking(true);
    setSpeakingCardId(card.id);

    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/briefing-tts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ text: textToSpeak }),
          }
        );

        if (!response.ok) throw new Error('TTS request failed');

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.onended = () => {
          setIsSpeaking(false);
          setSpeakingCardId(null);
          URL.revokeObjectURL(audioUrl);
          
          if (autoAdvanceRef.current) {
            setCurrentIndex((prev) => {
              const nextIdx = prev + 1;
              if (nextIdx >= cards.length) {
                setAutoAdvanceEnabled(false);
                autoAdvanceRef.current = false;
                toast.success('Briefing complete');
                return prev;
              }
              return nextIdx;
            });
          }
          
          resolve();
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          setSpeakingCardId(null);
          toast.error('Failed to play audio');
          reject(new Error('Audio playback failed'));
        };

        await audio.play();
      } catch (error) {
        console.error('TTS error:', error);
        setIsSpeaking(false);
        setSpeakingCardId(null);
        toast.error('Voice synthesis unavailable');
        reject(error);
      }
    });
  }, [speakingCardId, isSpeaking, cards.length]);

  useEffect(() => {
    autoReadRef.current = autoReadEnabled;
  }, [autoReadEnabled]);
  
  useEffect(() => {
    autoAdvanceRef.current = autoAdvanceEnabled;
  }, [autoAdvanceEnabled]);

  useEffect(() => {
    if (autoReadRef.current && cards[currentIndex] && !isLoading) {
      const timer = setTimeout(() => {
        if (autoReadRef.current) {
          speakCard(cards[currentIndex], true);
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, cards, isLoading, speakCard]);

  const toggleAutoRead = useCallback(() => {
    setAutoReadEnabled(prev => {
      const newState = !prev;
      if (!newState && audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setIsSpeaking(false);
        setSpeakingCardId(null);
      }
      if (!newState) {
        setAutoAdvanceEnabled(false);
      }
      toast.success(newState ? 'Auto-read enabled' : 'Auto-read disabled');
      return newState;
    });
  }, []);

  const toggleAutoAdvance = useCallback(() => {
    setAutoAdvanceEnabled(prev => {
      const newState = !prev;
      if (newState) {
        setAutoReadEnabled(true);
        toast.success('Continuous mode enabled');
        if (cards[currentIndex] && !isSpeaking) {
          setTimeout(() => {
            speakCard(cards[currentIndex], true);
          }, 400);
        }
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
          setIsSpeaking(false);
          setSpeakingCardId(null);
        }
        toast.success('Continuous mode disabled');
      }
      return newState;
    });
  }, [cards, currentIndex, isSpeaking, speakCard]);

  useEffect(() => {
    fetchBriefing();
    fetchMarketData();
    const marketInterval = setInterval(fetchMarketData, 5 * 60 * 1000);
    return () => clearInterval(marketInterval);
  }, [fetchBriefing, fetchMarketData]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const nextCard = () => setCurrentIndex((prev) => (prev + 1) % cards.length);
  const prevCard = () => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextCard();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevCard();
      } else if (e.key === 's' && cards[currentIndex]) {
        e.preventDefault();
        speakCard(cards[currentIndex]);
      } else if (e.key === 'a') {
        e.preventDefault();
        toggleAutoRead();
      } else if (e.key === 'c') {
        e.preventDefault();
        toggleAutoAdvance();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards.length, currentIndex, speakCard, toggleAutoRead, toggleAutoAdvance]);

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black" />
        <VerticalSlats count={20} />
        <LumeGlow />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={springConfig.gentle}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-500/30" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Compass className="w-4 h-4 text-emerald-400/60" />
            </motion.div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-500/30" />
          </div>
          <h1 className="text-2xl font-light text-white tracking-[0.1em]">
            EXECUTIVE BRIEFING
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 mt-2">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Market Ticker */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springConfig.gentle, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-3 h-3 text-emerald-400/60" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">Live Markets</span>
            <motion.button
              onClick={fetchMarketData}
              disabled={isMarketLoading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="ml-auto text-zinc-600 hover:text-emerald-400 transition-colors p-1"
            >
              <RefreshCw className={`w-3 h-3 ${isMarketLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
          <MarketTicker indices={marketIndices} isLoading={isMarketLoading} />
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex items-center justify-between mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...springConfig.gentle, delay: 0.15 }}
        >
          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleAutoRead}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                autoReadEnabled 
                  ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' 
                  : 'bg-white/[0.02] text-zinc-500 hover:text-white ring-1 ring-white/[0.04]'
              }`}
            >
              {autoReadEnabled ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              Auto
            </motion.button>
            <motion.button
              onClick={toggleAutoAdvance}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                autoAdvanceEnabled 
                  ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' 
                  : 'bg-white/[0.02] text-zinc-500 hover:text-white ring-1 ring-white/[0.04]'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${autoAdvanceEnabled ? 'animate-spin' : ''}`} />
              Loop
            </motion.button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-600 tracking-wider font-mono">
              {currentIndex + 1} / {cards.length || '—'}
            </span>
            <motion.button
              onClick={fetchBriefing}
              disabled={isLoading}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className="text-zinc-600 hover:text-emerald-400 transition-colors p-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </motion.div>

        {/* Card Stack */}
        <div className="relative h-[500px] mb-8">
          {isLoading ? (
            <GlassPanel className="absolute inset-0 flex items-center justify-center" intensity={1}>
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-8 h-8 text-emerald-400/60 mx-auto mb-4" />
                </motion.div>
                <p className="text-sm text-zinc-600 tracking-wide">Preparing your briefing...</p>
              </div>
            </GlassPanel>
          ) : (
            <AnimatePresence mode="popLayout">
              {cards.map((card, index) => (
                <BriefingCardComponent
                  key={card.id}
                  card={card}
                  isActive={index === currentIndex}
                  onSwipeLeft={nextCard}
                  onSwipeRight={prevCard}
                  onSpeak={() => speakCard(card)}
                  isSpeaking={speakingCardId === card.id && isSpeaking}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Navigation */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springConfig.gentle, delay: 0.2 }}
        >
          <motion.button
            onClick={prevCard}
            disabled={cards.length === 0}
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.04] ring-1 ring-white/[0.04] transition-all disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          {/* Progress Dots */}
          <div className="flex items-center gap-1.5">
            {cards.slice(0, 10).map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'bg-emerald-400 w-6' 
                    : 'bg-zinc-700 w-1.5 hover:bg-zinc-600'
                }`}
              />
            ))}
            {cards.length > 10 && (
              <span className="text-[10px] text-zinc-700 ml-1">+{cards.length - 10}</span>
            )}
          </div>

          <motion.button
            onClick={nextCard}
            disabled={cards.length === 0}
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.04] ring-1 ring-white/[0.04] transition-all disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Keyboard Hints */}
        <motion.p 
          className="text-center text-[9px] text-zinc-700 mt-6 tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          ← → NAVIGATE • S SPEAK • A AUTO-READ • C CONTINUOUS
        </motion.p>

        {/* Quick Links */}
        <motion.div 
          className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-white/[0.03]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/forecast" className="text-[10px] text-zinc-600 hover:text-emerald-400 transition-colors tracking-wider">
            FORECAST
          </Link>
          <span className="w-1 h-1 rounded-full bg-zinc-800" />
          <Link to="/northeast" className="text-[10px] text-zinc-600 hover:text-emerald-400 transition-colors tracking-wider">
            WEATHER
          </Link>
          <span className="w-1 h-1 rounded-full bg-zinc-800" />
          <Link to="/" className="text-[10px] text-zinc-600 hover:text-emerald-400 transition-colors tracking-wider">
            DASHBOARD
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BriefingCards;
