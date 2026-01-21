import { ArrowLeft, ExternalLink, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const CEOLetter = () => {
  const externalDemos = [
    {
      label: "Strata NFL War Room",
      url: "https://sunshine-sync-tool.lovable.app/strata",
      description: "Real-time stadium operations analytics"
    },
    {
      label: "Beena RR3 Auditor",
      url: "https://sunshine-sync-tool.lovable.app/beena-rr3",
      description: "AI-powered compliance auditing"
    },
    {
      label: "Aerospace Defense Grid",
      url: "https://sunshine-sync-tool.lovable.app/aerospace",
      description: "Defense-grade situational awareness"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Platform
          </Link>
          <span className="text-xs text-muted-foreground font-mono">
            LAVANDAR // CEO COMMUNIQUÉ
          </span>
        </div>
      </header>

      {/* Letter content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <article className="space-y-8">
          {/* Letter header */}
          <div className="space-y-4 border-b border-border pb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-medium text-foreground">
                  Open Letter to the Lovable Team
                </h1>
                <p className="text-sm text-muted-foreground">
                  From the Office of the CEO
                </p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              January 2026 • San Francisco
            </div>
          </div>

          {/* Letter body */}
          <div className="prose prose-sm max-w-none text-foreground space-y-6">
            <p className="text-muted-foreground">
              Hi Lovable team,
            </p>

            <p>
              I wanted to personally share how we're using Lovable to push the 
              boundaries of what AI-native products can look like in production.
            </p>

            <p>
              What excites us most is a core architectural shift:{" "}
              <strong className="text-primary">
                business logic lives in tools, not prompts.
              </strong>{" "}
              By pairing a stateless UI with server-side reasoning, we're able 
              to move faster, stay more reliable, and build systems that actually 
              scale beyond demos.
            </p>

            <div className="my-8 p-6 bg-muted/50 border border-border rounded-lg">
              <h3 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">
                Live Demos
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-background border border-border rounded-lg">
                  <a
                    href="https://preview--chrono-strata.lovable.app/shop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    Shop Live
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    STRATA Shell adaptive apparel configurator
                  </p>
                </div>

                {externalDemos.map((demo) => (
                  <div key={demo.url} className="p-4 bg-background border border-border rounded-lg">
                    <a
                      href={demo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                    >
                      {demo.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">
                      {demo.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p>
              Each of these represents a real operational use case—analytics, 
              auditing, and defense—running on the same underlying philosophy:{" "}
              <em>tools as first-class citizens, not fragile prompt chains.</em>
            </p>

            <p>
              We see Lovable as a key platform for the next generation of serious 
              AI products, and we're excited to keep building publicly and pushing 
              what's possible together.
            </p>

            {/* Signature */}
            <div className="pt-8 border-t border-border mt-12">
              <p className="text-muted-foreground mb-4">Best regards,</p>
              <div className="space-y-1">
                <p className="font-medium text-foreground">Ben Rubin</p>
                <p className="text-sm text-muted-foreground">
                  Chief Executive Officer
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  LAVANDAR Technologies
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Footer links */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-4 text-sm">
            <Link 
              to="/hn" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Read our HN Essay →
            </Link>
            <Link 
              to="/vc" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Executive Summary →
            </Link>
            <Link 
              to="/linkedin-ceo" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              LinkedIn Profile →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CEOLetter;
