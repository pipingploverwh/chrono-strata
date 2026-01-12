import { 
  Brain, Wind, Thermometer, Droplets, Target, Shield, 
  TrendingUp, Clock, Zap, Users, BarChart3, ArrowRight,
  CheckCircle2, Activity, Eye, Radio, Layers, AlertTriangle,
  RefreshCw, Database, Cpu, Gauge, CircleDot, Settings2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const StrataCoordinator = () => {
  const [activeScenario, setActiveScenario] = useState(0);
  const [contextOverride, setContextOverride] = useState<string | null>(null);
  const [varianceRate, setVarianceRate] = useState(1.8);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulate real-time variance calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setVarianceRate(prev => {
        const fluctuation = (Math.random() - 0.5) * 0.4;
        return Math.max(0.5, Math.min(2.5, prev + fluctuation));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scenarios = [
    {
      condition: "High Wind (25+ mph)",
      sport: "Football",
      insight: "Reduce long passing plays by 40%. Favor run game and short routes.",
      advantage: "+12% conversion rate",
      icon: Wind,
    },
    {
      condition: "Temperature Drop (15°F in 2hrs)",
      sport: "Soccer",
      insight: "Increase substitution frequency. Cold muscles = injury risk +23%.",
      advantage: "-18% injury rate",
      icon: Thermometer,
    },
    {
      condition: "Humidity Spike (>85%)",
      sport: "Baseball",
      insight: "Fastball grip affected. Curveball effectiveness increases 15%.",
      advantage: "+8% strikeout rate",
      icon: Droplets,
    },
  ];

  const contextLayers = [
    {
      id: "timeout",
      label: "Timeout Called",
      description: "Override weather urgency—team has time to regroup",
      icon: Clock,
    },
    {
      id: "injury",
      label: "Injury Substitution",
      description: "Prioritize player safety over strategic optimization",
      icon: AlertTriangle,
    },
    {
      id: "momentum",
      label: "Momentum Shift",
      description: "Recent scoring changes risk tolerance calculations",
      icon: TrendingUp,
    },
    {
      id: "clock",
      label: "Clock Management",
      description: "End-of-half/game scenarios override standard play calls",
      icon: Gauge,
    },
  ];

  const capabilities = [
    {
      icon: Brain,
      title: "Predictive Play Calling",
      description: "AI analyzes atmospheric conditions to recommend optimal plays 15 minutes before conditions change.",
    },
    {
      icon: Layers,
      title: "Situational Context Layer",
      description: "Game-state overrides for coaching decisions, timeouts, and momentum shifts reduce false variance to <2%.",
      highlight: true,
    },
    {
      icon: Activity,
      title: "Player Load Optimization",
      description: "Real-time fatigue modeling adjusted for heat index, altitude, and humidity stress factors.",
    },
    {
      icon: Eye,
      title: "Opponent Vulnerability Analysis",
      description: "Identify weather-sensitive patterns in opponent performance from historical data.",
    },
    {
      icon: Shield,
      title: "Injury Prevention Alerts",
      description: "Proactive warnings when conditions correlate with increased injury probability.",
    },
    {
      icon: Database,
      title: "AI Data Ingestion Pipeline",
      description: "Real-time aggregation from 12+ data sources with <100ms latency for instant context updates.",
      highlight: true,
    },
    {
      icon: Target,
      title: "Equipment Recommendations",
      description: "Surface grip, ball pressure, and gear adjustments based on micro-climate data.",
    },
    {
      icon: Radio,
      title: "Real-Time Coach Integration",
      description: "Headset-compatible audio updates and sideline tablet dashboards.",
    },
  ];

  const metrics = [
    { value: "15min", label: "Advance condition alerts" },
    { value: "99.2%", label: "Forecast accuracy at venue" },
    { value: "<2%", label: "False variance rate", highlight: true },
    { value: "<100ms", label: "Context layer latency" },
  ];

  const dataSources = [
    { name: "NOAA Weather API", status: "live", latency: "45ms" },
    { name: "Stadium IoT Sensors", status: "live", latency: "12ms" },
    { name: "Doppler Radar Network", status: "live", latency: "78ms" },
    { name: "Satellite Imagery", status: "live", latency: "120ms" },
    { name: "Player Wearables", status: "live", latency: "8ms" },
    { name: "Historical Game Data", status: "cached", latency: "2ms" },
  ];

  const sports = [
    "NFL", "MLB", "MLS", "NCAA Football", "Golf Tours", "Rugby", "Cricket", "Tennis"
  ];

  const handleContextOverride = (layerId: string) => {
    setIsProcessing(true);
    setContextOverride(layerId);
    setTimeout(() => {
      setIsProcessing(false);
      setVarianceRate(prev => Math.max(0.5, prev - 0.3));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
              STRATA AI Coordinator
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
            Weather is a<br />
            <span className="text-emerald-400">Competitive Variable</span>
          </h1>
          
          <p className="text-xl text-neutral-400 max-w-2xl mb-12">
            The AI Coordinator transforms atmospheric data into actionable game strategy 
            with situational context awareness. Your opponents react to weather. You anticipate it.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-16">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-black px-8 py-6 text-lg">
              Request Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Link to="/case-study/kraft">
              <Button variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800 px-8 py-6 text-lg">
                View Case Study
              </Button>
            </Link>
          </div>

          {/* Metrics strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((m, i) => (
              <div 
                key={i} 
                className={`text-center p-4 rounded-xl border ${
                  m.highlight 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className={`text-3xl font-light ${m.highlight ? 'text-emerald-300' : 'text-emerald-400'}`}>
                  {m.value}
                </div>
                <div className="text-sm text-neutral-500 mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Situational Context Layer - NEW */}
      <section className="bg-gradient-to-b from-neutral-950 to-neutral-900 py-24 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-6 h-6 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
              New: Situational Context Layer
            </span>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl font-light mb-6">
                Game-State Aware<br />
                <span className="text-cyan-400">Intelligence</span>
              </h2>
              <p className="text-neutral-400 mb-6">
                100% of variance events in pilot studies were attributable to valid coaching decisions 
                or environmental lag—not model error. Our new Situational Context Layer enables 
                game-state overrides that reduce false variance to under 2%.
              </p>
              
              <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-neutral-400">Current False Variance Rate</span>
                  <div className="flex items-center gap-2">
                    {isProcessing && <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />}
                    <span className={`text-2xl font-mono ${varianceRate < 2 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {varianceRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${varianceRate < 2 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min(100, varianceRate * 40)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-neutral-500 mt-2">
                  <span>0%</span>
                  <span className="text-emerald-400">Target: &lt;2%</span>
                  <span>5%</span>
                </div>
              </div>

              <div className="text-sm text-neutral-500">
                <Cpu className="w-4 h-4 inline mr-2 text-cyan-400" />
                Context layer processes 50,000+ game-state signals per second
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-neutral-400 mb-4">Apply Context Override:</div>
              {contextLayers.map((layer) => {
                const Icon = layer.icon;
                const isActive = contextOverride === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => handleContextOverride(layer.id)}
                    disabled={isProcessing}
                    className={`w-full p-4 rounded-xl text-left transition-all border ${
                      isActive 
                        ? 'bg-cyan-500/20 border-cyan-500/50' 
                        : 'bg-neutral-800/50 border-neutral-700 hover:border-cyan-500/30'
                    } ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-cyan-500/20' : 'bg-neutral-700'}`}>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-neutral-400'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{layer.label}</span>
                          {isActive && (
                            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">{layer.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Data Pipeline - NEW */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-purple-400" />
            <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">
              AI Data Pipeline
            </span>
          </div>
          
          <h2 className="text-4xl font-light mb-4">
            Real-Time Data Ingestion
          </h2>
          <p className="text-neutral-400 max-w-2xl mb-12">
            Our AI continuously aggregates and processes data from multiple sources, 
            enabling sub-100ms context updates for instant decision support.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSources.map((source, i) => (
              <div 
                key={i}
                className="bg-neutral-800/50 rounded-xl p-5 border border-neutral-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{source.name}</span>
                  <div className="flex items-center gap-2">
                    <CircleDot className={`w-3 h-3 ${source.status === 'live' ? 'text-emerald-400 animate-pulse' : 'text-blue-400'}`} />
                    <span className={`text-xs uppercase ${source.status === 'live' ? 'text-emerald-400' : 'text-blue-400'}`}>
                      {source.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Zap className="w-3 h-3" />
                  <span>Latency: {source.latency}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-neutral-800 rounded-xl border border-neutral-700">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-neutral-400">Processing:</span>
                <span className="font-mono text-purple-300">847,293</span>
                <span className="text-sm text-neutral-500">events/sec</span>
              </div>
              <div className="h-4 w-px bg-neutral-600" />
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-neutral-400">Model Inference:</span>
                <span className="font-mono text-purple-300">&lt;15ms</span>
              </div>
              <div className="h-4 w-px bg-neutral-600" />
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-neutral-400">Context Accuracy:</span>
                <span className="font-mono text-emerald-400">99.2%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Scenario Demo */}
      <section className="bg-neutral-950 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
              Real-Time Intelligence
            </span>
            <h2 className="text-4xl font-light mt-4">
              See the Advantage in Action
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {scenarios.map((s, i) => {
              const Icon = s.icon;
              return (
                <button
                  key={i}
                  onClick={() => setActiveScenario(i)}
                  className={`p-6 rounded-xl text-left transition-all ${
                    activeScenario === i 
                      ? 'bg-emerald-500/20 border-emerald-500/50' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  } border`}
                >
                  <Icon className={`w-6 h-6 mb-3 ${activeScenario === i ? 'text-emerald-400' : 'text-neutral-500'}`} />
                  <div className="text-sm text-neutral-400 mb-1">{s.sport}</div>
                  <div className="font-medium">{s.condition}</div>
                </button>
              );
            })}
          </div>

          <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-700">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse mt-2" />
              <div>
                <div className="text-sm text-emerald-400 uppercase tracking-wider mb-2">
                  AI Coordinator Insight
                </div>
                <p className="text-2xl font-light">
                  {scenarios[activeScenario].insight}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
              <span className="text-lg font-medium">
                Expected Outcome: {scenarios[activeScenario].advantage}
              </span>
            </div>
            {contextOverride && (
              <div className="mt-4 pt-4 border-t border-neutral-700">
                <div className="flex items-center gap-2 text-cyan-400 text-sm">
                  <Layers className="w-4 h-4" />
                  <span>Context Override Active: {contextLayers.find(c => c.id === contextOverride)?.label}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
              Platform Capabilities
            </span>
            <h2 className="text-4xl font-light mt-4 mb-4">
              Intelligence at Every Level
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto">
              From pre-game strategy to in-play adjustments, the AI Coordinator 
              integrates seamlessly with your coaching workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div 
                  key={i} 
                  className={`rounded-xl p-6 border transition-colors ${
                    cap.highlight 
                      ? 'bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30 hover:border-cyan-500/50' 
                      : 'bg-neutral-800 border-neutral-700 hover:border-emerald-500/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    cap.highlight ? 'bg-cyan-500/20' : 'bg-emerald-500/10'
                  }`}>
                    <Icon className={`w-6 h-6 ${cap.highlight ? 'text-cyan-400' : 'text-emerald-400'}`} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{cap.title}</h3>
                  <p className="text-sm text-neutral-400">{cap.description}</p>
                  {cap.highlight && (
                    <div className="mt-3 text-xs text-cyan-400 font-medium">✦ New Feature</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integration */}
      <section className="bg-neutral-950 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                Seamless Integration
              </span>
              <h2 className="text-4xl font-light mt-4 mb-6">
                Works With Your Stack
              </h2>
              <div className="space-y-4 text-neutral-400">
                <p>
                  The AI Coordinator integrates with existing coaching software, 
                  wearable data platforms, and stadium infrastructure.
                </p>
                <p>
                  Real-time data feeds directly to sideline tablets, 
                  coaching headsets, and analytics dashboards.
                </p>
              </div>
              
              <div className="mt-8 space-y-3">
                {[
                  "API access for custom integrations",
                  "SDK for mobile coaching apps",
                  "Webhook alerts to existing systems",
                  "Historical data export for analysis",
                  "Context layer API for game-state overrides",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-neutral-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-700">
              <div className="text-sm text-neutral-500 mb-4">Supported Sports</div>
              <div className="flex flex-wrap gap-2">
                {sports.map((sport, i) => (
                  <span key={i} className="px-4 py-2 bg-neutral-700 rounded-full text-sm">
                    {sport}
                  </span>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-neutral-700">
                <div className="text-sm text-neutral-500 mb-4">Data Sources</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {dataSources.slice(0, 6).map((source, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${source.status === 'live' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                      <span>{source.name.replace(' API', '').replace(' Network', '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-3xl p-12 border border-emerald-500/30">
            <h2 className="text-4xl font-light mb-4">
              Gain the Edge This Season
            </h2>
            <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
              Teams using AI Coordinator with Situational Context Layer report &lt;2% false variance 
              and 15-25% strategic advantages in weather-impacted games.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-black px-8 py-6 text-lg">
                Schedule Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Link to="/strata">
                <Button variant="outline" className="border-neutral-600 text-white hover:bg-neutral-800 px-8 py-6 text-lg">
                  Back to STRATA
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StrataCoordinator;
