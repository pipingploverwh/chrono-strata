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
  Brain,
  Trophy,
  Shield,
  Activity,
  FileCheck,
  ExternalLink,
  Keyboard,
  Mail,
  ShieldCheck,
  User
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  path: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
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
  },
  { 
    path: "/vc", 
    label: "Investor Summary", 
    description: "VC Investment Overview",
    icon: Activity,
    category: "main",
    isPublic: true
  },
  { 
    path: "/strata", 
    label: "STRATA Instrument", 
    description: "Core Weather Intelligence Dashboard",
    icon: Gauge,
    category: "main",
    isPublic: true
  },
  { 
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
  },
  { 
    path: "/marine", 
    label: "Marine", 
    description: "Maritime Weather Intelligence",
    icon: Anchor,
    category: "industry",
    isPublic: true
  },
  { 
    path: "/construction", 
    label: "Construction", 
    description: "Jobsite Weather Monitoring",
    icon: HardHat,
    category: "industry",
    isPublic: true
  },
  { 
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
  },
  { 
    path: "/recruiter-outreach", 
    label: "Recruiter Outreach", 
    description: "Technical Recruiter Email Generator",
    icon: Mail,
    category: "tools",
    isPublic: false
  },
  { 
    path: "/security", 
    label: "Security Test Suite", 
    description: "AI Security & Compliance Dashboard",
    icon: ShieldCheck,
    category: "tools",
    isPublic: false
  },
  { 
    path: "/portfolio", 
    label: "Portfolio", 
    description: "Projects & Skills Showcase",
    icon: User,
    category: "tools",
    isPublic: false
  },
  { 
    path: "/logs", 
    label: "System Logs", 
    description: "Atmospheric Data History",
    icon: ScrollText,
    category: "system",
    isPublic: false
  },
  { 
    path: "/sitemap", 
    label: "Site Map", 
    description: "Complete Navigation Index",
    icon: Map,
    category: "system",
    isPublic: true
  },
];

export const SiteNavigation = () => {
  const location = useLocation();

  // Only show public items in navigation
  const mainItems = navItems.filter(item => item.category === "main" && item.isPublic !== false);
  const industryItems = navItems.filter(item => item.category === "industry" && item.isPublic !== false);
  const toolsItems = navItems.filter(item => item.category === "tools" && item.isPublic !== false);
  const systemItems = navItems.filter(item => item.category === "system" && item.isPublic !== false);

  const currentPage = navItems.find(i => i.path === location.pathname);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button 
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-strata-charcoal border border-strata-steel/30 shadow-lg hover:bg-strata-steel/50 hover:border-strata-orange/30 transition-all group focus:outline-none focus:ring-2 focus:ring-strata-orange focus:ring-offset-2 focus:ring-offset-strata-black"
          aria-label="Open site navigation menu"
          aria-haspopup="dialog"
        >
          <Map className="w-5 h-5 text-strata-orange" aria-hidden="true" />
          <span className="text-sm font-mono text-strata-silver group-hover:text-strata-white transition-colors">
            Navigate
          </span>
        </button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[380px] bg-gradient-to-b from-strata-charcoal to-strata-black border-strata-steel/30"
        aria-label="Site navigation"
      >
        <SheetHeader>
          <SheetTitle className="font-instrument text-2xl text-strata-white tracking-wide flex items-center gap-3">
            <Map className="w-6 h-6 text-strata-orange" aria-hidden="true" />
            Site Navigation
          </SheetTitle>
          <p className="text-[11px] font-mono text-strata-silver/60 uppercase tracking-[0.15em]">
            Lavandar AI • Operations Platform
          </p>
        </SheetHeader>

        <nav 
          id="main-navigation"
          className="mt-6 space-y-6" 
          aria-label="Main navigation"
          role="navigation"
        >
          {/* Current Location */}
          {currentPage && (
            <div className="p-3 rounded-lg bg-strata-orange/10 border border-strata-orange/30">
              <div className="text-[9px] font-mono uppercase text-strata-orange mb-1">
                Current Page
              </div>
              <div className="flex items-center gap-2">
                <currentPage.icon className="w-4 h-4 text-strata-orange" aria-hidden="true" />
                <span className="font-semibold text-strata-white">{currentPage.label}</span>
              </div>
            </div>
          )}

          {/* Main Section */}
          <section aria-labelledby="nav-main-heading">
            <h3 
              id="nav-main-heading"
              className="text-[10px] font-mono text-strata-silver/50 uppercase tracking-widest mb-3 px-2"
            >
              Command Centers
            </h3>
            <ul className="space-y-1" role="list">
              {mainItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all group focus:outline-none focus:ring-2 focus:ring-strata-orange focus:ring-inset ${
                        isActive
                          ? "bg-strata-orange/10 border border-strata-orange/30"
                          : "hover:bg-strata-steel/30 border border-transparent"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={`${item.label}: ${item.description}`}
                    >
                      <div 
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-strata-orange text-strata-white"
                            : "bg-strata-steel/30 text-strata-silver group-hover:text-strata-orange"
                        }`}
                        aria-hidden="true"
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold ${
                          isActive ? "text-strata-orange" : "text-strata-white"
                        }`}>
                          {item.label}
                        </div>
                        <div className="text-[11px] text-strata-silver/60 truncate">
                          {item.description}
                        </div>
                      </div>
                      {isActive ? (
                        <Badge className="bg-strata-orange/20 text-strata-orange text-[8px] border-0">
                          HERE
                        </Badge>
                      ) : (
                        <ChevronRight 
                          className="w-4 h-4 text-strata-silver/40 group-hover:text-strata-orange transition-colors" 
                          aria-hidden="true" 
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Industry Verticals */}
          <section aria-labelledby="nav-industry-heading">
            <h3 
              id="nav-industry-heading"
              className="text-[10px] font-mono text-strata-silver/50 uppercase tracking-widest mb-3 px-2"
            >
              Industry Verticals
            </h3>
            <ul className="grid grid-cols-2 gap-2" role="list">
              {industryItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all text-center group focus:outline-none focus:ring-2 focus:ring-strata-cyan focus:ring-inset ${
                        isActive
                          ? "bg-strata-cyan/10 border border-strata-cyan/30"
                          : "bg-strata-steel/10 hover:bg-strata-steel/30 border border-transparent hover:border-strata-steel/30"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={`${item.label} industry vertical: ${item.description}`}
                    >
                      <div 
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-strata-cyan text-strata-white"
                            : "bg-strata-steel/30 text-strata-silver group-hover:text-strata-cyan"
                        }`}
                        aria-hidden="true"
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className={`text-sm font-semibold ${
                        isActive ? "text-strata-cyan" : "text-strata-white"
                      }`}>
                        {item.label}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Tools - only show if there are public tools */}
          {toolsItems.length > 0 && (
            <section aria-labelledby="nav-tools-heading">
              <h3 
                id="nav-tools-heading"
                className="text-[10px] font-mono text-strata-silver/50 uppercase tracking-widest mb-3 px-2"
              >
                Tools
              </h3>
              <ul className="space-y-1" role="list">
                {toolsItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset ${
                          isActive
                            ? "bg-purple-500/10 border border-purple-500/30"
                            : "hover:bg-strata-steel/20 border border-transparent"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                        aria-label={`${item.label}: ${item.description}`}
                      >
                        <div 
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isActive
                              ? "bg-purple-500 text-white"
                              : "bg-strata-steel/30 text-strata-silver group-hover:text-purple-400"
                          }`}
                          aria-hidden="true"
                        >
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-semibold ${
                            isActive ? "text-purple-400" : "text-strata-white"
                          }`}>
                            {item.label}
                          </div>
                          <div className="text-[10px] text-strata-silver/50 truncate">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* System */}
          <section aria-labelledby="nav-system-heading">
            <h3 
              id="nav-system-heading"
              className="text-[10px] font-mono text-strata-silver/50 uppercase tracking-widest mb-3 px-2"
            >
              System
            </h3>
            <ul className="space-y-1" role="list">
              {systemItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all group focus:outline-none focus:ring-2 focus:ring-strata-lume focus:ring-inset ${
                        isActive
                          ? "bg-strata-steel/30 border border-strata-steel/50"
                          : "hover:bg-strata-steel/20 border border-transparent"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={`${item.label}: ${item.description}`}
                    >
                      <item.icon 
                        className={`w-4 h-4 ${
                          isActive ? "text-strata-lume" : "text-strata-silver/60"
                        }`} 
                        aria-hidden="true"
                      />
                      <span className={`text-sm ${
                        isActive ? "text-strata-white" : "text-strata-silver"
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Keyboard Shortcuts Info */}
          <footer className="pt-4 border-t border-strata-steel/20">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-strata-steel/10">
              <Keyboard className="w-4 h-4 text-strata-silver/50 mt-0.5" aria-hidden="true" />
              <div className="text-[10px] font-mono text-strata-silver/50 space-y-1">
                <p><kbd className="px-1 py-0.5 rounded bg-strata-steel/30">Tab</kbd> Navigate between links</p>
                <p><kbd className="px-1 py-0.5 rounded bg-strata-steel/30">Enter</kbd> Activate link</p>
                <p><kbd className="px-1 py-0.5 rounded bg-strata-steel/30">Esc</kbd> Close navigation</p>
              </div>
            </div>
          </footer>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

// Standalone accessible sitemap page component
export const SiteMapPage = () => {
  // Only show public items in sitemap
  const mainItems = navItems.filter(item => item.category === "main" && item.isPublic !== false);
  const industryItems = navItems.filter(item => item.category === "industry" && item.isPublic !== false);
  const toolsItems = navItems.filter(item => item.category === "tools" && item.isPublic !== false);
  const systemItems = navItems.filter(item => item.category === "system" && item.isPublic !== false);

  return (
    <main 
      id="main-content"
      className="min-h-screen bg-background p-8"
      role="main"
    >
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="font-instrument text-4xl text-strata-white mb-2">
            Site Map
          </h1>
          <p className="text-strata-silver">
            Complete navigation structure for the Lavandar AI Operations Platform. 
            All pages are keyboard accessible.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <section aria-labelledby="sitemap-main-heading">
            <h2 
              id="sitemap-main-heading" 
              className="font-instrument text-xl text-strata-orange mb-4 flex items-center gap-2"
            >
              <Brain className="w-5 h-5" aria-hidden="true" />
              Command Centers
            </h2>
            <ul className="space-y-3" role="list">
              {mainItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className="flex items-start gap-3 p-3 rounded-lg bg-strata-charcoal/50 hover:bg-strata-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-strata-orange"
                    aria-label={`${item.label}: ${item.description}`}
                  >
                    <item.icon className="w-5 h-5 text-strata-orange mt-0.5" aria-hidden="true" />
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

          <section aria-labelledby="sitemap-industry-heading">
            <h2 
              id="sitemap-industry-heading" 
              className="font-instrument text-xl text-strata-cyan mb-4 flex items-center gap-2"
            >
              <Activity className="w-5 h-5" aria-hidden="true" />
              Industry Verticals
            </h2>
            <ul className="space-y-3" role="list">
              {industryItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className="flex items-start gap-3 p-3 rounded-lg bg-strata-charcoal/50 hover:bg-strata-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-strata-cyan"
                    aria-label={`${item.label}: ${item.description}`}
                  >
                    <item.icon className="w-5 h-5 text-strata-cyan mt-0.5" aria-hidden="true" />
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

          {/* Tools - only show if there are public tools */}
          {toolsItems.length > 0 && (
            <section aria-labelledby="sitemap-tools-heading">
              <h2 
                id="sitemap-tools-heading" 
                className="font-instrument text-xl text-purple-400 mb-4 flex items-center gap-2"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
                Tools
              </h2>
              <ul className="space-y-3" role="list">
                {toolsItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path}
                      className="flex items-start gap-3 p-3 rounded-lg bg-strata-charcoal/50 hover:bg-strata-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                      aria-label={`${item.label}: ${item.description}`}
                    >
                      <item.icon className="w-5 h-5 text-purple-400 mt-0.5" aria-hidden="true" />
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
          )}

          <section aria-labelledby="sitemap-system-heading">
            <h2 
              id="sitemap-system-heading" 
              className="font-instrument text-xl text-strata-lume mb-4 flex items-center gap-2"
            >
              <ScrollText className="w-5 h-5" aria-hidden="true" />
              System
            </h2>
            <ul className="space-y-3" role="list">
              {systemItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className="flex items-start gap-3 p-3 rounded-lg bg-strata-charcoal/50 hover:bg-strata-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-strata-lume"
                    aria-label={`${item.label}: ${item.description}`}
                  >
                    <item.icon className="w-5 h-5 text-strata-lume mt-0.5" aria-hidden="true" />
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

        {/* Accessibility Statement */}
        <section 
          aria-labelledby="accessibility-heading"
          className="mt-12 p-6 rounded-lg bg-strata-charcoal/30 border border-strata-steel/20"
        >
          <h2 id="accessibility-heading" className="font-instrument text-lg text-strata-white mb-3 flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-strata-orange" aria-hidden="true" />
            Accessibility Features
          </h2>
          <ul className="grid md:grid-cols-2 gap-4 text-sm text-strata-silver/70">
            <li className="flex items-start gap-2">
              <span className="text-strata-lume">✓</span>
              Full keyboard navigation support
            </li>
            <li className="flex items-start gap-2">
              <span className="text-strata-lume">✓</span>
              ARIA landmarks and labels
            </li>
            <li className="flex items-start gap-2">
              <span className="text-strata-lume">✓</span>
              Focus indicators on all interactive elements
            </li>
            <li className="flex items-start gap-2">
              <span className="text-strata-lume">✓</span>
              Skip links for main content
            </li>
            <li className="flex items-start gap-2">
              <span className="text-strata-lume">✓</span>
              Semantic HTML structure
            </li>
            <li className="flex items-start gap-2">
              <span className="text-strata-lume">✓</span>
              Screen reader optimized
            </li>
          </ul>
        </section>

        <footer className="mt-12 pt-6 border-t border-strata-steel/20 text-center">
          <p className="text-sm text-strata-silver/60">
            Lavandar AI Operations Platform • WCAG 2.1 AA Compliant
          </p>
        </footer>
      </div>
    </main>
  );
};

export default SiteNavigation;
