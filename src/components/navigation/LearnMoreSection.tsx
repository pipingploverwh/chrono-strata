import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";

interface LearnMoreLink {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
}

interface LearnMoreSectionProps {
  title?: string;
  subtitle?: string;
  links: LearnMoreLink[];
  variant?: 'default' | 'compact' | 'inline';
}

export const LearnMoreSection = ({ 
  title = "Learn More", 
  subtitle,
  links,
  variant = 'default'
}: LearnMoreSectionProps) => {
  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="text-muted-foreground flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          Learn more:
        </span>
        {links.map((link, index) => (
          <span key={link.href} className="flex items-center gap-2">
            {link.external ? (
              <a 
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 hover:underline transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link 
                to={link.href}
                className="text-primary hover:text-primary/80 hover:underline transition-colors"
              >
                {link.label}
              </Link>
            )}
            {index < links.length - 1 && <span className="text-border">•</span>}
          </span>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
        <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          {title}
        </p>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-background text-foreground rounded-full border border-border/50 hover:border-primary/50 hover:text-primary transition-colors"
              >
                {link.label}
                <ArrowRight className="w-3 h-3" />
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-background text-foreground rounded-full border border-border/50 hover:border-primary/50 hover:text-primary transition-colors"
              >
                {link.label}
                <ArrowRight className="w-3 h-3" />
              </Link>
            )
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 px-6 border-t border-border/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-foreground flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => (
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-4 bg-muted/20 hover:bg-muted/40 rounded-xl border border-border/50 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {link.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                {link.description && (
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                )}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className="group block p-4 bg-muted/20 hover:bg-muted/40 rounded-xl border border-border/50 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {link.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                {link.description && (
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                )}
              </Link>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearnMoreSection;
