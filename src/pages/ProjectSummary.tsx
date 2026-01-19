import { Link } from "react-router-dom";
import { 
  Cloud, Database, Zap, Shield, Music, Plane, Ship, Building2, 
  Calendar, Users, Code, Brain, Eye, Lock, ExternalLink, Terminal,
  Layers, Globe, Cpu, Server, Key
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ProjectSummary = () => {
  const publicRoutes = [
    { path: "/", label: "Home", desc: "LAVANDAR enterprise landing" },
    { path: "/launch", label: "Launch", desc: "Model benchmarking & enterprise" },
    { path: "/thermal-slash", label: "Thermal Slash", desc: "DJ KREMBO × KAZUMA 551" },
    { path: "/thermal-visualizer", label: "Visualizer", desc: "Real-time audio analysis" },
    { path: "/ai", label: "AI Showcase", desc: "Multi-model AI capabilities" },
    { path: "/beena", label: "Red Team", desc: "Document security analysis" },
    { path: "/strata", label: "Strata", desc: "Weather intelligence hub" },
    { path: "/marine", label: "Marine", desc: "NOAA coastal forecasts" },
    { path: "/aviation", label: "Aviation", desc: "Flight weather ops" },
    { path: "/dj-table", label: "DJ Table", desc: "Product configurator" },
    { path: "/apex-1", label: "APEX-1", desc: "Premium allocation" },
    { path: "/careers", label: "Careers", desc: "Talent recruitment" },
    { path: "/linkedin-ceo", label: "CEO Profile", desc: "Enterprise philosophy" },
    { path: "/vc-summary", label: "VC Summary", desc: "Investment thesis" },
    { path: "/sitemap", label: "Sitemap", desc: "Full navigation" },
  ];

  const protectedRoutes = [
    { path: "/coordinator", label: "Coordinator", desc: "Multi-industry ops" },
    { path: "/odoo", label: "Odoo Portal", desc: "ERP XML-RPC sync" },
    { path: "/startup-visa", label: "Visa Tracker", desc: "Application workflow" },
    { path: "/screenshots", label: "Screenshot Tools", desc: "OCR & AI chat" },
    { path: "/lavender-agent", label: "Sourcing Agent", desc: "AI product sourcing" },
    { path: "/admin", label: "Admin", desc: "Dashboard & analytics" },
  ];

  const techStack = [
    { icon: Code, label: "React 18.3", desc: "TypeScript + Vite" },
    { icon: Layers, label: "Tailwind CSS", desc: "Semantic design tokens" },
    { icon: Database, label: "Lovable Cloud", desc: "Supabase backend" },
    { icon: Server, label: "Edge Functions", desc: "Deno serverless" },
    { icon: Brain, label: "Multi-Model AI", desc: "Gemini + GPT gateway" },
    { icon: Zap, label: "Framer Motion", desc: "60fps animations" },
  ];

  const integrations = [
    { icon: Cloud, label: "NOAA Marine", desc: "Real-time coastal forecasts" },
    { icon: Music, label: "ElevenLabs", desc: "AI audio generation" },
    { icon: Key, label: "Stripe", desc: "Payment processing" },
    { icon: Globe, label: "Firecrawl", desc: "Web scraping" },
    { icon: Cpu, label: "Resend", desc: "Transactional email" },
  ];

  const databases = [
    "weather_coordinate_logs", "configuration_orders", "investor_contacts",
    "sourced_products", "visa_applications", "scheduled_emails", "user_roles"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">LAVANDAR</h1>
              <p className="text-xs text-muted-foreground">Project Summary</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="font-mono text-xs">v2.0</Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Production</Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-12">
        {/* Project Overview */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Project Overview</h2>
            <p className="text-muted-foreground max-w-3xl">
              LAVANDAR is an enterprise-grade weather intelligence and secure allocation platform, 
              featuring real-time psychoacoustic visualization, multi-model AI integration, and 
              industry-specific operational dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card/50 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-primary" />
                  Weather Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real-time NOAA integration with predictive analytics for marine, aviation, 
                  and construction operations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Music className="w-5 h-5 text-primary" />
                  Thermal Resonance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Psychoacoustic audio visualization with AI-generated ambient layers 
                  via ElevenLabs integration.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Secure Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Application-to-purchase protocol with buyer verification, 
                  serialized inventory, and Stripe payments.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technical Summary */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Technical Architecture</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Core Stack</CardTitle>
                <CardDescription>Frontend & infrastructure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {techStack.map((tech) => (
                  <div key={tech.label} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <tech.icon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{tech.label}</p>
                      <p className="text-xs text-muted-foreground">{tech.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">External Integrations</CardTitle>
                <CardDescription>APIs & services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {integrations.map((int) => (
                  <div key={int.label} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <int.icon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{int.label}</p>
                      <p className="text-xs text-muted-foreground">{int.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Database Schema */}
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Tables
              </CardTitle>
              <CardDescription>Lovable Cloud PostgreSQL schema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {databases.map((table) => (
                  <Badge key={table} variant="outline" className="font-mono text-xs">
                    {table}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Edge Functions */}
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Edge Functions
              </CardTitle>
              <CardDescription>Serverless Deno runtime</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
                {[
                  "ai-harmony", "beena-analysis", "chrono-music", "elevenlabs-sfx",
                  "firecrawl-scrape", "game-predictions", "get-weather", "kraft-harmony",
                  "lavender-pipeline", "noaa-marine", "odoo-sync", "thermal-magic"
                ].map((fn) => (
                  <div key={fn} className="p-2 rounded bg-muted/30 text-muted-foreground">
                    {fn}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Test Links */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Test Links</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Public Routes */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-500" />
                  Public Routes
                </CardTitle>
                <CardDescription>No authentication required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {publicRoutes.map((route) => (
                  <Link
                    key={route.path}
                    to={route.path}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">
                        {route.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{route.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                        {route.path}
                      </code>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Protected Routes */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-500" />
                  Protected Routes
                </CardTitle>
                <CardDescription>Authentication required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {protectedRoutes.map((route) => (
                  <Link
                    key={route.path}
                    to={route.path}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">
                        {route.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{route.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                        {route.path}
                      </code>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                  </Link>
                ))}

                <div className="pt-4 border-t border-border/50">
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      Sign In to Access
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="flex flex-wrap gap-4 pt-6 border-t border-border/50">
          <Link to="/thermal-slash">
            <Button className="gap-2">
              <Music className="w-4 h-4" />
              DJ KREMBO Portal
            </Button>
          </Link>
          <Link to="/strata">
            <Button variant="outline" className="gap-2">
              <Cloud className="w-4 h-4" />
              Weather Intelligence
            </Button>
          </Link>
          <Link to="/ai">
            <Button variant="outline" className="gap-2">
              <Brain className="w-4 h-4" />
              AI Showcase
            </Button>
          </Link>
          <Link to="/sitemap">
            <Button variant="ghost" className="gap-2">
              <Eye className="w-4 h-4" />
              Full Sitemap
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default ProjectSummary;
