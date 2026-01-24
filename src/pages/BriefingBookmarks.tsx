import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Bookmark, Trash2, Calendar, ArrowLeft, RefreshCw, 
  Newspaper, Building2, Cloud, HelpCircle, Landmark, Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface CardData {
  id: string;
  category: string;
  title: string;
  headline: string;
  summary: string;
  details?: string[];
  sentiment: string;
  importance: string;
  source?: string;
}

interface BookmarkedCard {
  id: string;
  card_id: string;
  card_data: CardData;
  notes?: string | null;
  created_at: string;
  session_id: string;
}

const categoryConfig = {
  current_events: { icon: Newspaper, accent: 'text-blue-400', bg: 'from-blue-500/20 to-blue-600/10' },
  business: { icon: Building2, accent: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-600/10' },
  weather: { icon: Cloud, accent: 'text-sky-400', bg: 'from-sky-500/20 to-sky-600/10' },
  question: { icon: HelpCircle, accent: 'text-violet-400', bg: 'from-violet-500/20 to-violet-600/10' },
  policy: { icon: Landmark, accent: 'text-amber-400', bg: 'from-amber-500/20 to-amber-600/10' },
};

const springConfig = { type: "spring" as const, stiffness: 200, damping: 25 };

const GlassPanel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-[12px] border border-white/[0.06] shadow-[0_8px_32px_-8px_hsl(0_0%_0%/0.3)] ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />
    {children}
  </div>
);

const BriefingBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkedCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookmarked_briefings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match our interface
      const transformedData: BookmarkedCard[] = (data || []).map((item) => ({
        id: item.id,
        card_id: item.card_id,
        card_data: item.card_data as unknown as CardData,
        notes: item.notes,
        created_at: item.created_at,
        session_id: item.session_id,
      }));
      
      setBookmarks(transformedData);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      toast.error('Failed to load bookmarks');
    }
    setIsLoading(false);
  };

  const removeBookmark = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookmarked_briefings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBookmarks(prev => prev.filter(b => b.id !== id));
      toast.success('Bookmark removed');
    } catch (err) {
      console.error('Error removing bookmark:', err);
      toast.error('Failed to remove bookmark');
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black" />
        <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-gradient-to-b from-emerald-500/8 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={springConfig}
          className="mb-8"
        >
          <Link 
            to="/briefing" 
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Briefing</span>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Compass className="w-5 h-5 text-emerald-400/60" />
                </motion.div>
                <h1 className="text-2xl font-light text-white tracking-[0.1em]">
                  SAVED BRIEFINGS
                </h1>
              </div>
              <p className="text-sm text-zinc-500">
                {bookmarks.length} saved card{bookmarks.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button
              onClick={fetchBookmarks}
              disabled={isLoading}
              variant="ghost"
              className="text-zinc-500 hover:text-emerald-400"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </motion.div>

        {/* Bookmarks Grid */}
        {isLoading ? (
          <GlassPanel className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-emerald-400/60 animate-spin mx-auto mb-4" />
            <p className="text-zinc-500">Loading bookmarks...</p>
          </GlassPanel>
        ) : bookmarks.length === 0 ? (
          <GlassPanel className="p-12 text-center">
            <Bookmark className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h2 className="text-lg font-light text-zinc-400 mb-2">No saved briefings</h2>
            <p className="text-sm text-zinc-600 mb-6">
              Bookmark cards from your daily briefing to save them here for later reference.
            </p>
            <Link to="/briefing">
              <Button className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20">
                Go to Briefing
              </Button>
            </Link>
          </GlassPanel>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {bookmarks.map((bookmark, index) => {
              const card = bookmark.card_data;
              const config = categoryConfig[card.category as keyof typeof categoryConfig] || categoryConfig.current_events;
              const CategoryIcon = config.icon;
              
              return (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springConfig, delay: index * 0.05 }}
                >
                  <GlassPanel className="p-5 h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.bg} pointer-events-none rounded-2xl`} />
                    
                    <div className="relative">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06]">
                            <CategoryIcon className={`w-4 h-4 ${config.accent}`} />
                          </div>
                          <div>
                            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-500">
                              {card.category?.replace('_', ' ')}
                            </div>
                            <h3 className="text-sm font-medium text-white/90">{card.title}</h3>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeBookmark(bookmark.id)}
                          className="text-zinc-600 hover:text-rose-400 p-1 h-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Content */}
                      <h4 className="text-base font-light text-white mb-2 leading-snug">
                        {card.headline}
                      </h4>
                      <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
                        {card.summary}
                      </p>

                      {/* Details */}
                      {card.details && card.details.length > 0 && (
                        <div className="space-y-1 mb-3">
                          {card.details.slice(0, 2).map((detail, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-emerald-400/60 mt-1.5 flex-shrink-0" />
                              <span className="text-xs text-zinc-500 line-clamp-1">{detail}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-600">
                          <Calendar className="w-3 h-3" />
                          {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Bookmark className="w-3 h-3 text-emerald-400/60" />
                        </div>
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Quick Links */}
        <motion.div 
          className="flex items-center justify-center gap-6 mt-12 pt-6 border-t border-white/[0.03]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/briefing" className="text-[10px] text-zinc-600 hover:text-emerald-400 transition-colors tracking-wider">
            BRIEFING
          </Link>
          <span className="w-1 h-1 rounded-full bg-zinc-800" />
          <Link to="/forecast" className="text-[10px] text-zinc-600 hover:text-emerald-400 transition-colors tracking-wider">
            FORECAST
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

export default BriefingBookmarks;
