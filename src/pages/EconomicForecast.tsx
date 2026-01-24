import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  TrendingUp, TrendingDown, Minus, Brain, 
  RefreshCw, ChevronRight, Sparkles, Building2,
  Cpu, Fuel, Heart, AlertTriangle, LineChart, Calendar,
  ThumbsUp, ThumbsDown, CloudSun, Newspaper, Flag, Shield,
  Cloud, ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DayForecast {
  date: string;
  emoji: string;
  prediction: string;
  sp500Change: string;
  keyEvent: string;
  mood: "optimistic" | "cautious" | "nervous";
}

interface SectorOutlook {
  outlook: "bullish" | "bearish" | "neutral";
  reason: string;
}

interface TrumpIdea {
  idea: string;
  reason: string;
  marketImpact: "bullish" | "bearish" | "neutral";
  weatherLink?: string;
  newsSource?: string;
}

interface Forecast {
  headline: string;
  sentiment: "bullish" | "bearish" | "mixed";
  confidenceScore: number;
  days: DayForecast[];
  sectors: {
    tech: SectorOutlook;
    finance: SectorOutlook;
    energy: SectorOutlook;
    healthcare: SectorOutlook;
  };
  aiInsight: string;
  riskFactors: string[];
  generatedAt: string;
  trumpWillLike?: TrumpIdea[];
  trumpWillNotLike?: TrumpIdea[];
}

// Kengo Kuma glass panel component
const GlassPanel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] ${className}`}>
    {/* AAL corner accents */}
    <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-emerald-500/40" />
    <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-emerald-500/40" />
    <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-emerald-500/40" />
    <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-emerald-500/40" />
    {children}
  </div>
);

// Vertical slat pattern (Kuma)
const VerticalSlats = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
    {[...Array(40)].map((_, i) => (
      <div
        key={i}
        className="absolute h-full w-px bg-white"
        style={{ left: `${(i + 1) * 2.5}%` }}
      />
    ))}
  </div>
);

// Ruled surface lines (AAL)
const RuledLines = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute w-full h-px bg-white"
        style={{ top: `${(i + 1) * 3.33}%` }}
      />
    ))}
  </div>
);

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <span className="font-mono text-xs tracking-[0.15em] text-zinc-400">
      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} EST
    </span>
  );
};

const ConfidenceMeter = ({ score }: { score: number }) => (
  <div className="flex items-center gap-4">
    <div className="flex-1 h-1 bg-zinc-800 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
      />
    </div>
    <span className="text-xs font-mono tracking-wider text-emerald-400">{score}%</span>
  </div>
);

const DayCard = ({ day, index }: { day: DayForecast; index: number }) => {
  const isPositive = day.sp500Change.startsWith("+");
  const isNeutral = day.sp500Change.startsWith("0") || day.sp500Change === "±0%";
  
  const moodAccent = {
    optimistic: "border-l-emerald-500",
    cautious: "border-l-amber-500",
    nervous: "border-l-red-500",
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassPanel className={`p-5 border-l-2 ${moodAccent[day.mood]}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">{day.date}</p>
            <span className="text-xl">{day.emoji}</span>
          </div>
          <div className={`font-mono text-lg tracking-wider ${
            isPositive ? "text-emerald-400" : 
            isNeutral ? "text-zinc-400" :
            "text-red-400"
          }`}>
            {day.sp500Change}
          </div>
        </div>
        
        <p className="text-zinc-300 text-sm leading-relaxed mb-3">{day.prediction}</p>
        
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-wider">
          <ChevronRight className="w-3 h-3" />
          <span>{day.keyEvent}</span>
        </div>
      </GlassPanel>
    </motion.div>
  );
};

const SectorPill = ({ name, data }: { name: string; data: SectorOutlook }) => {
  const icons = { tech: Cpu, finance: Building2, energy: Fuel, healthcare: Heart };
  const Icon = icons[name as keyof typeof icons];
  
  const outlookColors = {
    bullish: "text-emerald-400 border-emerald-500/30",
    bearish: "text-red-400 border-red-500/30",
    neutral: "text-zinc-400 border-zinc-500/30",
  };
  
  return (
    <div className={`p-4 border ${outlookColors[data.outlook]} bg-zinc-900/50 backdrop-blur-sm`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">{name}</span>
      </div>
      <p className="text-[11px] text-zinc-500">{data.reason}</p>
    </div>
  );
};

const TrumpIdeaCard = ({ idea, isLike }: { idea: TrumpIdea; isLike: boolean }) => {
  const impactIcon = {
    bullish: TrendingUp,
    bearish: TrendingDown,
    neutral: Minus,
  };
  const ImpactIcon = impactIcon[idea.marketImpact];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isLike ? -10 : 10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 border-l-2 ${isLike ? "border-l-red-500 bg-red-950/20" : "border-l-blue-500 bg-blue-950/20"} backdrop-blur-sm`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 ${isLike ? "bg-red-500/10" : "bg-blue-500/10"}`}>
          {isLike ? (
            <ThumbsUp className="w-4 h-4 text-red-400" />
          ) : (
            <ThumbsDown className="w-4 h-4 text-blue-400" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-zinc-200 text-sm font-medium mb-1">{idea.idea}</p>
          <p className="text-zinc-500 text-xs mb-3">{idea.reason}</p>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider">
            <span className={`flex items-center gap-1 ${
              idea.marketImpact === "bullish" ? "text-emerald-400" : 
              idea.marketImpact === "bearish" ? "text-red-400" : "text-zinc-400"
            }`}>
              <ImpactIcon className="w-3 h-3" />
              {idea.marketImpact}
            </span>
            {idea.weatherLink && (
              <span className="flex items-center gap-1 text-sky-400">
                <CloudSun className="w-3 h-3" />
                {idea.weatherLink}
              </span>
            )}
            {idea.newsSource && (
              <span className="flex items-center gap-1 text-violet-400">
                <Newspaper className="w-3 h-3" />
                {idea.newsSource}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EconomicForecast = () => {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchForecast = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('economic-forecast');
      
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      setForecast(data);
      if (isRefresh) toast.success("Intelligence updated");
    } catch (err) {
      console.error("Forecast error:", err);
      toast.error("Failed to load intelligence");
      setForecast(getFallbackForecast());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Kuma architectural background */}
      <VerticalSlats />
      <RuledLines />
      
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/5 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/weather-showcase" 
              className="text-zinc-500 hover:text-emerald-400 transition-colors text-xs font-mono uppercase tracking-wider flex items-center gap-2"
            >
              <Cloud className="w-4 h-4" />
              Weather Showcase
            </Link>
            <Link 
              to="/" 
              className="text-zinc-600 hover:text-white transition-colors text-xs font-mono uppercase tracking-wider"
            >
              LAVANDAR →
            </Link>
          </div>

          {/* Presidential seal placeholder */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-emerald-500" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Office of Economic Intelligence</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
            <Shield className="w-8 h-8 text-emerald-500" />
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-light tracking-[0.1em] text-white mb-2">
              ECONOMIC OUTLOOK
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-500 flex items-center justify-center gap-4">
              <span className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                5-Day Forecast
              </span>
              <span>•</span>
              <LiveClock />
            </p>
          </div>
        </motion.header>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-28 bg-zinc-900/50 animate-pulse" />
            ))}
          </div>
        ) : forecast ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Headline Card */}
            <GlassPanel className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <motion.h2 
                    className="text-2xl font-light tracking-wide text-white mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {forecast.headline}
                  </motion.h2>
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] uppercase tracking-widest border ${
                        forecast.sentiment === "bullish" ? "border-emerald-500/50 text-emerald-400" :
                        forecast.sentiment === "bearish" ? "border-red-500/50 text-red-400" :
                        "border-amber-500/50 text-amber-400"
                      }`}
                    >
                      {forecast.sentiment}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fetchForecast(true)}
                      disabled={refreshing}
                      className="text-zinc-500 hover:text-white h-6 px-2"
                    >
                      <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">AI Confidence Index</p>
                <ConfidenceMeter score={forecast.confidenceScore} />
              </div>

              {/* AI Insight */}
              <div className="p-4 border border-emerald-500/20 bg-emerald-950/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-zinc-300 text-sm leading-relaxed">{forecast.aiInsight}</p>
                </div>
              </div>
            </GlassPanel>

            {/* Day-by-Day Forecast */}
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-4 px-1">
                Day-by-Day Outlook
              </h3>
              <div className="space-y-3">
                {forecast.days.map((day, index) => (
                  <DayCard key={day.date} day={day} index={index} />
                ))}
              </div>
            </section>

            {/* Sector Outlook */}
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-4 px-1">
                Sector Intelligence
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(forecast.sectors).map(([name, data]) => (
                  <SectorPill key={name} name={name} data={data} />
                ))}
              </div>
            </section>

            {/* Risk Factors */}
            <GlassPanel className="p-5 border-l-2 border-l-red-500">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-red-400">Strategic Risks</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {forecast.riskFactors.map((risk, i) => (
                  <span key={i} className="px-3 py-1 text-[10px] uppercase tracking-wider text-red-300/80 border border-red-500/30 bg-red-950/20">
                    {risk}
                  </span>
                ))}
              </div>
            </GlassPanel>

            {/* Trump Policy Analysis Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 px-1">
                <Flag className="w-4 h-4 text-red-500" />
                <h3 className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">
                  Presidential Policy Radar
                </h3>
                <div className="h-px flex-1 bg-zinc-800" />
                <Badge variant="outline" className="text-[8px] tracking-widest border-zinc-700 text-zinc-500">
                  AI + WEATHER + NEWS
                </Badge>
              </div>

              {/* Ideas Trump Will Like */}
              {forecast.trumpWillLike && forecast.trumpWillLike.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-red-400 flex items-center gap-2 px-1">
                    <ThumbsUp className="w-3 h-3" />
                    Aligned with Administration Priorities
                  </p>
                  <div className="space-y-2">
                    {forecast.trumpWillLike.map((idea, i) => (
                      <TrumpIdeaCard key={i} idea={idea} isLike={true} />
                    ))}
                  </div>
                </div>
              )}

              {/* Ideas Trump Will Not Like */}
              {forecast.trumpWillNotLike && forecast.trumpWillNotLike.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2 px-1">
                    <ThumbsDown className="w-3 h-3" />
                    Potential Policy Friction Points
                  </p>
                  <div className="space-y-2">
                    {forecast.trumpWillNotLike.map((idea, i) => (
                      <TrumpIdeaCard key={i} idea={idea} isLike={false} />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Footer */}
            <footer className="pt-8 border-t border-zinc-800">
              <div className="flex items-center justify-between text-[10px] text-zinc-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Brain className="w-3 h-3" />
                  <span>Gemini 3 Flash Intelligence</span>
                </div>
                <span>Generated {new Date(forecast.generatedAt).toLocaleString()}</span>
              </div>
              <p className="text-center text-[9px] text-zinc-700 mt-4 tracking-wider">
                LAVANDAR PRECISION INTELLIGENCE • NOT FINANCIAL ADVICE • CLASSIFIED
              </p>
            </footer>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

// Fallback forecast if API fails
const getFallbackForecast = (): Forecast => ({
  headline: "Markets Navigate Policy Transition",
  sentiment: "mixed",
  confidenceScore: 74,
  days: [
    { date: "Today", emoji: "📈", prediction: "Energy sector leads on drilling executive orders. Tech consolidates gains.", sp500Change: "+0.5%", keyEvent: "Cabinet confirmation hearings", mood: "optimistic" },
    { date: "Tomorrow", emoji: "➡️", prediction: "Sideways trading as markets digest tariff announcements.", sp500Change: "±0.2%", keyEvent: "Trade policy briefing", mood: "cautious" },
    { date: "Day 3", emoji: "📉", prediction: "Profit-taking ahead of Fed commentary on rates.", sp500Change: "-0.4%", keyEvent: "FOMC member speeches", mood: "nervous" },
    { date: "Day 4", emoji: "📈", prediction: "Crypto rally on regulatory clarity hints. Banks follow.", sp500Change: "+0.6%", keyEvent: "Treasury nomination hearing", mood: "optimistic" },
    { date: "Day 5", emoji: "📈", prediction: "Week closes strong on infrastructure spending signals.", sp500Change: "+0.3%", keyEvent: "Jobs report preview", mood: "optimistic" },
  ],
  sectors: {
    tech: { outlook: "bullish", reason: "AI spending unaffected by policy shifts" },
    finance: { outlook: "bullish", reason: "Deregulation momentum building" },
    energy: { outlook: "bullish", reason: "Drill baby drill in full effect" },
    healthcare: { outlook: "neutral", reason: "Drug pricing uncertainty lingers" },
  },
  aiInsight: "This administration favors energy, crypto, and deregulated finance. Position accordingly but maintain diversification. Watch for tariff escalation as the primary risk factor.",
  riskFactors: ["Trade war escalation", "Fed independence concerns", "China retaliation"],
  trumpWillLike: [
    { idea: "Expand Gulf Coast drilling permits immediately", reason: "Aligns with energy independence and American jobs agenda", marketImpact: "bullish", weatherLink: "Mild Gulf conditions support Q1 operations" },
    { idea: "25% tariff on Chinese EV imports", reason: "Protects Detroit, punishes Beijing", marketImpact: "neutral", weatherLink: "Winter demand favors domestic vehicles" },
    { idea: "Bitcoin strategic reserve legislation", reason: "America leads digital asset innovation", marketImpact: "bullish", weatherLink: "Cold weather improves mining efficiency" }
  ],
  trumpWillNotLike: [
    { idea: "Fed signals additional rate increases", reason: "Constrains promised economic growth", marketImpact: "bearish", newsSource: "WSJ, Bloomberg" },
    { idea: "EU carbon border tax on US exports", reason: "Foreign climate rules penalizing American industry", marketImpact: "bearish", newsSource: "Reuters, Financial Times" },
    { idea: "Tech giants moving AI research abroad", reason: "American innovation leaving for foreign incentives", marketImpact: "bearish", newsSource: "TechCrunch, NYT" }
  ],
  generatedAt: new Date().toISOString(),
});

export default EconomicForecast;