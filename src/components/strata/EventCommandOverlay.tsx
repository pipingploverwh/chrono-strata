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
  Shirt,
  Award,
  ExternalLink,
  Copy,
  Check,
  MessageCircle,
  Twitter,
  Linkedin,
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
    title: "CHRONO-STRATA CLUB",
    subtitle: "東京・渋谷",
    tagline: "Where Time Dissolves Into Sound",
    date: "March 5, 2026",
    time: "21:00 JST",
    venue: "Shibuya, Tokyo",
    capacity: "88 Members",
    type: "Listening Bar Launch",
    cta: "Join Waitlist",
    ctaAction: "waitlist",
    color: "lavender",
    features: [
      { icon: Music, label: "AI-Generated Japanese Disco House" },
      { icon: Globe, label: "Bilingual Experience (JP/EN)" },
      { icon: Users, label: "Exclusive 88-Member Capacity" },
    ],
  },
  product: {
    id: "strata-shell-drop",
    title: "STRATA SHELL",
    subtitle: "TACTICAL PROVISION",
    tagline: "Laboratory-Grade Environmental Protection",
    date: "Available Now",
    time: "Limited Allocation",
    venue: "Global Shipping",
    capacity: "$18,000 USD",
    type: "Product Drop",
    cta: "Reserve Now",
    ctaAction: "purchase",
    color: "lume",
    features: [
      { icon: Shield, label: "Vulcanized Hydrophobic Membrane" },
      { icon: Zap, label: "Embedded Chronometer HUD" },
      { icon: Compass, label: "Terrain-Responsive Fabric" },
    ],
  },
  protocol: {
    id: "century-protocol",
    title: "CENTURY PROTOCOL",
    subtitle: "100 YEARS OF OWNERSHIP",
    tagline: "Generational Access Begins Here",
    date: "2026 — 2126",
    time: "One-Time Payment",
    venue: "Global Membership",
    capacity: "$12,500 USD",
    type: "Legacy Membership",
    cta: "Secure Bond",
    ctaAction: "purchase",
    color: "orange",
    features: [
      { icon: Award, label: "Transferable to Heirs" },
      { icon: Shield, label: "Lifetime Weather Intelligence" },
      { icon: Sparkles, label: "Priority Access All Verticals" },
    ],
  },
};

const EventCommandOverlay = ({ isOpen, onClose, initialEvent = "club" }: EventCommandOverlayProps) => {
  const [activeEvent, setActiveEvent] = useState<keyof typeof EVENTS>(initialEvent);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [phase, setPhase] = useState<"intro" | "main">("intro");

  const event = EVENTS[activeEvent];

  useEffect(() => {
    if (isOpen) {
      setPhase("intro");
      const timer = setTimeout(() => setPhase("main"), 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/event?id=${event.id}`;
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: `${event.title} — ${event.type}`,
      text: `${event.tagline}\n${event.date} • ${event.venue}`,
      url: getShareUrl(),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlatformShare = (platform: "twitter" | "linkedin" | "whatsapp") => {
    const text = encodeURIComponent(`${event.title} — ${event.tagline}`);
    const url = encodeURIComponent(getShareUrl());

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };

    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  const handleCTA = async () => {
    if (event.ctaAction === "waitlist") {
      if (!email) {
        toast.error("Please enter your email");
        return;
      }
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1500));
      toast.success("You're on the waitlist!", {
        description: "Check your inbox for confirmation",
      });
      setIsSubmitting(false);
      setEmail("");
    } else if (event.ctaAction === "purchase") {
      window.location.href = "/shop";
    } else {
      toast.success("RSVP confirmed!");
    }
  };

  const handleAddToCalendar = () => {
    const eventDate = new Date("2026-03-05T21:00:00+09:00");
    const endDate = new Date("2026-03-06T02:00:00+09:00");
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${eventDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${encodeURIComponent(event.tagline)}&location=${encodeURIComponent(event.venue)}`;
    
    window.open(calendarUrl, "_blank");
    toast.success("Opening Google Calendar");
  };

  const getEventColor = () => {
    switch (event.color) {
      case "lavender": return "from-lavender-500 to-purple-600";
      case "lume": return "from-strata-lume to-emerald-500";
      case "orange": return "from-strata-orange to-amber-500";
      default: return "from-purple-500 to-pink-500";
    }
  };

  const getAccentColor = () => {
    switch (event.color) {
      case "lavender": return "text-lavender-400";
      case "lume": return "text-strata-lume";
      case "orange": return "text-strata-orange";
      default: return "text-purple-400";
    }
  };

  const getBorderColor = () => {
    switch (event.color) {
      case "lavender": return "border-lavender-500/30";
      case "lume": return "border-strata-lume/30";
      case "orange": return "border-strata-orange/30";
      default: return "border-purple-500/30";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-strata-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Intro Phase Animation */}
          <AnimatePresence>
            {phase === "intro" && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className={`text-4xl md:text-6xl font-instrument bg-gradient-to-r ${getEventColor()} bg-clip-text text-transparent`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {event.type.toUpperCase()}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <AnimatePresence>
            {phase === "main" && (
              <motion.div
                className="absolute inset-0 flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Header */}
                <motion.header
                  className="flex items-center justify-between px-6 py-4 border-b border-white/10"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Event Switcher */}
                  <div className="flex items-center gap-2">
                    {(Object.keys(EVENTS) as Array<keyof typeof EVENTS>).map((key) => (
                      <button
                        key={key}
                        onClick={() => setActiveEvent(key)}
                        className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
                          activeEvent === key
                            ? `bg-white/10 ${getAccentColor()} border ${getBorderColor()}`
                            : "text-strata-silver/60 hover:text-white"
                        }`}
                      >
                        {key === "club" ? "Tokyo Launch" : key === "product" ? "Shell Drop" : "Century Bond"}
                      </button>
                    ))}
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Close overlay"
                  >
                    <X className="w-6 h-6 text-strata-silver" />
                  </button>
                </motion.header>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto">
                  <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Event Badge */}
                    <motion.div
                      className="flex items-center gap-2 mb-6"
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getEventColor()}`} />
                      <span className="text-xs font-mono uppercase tracking-widest text-strata-silver/60">
                        {event.type}
                      </span>
                    </motion.div>

                    {/* Title Block */}
                    <motion.div
                      className="mb-8"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h1 className={`text-5xl md:text-7xl font-instrument tracking-tight mb-2 bg-gradient-to-r ${getEventColor()} bg-clip-text text-transparent`}>
                        {event.title}
                      </h1>
                      <p className="text-xl md:text-2xl font-mono text-strata-silver/80">
                        {event.subtitle}
                      </p>
                    </motion.div>

                    {/* Tagline */}
                    <motion.p
                      className="text-lg md:text-xl text-white/90 font-light mb-12 max-w-2xl"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {event.tagline}
                    </motion.p>

                    {/* Event Details Grid */}
                    <motion.div
                      className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 p-6 rounded-lg border ${getBorderColor()} bg-white/[0.02]`}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-strata-silver/60">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs font-mono uppercase">Date</span>
                        </div>
                        <span className={`font-mono ${getAccentColor()}`}>{event.date}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-strata-silver/60">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-mono uppercase">Time</span>
                        </div>
                        <span className={`font-mono ${getAccentColor()}`}>{event.time}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-strata-silver/60">
                          <MapPin className="w-4 h-4" />
                          <span className="text-xs font-mono uppercase">Location</span>
                        </div>
                        <span className={`font-mono ${getAccentColor()}`}>{event.venue}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-strata-silver/60">
                          <Users className="w-4 h-4" />
                          <span className="text-xs font-mono uppercase">Access</span>
                        </div>
                        <span className={`font-mono ${getAccentColor()}`}>{event.capacity}</span>
                      </div>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                      className="mb-12"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <h3 className="text-xs font-mono uppercase tracking-widest text-strata-silver/50 mb-4">
                        What's Included
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {event.features.map((feature, idx) => {
                          const Icon = feature.icon;
                          return (
                            <motion.div
                              key={idx}
                              className={`flex items-center gap-3 p-4 rounded-lg border ${getBorderColor()} bg-white/[0.02]`}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.8 + idx * 0.1 }}
                            >
                              <Icon className={`w-5 h-5 ${getAccentColor()}`} />
                              <span className="text-sm text-white/80">{feature.label}</span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                      className={`p-6 rounded-lg border ${getBorderColor()} bg-gradient-to-br from-white/[0.03] to-transparent mb-12`}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      {event.ctaAction === "waitlist" ? (
                        <div className="flex flex-col md:flex-row gap-4">
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 bg-strata-charcoal/50 border-white/10 text-white placeholder:text-strata-silver/40"
                          />
                          <Button
                            onClick={handleCTA}
                            disabled={isSubmitting}
                            className={`bg-gradient-to-r ${getEventColor()} text-white font-mono uppercase tracking-wider hover:opacity-90`}
                          >
                            {isSubmitting ? "Joining..." : event.cta}
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={handleCTA}
                          className={`w-full md:w-auto bg-gradient-to-r ${getEventColor()} text-white font-mono uppercase tracking-wider hover:opacity-90 py-6`}
                        >
                          {event.cta}
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                      )}

                      {activeEvent === "club" && (
                        <button
                          onClick={handleAddToCalendar}
                          className="flex items-center gap-2 mt-4 text-sm text-strata-silver/60 hover:text-white transition-colors"
                        >
                          <Calendar className="w-4 h-4" />
                          Add to Calendar
                        </button>
                      )}
                    </motion.div>

                    {/* Social Sharing Section */}
                    <motion.div
                      className="border-t border-white/10 pt-8"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.0 }}
                    >
                      <h3 className="text-xs font-mono uppercase tracking-widest text-strata-silver/50 mb-4">
                        Share This Event
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          onClick={handleNativeShare}
                          className="border-white/10 text-white hover:bg-white/10"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCopyLink}
                          className="border-white/10 text-white hover:bg-white/10"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 mr-2 text-strata-lume" />
                          ) : (
                            <Copy className="w-4 h-4 mr-2" />
                          )}
                          {copied ? "Copied!" : "Copy Link"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handlePlatformShare("twitter")}
                          className="border-white/10 text-white hover:bg-white/10"
                        >
                          <Twitter className="w-4 h-4 mr-2" />
                          Twitter
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handlePlatformShare("linkedin")}
                          className="border-white/10 text-white hover:bg-white/10"
                        >
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handlePlatformShare("whatsapp")}
                          className="border-white/10 text-white hover:bg-white/10"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Footer */}
                <motion.footer
                  className="px-6 py-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-strata-silver/40"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <span>STRATA COLLECTION</span>
                  <span>© 2026 LAVANDAR</span>
                  <span>PRECISION · REAL-TIME · INTEGRATION</span>
                </motion.footer>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Background Effects */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            {/* Gradient orbs */}
            <div className={`absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-r ${getEventColor()} opacity-[0.03] blur-3xl`} />
            <div className={`absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r ${getEventColor()} opacity-[0.05] blur-3xl`} />
            
            {/* Grid pattern */}
            <div 
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventCommandOverlay;
