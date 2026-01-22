import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Share2, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Compass,
  Music,
  Award,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  Zap,
  Shield,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface EventCommandOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialEvent?: "club" | "product" | "protocol";
}

// Event data configurations
const EVENTS = {
  club: {
    id: "chrono-club-tokyo",
    title: "CHRONO-STRATA",
    subtitle: "CLUB",
    location: "東京・渋谷",
    tagline: "Where Time Dissolves Into Sound",
    date: "2026.03.05",
    time: "21:00 JST",
    venue: "Shibuya, Tokyo",
    capacity: "88",
    type: "Listening Bar Launch",
    cta: "Join Waitlist",
    ctaAction: "waitlist" as const,
    accentHue: "270", // Lavender
    features: [
      { icon: Music, label: "AI-Generated Japanese Disco House" },
      { icon: Globe, label: "Bilingual Experience" },
      { icon: Users, label: "88-Member Capacity" },
    ],
  },
  product: {
    id: "strata-shell-drop",
    title: "STRATA",
    subtitle: "SHELL",
    location: "TACTICAL PROVISION",
    tagline: "Laboratory-Grade Environmental Protection",
    date: "NOW",
    time: "Limited",
    venue: "Global",
    capacity: "$18K",
    type: "Product Drop",
    cta: "Reserve",
    ctaAction: "purchase" as const,
    accentHue: "160", // Emerald lume
    features: [
      { icon: Shield, label: "Vulcanized Hydrophobic Membrane" },
      { icon: Zap, label: "Embedded Chronometer HUD" },
      { icon: Compass, label: "Terrain-Responsive Fabric" },
    ],
  },
  protocol: {
    id: "century-protocol",
    title: "CENTURY",
    subtitle: "PROTOCOL",
    location: "2026 — 2126",
    tagline: "Generational Access Begins Here",
    date: "100",
    time: "Years",
    venue: "Global",
    capacity: "$12.5K",
    type: "Legacy Membership",
    cta: "Secure Bond",
    ctaAction: "purchase" as const,
    accentHue: "30", // Warm amber
    features: [
      { icon: Award, label: "Transferable to Heirs" },
      { icon: Shield, label: "Lifetime Weather Intelligence" },
      { icon: Sparkles, label: "Priority Access All Verticals" },
    ],
  },
};

/**
 * Precision Corner — AAL geometric accent
 * Creates angular corner frame elements
 */
const PrecisionCorner = ({ 
  position, 
  accentHue 
}: { 
  position: "tl" | "tr" | "bl" | "br";
  accentHue: string;
}) => {
  const positions = {
    tl: "top-0 left-0",
    tr: "top-0 right-0 rotate-90",
    bl: "bottom-0 left-0 -rotate-90",
    br: "bottom-0 right-0 rotate-180",
  };

  return (
    <div className={`absolute ${positions[position]} w-16 h-16 pointer-events-none`}>
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <motion.path
          d="M 0 24 L 0 0 L 24 0"
          fill="none"
          stroke={`hsl(${accentHue} 50% 55%)`}
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.circle
          cx="0"
          cy="0"
          r="2"
          fill={`hsl(${accentHue} 50% 55%)`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
        />
      </svg>
    </div>
  );
};

/**
 * Kuma Slat Pattern — Vertical rhythm overlay
 */
const KumaSlats = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 23px,
          hsl(0 0% 100% / 0.03) 23px,
          hsl(0 0% 100% / 0.03) 24px
        )`,
      }}
    />
  </div>
);

/**
 * Glass Panel — Kuma layered transparency
 */
const GlassPanel = ({ 
  children, 
  className = "",
  depth = 1,
  delay = 0
}: { 
  children: React.ReactNode;
  className?: string;
  depth?: 1 | 2 | 3;
  delay?: number;
}) => {
  const opacities = { 1: "0.02", 2: "0.04", 3: "0.06" };
  
  return (
    <motion.div
      className={`relative backdrop-blur-sm ${className}`}
      style={{
        backgroundColor: `hsl(0 0% 100% / ${opacities[depth]})`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.22, 1, 0.36, 1] 
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Ruled Line — AAL horizontal structure
 */
const RuledLine = ({ 
  className = "",
  delay = 0 
}: { 
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={`h-px bg-white/[0.08] ${className}`}
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ 
      duration: 0.8, 
      delay,
      ease: [0.22, 1, 0.36, 1] 
    }}
    style={{ transformOrigin: "left" }}
  />
);

const EventCommandOverlay = ({ isOpen, onClose, initialEvent = "club" }: EventCommandOverlayProps) => {
  const [activeEvent, setActiveEvent] = useState<keyof typeof EVENTS>(initialEvent);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [phase, setPhase] = useState<"slats" | "glass" | "content">("slats");

  const event = EVENTS[activeEvent];

  // Multi-phase entry animation
  useEffect(() => {
    if (isOpen) {
      setPhase("slats");
      const t1 = setTimeout(() => setPhase("glass"), 400);
      const t2 = setTimeout(() => setPhase("content"), 800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isOpen, activeEvent]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const getShareUrl = () => `${window.location.origin}/event?id=${event.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${event.title} ${event.subtitle}`,
          text: event.tagline,
          url: getShareUrl(),
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCTA = async () => {
    if (event.ctaAction === "waitlist") {
      if (!email) {
        toast.error("Please enter your email");
        return;
      }
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 1500));
      toast.success("You're on the waitlist");
      setIsSubmitting(false);
      setEmail("");
    } else {
      window.location.href = "/shop";
    }
  };

  const handleAddToCalendar = () => {
    const eventDate = new Date("2026-03-05T21:00:00+09:00");
    const endDate = new Date("2026-03-06T02:00:00+09:00");
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title + " " + event.subtitle)}&dates=${eventDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${encodeURIComponent(event.tagline)}&location=${encodeURIComponent(event.venue)}`;
    window.open(calendarUrl, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ═══════════════════════════════════════════════════════════
             PHASE 1: Slat Reveal — Light through Kuma screens
             ═══════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {phase === "slats" && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Animated vertical slats */}
                <div className="relative w-full h-full overflow-hidden">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-0 bottom-0 w-px"
                      style={{ 
                        left: `${(i + 1) * 5}%`,
                        backgroundColor: `hsl(${event.accentHue} 50% 55% / 0.3)`
                      }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: i * 0.02,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══════════════════════════════════════════════════════════
             PHASE 2 & 3: Glass Panels + Content
             ═══════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {(phase === "glass" || phase === "content") && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Kuma Slat Background Pattern */}
                <KumaSlats />

                {/* Precision Corners */}
                <PrecisionCorner position="tl" accentHue={event.accentHue} />
                <PrecisionCorner position="tr" accentHue={event.accentHue} />
                <PrecisionCorner position="bl" accentHue={event.accentHue} />
                <PrecisionCorner position="br" accentHue={event.accentHue} />

                {/* Close Button */}
                <motion.button
                  onClick={onClose}
                  className="absolute top-6 right-6 z-50 p-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>

                {/* Event Type Selector */}
                <motion.div
                  className="absolute top-6 left-6 z-50 flex items-center gap-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {(Object.keys(EVENTS) as Array<keyof typeof EVENTS>).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveEvent(key)}
                      className={`px-3 py-1.5 text-xs font-mono uppercase tracking-widest transition-all ${
                        activeEvent === key
                          ? "text-foreground border-b border-current"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {key === "club" ? "Launch" : key === "product" ? "Drop" : "Bond"}
                    </button>
                  ))}
                </motion.div>

                {/* Main Content Grid */}
                <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12">
                  <div className="w-full max-w-6xl">
                    {phase === "content" && (
                      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
                        
                        {/* Left Column — Title Block */}
                        <div className="lg:col-span-7 space-y-8">
                          {/* Type Badge */}
                          <motion.div
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: `hsl(${event.accentHue} 50% 55%)` }}
                            />
                            <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                              {event.type}
                            </span>
                          </motion.div>

                          {/* Large Title — Sparse Gallery Typography */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <h1 
                              className="text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight leading-none"
                              style={{ color: `hsl(${event.accentHue} 50% 55%)` }}
                            >
                              {event.title}
                            </h1>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground/90 -mt-2">
                              {event.subtitle}
                            </h2>
                          </motion.div>

                          <RuledLine delay={0.4} className="w-24" />

                          {/* Tagline */}
                          <motion.p
                            className="text-lg md:text-xl text-muted-foreground font-light max-w-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            {event.tagline}
                          </motion.p>

                          {/* Location */}
                          <motion.div
                            className="font-mono text-sm text-foreground/70"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            {event.location}
                          </motion.div>
                        </div>

                        {/* Right Column — Data + CTA */}
                        <div className="lg:col-span-5 space-y-6">
                          {/* Data Grid — Glass Panel */}
                          <GlassPanel depth={2} delay={0.5} className="p-6 border border-white/[0.06]">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-2">
                                  <Calendar className="w-3 h-3" />
                                  Date
                                </div>
                                <div 
                                  className="text-2xl font-mono"
                                  style={{ color: `hsl(${event.accentHue} 50% 55%)` }}
                                >
                                  {event.date}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-2">
                                  <Clock className="w-3 h-3" />
                                  Time
                                </div>
                                <div className="text-2xl font-mono text-foreground">
                                  {event.time}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-2">
                                  <MapPin className="w-3 h-3" />
                                  Location
                                </div>
                                <div className="text-lg font-mono text-foreground">
                                  {event.venue}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-2">
                                  <Users className="w-3 h-3" />
                                  Access
                                </div>
                                <div className="text-lg font-mono text-foreground">
                                  {event.capacity}
                                </div>
                              </div>
                            </div>
                          </GlassPanel>

                          {/* Features — Staggered Reveal */}
                          <div className="space-y-3">
                            {event.features.map((feature, idx) => {
                              const Icon = feature.icon;
                              return (
                                <motion.div
                                  key={idx}
                                  className="flex items-center gap-3 text-sm"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.7 + idx * 0.1 }}
                                >
                                  <Icon 
                                    className="w-4 h-4" 
                                    style={{ color: `hsl(${event.accentHue} 50% 55%)` }}
                                  />
                                  <span className="text-muted-foreground">{feature.label}</span>
                                </motion.div>
                              );
                            })}
                          </div>

                          <RuledLine delay={0.9} />

                          {/* CTA Section */}
                          <GlassPanel depth={3} delay={1} className="p-6 border border-white/[0.08]">
                            {event.ctaAction === "waitlist" ? (
                              <div className="space-y-4">
                                <Input
                                  type="email"
                                  placeholder="your@email.com"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="bg-transparent border-white/10 text-foreground placeholder:text-muted-foreground font-mono"
                                />
                                <Button
                                  onClick={handleCTA}
                                  disabled={isSubmitting}
                                  className="w-full font-mono uppercase tracking-widest"
                                  style={{ 
                                    backgroundColor: `hsl(${event.accentHue} 50% 55%)`,
                                    color: "white"
                                  }}
                                >
                                  {isSubmitting ? "Joining..." : event.cta}
                                  <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={handleCTA}
                                className="w-full py-6 font-mono uppercase tracking-widest"
                                style={{ 
                                  backgroundColor: `hsl(${event.accentHue} 50% 55%)`,
                                  color: "white"
                                }}
                              >
                                {event.cta}
                                <ChevronRight className="w-5 h-5 ml-2" />
                              </Button>
                            )}

                            {/* Secondary Actions */}
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.06]">
                              {activeEvent === "club" && (
                                <button
                                  onClick={handleAddToCalendar}
                                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono uppercase tracking-wider"
                                >
                                  <Calendar className="w-3 h-3" />
                                  Calendar
                                </button>
                              )}
                              <button
                                onClick={handleNativeShare}
                                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono uppercase tracking-wider"
                              >
                                <Share2 className="w-3 h-3" />
                                Share
                              </button>
                              <button
                                onClick={handleCopyLink}
                                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono uppercase tracking-wider ml-auto"
                              >
                                {copied ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                                {copied ? "Copied" : "Link"}
                              </button>
                            </div>
                          </GlassPanel>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Ruled Line */}
                <motion.div
                  className="absolute bottom-12 left-6 right-6 h-px bg-white/[0.06]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "left" }}
                />

                {/* Footer — Brand Mark */}
                <motion.div
                  className="absolute bottom-6 left-6 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <span>STRATA</span>
                  <span className="text-white/20">×</span>
                  <span>LAVANDAR</span>
                </motion.div>

                {/* Social Proof / Scroll Hint */}
                <motion.div
                  className="absolute bottom-6 right-6 text-xs font-mono text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  ESC to close
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventCommandOverlay;
