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
  MapPin
} from "lucide-react";
import lavandarLogo from "@/assets/lavandar-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const mainLinks = [
    { path: "/", label: "Home" },
    { path: "/strata", label: "STRATA Instrument" },
    { path: "/launch", label: "Launch" },
    { path: "/logs", label: "System Logs" },
  ];

  const industryLinks = [
    { path: "/aviation", label: "Aviation", icon: Plane },
    { path: "/marine", label: "Marine", icon: Anchor },
    { path: "/construction", label: "Construction", icon: HardHat },
    { path: "/events", label: "Events", icon: CalendarDays },
  ];

  return (
    <footer className="bg-strata-black border-t border-strata-steel/20" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-strata-orange flex items-center justify-center">
                <Gauge className="w-5 h-5 text-strata-white" />
              </div>
              <div>
                <h2 className="font-instrument text-xl font-bold text-strata-white tracking-wide">
                  STRATA
                </h2>
                <p className="text-[9px] font-mono text-strata-silver/50 uppercase tracking-widest">
                  Weather Intelligence
                </p>
              </div>
            </div>
            <p className="text-sm text-strata-silver/70 mb-4 leading-relaxed">
              Precision atmospheric monitoring delivering time-critical weather intelligence through a professional instrument aesthetic.
            </p>
            
            {/* Lavandar AI Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-950/30 border border-purple-400/20">
              <img src={lavandarLogo} alt="Lavandar AI" className="w-8 h-8 rounded" />
              <div>
                <div className="text-[10px] font-mono text-purple-300/60 uppercase tracking-wider">
                  Powered by
                </div>
                <div className="text-sm font-semibold text-purple-200">
                  Lavandar AI
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <nav aria-label="Footer navigation - Main">
            <h3 className="text-[10px] font-mono text-strata-orange uppercase tracking-widest mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {mainLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-strata-silver hover:text-strata-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/sitemap"
                  className="text-sm text-strata-silver hover:text-strata-white transition-colors inline-flex items-center gap-1"
                >
                  Full Sitemap
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </nav>

          {/* Industry Verticals Column */}
          <nav aria-label="Footer navigation - Industry">
            <h3 className="text-[10px] font-mono text-strata-cyan uppercase tracking-widest mb-4">
              Industry Solutions
            </h3>
            <ul className="space-y-2">
              {industryLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-strata-silver hover:text-strata-white transition-colors inline-flex items-center gap-2"
                  >
                    <link.icon className="w-3.5 h-3.5 text-strata-silver/60" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Column */}
          <div>
            <h3 className="text-[10px] font-mono text-strata-lume uppercase tracking-widest mb-4">
              Enterprise Support
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-strata-silver/60 mt-0.5 shrink-0" />
                <span className="text-sm text-strata-silver">
                  Built in Woods Hole<br />
                  by Piping Plover
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-strata-silver/60 shrink-0" />
                <a 
                  href="tel:+15084571776" 
                  className="text-sm text-strata-silver hover:text-strata-white transition-colors"
                >
                  (508) 457-1776
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-strata-silver/60 shrink-0" />
                <a 
                  href="mailto:admin@lavandar.ai" 
                  className="text-sm text-strata-silver hover:text-strata-white transition-colors"
                >
                  admin@lavandar.ai
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Accessibility Statement */}
        <div className="border-t border-strata-steel/20 pt-8 mb-8">
          <div className="bg-strata-charcoal/50 rounded-lg p-6 border border-strata-steel/20">
            <h3 className="text-sm font-semibold text-strata-white mb-3 flex items-center gap-2">
              <span className="text-lg" role="img" aria-label="Accessibility">♿</span>
              Accessibility Statement
            </h3>
            <p className="text-sm text-strata-silver/80 leading-relaxed mb-4">
              STRATA Weather Intelligence Platform is committed to ensuring digital accessibility for people with disabilities. 
              We continually improve the user experience for everyone and apply the relevant accessibility standards.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[11px] font-mono text-strata-silver/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-strata-lume" />
                <span>WCAG 2.1 AA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-strata-lume" />
                <span>Keyboard Navigable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-strata-lume" />
                <span>Screen Reader Compatible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-strata-lume" />
                <span>High Contrast Support</span>
              </div>
            </div>
            <p className="text-[11px] text-strata-silver/50 mt-4">
              If you encounter any accessibility barriers, please contact us at{" "}
              <a href="mailto:admin@lavandar.ai" className="text-strata-orange hover:underline">
                admin@lavandar.ai
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-strata-steel/20">
          <div className="flex items-center gap-6 text-[10px] font-mono text-strata-silver/50 uppercase tracking-wider">
            <span>© {currentYear} Lavandar AI</span>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-strata-silver transition-colors">Privacy Policy</a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-strata-silver transition-colors">Terms of Use</a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-strata-silver transition-colors">Security</a>
          </div>
          
          <div className="flex items-center gap-2 text-[9px] font-mono text-strata-silver/40">
            <div className="w-1.5 h-1.5 rounded-full bg-strata-lume animate-pulse" />
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
