import { useState } from "react";
import { Check, Copy, ExternalLink, Lightbulb, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

interface ArchivedIdea {
  title: string;
  date: string;
  items: string[];
}

const archivedIdeas: ArchivedIdea[] = [
  {
    title: "Platform Architecture",
    date: "Mar 11",
    items: [
      "Stability robustness",
      "Modularity—Multiple resources",
      "API's, XBlocks mobile views",
      "Studio usability",
    ],
  },
  {
    title: "Product Concepts",
    date: "Jan 26",
    items: [
      "iCard—synch your native card that allows you to share with others",
      "Codeconnect: Jobs pipeline for Highschool",
      "Class finder",
    ],
  },
  {
    title: "EdTech & Self-Organization",
    date: "Dec 11",
    items: [
      "Learners self organize",
      "Owning self and presence on the web",
      "Narration of what has been done",
      "Twitter persistence",
      "George Siemens, Jim Groom",
      "Buy your own domain",
      "Ds106: Build your own domain digital story telling",
      "Build a resource beyond class",
      "Where does student live?",
      "Social network theory in educational settings",
    ],
  },
  {
    title: "Faculty & Learning Networks",
    date: "Dec 11",
    items: [
      "What do faculty interactions look like? Reciprocation?",
      "Tumblr, Reddit, Digital student",
      "Pathway to online learning",
      "ERGM for network analysis",
      "How do we group into smaller discussions?",
      "Prompted screenings",
      "Content places",
      "Profile photo",
      "Sean Lipp, Zack Pardos",
    ],
  },
  {
    title: "Course Design Philosophy",
    date: "Dec 11",
    items: [
      "Change jobs every 4 years",
      "Mixing course types",
      "Hybrid, Blended, adaptive, experiential, student centered, competency based reduces cost curve",
      "Marginal revolution university",
      "Commodity versus innovation",
    ],
  },
  {
    title: "Academic Experience",
    date: "Dec 11",
    items: [
      "Faculty as mentors",
      "Undergrad research",
      "Cross-cultural experience",
      "Risk, creativity, fail",
      "Structured pathways through multiple institutions",
      "One transcript, multiple places",
      "Value: Tracking through a career",
      "Certify experiences",
      "Credentialing",
    ],
  },
  {
    title: "Intelligent Tutoring",
    date: "Dec 11",
    items: [
      "Symbolic wrong answer correction",
      "Why should I take this course?",
      "Function generators, graders",
      "Reuse of resources—Gart Courtneyer rearrange reuse at every level of granularity",
      "Recommender engine—Prichard paper",
      "Indirect crowd sourcing",
      "Spontaneous commenting on problems—human reviewed",
      "Collect and mine",
      "Economical specific wrong answer response. Display to authors. A 3 part problem 1 hour or less",
    ],
  },
  {
    title: "Learning Analytics",
    date: "Dec 11",
    items: [
      "What utilization will help you—Felix and Carlos",
      "Context of data—hw, quiz, test",
      "Scripts: Add affect of students",
      "Visualizer—what is student doing now",
      "Education researchers classify as asking, letting off steam, answer, swooshing—simply guessing",
    ],
  },
];

const linkCategories: LinkCategory[] = [
  {
    title: "Platform Overview",
    links: [
      { label: "Platform Home", path: "/", description: "Main landing page" },
      { label: "Executive Summary", path: "/vc", description: "Investor overview" },
      { label: "Acquisition Pitch", path: "/acquisition-pitch", description: "Strategic acquisition deck" },
      { label: "Hacker News Post", path: "/hn", description: "Paul Graham-style essay on building with Lovable" },
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
  {
    title: "CEO & Outreach",
    links: [
      { label: "CEO Open Letter", path: "/ceo-letter", description: "Letter to the Lovable team" },
      { label: "LinkedIn CEO Page", path: "/linkedin-ceo", description: "Executive presence and enterprise philosophy" },
      { label: "Battle Cards", path: "/battle-cards", description: "Competitive intelligence cheat sheets for EliseAI & Monogoto" },
    ],
  },
  {
    title: "External Demos",
    links: [
      { label: "Strata NFL War Room", path: "https://sunshine-sync-tool.lovable.app/strata", description: "Real-time stadium operations analytics" },
      { label: "Beena RR3 Auditor", path: "https://sunshine-sync-tool.lovable.app/beena-rr3", description: "AI-powered compliance auditing" },
      { label: "Aerospace Defense Grid", path: "https://sunshine-sync-tool.lovable.app/aerospace", description: "Defense-grade situational awareness" },
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
        <Check className="h-4 w-4 text-emerald-500" />
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
                {category.links.map((link) => {
                  const isExternal = link.path.startsWith('http');
                  const fullUrl = isExternal ? link.path : `${BASE_URL}${link.path}`;
                  
                  return (
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
                            href={isExternal ? link.path : link.path}
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
                        <code className="text-xs text-muted-foreground hidden sm:block truncate max-w-[200px]">
                          {fullUrl}
                        </code>
                        <CopyButton
                          text={fullUrl}
                          label={link.label}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Idea Archive Section */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <Archive className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Idea Archive</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Historical insights, product concepts, and research notes from the founder's archive.
          </p>
          
          <Accordion type="multiple" className="space-y-3">
            {archivedIdeas.map((idea, index) => (
              <AccordionItem 
                key={index} 
                value={`idea-${index}`}
                className="border border-border rounded-lg px-4 bg-card"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span className="font-medium text-foreground">{idea.title}</span>
                    <span className="text-xs text-muted-foreground">{idea.date}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pl-7">
                    {idea.items.map((item, itemIndex) => (
                      <li 
                        key={itemIndex}
                        className="text-sm text-muted-foreground list-disc marker:text-primary"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ShareableLinks;
