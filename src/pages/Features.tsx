import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Cloud, 
  Plane, 
  Ship, 
  HardHat, 
  FileCheck, 
  Brain,
  Map,
  Shield,
  BarChart3,
  Mic,
  Database
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { LearnMoreSection } from "@/components/navigation/LearnMoreSection";

const Features = () => {
  const featureCategories = [
    {
      title: "Weather Intelligence",
      description: "Real-time atmospheric monitoring with multi-source data integration",
      icon: Cloud,
      features: [
        "Live METAR and TAF parsing",
        "Multi-timezone world clock",
        "Historical weather archive",
        "Custom alert thresholds"
      ],
      link: "/weather-showcase",
      linkLabel: "View Weather Demo"
    },
    {
      title: "Aviation Command",
      description: "Professional flight briefing tools with TTS and automated calculations",
      icon: Plane,
      features: [
        "Flight rule determination (VFR/IFR)",
        "Voice briefing generation",
        "Altitude profile analysis",
        "Multi-airport dashboard"
      ],
      link: "/aviation",
      linkLabel: "Explore Aviation"
    },
    {
      title: "Marine Operations",
      description: "Coastal and offshore monitoring for maritime professionals",
      icon: Ship,
      features: [
        "NOAA marine forecast integration",
        "Wave height and swell data",
        "Tide predictions",
        "Vessel tracking support"
      ],
      link: "/marine",
      linkLabel: "Explore Marine"
    },
    {
      title: "Construction Planning",
      description: "Weather-dependent scheduling and site safety monitoring",
      icon: HardHat,
      features: [
        "Workday suitability scoring",
        "Precipitation forecasting",
        "Wind speed alerts",
        "Multi-site management"
      ],
      link: "/construction",
      linkLabel: "Explore Construction"
    },
    {
      title: "Compliance Hub",
      description: "International shipment tracking and regulatory workflow management",
      icon: FileCheck,
      features: [
        "Multi-jurisdiction permits",
        "Document tracking",
        "Phase-based workflows",
        "Stakeholder management"
      ],
      link: "/compliance-hub",
      linkLabel: "View Compliance"
    },
    {
      title: "AI Intelligence",
      description: "Multi-model gateway for document analysis and insights",
      icon: Brain,
      features: [
        "RAG document search",
        "Sentiment analysis",
        "Automated summarization",
        "Multi-language support"
      ],
      link: "/ai",
      linkLabel: "Explore AI"
    }
  ];

  const technicalCapabilities = [
    { icon: Database, label: "Supabase Backend", description: "PostgreSQL with real-time subscriptions" },
    { icon: Shield, label: "Row-Level Security", description: "Enterprise-grade data isolation" },
    { icon: BarChart3, label: "Analytics Dashboard", description: "Performance monitoring and insights" },
    { icon: Mic, label: "Voice Integration", description: "ElevenLabs TTS and speech recognition" },
    { icon: Map, label: "Geolocation", description: "IP-based and GPS coordinate tracking" },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-b from-muted/50 to-background border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Breadcrumbs />
          
          <div className="mt-12 max-w-3xl">
            <span className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-widest text-primary bg-primary/10 rounded-full mb-6">
              Platform Features
            </span>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-6">
              Everything You Need for Operational Excellence
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From real-time weather intelligence to compliance workflows, explore the full suite 
              of tools designed for enterprise-grade decision making.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 px-6 border-b border-border/50 bg-muted/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {featureCategories.map((cat) => (
              <a 
                key={cat.title}
                href={`#${cat.title.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-background rounded-full border border-border/50 hover:border-primary/50 transition-colors"
              >
                {cat.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          {featureCategories.map((category, index) => (
            <div 
              key={category.title} 
              id={category.title.toLowerCase().replace(' ', '-')}
              className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">{category.title}</h2>
                </div>
                <p className="text-muted-foreground mb-6">{category.description}</p>
                <ul className="space-y-2 mb-6">
                  {category.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={category.link}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {category.linkLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className={`bg-muted/30 rounded-2xl p-8 border border-border/50 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/20 rounded-lg flex items-center justify-center">
                  <category.icon className="w-16 h-16 text-primary/40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Capabilities */}
      <section className="py-16 px-6 bg-muted/20 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">Technical Foundation</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {technicalCapabilities.map((cap) => (
              <div key={cap.label} className="bg-background rounded-xl p-5 border border-border/50 text-center">
                <cap.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground text-sm mb-1">{cap.label}</h3>
                <p className="text-xs text-muted-foreground">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learn More */}
      <LearnMoreSection 
        title="Continue Exploring"
        links={[
          { label: "About LAVANDAR", href: "/about", description: "Our mission and values" },
          { label: "Development Labs", href: "/labs", description: "Experimental features and R&D" },
          { label: "Executive Summary", href: "/exec", description: "Platform overview for stakeholders" },
        ]}
      />

      {/* CTA */}
      <section className="py-16 px-6 bg-primary/5 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">See It In Action</h2>
          <p className="text-muted-foreground mb-8">
            Ready to explore the platform? Return to the homepage or dive into a specific vertical.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/launch"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Launch Platform
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Features;
