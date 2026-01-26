import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Compass, RefreshCw, Play, Pause, Bookmark, 
  FileText, Activity, Mic, Loader2, Layers
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { 
  VerticalSlats, 
  LumeGlow, 
  CommandZone,
  springConfig 
} from "@/components/briefing";
import { MarketAlertBadge } from "@/components/briefing/MarketAlertBadge";
import { BriefingCardStack } from "@/components/briefing/BriefingCardStack";
import type { BriefingCard } from "@/components/briefing/BriefingCardStack";
import { useBriefingTTS, VOICE_OPTIONS, type VoiceId } from "@/hooks/useBriefingTTS";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  updatedAt: string;
  region?: 'americas' | 'europe' | 'asia' | 'volatility';
  alertLevel?: 'normal' | 'warning' | 'critical';
  alertReason?: string;
}

interface MarketAlerts {
  critical: number;
  warning: number;
}

const BriefingCards = () => {
  // Card state
  const [cards, setCards] = useState<BriefingCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Market state
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([]);
  const [marketAlerts, setMarketAlerts] = useState<MarketAlerts>({ critical: 0, warning: 0 });
  const [isMarketLoading, setIsMarketLoading] = useState(true);
  
  // Auto modes
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(false);
  const autoReadRef = useRef(false);
  const autoAdvanceRef = useRef(false);
  
  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const sessionId = useRef(`session-${Date.now()}`);
  
  // TTS hook with auto-advance callback
  const handlePlaybackEnd = useCallback(() => {
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
  }, [cards.length]);
  
  const tts = useBriefingTTS({ onPlaybackEnd: handlePlaybackEnd });

  // Fetch bookmarks
  const fetchBookmarks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarked_briefings')
        .select('card_id');
      
      if (error) throw error;
      setBookmarkedIds(new Set(data?.map(b => b.card_id) || []));
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  }, []);

  const toggleBookmark = useCallback(async (card: BriefingCard) => {
    const isCurrentlyBookmarked = bookmarkedIds.has(card.id);
    
    try {
      if (isCurrentlyBookmarked) {
        const { error } = await supabase
          .from('bookmarked_briefings')
          .delete()
          .eq('card_id', card.id);
        
        if (error) throw error;
        setBookmarkedIds(prev => {
          const next = new Set(prev);
          next.delete(card.id);
          return next;
        });
        toast.success('Bookmark removed');
      } else {
        const cardDataJson = JSON.parse(JSON.stringify(card));
        const { error } = await supabase
          .from('bookmarked_briefings')
          .insert([{
            session_id: sessionId.current,
            card_id: card.id,
            card_data: cardDataJson,
          }]);
        
        if (error) throw error;
        setBookmarkedIds(prev => new Set([...prev, card.id]));
        toast.success('Card bookmarked');
      }
    } catch (err) {
      console.error('Bookmark error:', err);
      toast.error('Failed to update bookmark');
    }
  }, [bookmarkedIds]);

  // Fetch briefing cards
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

  // Fetch market data
  const fetchMarketData = useCallback(async () => {
    setIsMarketLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('market-data');
      
      if (error) throw error;
      
      if (data.indices && data.indices.length > 0) {
        setMarketIndices(data.indices);
        setMarketAlerts(data.alerts || { critical: 0, warning: 0 });
        
        if (data.alerts?.critical > 0) {
          toast.error(`🚨 ${data.alerts.critical} critical market alert${data.alerts.critical > 1 ? 's' : ''} detected!`, {
            duration: 6000,
          });
        } else if (data.alerts?.warning > 0) {
          toast.warning(`⚡ ${data.alerts.warning} market warning${data.alerts.warning > 1 ? 's' : ''}`, {
            duration: 4000,
          });
        }
      }
    } catch (err) {
      console.error('Market data fetch error:', err);
    }
    setIsMarketLoading(false);
  }, []);

  // Generate TTS text from card
  const getCardText = useCallback((card: BriefingCard) => {
    return `
      ${card.category.replace('_', ' ')} briefing. ${card.importance} priority.
      ${card.title}. ${card.headline}.
      ${card.summary}
      ${card.details?.slice(0, 3).join('. ')}.
      ${card.actionItems && card.actionItems.length > 0 ? `Action items: ${card.actionItems.slice(0, 2).join('. ')}` : ''}
    `.trim();
  }, []);

  // Speak a card using the TTS hook
  const speakCard = useCallback(async (card: BriefingCard, isAutoRead = false) => {
    const text = getCardText(card);
    await tts.speak(card.id, text, isAutoRead);
  }, [tts, getCardText]);

  // Sync refs
  useEffect(() => {
    autoReadRef.current = autoReadEnabled;
  }, [autoReadEnabled]);
  
  useEffect(() => {
    autoAdvanceRef.current = autoAdvanceEnabled;
  }, [autoAdvanceEnabled]);

  // Auto-read on card change
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
      if (!newState) {
        tts.stop();
        setAutoAdvanceEnabled(false);
      }
      toast.success(newState ? 'Auto-read enabled' : 'Auto-read disabled');
      return newState;
    });
  }, [tts]);

  const toggleAutoAdvance = useCallback(() => {
    setAutoAdvanceEnabled(prev => {
      const newState = !prev;
      if (newState) {
        setAutoReadEnabled(true);
        toast.success('Continuous mode enabled');
        if (cards[currentIndex] && !tts.isSpeaking) {
          setTimeout(() => {
            speakCard(cards[currentIndex], true);
          }, 400);
        }
      } else {
        tts.stop();
        toast.success('Continuous mode disabled');
      }
      return newState;
    });
  }, [cards, currentIndex, tts, speakCard]);

  // Initial fetch
  useEffect(() => {
    fetchBriefing();
    fetchMarketData();
    fetchBookmarks();
    const marketInterval = setInterval(fetchMarketData, 5 * 60 * 1000);
    return () => clearInterval(marketInterval);
  }, [fetchBriefing, fetchMarketData, fetchBookmarks]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      tts.stop();
    };
  }, [tts]);

  // Navigation
  const nextCard = () => setCurrentIndex((prev) => (prev + 1) % cards.length);
  const prevCard = () => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);

  // Keyboard shortcuts
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
  }, [cards, currentIndex, speakCard, toggleAutoRead, toggleAutoAdvance]);

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black" />
        <VerticalSlats count={24} />
        <LumeGlow />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* COMMAND HEADER */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        
        <motion.header 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={springConfig.gentle}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Compass className="w-5 h-5 text-emerald-400/60" />
              </motion.div>
              <div>
                <h1 className="text-xl font-light text-white tracking-[0.1em]">
                  EXECUTIVE BRIEFING
                </h1>
                <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-600">
                {currentIndex + 1} / {cards.length || '—'}
              </span>
              <motion.button
                onClick={fetchBriefing}
                disabled={isLoading}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-white/[0.02] text-zinc-600 hover:text-emerald-400 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>
          
          {/* Market Badge */}
          <MarketAlertBadge 
            indices={marketIndices}
            alerts={marketAlerts}
            isLoading={isMarketLoading}
            onRefresh={fetchMarketData}
          />
        </motion.header>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* CONTROL ZONE */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        
        <CommandZone title="Playback Controls" icon={Activity} className="mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <motion.button
              onClick={toggleAutoRead}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all ${
                autoReadEnabled 
                  ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30' 
                  : 'bg-white/[0.02] text-zinc-500 hover:text-white ring-1 ring-white/[0.06]'
              }`}
            >
              {autoReadEnabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>Auto-Read</span>
              <kbd className="hidden sm:inline text-[9px] px-1 py-0.5 rounded bg-white/[0.05] text-zinc-600 ml-1">A</kbd>
            </motion.button>
            
            <motion.button
              onClick={toggleAutoAdvance}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all ${
                autoAdvanceEnabled 
                  ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30' 
                  : 'bg-white/[0.02] text-zinc-500 hover:text-white ring-1 ring-white/[0.06]'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoAdvanceEnabled ? 'animate-spin' : ''}`} />
              <span>Continuous</span>
              <kbd className="hidden sm:inline text-[9px] px-1 py-0.5 rounded bg-white/[0.05] text-zinc-600 ml-1">C</kbd>
            </motion.button>

            {/* Voice Selector */}
            <div className="flex items-center gap-2">
              <Mic className="w-3.5 h-3.5 text-zinc-600" />
              <Select
                value={tts.selectedVoice}
                onValueChange={(value) => tts.setSelectedVoice(value as VoiceId)}
              >
                <SelectTrigger className="h-8 w-[140px] text-xs bg-white/[0.02] border-white/[0.06] text-zinc-400">
                  <SelectValue placeholder="Voice" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/[0.1]">
                  {VOICE_OPTIONS.map((voice) => (
                    <SelectItem 
                      key={voice.id} 
                      value={voice.id}
                      className="text-xs text-zinc-300 focus:bg-white/[0.05]"
                    >
                      <div className="flex flex-col">
                        <span>{voice.name}</span>
                        <span className="text-[10px] text-zinc-600">{voice.style}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {tts.isGenerating && (
                <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              )}
            </div>

            <div className="flex-1" />
            
            <Link 
              to="/briefing/bookmarks" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs bg-white/[0.02] text-zinc-500 hover:text-amber-400 ring-1 ring-white/[0.06] transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved</span>
              {bookmarkedIds.size > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px]">
                  {bookmarkedIds.size}
                </span>
              )}
            </Link>
          </div>
        </CommandZone>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* BRIEFING ZONE */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        
        <CommandZone title="Intelligence Cards" icon={FileText} className="mb-6">
          <BriefingCardStack
            cards={cards}
            currentIndex={currentIndex}
            onNext={nextCard}
            onPrev={prevCard}
            onIndexChange={setCurrentIndex}
            onSpeak={speakCard}
            speakingCardId={tts.speakingCardId}
            isSpeaking={tts.isSpeaking || tts.isGenerating}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
            isLoading={isLoading}
          />
        </CommandZone>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* CONTEXT ZONE */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        
        <CommandZone title="Session Info" icon={Layers} collapsible defaultOpen={false}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Cards Loaded</div>
              <div className="text-lg font-light text-white">{cards.length}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Bookmarked</div>
              <div className="text-lg font-light text-amber-400">{bookmarkedIds.size}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Markets</div>
              <div className="text-lg font-light text-white">{marketIndices.length}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Alerts</div>
              <div className={`text-lg font-light ${marketAlerts.critical > 0 ? 'text-rose-400' : marketAlerts.warning > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {marketAlerts.critical + marketAlerts.warning}
              </div>
            </div>
          </div>
        </CommandZone>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* FOOTER */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        
        <motion.footer 
          className="mt-8 pt-6 border-t border-white/[0.03]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-center text-[9px] text-zinc-700 tracking-wider mb-4">
            ← → NAVIGATE • S SPEAK • A AUTO-READ • C CONTINUOUS
          </p>
          
          <div className="flex items-center justify-center gap-6 flex-wrap">
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
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default BriefingCards;
