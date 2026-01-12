import { Trophy, Users, Cloud, TrendingUp, Shield, Zap, Target, BarChart3, Clock, CheckCircle2, ArrowRight, Building2, Thermometer, Wind, Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
const KraftCaseStudy = () => {
  const metrics = [{
    label: "Fan Satisfaction",
    value: "94%",
    change: "+12%",
    icon: Users
  }, {
    label: "Weather Accuracy",
    value: "99.2%",
    change: "+8%",
    icon: Cloud
  }, {
    label: "Response Time",
    value: "<2s",
    change: "-67%",
    icon: Zap
  }, {
    label: "Revenue Impact",
    value: "$4.2M",
    change: "+23%",
    icon: TrendingUp
  }];
  const capabilities = [{
    title: "Real-Time Weather Intelligence",
    description: "Hyperlocal forecasting for Gillette Stadium with 15-minute precision windows, enabling proactive fan experience management.",
    icon: Thermometer
  }, {
    title: "Predictive Crowd Analytics",
    description: "ML-driven models correlating weather patterns with fan behavior, concession sales, and parking dynamics.",
    icon: BarChart3
  }, {
    title: "Operational Decision Support",
    description: "Automated alerts for roof operations, field conditions, and safety protocols based on atmospheric conditions.",
    icon: Shield
  }, {
    title: "Fan Experience Optimization",
    description: "Weather-aware mobile notifications, personalized recommendations, and comfort-driven amenity adjustments.",
    icon: Target
  }];
  const timeline = [{
    phase: "Discovery",
    duration: "2 weeks",
    status: "complete"
  }, {
    phase: "Integration",
    duration: "4 weeks",
    status: "complete"
  }, {
    phase: "Pilot Season",
    duration: "8 games",
    status: "complete"
  }, {
    phase: "Full Deployment",
    duration: "Ongoing",
    status: "active"
  }];
  return <div className="min-h-screen bg-[#f8f5f1]">
      {/* Hero */}
      <section className="relative bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-blue-900/10" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-red-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-400 uppercase tracking-wider">
              Case Study
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
            LAVANDAR TECH<br />
            <span className="text-red-500">NFL Stadium Deployment</span>
          </h1>
          
          <p className="text-xl text-neutral-400 max-w-2xl mb-12">
            How STRATA Weather Intelligence revolutionized game day operations, 
            fan experience, and operational efficiency at a premier NFL venue.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <Icon className="w-5 h-5 text-neutral-500 mb-3" />
                  <div className="text-3xl font-light text-white mb-1">{metric.value}</div>
                  <div className="text-sm text-neutral-500">{metric.label}</div>
                  <div className="text-xs text-green-400 mt-2">{metric.change}</div>
                </div>;
          })}
          </div>
        </div>
      </section>

      {/* Challenge */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-medium text-red-600 uppercase tracking-wider">
              The Challenge
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 mt-4 mb-6">
              Weather as a Competitive Edge
            </h2>
            <div className="space-y-4 text-neutral-600">
              <p>
                This premier NFL stadium hosts over 1 million visitors annually. 
                The region's notoriously unpredictable weather presents unique operational challenges—from 
                sudden temperature drops to lake-effect precipitation.
              </p>
              <p>
                Traditional weather services provided regional forecasts with 3-6 hour windows, 
                insufficient for the precision required in professional sports operations where 
                decisions must be made in real-time.
              </p>
              <p>
                LAVANDAR TECH built a solution that could transform weather from a liability 
                into a strategic advantage for fan experience and operational efficiency.
              </p>
            </div>
          </div>
          
          <div className="bg-neutral-900 rounded-2xl p-8 space-y-6">
            <h3 className="text-lg font-medium text-white">Key Challenges</h3>
            <div className="space-y-4">
              {["Unpredictable regional weather patterns", "68,000+ seat capacity requiring proactive management", "Real-time decision-making for roof and field operations", "Fan comfort and safety during extreme conditions", "Inventory and staffing optimization based on conditions"].map((challenge, i) => <div key={i} className="flex items-start gap-3 text-neutral-400">
                  <Wind className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">{challenge}</span>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="bg-neutral-100 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-xs font-medium text-red-600 uppercase tracking-wider">
              The Solution
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 mt-4 mb-6">
              STRATA Weather Intelligence Platform
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              A comprehensive weather intelligence system designed specifically for 
              large-scale venue operations and fan experience optimization.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return <div key={i} className="bg-white rounded-xl p-8 shadow-sm">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-medium text-neutral-900 mb-3">{cap.title}</h3>
                  <p className="text-neutral-600">{cap.description}</p>
                </div>;
          })}
          </div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-red-600 uppercase tracking-wider">
            Implementation
          </span>
          <h2 className="text-3xl md:text-4xl font-light text-neutral-900 mt-4">
            Deployment Timeline
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {timeline.map((phase, i) => <div key={i} className="flex items-center gap-4">
              <div className={`flex-1 md:w-48 p-6 rounded-xl border ${phase.status === 'active' ? 'bg-red-50 border-red-200' : 'bg-white border-neutral-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {phase.status === 'complete' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  {phase.status === 'active' && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                  <span className="text-xs text-neutral-500 uppercase">{phase.duration}</span>
                </div>
                <h4 className="font-medium text-neutral-900">{phase.phase}</h4>
              </div>
              {i < timeline.length - 1 && <ArrowRight className="w-5 h-5 text-neutral-300 hidden md:block" />}
            </div>)}
        </div>
      </section>

      {/* Results */}
      <section className="bg-neutral-900 py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-xs font-medium text-red-400 uppercase tracking-wider">
              Results
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-white mt-4 mb-6">
              Measurable Impact
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8">
              <div className="text-5xl font-light text-red-500 mb-2">34%</div>
              <div className="text-neutral-400">Reduction in weather-related inventory waste</div>
            </div>
            <div className="text-center p-8">
              <div className="text-5xl font-light text-red-500 mb-2">89%</div>
              <div className="text-neutral-400">Faster operational decision-making</div>
            </div>
            <div className="text-center p-8">
              <div className="text-5xl font-light text-red-500 mb-2">12pt</div>
              <div className="text-neutral-400">Increase in fan satisfaction scores</div>
            </div>
          </div>
          
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-light text-neutral-900 mb-6">
          Ready to Transform Your Operations?
        </h2>
        <p className="text-neutral-600 max-w-xl mx-auto mb-8">
          Discover how STRATA Weather Intelligence can deliver similar results 
          for your venue, event, or enterprise operation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/strata">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6">
              Explore STRATA Platform
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="px-8 py-6 border-neutral-300">
              Back to Home
            </Button>
          </Link>
        </div>
      </section>
    </div>;
};
export default KraftCaseStudy;