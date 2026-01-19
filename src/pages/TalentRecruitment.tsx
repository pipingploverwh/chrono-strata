import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Code2, TrendingUp, Sparkles, ArrowRight, CheckCircle2, 
  Briefcase, Globe, Zap, Users, Building2, Rocket, 
  Terminal, BarChart3, Shield, Coffee, Laptop, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import lavandarLogo from "@/assets/lavandar-logo.png";

const OPEN_ROLES = [
  {
    id: 1,
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    salary: "$180k - $240k",
    icon: Code2,
    tags: ["React", "TypeScript", "Supabase", "Edge Functions"],
    description: "Build enterprise AI infrastructure powering next-gen operational platforms.",
    urgent: true,
  },
  {
    id: 2,
    title: "ML Infrastructure Engineer",
    department: "Engineering",
    location: "Remote (Global)",
    type: "Full-time",
    salary: "$200k - $280k",
    icon: Terminal,
    tags: ["Python", "MLOps", "Kubernetes", "LLM"],
    description: "Scale our AI model gateway serving millions of inference requests.",
    urgent: true,
  },
  {
    id: 3,
    title: "Enterprise Sales Director",
    department: "Sales",
    location: "New York, NY",
    type: "Full-time",
    salary: "$150k + Commission",
    icon: TrendingUp,
    tags: ["Enterprise", "SaaS", "AI/ML", "Fortune 500"],
    description: "Close 7-figure deals with enterprise clients across defense, finance, and logistics.",
    urgent: false,
  },
  {
    id: 4,
    title: "Solutions Architect",
    department: "Sales",
    location: "Remote (US)",
    type: "Full-time",
    salary: "$170k - $220k",
    icon: Building2,
    tags: ["Technical Sales", "Cloud", "Integration", "AI"],
    description: "Design and present technical solutions for complex enterprise requirements.",
    urgent: false,
  },
  {
    id: 5,
    title: "Developer Relations Lead",
    department: "Engineering",
    location: "Remote (Global)",
    type: "Full-time",
    salary: "$160k - $200k",
    icon: Users,
    tags: ["DevRel", "Content", "Community", "APIs"],
    description: "Build and nurture our developer community and technical content strategy.",
    urgent: false,
  },
];

const BENEFITS = [
  { icon: Globe, title: "Remote-First", desc: "Work from anywhere in the world" },
  { icon: Laptop, title: "Top Equipment", desc: "Latest MacBook Pro + $2k setup budget" },
  { icon: Coffee, title: "Unlimited PTO", desc: "Take the time you need to recharge" },
  { icon: BarChart3, title: "Equity Package", desc: "Meaningful ownership in our growth" },
  { icon: Shield, title: "Premium Health", desc: "100% covered medical, dental, vision" },
  { icon: Rocket, title: "Learning Budget", desc: "$5k/year for courses and conferences" },
];

const TECH_STACK = [
  "React", "TypeScript", "Supabase", "Deno", "Tailwind", 
  "Framer Motion", "OpenAI", "Gemini", "Vercel", "PostgreSQL"
];

const TalentRecruitment = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    email: "",
    linkedin: "",
    role: "",
    message: "",
  });

  const filteredRoles = selectedDepartment === "all" 
    ? OPEN_ROLES 
    : OPEN_ROLES.filter(r => r.department.toLowerCase() === selectedDepartment);

  const handleApply = (roleTitle: string) => {
    setApplicationForm(prev => ({ ...prev, role: roleTitle }));
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const submitApplication = () => {
    if (!applicationForm.name || !applicationForm.email) {
      toast.error("Please fill in your name and email");
      return;
    }
    toast.success("Application submitted! We'll be in touch within 48 hours.");
    setApplicationForm({ name: "", email: "", linkedin: "", role: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/launch" className="flex items-center gap-3">
            <img src={lavandarLogo} alt="LAVANDAR" className="h-8 w-auto" />
            <span className="text-foreground font-semibold tracking-wide">LAVANDAR</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/linkedin-company" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              About Us
            </Link>
            <Link to="/linkedin-ceo" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Leadership
            </Link>
            <Button 
              onClick={() => document.getElementById('open-roles')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-strata-lume hover:bg-strata-lume/90 text-strata-black"
            >
              View Open Roles
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-strata-lume/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-strata-lume/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-lavender/10 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-strata-lume/20 text-strata-lume border-strata-lume/30 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            We're Hiring — Join the AI Revolution
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Build the Future of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-strata-lume to-strata-lume/60">
              Enterprise AI
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Join LAVANDAR and help enterprises harness AI at scale. We're looking for 
            exceptional engineers and sales professionals who want to shape the industry.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button 
              size="lg"
              onClick={() => document.getElementById('open-roles')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-strata-lume hover:bg-strata-lume/90 text-strata-black px-8"
            >
              Explore Opportunities
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-accent"
              asChild
            >
              <Link to="/portfolio">See Our Work</Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: "7", label: "AI Models" },
              { value: "$2M+", label: "Raised" },
              { value: "50+", label: "Enterprise Clients" },
              { value: "100%", label: "Remote Culture" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 px-6 border-y border-border/50 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-muted-foreground text-sm mr-4">Our Stack:</span>
            {TECH_STACK.map((tech) => (
              <Badge 
                key={tech}
                variant="outline" 
                className="border-border text-muted-foreground hover:border-strata-lume/50 hover:text-strata-lume transition-colors"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why LAVANDAR?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We believe in empowering our team with the best tools, flexibility, and support to do their best work.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {BENEFITS.map((benefit, i) => (
              <Card key={i} className="bg-card/50 border-border hover:border-strata-lume/30 transition-colors">
                <CardContent className="p-6">
                  <benefit.icon className="w-10 h-10 text-strata-lume mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles Section */}
      <section id="open-roles" className="py-20 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Open Positions</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Find your next role at the intersection of AI and enterprise software.
            </p>
            
            {/* Department Filter */}
            <div className="flex justify-center gap-3">
              {["all", "engineering", "sales"].map((dept) => (
                <Button
                  key={dept}
                  variant={selectedDepartment === dept ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDepartment(dept)}
                  className={selectedDepartment === dept 
                    ? "bg-strata-lume hover:bg-strata-lume/90 text-strata-black" 
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                  }
                >
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredRoles.map((role) => (
              <Card 
                key={role.id} 
                className="bg-card/80 border-border hover:border-strata-lume/30 transition-all group"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-strata-lume/10 flex items-center justify-center">
                        <role.icon className="w-6 h-6 text-strata-lume" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-strata-lume transition-colors">
                            {role.title}
                          </h3>
                          {role.urgent && (
                            <Badge className="bg-strata-orange/20 text-strata-orange border-strata-orange/30 text-xs">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">{role.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {role.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {role.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {role.salary}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex flex-wrap gap-2 justify-end">
                        {role.tags.map((tag) => (
                          <Badge 
                            key={tag}
                            variant="outline" 
                            className="border-border text-muted-foreground text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        onClick={() => handleApply(role.title)}
                        className="bg-strata-lume hover:bg-strata-lume/90 text-strata-black"
                      >
                        Apply Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/80 border-border">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Apply Now</h2>
                <p className="text-muted-foreground text-sm">
                  We review every application within 48 hours.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Full Name *</Label>
                    <Input
                      value={applicationForm.name}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Smith"
                      className="bg-accent border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Email *</Label>
                    <Input
                      type="email"
                      value={applicationForm.email}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                      className="bg-accent border-border text-foreground"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">LinkedIn Profile</Label>
                    <Input
                      value={applicationForm.linkedin}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="linkedin.com/in/..."
                      className="bg-accent border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Position of Interest</Label>
                    <Input
                      value={applicationForm.role}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="Senior Full-Stack Engineer"
                      className="bg-accent border-border text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Why LAVANDAR?</Label>
                  <Textarea
                    value={applicationForm.message}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us about yourself and why you'd be a great fit..."
                    className="bg-accent border-border text-foreground min-h-[120px]"
                  />
                </div>

                <Button 
                  onClick={submitApplication}
                  className="w-full bg-strata-lume hover:bg-strata-lume/90 text-strata-black py-6"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Submit Application
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  By submitting, you agree to our privacy policy. We'll keep your information secure.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Don't see the right role?
          </h2>
          <p className="text-muted-foreground mb-6">
            We're always looking for exceptional talent. Send us your resume and we'll reach out when a matching position opens.
          </p>
          <Button 
            variant="outline"
            className="border-border text-foreground hover:bg-accent"
            asChild
          >
            <a href="mailto:careers@lavandar.ai">Contact Careers Team</a>
          </Button>
        </div>
      </section>

      {/* Attribution */}
      <footer className="py-6 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 LAVANDAR AI. All rights reserved.</span>
          <span className="font-mono uppercase tracking-wider">Built in Woods Hole</span>
        </div>
      </footer>
    </div>
  );
};

export default TalentRecruitment;
