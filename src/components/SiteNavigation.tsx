import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Gauge, 
  Plane, 
  Anchor, 
  HardHat, 
  CalendarDays, 
  ScrollText, 
  Rocket,
  Map,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  path: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "main" | "industry" | "system";
}

const navItems: NavItem[] = [
  // Main
  { 
    path: "/", 
    label: "Patriot Way", 
    description: "Game Night Command Center",
    icon: Home,
    category: "main"
  },
  { 
    path: "/launch", 
    label: "STRATA Launch", 
    description: "Location Selection & Initialization",
    icon: Rocket,
    category: "main"
  },
  { 
    path: "/strata", 
    label: "STRATA Instrument", 
    description: "Core Weather Intelligence Dashboard",
    icon: Gauge,
    category: "main"
  },
  // Industry Verticals
  { 
    path: "/aviation", 
    label: "Aviation", 
    description: "Pilot Weather Briefing System",
    icon: Plane,
    category: "industry"
  },
  { 
    path: "/marine", 
    label: "Marine", 
    description: "Maritime Weather Intelligence",
    icon: Anchor,
    category: "industry"
  },
  { 
    path: "/construction", 
    label: "Construction", 
    description: "Jobsite Weather Monitoring",
    icon: HardHat,
    category: "industry"
  },
  { 
    path: "/events", 
    label: "Events", 
    description: "Venue Weather Operations",
    icon: CalendarDays,
    category: "industry"
  },
  // System
  { 
    path: "/logs", 
    label: "System Logs", 
    description: "Atmospheric Data History",
    icon: ScrollText,
    category: "system"
  },
];

export const SiteNavigation = () => {
  const location = useLocation();

  const mainItems = navItems.filter(item => item.category === "main");
  const industryItems = navItems.filter(item => item.category === "industry");
  const systemItems = navItems.filter(item => item.category === "system");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button 
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-strata-charcoal border border-strata-steel/30 shadow-lg hover:bg-strata-steel/50 hover:border-strata-orange/30 transition-all group"
          aria-label="Open site navigation"
        >
          <Map className="w-5 h-5 text-strata-orange" />
          <span className="text-sm font-mono text-strata-silver group-hover:text-strata-white transition-colors">
            Navigate
          </span>
        </button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[380px] bg-gradient-to-b from-strata-charcoal to-strata-black border-strata-steel/30"
      >
        <SheetHeader>
          <SheetTitle className="font-instrument text-2xl text-strata-white tracking-wide flex items-center gap-3">
            <Map className="w-6 h-6 text-strata-orange" />
            Site Map
          </SheetTitle>
          <p className="text-[11px] font-mono text-strata-silver/60 uppercase tracking-[0.15em]">
            STRATA Weather Intelligence Platform
          </p>
        </SheetHeader>

        <nav className="mt-6 space-y-6" aria-label="Site navigation">
          {/* Main Section */}
          <section>
            <h3 className="text-[10px] font-mono text-strata-silver/50 uppercase tracking-widest mb-3 px-2">
              Command Centers
            </h3>
            <ul className="space-y-1" role="list">
              {mainItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all group ${
                      location.pathname === item.path
                        ? "bg-strata-orange/10 border border-strata-orange/30"
                        : "hover:bg-strata-steel/30 border border-transparent"
                    }`}
                    aria-current={location.pathname === item.path ? "page" : undefined}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      location.pathname === item.path
                        ? "bg-strata-orange text-strata-white"
                        : "bg-strata-steel/30 text-strata-silver group-hover:text-strata-orange"
                    }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold ${
                        location.pathname === item.path ? "text-strata-orange" : "text-strata-white"
                      }`}>
                        {item.label}
                      </div>
                      <div className="text-[11px] text-strata-silver/60 truncate">
                        {item.description}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${
                      location.pathname === item.path ? "text-strata-orange" : "text-strata-silver/40"
                    }`} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Industry Verticals */}
          <section>
            <h3 className="text-[10px] font-mono text-strata-silver/50 uppercase tracking-widest mb-3 px-2">
              Industry Verticals
            </h3>
            <ul className="grid grid-cols-2 gap-2" role="list">
              {industryItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all text-center group ${
                      location.pathname === item.path
                        ? "bg-strata-orange/10 border border-strata-orange/30"
                        : "bg-strata-steel/10 hover:bg-strata-steel/30 border border-transparent hover:border-strata-steel/30"
                    }`}
                    aria-current={location.pathname === item.path ? "page" : undefined}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      location.pathname === item.path
                        ? "bg-strata-orange text-strata-white"
                        : "bg-strata-steel/30 text-strata-silver group-hover:text-strata-orange"
                    }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className={`text-sm font-semibold ${
                      location.pathname === item.path ? "text-strata-orange" : "text-strata-white"
                    }`}>
                      {item.label}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* System */}
          <section>
            <h3 className="text-[10px] font-mono text-strata-silver/50 uppercase tracking-widest mb-3 px-2">
              System
            </h3>
            <ul className="space-y-1" role="list">
              {systemItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all group ${
                      location.pathname === item.path
                        ? "bg-strata-steel/30 border border-strata-steel/50"
                        : "hover:bg-strata-steel/20 border border-transparent"
                    }`}
                    aria-current={location.pathname === item.path ? "page" : undefined}
                  >
                    <item.icon className={`w-4 h-4 ${
                      location.pathname === item.path ? "text-strata-lume" : "text-strata-silver/60"
                    }`} />
                    <span className={`text-sm ${
                      location.pathname === item.path ? "text-strata-white" : "text-strata-silver"
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Accessibility Info */}
          <footer className="pt-4 border-t border-strata-steel/20">
            <div className="text-[9px] font-mono text-strata-silver/40 space-y-1">
              <p>Keyboard: Tab to navigate, Enter to select</p>
              <p>Current page: {navItems.find(i => i.path === location.pathname)?.label || 'Unknown'}</p>
            </div>
          </footer>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

// Standalone accessible sitemap page component
export const SiteMapPage = () => {
  const mainItems = navItems.filter(item => item.category === "main");
  const industryItems = navItems.filter(item => item.category === "industry");
  const systemItems = navItems.filter(item => item.category === "system");

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="font-instrument text-4xl text-strata-white mb-2">Site Map</h1>
          <p className="text-strata-silver">
            Complete navigation structure for STRATA Weather Intelligence Platform
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <section aria-labelledby="main-heading">
            <h2 id="main-heading" className="font-instrument text-xl text-strata-orange mb-4">
              Command Centers
            </h2>
            <ul className="space-y-3">
              {mainItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className="flex items-start gap-3 p-3 rounded-lg bg-strata-charcoal/50 hover:bg-strata-charcoal transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-strata-orange mt-0.5" />
                    <div>
                      <div className="font-semibold text-strata-white">{item.label}</div>
                      <div className="text-sm text-strata-silver/70">{item.description}</div>
                      <code className="text-[10px] text-strata-silver/40 font-mono">{item.path}</code>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="industry-heading">
            <h2 id="industry-heading" className="font-instrument text-xl text-strata-cyan mb-4">
              Industry Verticals
            </h2>
            <ul className="space-y-3">
              {industryItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className="flex items-start gap-3 p-3 rounded-lg bg-strata-charcoal/50 hover:bg-strata-charcoal transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-strata-cyan mt-0.5" />
                    <div>
                      <div className="font-semibold text-strata-white">{item.label}</div>
                      <div className="text-sm text-strata-silver/70">{item.description}</div>
                      <code className="text-[10px] text-strata-silver/40 font-mono">{item.path}</code>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="system-heading">
            <h2 id="system-heading" className="font-instrument text-xl text-strata-lume mb-4">
              System
            </h2>
            <ul className="space-y-3">
              {systemItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className="flex items-start gap-3 p-3 rounded-lg bg-strata-charcoal/50 hover:bg-strata-charcoal transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-strata-lume mt-0.5" />
                    <div>
                      <div className="font-semibold text-strata-white">{item.label}</div>
                      <div className="text-sm text-strata-silver/70">{item.description}</div>
                      <code className="text-[10px] text-strata-silver/40 font-mono">{item.path}</code>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="mt-12 pt-6 border-t border-strata-steel/20 text-center">
          <p className="text-sm text-strata-silver/60">
            STRATA Weather Intelligence Platform • Kraft Group
          </p>
        </footer>
      </div>
    </main>
  );
};

export default SiteNavigation;
