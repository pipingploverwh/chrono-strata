import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, Loader2, ChevronRight, Mail, ArrowRight, Anchor, Wind, Waves } from "lucide-react";
import { Input } from "@/components/ui/input";
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

const LandingPage = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"initial" | "shows" | "permission" | "email" | "launching">("initial");
  const [email, setEmail] = useState("");
  const [locationGranted, setLocationGranted] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [overlayProgress, setOverlayProgress] = useState(0);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [marineForecast, setMarineForecast] = useState<MarineForecast | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPhase("shows"), 600);
    return () => clearTimeout(timer);
  }, []);

  // Fetch NOAA marine forecast
  useEffect(() => {
    const fetchMarine = async () => {
      setLoadingForecast(true);
      try {
        const { data, error } = await supabase.functions.invoke('noaa-marine', {
          body: { zone: 'anz233' }
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
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationGranted(true);
          setPhase("email");
        },
        () => {
          setLocationGranted(true);
          setPhase("email");
        }
      );
    } else {
      setLocationGranted(true);
      setPhase("email");
    }
  };

  const handleEmailSubmit = () => {
    if (!email || !email.includes("@")) return;
    
    const subject = encodeURIComponent("LAVANDAR STRATA Access Request");
    const body = encodeURIComponent(
      `New access request from STRATA landing page:\n\n` +
      `Email: ${email}\n` +
      `Location: ${userLocation ? `${userLocation.lat.toFixed(4)}°N, ${userLocation.lon.toFixed(4)}°W` : "Not provided"}\n` +
      `Timestamp: ${new Date().toISOString()}\n\n` +
      `---\n` +
      `Built in Woods Hole by Piping Plover`
    );
    
    window.open(`mailto:brubin@lavandar.ai?subject=${subject}&body=${body}`, "_blank");
    setEmailSubmitted(true);
    
    setTimeout(() => {
      setPhase("launching");
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        setOverlayProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          navigate("/strata");
        }
      }, 30);
    }, 1000);
  };

  const goToPermission = () => setPhase("permission");

  return (
    <div className="min-h-screen bg-[#f5f0eb] relative overflow-hidden">
      {/* Launch overlay */}
      <div 
        className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-300 ${
          phase === "launching" ? "opacity-100" : "opacity-0"
        }`}
      >
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <filter id="liquid" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" seed="1">
                <animate attributeName="baseFrequency" values="0.015;0.025;0.015" dur="4s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <circle cx="50%" cy="50%" r={overlayProgress * 2 + "%"} fill="#1a1a1a" filter="url(#liquid)" />
          <circle cx="50%" cy="50%" r={Math.max(0, overlayProgress - 10) * 2 + "%"} fill="#0a0a0a" filter="url(#liquid)" />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${overlayProgress > 30 ? "opacity-100" : "opacity-0"}`}>
          <div className="text-center">
            <span className="font-light text-3xl text-white tracking-[0.5em] uppercase">Initializing</span>
          </div>
        </div>
      </div>

      {/* Main content - Arielle inspired minimal editorial */}
      <div className={`relative z-10 min-h-screen transition-all duration-1000 ${phase === "initial" ? "opacity-0" : "opacity-100"}`}>
        
        {/* Header - ultra minimal */}
        <header className="fixed top-0 left-0 right-0 z-40 px-8 py-6 flex items-center justify-between">
          <div className="font-light text-[11px] tracking-[0.4em] uppercase text-neutral-500">
            Lavandar
          </div>
          <nav className="hidden md:flex items-center gap-12">
            <a href="#shows" className="text-[11px] tracking-[0.2em] uppercase text-neutral-600 hover:text-red-600 transition-colors">Shows</a>
            <a href="#marine" className="text-[11px] tracking-[0.2em] uppercase text-neutral-600 hover:text-red-600 transition-colors">Marine</a>
            <button 
              onClick={goToPermission}
              className="text-[11px] tracking-[0.2em] uppercase text-red-600 hover:text-red-700 transition-colors"
            >
              Enter
            </button>
          </nav>
        </header>

        {/* SHOWS Section - Hero */}
        {phase === "shows" && (
          <section id="shows" className="min-h-screen flex flex-col">
            {/* Hero area */}
            <div className="flex-1 flex items-center px-8 md:px-16 lg:px-24 pt-24">
              <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
                {/* Left: Typography */}
                <div className="space-y-8">
                  <div className="overflow-hidden">
                    <h1 className="text-[clamp(3rem,12vw,10rem)] font-extralight leading-[0.85] tracking-[-0.03em] text-neutral-900">
                      SHOWS
                    </h1>
                  </div>
                  
                  <div className="w-24 h-[1px] bg-red-600" />
                  
                  <p className="text-lg font-light text-neutral-500 leading-relaxed max-w-md">
                    Precision atmospheric intelligence. 
                    <span className="text-red-600"> Real-time marine forecasts</span> for 
                    the discerning mariner.
                  </p>
                  
                  <button 
                    onClick={goToPermission}
                    className="group inline-flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase text-neutral-900 hover:text-red-600 transition-colors"
                  >
                    <span>Access Platform</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>

                {/* Right: Marine Data Card */}
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-red-50 to-transparent rounded-3xl" />
                  <div className="relative bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-2xl p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Anchor className="w-5 h-5 text-red-600" />
                        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500">Live Marine</span>
                      </div>
                      {marineForecast?.warnings.length ? (
                        <span className="px-3 py-1 bg-red-600 text-white text-[9px] tracking-[0.2em] uppercase rounded-full animate-pulse">
                          {marineForecast.warnings[0]}
                        </span>
                      ) : null}
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-light text-neutral-900">{marineForecast?.location || 'Vineyard Sound'}</h3>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mt-1">Zone {marineForecast?.zone || 'ANZ233'}</p>
                    </div>

                    {loadingForecast ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
                      </div>
                    ) : marineForecast?.periods.slice(0, 3).map((period, i) => (
                      <div key={i} className="border-t border-neutral-100 pt-4 space-y-2">
                        <div className="text-[10px] tracking-[0.3em] uppercase text-red-600 font-medium">{period.name}</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-start gap-2">
                            <Wind className="w-4 h-4 text-neutral-400 mt-0.5" />
                            <span className="text-sm text-neutral-600">{period.wind || 'Variable'}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Waves className="w-4 h-4 text-neutral-400 mt-0.5" />
                            <span className="text-sm text-neutral-600">{period.seas || 'Light'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-neutral-100">
                      <p className="text-[9px] text-neutral-400 tracking-wide">
                        Source: NOAA National Weather Service • Updated: {marineForecast?.issuedAt || 'Loading...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA strip */}
            <div className="bg-neutral-900 px-8 md:px-16 lg:px-24 py-6">
              <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-500">
                  Built in Woods Hole by Piping Plover
                </p>
                <button 
                  onClick={goToPermission}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-[11px] tracking-[0.3em] uppercase transition-colors rounded"
                >
                  <span>Launch STRATA</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Permission Phase */}
        {phase === "permission" && (
          <section className="min-h-screen flex items-center justify-center px-8">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full border-2 border-red-600 flex items-center justify-center">
                  <Navigation className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-3xl font-light text-neutral-900">Location Required</h2>
                <p className="text-neutral-500 font-light">
                  STRATA requires your location to provide precision atmospheric data.
                </p>
              </div>
              
              <Button
                onClick={requestLocation}
                className="w-full py-6 bg-red-600 hover:bg-red-700 text-white text-[11px] tracking-[0.3em] uppercase"
              >
                <MapPin className="w-4 h-4 mr-3" />
                Allow Location Access
              </Button>
              
              <p className="text-[10px] text-neutral-400 text-center leading-relaxed">
                Your location data is encrypted end-to-end and never stored on external servers.
              </p>
            </div>
          </section>
        )}

        {/* Email Phase */}
        {phase === "email" && !emailSubmitted && (
          <section className="min-h-screen flex items-center justify-center px-8">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-green-600">
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                  Location Authorized
                </div>
                <h2 className="text-3xl font-light text-neutral-900">Enter Your Email</h2>
                <p className="text-neutral-500 font-light">
                  Your email will be sent securely to LAVANDAR AI for access.
                </p>
              </div>
              
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-6 px-4 bg-white border-neutral-200 text-neutral-900 text-center text-lg font-light"
                />
                
                <Button
                  onClick={handleEmailSubmit}
                  disabled={!email || !email.includes("@")}
                  className="w-full py-6 bg-red-600 hover:bg-red-700 text-white text-[11px] tracking-[0.3em] uppercase disabled:opacity-50"
                >
                  <Mail className="w-4 h-4 mr-3" />
                  Send Access Request
                  <ChevronRight className="w-4 h-4 ml-3" />
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Email Submitted */}
        {emailSubmitted && phase !== "launching" && (
          <section className="min-h-screen flex items-center justify-center px-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse" />
              </div>
              <h2 className="text-3xl font-light text-neutral-900">Access Request Sent</h2>
              <p className="text-neutral-500 font-light">Initializing STRATA instrument...</p>
              <Loader2 className="w-6 h-6 text-red-600 mx-auto animate-spin" />
            </div>
          </section>
        )}

        {/* Red accent line */}
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-red-600 z-30" />
      </div>
    </div>
  );
};

export default LandingPage;
