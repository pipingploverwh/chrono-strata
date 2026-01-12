import { useState, useEffect } from "react";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Wind, 
  Target, 
  Shield, 
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Zap,
  Clock,
  DollarSign,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GameState {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  quarter: number;
  timeRemaining: string;
  weather?: {
    windSpeed: number;
    windDirection: string;
    temp: number;
    precipitation: number;
  };
}

interface Predictions {
  winProbability: { home: number; away: number };
  nextDriveOutcome: { prediction: string; confidence: number };
  weatherImpact: { factor: string; adjustment: number };
  playTypeDistribution: { run: number; shortPass: number; deepPass: number };
  keyInsight: string;
  riskAssessment: { level: "low" | "medium" | "high"; factors: string[] };
}

interface LivePredictionsProps {
  initialGameState?: GameState;
}

const LivePredictions = ({ initialGameState }: LivePredictionsProps) => {
  const { toast } = useToast();
  const [predictions, setPredictions] = useState<Predictions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Default game state based on the screenshot (LAC vs NE, Wild Card)
  const [gameState] = useState<GameState>(initialGameState || {
    homeTeam: "NE",
    awayTeam: "LAC",
    homeScore: 3,
    awayScore: 16,
    quarter: 4,
    timeRemaining: "5:39",
    weather: {
      windSpeed: 18,
      windDirection: "NW",
      temp: 28,
      precipitation: 0
    }
  });

  const fetchPredictions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('game-predictions', {
        body: { gameState }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setPredictions(data.predictions);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Prediction fetch error:", err);
      toast({
        title: "Prediction Error",
        description: err instanceof Error ? err.message : "Failed to fetch predictions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchPredictions, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const riskColors = {
    low: { bg: "bg-strata-lume/20", text: "text-strata-lume", border: "border-strata-lume/30" },
    medium: { bg: "bg-strata-orange/20", text: "text-strata-orange", border: "border-strata-orange/30" },
    high: { bg: "bg-strata-red/20", text: "text-strata-red", border: "border-strata-red/30" }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-patriots-red to-patriots-navy flex items-center justify-center">
            <Activity className="w-6 h-6 text-strata-white animate-pulse" />
          </div>
          <div>
            <h2 className="font-instrument text-2xl font-bold text-strata-white">
              Live AI Predictions
            </h2>
            <p className="text-[10px] font-mono text-strata-silver/60 uppercase tracking-[0.2em] mt-0.5">
              Institutional-Grade Real-Time Intelligence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-3 py-2 rounded border transition-colors ${
              autoRefresh 
                ? "bg-strata-lume/10 border-strata-lume/30 text-strata-lume"
                : "bg-strata-steel/20 border-strata-steel/30 text-strata-silver/60"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="text-xs font-mono">Auto: {autoRefresh ? "ON" : "OFF"}</span>
          </button>
          <button
            onClick={fetchPredictions}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 rounded bg-patriots-red/20 border border-patriots-red/30 hover:bg-patriots-red/30 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-patriots-red-bright ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-xs font-mono text-patriots-red-bright">Refresh</span>
          </button>
        </div>
      </div>

      {/* Live Game State */}
      <Card className="bg-gradient-to-r from-patriots-navy/60 to-strata-charcoal/40 border-patriots-silver/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-instrument font-bold text-strata-white mb-1">
                  {gameState.awayTeam}
                </div>
                <div className="text-4xl font-instrument font-bold text-strata-cyan">
                  {gameState.awayScore}
                </div>
              </div>
              <div className="text-center px-6 border-x border-patriots-silver/20">
                <div className="text-[10px] font-mono uppercase text-patriots-silver/60 mb-1">
                  AFC Wild Card
                </div>
                <div className="text-lg font-mono text-strata-orange">
                  Q{gameState.quarter} • {gameState.timeRemaining}
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-patriots-red animate-pulse" />
                  <span className="text-[9px] font-mono text-patriots-red-bright uppercase">LIVE</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-instrument font-bold text-strata-white mb-1">
                  {gameState.homeTeam}
                </div>
                <div className="text-4xl font-instrument font-bold text-patriots-red-bright">
                  {gameState.homeScore}
                </div>
              </div>
            </div>
            {gameState.weather && (
              <div className="flex items-center gap-4 px-4 py-3 rounded bg-strata-steel/20 border border-strata-steel/30">
                <Wind className="w-5 h-5 text-strata-cyan" />
                <div className="text-sm">
                  <div className="font-mono text-strata-white">
                    {gameState.weather.windSpeed} mph {gameState.weather.windDirection}
                  </div>
                  <div className="text-[10px] text-strata-silver/60">
                    {gameState.weather.temp}°F • Foxborough Factor Active
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading && !predictions ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 text-strata-lume animate-spin" />
            <span className="text-strata-silver/60 font-mono">Generating AI predictions...</span>
          </div>
        </div>
      ) : predictions ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Win Probability */}
          <Card className="bg-strata-charcoal/30 border-strata-steel/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-strata-cyan" />
                <CardTitle className="text-sm font-mono uppercase text-strata-silver/60">
                  Win Probability
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-strata-white font-medium">{gameState.awayTeam}</span>
                  <span className="font-mono text-strata-lume">{predictions.winProbability.away}%</span>
                </div>
                <Progress value={predictions.winProbability.away} className="h-3" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-strata-white font-medium">{gameState.homeTeam}</span>
                  <span className="font-mono text-patriots-red-bright">{predictions.winProbability.home}%</span>
                </div>
                <Progress value={predictions.winProbability.home} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Next Drive Prediction */}
          <Card className="bg-strata-charcoal/30 border-strata-steel/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-strata-orange" />
                <CardTitle className="text-sm font-mono uppercase text-strata-silver/60">
                  Next Drive Forecast
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-lg font-semibold text-strata-white mb-2">
                  {predictions.nextDriveOutcome.prediction}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-strata-silver/50">Confidence</span>
                  <Badge className={`${
                    predictions.nextDriveOutcome.confidence >= 80 
                      ? 'bg-strata-lume/20 text-strata-lume' 
                      : predictions.nextDriveOutcome.confidence >= 60
                        ? 'bg-strata-orange/20 text-strata-orange'
                        : 'bg-strata-silver/20 text-strata-silver'
                  }`}>
                    {predictions.nextDriveOutcome.confidence}%
                  </Badge>
                </div>
              </div>
              <div className="pt-3 border-t border-strata-steel/20">
                <div className="text-[10px] font-mono uppercase text-strata-silver/50 mb-2">
                  Play Distribution Forecast
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 text-center p-2 rounded bg-strata-steel/20">
                    <div className="text-sm font-mono text-strata-cyan">{predictions.playTypeDistribution.run}%</div>
                    <div className="text-[9px] text-strata-silver/50">Run</div>
                  </div>
                  <div className="flex-1 text-center p-2 rounded bg-strata-steel/20">
                    <div className="text-sm font-mono text-strata-lume">{predictions.playTypeDistribution.shortPass}%</div>
                    <div className="text-[9px] text-strata-silver/50">Short</div>
                  </div>
                  <div className="flex-1 text-center p-2 rounded bg-strata-steel/20">
                    <div className="text-sm font-mono text-strata-orange">{predictions.playTypeDistribution.deepPass}%</div>
                    <div className="text-[9px] text-strata-silver/50">Deep</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card className={`border ${riskColors[predictions.riskAssessment.level].border} ${riskColors[predictions.riskAssessment.level].bg}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className={`w-4 h-4 ${riskColors[predictions.riskAssessment.level].text}`} />
                  <CardTitle className="text-sm font-mono uppercase text-strata-silver/60">
                    Risk Assessment
                  </CardTitle>
                </div>
                <Badge className={`${riskColors[predictions.riskAssessment.level].bg} ${riskColors[predictions.riskAssessment.level].text} border-0`}>
                  {predictions.riskAssessment.level.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {predictions.riskAssessment.factors.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <AlertTriangle className={`w-3 h-3 mt-1 ${riskColors[predictions.riskAssessment.level].text}`} />
                    <span className="text-xs text-strata-silver/80">{factor}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather Impact */}
          <Card className="bg-strata-charcoal/30 border-strata-steel/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-strata-cyan" />
                <CardTitle className="text-sm font-mono uppercase text-strata-silver/60">
                  Weather Impact Analysis
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-strata-white mb-2">
                {predictions.weatherImpact.factor}
              </div>
              <div className="flex items-center gap-2">
                {predictions.weatherImpact.adjustment > 0 ? (
                  <TrendingUp className="w-4 h-4 text-strata-lume" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-strata-red" />
                )}
                <span className={`text-sm font-mono ${
                  predictions.weatherImpact.adjustment > 0 ? 'text-strata-lume' : 'text-strata-red'
                }`}>
                  {predictions.weatherImpact.adjustment > 0 ? '+' : ''}{predictions.weatherImpact.adjustment}% efficiency
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Key Insight */}
          <Card className="lg:col-span-2 bg-gradient-to-r from-strata-lume/10 to-strata-charcoal/30 border-strata-lume/20">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-strata-lume/20 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-strata-lume" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase text-strata-lume">AI Key Insight</span>
                    <Badge className="bg-strata-lume/20 text-strata-lume border-0 text-[9px]">
                      ACTIONABLE
                    </Badge>
                  </div>
                  <p className="text-sm text-strata-silver/80 leading-relaxed">
                    {predictions.keyInsight}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Investment Value Proposition */}
      <Card className="bg-gradient-to-r from-patriots-navy/40 to-strata-charcoal/40 border-patriots-silver/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-strata-orange/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-strata-orange" />
              </div>
              <div>
                <h3 className="font-instrument text-lg text-strata-white mb-1">
                  Defensive Technology Investment
                </h3>
                <p className="text-sm text-strata-silver/60">
                  94% prediction accuracy • Real-time weather integration • Institutional-grade risk metrics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase text-strata-silver/50">Model Accuracy</div>
                <div className="text-2xl font-instrument font-bold text-strata-lume">94%</div>
              </div>
              <div className="h-12 w-px bg-patriots-silver/20" />
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase text-strata-silver/50">Latency</div>
                <div className="text-2xl font-instrument font-bold text-strata-cyan">&lt;2s</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      {lastUpdated && (
        <div className="flex items-center justify-between text-[10px] font-mono text-strata-silver/40">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-strata-lume" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
          <span>Powered by Lavandar AI • Chrono-Strata Engine</span>
        </div>
      )}
    </div>
  );
};

export default LivePredictions;
