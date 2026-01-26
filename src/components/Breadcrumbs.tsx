import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path: string;
}

// Comprehensive route labels for SERP continuity
const routeLabels: Record<string, string> = {
  // Core pages
  "/": "Home",
  "/about": "About",
  "/features": "Features",
  "/launch": "Location Select",
  "/sitemap": "Site Map",
  "/auth": "Sign In",
  
  // Products & Shop
  "/shop": "Equipment Shop",
  "/shop-success": "Order Complete",
  "/strata": "STRATA Shell",
  "/strata-instrument": "STRATA Instrument",
  "/kids": "Kids Collection",
  "/kids-collection": "Junior Explorer",
  "/kids-bundle-success": "Bundle Complete",
  "/dj-table": "DJ Table",
  "/apex-1": "APEX-1",
  "/apparel-blueprint": "Apparel Blueprint",
  
  // Industry Verticals
  "/aviation": "Aviation Command",
  "/marine": "Marine Operations",
  "/construction": "Construction Planning",
  "/events": "Event Management",
  
  // Intelligence & Tools
  "/weather-showcase": "Weather Dashboard",
  "/weather-history": "Weather Archive",
  "/weather-intelligence": "Weather Intelligence",
  "/northeast": "Northeast Weather",
  "/forecast": "Economic Forecast",
  "/briefing": "Briefing Cards",
  "/briefing/bookmarks": "Saved Briefings",
  "/ai": "AI Showcase",
  "/beena": "Beena Analysis",
  
  // Compliance & Business
  "/compliance-hub": "Compliance Hub",
  "/meetingflow": "MeetingFlow",
  "/investor-hub": "Investor Hub",
  "/pilot": "Pilot Program",
  
  // Executive & Marketing
  "/exec": "Executive Summary",
  "/summary": "Project Summary",
  "/vc": "VC Summary",
  "/hn": "Hacker News Post",
  "/ceo-letter": "CEO Letter",
  "/battle-cards": "Battle Cards",
  "/links": "Shareable Links",
  
  // Labs & Development
  "/labs": "Development Labs",
  "/roadmap/b2c": "B2C Roadmap",
  "/roadmap/b2b": "B2B Roadmap",
  "/validation-report": "Validation Report",
  
  // Careers & Company
  "/careers": "Careers",
  "/linkedin-company": "Company Profile",
  "/linkedin-ceo": "CEO Profile",
  
  // Admin & System
  "/logs": "System Logs",
  "/coordinate-logs": "Coordinate Logs",
  "/admin": "Admin Dashboard",
  
  // Checkout flows
  "/allocation-checkout": "Checkout",
  "/allocation-success": "Allocation Complete",
  "/allocation-canceled": "Allocation Canceled",
  
  // Other
  "/thermal": "Thermal Visualizer",
  "/thermal-slash": "DJ KREMBO",
  "/cannabis": "Cannabis Directory",
  "/chrono-strata": "Chrono-Strata Club",
  "/plover-admin": "Plover Admin",
  "/ocean-reallocation": "Ocean Reallocation",
  "/for-moran": "Platform Tour",
  "/event": "Event Page",
};

// Parent category mapping for hierarchical breadcrumbs
const parentRoutes: Record<string, { label: string; path: string }> = {
  "/aviation": { label: "Features", path: "/features" },
  "/marine": { label: "Features", path: "/features" },
  "/construction": { label: "Features", path: "/features" },
  "/events": { label: "Features", path: "/features" },
  "/shop": { label: "Products", path: "/features" },
  "/kids": { label: "Products", path: "/shop" },
  "/kids-collection": { label: "Kids", path: "/kids" },
  "/dj-table": { label: "Products", path: "/features" },
  "/apex-1": { label: "Products", path: "/features" },
  "/roadmap/b2c": { label: "Labs", path: "/labs" },
  "/roadmap/b2b": { label: "Labs", path: "/labs" },
  "/briefing/bookmarks": { label: "Briefing", path: "/briefing" },
  "/allocation-checkout": { label: "Shop", path: "/shop" },
  "/allocation-success": { label: "Checkout", path: "/allocation-checkout" },
  "/allocation-canceled": { label: "Checkout", path: "/allocation-checkout" },
  "/shop-success": { label: "Shop", path: "/shop" },
  "/kids-bundle-success": { label: "Kids", path: "/kids" },
  "/weather-history": { label: "Weather", path: "/weather-showcase" },
  "/weather-intelligence": { label: "Weather", path: "/weather-showcase" },
  "/beena": { label: "Labs", path: "/labs" },
};

const Breadcrumbs = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Build breadcrumb items with hierarchy
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", path: "/" }
  ];
  
  if (currentPath !== "/") {
    // Check if there's a parent route
    const parent = parentRoutes[currentPath];
    if (parent) {
      breadcrumbs.push({ label: parent.label, path: parent.path });
    }
    
    // Add current page
    const currentLabel = routeLabels[currentPath] || 
      currentPath.split("/").filter(Boolean).pop()?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || 
      "Page";
    breadcrumbs.push({ label: currentLabel, path: currentPath });
  }

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="flex items-center gap-2 text-sm mb-4"
    >
      <ol className="flex items-center gap-2 flex-wrap" role="list">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={`${item.path}-${index}`} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight 
                  className="w-3 h-3 text-muted-foreground/40" 
                  aria-hidden="true" 
                />
              )}
              {isLast ? (
                <span 
                  className="text-muted-foreground font-mono text-xs"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center gap-1 text-muted-foreground/80 hover:text-primary transition-colors font-mono text-xs"
                >
                  {index === 0 && <Home className="w-3 h-3" aria-hidden="true" />}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
