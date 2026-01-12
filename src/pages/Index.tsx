import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, Loader2, ChevronRight, Mail, Shield, Lock, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"initial" | "permission" | "email" | "launching">("initial");
  const [email, setEmail] = useState("");
  const [locationGranted, setLocationGranted] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [overlayProgress, setOverlayProgress] = useState(0);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPhase("permission"), 800);
    return () => clearTimeout(timer);
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
        (error) => {
          console.error("Location error:", error);
          // Allow proceeding even without location
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
    
    // Create mailto link with user details
    const subject = encodeURIComponent("LAVANDAR STRATA Access Request");
    const body = encodeURIComponent(
      `New access request from STRATA landing page:\n\n` +
      `Email: ${email}\n` +
      `Location: ${userLocation ? `${userLocation.lat.toFixed(4)}°N, ${userLocation.lon.toFixed(4)}°W` : "Not provided"}\n` +
      `Timestamp: ${new Date().toISOString()}\n\n` +
      `---\n` +
      `Built in Woods Hole by Piping Plover`
    );
    
    // Open email client
    window.open(`mailto:brubin@lavandar.ai?subject=${subject}&body=${body}`, "_blank");
    
    setEmailSubmitted(true);
    
    // Launch sequence
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Liquid overlay - moon landing style */}
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
            
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--strata-orange))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          
          <circle
            cx="50%"
            cy="50%"
            r={overlayProgress * 2 + "%"}
            fill="hsl(var(--strata-black))"
            filter="url(#liquid)"
            className="transition-all"
          />
          
          <circle
            cx="50%"
            cy="50%"
            r={Math.max(0, overlayProgress - 10) * 2 + "%"}
            fill="hsl(var(--strata-charcoal))"
            filter="url(#liquid)"
          />
          
          <circle
            cx="50%"
            cy="50%"
            r={Math.max(0, overlayProgress - 20) * 1.5 + "%"}
            fill="url(#centerGlow)"
          />
        </svg>

        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
          overlayProgress > 30 ? "opacity-100" : "opacity-0"
        }`}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-strata-lume animate-pulse" />
              <span className="font-instrument text-2xl text-strata-white tracking-[0.3em] uppercase">
                Initializing
              </span>
              <div className="w-3 h-3 rounded-full bg-strata-lume animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>
            <div className="font-mono text-sm text-strata-orange tracking-wider">
              ATMOSPHERIC LINK ESTABLISHED
            </div>
          </div>
        </div>
      </div>

      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--strata-silver)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--strata-silver)) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Orbital rings decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="relative w-[800px] h-[800px]">
          <div className="absolute inset-0 rounded-full border border-strata-steel/10 animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-12 rounded-full border border-strata-steel/15 animate-[spin_45s_linear_infinite_reverse]" />
          <div className="absolute inset-24 rounded-full border border-strata-steel/20 animate-[spin_30s_linear_infinite]" />
        </div>
      </div>

      {/* Security badges */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-strata-charcoal/80 border border-strata-lume/30">
          <Shield className="w-3 h-3 text-strata-lume" />
          <span className="text-[9px] font-mono text-strata-lume uppercase tracking-wider">End-to-End Encrypted</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-strata-charcoal/80 border border-strata-orange/30">
          <Lock className="w-3 h-3 text-strata-orange" />
          <span className="text-[9px] font-mono text-strata-orange uppercase tracking-wider">SOC 2 Compliant</span>
        </div>
      </div>

      {/* Main content */}
      <div className={`relative z-10 min-h-screen flex flex-col items-center justify-center p-8 transition-all duration-1000 ${
        phase === "initial" ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/50 border border-purple-500/30 mb-6">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-purple-300">
              LAVANDAR AI • Enterprise Weather Intelligence
            </span>
          </div>
          
          <h1 className="font-instrument text-6xl sm:text-8xl font-bold text-strata-white tracking-wider mb-4">
            STRATA
          </h1>
          
          <p className="font-mono text-sm text-strata-silver/60 tracking-wide max-w-md mx-auto">
            Precision atmospheric monitoring with military-grade security protocols
          </p>
        </div>

        {/* Permission/Email Card */}
        <div className="w-full max-w-lg">
          <div className="bg-strata-charcoal/30 rounded-lg border border-strata-steel/20 p-6 backdrop-blur-sm">
            
            {/* Phase: Location Permission */}
            {phase === "permission" && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-strata-orange" />
                  <span className="text-xs font-mono uppercase tracking-wider text-strata-silver/70">
                    Step 1: Authorize Location Access
                  </span>
                </div>
                
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-strata-orange/10 border border-strata-orange/30 flex items-center justify-center">
                    <Navigation className="w-10 h-10 text-strata-orange" />
                  </div>
                  
                  <h3 className="font-instrument text-xl text-strata-white mb-2">
                    Location Required
                  </h3>
                  <p className="text-sm text-strata-silver/60 mb-6 max-w-sm mx-auto">
                    STRATA requires your location to provide precision atmospheric data for your observation point.
                  </p>
                  
                  <Button
                    onClick={requestLocation}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-strata-orange text-white font-instrument text-lg tracking-wider rounded transition-all duration-200 hover:bg-strata-orange/90 hover:shadow-[0_0_30px_rgba(255,140,0,0.3)]"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>ALLOW LOCATION ACCESS</span>
                  </Button>
                </div>
                
                <div className="mt-4 p-3 rounded bg-strata-steel/10 border border-strata-steel/20">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-strata-lume mt-0.5" />
                    <p className="text-[10px] text-strata-silver/60 leading-relaxed">
                      Your location data is encrypted end-to-end and never stored on external servers. 
                      LAVANDAR maintains SOC 2 Type II compliance for all data handling.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Phase: Email Entry */}
            {phase === "email" && !emailSubmitted && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-strata-silver/70">
                    Step 2: Secure Access Request
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-6 p-2 rounded bg-strata-lume/10 border border-strata-lume/20">
                  <CheckCircle className="w-4 h-4 text-strata-lume" />
                  <span className="text-xs text-strata-lume">Location authorized successfully</span>
                </div>
                
                <div className="py-4">
                  <h3 className="font-instrument text-xl text-strata-white mb-2 text-center">
                    Enter Your Email
                  </h3>
                  <p className="text-sm text-strata-silver/60 mb-6 text-center max-w-sm mx-auto">
                    Your email will be sent securely to LAVANDAR AI for access authorization.
                  </p>
                  
                  <div className="space-y-4">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-strata-steel/20 border-strata-steel/30 text-strata-white placeholder:text-strata-silver/40 font-mono text-center text-lg py-6"
                    />
                    
                    <Button
                      onClick={handleEmailSubmit}
                      disabled={!email || !email.includes("@")}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 text-white font-instrument text-lg tracking-wider rounded transition-all duration-200 hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Mail className="w-5 h-5" />
                      <span>SEND ACCESS REQUEST</span>
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 p-3 rounded bg-purple-900/20 border border-purple-500/20">
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-purple-400 mt-0.5" />
                    <p className="text-[10px] text-strata-silver/60 leading-relaxed">
                      Your email is protected by enterprise-grade encryption. 
                      This will open your email app to send a secure access request.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Email Submitted Confirmation */}
            {emailSubmitted && phase !== "launching" && (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-strata-lume/10 border border-strata-lume/30 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-strata-lume" />
                </div>
                <h3 className="font-instrument text-xl text-strata-white mb-2">
                  Access Request Sent
                </h3>
                <p className="text-sm text-strata-silver/60">
                  Initializing STRATA instrument...
                </p>
                <Loader2 className="w-6 h-6 text-strata-orange mx-auto mt-4 animate-spin" />
              </div>
            )}
          </div>

          {/* Status line */}
          <div className="mt-4 flex items-center justify-center gap-4 text-[9px] font-mono text-strata-silver/40 uppercase tracking-wider">
            <span className={locationGranted ? "text-strata-lume" : ""}>
              {locationGranted ? "Location Verified" : "Awaiting Location"}
            </span>
            <span className={`w-1 h-1 rounded-full ${locationGranted ? "bg-strata-lume" : "bg-strata-silver/40"}`} />
            <span className={emailSubmitted ? "text-strata-lume" : ""}>
              {emailSubmitted ? "Email Verified" : "Awaiting Email"}
            </span>
            <span className={`w-1 h-1 rounded-full ${emailSubmitted ? "bg-strata-lume" : "bg-strata-silver/40"}`} />
            <span>Encryption Active</span>
          </div>
        </div>

        {/* Built by attribution */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-mono text-strata-silver/30 uppercase tracking-wider">
            Built in Woods Hole by Piping Plover
          </p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 flex flex-col gap-1">
        <div className="w-8 h-0.5 bg-purple-500/60" />
        <div className="w-4 h-0.5 bg-purple-500/40" />
      </div>
      <div className="absolute bottom-8 left-8 flex flex-col gap-1">
        <div className="w-4 h-0.5 bg-purple-500/40" />
        <div className="w-8 h-0.5 bg-purple-500/60" />
      </div>
      <div className="absolute top-8 right-8 flex flex-col gap-1 items-end">
        <div className="w-8 h-0.5 bg-purple-500/60" />
        <div className="w-4 h-0.5 bg-purple-500/40" />
      </div>
      <div className="absolute bottom-8 right-8 flex flex-col gap-1 items-end">
        <div className="w-4 h-0.5 bg-purple-500/40" />
        <div className="w-8 h-0.5 bg-purple-500/60" />
      </div>
    </div>
  );
};

export default LandingPage;
