import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import {
  Newspaper, Building2, Cloud, HelpCircle, Landmark,
  ChevronLeft, ChevronRight, Clock, Zap, ArrowUp, ArrowDown,
  Minus, Shuffle, Volume2, VolumeX, Bookmark, BookmarkCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassPanel, GeometricAccent, RuledLines, springConfig } from "./ArchitecturalElements";

export interface BriefingCard {
  id: string;
  category: 'current_events' | 'business' | 'weather' | 'question' | 'policy';
  title: string;
  headline: string;
  summary: string;
  details: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  importance: 'high' | 'medium' | 'low';
  source?: string;
  sourceUrl?: string;
  timestamp: string;
  actionItems?: string[];
  relatedTopics?: string[];
}

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

// Single Card Component
const BriefingCardItem = ({ 
  card, 
  isActive,
  onSwipeLeft,
  onSwipeRight,
  onSpeak,
  isSpeaking,
  isBookmarked,
  onToggleBookmark,
}: { 
  card: BriefingCard; 
  isActive: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSpeak: () => void;
  isSpeaking: boolean;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
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
        <GeometricAccent position="top-left" />
        <GeometricAccent position="bottom-right" />
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} pointer-events-none`} />
        <RuledLines />
        
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
            <div className="flex items-center gap-2 text-[10px] text-zinc-600 min-w-0 flex-1 mr-3">
              <Clock className="w-3 h-3 flex-shrink-0" />
              {card.sourceUrl ? (
                <a 
                  href={card.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="tracking-wide hover:text-emerald-400 transition-colors truncate underline underline-offset-2 decoration-zinc-700 hover:decoration-emerald-400"
                >
                  {card.source || 'Read Source'}
                </a>
              ) : (
                <span className="tracking-wide truncate">{card.source || 'Intelligence Brief'}</span>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <motion.button 
                onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={springConfig.snappy}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'bg-amber-500/20 text-amber-400' 
                    : 'bg-white/[0.02] text-zinc-500 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </motion.button>
              <motion.button 
                onClick={(e) => { e.stopPropagation(); onSpeak(); }}
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
            </div>
          </motion.div>
        </div>
      </GlassPanel>
    </motion.div>
  );
};

// Card Stack with Navigation
export const BriefingCardStack = ({
  cards,
  currentIndex,
  onNext,
  onPrev,
  onIndexChange,
  onSpeak,
  speakingCardId,
  isSpeaking,
  bookmarkedIds,
  onToggleBookmark,
  isLoading
}: {
  cards: BriefingCard[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onIndexChange: (idx: number) => void;
  onSpeak: (card: BriefingCard) => void;
  speakingCardId: string | null;
  isSpeaking: boolean;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (card: BriefingCard) => void;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <GlassPanel className="h-[460px] flex items-center justify-center" intensity={1}>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full mx-auto mb-4"
          />
          <p className="text-sm text-zinc-600 tracking-wide">Preparing your briefing...</p>
        </div>
      </GlassPanel>
    );
  }

  if (cards.length === 0) {
    return (
      <GlassPanel className="h-[460px] flex items-center justify-center" intensity={1}>
        <div className="text-center">
          <Newspaper className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
          <p className="text-sm text-zinc-600 tracking-wide">No briefing cards available</p>
        </div>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-4">
      {/* Card Stack */}
      <div className="relative h-[460px]">
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => (
            <BriefingCardItem
              key={card.id}
              card={card}
              isActive={index === currentIndex}
              onSwipeLeft={onNext}
              onSwipeRight={onPrev}
              onSpeak={() => onSpeak(card)}
              isSpeaking={speakingCardId === card.id && isSpeaking}
              isBookmarked={bookmarkedIds.has(card.id)}
              onToggleBookmark={() => onToggleBookmark(card)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <motion.button
          onClick={onPrev}
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
              onClick={() => onIndexChange(idx)}
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
          onClick={onNext}
          disabled={cards.length === 0}
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-xl bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.04] ring-1 ring-white/[0.04] transition-all disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};
