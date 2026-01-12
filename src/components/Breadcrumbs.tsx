import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path: string;
}

const routeLabels: Record<string, string> = {
  "/": "Operations Console",
  "/patriot-way": "Patriot Way",
  "/patriots-evaluation": "Game Intel",
  "/strata": "STRATA Instrument",
  "/strata-aviation": "Aviation",
  "/strata-marine": "Marine",
  "/strata-construction": "Construction",
  "/strata-events": "Events",
  "/launch": "Location Select",
  "/logs": "System Logs",
  "/sitemap": "Site Map",
  "/validation-report": "Validation Report",
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  // Build breadcrumb items
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", path: "/" }
  ];
  
  if (location.pathname !== "/") {
    const currentLabel = routeLabels[location.pathname] || pathSegments[pathSegments.length - 1];
    breadcrumbs.push({ label: currentLabel, path: location.pathname });
  }

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="flex items-center gap-2 text-sm"
    >
      <ol className="flex items-center gap-2" role="list">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight 
                  className="w-3 h-3 text-strata-silver/40" 
                  aria-hidden="true" 
                />
              )}
              {isLast ? (
                <span 
                  className="text-strata-silver/60 font-mono text-xs"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center gap-1 text-strata-silver/80 hover:text-strata-orange transition-colors font-mono text-xs"
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
