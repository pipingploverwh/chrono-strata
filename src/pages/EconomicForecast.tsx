import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, TrendingDown, Minus, Brain, Shield, Zap, 
  RefreshCw, Clock, ChevronRight, Sparkles, Building2,
  Cpu, Fuel, Heart, AlertTriangle, LineChart, Calendar
} from "lucide-react";
import { Card } from "@/components/ui/card";
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
}

const moodColors = {
  optimistic: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
  cautious: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
  nervous: "from-red-500/20 to-red-600/10 border-red-500/30",
};

const moodTextColors = {
  optimistic: "text-emerald-400",
  cautious: "text-amber-400",
  nervous: "text-red-400",
};

const sentimentConfig = {
  bullish: { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/20" },
  bearish: { icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/20" },
  mixed: { icon: Minus, color: "text-amber-400", bg: "bg-amber-500/20" },
};

const sectorIcons = {
  tech: Cpu,
  finance: Building2,
  energy: Fuel,
  healthcare: Heart,
};

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <span className="font-mono text-sm text-white/60">
      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} ET
    </span>
  );
};

const ConfidenceMeter = ({ score }: { score: number }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full rounded-full ${
          score > 75 ? "bg-emerald-500" : score > 60 ? "bg-amber-500" : "bg-red-500"
        }`}
      />
    </div>
    <span className="text-sm font-bold text-white">{score}%</span>
  </div>
);

const DayCard = ({ day, index }: { day: DayForecast; index: number }) => {
  const isPositive = day.sp500Change.startsWith("+");
  const isNeutral = day.sp500Change.startsWith("0") || day.sp500Change === "±0%";
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15 }}
    >
      <Card className={`p-4 bg-gradient-to-br ${moodColors[day.mood]} border backdrop-blur-sm`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider">{day.date}</p>
            <span className="text-2xl">{day.emoji}</span>
          </div>
          <Badge 
            variant="outline" 
            className={`font-mono text-lg ${
              isPositive ? "text-emerald-400 border-emerald-500/50" : 
              isNeutral ? "text-white/70 border-white/30" :
              "text-red-400 border-red-500/50"
            }`}
          >
            {day.sp500Change}
          </Badge>
        </div>
        
        <p className="text-white/90 text-sm mb-3 leading-relaxed">{day.prediction}</p>
        
        <div className="flex items-center gap-2 text-xs text-white/60">
          <ChevronRight className="w-3 h-3" />
          <span>{day.keyEvent}</span>
        </div>
      </Card>
    </motion.div>
  );
};

const SectorPill = ({ name, data }: { name: string; data: SectorOutlook }) => {
  const Icon = sectorIcons[name as keyof typeof sectorIcons];
  const outlookColors = {
    bullish: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    bearish: "bg-red-500/20 text-red-400 border-red-500/30",
    neutral: "bg-white/10 text-white/70 border-white/20",
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-3 rounded-xl border ${outlookColors[data.outlook]} backdrop-blur-sm`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium capitalize">{name}</span>
      </div>
      <p className="text-xs opacity-70">{data.reason}</p>
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
      if (isRefresh) toast.success("Forecast updated!");
    } catch (err) {
      console.error("Forecast error:", err);
      toast.error("Failed to load forecast");
      // Set fallback data
      setForecast(getFallbackForecast());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const SentimentIcon = forecast ? sentimentConfig[forecast.sentiment].icon : TrendingUp;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full bg-emerald-500/5 blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          style={{ top: "-30%", right: "-10%" }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ bottom: "-20%", left: "-10%" }}
        />
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <LineChart className="w-8 h-8 text-emerald-400" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white">Economic Outlook</h1>
          </div>
          <p className="text-white/50 text-sm flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            5-Day Forecast • <LiveClock />
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : forecast ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Headline Card */}
            <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <motion.h2 
                    className="text-2xl font-bold text-white mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {forecast.headline}
                  </motion.h2>
                  <div className="flex items-center gap-3">
                    <Badge className={`${sentimentConfig[forecast.sentiment].bg} ${sentimentConfig[forecast.sentiment].color} border-0`}>
                      <SentimentIcon className="w-3 h-3 mr-1" />
                      {forecast.sentiment.toUpperCase()}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fetchForecast(true)}
                      disabled={refreshing}
                      className="text-white/50 hover:text-white"
                    >
                      <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">AI Confidence</p>
                <ConfidenceMeter score={forecast.confidenceScore} />
              </div>

              {/* AI Insight */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-white/90 text-sm leading-relaxed">{forecast.aiInsight}</p>
                </div>
              </div>
            </Card>

            {/* Day-by-Day Forecast */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider px-1">
                Day-by-Day Outlook
              </h3>
              {forecast.days.map((day, index) => (
                <DayCard key={day.date} day={day} index={index} />
              ))}
            </div>

            {/* Sector Outlook */}
            <div>
              <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3 px-1">
                Sector Signals
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(forecast.sectors).map(([name, data]) => (
                  <SectorPill key={name} name={name} data={data} />
                ))}
              </div>
            </div>

            {/* Risk Factors */}
            <Card className="p-4 bg-red-500/5 border-red-500/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-medium text-red-400">Watch These Risks</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {forecast.riskFactors.map((risk, i) => (
                  <Badge key={i} variant="outline" className="text-xs text-red-300/80 border-red-500/30">
                    {risk}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Footer */}
            <div className="text-center space-y-2 pt-4">
              <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
                <Brain className="w-3 h-3" />
                <span>Powered by Gemini 3 Flash</span>
              </div>
              <p className="text-white/20 text-xs">
                Generated {new Date(forecast.generatedAt).toLocaleString()} • Not financial advice
              </p>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

// Fallback forecast if API fails
const getFallbackForecast = (): Forecast => ({
  headline: "Markets Navigate Policy Uncertainty",
  sentiment: "mixed",
  confidenceScore: 72,
  days: [
    { date: "Today", emoji: "📈", prediction: "Tech leads modest gains as AI enthusiasm continues.", sp500Change: "+0.4%", keyEvent: "Fed commentary on rates", mood: "optimistic" },
    { date: "Tomorrow", emoji: "➡️", prediction: "Sideways trading expected ahead of jobs data.", sp500Change: "±0.1%", keyEvent: "Weekly jobless claims", mood: "cautious" },
    { date: "Day 3", emoji: "📉", prediction: "Profit-taking likely after recent run-up.", sp500Change: "-0.3%", keyEvent: "Trade policy headlines", mood: "nervous" },
    { date: "Day 4", emoji: "📈", prediction: "Dip-buyers return, financials lead recovery.", sp500Change: "+0.5%", keyEvent: "Bank earnings preview", mood: "optimistic" },
    { date: "Day 5", emoji: "📈", prediction: "Week ends on positive note with tech momentum.", sp500Change: "+0.3%", keyEvent: "Consumer sentiment data", mood: "optimistic" },
  ],
  sectors: {
    tech: { outlook: "bullish", reason: "AI spending continues despite valuation concerns" },
    finance: { outlook: "neutral", reason: "Rate cuts helping but loan growth sluggish" },
    energy: { outlook: "bearish", reason: "Global demand worries persist" },
    healthcare: { outlook: "bullish", reason: "Defensive plays gain favor" },
  },
  aiInsight: "This week favors staying invested but keeping some cash ready. Tech remains the leader, but don't chase the highest flyers. Consider adding quality dividend stocks for balance.",
  riskFactors: ["Trade policy shifts", "Fed rate path uncertainty", "AI valuation concerns"],
  generatedAt: new Date().toISOString(),
});

export default EconomicForecast;
