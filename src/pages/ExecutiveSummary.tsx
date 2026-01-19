import { Link } from "react-router-dom";
import { 
  TrendingUp, Shield, Zap, Globe, Users, DollarSign, 
  CheckCircle2, ArrowRight, Building2, Cloud, Brain
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ExecutiveSummary = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline" className="mb-2 text-xs">Executive Summary</Badge>
              <h1 className="text-3xl font-bold tracking-tight">LAVANDAR</h1>
              <p className="text-muted-foreground mt-1">Enterprise Weather Intelligence Platform</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Q1 2026</p>
              <p className="text-xs text-muted-foreground/60">Confidential</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-12 max-w-4xl">
        {/* Mission Statement */}
        <section className="text-center space-y-4 py-8">
          <h2 className="text-2xl font-semibold">
            Transforming atmospheric data into operational advantage
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            LAVANDAR delivers real-time weather intelligence and predictive analytics 
            to enterprise clients across marine, aviation, construction, and entertainment sectors.
          </p>
        </section>

        {/* Key Metrics */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "12", label: "Edge Functions", icon: Zap },
            { value: "7", label: "Database Tables", icon: Shield },
            { value: "5", label: "Industry Verticals", icon: Building2 },
            { value: "3", label: "AI Model Tiers", icon: Brain },
          ].map((metric) => (
            <Card key={metric.label} className="bg-card/50 border-border/50">
              <CardContent className="p-4 text-center">
                <metric.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Core Capabilities */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold border-b border-border/50 pb-2">
            Core Capabilities
          </h3>
          <div className="grid gap-4">
            {[
              {
                icon: Cloud,
                title: "Weather Intelligence",
                desc: "Real-time NOAA marine forecasts, geolocation-aware alerts, and predictive atmospheric modeling for operational decision-making."
              },
              {
                icon: Brain,
                title: "Multi-Model AI Gateway",
                desc: "Gemini 2.5/3 Pro and GPT-5 integration for document analysis, red team assessments, and natural language processing."
              },
              {
                icon: Shield,
                title: "Secure Allocation Protocol",
                desc: "Application-to-purchase workflow with buyer verification, serialized inventory tracking, and Stripe payment processing."
              },
            ].map((cap) => (
              <div key={cap.title} className="flex gap-4 p-4 rounded-lg bg-muted/20">
                <cap.icon className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">{cap.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Target Markets */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold border-b border-border/50 pb-2">
            Target Markets
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {["Marine Operations", "Aviation", "Construction", "Sports & Events", "Enterprise"].map((market) => (
              <div key={market} className="p-3 rounded-lg bg-muted/20 text-center">
                <p className="text-sm font-medium">{market}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Infrastructure */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold border-b border-border/50 pb-2">
            Technical Infrastructure
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Frontend</h4>
              <ul className="space-y-2">
                {["React 18.3 + TypeScript", "Vite build system", "Tailwind CSS + Framer Motion", "Three.js 3D visualization"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Backend</h4>
              <ul className="space-y-2">
                {["Lovable Cloud (PostgreSQL)", "Deno Edge Functions", "Stripe Payments", "Resend Transactional Email"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* External Integrations */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold border-b border-border/50 pb-2">
            External Integrations
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "NOAA Marine API", "ElevenLabs Audio", "Firecrawl Scraping", 
              "Stripe Payments", "Resend Email", "Lovable AI Gateway"
            ].map((int) => (
              <Badge key={int} variant="outline" className="text-xs">
                {int}
              </Badge>
            ))}
          </div>
        </section>

        {/* Competitive Advantages */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold border-b border-border/50 pb-2">
            Competitive Advantages
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: TrendingUp, title: "Real-Time", desc: "Sub-second data processing" },
              { icon: Globe, title: "Multi-Vertical", desc: "5 industry-specific dashboards" },
              { icon: Users, title: "Enterprise-Ready", desc: "RLS, auth, audit trails" },
            ].map((adv) => (
              <Card key={adv.title} className="bg-card/50">
                <CardContent className="p-4 text-center">
                  <adv.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium">{adv.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{adv.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="border-t border-border/50 pt-8 flex flex-wrap gap-4 justify-center">
          <Link to="/summary">
            <Button variant="outline" className="gap-2">
              Technical Details
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/vc-summary">
            <Button variant="outline" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Investment Thesis
            </Button>
          </Link>
          <Link to="/strata">
            <Button className="gap-2">
              <Cloud className="w-4 h-4" />
              Live Demo
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-6 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs text-muted-foreground">
            LAVANDAR © 2026 · Enterprise Weather Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ExecutiveSummary;
