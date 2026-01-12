import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  CloudSun, 
  Building2, 
  Plane, 
  Ship, 
  Calendar,
  ArrowRight,
  Zap,
  Globe,
  Shield,
  Users,
  BarChart3,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import lavandarLogo from "@/assets/lavandar-logo.png";
import WeatherGate from "@/components/WeatherGate";

const LavandarHome = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherGranted, setWeatherGranted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check session on mount
  useEffect(() => {
    const granted = sessionStorage.getItem("weather_access_granted");
    if (granted === "true") {
      setWeatherGranted(true);
    }
  }, []);

  const handleWeatherGranted = useCallback(() => {
    setWeatherGranted(true);
  }, []);

  const industries = [
    { 
      icon: Building2, 
      title: "Construction", 
      desc: "Weather-responsive project management",
      path: "/construction",
      color: "from-amber-500/20 to-amber-600/5 border-amber-500/30 hover:border-amber-400"
    },
    { 
      icon: Plane, 
      title: "Aviation", 
      desc: "Flight operations & safety intelligence",
      path: "/aviation",
      color: "from-sky-500/20 to-sky-600/5 border-sky-500/30 hover:border-sky-400"
    },
    { 
      icon: Ship, 
      title: "Marine", 
      desc: "Maritime conditions & routing",
      path: "/marine",
      color: "from-blue-500/20 to-blue-600/5 border-blue-500/30 hover:border-blue-400"
    },
    { 
      icon: Calendar, 
      title: "Events", 
      desc: "Venue & crowd safety optimization",
      path: "/events",
      color: "from-purple-500/20 to-purple-600/5 border-purple-500/30 hover:border-purple-400"
    },
  ];

  const capabilities = [
    { icon: Zap, title: "Real-Time Intelligence", desc: "Sub-second data processing for critical decisions" },
    { icon: Globe, title: "Global Coverage", desc: "Worldwide weather data from trusted sources" },
    { icon: Shield, title: "Enterprise Security", desc: "SOC 2 compliant infrastructure" },
    { icon: Users, title: "Multi-Property", desc: "Unified analytics across portfolios" },
  ];

  const content = (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-[#0a0a0a] to-[#0a0a0a]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-purple-600/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-violet-600/5 via-transparent to-transparent blur-3xl" />
        
        {/* Navigation */}
        <nav className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={lavandarLogo} alt="Lavandar" className="w-10 h-10 rounded-lg" />
              <div>
                <span className="font-instrument text-xl text-white tracking-wide">LAVANDAR</span>
                <span className="block text-[9px] font-mono uppercase tracking-[0.2em] text-purple-400/60">Technology</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/strata" className="text-sm text-neutral-400 hover:text-white transition-colors">STRATA</Link>
              <Link to="/alpha-os" className="text-sm text-neutral-400 hover:text-white transition-colors">Operations</Link>
              <Button 
                onClick={() => navigate("/recruiter-outreach")}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs tracking-wider uppercase px-6"
              >
                Get Started
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-mono text-purple-300">Live Systems Active</span>
              </div>
              <span className="text-xs font-mono text-neutral-500">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-light text-white leading-tight mb-6">
              Weather Intelligence
              <span className="block text-purple-400">for Enterprise</span>
            </h1>
            
            <p className="text-lg text-neutral-400 max-w-xl mb-10 leading-relaxed">
              AI-powered weather intelligence platform transforming how industries 
              make critical decisions. Real-time data, predictive analytics, 
              and operational automation.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigate("/strata")}
                size="lg"
                className="bg-white hover:bg-neutral-100 text-black text-sm tracking-wider uppercase px-8 py-6 rounded-none group"
              >
                <CloudSun className="w-5 h-5 mr-3" />
                Launch STRATA
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={() => navigate("/case-study/kraft")}
                size="lg"
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 text-sm tracking-wider uppercase px-8 py-6 rounded-none group"
              >
                <Building2 className="w-5 h-5 mr-3" />
                Case Study
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Industries Section */}
      <section className="py-24 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-purple-400 mb-4 block">Industries</span>
            <h2 className="text-3xl md:text-4xl font-light text-white">
              Purpose-Built Solutions
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, i) => (
              <button
                key={i}
                onClick={() => navigate(industry.path)}
                className={`group p-8 rounded-xl bg-gradient-to-br ${industry.color} border transition-all duration-300 text-left`}
              >
                <industry.icon className="w-10 h-10 text-white/80 mb-6" />
                <h3 className="text-xl font-medium text-white mb-2">{industry.title}</h3>
                <p className="text-sm text-neutral-400 mb-4">{industry.desc}</p>
                <div className="flex items-center gap-2 text-sm font-mono text-purple-400 group-hover:translate-x-1 transition-transform">
                  Explore <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-24 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-purple-400 mb-4 block">Platform</span>
              <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
                Enterprise-Grade Intelligence
              </h2>
              <p className="text-neutral-400 mb-8 leading-relaxed">
                Lavandar combines real-time weather data with AI-powered analytics 
                to deliver actionable insights for mission-critical operations. 
                From construction sites to maritime routes, we power the decisions 
                that matter.
              </p>
              <Button 
                onClick={() => navigate("/alpha-os")}
                variant="outline"
                className="border-neutral-600 text-white hover:bg-neutral-800 text-sm tracking-wider uppercase px-6 rounded-none group"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Operations Console
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {capabilities.map((cap, i) => (
                <div 
                  key={i}
                  className="p-6 rounded-xl bg-neutral-800/50 border border-neutral-700/50"
                >
                  <cap.icon className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-white font-medium mb-2">{cap.title}</h3>
                  <p className="text-sm text-neutral-500">{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="max-w-2xl mx-auto">
            <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-neutral-400 mb-8">
              Join industry leaders using Lavandar to make smarter, faster decisions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => navigate("/recruiter-outreach")}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm tracking-wider uppercase px-10 py-6 rounded-none"
              >
                Contact Us
              </Button>
              <Button 
                onClick={() => navigate("/strata")}
                size="lg"
                variant="outline"
                className="border-neutral-600 text-white hover:bg-neutral-800 text-sm tracking-wider uppercase px-10 py-6 rounded-none"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  // If already granted, show content directly
  if (weatherGranted) {
    return content;
  }

  // Otherwise wrap in weather gate
  return (
    <WeatherGate onGranted={handleWeatherGranted}>
      {content}
    </WeatherGate>
  );
};

export default LavandarHome;
