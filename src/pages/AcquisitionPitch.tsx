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
  Cpu,
  Layers,
  Network
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import lavandarLogo from "@/assets/lavandar-logo.png";

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
  <Card className="bg-strata-charcoal/50 border-strata-steel/20 hover:border-strata-orange/30 transition-all duration-300">
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

const AcquisitionPitch = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValue(prev => (prev >= 100 ? 0 : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const sections = [
    { id: "overview", label: "Executive Overview" },
    { id: "gap", label: "Modernization Gap" },
    { id: "solution", label: "Solution Architecture" },
    { id: "metrics", label: "Success Metrics" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--strata-silver)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--strata-silver)) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Orbital rings */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 pointer-events-none opacity-20">
          <div className="relative w-[600px] h-[600px]">
            <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-12 rounded-full border border-purple-400/40 animate-[spin_45s_linear_infinite_reverse]" />
            <div className="absolute inset-24 rounded-full border border-purple-300/50 animate-[spin_30s_linear_infinite]" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <img src={lavandarLogo} alt="Lavandar AI" className="w-12 h-12 rounded-lg" />
              <div>
                <h1 className="font-instrument text-2xl text-purple-200 tracking-wider">
                  LAVANDAR AI
                </h1>
                <span className="text-[10px] font-mono uppercase tracking-widest text-strata-silver/50">
                  Strategic Acquisition Brief
                </span>
              </div>
            </div>
            <Badge variant="outline" className="border-strata-orange/50 text-strata-orange">
              CONFIDENTIAL
            </Badge>
          </div>

          {/* Main Hero */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/50 border border-purple-400/20 mb-6">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300">
                  Kraft Group • Patriots • Gillette Stadium
                </span>
              </div>
              
              <h2 className="font-instrument text-4xl lg:text-5xl text-strata-white mb-6 leading-tight">
                Modernizing Football Operations Through{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-strata-orange">
                  Conversational AI
                </span>
              </h2>
              
              <p className="text-lg text-strata-silver/70 mb-8">
                A strategic acquisition to transform the New England Patriots' operations 
                and maximize Gillette Stadium's revenue ecosystem through predictive intelligence.
              </p>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate("/patriot-way")}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-instrument tracking-wider rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg shadow-purple-900/30"
                >
                  <Trophy className="w-5 h-5" />
                  View Game Day Demo
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => navigate("/strata")}
                  className="flex items-center gap-2 px-6 py-3 bg-strata-charcoal border border-strata-steel/30 text-strata-silver font-instrument tracking-wider rounded-lg hover:bg-strata-steel/20 transition-all"
                >
                  <Layers className="w-5 h-5" />
                  Weather Intelligence Platform
                </button>
              </div>
            </div>

            {/* Objective Card */}
            <Card className="bg-gradient-to-br from-purple-950/40 to-strata-charcoal/60 border-purple-400/20">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-strata-orange" />
                  <span className="text-xs font-mono uppercase tracking-wider text-strata-silver/60">
                    Primary Objective
                  </span>
                </div>
                <CardTitle className="text-xl font-instrument text-strata-white">
                  2025-2030 Modernization Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-strata-silver/70">
                  Evaluate Lavandar AI as a strategic cornerstone focusing on:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-strata-lume mt-0.5" />
                    <span className="text-sm text-strata-silver">
                      <strong className="text-strata-white">Force Multiplier</strong> for current staff augmentation
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Network className="w-4 h-4 text-strata-cyan mt-0.5" />
                    <span className="text-sm text-strata-silver">
                      <strong className="text-strata-white">KAGR Integration</strong> with Kraft Analytics Group
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-strata-orange mt-0.5" />
                    <span className="text-sm text-strata-silver">
                      <strong className="text-strata-white">Fan Engagement</strong> redefinition before 2026 FIFA World Cup
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* The Modernization Gap */}
      <section className="py-16 bg-strata-charcoal/30 border-y border-strata-steel/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-strata-orange to-transparent rounded-full" />
            <div>
              <h3 className="text-2xl font-instrument text-strata-white">
                The Modernization Gap
              </h3>
              <p className="text-xs font-mono uppercase tracking-wider text-strata-silver/50">
                Post-Belichick Model Transition
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-strata-charcoal/50 border-strata-red/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-strata-red" />
                  <CardTitle className="text-base font-instrument text-strata-white">
                    Staff & Analytics
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-strata-silver/70">
                  Critical need for augmentation following organizational transition. 
                  AI-powered decision support to enhance coaching and front office capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-strata-charcoal/50 border-strata-orange/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-strata-orange" />
                  <CardTitle className="text-base font-instrument text-strata-white">
                    Gillette Stadium
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-strata-silver/70">
                  Leverage $250M+ investment for AI-driven fan experience. 
                  Frictionless monetization and predictive personalization at scale.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-strata-charcoal/50 border-strata-cyan/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-strata-cyan" />
                  <CardTitle className="text-base font-instrument text-strata-white">
                    KAGR Data Assets
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-strata-silver/70">
                  Transform Kraft Analytics Group data into real-time operational insights.
                  Unified intelligence across all Kraft Group properties.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Architecture */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-transparent rounded-full" />
            <div>
              <h3 className="text-2xl font-instrument text-strata-white">
                Solution Architecture
              </h3>
              <p className="text-xs font-mono uppercase tracking-wider text-strata-silver/50">
                Conversational & Predictive Intelligence Layer
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Football Operations */}
            <CapabilityCard
              title="Football Operations"
              description="AI-powered decision intelligence for on-field competitive advantage."
              icon={<Trophy className="w-5 h-5 text-strata-lume" />}
              color="bg-strata-lume/10"
              features={[
                "Predictive Play-Calling with real-time defensive pattern recognition",
                "Dynamic Training Optimization based on biometric data streams",
                "Scouting Synthesis to automate prospect evaluation across 130+ metrics"
              ]}
            />

            {/* Fan Experience */}
            <CapabilityCard
              title="Fan Experience"
              description="Transform Gillette Stadium into an AI-native venue for the 2026 World Cup."
              icon={<Ticket className="w-5 h-5 text-strata-orange" />}
              color="bg-strata-orange/10"
              features={[
                "Frictionless Monetization with AI wayfinding and ticketless entry",
                "Predictive Personalization based on betting patterns, retail history",
                "Real-time crowd sentiment analysis and experience optimization"
              ]}
            />

            {/* Enterprise Integration */}
            <CapabilityCard
              title="Enterprise Integration"
              description="Kraft Group-wide synergies through unified intelligence."
              icon={<Building2 className="w-5 h-5 text-strata-cyan" />}
              color="bg-strata-cyan/10"
              features={[
                "International Forest Products (IFP) supply chain visibility via NLP",
                "Unified cross-portfolio CRM (Patriots, Revolution, Patriot Place)",
                "Integrated analytics dashboard for executive decision-making"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16 bg-gradient-to-b from-strata-charcoal/50 to-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-1 h-8 bg-gradient-to-b from-strata-lume to-transparent rounded-full" />
            <div>
              <h3 className="text-2xl font-instrument text-strata-white">
                Projected Success Metrics
              </h3>
              <p className="text-xs font-mono uppercase tracking-wider text-strata-silver/50">
                2025-2030 Strategic Targets
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* On-Field */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-strata-lume" />
                <span className="text-sm font-mono uppercase tracking-wider text-strata-silver/70">
                  On-Field Performance
                </span>
              </div>
              <MetricCard
                title="Draft Hit Rate"
                value="+15%"
                change="High-Value prospect identification"
                icon={<Target className="w-4 h-4" />}
                category="on-field"
              />
              <div className="p-3 rounded-lg border border-strata-lume/20 bg-strata-lume/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono uppercase text-strata-silver/50">
                    Play Prediction Accuracy
                  </span>
                  <span className="text-xs font-mono text-strata-lume">87%</span>
                </div>
                <Progress value={87} className="h-1.5" />
              </div>
            </div>

            {/* Business */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-strata-orange" />
                <span className="text-sm font-mono uppercase tracking-wider text-strata-silver/70">
                  Business Impact
                </span>
              </div>
              <MetricCard
                title="Per-Fan Revenue"
                value="+25%"
                change="Concession & retail spend lift"
                icon={<TrendingUp className="w-4 h-4" />}
                category="business"
              />
              <div className="p-3 rounded-lg border border-strata-orange/20 bg-strata-orange/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono uppercase text-strata-silver/50">
                    Personalization Coverage
                  </span>
                  <span className="text-xs font-mono text-strata-orange">92%</span>
                </div>
                <Progress value={92} className="h-1.5" />
              </div>
            </div>

            {/* Operational */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-strata-cyan" />
                <span className="text-sm font-mono uppercase tracking-wider text-strata-silver/70">
                  Operational Efficiency
                </span>
              </div>
              <MetricCard
                title="Response Time"
                value="-40%"
                change="Guest services optimization"
                icon={<Zap className="w-4 h-4" />}
                category="operational"
              />
              <div className="p-3 rounded-lg border border-strata-cyan/20 bg-strata-cyan/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono uppercase text-strata-silver/50">
                    System Uptime
                  </span>
                  <span className="text-xs font-mono text-strata-cyan">99.9%</span>
                </div>
                <Progress value={99.9} className="h-1.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Demos */}
      <section className="py-16 border-t border-strata-steel/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-strata-orange to-transparent rounded-full" />
            <div>
              <h3 className="text-2xl font-instrument text-strata-white">
                Platform Demonstrations
              </h3>
              <p className="text-xs font-mono uppercase tracking-wider text-strata-silver/50">
                Live Intelligence Systems
              </p>
            </div>
          </div>

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
                Real-time play-calling intelligence with weather integration
              </p>
              <div className="flex items-center gap-1 text-xs font-mono text-strata-orange group-hover:translate-x-1 transition-transform">
                Launch Demo <ArrowUpRight className="w-3 h-3" />
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
                Precision atmospheric monitoring instrument
              </p>
              <div className="flex items-center gap-1 text-xs font-mono text-strata-orange group-hover:translate-x-1 transition-transform">
                Launch Demo <ArrowUpRight className="w-3 h-3" />
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
                Team travel optimization and flight planning
              </p>
              <div className="flex items-center gap-1 text-xs font-mono text-strata-orange group-hover:translate-x-1 transition-transform">
                Launch Demo <ArrowUpRight className="w-3 h-3" />
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
                Stadium event planning and fan experience
              </p>
              <div className="flex items-center gap-1 text-xs font-mono text-strata-orange group-hover:translate-x-1 transition-transform">
                Launch Demo <ArrowUpRight className="w-3 h-3" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-gradient-to-r from-purple-950/30 to-strata-charcoal/50 border-t border-purple-400/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={lavandarLogo} alt="Lavandar AI" className="w-10 h-10 rounded-lg" />
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="font-instrument text-2xl text-strata-white mb-2">
            Ready to Transform Patriots Operations?
          </h3>
          <p className="text-sm text-strata-silver/60 mb-6">
            Schedule a strategic briefing with Lavandar AI leadership
          </p>
          <a 
            href="mailto:admin@lavandar.ai"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-instrument tracking-wider rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg shadow-purple-900/30"
          >
            Contact admin@lavandar.ai
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default AcquisitionPitch;
