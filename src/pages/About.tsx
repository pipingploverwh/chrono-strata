import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Globe, Users, Award, Building2 } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { LearnMoreSection } from "@/components/navigation/LearnMoreSection";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Precision Engineering",
      description: "Every feature is built with meticulous attention to detail, ensuring reliability in mission-critical environments."
    },
    {
      icon: Zap,
      title: "Real-Time Intelligence",
      description: "Live data streams power our dashboards, delivering actionable insights when they matter most."
    },
    {
      icon: Globe,
      title: "Global Operations",
      description: "Multi-timezone support and localization for teams operating across international boundaries."
    },
    {
      icon: Users,
      title: "Human-Centered Design",
      description: "Interfaces designed for high-stress decision-making with clarity and accessibility at their core."
    }
  ];

  const milestones = [
    { year: "2024 Q1", event: "Platform Foundation", description: "Core STRATA instrument and weather intelligence system" },
    { year: "2024 Q2", event: "Aviation Command", description: "Real-time METAR briefings and flight rule calculations" },
    { year: "2024 Q3", event: "Compliance Hub", description: "International shipment tracking and regulatory workflows" },
    { year: "2024 Q4", event: "AI Integration", description: "Multi-model gateway for intelligent document analysis" },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-b from-muted/50 to-background border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Breadcrumbs />
          
          <div className="mt-12 max-w-3xl">
            <span className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-widest text-primary bg-primary/10 rounded-full mb-6">
              About LAVANDAR
            </span>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-6">
              Operations Intelligence for the Modern Enterprise
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              LAVANDAR is a comprehensive operations platform that synthesizes real-time weather intelligence, 
              compliance workflows, and strategic planning tools into a unified command interface.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We believe that operational excellence requires more than data—it requires intelligence. 
                Our platform transforms raw information streams into contextual insights that empower 
                decision-makers across aviation, marine, construction, and enterprise verticals.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Built on open standards and designed for scale, LAVANDAR serves as the operational 
                backbone for teams who can't afford to make decisions in the dark.
              </p>
            </div>
            <div className="bg-muted/30 rounded-2xl p-8 border border-border/50">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">12+</div>
                  <div className="text-sm text-muted-foreground">Edge Functions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">7</div>
                  <div className="text-sm text-muted-foreground">Database Tables</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">5</div>
                  <div className="text-sm text-muted-foreground">Industry Verticals</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Real-Time Data</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">Core Principles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-background rounded-xl p-6 border border-border/50">
                <value.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">Platform Evolution</h2>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="text-sm font-mono text-primary">{milestone.year}</span>
                </div>
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-primary mt-1" />
                  {index < milestones.length - 1 && (
                    <div className="absolute top-4 left-1 w-0.5 h-16 bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold text-foreground">{milestone.event}</h3>
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learn More */}
      <LearnMoreSection 
        title="Explore the Platform"
        links={[
          { label: "View All Features", href: "/features", description: "Detailed breakdown of platform capabilities" },
          { label: "Industry Solutions", href: "/aviation", description: "See how we serve aviation professionals" },
          { label: "Development Roadmap", href: "/roadmap/b2c", description: "What's coming next" },
        ]}
      />

      {/* CTA */}
      <section className="py-16 px-6 bg-primary/5 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Explore our features or return to the homepage to see the platform in action.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/features"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Explore Features
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

export default About;
