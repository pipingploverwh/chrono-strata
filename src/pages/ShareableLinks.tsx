import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const BASE_URL = "https://chrono-strata.lovable.app";

interface LinkItem {
  label: string;
  path: string;
  description: string;
}

interface LinkCategory {
  title: string;
  links: LinkItem[];
}

const linkCategories: LinkCategory[] = [
  {
    title: "Platform Overview",
    links: [
      { label: "Platform Home", path: "/", description: "Main landing page" },
      { label: "Executive Summary", path: "/vc", description: "Investor overview" },
      { label: "Acquisition Pitch", path: "/acquisition-pitch", description: "Strategic acquisition deck" },
    ],
  },
  {
    title: "Weather Intelligence",
    links: [
      { label: "Weather Showcase", path: "/weather-showcase", description: "Core weather capabilities" },
      { label: "Weather Intelligence", path: "/weather-intelligence", description: "Advanced analytics dashboard" },
    ],
  },
  {
    title: "Industry Solutions",
    links: [
      { label: "STRATA Command", path: "/strata", description: "Unified operations center" },
      { label: "Aviation Operations", path: "/strata/aviation", description: "Flight planning intelligence" },
      { label: "Marine Operations", path: "/strata/marine", description: "Maritime weather routing" },
      { label: "Construction", path: "/strata/construction", description: "Site weather management" },
      { label: "Events", path: "/strata/events", description: "Venue weather planning" },
    ],
  },
  {
    title: "Case Studies",
    links: [
      { label: "Kraft Stadium Study", path: "/kraft-case-study", description: "NFL operations integration" },
      { label: "AI Harmony", path: "/ai-harmony", description: "AI-powered decision engine" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Startup Visa Tracker", path: "/startup-visa", description: "Immigration process management" },
    ],
  },
];

const CopyButton = ({ text, label }: { text: string; label: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`Copied ${label} link`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className="h-8 w-8 shrink-0"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
};

const ShareableLinks = () => {
  const copyAllLinks = async () => {
    const allLinks = linkCategories
      .map((category) => {
        const categoryLinks = category.links
          .map((link) => `${link.label}: ${BASE_URL}${link.path}`)
          .join("\n");
        return `${category.title}\n${categoryLinks}`;
      })
      .join("\n\n");

    await navigator.clipboard.writeText(allLinks);
    toast.success("All links copied to clipboard");
  };

  const copyLinkedInFormat = async () => {
    const linkedInText = `LAVANDAR Tech Platform

Real-time meteorological intelligence converted into operational decisions.

Platform Overview
${BASE_URL}

Executive Summary
${BASE_URL}/vc

Weather Intelligence Dashboard
${BASE_URL}/weather-intelligence

STRATA Command Center
${BASE_URL}/strata

Industry Operations
Aviation: ${BASE_URL}/strata/aviation
Marine: ${BASE_URL}/strata/marine
Construction: ${BASE_URL}/strata/construction
Events: ${BASE_URL}/strata/events

NFL Stadium Case Study
${BASE_URL}/kraft-case-study

#WeatherTech #PredictiveAnalytics #EnterpriseAI #OperationalIntelligence`;

    await navigator.clipboard.writeText(linkedInText);
    toast.success("LinkedIn format copied");
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            LAVANDAR Platform Links
          </h1>
          <p className="text-muted-foreground">
            Quick access to all platform demonstrations and resources.
          </p>
        </div>

        <div className="flex gap-3 mb-8">
          <Button onClick={copyAllLinks} variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Copy All Links
          </Button>
          <Button onClick={copyLinkedInFormat} variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            LinkedIn Format
          </Button>
        </div>

        <div className="space-y-6">
          {linkCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {category.links.map((link) => (
                  <div
                    key={link.path}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {link.label}
                        </span>
                        <a
                          href={link.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {link.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <code className="text-xs text-muted-foreground hidden sm:block">
                        {BASE_URL}{link.path}
                      </code>
                      <CopyButton
                        text={`${BASE_URL}${link.path}`}
                        label={link.label}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareableLinks;
