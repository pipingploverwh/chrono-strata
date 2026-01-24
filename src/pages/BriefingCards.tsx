import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  Newspaper, TrendingUp, Cloud, HelpCircle, Landmark, Building2,
  ChevronLeft, ChevronRight, RefreshCw, Star, AlertTriangle, CheckCircle,
  Minus, Clock, Zap, ArrowUp, ArrowDown, Shuffle, Layers, Eye,
  ThumbsUp, ThumbsDown, Bookmark, Share2, Volume2, VolumeX, Pause, Play,
  TrendingDown, Activity
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
// ARCHITECTURAL ELEMENTS - Presidential/Executive Style
// ═══════════════════════════════════════════════════════════════════════════════

const PresidentialSeal = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
    <div className="w-[600px] h-[600px] rounded-full border-[3px] border-amber-400/50" />
    <div className="absolute w-[500px] h-[500px] rounded-full border border-amber-400/30" />
    <Star className="absolute w-32 h-32 text-amber-400/20" />
  </div>
);

const GoldStripe = ({ position }: { position: 'top' | 'bottom' }) => (
  <div className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent`} />
);

const ColumnLines = ({ count = 20 }: { count?: number }) => (
  <div className="absolute inset-0 flex justify-between pointer-events-none overflow-hidden opacity-10">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="w-px bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MARKET TICKER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const MarketTicker = ({ indices, isLoading }: { indices: MarketIndex[]; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-shrink-0 px-3 py-2 rounded-lg bg-zinc-800/50 animate-pulse">
            <div className="w-16 h-3 bg-zinc-700 rounded mb-1" />
            <div className="w-12 h-4 bg-zinc-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {indices.map((index) => {
        const isPositive = index.change >= 0;
        return (
          <div
            key={index.symbol}
            className="flex-shrink-0 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-zinc-400">{index.name}</span>
              {isPositive ? (
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-rose-400" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-white">
                {index.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const categoryConfig = {
  current_events: { icon: Newspaper, color: 'from-blue-600 to-blue-800', accent: 'text-blue-400', bg: 'bg-blue-500/10' },
  business: { icon: Building2, color: 'from-emerald-600 to-emerald-800', accent: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  weather: { icon: Cloud, color: 'from-sky-600 to-sky-800', accent: 'text-sky-400', bg: 'bg-sky-500/10' },
  question: { icon: HelpCircle, color: 'from-violet-600 to-violet-800', accent: 'text-violet-400', bg: 'bg-violet-500/10' },
  policy: { icon: Landmark, color: 'from-amber-600 to-amber-800', accent: 'text-amber-400', bg: 'bg-amber-500/10' },
};

const sentimentConfig = {
  positive: { icon: ArrowUp, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  neutral: { icon: Minus, color: 'text-zinc-400', bg: 'bg-zinc-500/20' },
  negative: { icon: ArrowDown, color: 'text-rose-400', bg: 'bg-rose-500/20' },
  mixed: { icon: Shuffle, color: 'text-amber-400', bg: 'bg-amber-500/20' },
};

const importanceConfig = {
  high: { label: 'PRIORITY', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  medium: { label: 'NOTABLE', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  low: { label: 'FYI', color: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30' },
};

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
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: isActive ? 1 : 0.95, opacity: isActive ? 1 : 0.5 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`relative h-full rounded-2xl overflow-hidden bg-gradient-to-br ${config.color} shadow-2xl`}>
        {/* Gold border effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/20 pointer-events-none" />
        <GoldStripe position="top" />
        
        {/* Content */}
        <div className="relative h-full p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${config.bg} backdrop-blur-sm`}>
                <CategoryIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/60">
                  {card.category.replace('_', ' ')}
                </div>
                <h3 className="text-lg font-medium text-white">{card.title}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`text-[9px] border ${importance.color}`}>
                {importance.label}
              </Badge>
              <div className={`p-1.5 rounded-full ${sentiment.bg}`}>
                <SentimentIcon className={`w-4 h-4 ${sentiment.color}`} />
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-4">
            <h2 className="text-2xl font-light text-white leading-tight">
              {card.headline}
            </h2>
          </div>

          {/* Summary */}
          <p className="text-base text-white/80 leading-relaxed mb-4 flex-shrink-0">
            {card.summary}
          </p>

          {/* Details */}
          <div className="flex-1 overflow-hidden">
            <div className="space-y-2 mb-4">
              {card.details?.slice(0, 4).map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  <span className="text-sm text-white/70">{detail}</span>
                </div>
              ))}
            </div>

            {/* Action Items */}
            {card.actionItems && card.actionItems.length > 0 && (
              <div className="p-3 rounded-lg bg-black/20 backdrop-blur-sm">
                <div className="text-[10px] uppercase tracking-wider text-amber-300 mb-2">Action Items</div>
                {card.actionItems.slice(0, 2).map((action, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-white/80">
                    <Zap className="w-3 h-3 text-amber-400" />
                    {action}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Clock className="w-3 h-3" />
              {card.source || 'Intelligence Brief'}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak();
                }}
                className={`text-white/50 hover:text-white hover:bg-white/10 p-2 h-8 ${isSpeaking ? 'text-amber-400' : ''}`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="ghost" className="text-white/50 hover:text-white hover:bg-white/10 p-2 h-8">
                <ThumbsUp className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white/50 hover:text-white hover:bg-white/10 p-2 h-8">
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <GoldStripe position="bottom" />
      </div>
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
  const [viewMode, setViewMode] = useState<'stack' | 'carousel'>('stack');
  
  // Market data state
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([]);
  const [isMarketLoading, setIsMarketLoading] = useState(true);
  
  // TTS state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingCardId, setSpeakingCardId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Text-to-speech function
  const speakCard = useCallback(async (card: BriefingCard) => {
    // If already speaking this card, stop
    if (speakingCardId === card.id && isSpeaking) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsSpeaking(false);
      setSpeakingCardId(null);
      return;
    }

    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Build the text to speak
    const textToSpeak = `
      ${card.category.replace('_', ' ')} briefing. ${card.importance} priority.
      ${card.title}. ${card.headline}.
      ${card.summary}
      ${card.details?.slice(0, 3).join('. ')}.
      ${card.actionItems && card.actionItems.length > 0 ? `Action items: ${card.actionItems.slice(0, 2).join('. ')}` : ''}
    `.trim();

    setIsSpeaking(true);
    setSpeakingCardId(card.id);

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

      if (!response.ok) {
        throw new Error('TTS request failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        setSpeakingCardId(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setSpeakingCardId(null);
        toast.error('Failed to play audio');
      };

      await audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
      setSpeakingCardId(null);
      toast.error('Voice synthesis unavailable');
    }
  }, [speakingCardId, isSpeaking]);

  useEffect(() => {
    fetchBriefing();
    fetchMarketData();
    
    // Refresh market data every 5 minutes
    const marketInterval = setInterval(fetchMarketData, 5 * 60 * 1000);
    return () => clearInterval(marketInterval);
  }, [fetchBriefing, fetchMarketData]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  // Keyboard navigation
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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards.length, currentIndex, speakCard]);

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black" />
        <ColumnLines count={24} />
        <PresidentialSeal />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.03),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500/50" />
            <Star className="w-4 h-4 text-amber-400" />
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>
          <h1 className="text-2xl font-extralight text-white tracking-wide">
            Executive Briefing
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Market Ticker */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">Live Markets</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={fetchMarketData}
              disabled={isMarketLoading}
              className="ml-auto text-zinc-500 hover:text-white h-5 px-1"
            >
              <RefreshCw className={`w-3 h-3 ${isMarketLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <MarketTicker indices={marketIndices} isLoading={isMarketLoading} />
        </motion.div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setViewMode(viewMode === 'stack' ? 'carousel' : 'stack')}
              className="text-zinc-400 hover:text-white"
            >
              <Layers className="w-4 h-4 mr-1" />
              {viewMode === 'stack' ? 'Stack' : 'Carousel'}
            </Button>
            {cards[currentIndex] && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => speakCard(cards[currentIndex])}
                className={`text-zinc-400 hover:text-white ${isSpeaking ? 'text-amber-400' : ''}`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 mr-1" /> : <Volume2 className="w-4 h-4 mr-1" />}
                {isSpeaking ? 'Stop' : 'Listen'}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">
              {currentIndex + 1} / {cards.length || '—'}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={fetchBriefing}
              disabled={isLoading}
              className="text-zinc-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Card Stack */}
        <div className="relative h-[520px] mb-6">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
                <p className="text-sm text-zinc-500">Preparing your briefing...</p>
              </div>
            </div>
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
        <div className="flex items-center justify-between">
          <Button
            size="lg"
            variant="outline"
            onClick={prevCard}
            disabled={cards.length === 0}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {cards.slice(0, 10).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'bg-amber-400 w-4' 
                    : 'bg-zinc-600 hover:bg-zinc-500'
                }`}
              />
            ))}
            {cards.length > 10 && (
              <span className="text-xs text-zinc-600">+{cards.length - 10}</span>
            )}
          </div>

          <Button
            size="lg"
            variant="outline"
            onClick={nextCard}
            disabled={cards.length === 0}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Swipe hint */}
        <p className="text-center text-[10px] text-zinc-600 mt-4">
          Swipe cards or use arrow keys • Press S to speak • Tap dots to jump
        </p>

        {/* Quick Links */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-zinc-800/50">
          <Link to="/forecast" className="text-xs text-zinc-500 hover:text-amber-400 transition-colors">
            Economic Forecast
          </Link>
          <span className="text-zinc-700">•</span>
          <Link to="/northeast" className="text-xs text-zinc-500 hover:text-amber-400 transition-colors">
            Weather Intel
          </Link>
          <span className="text-zinc-700">•</span>
          <Link to="/" className="text-xs text-zinc-500 hover:text-amber-400 transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BriefingCards;
