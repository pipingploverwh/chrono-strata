import { Link } from "react-router-dom";
import { 
  Gauge, 
  Plane, 
  Anchor, 
  HardHat, 
  CalendarDays,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  ShoppingBag,
  Beaker,
  Users
} from "lucide-react";
import lavandarLogo from "@/assets/lavandar-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Company & Learn links
  const companyLinks = [
    { path: "/about", label: "About Us" },
    { path: "/features", label: "All Features" },
    { path: "/careers", label: "Careers" },
    { path: "/investor-hub", label: "Investors" },
  ];

  // Main navigation links
  const mainLinks = [
    { path: "/", label: "Home" },
    { path: "/launch", label: "Platform Launch" },
    { path: "/sitemap", label: "Site Map" },
    { path: "/links", label: "Quick Links" },
  ];

  // Products links
  const productLinks = [
    { path: "/shop", label: "Equipment Shop" },
    { path: "/strata", label: "STRATA Shell" },
    { path: "/kids", label: "Kids Collection" },
    { path: "/dj-table", label: "DJ Table" },
  ];

  // Industry verticals
  const industryLinks = [
    { path: "/aviation", label: "Aviation", icon: Plane },
    { path: "/marine", label: "Marine", icon: Anchor },
    { path: "/construction", label: "Construction", icon: HardHat },
    { path: "/events", label: "Events", icon: CalendarDays },
  ];

  // Intelligence & Tools
  const toolsLinks = [
    { path: "/weather-showcase", label: "Weather Dashboard" },
    { path: "/compliance-hub", label: "Compliance Hub" },
    { path: "/briefing", label: "Briefing Cards" },
    { path: "/ai", label: "AI Showcase" },
  ];

  // Development links
  const labsLinks = [
    { path: "/sprint", label: "Sprint Dashboard" },
    { path: "/roadmap/b2c", label: "B2C Roadmap" },
    { path: "/roadmap/b2b", label: "B2B Roadmap" },
    { path: "/beena", label: "Beena Analysis" },
  ];

  return (
    <footer className="bg-background border-t border-border" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content - 6 columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Gauge className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-instrument text-xl font-bold text-foreground tracking-wide">
                  LAVANDAR
                </h2>
                <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
                  Operations Intelligence
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Precision operations platform delivering real-time intelligence across weather, compliance, and enterprise verticals.
            </p>
            
            {/* Lavandar AI Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
              <img src={lavandarLogo} alt="Lavandar AI" className="w-8 h-8 rounded" />
              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  Powered by
                </div>
                <div className="text-sm font-semibold text-foreground">
                  Lavandar AI
                </div>
              </div>
            </div>
          </div>

          {/* Company Column */}
          <nav aria-label="Footer navigation - Company">
            <h3 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" />
              Company
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Products Column */}
          <nav aria-label="Footer navigation - Products">
            <h3 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <ShoppingBag className="w-3 h-3" />
              Products
            </h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Industry Column */}
          <nav aria-label="Footer navigation - Industry">
            <h3 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Users className="w-3 h-3" />
              Industries
            </h3>
            <ul className="space-y-2">
              {industryLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                  >
                    <link.icon className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Labs Column */}
          <nav aria-label="Footer navigation - Labs">
            <h3 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Beaker className="w-3 h-3" />
              Labs
            </h3>
            <ul className="space-y-2">
              {labsLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Secondary Links Row */}
        <div className="flex flex-wrap justify-center gap-4 py-6 border-t border-border/50 mb-8">
          {mainLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <span className="text-border">|</span>
          {toolsLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Contact Row */}
        <div className="grid sm:grid-cols-3 gap-6 py-8 border-t border-border/50">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Built in Woods Hole</p>
              <p className="text-xs text-muted-foreground">by Piping Plover</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
            <a 
              href="tel:+15084571776" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              (508) 457-1776
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <a 
              href="mailto:admin@lavandar.ai" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              admin@lavandar.ai
            </a>
          </div>
        </div>

        {/* Accessibility Statement */}
        <div className="border-t border-border/50 pt-8 mb-8">
          <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-lg" role="img" aria-label="Accessibility">♿</span>
              Accessibility Statement
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              LAVANDAR Operations Platform is committed to ensuring digital accessibility for people with disabilities. 
              We continually improve the user experience for everyone and apply relevant accessibility standards.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[11px] font-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>WCAG 2.1 AA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Keyboard Navigable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Screen Reader Compatible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>High Contrast Support</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground/70 mt-4">
              If you encounter any accessibility barriers, please contact us at{" "}
              <a href="mailto:admin@lavandar.ai" className="text-primary hover:underline">
                admin@lavandar.ai
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/50">
          <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            <span>© {currentYear} Lavandar AI</span>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Use</a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-foreground transition-colors">Security</a>
          </div>
          
          <div className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground/60">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>All Systems Operational</span>
            <span>•</span>
            <span>v2.4.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
