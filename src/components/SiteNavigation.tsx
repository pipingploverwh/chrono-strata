import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Gauge, Plane, Anchor, HardHat, CalendarDays, ScrollText, Rocket, Map, ChevronRight, Brain, Activity, FileCheck, Mail, ShieldCheck, User, Building2, Compass, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import LanguageToggle from "@/components/LanguageToggle";
interface NavItem {
  path: string;
  label: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  category: "main" | "industry" | "system" | "tools";
  isPublic?: boolean;
}
const navItems: NavItem[] = [
// Main - Public
{
  path: "/",
  label: "Operations Console",
  description: "Strategic Overview & Analytics Dashboard",
  icon: Brain,
  category: "main",
  isPublic: true
}, {
  path: "/strata",
  label: "STRATA Instrument",
  description: "Core Weather Intelligence Dashboard",
  icon: Gauge,
  category: "main",
  isPublic: true
}, {
  path: "/launch",
  label: "Location Select",
  description: "Observation Point Initialization",
  icon: Rocket,
  category: "main",
  isPublic: true
},
// Industry Verticals - Public
{
  path: "/aviation",
  label: "Aviation",
  description: "Pilot Weather Briefing System",
  icon: Plane,
  category: "industry",
  isPublic: true
}, {
  path: "/marine",
  label: "Marine",
  description: "Maritime Weather Intelligence",
  icon: Anchor,
  category: "industry",
  isPublic: true
}, {
  path: "/construction",
  label: "Construction",
  description: "Jobsite Weather Monitoring",
  icon: HardHat,
  category: "industry",
  isPublic: true
}, {
  path: "/events",
  label: "Events",
  description: "Venue Weather Operations",
  icon: CalendarDays,
  category: "industry",
  isPublic: true
},
// Protected Routes - Hidden from public nav
{
  path: "/validation-report",
  label: "Validation Report",
  description: "94% Accuracy Proof-of-Concept",
  icon: FileCheck,
  category: "main",
  isPublic: false
}, {
  path: "/recruiter-outreach",
  label: "Recruiter Outreach",
  description: "Technical Recruiter Email Generator",
  icon: Mail,
  category: "tools",
  isPublic: false
}, {
  path: "/security",
  label: "Security Test Suite",
  description: "AI Security & Compliance Dashboard",
  icon: ShieldCheck,
  category: "tools",
  isPublic: false
}, {
  path: "/portfolio",
  label: "Portfolio",
  description: "Projects & Skills Showcase",
  icon: User,
  category: "tools",
  isPublic: false
}, {
  path: "/logs",
  label: "System Logs",
  description: "Atmospheric Data History",
  icon: ScrollText,
  category: "system",
  isPublic: false
}, {
  path: "/sitemap",
  label: "Site Map",
  description: "Complete Navigation Index",
  icon: Map,
  category: "system",
  isPublic: true
}];

// AAL Corner Accent component
const AALCornerAccent = ({
  position,
  color = "strata-orange"
}: {
  position: 'tl' | 'tr' | 'bl' | 'br';
  color?: string;
}) => {
  const positionClasses = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0',
    bl: 'bottom-0 left-0',
    br: 'bottom-0 right-0'
  };
  const lineClasses = {
    tl: {
      h: 'top-0 left-0 w-5 h-px bg-gradient-to-r',
      v: 'top-0 left-0 w-px h-5 bg-gradient-to-b'
    },
    tr: {
      h: 'top-0 right-0 w-5 h-px bg-gradient-to-l',
      v: 'top-0 right-0 w-px h-5 bg-gradient-to-b'
    },
    bl: {
      h: 'bottom-0 left-0 w-5 h-px bg-gradient-to-r',
      v: 'bottom-0 left-0 w-px h-5 bg-gradient-to-t'
    },
    br: {
      h: 'bottom-0 right-0 w-5 h-px bg-gradient-to-l',
      v: 'bottom-0 right-0 w-px h-5 bg-gradient-to-t'
    }
  };
  return <div className={`absolute ${positionClasses[position]} w-5 h-5 pointer-events-none`}>
      <div className={`absolute ${lineClasses[position].h} from-${color}/60 to-transparent`} />
      <div className={`absolute ${lineClasses[position].v} from-${color}/60 to-transparent`} />
      <motion.div className={`absolute ${position.includes('t') ? 'top-0' : 'bottom-0'} ${position.includes('l') ? 'left-0' : 'right-0'} w-1.5 h-1.5 rotate-45 border border-${color}/50`} initial={{
      scale: 0,
      rotate: 0
    }} animate={{
      scale: 1,
      rotate: 45
    }} transition={{
      duration: 0.3,
      delay: 0.2
    }} />
    </div>;
};

// Kuma Glass Panel component
const KumaGlassPanel = ({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`relative backdrop-blur-md border border-white/[0.08] ${className}`} style={{
  background: 'linear-gradient(135deg, hsl(var(--strata-charcoal) / 0.6) 0%, hsl(var(--strata-black) / 0.8) 100%)'
}}>
    <AALCornerAccent position="tl" />
    <AALCornerAccent position="br" />
    {children}
  </div>;
export const SiteNavigation = () => {
  const location = useLocation();

  // Only show public items in navigation
  const mainItems = navItems.filter(item => item.category === "main" && item.isPublic !== false);
  const industryItems = navItems.filter(item => item.category === "industry" && item.isPublic !== false);
  const systemItems = navItems.filter(item => item.category === "system" && item.isPublic !== false);
  const currentPage = navItems.find(i => i.path === location.pathname);
  return <Sheet>
      <SheetTrigger asChild>
        <motion.button className="fixed bottom-6 right-6 z-50 group focus:outline-none focus:ring-2 focus:ring-strata-orange focus:ring-offset-2 focus:ring-offset-strata-black" aria-label="Open site navigation menu" aria-haspopup="dialog" whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }}>
          <KumaGlassPanel className="flex items-center gap-3 px-5 py-3.5 rounded-full shadow-2xl hover:border-strata-orange/30 transition-all">
            {/* Animated compass icon */}
            <motion.div animate={{
            rotate: [0, 10, -10, 0]
          }} transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}>
              <Compass className="w-5 h-5 text-strata-orange" aria-hidden="true" />
            </motion.div>
            
            <div className="flex flex-col items-start">
              <span className="text-sm font-mono text-strata-white tracking-wider">
                Navigate
              </span>
              <span className="text-[9px] font-mono text-strata-silver/50 uppercase tracking-widest">
                Site Map
              </span>
            </div>

            {/* Live indicator */}
            <div className="w-2 h-2 rounded-full bg-strata-lume animate-pulse" />
          </KumaGlassPanel>
        </motion.button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[420px] p-0 border-l border-strata-steel/20 overflow-hidden" style={{
      background: 'linear-gradient(180deg, hsl(var(--strata-charcoal)) 0%, hsl(var(--strata-black)) 100%)'
    }} aria-label="Site navigation">
        {/* Kuma vertical slat pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          {[...Array(20)].map((_, i) => <div key={i} className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-white via-white to-transparent" style={{
          left: `${(i + 1) * 5}%`
        }} />)}
        </div>

        {/* Header with AAL geometric accents */}
        <SheetHeader className="relative p-6 border-b border-strata-steel/20">
          <AALCornerAccent position="tl" />
          <AALCornerAccent position="tr" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div animate={{
              rotate: 360
            }} transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}>
                <Compass className="w-6 h-6 text-strata-orange" aria-hidden="true" />
              </motion.div>
              <SheetTitle className="font-instrument text-2xl text-strata-white tracking-wide">
                Navigation
              </SheetTitle>
            </div>
            <LanguageToggle variant="compact" />
          </div>
          
          <p className="text-[10px] font-mono text-strata-silver/50 uppercase tracking-[0.2em] mt-1">
            LAVANDAR AI • Operations Platform
          </p>

          {/* AAL horizontal separator line */}
          <div className="absolute bottom-0 left-0 right-0 h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-strata-orange/30 to-transparent" />
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-1.5 h-1.5 rotate-45 border border-strata-orange/40 bg-strata-charcoal" />
          </div>
        </SheetHeader>

        <nav id="main-navigation" className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-thin scrollbar-thumb-strata-steel/30" aria-label="Main navigation" role="navigation">
          {/* Current Location - Glass panel */}
          {currentPage && <motion.div initial={{
          opacity: 0,
          y: -10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.3
        }}>
              <KumaGlassPanel className="p-4 rounded-lg border-strata-orange/20">
                <div className="text-[9px] font-mono uppercase text-strata-orange mb-2 tracking-widest">
                  Current Location
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-strata-orange/20 flex items-center justify-center">
                    <currentPage.icon className="w-5 h-5 text-strata-orange" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="font-semibold text-strata-white">{currentPage.label}</span>
                    <div className="text-[10px] text-strata-silver/60 font-mono">{currentPage.description}</div>
                  </div>
                </div>
              </KumaGlassPanel>
            </motion.div>}

          {/* Command Centers */}
          <NavSection title="Command Centers" items={mainItems} location={location} accentColor="strata-orange" />

          {/* Industry Verticals - Grid layout */}
          <section aria-labelledby="nav-industry-heading">
            <h3 id="nav-industry-heading" className="text-[9px] font-mono text-strata-silver/40 uppercase tracking-[0.3em] mb-4 px-1 flex items-center gap-2">
              <div className="w-8 h-px bg-gradient-to-r from-strata-cyan/40 to-transparent" />
              Industry Verticals
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {industryItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return <motion.div key={item.path} initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.3,
                delay: index * 0.05
              }}>
                    <Link to={item.path} className={`group relative block p-4 rounded-lg transition-all duration-300 ${isActive ? "bg-strata-cyan/10 border border-strata-cyan/30" : "bg-strata-steel/5 border border-transparent hover:bg-strata-steel/15 hover:border-strata-steel/20"}`} aria-current={isActive ? "page" : undefined}>
                      {/* AAL corner on hover/active */}
                      <div className={`absolute top-0 left-0 w-3 h-3 transition-opacity ${isActive || 'group-hover:opacity-100 opacity-0'}`}>
                        <div className={`absolute top-0 left-0 w-full h-px ${isActive ? 'bg-strata-cyan/50' : 'bg-strata-steel/30'}`} />
                        <div className={`absolute top-0 left-0 w-px h-full ${isActive ? 'bg-strata-cyan/50' : 'bg-strata-steel/30'}`} />
                      </div>

                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all ${isActive ? "bg-strata-cyan text-strata-white" : "bg-strata-steel/20 text-strata-silver group-hover:text-strata-cyan group-hover:bg-strata-cyan/10"}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className={`text-sm font-semibold ${isActive ? "text-strata-cyan" : "text-strata-white"}`}>
                        {item.label}
                      </div>
                      <div className="text-[10px] text-strata-silver/50 font-mono mt-1 line-clamp-1">
                        {item.description}
                      </div>
                    </Link>
                  </motion.div>;
            })}
            </div>
          </section>

          {/* System */}
          <NavSection title="System" items={systemItems} location={location} accentColor="strata-lume" compact />
        </nav>

        {/* Footer with AAL geometric pattern */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-strata-steel/20 bg-strata-black/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-[9px] font-mono text-strata-silver/40">
            <span className="tracking-widest">v2.0 • STRATA</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rotate-45 border border-strata-orange/40" />
              <span>LAVANDAR.AI</span>
              <div className="w-1.5 h-1.5 rotate-45 border border-strata-orange/40" />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>;
};

// Nav Section component with AAL styling
const NavSection = ({
  title,
  items,
  location,
  accentColor,
  compact = false
}: {
  title: string;
  items: NavItem[];
  location: ReturnType<typeof useLocation>;
  accentColor: string;
  compact?: boolean;
}) => <section>
    <h3 className="text-[9px] font-mono text-strata-silver/40 uppercase tracking-[0.3em] mb-4 px-1 flex items-center gap-2">
      <div className={`w-8 h-px bg-gradient-to-r from-${accentColor}/40 to-transparent`} />
      {title}
    </h3>
    <ul className="space-y-1.5" role="list">
      {items.map((item, index) => {
      const isActive = location.pathname === item.path;
      return <motion.li key={item.path} initial={{
        opacity: 0,
        x: -10
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.3,
        delay: index * 0.05
      }}>
            <Link to={item.path} className={`group relative flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${isActive ? `bg-${accentColor}/10 border border-${accentColor}/30` : "hover:bg-strata-steel/10 border border-transparent hover:border-strata-steel/10"}`} aria-current={isActive ? "page" : undefined}>Site Map{/* Left accent line on active */}
              {isActive && <motion.div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-${accentColor}`} layoutId={`${title}-active-indicator`} />}

              <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg flex items-center justify-center transition-all ${isActive ? `bg-${accentColor} text-strata-white` : `bg-strata-steel/20 text-strata-silver group-hover:text-${accentColor} group-hover:bg-${accentColor}/10`}`}>
                <item.icon className={compact ? "w-4 h-4" : "w-5 h-5"} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={`${compact ? 'text-sm' : 'font-semibold'} ${isActive ? `text-${accentColor}` : "text-strata-white"}`}>
                  {item.label}
                </div>
                {!compact && <div className="text-[10px] text-strata-silver/50 font-mono truncate">
                    {item.description}
                  </div>}
              </div>

              {isActive ? <Badge className={`bg-${accentColor}/20 text-${accentColor} text-[8px] border-0 font-mono`}>
                  HERE
                </Badge> : <ChevronRight className="w-4 h-4 text-strata-silver/30 group-hover:text-strata-silver/60 group-hover:translate-x-0.5 transition-all" />}
            </Link>
          </motion.li>;
    })}
    </ul>
  </section>;

// Standalone accessible sitemap page component
export const SiteMapPage = () => {
  const mainItems = navItems.filter(item => item.category === "main" && item.isPublic !== false);
  const industryItems = navItems.filter(item => item.category === "industry" && item.isPublic !== false);
  const systemItems = navItems.filter(item => item.category === "system" && item.isPublic !== false);
  return <main id="main-content" className="min-h-screen bg-gradient-to-b from-strata-charcoal to-strata-black p-8" role="main">
      {/* Kuma slat overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        {[...Array(30)].map((_, i) => <div key={i} className="absolute top-0 bottom-0 w-px bg-white" style={{
        left: `${(i + 1) * 3.33}%`
      }} />)}
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header with AAL accents */}
        <header className="relative mb-12 p-8 rounded-2xl" style={{
        background: 'linear-gradient(135deg, hsl(var(--strata-charcoal) / 0.8) 0%, hsl(var(--strata-black) / 0.9) 100%)',
        border: '1px solid hsl(var(--strata-steel) / 0.2)'
      }}>
          <AALCornerAccent position="tl" />
          <AALCornerAccent position="br" />
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <div className="flex items-center gap-4 mb-4">
              <motion.div animate={{
              rotate: 360
            }} transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}>
                <Compass className="w-10 h-10 text-strata-orange" />
              </motion.div>
              <div>
                <h1 className="font-instrument text-4xl text-strata-white tracking-wide">
                  Site Navigation
                </h1>
                <p className="text-strata-silver/60 font-mono text-sm mt-1">
                  Complete navigation structure for the LAVANDAR AI Operations Platform
                </p>
              </div>
            </div>
          </motion.div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Command Centers */}
          <SiteMapSection title="Command Centers" items={mainItems} color="strata-orange" />
          
          {/* Industry Verticals */}
          <SiteMapSection title="Industry Verticals" items={industryItems} color="strata-cyan" />
          
          {/* System */}
          <SiteMapSection title="System" items={systemItems} color="strata-lume" />
        </div>
      </div>
    </main>;
};
const SiteMapSection = ({
  title,
  items,
  color
}: {
  title: string;
  items: NavItem[];
  color: string;
}) => <motion.section initial={{
  opacity: 0,
  y: 20
}} animate={{
  opacity: 1,
  y: 0
}} transition={{
  duration: 0.5
}} className="relative p-6 rounded-xl" style={{
  background: 'linear-gradient(180deg, hsl(var(--strata-charcoal) / 0.5) 0%, hsl(var(--strata-black) / 0.7) 100%)',
  border: '1px solid hsl(var(--strata-steel) / 0.15)'
}}>
    <AALCornerAccent position="tl" color={color} />
    
    <h2 className={`text-lg font-instrument text-${color} mb-6 flex items-center gap-3`}>
      <div className={`w-1 h-6 rounded-full bg-${color}`} />
      {title}
    </h2>
    
    <ul className="space-y-2">
      {items.map(item => <li key={item.path}>
          <Link to={item.path} className="group flex items-center gap-3 p-3 rounded-lg hover:bg-strata-steel/10 transition-all">
            <div className={`w-8 h-8 rounded-lg bg-strata-steel/20 flex items-center justify-center group-hover:bg-${color}/10 group-hover:text-${color} transition-all`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-strata-white group-hover:text-strata-orange transition-colors">
                {item.label}
              </div>
              <div className="text-[10px] text-strata-silver/50 font-mono truncate">
                {item.description}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-strata-silver/30 group-hover:translate-x-1 transition-all" />
          </Link>
        </li>)}
    </ul>
  </motion.section>;