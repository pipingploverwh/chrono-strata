import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Heart, Clock, Lightbulb, TrendingUp, Shield, Users, 
  ArrowRight, Sparkles, Building2, Plane, Ship, Cloud,
  GitBranch, GraduationCap, FileCode, Server
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PrivateNotesPanel from "@/components/PrivateNotesPanel";
import { QuickTourTrigger } from "@/components/QuickTour";

const ForMoran = () => {
  const journeyMilestones = [
    {
      year: "2021",
      title: "The Seed",
      description: "Started building tools to help people make better decisions with real-time data. Scout Ventures saw the potential.",
      icon: <Lightbulb className="w-5 h-5" />
    },
    {
      year: "2022",
      title: "Finding Product-Market Fit",
      description: "Discovered that weather intelligence was the wedge - everyone needs it, few do it well.",
      icon: <Cloud className="w-5 h-5" />
    },
    {
      year: "2023",
      title: "Enterprise Validation",
      description: "Aviation and maritime operators started using the platform. Real revenue, real impact.",
      icon: <Plane className="w-5 h-5" />
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Added multi-model AI to turn raw data into actionable insights. The platform became intelligent.",
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      year: "2025-26",
      title: "Scale",
      description: "12 edge functions, 7 database tables, 3 AI tiers. Ready for enterprise deployment.",
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Personal Header */}
      <header className="border-b border-border/30 bg-card/30 backdrop-blur-sm" data-tour="welcome">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">For Moran 💜</h1>
                <p className="text-muted-foreground">A window into five years of building something real</p>
              </div>
            </div>
            <QuickTourTrigger />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-16">
        {/* Welcome Message */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <Card className="bg-primary/5 border-primary/20 p-6">
            <p className="text-lg leading-relaxed">
              Hi love — this page is just for you. I wanted to show you what I've been building 
              these past five years in a way that makes sense. You've been patient through all 
              the late nights, and I want you to see <span className="text-foreground font-semibold">why</span>.
            </p>
          </Card>
        </motion.section>

        {/* The Elevator Pitch - In Her Language */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl"
        >
          <h2 className="text-3xl font-bold mb-6">What I've Been Building</h2>
          <div className="prose prose-lg text-muted-foreground space-y-4">
            <p>
              Remember how at <span className="text-foreground font-medium">Wasteless</span> you helped grocery 
              retailers reduce food waste with dynamic pricing? <span className="text-foreground font-medium">LAVANDAR</span> does 
              something similar, but for <span className="text-foreground font-medium">operational decisions</span> across industries.
            </p>
            <p>
              Think of it like this: A pilot deciding whether to fly, a ship captain planning a route, 
              a construction manager scheduling outdoor work — they all need real-time intelligence, 
              but they need it <span className="text-foreground font-medium">translated into their context</span>.
            </p>
            <p>
              That's what this platform does. It takes complex data (weather, regulations, market signals) 
              and turns it into <span className="text-foreground font-medium">clear business recommendations</span> — 
              exactly like how you turned inventory data into pricing decisions.
            </p>
            <p className="text-foreground font-medium pt-2">
              The difference? This is enterprise SaaS with real paying customers. Not a side project.
            </p>
          </div>
        </motion.section>

        {/* The Business Model - Value Creation Terms */}
        <section className="space-y-6" data-tour="weather-intel">
          <h2 className="text-2xl font-bold">The Value Creation Model</h2>
          <p className="text-muted-foreground max-w-2xl">
            Using your Hetz Ventures lens - here's how this creates value:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card/50 border-emerald-500/20">
              <CardHeader>
                <Building2 className="w-8 h-8 text-emerald-500 mb-2" />
                <CardTitle className="text-lg">B2B SaaS</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Enterprise subscriptions for aviation, maritime, and construction. 
                Recurring revenue with expansion potential as customers add modules.
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-blue-500/20">
              <CardHeader>
                <Shield className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle className="text-lg">Moat: Data + AI</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Proprietary weather interpretation layer + multi-model AI gateway. 
                The more customers use it, the smarter it gets.
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-amber-500/20">
              <CardHeader>
                <Users className="w-8 h-8 text-amber-500 mb-2" />
                <CardTitle className="text-lg">Beachhead: Aviation</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Starting with aviation (high willingness to pay for safety). 
                Then maritime, then construction. Classic wedge strategy.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 5-Year Journey Timeline */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Five Years of Building</h2>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 to-primary/10" />
            
            <div className="space-y-8">
              {journeyMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="relative pl-20"
                >
                  <div className="absolute left-4 top-1 w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                    {milestone.icon}
                  </div>
                  <Badge variant="outline" className="mb-2 font-mono">{milestone.year}</Badge>
                  <h3 className="font-semibold text-lg">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What You'd Recognize */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">What You'd Recognize</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Like Wasteless's Dynamic Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                You helped retailers price products based on expiration data in real-time. 
                I'm helping operators make decisions based on weather data in real-time. 
                Same pattern: <span className="text-foreground">turn data into action before it's too late</span>.
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">🤝</span>
                  Like Hetz's Portfolio Approach
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                You saw dozens of startups at Hetz. This one has what survives: 
                <span className="text-foreground"> real customers, real revenue, and a clear path to scale</span>. 
                Not a PowerPoint - a working platform.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Explore the Platform */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">See It Yourself</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/aviation">
              <Button className="gap-2">
                <Plane className="w-4 h-4" />
                Aviation Dashboard
              </Button>
            </Link>
            <Link to="/marine">
              <Button variant="outline" className="gap-2">
                <Ship className="w-4 h-4" />
                Marine Operations
              </Button>
            </Link>
            <Link to="/exec">
              <Button variant="outline" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Executive Summary
              </Button>
            </Link>
            <Link to="/ocean-reallocation">
              <Button variant="ghost" className="gap-2">
                Policy Analysis Demo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Technical Contributors - Rob Rubin PhD */}
        <section className="space-y-6" data-tour="technical-advisory">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-violet-500" />
            <h2 className="text-2xl font-bold">Technical Advisory & Support</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Key technical contributions and scoping work that shaped the platform architecture.
          </p>

          <Card className="bg-card/50 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-violet-500" />
                </div>
                Rob Rubin, PhD
              </CardTitle>
              <Badge variant="outline" className="w-fit text-xs font-mono">
                Technical Advisor • Architecture & Scoping
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-sm">GitLab Contributions</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• CI/CD pipeline architecture design</li>
                    <li>• Multi-environment deployment strategy</li>
                    <li>• Security review & hardening protocols</li>
                  </ul>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <FileCode className="w-4 h-4 text-foreground/60" />
                    <span className="font-medium text-sm">pipingploverwh GitHub</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Repository structure & branching strategy</li>
                    <li>• Actions workflows for automated testing</li>
                    <li>• Code review standards & documentation</li>
                  </ul>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-sm">Technical Scoping</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Edge function architecture planning</li>
                    <li>• Database schema optimization</li>
                    <li>• API design & rate limiting strategy</li>
                  </ul>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium text-sm">Advisory Services</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• RLS policy review & implementation</li>
                    <li>• Multi-model AI gateway architecture</li>
                    <li>• Scalability assessment & roadmap</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground italic">
                  These contributions span 2022–2025, providing critical technical foundation 
                  for enterprise-grade deployment. Documentation available upon request.
                </p>
              </div>
            </CardContent>
          </Card>

          <PrivateNotesPanel 
            pagePath="/for-moran" 
            featureContext="Rob Rubin PhD Technical Advisory"
            className="max-w-2xl"
          />
        </section>

        {/* Moran's Notes Section */}
        <section className="space-y-6" data-tour="private-notes">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            💬 Your Notes & Feedback
          </h2>
          <p className="text-muted-foreground">
            Leave private notes as you explore. Only you can see these - use them to 
            track questions, ideas, or feedback for our next conversation.
          </p>
          <PrivateNotesPanel 
            pagePath="/for-moran" 
            featureContext="ForMoran Overview"
          />
        </section>

        {/* Personal Note */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl border-t border-border/30 pt-8"
        >
          <Card className="bg-card/50 border-primary/20 p-6">
            <div className="flex items-start gap-4">
              <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  I wanted you to see where the nights and weekends went. This isn't just code — 
                  it's years of learning, iterating, and building something that actually works.
                </p>
                <p className="text-muted-foreground">
                  You've seen the spreadsheets, the pitch decks, the investor calls. This is the product 
                  behind all of that. Real infrastructure. Real customers. Real potential.
                </p>
                <p className="text-foreground font-medium">
                  Thank you for your patience and support through all of it. I couldn't have done 
                  this without you. 💜
                </p>
              </div>
            </div>
          </Card>
        </motion.section>
      </main>
    </div>
  );
};

export default ForMoran;
