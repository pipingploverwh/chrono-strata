import { Link } from "react-router-dom";
import { Home, BookOpen, ArrowLeft, HelpCircle } from "lucide-react";

interface ExploreEscapeRoutesProps {
  variant?: 'banner' | 'sidebar' | 'inline';
  showBackButton?: boolean;
  customBackLink?: string;
  customBackLabel?: string;
}

export const ExploreEscapeRoutes = ({ 
  variant = 'banner',
  showBackButton = true,
  customBackLink,
  customBackLabel
}: ExploreEscapeRoutesProps) => {
  const routes = [
    { 
      icon: Home, 
      label: "Back to Home", 
      href: "/", 
      description: "Return to the main page" 
    },
    { 
      icon: BookOpen, 
      label: "Explore Features", 
      href: "/features", 
      description: "Learn about our capabilities" 
    },
    { 
      icon: HelpCircle, 
      label: "About Us", 
      href: "/about", 
      description: "Our mission and values" 
    },
  ];

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm py-4">
        {showBackButton && customBackLink && (
          <Link 
            to={customBackLink}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {customBackLabel || "Go Back"}
          </Link>
        )}
        <span className="text-border">|</span>
        {routes.slice(0, 2).map((route) => (
          <Link
            key={route.href}
            to={route.href}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <route.icon className="w-4 h-4" />
            {route.label}
          </Link>
        ))}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="bg-muted/20 rounded-xl p-5 border border-border/50">
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
          Not ready to proceed?
        </p>
        <div className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <route.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                {route.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Default: banner variant
  return (
    <div className="bg-muted/10 border-t border-border/50 py-6 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Not ready to proceed? Take your time to explore.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {routes.map((route) => (
              <Link
                key={route.href}
                to={route.href}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-background hover:bg-muted/50 rounded-lg border border-border/50 transition-colors"
              >
                <route.icon className="w-4 h-4" />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreEscapeRoutes;
