import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Brain, 
  Target, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3,
  Building2,
  Trophy,
  Ticket,
  ShoppingCart,
  Globe,
  ChevronRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Layers,
  Network,
  Activity,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import lavandarLogo from "@/assets/lavandar-logo.png";
import ModernizationTimeline from "@/components/ModernizationTimeline";
import KAGRDashboard from "@/components/KAGRDashboard";
import PerformanceAnalytics from "@/components/PerformanceAnalytics";
import LivePredictions from "@/components/LivePredictions";
import { useSportsData } from "@/hooks/useSportsData";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  category: "on-field" | "business" | "operational";
}

const MetricCard = ({ title, value, change, icon, category }: MetricCardProps) => {
  const categoryColors = {
    "on-field": "border-strata-lume/30 bg-strata-lume/5",
    "business": "border-strata-orange/30 bg-strata-orange/5",
    "operational": "border-strata-cyan/30 bg-strata-cyan/5"
  };
  
  const valueColors = {
    "on-field": "text-strata-lume",
    "business": "text-strata-orange",
    "operational": "text-strata-cyan"
  };

  return (
    <div className={`p-4 rounded-lg border ${categoryColors[category]}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-strata-silver/70">
          {title}
        </span>
        <div className="text-strata-silver/50">{icon}</div>
      </div>
      <div className={`text-2xl font-instrument font-bold ${valueColors[category]}`}>
        {value}
      </div>
      <div className="text-xs font-mono text-strata-silver/50 mt-1">
        {change}
      </div>
    </div>
  );
};

interface CapabilityCardProps {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
}

const CapabilityCard = ({ title, description, features, icon, color }: CapabilityCardProps) => (
  <Card className="bg-strata-charcoal/50 border-strata-steel/20 hover:border-strata-steel/40 transition-all duration-300">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <CardTitle className="text-lg font-instrument text-strata-white">
          {title}
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-strata-silver/70 mb-4">
        {description}
      </p>
      <ul className="space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs font-mono text-strata-silver/60">
            <CheckCircle2 className="w-3 h-3 text-strata-lume mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const LiveGameStrip = () => {
  const { patriotsGame, revolutionGame, isLoading, lastUpdated, refetch } = useSportsData();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-strata-silver/50 text-xs font-mono">
        <RefreshCw className="w-3 h-3 animate-spin" />
        Syncing game data...
      </div>
    );
  }

  const hasGame = patriotsGame || revolutionGame;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {patriotsGame && (
        <div className="flex items-center gap-3 px-3 py-2 rounded bg-patriots-navy/30 border border-patriots-silver/20">
          <div className="flex items-center gap-2">
            {patriotsGame.isLive && (
              <div className="w-2 h-2 rounded-full bg-patriots-red animate-pulse" />
            )}
            <span className="text-[10px] font-mono uppercase text-strata-silver/50">NFL</span>
          </div>
          <span className="text-sm font-mono text-strata-white">
            {patriotsGame.awayTeam.abbreviation} {patriotsGame.awayTeam.score} - {patriotsGame.homeTeam.score} {patriotsGame.homeTeam.abbreviation}
          </span>
          <span className="text-[9px] font-mono text-strata-silver/40">
            {patriotsGame.statusDetail}
          </span>
        </div>
      )}
      {revolutionGame && (
        <div className="flex items-center gap-3 px-3 py-2 rounded bg-blue-950/30 border border-blue-400/20">
          <div className="flex items-center gap-2">
            {revolutionGame.isLive && (
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            )}
            <span className="text-[10px] font-mono uppercase text-strata-silver/50">MLS</span>
          </div>
          <span className="text-sm font-mono text-strata-white">
            {revolutionGame.awayTeam.abbreviation} {revolutionGame.awayTeam.score} - {revolutionGame.homeTeam.score} {revolutionGame.homeTeam.abbreviation}
          </span>
          <span className="text-[9px] font-mono text-strata-silver/40">
            {revolutionGame.statusDetail}
          </span>
        </div>
      )}
      {!hasGame && (
        <span className="text-xs font-mono text-strata-silver/40">No active games</span>
      )}
      {lastUpdated && (
        <button 
          onClick={refetch}
          className="flex items-center gap-1 text-[9px] font-mono text-strata-silver/30 hover:text-strata-silver/50 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          {lastUpdated.toLocaleTimeString()}
        </button>
      )}
    </div>
  );
};

const OperationalDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("portfolio");

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Understated, operational feel */}
      <header className="border-b border-strata-steel/20 bg-strata-charcoal/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={lavandarLogo} alt="" className="w-10 h-10 rounded-lg" />
              <div>
                <h1 className="font-instrument text-xl text-strata-white tracking-wide">
                  Operations Console
                </h1>
                <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-strata-silver/40">
                  Kraft Group Enterprise Intelligence
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LiveGameStrip />
              <div className="h-6 w-px bg-strata-steel/30" />
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-strata-lume" />
                <span className="text-[10px] font-mono text-strata-lume">System Operational</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-strata-charcoal/50 border border-strata-steel/20 p-1">
            <TabsTrigger 
              value="portfolio" 
              className="data-[state=active]:bg-strata-steel/30 data-[state=active]:text-strata-white text-strata-silver/60"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Portfolio Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="roadmap" 
              className="data-[state=active]:bg-strata-steel/30 data-[state=active]:text-strata-white text-strata-silver/60"
            >
              <Target className="w-4 h-4 mr-2" />
              Implementation Roadmap
            </TabsTrigger>
            <TabsTrigger 
              value="capabilities" 
              className="data-[state=active]:bg-strata-steel/30 data-[state=active]:text-strata-white text-strata-silver/60"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Capabilities
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-strata-steel/30 data-[state=active]:text-strata-white text-strata-silver/60"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Performance Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="predictions" 
              className="data-[state=active]:bg-patriots-red/30 data-[state=active]:text-patriots-red-bright text-strata-silver/60"
            >
              <Activity className="w-4 h-4 mr-2" />
              Live Predictions
            </TabsTrigger>
            <TabsTrigger 
              value="systems" 
              className="data-[state=active]:bg-strata-steel/30 data-[state=active]:text-strata-white text-strata-silver/60"
            >
              <Layers className="w-4 h-4 mr-2" />
              Live Systems
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Analytics Tab */}
          <TabsContent value="portfolio" className="space-y-8">
            <KAGRDashboard />
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ModernizationTimeline />
              </div>
              
              {/* Context Panel */}
              <div className="space-y-6">
                <Card className="bg-strata-charcoal/30 border-strata-steel/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-mono uppercase tracking-wider text-strata-silver/50">
                      Current Phase
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-strata-orange animate-pulse" />
                      <span className="font-instrument text-lg text-strata-white">Q2 2025</span>
                    </div>
                    <p className="text-sm text-strata-silver/60">
                      KAGR Data Unification - Cross-property analytics consolidation
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-strata-silver/50">Phase Progress</span>
                        <span className="text-strata-orange">67%</span>
                      </div>
                      <Progress value={67} className="h-1.5" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-strata-charcoal/30 border-strata-steel/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-mono uppercase tracking-wider text-strata-silver/50">
                      Key Milestones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-strata-lume" />
                      <span className="text-xs text-strata-silver/60">Weather API integration complete</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-strata-lume" />
                      <span className="text-xs text-strata-silver/60">Real-time data pipeline operational</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-strata-orange" />
                      <span className="text-xs text-strata-silver/60">CRM unification in progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-strata-silver/30" />
                      <span className="text-xs text-strata-silver/40">Fan profile synthesis pending</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="p-4 rounded border border-strata-cyan/20 bg-strata-cyan/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-strata-cyan" />
                    <span className="text-xs font-mono uppercase text-strata-cyan">2026 World Cup</span>
                  </div>
                  <p className="text-[11px] text-strata-silver/50">
                    Target: Full AI-native venue operations for FIFA World Cup matches at Gillette Stadium
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Capabilities Tab */}
          <TabsContent value="capabilities" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-6">
              <CapabilityCard
                title="Football Operations"
                description="Decision intelligence for on-field competitive advantage."
                icon={<Trophy className="w-5 h-5 text-strata-lume" />}
                color="bg-strata-lume/10"
                features={[
                  "Predictive Play-Calling with defensive pattern recognition",
                  "Dynamic Training Optimization via biometric streams",
                  "Scouting Synthesis across 130+ prospect metrics"
                ]}
              />
              <CapabilityCard
                title="Fan Experience"
                description="AI-native venue transformation for next-gen engagement."
                icon={<Ticket className="w-5 h-5 text-strata-orange" />}
                color="bg-strata-orange/10"
                features={[
                  "Frictionless Monetization with ticketless entry",
                  "Predictive Personalization from behavior patterns",
                  "Real-time crowd sentiment and experience optimization"
                ]}
              />
              <CapabilityCard
                title="Enterprise Integration"
                description="Portfolio-wide intelligence and operational synergies."
                icon={<Building2 className="w-5 h-5 text-strata-cyan" />}
                color="bg-strata-cyan/10"
                features={[
                  "IFP supply chain visibility via NLP",
                  "Unified CRM across all Kraft properties",
                  "Executive analytics dashboard integration"
                ]}
              />
            </div>

            {/* Performance Targets */}
            <div className="grid md:grid-cols-3 gap-6 pt-8 border-t border-strata-steel/20">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-strata-lume" />
                  <span className="text-sm font-mono uppercase tracking-wider text-strata-silver/70">
                    On-Field
                  </span>
                </div>
                <MetricCard
                  title="Draft Hit Rate"
                  value="+15%"
                  change="High-value prospect identification"
                  icon={<Target className="w-4 h-4" />}
                  category="on-field"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-strata-orange" />
                  <span className="text-sm font-mono uppercase tracking-wider text-strata-silver/70">
                    Business
                  </span>
                </div>
                <MetricCard
                  title="Per-Fan Revenue"
                  value="+25%"
                  change="Concession & retail lift"
                  icon={<TrendingUp className="w-4 h-4" />}
                  category="business"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-strata-cyan" />
                  <span className="text-sm font-mono uppercase tracking-wider text-strata-silver/70">
                    Operational
                  </span>
                </div>
                <MetricCard
                  title="Response Time"
                  value="-40%"
                  change="Guest services optimization"
                  icon={<Zap className="w-4 h-4" />}
                  category="operational"
                />
              </div>
            </div>
          </TabsContent>

          {/* Performance Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <PerformanceAnalytics />
          </TabsContent>

          {/* Live Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <LivePredictions />
          </TabsContent>

          {/* Live Systems Tab */}
          <TabsContent value="systems" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => navigate("/patriot-way")}
                className="group p-6 rounded-lg bg-gradient-to-br from-patriots-navy/40 to-strata-charcoal/60 border border-patriots-silver/20 hover:border-patriots-red/40 transition-all text-left"
              >
                <Trophy className="w-8 h-8 text-patriots-red mb-3" />
                <h4 className="font-instrument text-lg text-strata-white mb-1">
                  Game Day Command
                </h4>
                <p className="text-xs text-strata-silver/60 mb-3">
                  Real-time play-calling with weather integration
                </p>
                <div className="flex items-center gap-1 text-xs font-mono text-strata-orange group-hover:translate-x-1 transition-transform">
                  Launch <ArrowUpRight className="w-3 h-3" />
                </div>
              </button>

              <button 
                onClick={() => navigate("/strata")}
                className="group p-6 rounded-lg bg-strata-charcoal/50 border border-strata-steel/20 hover:border-strata-orange/40 transition-all text-left"
              >
                <Layers className="w-8 h-8 text-strata-orange mb-3" />
                <h4 className="font-instrument text-lg text-strata-white mb-1">
                  STRATA Weather
                </h4>
                <p className="text-xs text-strata-silver/60 mb-3">
                  Precision atmospheric monitoring
                </p>
                <div className="flex items-center gap-1 text-xs font-mono text-strata-orange group-hover:translate-x-1 transition-transform">
                  Launch <ArrowUpRight className="w-3 h-3" />
                </div>
              </button>

              <button 
                onClick={() => navigate("/strata-aviation")}
                className="group p-6 rounded-lg bg-strata-charcoal/50 border border-strata-steel/20 hover:border-strata-cyan/40 transition-all text-left"
              >
                <Globe className="w-8 h-8 text-strata-cyan mb-3" />
                <h4 className="font-instrument text-lg text-strata-white mb-1">
                  Aviation Suite
                </h4>
                <p className="text-xs text-strata-silver/60 mb-3">
                  Team travel optimization
                </p>
                <div className="flex items-center gap-1 text-xs font-mono text-strata-orange group-hover:translate-x-1 transition-transform">
                  Launch <ArrowUpRight className="w-3 h-3" />
                </div>
              </button>

              <button 
                onClick={() => navigate("/strata-events")}
                className="group p-6 rounded-lg bg-strata-charcoal/50 border border-strata-steel/20 hover:border-strata-lume/40 transition-all text-left"
              >
                <Ticket className="w-8 h-8 text-strata-lume mb-3" />
                <h4 className="font-instrument text-lg text-strata-white mb-1">
                  Events Platform
                </h4>
                <p className="text-xs text-strata-silver/60 mb-3">
                  Stadium operations hub
                </p>
                <div className="flex items-center gap-1 text-xs font-mono text-strata-orange group-hover:translate-x-1 transition-transform">
                  Launch <ArrowUpRight className="w-3 h-3" />
                </div>
              </button>
            </div>

            {/* Additional system links */}
            <div className="grid md:grid-cols-3 gap-4">
              <button 
                onClick={() => navigate("/patriots-evaluation")}
                className="flex items-center justify-between p-4 rounded border border-strata-steel/20 bg-strata-charcoal/20 hover:bg-strata-charcoal/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-patriots-silver" />
                  <span className="text-sm font-instrument text-strata-white">Game Intel</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-strata-silver/40" />
              </button>
              
              <button 
                onClick={() => navigate("/strata-marine")}
                className="flex items-center justify-between p-4 rounded border border-strata-steel/20 bg-strata-charcoal/20 hover:bg-strata-charcoal/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Network className="w-5 h-5 text-strata-blue" />
                  <span className="text-sm font-instrument text-strata-white">Marine Ops</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-strata-silver/40" />
              </button>
              
              <button 
                onClick={() => navigate("/strata-construction")}
                className="flex items-center justify-between p-4 rounded border border-strata-steel/20 bg-strata-charcoal/20 hover:bg-strata-charcoal/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-strata-orange" />
                  <span className="text-sm font-instrument text-strata-white">Construction</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-strata-silver/40" />
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Minimal footer */}
      <footer className="border-t border-strata-steel/10 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={lavandarLogo} alt="" className="w-6 h-6 rounded" />
            <span className="text-[10px] font-mono text-strata-silver/30 uppercase tracking-wider">
              Lavandar AI • Enterprise Intelligence Platform
            </span>
          </div>
          <span className="text-[9px] font-mono text-strata-silver/20">
            System v2.4.1 • Data refresh: 30s
          </span>
        </div>
      </footer>
    </div>
  );
};

export default OperationalDashboard;
