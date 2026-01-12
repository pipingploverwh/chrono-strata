import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, Loader2, ChevronRight } from "lucide-react";
import ZeroLemonCard from "@/components/ZeroLemonAnalysis";

const locations = [
  { name: "Foxborough, MA", coords: "42.09°N, 71.26°W", country: "USA" },
  { name: "Woods Hole, MA", coords: "41.52°N, 70.67°W", country: "USA" },
  { name: "Falmouth, MA", coords: "41.55°N, 70.61°W", country: "USA" },
  { name: "Boston, MA", coords: "42.36°N, 71.06°W", country: "USA" },
  { name: "Provincetown, MA", coords: "42.05°N, 70.19°W", country: "USA" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"initial" | "selecting" | "confirming" | "launching">("initial");
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [overlayProgress, setOverlayProgress] = useState(0);

  useEffect(() => {
    // Initial fade in
    const timer = setTimeout(() => setPhase("selecting"), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleConfirm = () => {
    setPhase("confirming");
    setTimeout(() => {
      setPhase("launching");
      // Animate the liquid overlay
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        setOverlayProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          navigate("/strata");
        }
      }, 30);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Liquid overlay - moon landing style */}
      <div 
        className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-300 ${
          phase === "launching" ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Multiple liquid layers for depth */}
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
          
          {/* Primary liquid fill */}
          <circle
            cx="50%"
            cy="50%"
            r={overlayProgress * 2 + "%"}
            fill="hsl(var(--strata-black))"
            filter="url(#liquid)"
            className="transition-all"
          />
          
          {/* Secondary wave */}
          <circle
            cx="50%"
            cy="50%"
            r={Math.max(0, overlayProgress - 10) * 2 + "%"}
            fill="hsl(var(--strata-charcoal))"
            filter="url(#liquid)"
          />
          
          {/* Center glow */}
          <circle
            cx="50%"
            cy="50%"
            r={Math.max(0, overlayProgress - 20) * 1.5 + "%"}
            fill="url(#centerGlow)"
          />
        </svg>

        {/* Launch text */}
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

      {/* Main content */}
      <div className={`relative z-10 min-h-screen flex flex-col items-center justify-center p-8 transition-all duration-1000 ${
        phase === "initial" ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-strata-charcoal/50 border border-strata-steel/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-strata-lume animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-strata-silver">
              Geological Weather Instrument
            </span>
          </div>
          
          <h1 className="font-instrument text-6xl sm:text-8xl font-bold text-strata-white tracking-wider mb-4">
            STRATA
          </h1>
          
          <p className="font-mono text-sm text-strata-silver/60 tracking-wide max-w-md mx-auto">
            Precision atmospheric monitoring across all layers of Earth's atmosphere
          </p>
        </div>

        {/* Location selector */}
        <div className={`w-full max-w-lg transition-all duration-500 ${
          phase === "confirming" || phase === "launching" ? "opacity-50 scale-95" : ""
        }`}>
          <div className="bg-strata-charcoal/30 rounded-lg border border-strata-steel/20 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-strata-orange" />
              <span className="text-xs font-mono uppercase tracking-wider text-strata-silver/70">
                Confirm Observation Point
              </span>
            </div>

            {/* Location options */}
            <div className="space-y-2 mb-6">
              {locations.map((location) => (
                <button
                  key={location.name}
                  onClick={() => setSelectedLocation(location)}
                  disabled={phase === "confirming" || phase === "launching"}
                  className={`w-full flex items-center justify-between p-4 rounded border transition-all duration-200 group ${
                    selectedLocation.name === location.name
                      ? "bg-strata-orange/10 border-strata-orange/40"
                      : "bg-strata-steel/10 border-strata-steel/20 hover:bg-strata-steel/20 hover:border-strata-steel/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full border-2 transition-colors ${
                      selectedLocation.name === location.name
                        ? "border-strata-orange bg-strata-orange"
                        : "border-strata-silver/40"
                    }`} />
                    <div className="text-left">
                      <div className={`font-instrument text-lg ${
                        selectedLocation.name === location.name ? "text-strata-orange" : "text-strata-white"
                      }`}>
                        {location.name}
                      </div>
                      <div className="text-[10px] font-mono text-strata-silver/50">
                        {location.coords}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-strata-silver/40 uppercase">
                    {location.country}
                  </span>
                </button>
              ))}
            </div>

            {/* Confirm button */}
            <button
              onClick={handleConfirm}
              disabled={phase === "confirming" || phase === "launching"}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-strata-orange text-white font-instrument text-lg tracking-wider rounded transition-all duration-200 hover:bg-strata-orange/90 hover:shadow-[0_0_30px_rgba(255,140,0,0.3)] disabled:opacity-50"
            >
              {phase === "confirming" || phase === "launching" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>ESTABLISHING LINK</span>
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5" />
                  <span>INITIALIZE INSTRUMENT</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Status line */}
          <div className="mt-4 flex items-center justify-center gap-4 text-[9px] font-mono text-strata-silver/40 uppercase tracking-wider">
            <span>System Ready</span>
            <span className="w-1 h-1 rounded-full bg-strata-lume" />
            <span>Atmospheric Sensors Online</span>
            <span className="w-1 h-1 rounded-full bg-strata-lume" />
            <span>Data Link Active</span>
          </div>
        </div>

        {/* Zero Lemon Halftime Analysis Card */}
        <div className="mt-8 flex justify-center">
          <ZeroLemonCard />
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 flex flex-col gap-1">
        <div className="w-8 h-0.5 bg-strata-orange/60" />
        <div className="w-4 h-0.5 bg-strata-orange/40" />
      </div>
      <div className="absolute top-8 right-8 flex flex-col gap-1 items-end">
        <div className="w-8 h-0.5 bg-strata-orange/60" />
        <div className="w-4 h-0.5 bg-strata-orange/40" />
      </div>
      <div className="absolute bottom-8 left-8 flex flex-col gap-1">
        <div className="w-4 h-0.5 bg-strata-orange/40" />
        <div className="w-8 h-0.5 bg-strata-orange/60" />
      </div>
      <div className="absolute bottom-8 right-8 flex flex-col gap-1 items-end">
        <div className="w-4 h-0.5 bg-strata-orange/40" />
        <div className="w-8 h-0.5 bg-strata-orange/60" />
      </div>
    </div>
  );
};

export default LandingPage;
