import { 
  Brain, Wind, Thermometer, Droplets, Target, Shield, 
  TrendingUp, Clock, Zap, Users, BarChart3, ArrowRight,
  CheckCircle2, Activity, Eye, Radio
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const StrataCoordinator = () => {
  const [activeScenario, setActiveScenario] = useState(0);

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

  const capabilities = [
    {
      icon: Brain,
      title: "Predictive Play Calling",
      description: "AI analyzes atmospheric conditions to recommend optimal plays 15 minutes before conditions change.",
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
    { value: "94%", label: "Forecast accuracy at venue" },
    { value: "23%", label: "Avg. strategic advantage gained" },
    { value: "<500ms", label: "Real-time update latency" },
  ];

  const sports = [
    "NFL", "MLB", "MLS", "NCAA Football", "Golf Tours", "Rugby", "Cricket", "Tennis"
  ];

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
            The AI Coordinator transforms atmospheric data into actionable game strategy. 
            Your opponents react to weather. You anticipate it.
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
              <div key={i} className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-3xl font-light text-emerald-400">{m.value}</div>
                <div className="text-sm text-neutral-500 mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Scenario Demo */}
      <section className="bg-neutral-900 py-24">
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
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-24">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div key={i} className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 hover:border-emerald-500/30 transition-colors">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{cap.title}</h3>
                  <p className="text-sm text-neutral-400">{cap.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integration */}
      <section className="bg-neutral-900 py-24">
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
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span>NOAA Weather</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span>Stadium Sensors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span>Radar Networks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span>Satellite Imagery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-3xl p-12 border border-emerald-500/30">
            <h2 className="text-4xl font-light mb-4">
              Gain the Edge This Season
            </h2>
            <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
              Teams using AI Coordinator report average strategic advantages of 15-25% 
              in weather-impacted games. Schedule a demo with your coaching staff.
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
