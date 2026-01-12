import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronRight, ArrowRight, Anchor, Wind, Waves, 
  Shield, Zap, Globe, BarChart3, Cloud, Ship,
  Building2, Plane, CalendarDays, Check, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface MarineForecast {
  zone: string;
  location: string;
  issuedAt: string;
  warnings: string[];
  periods: {
    name: string;
    wind: string;
    seas: string;
    conditions: string;
  }[];
}

interface MarineZone {
  id: string;
  name: string;
  description: string;
}

const MARINE_ZONES: MarineZone[] = [
  { id: 'anz233', name: 'Vineyard Sound', description: 'Including Woods Hole and Martha\'s Vineyard' },
  { id: 'anz230', name: 'Cape Cod Bay', description: 'Plymouth to Provincetown' },
  { id: 'anz232', name: 'Nantucket Sound', description: 'South of Cape Cod to Nantucket' },
  { id: 'anz231', name: 'Buzzards Bay', description: 'New Bedford to the Elizabeth Islands' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [marineForecast, setMarineForecast] = useState<MarineForecast | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string>('anz233');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch NOAA marine forecast
  useEffect(() => {
    const fetchMarine = async () => {
      setLoadingForecast(true);
      try {
        const { data, error } = await supabase.functions.invoke('noaa-marine', {
          body: { zone: selectedZone }
        });
        if (data?.success) {
          setMarineForecast(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch marine forecast:', err);
      } finally {
        setLoadingForecast(false);
      }
    };
    fetchMarine();
  }, [selectedZone]);

  const features = [
    { icon: Shield, title: "Enterprise Security", desc: "SOC 2 compliant infrastructure with end-to-end encryption" },
    { icon: Zap, title: "Real-Time Data", desc: "Sub-second atmospheric updates from 50,000+ sources" },
    { icon: Globe, title: "Global Coverage", desc: "Precision forecasting for every coordinate on Earth" },
    { icon: BarChart3, title: "Predictive Analytics", desc: "ML-powered forecasts with 98.7% accuracy" },
  ];

  const industries = [
    { icon: Ship, title: "Maritime", desc: "Marine forecasting for commercial and recreational vessels", href: "/strata-marine" },
    { icon: Plane, title: "Aviation", desc: "Flight-critical weather intelligence for safe operations", href: "/strata-aviation" },
    { icon: Building2, title: "Construction", desc: "Site-specific forecasting for project planning", href: "/strata-construction" },
    { icon: CalendarDays, title: "Events", desc: "Weather risk management for outdoor venues", href: "/strata-events" },
  ];

  const stats = [
    { value: "50K+", label: "Data Sources" },
    { value: "98.7%", label: "Accuracy Rate" },
    { value: "<100ms", label: "Update Latency" },
    { value: "24/7", label: "Global Coverage" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f1] text-neutral-900 overflow-x-hidden">
      {/* Fixed Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50 ? 'bg-[#f8f5f1]/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="font-light text-xs tracking-[0.5em] uppercase text-neutral-600">
            Lavandar
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-xs tracking-[0.2em] uppercase text-neutral-500 hover:text-red-600 transition-colors">Features</a>
            <a href="#industries" className="text-xs tracking-[0.2em] uppercase text-neutral-500 hover:text-red-600 transition-colors">Industries</a>
            <a href="#marine" className="text-xs tracking-[0.2em] uppercase text-neutral-500 hover:text-red-600 transition-colors">Live Data</a>
            <Button 
              onClick={() => navigate("/strata")}
              className="bg-red-600 hover:bg-red-700 text-white text-xs tracking-[0.2em] uppercase px-6 py-2 rounded-none"
            >
              Launch Platform
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-br from-red-100/40 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-neutral-200/30 to-transparent rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-xs tracking-[0.15em] uppercase text-red-700">Enterprise Weather Intelligence</span>
            </div>
            
            <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-extralight leading-[0.95] tracking-[-0.02em]">
              Weather Data
              <br />
              <span className="text-red-600">Reimagined</span>
            </h1>
            
            <p className="text-lg md:text-xl font-light text-neutral-500 leading-relaxed max-w-lg">
              STRATA delivers precision atmospheric intelligence for enterprises 
              that demand accuracy. Real-time data. Predictive analytics. 
              <span className="text-neutral-900"> Zero compromises.</span>
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigate("/strata")}
                className="bg-red-600 hover:bg-red-700 text-white text-xs tracking-[0.2em] uppercase px-8 py-6 rounded-none group"
              >
                Access Platform
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs tracking-[0.2em] uppercase px-8 py-6 rounded-none"
              >
                Learn More
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 pt-8 border-t border-neutral-200">
              {stats.slice(0, 3).map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-light text-red-600">{stat.value}</div>
                  <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-8 bg-gradient-to-br from-red-50 to-neutral-50 rounded-3xl" />
            <div className="relative bg-white border border-neutral-200 rounded-2xl p-8 shadow-2xl shadow-neutral-200/50">
              <div className="flex items-center gap-3 mb-6">
                <Cloud className="w-6 h-6 text-red-600" />
                <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Live Atmospheric Feed</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="text-3xl font-light text-neutral-900">72°F</div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mt-1">Temperature</div>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="text-3xl font-light text-neutral-900">12kt</div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mt-1">Wind Speed</div>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="text-3xl font-light text-neutral-900">98%</div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mt-1">Confidence</div>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="text-3xl font-light text-red-600">Clear</div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mt-1">Conditions</div>
                </div>
              </div>
              
              <div className="h-24 bg-gradient-to-r from-red-50 via-red-100 to-red-50 rounded-lg flex items-center justify-center">
                <span className="text-xs tracking-[0.2em] uppercase text-red-600">72-Hour Forecast Visualization</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-neutral-900 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-extralight text-white">{stat.value}</div>
                <div className="text-xs tracking-[0.2em] uppercase text-neutral-500 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-20">
            <div className="text-xs tracking-[0.3em] uppercase text-red-600 mb-4">Platform Features</div>
            <h2 className="text-4xl md:text-5xl font-extralight leading-tight mb-6">
              Built for enterprises that
              <br />
              <span className="text-red-600">demand precision</span>
            </h2>
            <p className="text-lg text-neutral-500 font-light">
              STRATA combines real-time data ingestion, machine learning, and 
              intuitive visualization to deliver weather intelligence at scale.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group p-8 bg-neutral-50 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-300"
              >
                <feature.icon className="w-10 h-10 text-red-600 mb-6" />
                <h3 className="text-xl font-light mb-3">{feature.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-32 bg-[#f8f5f1]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="text-xs tracking-[0.3em] uppercase text-red-600 mb-4">Industry Solutions</div>
            <h2 className="text-4xl md:text-5xl font-extralight leading-tight mb-6">
              Tailored for your
              <span className="text-red-600"> industry</span>
            </h2>
            <p className="text-lg text-neutral-500 font-light">
              Purpose-built dashboards with industry-specific metrics and integrations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {industries.map((industry, i) => (
              <button
                key={i}
                onClick={() => navigate(industry.href)}
                className="group text-left p-10 bg-white hover:bg-neutral-900 border border-neutral-200 hover:border-neutral-900 transition-all duration-500"
              >
                <div className="flex items-start justify-between mb-8">
                  <industry.icon className="w-12 h-12 text-red-600" />
                  <ArrowRight className="w-6 h-6 text-neutral-300 group-hover:text-red-600 group-hover:translate-x-2 transition-all" />
                </div>
                <h3 className="text-2xl font-light mb-3 group-hover:text-white transition-colors">{industry.title}</h3>
                <p className="text-neutral-500 group-hover:text-neutral-400 transition-colors">{industry.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Live Marine Data Section */}
      <section id="marine" className="py-32 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div className="text-xs tracking-[0.3em] uppercase text-red-500 mb-4">Live NOAA Data</div>
              <h2 className="text-4xl md:text-5xl font-extralight leading-tight text-white">
                Real-time marine
                <br />
                <span className="text-red-500">forecasts</span>
              </h2>
              <p className="text-lg text-neutral-400 font-light max-w-md">
                Direct integration with NOAA's marine forecast network. 
                Select your zone for live wind, sea, and weather conditions.
              </p>
              
              {/* Zone Selector */}
              <div className="space-y-3">
                <div className="text-xs tracking-[0.2em] uppercase text-neutral-500">Select Zone</div>
                <div className="grid grid-cols-2 gap-2">
                  {MARINE_ZONES.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedZone(zone.id)}
                      className={`text-left p-4 border transition-all ${
                        selectedZone === zone.id 
                          ? 'bg-red-600 border-red-600 text-white' 
                          : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-red-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {selectedZone === zone.id && <Check className="w-4 h-4" />}
                        <span className="text-sm font-medium">{zone.name}</span>
                      </div>
                      <span className="text-xs text-neutral-400">{zone.id.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Forecast Card */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Anchor className="w-5 h-5 text-red-500" />
                  <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Marine Forecast</span>
                </div>
                {loadingForecast && <Loader2 className="w-4 h-4 text-red-500 animate-spin" />}
              </div>
              
              <div className="mb-6">
                <h3 className="text-2xl font-light text-white">
                  {marineForecast?.location || MARINE_ZONES.find(z => z.id === selectedZone)?.name}
                </h3>
                <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mt-1">
                  Zone {marineForecast?.zone || selectedZone.toUpperCase()}
                </p>
              </div>

              {marineForecast?.warnings.length ? (
                <div className="mb-6 p-3 bg-red-900/30 border border-red-800 rounded">
                  <span className="text-xs tracking-[0.2em] uppercase text-red-400">
                    ⚠️ {marineForecast.warnings.join(' • ')}
                  </span>
                </div>
              ) : null}

              <div className="space-y-4">
                {loadingForecast ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                  </div>
                ) : marineForecast?.periods.slice(0, 4).map((period, i) => (
                  <div key={i} className="border-t border-neutral-700 pt-4">
                    <div className="text-xs tracking-[0.2em] uppercase text-red-500 mb-3">{period.name}</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <Wind className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-neutral-300">{period.wind || 'Variable'}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Waves className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-neutral-300">{period.seas || 'Light'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-neutral-700">
                <p className="text-[10px] text-neutral-500">
                  Source: NOAA NWS • Updated: {marineForecast?.issuedAt || 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-red-600">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-extralight text-white leading-tight mb-6">
            Ready to transform your
            <br />
            weather intelligence?
          </h2>
          <p className="text-lg text-red-100 font-light mb-10 max-w-xl mx-auto">
            Join enterprises worldwide who rely on STRATA for mission-critical 
            atmospheric intelligence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => navigate("/strata")}
              className="bg-white hover:bg-neutral-100 text-red-600 text-xs tracking-[0.2em] uppercase px-10 py-6 rounded-none group"
            >
              Launch Platform
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open('mailto:brubin@lavandar.ai', '_blank')}
              className="border-white/30 text-white hover:bg-white/10 text-xs tracking-[0.2em] uppercase px-10 py-6 rounded-none"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div>
              <div className="font-light text-xs tracking-[0.5em] uppercase text-neutral-500 mb-2">Lavandar</div>
              <p className="text-sm text-neutral-600">Built in Woods Hole by Piping Plover</p>
            </div>
            <div className="flex items-center gap-8">
              <a href="/strata" className="text-xs tracking-[0.2em] uppercase text-neutral-500 hover:text-red-500 transition-colors">Platform</a>
              <a href="/portfolio" className="text-xs tracking-[0.2em] uppercase text-neutral-500 hover:text-red-500 transition-colors">Portfolio</a>
              <a href="/validation-report" className="text-xs tracking-[0.2em] uppercase text-neutral-500 hover:text-red-500 transition-colors">Validation</a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-wrap justify-between gap-4">
            <p className="text-xs text-neutral-600">© 2025 Lavandar AI. All rights reserved.</p>
            <p className="text-xs text-neutral-600">Enterprise Weather Intelligence</p>
          </div>
        </div>
      </footer>

      {/* Fixed bottom accent */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-red-600 z-40" />
    </div>
  );
};

export default LandingPage;
